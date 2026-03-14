import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SidebarNavigation from '../../components/SidebarNavigation/SidebarNavigation';
import TopNavbar from '../../components/TopNavbar/TopNavbar';
import GlassCard from '../../components/GlassCard/GlassCard';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import { Building, MapPin, DollarSign, Users, Search, TrendingUp, X } from 'lucide-react';
import { getAccountsByRepId, getAllAccounts, getAccountsByManagerId, allDeals } from '../../data/sharedData';
import './AccountsList.css';

const AccountsList = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Get accounts based on user role
  const accounts = useMemo(() => {
    if (currentUser?.role === 'sales-head') {
      // Sales Head sees all accounts
      return getAllAccounts();
    } else if (currentUser?.role === 'sales-manager') {
      // Sales Manager sees accounts from their team
      return getAccountsByManagerId(currentUser.managerId);
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

  // Get opportunities for a specific account
  const getAccountOpportunities = (accountName) => {
    return allDeals.filter(deal => deal.company === accountName);
  };

  // Format date to be more current (2025-2026)
  const formatModernDate = (oldDate) => {
    if (!oldDate) return 'Not set';
    
    // Parse the old date
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const parts = oldDate.split(' ');
    if (parts.length !== 3) return oldDate;
    
    const month = parts[0].replace(',', '');
    const day = parts[1].replace(',', '');
    const oldYear = parseInt(parts[2]);
    
    // Update year to 2025 or 2026
    let newYear = 2025;
    if (oldYear >= 2023) {
      newYear = 2026;
    } else if (oldYear >= 2021) {
      newYear = 2025;
    }
    
    return `${month} ${day}, ${newYear}`;
  };

  const handleShowOpportunities = (e, account) => {
    e.stopPropagation();
    setSelectedAccount(account);
  };

  const closeModal = () => {
    setSelectedAccount(null);
  };

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
                    <div className="metric">
                      <Users size={16} />
                      <div>
                        <div className="metric-label">Employees</div>
                        <div className="metric-value">{account.employees}</div>
                      </div>
                    </div>
                  </div>

                  <div className="account-footer">
                    <div className="account-location">
                      <MapPin size={14} />
                      <span>{account.location}</span>
                    </div>
                    <button 
                      className="account-opportunities"
                      onClick={(e) => handleShowOpportunities(e, account)}
                    >
                      {account.opportunities} opportunities
                    </button>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>

        {/* Opportunities Modal */}
        {selectedAccount && (
          <div className="opportunities-modal-overlay" onClick={closeModal}>
            <div className="opportunities-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <h2>{selectedAccount.name}</h2>
                  <p className="modal-subtitle">{getAccountOpportunities(selectedAccount.name).length} Opportunities</p>
                </div>
                <button className="modal-close-btn" onClick={closeModal}>
                  <X size={24} />
                </button>
              </div>
              <div className="modal-body">
                <div className="opportunities-list">
                  {getAccountOpportunities(selectedAccount.name).map((opportunity) => (
                    <div key={opportunity.id} className="opportunity-item">
                      <div className="opportunity-row">
                        <div className="opportunity-left">
                          <div className="opportunity-name">{opportunity.name}</div>
                          <div className="opportunity-meta">
                            <StatusBadge 
                              status={opportunity.status === 'critical' || opportunity.status === 'high-risk' ? 'error' : 'success'} 
                              label={opportunity.stage} 
                              size="small" 
                            />
                            <span className="opportunity-value">{opportunity.valueFormatted}</span>
                          </div>
                        </div>
                        <div className="opportunity-right">
                          <div className="opportunity-owner">Owner: {opportunity.repName}</div>
                          <div className="opportunity-date">Close: {formatModernDate(opportunity.closeDate)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountsList;
