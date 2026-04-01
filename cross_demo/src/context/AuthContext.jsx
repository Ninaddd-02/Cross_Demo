import React, { createContext, useContext, useState, useEffect } from 'react';
import { logger } from '../utils/logger';
import * as sessionManager from '../utils/sessionManager';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// All users in the system
export const allUsers = [
  // Sales Head
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
  
  // Sales Manager
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
  
  // Sales Representative
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
    avatar: '👤',
    industry: 'Automotive OEM'
  }
];

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [tenantId, setTenantId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user and tenant from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const storedTenantId = localStorage.getItem('tenantId');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
        setTenantId(storedTenantId);
        // Re-attach session timeout for restored sessions
        sessionManager.start({
          onExpire: () => {
            logger.info('Session expired due to inactivity');
            setCurrentUser(null);
            setTenantId(null);
            localStorage.removeItem('currentUser');
            localStorage.removeItem('tenantId');
            sessionManager.stop();
          },
        });
      } catch (error) {
        logger.error('Error loading user from localStorage:', error);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('tenantId');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userId, orgId) => {
    const user = allUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      setTenantId(orgId);
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('tenantId', orgId);

      // Start session timeout — auto-logout after 30 minutes of inactivity
      sessionManager.start({
        onExpire: () => {
          logger.info('Session expired due to inactivity');
          logout();
        },
      });

      return user;
    }
    return null;
  };

  const logout = () => {
    sessionManager.stop();
    setCurrentUser(null);
    setTenantId(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('tenantId');
  };

  const getTenantId = () => {
    return tenantId || localStorage.getItem('tenantId');
  };

  const isAuthenticated = () => {
    return currentUser !== null;
  };

  const hasRole = (role) => {
    return currentUser?.role === role;
  };

  const canAccessRegion = (region) => {
    if (!currentUser) return false;
    
    // Sales Head can access all regions
    if (currentUser.role === 'sales-head') return true;
    
    // Users with "All Regions" can access any region
    if (currentUser.region === 'All Regions') return true;
    
    // Otherwise, can only access their own specific region
    return currentUser.region === region;
  };

  const canAccessManager = (managerName) => {
    if (!currentUser) return false;
    
    // Sales Head can access all managers
    if (currentUser.role === 'sales-head') return true;
    
    // Manager can access their own data
    if (currentUser.role === 'sales-manager' && currentUser.name === managerName) return true;
    
    return false;
  };

  const canAccessRep = (repName) => {
    if (!currentUser) return false;
    
    // Sales Head can access all reps
    if (currentUser.role === 'sales-head') return true;
    
    // Sales Manager can access reps in their team
    const rep = allUsers.find(u => u.name === repName && u.role === 'sales-rep');
    if (currentUser.role === 'sales-manager' && rep?.manager === currentUser.name) return true;
    
    // Sales Rep can only access their own data
    if (currentUser.role === 'sales-rep' && currentUser.name === repName) return true;
    
    return false;
  };

  const getDefaultRoute = () => {
    if (!currentUser) return '/login';
    
    switch (currentUser.role) {
      case 'sales-head':
        return '/sales-head/dashboard';
      case 'sales-manager':
        return '/sales-manager/dashboard';
      case 'sales-rep':
        return '/sales/dashboard';
      default:
        return '/login';
    }
  };

  // Get team members for a manager
  const getTeamMembers = (managerId) => {
    return allUsers.filter(user => 
      user.role === 'sales-rep' && user.managerId === managerId
    );
  };

  // Get accessible reps based on current user role
  const getAccessibleReps = () => {
    if (!currentUser) return [];
    
    // Sales Head can see all reps
    if (currentUser.role === 'sales-head') {
      return allUsers.filter(u => u.role === 'sales-rep');
    }
    
    // Sales Manager can see only their team members
    if (currentUser.role === 'sales-manager') {
      return allUsers.filter(u => 
        u.role === 'sales-rep' && u.managerId === currentUser.managerId
      );
    }
    
    // Sales Rep can see only themselves
    if (currentUser.role === 'sales-rep') {
      return [currentUser];
    }
    
    return [];
  };

  // Get accessible managers based on current user role
  const getAccessibleManagers = () => {
    if (!currentUser) return [];
    
    // Sales Head can see all managers
    if (currentUser.role === 'sales-head') {
      return allUsers.filter(u => u.role === 'sales-manager');
    }
    
    // Sales Manager can see only themselves
    if (currentUser.role === 'sales-manager') {
      return [currentUser];
    }
    
    // Sales Rep can see their manager
    if (currentUser.role === 'sales-rep') {
      return allUsers.filter(u => 
        u.role === 'sales-manager' && u.managerId === currentUser.managerId
      );
    }
    
    return [];
  };

  // Filter data by repId based on access control
  const filterDataByAccess = (data, repIdField = 'repId') => {
    if (!currentUser || !data) return [];
    
    // Sales Head can see all data
    if (currentUser.role === 'sales-head') {
      return data;
    }
    
    // Sales Manager can see only their team's data
    if (currentUser.role === 'sales-manager') {
      const teamRepIds = getAccessibleReps().map(rep => rep.repId);
      return data.filter(item => teamRepIds.includes(item[repIdField]));
    }
    
    // Sales Rep can see only their own data
    if (currentUser.role === 'sales-rep') {
      return data.filter(item => item[repIdField] === currentUser.repId);
    }
    
    return [];
  };

  // Check if current user can access data of a specific rep
  const canAccessRepData = (repId) => {
    if (!currentUser) return false;
    
    // Sales Head can access all
    if (currentUser.role === 'sales-head') return true;
    
    // Sales Manager can access their team members
    if (currentUser.role === 'sales-manager') {
      const teamRepIds = getAccessibleReps().map(rep => rep.repId);
      return teamRepIds.includes(repId);
    }
    
    // Sales Rep can access only their own data
    if (currentUser.role === 'sales-rep') {
      return currentUser.repId === repId;
    }
    
    return false;
  };

  const value = {
    currentUser,
    tenantId,
    login,
    logout,
    isAuthenticated,
    hasRole,
    canAccessRegion,
    canAccessManager,
    canAccessRep,
    getDefaultRoute,
    getTenantId,
    isLoading,
    allUsers,
    getTeamMembers,
    getAccessibleReps,
    getAccessibleManagers,
    filterDataByAccess,
    canAccessRepData
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
