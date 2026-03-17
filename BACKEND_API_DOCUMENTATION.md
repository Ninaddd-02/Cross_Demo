# Backend API Documentation - Authentication with Role-Based Access Control

## Overview
This document describes the backend API requirements for the refactored login flow that implements automatic role detection and role-based routing using PostgreSQL as the database.

## Authentication Flow

### 1. Login Endpoint

**Endpoint:** `POST /api/auth/login`

**Description:** Authenticates a user using Organization ID, Email, Password, and Security Token, and returns user details including their role.

#### Request Headers
```json
{
  "Content-Type": "application/json"
}
```

#### Request Body
```json
{
  "orgId": "string",          // Required: Organization/Tenant ID
  "email": "string",          // Required: User email address
  "password": "string",       // Required: User password
  "securityToken": "string"   // Required: Security token for additional authentication
}
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "string",        // One of: "sales-head", "sales-manager", "sales-rep"
      "title": "string",
      "avatar": "string",
      "region": "string",      // For managers and reps
      "regions": ["string"],   // For sales heads
      "manager": "string",     // For sales reps
      "managerId": "number",   // For managers and reps
      "repId": "number",       // For sales reps
      "teamSize": "number",    // For managers
      "teamMembers": ["string"] // For managers
    },
    "tenantId": "string",
    "token": "string",         // JWT token for session management
    "expiresIn": 3600          // Token expiry in seconds
  },
  "message": "Login successful"
}
```

#### Error Responses

**400 Bad Request** - Invalid input
```json
{
  "success": false,
  "error": "INVALID_INPUT",
  "message": "Missing required fields: orgId, email, password, or securityToken"
}
```

**401 Unauthorized** - Invalid credentials
```json
{
  "success": false,
  "error": "INVALID_CREDENTIALS",
  "message": "Invalid Organization ID, email, password, or security token"
}
```

**403 Forbidden** - Account locked or disabled
```json
{
  "success": false,
  "error": "ACCOUNT_LOCKED",
  "message": "This account has been locked due to multiple failed login attempts"
}
```

**500 Internal Server Error** - Server error
```json
{
  "success": false,
  "error": "INTERNAL_ERROR",
  "message": "An error occurred during authentication"
}
```

### 2. Token Validation Endpoint

**Endpoint:** `POST /api/auth/validate`

**Description:** Validates an existing JWT token and returns user information.

#### Request Headers
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <jwt_token>"
}
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "user": {
      // Same user object as login response
    },
    "tenantId": "string"
  }
}
```

#### Error Response (401 Unauthorized)
```json
{
  "success": false,
  "error": "INVALID_TOKEN",
  "message": "Token is invalid or expired"
}
```

### 3. Logout Endpoint

**Endpoint:** `POST /api/auth/logout`

**Description:** Invalidates the current session token.

#### Request Headers
```json
{
  "Authorization": "Bearer <jwt_token>"
}
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Logout successful"
}
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  security_token_hash VARCHAR(255) NOT NULL,
  role ENUM('sales-head', 'sales-manager', 'sales-rep') NOT NULL,
  title VARCHAR(255),
  avatar VARCHAR(255),
  region VARCHAR(100),
  manager_id INT,
  rep_id INT,
  team_size INT,
  is_active BOOLEAN DEFAULT true,
  failed_login_attempts INT DEFAULT 0,
  locked_until TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);
