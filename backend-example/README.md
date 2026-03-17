# Backend Example Setup Instructions

## Overview
This directory contains a complete backend implementation example for the Cross Sync authentication system with automatic role detection.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher) installed and running
- npm or yarn package manager

## Quick Start

### 1. Install MongoDB

**On Windows:**
```powershell
# Download from https://www.mongodb.com/try/download/community
# Or use Chocolatey
choco install mongodb

# Start MongoDB service
net start MongoDB
```

**On macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**On Linux:**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### 2. Setup Backend

```bash
# Navigate to backend directory
cd backend-example

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your configuration
# At minimum, update JWT_SECRET with a secure random string
```

### 3. Generate JWT Secret

```bash
# Run this command to generate a secure JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Copy the output and paste it as JWT_SECRET in your .env file
```

### 4. Start the Server

```bash
# Development mode with auto-restart
npm run dev

# Or production mode
npm start
```

The server will:
- Connect to MongoDB
- Seed demo users automatically (in development mode)
- Start listening on port 3000 (or PORT from .env)

### 5. Test the API

**Health Check:**
```bash
curl http://localhost:3000/health
```

**Login (Sales Head):**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "orgId": "P2SCSJ91BR52L8U",
    "email": "vikram.singh@company.com",
    "password": "vp123",
    "securityToken": "VP2026TOKEN"
  }'
```

**Login (Sales Manager):**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "orgId": "P2SCSJ91BR52L8U",
    "email": "rajesh.kumar@company.com",
    "password": "manager123",
    "securityToken": "MGR2026TOKEN"
  }'
```

**Login (Sales Rep):**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "orgId": "P2SCSJ91BR52L8U",
    "email": "rahul.sharma@company.com",
    "password": "sales123",
    "securityToken": "REP2026TOKEN"
  }'
```

**Validate Token:**
```bash
# Replace <TOKEN> with the token from login response
curl -X POST http://localhost:3000/api/auth/validate \
  -H "Authorization: Bearer <TOKEN>"
```

## Frontend Integration

### Update Frontend to Call Backend API

1. **Create API service file** (`src/services/api.js`):

```javascript
const API_BASE_URL = 'http://localhost:3000/api';

export const authAPI = {
  login: async (orgId, email, password, securityToken) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ orgId, email, password, securityToken })
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message);
    }

    return result.data;
  },

  validate: async (token) => {
    const response = await fetch(`${API_BASE_URL}/auth/validate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message);
    }

    return result.data;
  },

  logout: async (token) => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.json();
  }
};
```

2. **Update AuthContext.jsx**:

```javascript
import { authAPI } from '../services/api';

const login = async (orgId, email, password, securityToken) => {
  try {
    const { user, tenantId, token } = await authAPI.login(
      orgId, 
      email, 
      password, 
      securityToken
    );

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

3. **Update Login.jsx to handle async login**:

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  try {
    const validOrgIds = ['P2SCSJ91BR52L8U', '3DNYQNWGZEGT6PD'];
    if (!orgId || !validOrgIds.includes(orgId)) {
      setError('Invalid Organization ID');
      return;
    }

    const loggedInUser = await login(orgId, email, password, securityToken);
    
    if (loggedInUser) {
      const route = getDefaultRoute();
      navigate(route);
    }
  } catch (error) {
    setError(error.message || 'Login failed. Please check your credentials.');
  } finally {
    setIsLoading(false);
  }
};
```

## Project Structure

```
backend-example/
├── server.js           # Main server entry point
├── auth.js             # Authentication routes and logic
├── package.json        # Dependencies and scripts
├── .env.example        # Environment variables template
├── .env                # Your environment variables (create this)
├── README.md           # This file
└── models/             # (Optional) Separate model files
    ├── User.js
    ├── Tenant.js
    └── LoginAttempt.js
```

## Available Scripts

- `npm start` - Start the server in production mode
- `npm run dev` - Start the server with auto-restart (nodemon)
- `npm run seed` - Manually seed demo users
- `npm test` - Run tests (when implemented)

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/health` | Health check | No |
| POST | `/api/auth/login` | User login | No |
| POST | `/api/auth/validate` | Validate token | Yes |
| POST | `/api/auth/logout` | User logout | Yes |
| POST | `/api/auth/refresh` | Refresh token | Yes |
| GET | `/api/user/profile` | Get user profile | Yes |

## Demo Credentials

All demo users use Organization ID: **P2SCSJ91BR52L8U**

| Role | Email | Password | Security Token |
|------|-------|----------|----------------|
| Sales Head | vikram.singh@company.com | vp123 | VP2026TOKEN |
| Sales Manager | rajesh.kumar@company.com | manager123 | MGR2026TOKEN |
| Sales Rep | rahul.sharma@company.com | sales123 | REP2026TOKEN |

## Security Features

- ✅ Password hashing with bcrypt (12 salt rounds)
- ✅ Security token hashing with SHA-256
- ✅ JWT token authentication
- ✅ Rate limiting (5 attempts per 15 minutes)
- ✅ Account lockout after 5 failed attempts
- ✅ Login attempt logging
- ✅ CORS protection
- ✅ Security headers with Helmet
- ✅ Input validation

## Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongosh

# Or check service status
# Windows:
net start MongoDB

# macOS:
brew services list

# Linux:
sudo systemctl status mongodb
```

### Port Already in Use
```bash
# Change PORT in .env file
# Or kill the process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:3000 | xargs kill
```

### Demo Users Not Seeding
```bash
# Manually run seed script
npm run seed

# Or check MongoDB
mongosh
use sales-app
db.users.find()
```

## Production Deployment

Before deploying to production:

1. ✅ Set `NODE_ENV=production`
2. ✅ Use strong JWT_SECRET (64+ character random string)
3. ✅ Enable HTTPS
4. ✅ Configure proper CORS origins
5. ✅ Use Redis for token blacklist
6. ✅ Set up proper logging (Winston, Morgan)
7. ✅ Use environment-specific database
8. ✅ Enable monitoring (New Relic, DataDog)
9. ✅ Set up SSL/TLS for MongoDB connection
10. ✅ Implement refresh token mechanism

## Next Steps

1. Implement refresh token mechanism
2. Add email verification
3. Implement password reset flow
4. Add multi-factor authentication (MFA)
5. Set up Redis for token blacklist
6. Implement comprehensive testing
7. Add API documentation with Swagger
8. Set up CI/CD pipeline

## Support

For issues or questions:
- Check the main `BACKEND_API_DOCUMENTATION.md`
- Review error logs in the console
- Verify environment variables in `.env`
- Ensure MongoDB is running
- Check network/firewall settings

## License

MIT