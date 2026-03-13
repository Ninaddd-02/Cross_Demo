import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarNavigation from '../../components/SidebarNavigation/SidebarNavigation';
import TopNavbar from '../../components/TopNavbar/TopNavbar';
import GlassCard from '../../components/GlassCard/GlassCard';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import ProgressRing from '../../components/ProgressRing/ProgressRing';
import { 
  TrendingUp, 
  AlertTriangle, 
  Award, 
  Lightbulb, 
  Target,
  BarChart3,
  Users,
  MapPin,
  Building,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Activity
} from 'lucide-react';
import { 
  calculateStrategicKPIs, 
  getRegionalMetrics,
  managerPerformanceData,
  patternInsights as sharedPatternInsights
} from '../../data/sharedData';
import './SalesHeadDashboard.css';

const SalesHeadDashboard = () => {
  const navigate = useNavigate();

  // Calculate Strategic KPIs from connected data
  const kpiData = calculateStrategicKPIs();

  // Strategic KPIs - Real Data from Backend
  const strategicKPIs = [
    {
      title: 'Total Revenue',
      value: kpiData.totalRevenue,
      change: '+12.3%',
      trend: 'up',
      subtitle: 'All regions combined',
      icon: <TrendingUp size={24} />,
      status: 'success'
    },
    {
      title: 'Revenue at Risk',
      value: kpiData.revenueAtRisk,
      change: `${kpiData.riskPercentage}% of revenue`,
      trend: 'down',
      subtitle: 'Needs immediate attention',
      icon: <AlertTriangle size={24} />,
      status: 'warning'
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
      title: 'Average Margin',
      value: `${kpiData.avgMargin}%`,
      change: '+2.1%',
      trend: 'up',
      subtitle: 'Profit margin',
      icon: <Target size={24} />,
      status: 'success'
    },
    {
      title: 'Avg Contribution',
      value: kpiData.avgContribution,
      change: '+5.4%',
      trend: 'up',
      subtitle: 'Per deal margin',
      icon: <BarChart3 size={24} />,
      status: 'success'
    },
    {
      title: 'Active Regions',
      value: '5 Regions',
      change: 'West leads',
      trend: 'up',
      subtitle: 'Coverage across India',
      icon: <MapPin size={24} />,
      status: 'success'
    }
  ];

  // Pipeline Risk by Region - connected to shared data
  const regionalRisks = [
    { region: 'North', ...getRegionalMetrics('North') },
    { region: 'South', ...getRegionalMetrics('South') },
    { region: 'East', ...getRegionalMetrics('East') },
    { region: 'West', ...getRegionalMetrics('West') }
  ];

  // Pipeline Risk by Vertical
  const verticalRisks = [
    { vertical: 'Automotive OEM', pipeline: '₹128 Cr', risk: '₹16 Cr', riskPercent: 12.5, deals: 42 },
    { vertical: 'Auto Components', pipeline: '₹89 Cr', risk: '₹15 Cr', riskPercent: 16.9, deals: 28 },
    { vertical: 'EV Manufacturers', pipeline: '₹42 Cr', risk: '₹7 Cr', riskPercent: 16.7, deals: 12 },
    { vertical: 'Fleet Services', pipeline: '₹25 Cr', risk: '₹4 Cr', riskPercent: 16.0, deals: 6 }
  ];

  // Manager Effectiveness - connected to shared data
  const managerPerformance = managerPerformanceData.map(manager => {
    const regionMetrics = getRegionalMetrics(manager.region);
    return {
      ...manager,
      pipeline: regionMetrics.pipeline
    };
  });

  // Cross-Tenant Pattern Insights - connected to shared data
  const patternInsights = sharedPatternInsights.map(insight => ({
    icon: getIconForInsight(insight.title),
    title: insight.title,
    insight: insight.insight,
    impact: insight.impact,
    recommendation: insight.recommendation,
    confidence: insight.confidence
  }));

  function getIconForInsight(title) {
    if (title.includes('Multi-Stakeholder')) return <Users size={24} />;
    if (title.includes('Discount')) return <TrendingDown size={24} />;
    if (title.includes('Demo')) return <Activity size={24} />;
    if (title.includes('Industry')) return <Building size={24} />;
    return <Lightbulb size={24} />;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'var(--success)';
      case 'warning': return 'var(--warning)';
      case 'error': return 'var(--error)';
      default: return 'var(--info)';
    }
  };

  const getImpactBadgeStatus = (impact) => {
    switch (impact.toLowerCase()) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'active';
      default: return 'success';
    }
  };

  return (
    <div className="admin-layout">
      <SidebarNavigation role="sales-head" />
      <div className="admin-content">
        <TopNavbar 
          title="Sales Head Dashboard" 
          subtitle="Strategic Revenue Intelligence & Performance Insights"
          user="Sales Head"
        />
        
        <div className="dashboard-body">
          {/* Strategic KPIs */}
          <div className="kpi-grid">
            {strategicKPIs.map((kpi, index) => (
              <GlassCard key={index} className="kpi-card">
                <div className="kpi-header">
                  <div className="kpi-icon" style={{ background: `linear-gradient(135deg, ${getStatusColor(kpi.status)}, var(--cyan))` }}>
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

          {/* Pipeline Risk Map */}
          <GlassCard className="risk-map-card">
              <div className="card-header">
                <div>
                  <h2 className="section-title">
                    <AlertTriangle size={24} />
                    Pipeline Risk Map
                  </h2>
                  <p className="section-subtitle">Revenue exposure analysis</p>
                </div>
                <div className="risk-exposure">
                  <div className="exposure-value">₹42 Cr</div>
                  <div className="exposure-label">At Risk</div>
                </div>
              </div>

              <div className="risk-section">
                <h3 className="risk-section-title">
                  <MapPin size={18} />
                  Risk by Region
                </h3>
                <div className="risk-list">
                  {regionalRisks.map((region, index) => (
                    <div key={index} className="risk-item">
                      <div className="risk-item-header">
                        <div className="risk-item-name">{region.region}</div>
                        <div className="risk-item-deals">{region.deals} deals</div>
                      </div>
                      <div className="risk-item-pipeline">
                        <span>Pipeline: {region.pipeline}</span>
                        <span className="risk-amount" style={{ color: region.riskPercent > 15 ? 'var(--warning)' : 'var(--success)' }}>
                          Risk: {region.risk} ({region.riskPercent}%)
                        </span>
                      </div>
                      <div className="risk-bar">
                        <div 
                          className="risk-bar-fill" 
                          style={{ 
                            width: `${region.riskPercent}%`,
                            background: region.riskPercent > 15 ? 'var(--warning)' : 'var(--success)'
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="risk-section">
                <h3 className="risk-section-title">
                  <Building size={18} />
                  Risk by Vertical
                </h3>
                <div className="risk-list">
                  {verticalRisks.map((vertical, index) => (
                    <div key={index} className="risk-item">
                      <div className="risk-item-header">
                        <div className="risk-item-name">{vertical.vertical}</div>
                        <div className="risk-item-deals">{vertical.deals} deals</div>
                      </div>
                      <div className="risk-item-pipeline">
                        <span>Pipeline: {vertical.pipeline}</span>
                        <span className="risk-amount" style={{ color: vertical.riskPercent > 15 ? 'var(--warning)' : 'var(--success)' }}>
                          Risk: {vertical.risk} ({vertical.riskPercent}%)
                        </span>
                      </div>
                      <div className="risk-bar">
                        <div 
                          className="risk-bar-fill" 
                          style={{ 
                            width: `${vertical.riskPercent}%`,
                            background: vertical.riskPercent > 15 ? 'var(--warning)' : 'var(--success)'
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>

          {/* Manager Effectiveness */}
          <GlassCard className="manager-effectiveness-card">
            <div className="card-header">
              <div>
                <h2 className="section-title">
                  <Award size={24} />
                  Manager Effectiveness Insights
                </h2>
                <p className="section-subtitle">Team performance and coaching impact analysis</p>
              </div>
            </div>

            <div className="manager-grid">
              {managerPerformance.map((manager, index) => (
                <div key={index} className="manager-card">
                  <div className="manager-header">
                    <div>
                      <div className="manager-name">{manager.name}</div>
                      <div className="manager-region">
                        <MapPin size={14} />
                        {manager.region} Region • {manager.teamSize} reps
                      </div>
                    </div>
                    <div className="manager-ranking">#{index + 1}</div>
                  </div>

                  <div className="manager-metrics">
                    <div className="manager-metric">
                      <div className="metric-label">Conversion Rate</div>
                      <div className="metric-value-wrapper">
                        <div className="metric-value">{manager.conversion}%</div>
                        <div className="metric-bar">
                          <div 
                            className="metric-bar-fill" 
                            style={{ width: `${manager.conversion}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="manager-metric">
                      <div className="metric-label">Deal Velocity</div>
                      <div className="metric-value-wrapper">
                        <div className="metric-value">{manager.dealVelocity} days</div>
                        <div className="metric-bar">
                          <div 
                            className="metric-bar-fill metric-bar-velocity" 
                            style={{ width: `${100 - (manager.dealVelocity / 60 * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="manager-metric">
                      <div className="metric-label">Coaching Score</div>
                      <div className="metric-value-wrapper">
                        <div className="metric-value">{manager.coachingScore}/100</div>
                        <div className="metric-bar">
                          <div 
                            className="metric-bar-fill metric-bar-coaching" 
                            style={{ width: `${manager.coachingScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="manager-pipeline">
                    <div className="pipeline-stat">
                      <div className="pipeline-stat-label">Pipeline</div>
                      <div className="pipeline-stat-value">{manager.pipeline}</div>
                    </div>
                    <div className="pipeline-stat">
                      <div className="pipeline-stat-label">Closed YTD</div>
                      <div className="pipeline-stat-value">{manager.closed}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Pattern Insights */}
          <GlassCard className="pattern-insights-card">
            <div className="card-header">
              <div>
                <h2 className="section-title">
                  <Lightbulb size={24} />
                  Cross-Tenant Pattern Insights
                </h2>
                <p className="section-subtitle">AI-discovered patterns from automotive industry data</p>
              </div>
            </div>

            <div className="insights-grid">
              {patternInsights.map((insight, index) => (
                <div key={index} className="insight-card">
                  <div className="insight-header">
                    <div className="insight-icon">{insight.icon}</div>
                    <StatusBadge status={getImpactBadgeStatus(insight.impact)} label={`${insight.impact} Impact`} />
                  </div>
                  
                  <h3 className="insight-title">{insight.title}</h3>
                  <p className="insight-text">{insight.insight}</p>
                  
                  <div className="insight-recommendation">
                    <div className="recommendation-label">Strategic Action</div>
                    <div className="recommendation-text">{insight.recommendation}</div>
                  </div>

                  <div className="insight-footer">
                    <div className="insight-confidence">
                      <Target size={14} />
                      {insight.confidence}% confidence
                    </div>
                    <div className="insight-source">Industry benchmark</div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default SalesHeadDashboard;