```

### Tenant/Organization Table
```sql
CREATE TABLE tenants (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### User-Tenant Mapping Table
```sql
CREATE TABLE user_tenants (
  user_id VARCHAR(50),
  tenant_id VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, tenant_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);
```

## Implementation Guidelines

### 1. Password Security
- **Hash passwords** using bcrypt or argon2 with appropriate salt rounds (minimum 12)
- **Never store plain-text passwords** in the database
- Implement password complexity requirements (minimum 8 characters, mix of uppercase, lowercase, numbers)

### 2. Security Token
- Security tokens should be **hashed before storage** using SHA-256 or similar
- Tokens should be **generated securely** with sufficient entropy
- Consider **time-based token expiration** for enhanced security

### 3. Rate Limiting
- Implement rate limiting on the login endpoint (e.g., 5 attempts per 15 minutes per IP)
- Track failed login attempts per user account
- **Lock accounts** after 5 consecutive failed attempts for 30 minutes

### 4. JWT Token Management
- Use **RS256 or ES256** algorithm for JWT signing (not HS256)
- Include necessary claims: userId, role, tenantId, exp, iat
- Set appropriate expiration time (e.g., 1 hour for access token)
- Consider implementing **refresh tokens** for better UX

### 5. Role-Based Access Control (RBAC)
- Store role in JWT claims for quick access
- Implement middleware to verify role permissions on protected routes
- Maintain role hierarchy: sales-head > sales-manager > sales-rep

### 6. Validation Rules
- **Organization ID**: Must be valid and active in the tenants table
- **Email**: Must be a valid email format and exist in users table
- **Password**: Must match the hashed password in the database
- **Security Token**: Must match the hashed token in the database
- **User-Tenant Relationship**: User must be associated with the provided tenant

### 7. Logging and Auditing
- Log all login attempts (successful and failed) with timestamp, IP, and user agent
- Track role-based access patterns for security analysis
- Implement audit trail for sensitive operations

## Example Implementation (Node.js/Express + PostgreSQL)

```javascript
// Login Controller
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

exports.login = async (req, res) => {
  try {
    const { orgId, email, password, securityToken } = req.body;

    // Validate input
    if (!orgId || !email || !password || !securityToken) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_INPUT',
        message: 'Missing required fields'
      });
    }

    // Check if tenant exists
    const tenantResult = await pool.query(
      'SELECT * FROM tenants WHERE id = $1 AND is_active = true',
      [orgId]
    );
    if (tenantResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'INVALID_CREDENTIALS',
        message: 'Invalid Organization ID'
      });
    }

    // Find user by email
    const userResult = await pool.query(
      'SELECT * FROM users WHERE LOWER(email) = LOWER($1) AND is_active = true',
      [email]
    );
    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'INVALID_CREDENTIALS',
        message: 'Invalid credentials'
      });
    }

    const user = userResult.rows[0];

    // Check if account is locked
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      return res.status(403).json({
        success: false,
        error: 'ACCOUNT_LOCKED',
        message: 'Account is temporarily locked'
      });
    }

    // Verify user-tenant relationship
    const userTenantResult = await pool.query(
      'SELECT * FROM user_tenants WHERE user_id = $1 AND tenant_id = $2 AND is_active = true',
      [user.id, orgId]
    );
    if (userTenantResult.rows.length === 0) {
      await incrementFailedAttempts(user.id);
      return res.status(401).json({
        success: false,
        error: 'INVALID_CREDENTIALS',
        message: 'Invalid credentials'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      await incrementFailedAttempts(user.id);
      return res.status(401).json({
        success: false,
        error: 'INVALID_CREDENTIALS',
        message: 'Invalid credentials'
      });
    }

    // Verify security token
    const tokenHash = crypto.createHash('sha256').update(securityToken).digest('hex');
    if (tokenHash !== user.security_token_hash) {
      await incrementFailedAttempts(user.id);
      return res.status(401).json({
        success: false,
        error: 'INVALID_CREDENTIALS',
        message: 'Invalid credentials'
      });
    }

    // Reset failed login attempts on successful login
    await pool.query(
      'UPDATE users SET failed_login_attempts = 0, locked_until = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        tenantId: orgId
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h', algorithm: 'RS256' }
    );

    // Log successful login
    await logLoginAttempt(user.id, req.ip, true);

    // Return user data and token
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          title: user.title,
          avatar: user.avatar,
          region: user.region,
          // Include additional fields based on role
        },
        tenantId: orgId,
        token: token,
        expiresIn: 3600
      },
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'An error occurred during authentication'
    });
  }
};

// Helper function to increment failed attempts
async function incrementFailedAttempts(userId) {
  const attempts = await pool.query(
    'SELECT failed_login_attempts FROM users WHERE id = $1',
    [userId]
  );
  
  const newAttempts = (attempts.rows[0]?.failed_login_attempts || 0) + 1;
  
  // Lock account after 5 failed attempts
  if (newAttempts >= 5) {
    const lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    await pool.query(
      'UPDATE users SET failed_login_attempts = $1, locked_until = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
      [newAttempts, lockUntil, userId]
    );
  } else {
    await pool.query(
      'UPDATE users SET failed_login_attempts = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [newAttempts, userId]
    );
  }
  
  await logLoginAttempt(userId, null, false);
}
```

## Frontend Integration

### Update AuthContext to call backend API

```javascript
const login = async (orgId, email, password, securityToken) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        orgId,
        email,
        password,
        securityToken
      })
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Login failed');
    }

    const { user, tenantId, token } = result.data;

    // Store user info and token
    setCurrentUser(user);
    setTenantId(tenantId);
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('tenantId', tenantId);
    localStorage.setItem('authToken', token);

    return user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};
```

## Security Checklist

- [ ] Passwords are hashed using bcrypt/argon2
- [ ] Security tokens are hashed before storage
- [ ] JWT tokens use RS256/ES256 algorithm
- [ ] Rate limiting is implemented on login endpoint
- [ ] Failed login attempts are tracked and accounts locked after threshold
- [ ] All authentication events are logged
- [ ] HTTPS is enforced for all API calls
- [ ] CORS is properly configured
- [ ] Input validation is implemented
- [ ] SQL injection protection is in place
- [ ] XSS protection headers are set
- [ ] Session tokens expire appropriately
- [ ] Refresh token mechanism is implemented (optional but recommended)

## Testing Demo Credentials

### Sales Head
- **Org ID**: P2SCSJ91BR52L8U
- **Email**: vikram.singh@company.com
- **Password**: vp123
- **Security Token**: VP2026TOKEN
- **Expected Role**: sales-head
- **Expected Redirect**: /sales-head/dashboard

### Sales Manager
- **Org ID**: P2SCSJ91BR52L8U
- **Email**: rajesh.kumar@company.com
- **Password**: manager123
- **Security Token**: MGR2026TOKEN
- **Expected Role**: sales-manager
- **Expected Redirect**: /sales-manager/dashboard

### Sales Representative
- **Org ID**: P2SCSJ91BR52L8U
- **Email**: rahul.sharma@company.com
- **Password**: sales123
- **Security Token**: REP2026TOKEN
- **Expected Role**: sales-rep
- **Expected Redirect**: /sales/accounts

## API Testing with cURL

```bash
# Test login endpoint
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "orgId": "P2SCSJ91BR52L8U",
    "email": "vikram.singh@company.com",
    "password": "vp123",
    "securityToken": "VP2026TOKEN"
  }'

# Test token validation
curl -X POST http://localhost:3000/api/auth/validate \
  -H "Authorization: Bearer <your_jwt_token>"

# Test logout
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer <your_jwt_token>"
```

## Next Steps

1. **Implement the backend API** following this documentation
2. **Set up database** with the provided schema
3. **Configure environment variables** for JWT secrets and database connections
4. **Implement middleware** for role-based route protection
5. **Update frontend** to call the backend API instead of using mock data
6. **Add error handling** and user feedback for various error scenarios
7. **Implement refresh token** mechanism for better user experience
8. **Add comprehensive logging** for security auditing
9. **Set up monitoring** for failed login attempts and security events
10. **Conduct security audit** and penetration testing

## Additional Resources

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [RBAC Implementation Guide](https://auth0.com/docs/manage-users/access-control/rbac)
