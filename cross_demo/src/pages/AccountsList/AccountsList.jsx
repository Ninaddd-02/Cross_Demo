import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SidebarNavigation from '../../components/SidebarNavigation/SidebarNavigation';
import TopNavbar from '../../components/TopNavbar/TopNavbar';
import GlassCard from '../../components/GlassCard/GlassCard';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import { Building, MapPin, DollarSign, TrendingUp, ArrowUpRight, Eye, Edit, Target, X } from 'lucide-react';
import { getAccountsByRepId, getAllAccounts, getTenantInfo } from '../../data/sharedData';
import './AccountsList.css';

const AccountsList = () => {
  const navigate = useNavigate();
  const { currentUser, tenantId } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [opportunitiesModal, setOpportunitiesModal] = useState({ isOpen: false, account: null, opportunities: [] });
  const [refreshKey, setRefreshKey] = useState(0);

  // Auto-refresh when tenant changes
  useEffect(() => {
    if (tenantId) {
      console.log('🔄 Tenant changed - refreshing accounts');
      setRefreshKey(prev => prev + 1);
    }
  }, [tenantId]);

  // Get opportunities for a specific account
  const getAccountOpportunities = (accountName) => {
    const tenantInfo = getTenantInfo();
    const recommendations = tenantInfo.recommendations || [];
    return recommendations.filter(rec => rec.AccountName === accountName);
  };

  // Handle opening opportunities modal
  const handleOpenOpportunities = (account) => {
    const opportunities = getAccountOpportunities(account.name);
    setOpportunitiesModal({
      isOpen: true,
      account: account,
      opportunities: opportunities
    });
  };

  // Handle closing opportunities modal
  const handleCloseOpportunities = () => {
    setOpportunitiesModal({ isOpen: false, account: null, opportunities: [] });
  };

  // Navigate to recommendations based on user role
  const handleAccountClick = (account) => {
    let recommendationsPath;
    
    if (currentUser?.role === 'sales-rep') {
      recommendationsPath = '/sales/recommendations';
    } else if (currentUser?.role === 'sales-head') {
      recommendationsPath = '/sales-head/team-recommendations';
    } else if (currentUser?.role === 'sales-manager') {
      recommendationsPath = '/sales-manager/team-recommendations';
    } else {
      // Fallback to account detail if role is unknown
      navigate(`/sales/accounts/${account.id}`);
      return;
    }
    
    // Navigate with account information
    navigate(recommendationsPath, {
      state: {
        accountName: account.name,
        accountId: account.id
      }
    });
  };

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
  }, [currentUser, refreshKey]);

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
          user={currentUser?.name || currentUser?.email || 'User'}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search accounts..."
        />
        
        <div className="page-body">
          <div className="accounts-list-container">
            {/* Enhanced KPI Summary Strip */}
            <div className="kpi-summary-strip">
              <div className="kpi-summary-card">
                <div className="kpi-icon">
                  <Building size={24} />
                </div>
                <div className="kpi-content">
                  <div className="kpi-value">{filteredAccounts.length}</div>
                  <div className="kpi-label">Active Accounts In Pipeline</div>
                </div>
              </div>
              
              <div className="kpi-summary-card">
                <div className="kpi-icon opportunities">
                  <Target size={24} />
                </div>
                <div className="kpi-content">
                  <div className="kpi-value">{filteredAccounts.reduce((sum, acc) => sum + acc.opportunities, 0)}</div>
                  <div className="kpi-label">Total Opportunities</div>
                </div>
              </div>
            </div>

            <div className="accounts-grid">
              {filteredAccounts.map((account) => {
                return (
                  <GlassCard 
                    key={account.id}
                    className="account-card"
                    onMouseEnter={() => setHoveredCard(account.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className="account-card-header">
                      <StatusBadge 
                        status={account.status === 'Active' ? 'success' : 'warning'} 
                        label={account.status} 
                        size="small" 
                      />
                    </div>

                    <h3 className="account-name">{account.name}</h3>
                    <p className="account-industry">{account.industry}</p>

                    <div className="account-footer">
                      <div className="account-location">
                        <MapPin size={14} />
                        <span>{account.location}</span>
                      </div>
                      <div className="account-opportunities-badge">
                        <Target size={12} />
                        <span>{account.opportunities}</span>
                      </div>
                    </div>

                    {/* Quick Actions - Always Visible */}
                    <div className="quick-actions visible">
                      <button 
                        className="action-btn primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAccountClick(account);
                        }}
                      >
                        <Eye size={16} />
                        <span>View Recommendations</span>
                      </button>

                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Opportunities Modal */}
      {opportunitiesModal.isOpen && (
        <div className="opportunities-modal-overlay" onClick={handleCloseOpportunities}>
          <div className="opportunities-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 className="modal-title">Opportunities</h2>
                <p className="modal-subtitle">{opportunitiesModal.account?.name}</p>
              </div>
              <button className="modal-close-btn" onClick={handleCloseOpportunities}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              {opportunitiesModal.opportunities.length === 0 ? (
                <div className="no-opportunities">
                  <Target size={48} />
                  <p>No opportunities found for this account</p>
                </div>
              ) : (
                <div className="opportunities-list">
                  {opportunitiesModal.opportunities.map((opp, index) => (
                    <div key={index} className="opportunity-item">
                      <div className="opportunity-header">
                        <div className="opportunity-icon">
                          <Target size={20} />
                        </div>
                        <div className="opportunity-details">
                          <h3 className="opportunity-title">{opp.RecommendedProduct || 'Technology Solution'}</h3>
                          <p className="opportunity-type">{opp.RecommendationType || 'OPPORTUNITY'}</p>
                        </div>
                      </div>
                      <div className="opportunity-info">
                        {opp.RecommendedProduct && (
                          <div className="info-item">
                            <span className="info-label">Product:</span>
                            <span className="info-value">{opp.RecommendedProduct}</span>
                          </div>
                        )}
                        {opp.Partner && (
                          <div className="info-item">
                            <span className="info-label">Partner:</span>
                            <span className="info-value">{opp.Partner}</span>
                          </div>
                        )}
                        {opp.ConfidenceScore && (
                          <div className="info-item">
                            <span className="info-label">Confidence:</span>
                            <span className="info-value">{(opp.ConfidenceScore * 100).toFixed(0)}%</span>
                          </div>
                        )}
                        {opp.Method && (
                          <div className="info-item">
                            <span className="info-label">Method:</span>
                            <span className="info-value">{opp.Method.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountsList;
