// Backend Authentication API Implementation Example
// Node.js + Express + MongoDB/PostgreSQL
// This is a complete example implementation of the authentication endpoints

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const router = express.Router();

// ============================================
// Configuration
// ============================================

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here'; // Use environment variable
const JWT_EXPIRES_IN = '1h';
const SALT_ROUNDS = 12;
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION = 30 * 60 * 1000; // 30 minutes

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
// Database Models (Mongoose/Sequelize Examples)
// ============================================

// For MongoDB (Mongoose)
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  securityTokenHash: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['sales-head', 'sales-manager', 'sales-rep'], 
    required: true 
  },
  title: String,
  avatar: String,
  region: String,
  regions: [String],
  manager: String,
  managerId: Number,
  repId: Number,
  teamSize: Number,
  teamMembers: [String],
  isActive: { type: Boolean, default: true },
  failedLoginAttempts: { type: Number, default: 0 },
  lockedUntil: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);

const tenantSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Tenant = mongoose.model('Tenant', tenantSchema);

const userTenantSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  tenantId: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

userTenantSchema.index({ userId: 1, tenantId: 1 }, { unique: true });

const UserTenant = mongoose.model('UserTenant', userTenantSchema);

const loginAttemptSchema = new mongoose.Schema({
  userId: String,
  email: String,
  ipAddress: String,
  userAgent: String,
  success: Boolean,
  errorMessage: String,
  timestamp: { type: Date, default: Date.now }
});

loginAttemptSchema.index({ userId: 1, timestamp: -1 });
loginAttemptSchema.index({ email: 1, timestamp: -1 });

const LoginAttempt = mongoose.model('LoginAttempt', loginAttemptSchema);

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
    await LoginAttempt.create({
      userId,
      email,
      ipAddress,
      userAgent,
      success,
      errorMessage
    });
  } catch (error) {
    console.error('Error logging login attempt:', error);
  }
}

/**
 * Increment failed login attempts and lock account if necessary
 */
async function incrementFailedAttempts(user) {
  user.failedLoginAttempts += 1;
  
  // Lock account after max failed attempts
  if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
    user.lockedUntil = new Date(Date.now() + LOCK_DURATION);
  }
  
  user.updatedAt = new Date();
  await user.save();
}

/**
 * Reset failed login attempts
 */
