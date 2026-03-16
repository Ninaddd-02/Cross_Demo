import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SidebarNavigation from '../../components/SidebarNavigation/SidebarNavigation';
import TopNavbar from '../../components/TopNavbar/TopNavbar';
import GlassCard from '../../components/GlassCard/GlassCard';
import GradientButton from '../../components/GradientButton/GradientButton';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import { 
  Building, MapPin, DollarSign, Users, Phone, Mail, Calendar, 
  Sparkles, ArrowLeft, TrendingUp, Activity, Package, Target,
  CheckCircle, Clock, AlertCircle
} from 'lucide-react';
import { getAccountById, getAIRecommendations } from '../../data/sharedData';
import './AccountDetail.css';

const AccountDetail = () => {
  const navigate = useNavigate();
  const { accountId } = useParams();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Get account data
  const account = useMemo(() => {
    return getAccountById(accountId);
  }, [accountId]);

  // Get fresh recommendations based on current tenant
  const aiRecommendations = useMemo(() => getAIRecommendations(), []);
  
  // Helper to format opportunity type for display
  const formatOpportunityType = (type) => {
    if (!type) return 'Unknown';
    // Convert "cross-sell" to "Cross-Sell", "upsell" to "Upsell", etc.
    return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-');
  };

  if (!account) {
    return (
      <div className="admin-layout">
        <SidebarNavigation role={currentUser?.role} />
        <div className="admin-content">
          <TopNavbar 
            title="Account Not Found"
            subtitle="The requested account could not be found"
            user={currentUser?.name || "User"}
          />
          <div className="page-body">
            <GlassCard>
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <AlertCircle size={48} style={{ color: 'var(--error)', marginBottom: '16px' }} />
                <h2>Account Not Found</h2>
                <p style={{ marginBottom: '24px' }}>The account you're looking for doesn't exist.</p>
                <GradientButton onClick={() => navigate(-1)}>
                  Go Back
                </GradientButton>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    );
  }

  // Get recommendations for this account
  const accountRecommendations = aiRecommendations.filter(rec => 
    rec.targetCompanies?.includes(account.name)
  );

  // Group deals by stage
  const dealsByStage = useMemo(() => {
    if (!account.deals) return {};
    
    const grouped = {
      'Negotiation': [],
      'Proposal': [],
      'Discovery': [],
      'Qualification': [],
      'Closed Won': [],
      'Other': []
    };

    account.deals.forEach(deal => {
      if (grouped[deal.stage]) {
        grouped[deal.stage].push(deal);
      } else {
        grouped['Other'].push(deal);
      }
    });

    return grouped;
  }, [account.deals]);

  // Calculate metrics
  const metrics = useMemo(() => {
    if (!account.deals || account.deals.length === 0) {
      return {
        totalValue: 0,
        avgDealSize: 0,
        dealsCount: 0,
        closedWon: 0
      };
    }

    const totalValue = account.deals.reduce((sum, deal) => sum + deal.value, 0);
    const closedWon = account.deals.filter(d => d.stage === 'Closed Won').length;

    return {
      totalValue: totalValue.toFixed(2),
      avgDealSize: (totalValue / account.deals.length).toFixed(2),
      dealsCount: account.deals.length,
      closedWon
    };
  }, [account.deals]);

  const getBackPath = () => {
    if (currentUser?.role === 'sales-head') return '/sales-head/accounts';
    if (currentUser?.role === 'sales-manager') return '/sales-manager/accounts';
    return '/sales/accounts';
  };

  return (
    <div className="admin-layout">
      <SidebarNavigation role={currentUser?.role} />
      <div className="admin-content">
        <TopNavbar 
          title={account.name}
          subtitle="Account Details"
          user={currentUser?.name || "User"}
        />
        
        <div className="page-body account-detail-page">
          {/* Back Button */}
          <div className="account-detail-header">
            <button className="back-button" onClick={() => navigate(getBackPath())}>
              <ArrowLeft size={20} />
              <span>Back to Accounts</span>
            </button>
          </div>

          {/* Account Overview Card */}
          <GlassCard className="account-overview-card">
            <div className="account-header-section">
              <div className="account-icon-large">
                <Building size={40} />
              </div>
              <div className="account-main-info">
                <h1 className="account-title">{account.name}</h1>
                <div className="account-badges">
                  <StatusBadge status="success" label={account.status} />
                  <span className="account-industry-badge">{account.industry}</span>
                </div>
              </div>
              <div className="account-actions">
                <GradientButton 
                  variant="primary" 
                  size="medium"
                  icon={<Sparkles size={18} />}
                  onClick={() => navigate('/sales/recommendations')}
                >
                  View AI Recommendations
                </GradientButton>
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="account-metrics-grid">
              <div className="metric-card">
                <DollarSign size={24} className="metric-icon" />
                <div className="metric-content">
                  <div className="metric-label">Annual Revenue</div>
                  <div className="metric-value">{account.revenue}</div>
                </div>
              </div>
              <div className="metric-card">
                <Users size={24} className="metric-icon" />
                <div className="metric-content">
                  <div className="metric-label">Employees</div>
                  <div className="metric-value">{account.employees}</div>
                </div>
              </div>
              <div className="metric-card">
                <MapPin size={24} className="metric-icon" />
                <div className="metric-content">
                  <div className="metric-label">Location</div>
                  <div className="metric-value">{account.location}</div>
                </div>
              </div>
              <div className="metric-card">
                <Calendar size={24} className="metric-icon" />
                <div className="metric-content">
                  <div className="metric-label">Customer Since</div>
                  <div className="metric-value">{account.since}</div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="account-contact-section">
              <h3>Contact Information</h3>
              <div className="contact-details">
                <div className="contact-item">
                  <Phone size={18} />
                  <span>{account.phone}</span>
                </div>
                <div className="contact-item">
                  <Mail size={18} />
                  <span>{account.email}</span>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Pipeline Overview */}
          <div className="account-stats-grid">
            <GlassCard className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, var(--salesforce-blue), var(--cyan))' }}>
                <TrendingUp size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-value">₹{metrics.totalValue} Cr</div>
                <div className="stat-label">Total Pipeline Value</div>
              </div>
            </GlassCard>

            <GlassCard className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, var(--purple), var(--pink))' }}>
                <Package size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-value">{metrics.dealsCount}</div>
                <div className="stat-label">Active Opportunities</div>
              </div>
            </GlassCard>

            <GlassCard className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, var(--success), var(--green))' }}>
                <CheckCircle size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-value">{metrics.closedWon}</div>
                <div className="stat-label">Deals Closed Won</div>
              </div>
            </GlassCard>

            <GlassCard className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, var(--orange), var(--warning))' }}>
                <Target size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-value">₹{metrics.avgDealSize} Cr</div>
                <div className="stat-label">Avg Deal Size</div>
              </div>
            </GlassCard>
          </div>

          {/* Tabs */}
          <div className="account-tabs">
            <button 
              className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <Activity size={18} />
              All Opportunities
            </button>
            <button 
              className={`tab-button ${activeTab === 'recommendations' ? 'active' : ''}`}
              onClick={() => setActiveTab('recommendations')}
            >
              <Sparkles size={18} />
              AI Recommendations ({accountRecommendations.length})
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="tab-content">
              {Object.entries(dealsByStage).map(([stage, deals]) => {
                if (deals.length === 0) return null;
                
                return (
                  <GlassCard key={stage} className="deals-stage-card">
                    <div className="stage-header">
                      <h3>{stage}</h3>
                      <span className="stage-count">{deals.length} deals</span>
                    </div>
                    <div className="deals-list">
                      {deals.map((deal) => (
                        <div key={deal.id} className="deal-item">
                          <div className="deal-left">
                            <div className="deal-name">{deal.name}</div>
                            <div className="deal-meta">
                              <span className="deal-region">{deal.region}</span>
                              <span className="deal-separator">•</span>
                              <span className="deal-date">Close: {deal.closeDate}</span>
                            </div>
                          </div>
                          <div className="deal-right">
                            <div className="deal-value">{deal.valueFormatted}</div>
                            <StatusBadge 
                              status={deal.stage === 'Closed Won' ? 'success' : 'active'} 
                              label={deal.stage} 
                              size="small" 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                );
              })}

              {account.deals.length === 0 && (
                <GlassCard>
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <Package size={48} style={{ color: 'var(--text-secondary)', marginBottom: '16px' }} />
                    <h3>No Opportunities</h3>
                    <p>There are no opportunities for this account yet.</p>
                  </div>
                </GlassCard>
              )}
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="tab-content">
              {accountRecommendations.length > 0 ? (
                <div className="recommendations-grid">
                  {accountRecommendations.map((rec) => (
                    <GlassCard key={rec.id} className="recommendation-card" glow={true} glowColor="blue">
                      <div className="rec-header">
                        <StatusBadge 
                          status={rec.type === 'cross-sell' ? 'active' : 'info'} 
                          label={formatOpportunityType(rec.type)} 
                        />
                        <div className="rec-priority">Priority: {rec.priority}</div>
                      </div>
                      <h3 className="rec-title">{rec.productName}</h3>
                      <div className="rec-metrics">
                        <div className="rec-metric">
                          <span className="rec-metric-label">Est. Value</span>
                          <span className="rec-metric-value">{rec.estimatedValue}</span>
                        </div>
                        <div className="rec-metric">
                          <span className="rec-metric-label">Confidence</span>
                          <span className="rec-metric-value">{rec.confidence}%</span>
                        </div>
                      </div>
                      <div className="rec-actions">
                        <GradientButton 
                          variant="primary" 
                          size="small"
                          fullWidth
                          onClick={() => navigate('/sales/action-confirmation', { state: { recommendation: rec } })}
                        >
                          View Details
                        </GradientButton>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              ) : (
                <GlassCard>
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <Sparkles size={48} style={{ color: 'var(--text-secondary)', marginBottom: '16px' }} />
                    <h3>No AI Recommendations</h3>
                    <p>There are no AI recommendations for this account at the moment.</p>
                  </div>
                </GlassCard>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountDetail;
