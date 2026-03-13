import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SidebarNavigation from '../../components/SidebarNavigation/SidebarNavigation';
import TopNavbar from '../../components/TopNavbar/TopNavbar';
import GlassCard from '../../components/GlassCard/GlassCard';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import GradientButton from '../../components/GradientButton/GradientButton';
import { 
  AlertTriangle, 
  UserCheck, 
  Zap, 
  Clock,
  Users,
  Target,
  CheckCircle,
  XCircle,
  AlertCircle,
  PhoneCall,
  TrendingUp,
  Award,
  Activity,
  Package,
  Briefcase,
  ArrowUp,
  ArrowDown,
  RefreshCw
} from 'lucide-react';
import { 
  getHighRiskDeals, 
  interventionQueueData,
  repPerformanceData,
  getRepMetrics,
  calculateManagerKPIs,
  getRepPerformanceByManagerId,
  getHighRiskDealsByManagerId,
  getInterventionsByManagerId
} from '../../data/sharedData';
import './SalesManagerDashboard.css';

const SalesManagerDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // Filter interventions by manager's team
  const managerInterventions = currentUser?.managerId
    ? getInterventionsByManagerId(currentUser.managerId)
    : interventionQueueData;
    
  const [interventions, setInterventions] = useState(managerInterventions);

  // Calculate Manager KPIs from connected data
  const kpiData = calculateManagerKPIs();

  // Manager KPIs - Real Data from Backend
  const managerKPIs = [
    {
      title: 'Avg Sales Cycle',
      value: `${kpiData.avgSalesCycle} days`,
      change: '-4 days',
      trend: 'up',
      subtitle: 'Time to close',
      icon: <Clock size={24} />,
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
      title: 'Cross/Upsell Rate',
      value: `${kpiData.crossUpsellRate}%`,
      change: '+3.2%',
      trend: 'up',
      subtitle: 'Expansion success',
      icon: <RefreshCw size={24} />,
      status: 'success'
    },
    {
      title: 'Deal Velocity',
      value: `${kpiData.avgDealVelocity} days`,
      change: '-7 days',
      trend: 'up',
      subtitle: 'Avg closing time',
      icon: <Activity size={24} />,
      status: 'success'
    },
    {
      title: 'Top Product',
      value: kpiData.topProduct.name,
      change: kpiData.topProduct.revenue,
      trend: 'up',
      subtitle: 'Revenue leader',
      icon: <Package size={24} />,
      status: 'success'
    },
    {
      title: 'Top Service',
      value: kpiData.topService.name,
      change: kpiData.topService.revenue,
      trend: 'up',
      subtitle: 'Service line leader',
      icon: <Briefcase size={24} />,
      status: 'success'
    }
  ];

  // High-Risk Deals - Filter by manager's team only
  const highRiskDeals = currentUser?.managerId
    ? getHighRiskDealsByManagerId(currentUser.managerId)
    : getHighRiskDeals();

  // Rep Performance Data - Filter by manager's team only
  const managerRepPerformanceData = currentUser?.managerId 
    ? getRepPerformanceByManagerId(currentUser.managerId)
    : repPerformanceData;

  const repPerformance = managerRepPerformanceData.map(rep => {
    const metrics = getRepMetrics(rep.id);
    return {
      ...rep,
      activeDeals: metrics.activeDeals,
      pipeline: metrics.pipeline
    };
  });



  const handleMarkComplete = (id) => {
    setInterventions(interventions.map(item => 
      item.id === id ? { ...item, status: 'completed' } : item
    ));
  };

  const handleSnooze = (id) => {
    setInterventions(interventions.map(item => 
      item.id === id ? { ...item, daysOpen: item.daysOpen + 7 } : item
    ));
  };

  const getPriorityBadgeStatus = (priority) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'error';
      case 'important': return 'warning';
      default: return 'success';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent': return <AlertTriangle size={14} />;
      case 'high': return <AlertCircle size={14} />;
      case 'important': return <Activity size={14} />;
      default: return <CheckCircle size={14} />;
    }
  };

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
      <SidebarNavigation role="sales-manager" />
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
                  <div className={`kpi-trend kpi-trend-${kpi.trend}`}>
                    {kpi.trend === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                    {kpi.change}
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
                  <div className="action-label">
                    <Zap size={16} />
                    Recommended Action
                  </div>
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

          {/* Rep Performance Section */}
          <div className="section-header-bar">
            <div>
              <h2 className="dashboard-section-title">
                <UserCheck size={24} />
                Rep Performance & Coaching Insights
              </h2>
              <p className="dashboard-section-subtitle">
                Individual patterns, strengths, and coaching opportunities
              </p>
            </div>
          </div>

          <div className="rep-performance-grid">
            {repPerformance.map((rep, index) => (
              <GlassCard key={index} className="rep-performance-card">
                <div className="rep-header">
                  <div className="rep-avatar">{rep.avatar}</div>
                  <div className="rep-info">
                    <h3 className="rep-name">{rep.name}</h3>
                    <div className="rep-stats-inline">
                      <span>{rep.activeDeals} deals</span>
                      <span>•</span>
                      <span>{rep.pipeline} pipeline</span>
                    </div>
                  </div>
                  <div className="rep-conversion">
                    <div className="conversion-value">{rep.conversion}%</div>
                    <div className="conversion-label">Win Rate</div>
                  </div>
                </div>

                <div className="rep-section">
                  <div className="rep-section-title">
                    <TrendingUp size={16} />
                    Win Patterns Discovered
                  </div>
                  <ul className="rep-list">
                    {rep.winPattern.map((pattern, idx) => (
                      <li key={idx}>{pattern}</li>
                    ))}
                  </ul>
                </div>

                <div className="rep-section coaching-section">
                  <div className="rep-section-title">
                    <AlertCircle size={16} />
                    Coaching Needed
                  </div>
                  <ul className="rep-list coaching-list">
                    {rep.coachingNeeded.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="rep-section actions-section">
                  <div className="rep-section-title">
                    <Zap size={16} />
                    Recommended Actions
                  </div>
                  <div className="rep-actions">
                    {rep.actions.map((action, idx) => (
                      <div key={idx} className="rep-action-item">
                        <Target size={14} />
                        {action}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rep-metrics-bar">
                  <div className="metric-item">
                    <div className="metric-label">Deal Velocity</div>
                    <div className="metric-value">{rep.dealVelocity} days</div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Intervention Queue Section */}
          <div className="section-header-bar">
            <div>
              <h2 className="dashboard-section-title">
                <Zap size={24} />
                Intervention Queue - Action Required
              </h2>
              <p className="dashboard-section-subtitle">
                Specific coaching tasks and tactical interventions
              </p>
            </div>
            <StatusBadge 
              status="warning" 
              label={`${interventions.filter(i => i.status === 'pending').length} Pending`} 
            />
          </div>

          <div className="interventions-list">
            {interventions.filter(i => i.status === 'pending').map((item) => (
              <GlassCard key={item.id} className="intervention-card">
                <div className="intervention-header">
                  <StatusBadge 
                    status={getPriorityBadgeStatus(item.priority)}
                    label={item.priority.toUpperCase()}
                    icon={getPriorityIcon(item.priority)}
                  />
                  <div className="intervention-days">
                    {item.daysOpen === 0 ? 'Today' : `${item.daysOpen} days open`}
                  </div>
                </div>

                <h3 className="intervention-action">{item.action}</h3>
                
                <div className="intervention-deal-info">
                  <div className="deal-info-item">
                    <span className="info-label">Deal:</span>
                    <span className="info-value">{item.deal} ({item.dealValue})</span>
                  </div>
                  <div className="deal-info-item">
                    <span className="info-label">Issue:</span>
                    <span className="info-value">{item.issue}</span>
                  </div>
                </div>

                <div className="intervention-recommendation">
                  <div className="recommendation-icon">
                    <Zap size={16} />
                  </div>
                  <div className="recommendation-content">
                    <div className="recommendation-label">Recommended Action</div>
                    <div className="recommendation-text">{item.recommendation}</div>
                  </div>
                </div>

                <div className="intervention-actions">
                  <GradientButton 
                    variant="primary" 
                    size="small"
                    onClick={() => handleMarkComplete(item.id)}
                    icon={<CheckCircle size={16} />}
                  >
                    Mark Complete
                  </GradientButton>
                  <GradientButton 
                    variant="secondary" 
                    size="small"
                    onClick={() => handleSnooze(item.id)}
                  >
                    Snooze 7d
                  </GradientButton>
                  <button className="action-button-text">
                    Escalate
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesManagerDashboard;
