import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SidebarNavigation from '../../components/SidebarNavigation/SidebarNavigation';
import TopNavbar from '../../components/TopNavbar/TopNavbar';
import GlassCard from '../../components/GlassCard/GlassCard';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import GradientButton from '../../components/GradientButton/GradientButton';
import { 
  AlertTriangle, 
  Zap, 
  Clock,
  CheckCircle,
  TrendingUp,
  Award,
  Activity,
  Briefcase,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { 
  getHighRiskDeals, 
  calculateManagerKPIs,
  getHighRiskDealsByManagerId
} from '../../data/sharedData';
import './SalesManagerDashboard.css';

const SalesManagerDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Calculate Manager KPIs from connected data
  const kpiData = calculateManagerKPIs();

  // Manager KPIs - Real Data from Tenant JSON (SalesManager section)
  const managerKPIs = [
    {
      title: 'Total Revenue',
      value: kpiData.totalRevenue,
      change: '+12.3%',
      trend: 'up',
      subtitle: 'Overall revenue',
      icon: <TrendingUp size={24} />,
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
      change: '8.2% of pipeline',
      trend: 'down',
      subtitle: 'Needs attention',
      icon: <AlertTriangle size={24} />,
      status: 'warning'
    },
    {
      title: 'Top Service Line',
      value: kpiData.topServiceLine,
      change: 'Best performer',
      trend: 'up',
      subtitle: 'Leading service',
      icon: <Briefcase size={24} />,
      status: 'success'
    },
    {
      title: 'Top Technology',
      value: kpiData.topTechnology,
      change: 'Most used',
      trend: 'up',
      subtitle: 'Tech stack leader',
      icon: <Zap size={24} />,
      status: 'success'
    },
    {
      title: 'Top Region',
      value: kpiData.topRegion,
      change: 'Highest revenue',
      trend: 'up',
      subtitle: 'Best performing region',
      icon: <Award size={24} />,
      status: 'success'
    }
  ];

  // High-Risk Deals - Filter by manager's team only
  const highRiskDeals = currentUser?.managerId
    ? getHighRiskDealsByManagerId(currentUser.managerId)
    : getHighRiskDeals();

  const getRiskSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'var(--error)';
      case 'high': return 'var(--warning)';
      case 'medium': return '#FFB75D';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div className="admin-layout">
      <SidebarNavigation role={currentUser?.role} />
      <div className="admin-content">
        <TopNavbar 
          title="Sales Manager Dashboard" 
          subtitle="Tactical Team Management & Deal Intelligence"
          user="Sales Manager"
        />
        
        <div className="dashboard-body">
          {/* Manager KPIs */}
          <div className="kpi-grid">
            {managerKPIs.map((kpi, index) => (
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

          {/* High-Risk Deals Section */}
          <div className="section-header-bar">
            <div>
              <h2 className="dashboard-section-title">
                <AlertTriangle size={24} />
                High-Risk Deals Requiring Immediate Attention
              </h2>
              <p className="dashboard-section-subtitle">
                Deals with risk indicators that need manager intervention
              </p>
            </div>
            <StatusBadge status="error" label={`${highRiskDeals.length} At Risk`} />
          </div>

          <div className="risk-deals-grid">
            {highRiskDeals.map((deal) => (
              <GlassCard key={deal.id} className="risk-deal-card">
                <div className="risk-deal-header">
                  <div>
                    <h3 className="risk-deal-name">{deal.name}</h3>
                    <div className="risk-deal-meta">
                      <span className="deal-value">{deal.value}</span>
                      <span className="deal-sep">•</span>
                      <span className="deal-rep">{deal.rep}</span>
                    </div>
                  </div>
                  <div className="deal-days-badge">
                    <Clock size={14} />
                    {deal.daysToClose}d
                  </div>
                </div>

                <div className="risk-indicators">
                  {deal.risks.map((risk, idx) => (
                    <div 
                      key={idx} 
                      className="risk-badge"
                      style={{ borderColor: getRiskSeverityColor(risk.severity) }}
                    >
                      <div 
                        className="risk-badge-dot" 
                        style={{ background: getRiskSeverityColor(risk.severity) }}
                      ></div>
                      {risk.label}
                    </div>
                  ))}
                </div>

                <div className="risk-action-box">
                  <div className="action-text">{deal.action}</div>
                </div>

                <GradientButton 
                  variant="primary" 
                  size="small"
                  fullWidth
                  icon={<CheckCircle size={16} />}
                >
                  Mark as Addressed
                </GradientButton>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesManagerDashboard;
