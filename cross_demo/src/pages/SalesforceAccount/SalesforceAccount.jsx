import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SidebarNavigation from '../../components/SidebarNavigation/SidebarNavigation';
import TopNavbar from '../../components/TopNavbar/TopNavbar';
import GlassCard from '../../components/GlassCard/GlassCard';
import GradientButton from '../../components/GradientButton/GradientButton';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import { Building, MapPin, DollarSign, Users, Phone, Mail, Calendar, Sparkles, Activity, AlertTriangle, Target, TrendingUp, RefreshCw, ArrowUp, ArrowDown } from 'lucide-react';
import { allDeals, calculateRepKPIs, getAccountById } from '../../data/sharedData';
import './SalesforceAccount.css';

const SalesforceAccount = () => {
  const navigate = useNavigate();
  const { accountId } = useParams();
  const { currentUser } = useAuth();

  // Calculate Rep KPIs from connected data
  const kpiData = calculateRepKPIs();

  // Sales Rep KPIs - Real Data from Backend
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
      title: 'Cross Sell Renewal Rate',
      value: `${kpiData.crossSellRenewalRate}%`,
      change: '+3.1%',
      trend: 'up',
      subtitle: 'Cross-sell success',
      icon: <TrendingUp size={24} />,
      status: 'success'
    },
    {
      title: 'Up Sell Renewal Rate',
      value: `${kpiData.upSellRenewalRate}%`,
      change: '+5.7%',
      trend: 'up',
      subtitle: 'Upsell success',
      icon: <ArrowUp size={24} />,
      status: 'success'
    }
  ];

  // Get account data dynamically from actual deals
  const getAccountDataFromDeals = (repId) => {
    // Get all deals for this rep
    const repDeals = allDeals.filter(deal => deal.repId === repId);
    
    if (repDeals.length === 0) {
      return {
        name: 'No Accounts',
        industry: 'N/A',
        revenue: '₹0 Cr',
        employees: 'N/A',
        status: 'Inactive',
        location: 'N/A',
        phone: 'N/A',
        email: 'contact@example.com',
        since: 'N/A'
      };
    }

    // Group deals by company and calculate total value
    const companyStats = {};
    repDeals.forEach(deal => {
      if (!companyStats[deal.company]) {
        companyStats[deal.company] = {
          name: deal.company,
          totalValue: 0,
          dealCount: 0,
          industry: deal.industry || 'N/A',
          sector: deal.sector || 'N/A',
          deals: []
        };
      }
      companyStats[deal.company].totalValue += deal.value;
      companyStats[deal.company].dealCount += 1;
      companyStats[deal.company].deals.push(deal);
    });

    // Find company with highest total pipeline value
    const topCompany = Object.values(companyStats).sort((a, b) => b.totalValue - a.totalValue)[0];
    
    // Calculate estimated revenue (total value * 10 for annual revenue estimation)
    const estimatedRevenue = (topCompany.totalValue * 15).toFixed(2);
    
    return {
      name: topCompany.name,
      industry: topCompany.industry,
      revenue: `₹${estimatedRevenue} Cr`,
      employees: '50,000', // Placeholder - could be enhanced with real data
      status: 'Active',
      location: 'India', // Placeholder
      phone: '+91 22 0000-0000',
      email: `contact@${topCompany.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      since: 'January 2022',
      totalPipeline: `₹${topCompany.totalValue.toFixed(2)} Cr`,
      activeDeals: topCompany.dealCount
    };
  };

  // Get account data - either specific account from URL or rep's top account
  const accountData = accountId 
    ? getAccountById(accountId) || getAccountDataFromDeals(currentUser?.repId || 1)
    : getAccountDataFromDeals(currentUser?.repId || 1);

  // Get opportunities for this account from shared data
  const recentOpportunities = accountId && accountData.deals
    ? accountData.deals.map(deal => ({
        name: deal.name,
        amount: deal.valueFormatted,
        stage: deal.stage,
        closeDate: deal.closeDate
      }))
    : allDeals
        .filter(deal => deal.repId === currentUser?.repId && deal.company === accountData.name)
        .map(deal => ({
          name: deal.name,
          amount: deal.valueFormatted,
          stage: deal.stage,
          closeDate: deal.closeDate
        }));

  // Count recommendation types
  const crossSellCount = 2;
  const upsellCount = 1;

  return (
    <div className="admin-layout">
      <SidebarNavigation role="sales" />
      <div className="admin-content">
        <TopNavbar 
          title="My Accounts"
          subtitle="Account Overview"
          user="Sales User"
        />
        
        <div className="page-body salesforce-page">
          {/* Sales Rep KPIs */}
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

          <div className="salesforce-layout">
            <div className="account-main-content">
              <GlassCard className="account-header-card">
                <div className="account-header-top">
                  <div className="account-icon-large">
                    <Building size={32} />
                  </div>
                  <div className="account-info-main">
                    <h1 className="account-name">{accountData.name}</h1>
                    <div className="account-meta">
                      <StatusBadge status="success" label={accountData.status} />
                      <span className="account-industry">{accountData.industry}</span>
                    </div>
                  </div>
                </div>

                <div className="account-details-grid">
                  <div className="detail-item">
                    <DollarSign size={18} className="detail-icon" />
                    <div>
                      <div className="detail-label">Annual Revenue</div>
                      <div className="detail-value">{accountData.revenue}</div>
                    </div>
                  </div>
                  <div className="detail-item">
                    <MapPin size={18} className="detail-icon" />
                    <div>
                      <div className="detail-label">Location</div>
                      <div className="detail-value">{accountData.location}</div>
                    </div>
                  </div>
                  <div className="detail-item">
                    <Calendar size={18} className="detail-icon" />
                    <div>
                      <div className="detail-label">Customer Since</div>
                      <div className="detail-value">{accountData.since}</div>
                    </div>
                  </div>
                </div>

                <div className="account-contact-info">
                  <div className="contact-item">
                    <Phone size={16} />
                    <span>{accountData.phone}</span>
                  </div>
                  <div className="contact-item">
                    <Mail size={16} />
                    <span>{accountData.email}</span>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="opportunities-card">
                <h2 className="section-title">Recent Opportunities</h2>
                <div className="opportunities-list">
                  {recentOpportunities.map((opp, index) => (
                    <div key={index} className="opportunity-item">
                      <div>
                        <div className="opp-name">{opp.name}</div>
                        <div className="opp-details">
                          {opp.stage} · Closes {opp.closeDate}
                        </div>
                      </div>
                      <div className="opp-amount">{opp.amount}</div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            <div className="account-sidebar">
              <GlassCard className="ai-recommendations-preview" glow={true} glowColor="blue">
                <div className="ai-header">
                  <Sparkles size={24} className="sparkle-icon" />
                  <h2>AI Recommendations</h2>
                </div>
                <p className="ai-description">
                  Cross Sync has identified <strong>3 high-value opportunities</strong> for this account
                </p>
                <GradientButton 
                  variant="primary" 
                  size="medium"
                  fullWidth
                  icon={<Sparkles size={18} />}
                  onClick={() => navigate('/sales/recommendations')}
                >
                  View Recommendations
                </GradientButton>
                
                <div className="preview-badges">
                  <StatusBadge status="active" label={`${crossSellCount} Cross-Sell`} size="small" />
                  <StatusBadge status="info" label={`${upsellCount} Upsell`} size="small" />
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesforceAccount;
