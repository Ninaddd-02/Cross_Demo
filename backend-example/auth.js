// Backend Authentication API Implementation Example
// Node.js + Express + PostgreSQL
// This is a complete example implementation of the authentication endpoints

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg');
const router = express.Router();

// ============================================
// Configuration
// ============================================

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here'; // Use environment variable
const JWT_EXPIRES_IN = '1h';
const SALT_ROUNDS = 12;
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION = 30 * 60 * 1000; // 30 minutes

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// ============================================
// Rate Limiting Middleware
// ============================================

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: {
    success: false,
    error: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many login attempts. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// ============================================
// Database Schema Creation
// ============================================

async function createTables(db) {
  const client = db || pool;
  
  try {
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        emp_id VARCHAR(20),
        password_hash VARCHAR(255) NOT NULL,
        security_token_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('sales-head', 'sales-manager', 'sales-rep')),
        title VARCHAR(255),
        avatar VARCHAR(255),
        region VARCHAR(100),
        regions TEXT[],
        manager VARCHAR(255),
        manager_id INTEGER,
        rep_id INTEGER,
        team_size INTEGER,
        team_members TEXT[],
        is_active BOOLEAN DEFAULT true,
        failed_login_attempts INTEGER DEFAULT 0,
        locked_until TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
    `);

    // Create tenants table
    await client.query(`
      CREATE TABLE IF NOT EXISTS tenants (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create user_tenants junction table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_tenants (
        user_id VARCHAR(50) REFERENCES users(id),
        tenant_id VARCHAR(50) REFERENCES tenants(id),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, tenant_id)
      );
    `);

    // Create login_attempts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS login_attempts (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(50),
        email VARCHAR(255),
        ip_address VARCHAR(45),
        user_agent TEXT,
        success BOOLEAN,
        error_message TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_login_attempts_user_id ON login_attempts(user_id, timestamp DESC);
      CREATE INDEX IF NOT EXISTS idx_login_attempts_email ON login_attempts(email, timestamp DESC);
    `);

    console.log('✅ Database tables created/verified');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  }
}

// ============================================
// Helper Functions
// ============================================

/**
 * Hash a security token using SHA-256
 */
function hashSecurityToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Log a login attempt
 */
async function logLoginAttempt(userId, email, ipAddress, userAgent, success, errorMessage = null) {
  try {
    await pool.query(
      `INSERT INTO login_attempts (user_id, email, ip_address, user_agent, success, error_message)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, email, ipAddress, userAgent, success, errorMessage]
    );
  } catch (error) {
    console.error('Error logging login attempt:', error);
  }
}

/**
 * Increment failed login attempts and lock account if necessary
 */
async function incrementFailedAttempts(userId) {
  const attempts = await pool.query(
    'SELECT failed_login_attempts FROM users WHERE id = $1',
    [userId]
  );
  
  const newAttempts = (attempts.rows[0]?.failed_login_attempts || 0) + 1;
  
  if (newAttempts >= MAX_FAILED_ATTEMPTS) {
    const lockUntil = new Date(Date.now() + LOCK_DURATION);
    await pool.query(
      `UPDATE users 
       SET failed_login_attempts = $1, locked_until = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3`,
      [newAttempts, lockUntil, userId]
    );
  } else {
    await pool.query(
      `UPDATE users 
       SET failed_login_attempts = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [newAttempts, userId]
    );
  }
}

/**
 * Reset failed login attempts
 */
async function resetFailedAttempts(userId) {
  await pool.query(
    `UPDATE users 
     SET failed_login_attempts = 0, locked_until = NULL, updated_at = CURRENT_TIMESTAMP
     WHERE id = $1`,
    [userId]
  );
}

/**
 * Generate JWT token
 */
function generateToken(user, tenantId) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
      tenantId: tenantId
    },
    JWT_SECRET,
    { 
      expiresIn: JWT_EXPIRES_IN,
      algorithm: 'HS256' // Use RS256 in production with public/private keys
    }
  );
}

/**
 * Format user object for response
 */
function formatUserResponse(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    title: user.title,
    avatar: user.avatar,
    region: user.region,
    regions: user.regions,
    manager: user.manager,
    managerId: user.manager_id,
    repId: user.rep_id,
    teamSize: user.team_size,
    teamMembers: user.team_members
  };
}

// ============================================
// Authentication Middleware
// ============================================

/**
 * Verify JWT token middleware
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Access token required'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        error: 'INVALID_TOKEN',
        message: 'Token is invalid or expired'
      });
    }

    req.user = decoded;
    next();
  });
}

/**
 * Role-based authorization middleware
 */
function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'User not authenticated'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'FORBIDDEN',
        message: 'You do not have permission to access this resource'
      });
    }

    next();
  };
}

// ============================================
// Authentication Routes
// ============================================

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token
 */
