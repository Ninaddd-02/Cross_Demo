import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, allUsers } from '../../context/AuthContext';
import { Users, TrendingUp, Award, Mail, Lock, Eye, EyeOff, Shield, Building2 } from 'lucide-react';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, getDefaultRoute } = useAuth();
  const [orgId, setOrgId] = useState('P2SCSJ91BR52L8U');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securityToken, setSecurityToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showSecurityToken, setShowSecurityToken] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validate Org ID
    const validOrgIds = ['P2SCSJ91BR52L8U', '3DNYQNWGZEGT6PD'];
    if (!orgId || !validOrgIds.includes(orgId)) {
      setError('Invalid Organization ID. Please enter P2SCSJ91BR52L8U or 3DNYQNWGZEGT6PD');
      return;
    }

    // Find user by email, password, and security token
    const user = allUsers.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.password === password &&
      u.securityToken === securityToken
    );

    if (user) {
      // Role is automatically determined from the user object
      const loggedInUser = login(user.id, orgId);
      if (loggedInUser) {
        // Automatically redirect based on detected role
        const route = getDefaultRoute();
        navigate(route);
      }
    } else {
      setError('Invalid credentials. Please check your Organization ID, Email, Password, and Security Token.');
    }
  };

  // Handle demo user selection from dropdown
  const handleDemoUserChange = (e) => {
    const userEmail = e.target.value;
    
    if (!userEmail) {
      // Clear form if no user selected
      setOrgId('P2SCSJ91BR52L8U');
      setEmail('');
      setPassword('');
      setSecurityToken('');
      return;
    }
    
    const user = allUsers.find(u => u.email === userEmail);
    if (user) {
      setOrgId('P2SCSJ91BR52L8U');
      setEmail(user.email);
      setPassword(user.password);
      setSecurityToken(user.securityToken);
      setError('');
    }
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="grid-pattern"></div>
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="login-container">
        <div className="login-card glass-effect">
          {/* Left Side - Branding */}
          <div className="login-branding">
            <div className="branding-content">
              <div className="login-icon">
                <img src="/salesforce_demo.png" alt="Salesforce" className="logo-image" />
              </div>
              <h1 className="branding-title">Cross Sync</h1>
              <p className="branding-subtitle">Sales Intelligence Platform</p>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="login-form-section">
            <div className="form-header">
              <h2>Welcome Back</h2>
              <p className="login-description">Enter your credentials to continue</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="org-id-input">
                <Building2 size={16} />
                Organization ID
              </label>
              <input
                id="org-id-input"
                type="text"
                className="form-input"
                placeholder="Enter Org ID (e.g., P2SCSJ91BR52L8U)"
                value={orgId}
                onChange={(e) => setOrgId(e.target.value)}
                autoComplete="off"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email-input">
                <Mail size={16} />
                Email
              </label>
              <input
                id="email-input"
                type="email"
                className="form-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password-input">
                <Lock size={16} />
                Password
              </label>
              <div className="password-input-wrapper">
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={0}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="security-token-input">
                <Shield size={16} />
                Security Token
              </label>
              <div className="password-input-wrapper">
                <input
                  id="security-token-input"
                  type={showSecurityToken ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter your security token"
                  value={securityToken}
                  onChange={(e) => setSecurityToken(e.target.value)}
                  autoComplete="off"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowSecurityToken(!showSecurityToken)}
                  aria-label={showSecurityToken ? 'Hide security token' : 'Show security token'}
                  tabIndex={0}
                >
                  {showSecurityToken ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="error-message" role="alert">
                {error}
              </div>
            )}

            <button type="submit" className="login-button">
              Sign In
            </button>
          </form>

          {/* Demo Credentials Dropdown */}
          <div className="demo-selector-section">
            <label className="demo-section-label" htmlFor="demo-user-select">
              Demo Credentials
            </label>
            <select
              id="demo-user-select"
              className="form-select demo-select"
              onChange={handleDemoUserChange}
              defaultValue=""
            >
              <option value="">-- Select a demo user --</option>
              <option value="vikram.singh@company.com">👤 Sales Head - Vikram Singh</option>
              <option value="rajesh.kumar@company.com">👥 Sales Manager - Rajesh Kumar</option>
              <option value="rahul.sharma@company.com">📈 Sales Rep - Rahul Sharma</option>
            </select>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
