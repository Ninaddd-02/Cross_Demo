import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './TopNavbar.css';

const TopNavbar = ({ title = '', subtitle = '' }) => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="top-navbar">
      <div className="navbar-left">
        <h2 className="navbar-title">{title}</h2>
        {subtitle && <p className="navbar-subtitle">{subtitle}</p>}
      </div>
      
      <div className="navbar-right">
        <button className="icon-button">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>
        
        <div 
          className="user-profile" 
          onClick={() => setShowUserMenu(!showUserMenu)}
          ref={userMenuRef}
        >
          <div className="user-avatar">
            {currentUser?.avatar || <User size={18} />}
          </div>
          <div className="user-details">
            <span className="user-name">{currentUser?.name || 'User'}</span>
            <span className="user-role">{currentUser?.title || ''}</span>
          </div>
          <ChevronDown size={16} className={`user-chevron ${showUserMenu ? 'open' : ''}`} />
          
          {showUserMenu && (
            <div className="user-menu">
              <div className="menu-header">
                <div className="menu-user-info">
                  <div className="menu-user-name">{currentUser?.name}</div>
                  <div className="menu-user-email">{currentUser?.email}</div>
                  {currentUser?.region && (
                    <div className="menu-user-region">{currentUser.region} Region</div>
                  )}
                </div>
              </div>
              <div className="menu-divider"></div>
              <button className="menu-item logout-item" onClick={handleLogout}>
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