router.post('/login', loginLimiter, async (req, res) => {
  const ipAddress = req.ip || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'];

  try {
    const { orgId, email, password, securityToken } = req.body;

    // Validate input
    if (!orgId || !email || !password || !securityToken) {
      await logLoginAttempt(null, email, ipAddress, userAgent, false, 'Missing required fields');
      return res.status(400).json({
        success: false,
        error: 'INVALID_INPUT',
        message: 'Missing required fields: orgId, email, password, or securityToken'
      });
    }

    // Check if tenant exists and is active
    const tenantResult = await pool.query(
      'SELECT * FROM tenants WHERE id = $1 AND is_active = true',
      [orgId]
    );
    
    if (tenantResult.rows.length === 0) {
      await logLoginAttempt(null, email, ipAddress, userAgent, false, 'Invalid organization ID');
      return res.status(401).json({
        success: false,
        error: 'INVALID_CREDENTIALS',
        message: 'Invalid credentials. Please check your Organization ID, Email, Password, and Security Token.'
      });
    }

    // Find user by email
    const userResult = await pool.query(
      'SELECT * FROM users WHERE LOWER(email) = LOWER($1) AND is_active = true',
      [email]
    );
    
    if (userResult.rows.length === 0) {
      await logLoginAttempt(null, email, ipAddress, userAgent, false, 'User not found');
      return res.status(401).json({
        success: false,
        error: 'INVALID_CREDENTIALS',
        message: 'Invalid credentials. Please check your Organization ID, Email, Password, and Security Token.'
      });
    }

    const user = userResult.rows[0];

    // Check if account is locked
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      const minutesRemaining = Math.ceil((new Date(user.locked_until) - new Date()) / 60000);
      await logLoginAttempt(user.id, email, ipAddress, userAgent, false, 'Account locked');
      return res.status(403).json({
        success: false,
        error: 'ACCOUNT_LOCKED',
        message: `Account is temporarily locked. Please try again in ${minutesRemaining} minutes.`
      });
    }

    // Verify user-tenant relationship
    const userTenantResult = await pool.query(
      'SELECT * FROM user_tenants WHERE user_id = $1 AND tenant_id = $2 AND is_active = true',
      [user.id, orgId]
    );

    if (userTenantResult.rows.length === 0) {
      await incrementFailedAttempts(user.id);
      await logLoginAttempt(user.id, email, ipAddress, userAgent, false, 'User not associated with tenant');
      return res.status(401).json({
        success: false,
        error: 'INVALID_CREDENTIALS',
        message: 'Invalid credentials. Please check your Organization ID, Email, Password, and Security Token.'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      await incrementFailedAttempts(user.id);
      await logLoginAttempt(user.id, email, ipAddress, userAgent, false, 'Invalid password');
      return res.status(401).json({
        success: false,
        error: 'INVALID_CREDENTIALS',
        message: 'Invalid credentials. Please check your Organization ID, Email, Password, and Security Token.'
      });
    }

    // Verify security token
    const tokenHash = hashSecurityToken(securityToken);
    if (tokenHash !== user.security_token_hash) {
      await incrementFailedAttempts(user.id);
      await logLoginAttempt(user.id, email, ipAddress, userAgent, false, 'Invalid security token');
      return res.status(401).json({
        success: false,
        error: 'INVALID_CREDENTIALS',
        message: 'Invalid credentials. Please check your Organization ID, Email, Password, and Security Token.'
      });
    }

    // Reset failed login attempts on successful login
    await resetFailedAttempts(user.id);

    // Generate JWT token
    const token = generateToken(user, orgId);

    // Log successful login
    await logLoginAttempt(user.id, email, ipAddress, userAgent, true);

    // Return user data and token
    res.json({
      success: true,
      data: {
        user: formatUserResponse(user),
        tenantId: orgId,
        token: token,
        expiresIn: 3600 // 1 hour in seconds
      },
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    await logLoginAttempt(null, req.body.email, ipAddress, userAgent, false, error.message);
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'An error occurred during authentication'
    });
  }
});

/**
 * POST /api/auth/validate
 * Validate JWT token and return user information
 */
router.post('/validate', authenticateToken, async (req, res) => {
  try {
    const userResult = await pool.query(
      'SELECT * FROM users WHERE id = $1 AND is_active = true',
      [req.user.userId]
    );
    
    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'USER_NOT_FOUND',
        message: 'User not found or inactive'
      });
    }

    res.json({
      success: true,
      data: {
        user: formatUserResponse(userResult.rows[0]),
        tenantId: req.user.tenantId
      }
    });

  } catch (error) {
    console.error('Token validation error:', error);
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'An error occurred during token validation'
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout user (in a production system, you might want to add token to a blacklist)
 */
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // In a production system with Redis or similar:
    // - Add token to blacklist with TTL matching token expiry
    // - Clear any refresh tokens
    
    res.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'An error occurred during logout'
    });
  }
});

/**
 * POST /api/auth/refresh
 * Refresh JWT token (implement with refresh tokens in production)
 */
router.post('/refresh', authenticateToken, async (req, res) => {
  try {
    const userResult = await pool.query(
      'SELECT * FROM users WHERE id = $1 AND is_active = true',
      [req.user.userId]
    );
    
    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'USER_NOT_FOUND',
        message: 'User not found or inactive'
      });
    }

    // Generate new token
    const newToken = generateToken(userResult.rows[0], req.user.tenantId);

    res.json({
      success: true,
      data: {
        token: newToken,
        expiresIn: 3600
      },
      message: 'Token refreshed successfully'
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'An error occurred during token refresh'
    });
  }
});

