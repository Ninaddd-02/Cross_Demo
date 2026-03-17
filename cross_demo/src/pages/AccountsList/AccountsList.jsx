import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SidebarNavigation from '../../components/SidebarNavigation/SidebarNavigation';
import TopNavbar from '../../components/TopNavbar/TopNavbar';
import GlassCard from '../../components/GlassCard/GlassCard';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import { Building, MapPin, DollarSign, Users, Search, TrendingUp, Target, Activity, RefreshCw, AlertTriangle, Sparkles, ArrowUp, ArrowDown } from 'lucide-react';
import { getAccountsByRepId, getAllAccounts, calculateRepKPIs } from '../../data/sharedData';
import './AccountsList.css';

const AccountsList = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate Rep KPIs from tenant data
  const kpiData = calculateRepKPIs();

  // Sales Rep KPIs - Real Data from Tenant JSON
  const repKPIs = [
    {
      title: 'Total Revenue',
      value: kpiData.totalRevenue,
      change: '+12.3%',
      trend: 'up',
      subtitle: 'Overall revenue',
      icon: <DollarSign size={24} />,
      status: 'success'
    },
    {
      title: 'Avg Deal Velocity',
      value: `${kpiData.avgDealVelocity} days`,
      change: '-8 days',
      trend: 'up',
      subtitle: 'Time to close',
      icon: <Activity size={24} />,
      status: 'success'
    },
    {
      title: 'Revenue at Risk',
      value: kpiData.revenueAtRisk,
      change: '7.8% of pipeline',
      trend: 'down',
      subtitle: 'Needs attention',
      icon: <AlertTriangle size={24} />,
      status: 'warning'
    },
    {
      title: 'Avg Project Duration',
      value: `${kpiData.avgProjectDuration} days`,
      change: '+15 days',
      trend: 'down',
      subtitle: 'Project timeline',
      icon: <Target size={24} />,
      status: 'success'
    },
    {
      title: 'Renewal Rate',
      value: `${kpiData.renewalRate}%`,
      change: '+4.2%',
      trend: 'up',
      subtitle: 'Customer retention',
      icon: <RefreshCw size={24} />,
      status: 'success'
    },
    {
      title: 'Total Users',
      value: kpiData.totalUsers,
      change: '+25 users',
      trend: 'up',
      subtitle: 'Active users',
      icon: <Users size={24} />,
      status: 'success'
    }
  ];

  // Get accounts based on user role
  const accounts = useMemo(() => {
    if (currentUser?.role === 'sales-head' || currentUser?.role === 'sales-manager') {
      // Sales Head and Sales Manager see all accounts
      return getAllAccounts();
    } else if (currentUser?.repId) {
      // Sales Rep sees their accounts
      return getAccountsByRepId(currentUser.repId);
    }
    return [];
  }, [currentUser]);

  const filteredAccounts = accounts.filter(account =>
    account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    account.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
    account.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-layout">
      <SidebarNavigation role={currentUser?.role} />
      <div className="admin-content">
        <TopNavbar 
          title="Accounts"
          subtitle={`${filteredAccounts.length} Active Accounts`}
          user="Sales User"
        />
        
        <div className="page-body">
          {/* KPI Cards - Show for all roles */}
          <div className="kpi-section">
            <div className="kpi-grid">
              {repKPIs.map((kpi, index) => (
                <GlassCard key={index} className="kpi-card">
                  <div className="kpi-header">
                    <div className="kpi-icon" style={{ 
                      background: kpi.status === 'warning' 
                        ? 'linear-gradient(135deg, var(--warning), var(--orange))' 
                        : 'linear-gradient(135deg, var(--salesforce-blue), var(--cyan))' 
                    }}>
                      {kpi.icon}
                    </div>
                  </div>
                  <h3 className="kpi-title">{kpi.title}</h3>
                  <div className="kpi-value">{kpi.value}</div>
                  <p className="kpi-subtitle">{kpi.subtitle}</p>
                </GlassCard>
              ))}
            </div>
          </div>

          <div className="accounts-list-container">
            <div className="accounts-header">
              <div className="search-bar">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Search accounts by name, industry, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
              
              <div className="accounts-stats">
                <div className="stat-item">
                  <Building size={20} />
                  <div>
                    <div className="stat-value">{filteredAccounts.length}</div>
                    <div className="stat-label">Active Accounts</div>
                  </div>
                </div>
                <div className="stat-item">
                  <TrendingUp size={20} />
                  <div>
                    <div className="stat-value">{filteredAccounts.reduce((sum, acc) => sum + acc.opportunities, 0)}</div>
                    <div className="stat-label">Total Opportunities</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="accounts-grid">
              {filteredAccounts.map((account) => (
                <GlassCard 
                  key={account.id}
                  className="account-card"
                  onClick={() => navigate(`/sales/accounts/${account.id}`)}
                >
                  <div className="account-card-header">
                    <div className="account-icon">
                      <Building size={24} />
                    </div>
                    <StatusBadge status="success" label={account.status} size="small" />
                  </div>

                  <h3 className="account-name">{account.name}</h3>
                  <p className="account-industry">{account.industry}</p>

                  <div className="account-metrics">
                    <div className="metric">
                      <DollarSign size={16} />
                      <div>
                        <div className="metric-label">Revenue</div>
                        <div className="metric-value">{account.revenue}</div>
                      </div>
                    </div>
                  </div>

                  <div className="account-footer">
                    <div className="account-location">
                      <MapPin size={14} />
                      <span>{account.location}</span>
                    </div>
                    <div className="account-opportunities-count">
                      {account.opportunities} recommendations
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountsList;
