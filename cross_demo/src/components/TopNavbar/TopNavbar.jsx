import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, LogOut, ChevronDown, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './TopNavbar.css';

const TopNavbar = ({ title = '', subtitle = '', searchQuery = '', onSearchChange, searchPlaceholder = 'Search...' }) => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);

  // Role-based notifications
  const getNotificationsByRole = () => {
    const role = currentUser?.role;

    if (role === 'sales-rep') {
      return [
        {
          id: 1,
          type: 'recommendation',
          title: 'New AI Recommendation',
          message: 'ACCELYA SOLUTIONS has a high-value cross-sell opportunity',
          time: '5 minutes ago',
          unread: true
        },
        {
          id: 2,
          type: 'alert',
          title: 'Follow-up Required',
          message: 'Your deal with TCS requires action before end of quarter',
          time: '1 hour ago',
          unread: true
        },
        {
          id: 3,
          type: 'success',
          title: 'Opportunity Closed',
          message: 'Congratulations! Infosys Cloud Migration deal won',
          time: '3 hours ago',
          unread: true
        },
        {
          id: 4,
          type: 'info',
          title: 'Weekly Performance Report',
          message: 'Your sales performance report is ready to review',
          time: '1 day ago',
          unread: false
        }
      ];
    } else if (role === 'sales-manager') {
      return [
        {
          id: 1,
          type: 'alert',
          title: 'Team Deal at Risk',
          message: 'Rahul Sharma\'s TCS deal requires your attention - 15 days to close',
          time: '10 minutes ago',
          unread: true
        },
        {
          id: 2,
          type: 'recommendation',
          title: 'Team Recommendation Alert',
          message: '5 new AI recommendations pending review by your team',
          time: '30 minutes ago',
          unread: true
        },
        {
          id: 3,
          type: 'success',
          title: 'Team Win',
          message: 'Neha Singh closed Wipro Enterprise deal - ₹2.5 Cr',
          time: '2 hours ago',
          unread: true
        },
        {
          id: 4,
          type: 'info',
          title: 'Team Performance Review',
          message: 'Monthly team performance review scheduled for tomorrow',
          time: '5 hours ago',
          unread: false
        },
        {
          id: 5,
          type: 'alert',
          title: 'Pipeline Review',
          message: 'Q2 pipeline review meeting in 2 days - prepare team metrics',
          time: '1 day ago',
          unread: false
        }
      ];
    } else if (role === 'sales-head') {
      return [
        {
          id: 1,
          type: 'success',
          title: 'Revenue Target Achieved',
          message: 'West region exceeded quarterly target by 12% - ₹45 Cr',
          time: '15 minutes ago',
          unread: true
        },
        {
          id: 2,
          type: 'alert',
          title: 'Strategic Review Required',
          message: 'North region pipeline down 8% - strategic intervention needed',
          time: '1 hour ago',
          unread: true
        },
        {
          id: 3,
          type: 'info',
          title: 'Executive Board Meeting',
          message: 'Q2 revenue review with CEO scheduled for April 5th',
          time: '3 hours ago',
          unread: true
        },
        {
          id: 4,
          type: 'recommendation',
          title: 'AI Model Performance',
          message: 'Cross-sell model accuracy improved to 89% - review insights',
          time: '6 hours ago',
          unread: false
        },
        {
          id: 5,
          type: 'success',
          title: 'Top Performer Recognition',
          message: 'Digital services generated highest revenue - ₹74.29 Cr this quarter',
          time: '1 day ago',
          unread: false
        }
      ];
    }

    // Default notifications for unknown roles
    return [
      {
        id: 1,
        type: 'info',
        title: 'Welcome',
        message: 'Welcome to the AI Sales Platform',
        time: 'Just now',
        unread: true
      }
    ];
  };

  const notifications = getNotificationsByRole();
  const unreadCount = notifications.filter(n => n.unread).length;

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    if (showUserMenu || showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu, showNotifications]);

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
        {onSearchChange && (
          <div className="navbar-search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="navbar-search-input"
            />
          </div>
        )}
        
        <div className="notification-container" ref={notificationRef}>
          <button 
            className="icon-button notification-button" 
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <h3>Notifications</h3>
                {unreadCount > 0 && (
                  <span className="unread-count">{unreadCount} new</span>
                )}
              </div>
              <div className="notification-list">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`notification-item ${notification.unread ? 'unread' : ''}`}
                  >
                    <div className={`notification-icon ${notification.type}`}>
                      {notification.type === 'recommendation' && '🎯'}
                      {notification.type === 'alert' && '⚠️'}
                      {notification.type === 'success' && '✅'}
                      {notification.type === 'info' && 'ℹ️'}
                    </div>
                    <div className="notification-content">
                      <div className="notification-title">{notification.title}</div>
                      <div className="notification-message">{notification.message}</div>
                      <div className="notification-time">{notification.time}</div>
                    </div>
                    {notification.unread && <div className="unread-dot"></div>}
                  </div>
                ))}
              </div>
              <div className="notification-footer">
                <button className="view-all-button">View All Notifications</button>
              </div>
            </div>
          )}
        </div>
        
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
