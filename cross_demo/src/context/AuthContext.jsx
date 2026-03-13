import React, { createContext, useContext, useState, useEffect } from 'react';

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
  
  // Sales Managers
  {
    id: 'manager-1',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@company.com',
    password: 'manager123',
    securityToken: 'MGR2026TOKEN',
    role: 'sales-manager',
    title: 'Sales Manager - North & South',
    region: 'North & South',
    managerId: 1,
    teamSize: 2,
    teamMembers: ['rep-1', 'rep-2'],
    avatar: '👤'
  },
  {
    id: 'manager-2',
    name: 'Priya Sharma',
    email: 'priya.sharma@company.com',
    password: 'manager123',
    securityToken: 'MGR2026TOKEN',
    role: 'sales-manager',
    title: 'Sales Manager - East & West',
    region: 'East & West',
    managerId: 2,
    teamSize: 2,
    teamMembers: ['rep-3', 'rep-4'],
    avatar: '👤'
  },
  
  // Sales Reps
  // Manager 1 Team (Rajesh Kumar - North Region)
  {
    id: 'rep-1',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@company.com',
    password: 'sales123',
    securityToken: 'REP2026TOKEN',
    role: 'sales-rep',
    title: 'Sales Representative - North Region',
    region: 'North',
    manager: 'Rajesh Kumar',
    managerId: 1,
    repId: 1,
    avatar: '👤',
    industry: 'Automotive OEM'
  },
  {
    id: 'rep-2',
    name: 'Priya Mehta',
    email: 'priya.mehta@company.com',
    password: 'sales123',
    securityToken: 'REP2026TOKEN',
    role: 'sales-rep',
    title: 'Sales Representative - South Region',
    region: 'South',
    manager: 'Rajesh Kumar',
    managerId: 1,
    repId: 2,
    avatar: '👤',
    industry: 'Manufacturing & Industrial'
  },
  // Manager 2 Team
  {
    id: 'rep-3',
    name: 'Amit Kumar',
    email: 'amit.kumar@company.com',
    password: 'sales123',
    securityToken: 'REP2026TOKEN',
    role: 'sales-rep',
    title: 'Sales Representative - East Region',
    region: 'East',
    manager: 'Priya Sharma',
    managerId: 2,
    repId: 3,
    avatar: '👤',
    industry: 'Technology & IT Services'
  },
  {
    id: 'rep-4',
    name: 'Neha Singh',
    email: 'neha.singh@company.com',
    password: 'sales123',
    securityToken: 'REP2026TOKEN',
    role: 'sales-rep',
    title: 'Sales Representative - West Region',
    region: 'West',
    manager: 'Priya Sharma',
    managerId: 2,
    repId: 4,
    avatar: '👤',
    industry: 'Pharma & Healthcare'
  }
];

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userId) => {
    const user = allUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    }
    return null;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
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
    
    // Sales Manager and Sales Rep can only access their own region
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
    login,
    logout,
    isAuthenticated,
    hasRole,
    canAccessRegion,
    canAccessManager,
    canAccessRep,
    getDefaultRoute,
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
