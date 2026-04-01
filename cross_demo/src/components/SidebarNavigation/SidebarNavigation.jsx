import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Activity,
  Users,
  LogOut,
  Menu,
  X,
  Calendar,
  Eye,
  FileText,
  Sparkles,
  BarChart3
} from 'lucide-react';
import './SidebarNavigation.css';

const SidebarNavigation = ({ role }) => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  // Use role from props first, fallback to currentUser role, then default to sales-rep
  const activeRole = role || currentUser?.role || 'sales-rep';

  // Close sidebar when route changes (on mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const salesNavItems = [
    { path: '/sales/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/sales/accounts', icon: <Users size={20} />, label: 'Accounts' },
    { path: '/sales/my-plan', icon: <Calendar size={20} />, label: 'My Plan' },
    { path: '/sales/recommendations', icon: <Activity size={20} />, label: 'Recommendations' },
  ];

  const salesHeadNavItems = [
    { path: '/sales-head/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/sales-head/analytics', icon: <BarChart3 size={20} />, label: 'Analytics' },
    { path: '/sales-head/accounts', icon: <Users size={20} />, label: 'All Accounts' },
    { path: '/sales-head/team-recommendations', icon: <Eye size={20} />, label: 'Team Recommendations' },
    { path: '/sales-head/organization-plan', icon: <FileText size={20} />, label: 'Organization Plan' },
    { path: '/sales-head/all-recommendations', icon: <Sparkles size={20} />, label: 'All Recommendations' },
  ];

  const salesManagerNavItems = [
    { path: '/sales-manager/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/sales-manager/accounts', icon: <Users size={20} />, label: 'All Accounts' },
    { path: '/sales-manager/team-plan', icon: <Calendar size={20} />, label: 'Team Plan' },
    { path: '/sales-manager/team-activity', icon: <Activity size={20} />, label: 'Team Activity' },
    { path: '/sales-manager/team-recommendations', icon: <Eye size={20} />, label: 'Team Recommendations' },
  ];

  // Map role to nav items (support both 'sales' and 'sales-rep' for sales representatives)
  const getNavItems = () => {
    if (activeRole === 'sales-head') return salesHeadNavItems;
    if (activeRole === 'sales-manager') return salesManagerNavItems;
    if (activeRole === 'sales' || activeRole === 'sales-rep') return salesNavItems;
    return salesNavItems; // fallback to sales rep
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Toggle Button */}
      <button 
        className="sidebar-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle sidebar"
      >
        <Menu size={24} />
      </button>

      {/* Backdrop Overlay */}
      {isOpen && (
        <div 
          className="sidebar-backdrop"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar-navigation ${isOpen ? 'sidebar-open' : ''}`}>
        {/* Close button (mobile) */}
        <button 
          className="sidebar-close-btn"
          onClick={() => setIsOpen(false)}
          aria-label="Close sidebar"
        >
          <X size={24} />
        </button>

        <div className="sidebar-header">
          <div className="logo-container">
          <div className="logo-icon">
            <img src="/salesforce_demo.png" alt="Salesforce" className="sidebar-logo-image" />
          </div>
          <div className="logo-text">
            <h1 className="text-gradient">Cross Sync</h1>
            <p className="logo-subtitle">AI Recommendation Engine</p>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'nav-item-active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <Link to="/login" className="nav-item">
          <span className="nav-icon"><LogOut size={20} /></span>
          <span className="nav-label">Logout</span>
        </Link>
      </div>
      </div>
    </>
  );
};

export default SidebarNavigation;
