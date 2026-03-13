import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, allUsers } from '../../context/AuthContext';
import { Users, TrendingUp, Award, Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, getDefaultRoute } = useAuth();
  const [selectedRole, setSelectedRole] = useState('sales-head');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securityToken, setSecurityToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showSecurityToken, setShowSecurityToken] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Find user by email, password, and security token
    const user = allUsers.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.password === password &&
      u.securityToken === securityToken
    );

    if (user) {
      const loggedInUser = login(user.id);
      if (loggedInUser) {
        const route = getDefaultRoute();
        navigate(route);
      }
    } else {
      setError('Invalid email, password, or security token');
    }
  };

  // Get demo credentials based on selected role
  const getDemoCredentials = () => {
    switch(selectedRole) {
      case 'sales-head':
        return { email: 'vikram.singh@company.com', password: 'vp123', securityToken: 'VP2026TOKEN' };
      case 'sales-manager':
        return { email: 'rajesh.kumar@company.com', password: 'manager123', securityToken: 'MGR2026TOKEN' };
      case 'sales-rep':
        return { email: 'rahul.sharma@company.com', password: 'sales123', securityToken: 'REP2026TOKEN' };
      default:
        return { email: '', password: '', securityToken: '' };
    }
  };

  const fillDemoCredentials = () => {
    const credentials = getDemoCredentials();
    setEmail(credentials.email);
    setPassword(credentials.password);
    setSecurityToken(credentials.securityToken);
    setError('');
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
          <div className="login-header">
            <div className="login-icon">
              <img src="/salesforce_demo.png" alt="Salesforce" className="logo-image" />
            </div>
            <h1 className="text-gradient">Cross Sync</h1>
            <p className="login-subtitle">AI-Powered Automotive Industry Sales Intelligence</p>
            <p className="login-description">Select your profile to continue</p>
          </div>

          <div className="role-tabs">
            <button 
              className={`role-tab ${selectedRole === 'sales-head' ? 'active' : ''}`}
              onClick={() => {
                setSelectedRole('sales-head');
                setError('');
              }}
            >
              <Award size={20} />
              <span>Sales Head</span>
            </button>
            <button 
              className={`role-tab ${selectedRole === 'sales-manager' ? 'active' : ''}`}
              onClick={() => {
                setSelectedRole('sales-manager');
                setError('');
              }}
            >
              <Users size={20} />
              <span>Managers</span>
            </button>
            <button 
              className={`role-tab ${selectedRole === 'sales-rep' ? 'active' : ''}`}
              onClick={() => {
                setSelectedRole('sales-rep');
                setError('');
              }}
            >
              <TrendingUp size={20} />
              <span>Sales Reps</span>
            </button>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
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

            <button 
              type="button" 
              className="demo-button"
              onClick={fillDemoCredentials}
            >
              Use Demo Credentials
            </button>
          </form>

          <div className="login-info">
            <div className="info-section">
              <h4>Demo Credentials</h4>
              {selectedRole === 'sales-head' && (
                <div className="credential-info">
                  <p><strong>Role:</strong> VP Of Sales</p>
                  <p><strong>Email:</strong> vikram.singh@company.com</p>
                  <p><strong>Password:</strong> vp123</p>
                  <p><strong>Security Token:</strong> VP2026TOKEN</p>
                </div>
              )}
              {selectedRole === 'sales-manager' && (
                <div className="credential-info">
                  <p><strong>Role:</strong> Manager</p>
                  <p><strong>Available managers:</strong></p>
                  <ul className="credentials-list">
                    <li>rajesh.kumar@company.com (North & South) - manager123 - MGR2026TOKEN</li>
                    <li>priya.sharma@company.com (East & West) - manager123 - MGR2026TOKEN</li>
                  </ul>
                  <p className="token-note"><strong>Security Token:</strong> MGR2026TOKEN (same for all managers)</p>
                </div>
              )}
              {selectedRole === 'sales-rep' && (
                <div className="credential-info">
                  <p><strong>Role:</strong> Sales Rep</p>
                  <p><strong>Available reps:</strong></p>
                  <ul className="credentials-list">
                    <li>rahul.sharma@company.com (North - Manager: Rajesh Kumar) - sales123 - REP2026TOKEN</li>
                    <li>priya.mehta@company.com (South - Manager: Rajesh Kumar) - sales123 - REP2026TOKEN</li>
                    <li>amit.kumar@company.com (East - Manager: Priya Sharma) - sales123 - REP2026TOKEN</li>
                    <li>neha.singh@company.com (West - Manager: Priya Sharma) - sales123 - REP2026TOKEN</li>
                  </ul>
                  <p className="token-note"><strong>Security Token:</strong> REP2026TOKEN (same for all reps)</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