async function resetFailedAttempts(user) {
  user.failedLoginAttempts = 0;
  user.lockedUntil = null;
  user.updatedAt = new Date();
  await user.save();
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
    managerId: user.managerId,
    repId: user.repId,
    teamSize: user.teamSize,
    teamMembers: user.teamMembers
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
    const tenant = await Tenant.findOne({ id: orgId, isActive: true });
    if (!tenant) {
      await logLoginAttempt(null, email, ipAddress, userAgent, false, 'Invalid organization ID');
      return res.status(401).json({
        success: false,
        error: 'INVALID_CREDENTIALS',
        message: 'Invalid credentials. Please check your Organization ID, Email, Password, and Security Token.'
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase(), isActive: true });
    if (!user) {
      await logLoginAttempt(null, email, ipAddress, userAgent, false, 'User not found');
      return res.status(401).json({
        success: false,
        error: 'INVALID_CREDENTIALS',
        message: 'Invalid credentials. Please check your Organization ID, Email, Password, and Security Token.'
      });
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const minutesRemaining = Math.ceil((user.lockedUntil - new Date()) / 60000);
      await logLoginAttempt(user.id, email, ipAddress, userAgent, false, 'Account locked');
      return res.status(403).json({
        success: false,
        error: 'ACCOUNT_LOCKED',
        message: `Account is temporarily locked. Please try again in ${minutesRemaining} minutes.`
      });
    }

    // Verify user-tenant relationship
    const userTenant = await UserTenant.findOne({
      userId: user.id,
      tenantId: orgId,
      isActive: true
    });

    if (!userTenant) {
      await incrementFailedAttempts(user);
      await logLoginAttempt(user.id, email, ipAddress, userAgent, false, 'User not associated with tenant');
      return res.status(401).json({
        success: false,
        error: 'INVALID_CREDENTIALS',
        message: 'Invalid credentials. Please check your Organization ID, Email, Password, and Security Token.'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      await incrementFailedAttempts(user);
      await logLoginAttempt(user.id, email, ipAddress, userAgent, false, 'Invalid password');
      return res.status(401).json({
        success: false,
        error: 'INVALID_CREDENTIALS',
        message: 'Invalid credentials. Please check your Organization ID, Email, Password, and Security Token.'
      });
    }

    // Verify security token
    const tokenHash = hashSecurityToken(securityToken);
    if (tokenHash !== user.securityTokenHash) {
      await incrementFailedAttempts(user);
      await logLoginAttempt(user.id, email, ipAddress, userAgent, false, 'Invalid security token');
      return res.status(401).json({
        success: false,
        error: 'INVALID_CREDENTIALS',
        message: 'Invalid credentials. Please check your Organization ID, Email, Password, and Security Token.'
      });
    }

    // Reset failed login attempts on successful login
    await resetFailedAttempts(user);

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
    const user = await User.findOne({ id: req.user.userId, isActive: true });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'USER_NOT_FOUND',
        message: 'User not found or inactive'
      });
    }

    res.json({
      success: true,
      data: {
        user: formatUserResponse(user),
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
    const user = await User.findOne({ id: req.user.userId, isActive: true });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'USER_NOT_FOUND',
        message: 'User not found or inactive'
      });
    }

    // Generate new token
    const newToken = generateToken(user, req.user.tenantId);

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
    const user = await User.findOne({ id: req.user.userId, isActive: true });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'USER_NOT_FOUND',
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: formatUserResponse(user)
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
async function seedDemoUsers() {
  try {
    // Create tenant
    await Tenant.findOneAndUpdate(
      { id: 'P2SCSJ91BR52L8U' },
      {
        id: 'P2SCSJ91BR52L8U',
        name: 'Demo Organization',
        isActive: true
      },
      { upsert: true, new: true }
    );

    // Demo users
    const demoUsers = [
      {
        id: 'head-1',
        name: 'Vikram Singh',
        email: 'vikram.singh@company.com',
        password: 'vp123',
        securityToken: 'VP2026TOKEN',
        role: 'sales-head',
        title: 'VP of Sales',
        avatar: '👤',
        regions: ['North', 'South', 'East', 'West']
      },
      {
        id: 'manager-1',
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@company.com',
        password: 'manager123',
        securityToken: 'MGR2026TOKEN',
        role: 'sales-manager',
        title: 'Sales Manager - All Regions',
        region: 'All Regions',
        managerId: 1,
        teamSize: 1,
        teamMembers: ['rep-1'],
        avatar: '👤'
      },
      {
        id: 'rep-1',
        name: 'Rahul Sharma',
        email: 'rahul.sharma@company.com',
        password: 'sales123',
        securityToken: 'REP2026TOKEN',
        role: 'sales-rep',
        title: 'Sales Representative - All Regions',
        region: 'All Regions',
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
      await User.findOneAndUpdate(
        { id: userData.id },
        {
          ...userData,
          passwordHash,
          securityTokenHash,
          isActive: true,
          failedLoginAttempts: 0
        },
        { upsert: true, new: true }
      );

      // Create user-tenant relationship
      await UserTenant.findOneAndUpdate(
        { userId: userData.id, tenantId: 'P2SCSJ91BR52L8U' },
        {
          userId: userData.id,
          tenantId: 'P2SCSJ91BR52L8U',
          isActive: true
        },
        { upsert: true, new: true }
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
  seedDemoUsers
};

// ============================================
// Usage Example in main server file (server.js)
// ============================================

/*
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { router: authRouter, seedDemoUsers } = require('./auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sales-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  // Seed demo users on first run
  seedDemoUsers();
})
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
*/