// ============================================
// Protected Routes Example
// ============================================

/**
 * GET /api/user/profile
 * Get current user profile (protected route)
 */
router.get('/user/profile', authenticateToken, async (req, res) => {
  try {
    const userResult = await pool.query(
      'SELECT * FROM users WHERE id = $1 AND is_active = true',
      [req.user.userId]
    );
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'USER_NOT_FOUND',
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: formatUserResponse(userResult.rows[0])
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'INTERNAL_ERROR',
      message: 'An error occurred while fetching profile'
    });
  }
});

/**
 * GET /api/sales-head/dashboard
 * Sales Head dashboard (role-protected route)
 */
router.get('/sales-head/dashboard', 
  authenticateToken, 
  authorizeRole('sales-head'), 
  async (req, res) => {
    // Only accessible by sales-head role
    res.json({
      success: true,
      message: 'Welcome to Sales Head Dashboard',
      data: {
        // Dashboard data here
      }
    });
  }
);

// ============================================
// Database Seeding (for testing)
// ============================================

/**
 * Seed database with demo users
 * Call this once to populate the database with test users
 */
async function seedDemoUsers(db) {
  const client = db || pool;
  
  try {
    // Create tables first
    await createTables(client);

    // Create tenant
    await client.query(
      `INSERT INTO tenants (id, name, is_active)
       VALUES ($1, $2, $3)
       ON CONFLICT (id) DO UPDATE SET name = $2, is_active = $3`,
      ['P2SCSJ91BR52L8U', 'Demo Organization', true]
    );

    // Demo users (3 users - simplified hierarchy)
    const demoUsers = [
      // Sales Head
      {
        id: 'head-1',
        name: 'Vikram Singh',
        email: 'vikram.singh@company.com',
        empId: 'EMP001',
        password: 'vp123',
        securityToken: 'VP2026TOKEN',
        role: 'sales-head',
        title: 'VP of Sales',
        avatar: '👤',
        region: 'North'
      },
      // Sales Manager
      {
        id: 'manager-1',
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@company.com',
        empId: 'EMP002',
        password: 'manager123',
        securityToken: 'MGR2026TOKEN',
        role: 'sales-manager',
        title: 'Sales Manager - North',
        region: 'North',
        managerId: 1,
        teamSize: 1,
        teamMembers: ['rep-1'],
        avatar: '👤'
      },
      // Sales Representative
      {
        id: 'rep-1',
        name: 'Rahul Sharma',
        email: 'rahul.sharma@company.com',
        empId: 'EMP003',
        password: 'rep123',
        securityToken: 'REP2026TOKEN',
        role: 'sales-rep',
        title: 'Sales Representative - North',
        region: 'North',
        manager: 'Rajesh Kumar',
        managerId: 1,
        repId: 1,
        avatar: '👤'
      }
    ];

    for (const userData of demoUsers) {
      // Hash password and security token
      const passwordHash = await bcrypt.hash(userData.password, SALT_ROUNDS);
      const securityTokenHash = hashSecurityToken(userData.securityToken);

      // Create or update user
      await client.query(
        `INSERT INTO users (
          id, name, email, emp_id, password_hash, security_token_hash, role, title, 
          avatar, region, manager, manager_id, rep_id, team_size, 
          team_members, is_active, failed_login_attempts
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        ON CONFLICT (id) DO UPDATE SET
          name = $2, email = $3, emp_id = $4, password_hash = $5, security_token_hash = $6,
          role = $7, title = $8, avatar = $9, region = $10,
          manager = $11, manager_id = $12, rep_id = $13, team_size = $14,
          team_members = $15, is_active = $16, failed_login_attempts = $17`,
        [
          userData.id, userData.name, userData.email, userData.empId, passwordHash, securityTokenHash,
          userData.role, userData.title, userData.avatar, userData.region,
          userData.manager, userData.managerId, userData.repId, userData.teamSize,
          userData.teamMembers, true, 0
        ]
      );

      // Create user-tenant relationship
      await client.query(
        `INSERT INTO user_tenants (user_id, tenant_id, is_active)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id, tenant_id) DO UPDATE SET is_active = $3`,
        [userData.id, 'P2SCSJ91BR52L8U', true]
      );
    }

    console.log('✅ Demo users seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding demo users:', error);
  }
}

// ============================================
// Export
// ============================================

module.exports = {
  router,
  authenticateToken,
  authorizeRole,
  seedDemoUsers,
  createTables
};

// ============================================
// Usage Example in main server file (server.js)
// ============================================

/*
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const { router: authRouter, seedDemoUsers } = require('./auth');

const app = express();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection and seed
pool.query('SELECT NOW()')
  .then(() => {
    console.log('✅ Connected to PostgreSQL');
    return seedDemoUsers(pool);
  })
  .catch(err => console.error('❌ PostgreSQL connection error:', err));

// Routes
app.use('/api/auth', authRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
*/
