// Utility functions for data formatting and manipulation
import { format, formatDistanceToNow, parseISO } from 'date-fns';

// Format currency
export const formatCurrency = (value, currency = '₹') => {
  if (value === null || value === undefined) return `${currency}0`;
  
  // If already formatted string, return as is
  if (typeof value === 'string' && value.includes('Cr')) return value;
  
  // Convert to number
  const numValue = typeof value === 'string' 
    ? parseFloat(value.replace(/[^\d.]/g, '')) 
    : value;
  
  if (numValue >= 10000000) {
    return `${currency}${(numValue / 10000000).toFixed(1)} Cr`;
  } else if (numValue >= 100000) {
    return `${currency}${(numValue / 100000).toFixed(1)} L`;
  } else if (numValue >= 1000) {
    return `${currency}${(numValue / 1000).toFixed(1)}K`;
  }
  
  return `${currency}${numValue.toLocaleString()}`;
};

// Parse currency string to number
export const parseCurrency = (currencyString) => {
  if (typeof currencyString === 'number') return currencyString;
  
  const cleanString = currencyString.replace(/[^\d.]/g, '');
  const numValue = parseFloat(cleanString);
  
  if (currencyString.includes('Cr')) {
    return numValue * 10000000;
  } else if (currencyString.includes('L')) {
    return numValue * 100000;
  } else if (currencyString.includes('K')) {
    return numValue * 1000;
  }
  
  return numValue;
};

// Format date
export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch (error) {
    return '';
  }
};

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch (error) {
    return '';
  }
};

// Calculate percentage
export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100);
};

// Get status color
export const getStatusColor = (status) => {
  const statusColors = {
    'Prospecting': '#64B5F6',
    'Qualification': '#FFA726',
    'Proposal': '#AB47BC',
    'Negotiation': '#FFCA28',
    'Closed Won': '#66BB6A',
    'Closed Lost': '#EF5350',
    'On Hold': '#78909C',
    'active': '#22C55E',
    'at-risk': '#FFA726',
    'churned': '#EF5350',
    'pending': '#FFA726',
    'accepted': '#66BB6A',
    'rejected': '#EF5350'
  };
  
  return statusColors[status] || '#78909C';
};

// Get priority color
export const getPriorityColor = (priority) => {
  const priorityColors = {
    'high': '#EF5350',
    'medium': '#FFA726',
    'low': '#66BB6A'
  };
  
  return priorityColors[priority?.toLowerCase()] || '#78909C';
};

// Truncate text
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Generate initials from name
export const getInitials = (name) => {
  if (!name) return '';
  
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone
export const isValidPhone = (phone) => {
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone);
};

// Sort array by field
export const sortByField = (array, field, order = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];
    
    if (order === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });
};

// Filter array by multiple criteria
export const filterByMultipleCriteria = (array, filters) => {
  return array.filter(item => {
    return Object.keys(filters).every(key => {
      const filterValue = filters[key];
      if (!filterValue || filterValue === 'all') return true;
      
      if (Array.isArray(filterValue)) {
        return filterValue.includes(item[key]);
      }
      
      return item[key] === filterValue;
    });
  });
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Generate random ID (backup if uuid fails)
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Deep clone object
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Group array by field
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

// Calculate deal health score
export const calculateDealHealthScore = (deal) => {
  let score = 50; // Base score
  
  // Stage progression
  const stageScores = {
    'Prospecting': 20,
    'Qualification': 40,
    'Proposal': 60,
    'Negotiation': 80,
    'Closed Won': 100,
    'Closed Lost': 0
  };
  score = stageScores[deal.stage] || 50;
  
  // Activity level
  const activities = deal.activities || [];
  if (activities.length > 10) score += 10;
  else if (activities.length > 5) score += 5;
  
  // Recent activity
  if (activities.length > 0) {
    const lastActivity = new Date(activities[0].timestamp);
    const daysSinceActivity = (Date.now() - lastActivity) / (1000 * 60 * 60 * 24);
    if (daysSinceActivity < 3) score += 10;
    else if (daysSinceActivity > 14) score -= 20;
  }
  
  return Math.max(0, Math.min(100, score));
};

export default {
  formatCurrency,
  parseCurrency,
  formatDate,
  formatRelativeTime,
  calculatePercentage,
  getStatusColor,
  getPriorityColor,
  truncateText,
  getInitials,
  isValidEmail,
  isValidPhone,
  sortByField,
  filterByMultipleCriteria,
  debounce,
  generateId,
  deepClone,
  groupBy,
  calculateDealHealthScore
};
