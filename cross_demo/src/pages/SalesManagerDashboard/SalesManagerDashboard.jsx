import React, { useState, useMemo, useEffect } from 'react';
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
  ArrowDown,
  MapPin,
  BarChart3,
  Filter
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  ComposedChart, Scatter,
  RadialBarChart, RadialBar, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { 
  getHighRiskDeals, 
  calculateManagerKPIs,
  getHighRiskDealsByManagerId
} from '../../data/sharedData';
import './SalesManagerDashboard.css';

const SalesManagerDashboard = () => {
  const navigate = useNavigate();
  const { currentUser, tenantId } = useAuth();
  const [timePeriod, setTimePeriod] = useState('6M');
  const [refreshKey, setRefreshKey] = useState(0);

  // Auto-refresh when tenant changes
  useEffect(() => {
    if (tenantId) {
      console.log('🔄 Tenant changed - refreshing manager dashboard');
      setRefreshKey(prev => prev + 1);
    }
  }, [tenantId]);

  // Calculate Manager KPIs from connected data
  const kpiData = useMemo(() => calculateManagerKPIs(), [refreshKey]);

  // Generate cycle time trend data based on time period
  const getCycleTimeTrendData = useMemo(() => {
    switch (timePeriod) {
      case '3M':
        return [
          { month: 'Oct', days: 33 },
          { month: 'Nov', days: 32 },
          { month: 'Dec', days: 32.4 }
        ];
      case '6M':
        return [
          { month: 'Jul', days: 38 },
          { month: 'Aug', days: 36 },
          { month: 'Sep', days: 35 },
          { month: 'Oct', days: 33 },
          { month: 'Nov', days: 32 },
          { month: 'Dec', days: 32.4 }
        ];
      case '1Y':
        return [
          { month: 'Jan', days: 45 },
          { month: 'Feb', days: 43 },
          { month: 'Mar', days: 42 },
          { month: 'Apr', days: 40 },
          { month: 'May', days: 39 },
          { month: 'Jun', days: 38 },
          { month: 'Jul', days: 37 },
          { month: 'Aug', days: 36 },
          { month: 'Sep', days: 35 },
          { month: 'Oct', days: 33 },
          { month: 'Nov', days: 32 },
          { month: 'Dec', days: 32.4 }
        ];
      case 'All':
        return [
          { month: 'Q1 2024', days: 52 },
          { month: 'Q2 2024', days: 48 },
          { month: 'Q3 2024', days: 44 },
          { month: 'Q4 2024', days: 40 },
          { month: 'Q1 2025', days: 38 },
          { month: 'Q2 2025', days: 36 },
          { month: 'Q3 2025', days: 34 },
          { month: 'Q4 2025', days: 32.4 }
        ];
      default:
        return [
          { month: 'Jul', days: 38 },
          { month: 'Aug', days: 36 },
          { month: 'Sep', days: 35 },
          { month: 'Oct', days: 33 },
          { month: 'Nov', days: 32 },
          { month: 'Dec', days: 32.4 }
        ];
    }
  }, [timePeriod]);

  // Top Recommended Account data by time period
  const getAccountEngagementData = useMemo(() => {
    switch (timePeriod) {
      case '3M': return [
        { month: 'Oct', revenue: 52.4 },
        { month: 'Nov', revenue: 60.1 },
        { month: 'Dec', revenue: 74.3 },
      ];
      case '6M': return [
        { month: 'Jul', revenue: 28.5 },
        { month: 'Aug', revenue: 36.2 },
        { month: 'Sep', revenue: 44.8 },
        { month: 'Oct', revenue: 52.4 },
        { month: 'Nov', revenue: 60.1 },
        { month: 'Dec', revenue: 74.3 },
      ];
      case '1Y': return [
        { month: 'Jan', revenue: 12.1 }, { month: 'Feb', revenue: 16.3 },
        { month: 'Mar', revenue: 20.5 }, { month: 'Apr', revenue: 24.8 },
        { month: 'May', revenue: 28.5 }, { month: 'Jun', revenue: 36.2 },
        { month: 'Jul', revenue: 40.1 }, { month: 'Aug', revenue: 44.8 },
        { month: 'Sep', revenue: 50.2 }, { month: 'Oct', revenue: 52.4 },
        { month: 'Nov', revenue: 60.1 }, { month: 'Dec', revenue: 74.3 },
      ];
      case 'All': return [
        { month: "Q1'24", revenue: 8.2  }, { month: "Q2'24", revenue: 14.5 },
        { month: "Q3'24", revenue: 22.3 }, { month: "Q4'24", revenue: 31.8 },
        { month: "Q1'25", revenue: 42.1 }, { month: "Q2'25", revenue: 52.4 },
        { month: "Q3'25", revenue: 62.8 }, { month: "Q4'25", revenue: 74.3 },
      ];
      default: return [
        { month: 'Jul', revenue: 28.5 }, { month: 'Aug', revenue: 36.2 },
        { month: 'Sep', revenue: 44.8 }, { month: 'Oct', revenue: 52.4 },
        { month: 'Nov', revenue: 60.1 }, { month: 'Dec', revenue: 74.3 },
      ];
    }
  }, [timePeriod]);

  // High-Risk Deals - Filter by manager's team only
  const highRiskDeals = currentUser?.managerId
    ? getHighRiskDealsByManagerId(currentUser?.managerId)
    : getHighRiskDeals();

  const getRiskSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'var(--error)';
      case 'high': return 'var(--warning)';
      case 'medium': return '#FFB75D';
      default: return 'var(--text-muted)';
    }
  };

  // Calculate deal completion percentage (mock calculation based on days)
  const calculateDealProgress = (deal) => {
    const avgCycleTime = 120; // Average deal cycle
    const elapsed = avgCycleTime - parseInt(deal.daysToClose);
    return Math.max(Math.min((elapsed / avgCycleTime) * 100, 95), 15);
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
          {/* Filters Section */}
          <div className="filters-bar">
            <div className="filter-group">
              <span className="filter-label">Time Period:</span>
              <div className="filter-buttons">
                {['3M', '6M', '1Y', 'All'].map((period) => (
                  <button
                    key={period}
                    className={`filter-btn ${timePeriod === period ? 'active' : ''}`}
                    onClick={() => setTimePeriod(period)}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* KPI Cards Grid - 6 Cards */}
          <div className="charts-grid">

            {/* 1. Cross-Sell Revenue */}
            <GlassCard className="chart-card">
              <div className="chart-header">
                <div className="chart-title-group">
                  <TrendingUp size={24} className="chart-icon" style={{ color: '#0176d3' }} />
                  <div>
                    <h3 className="chart-title">Cross-Sell Revenue</h3>
                    <p className="chart-subtitle">Total cross-sell revenue</p>
                  </div>
                </div>
                <div className="chart-value-badge success">
                  <span className="badge-value">{kpiData.crossSellRevenue}</span>
                </div>
              </div>
              <div style={{ width: '100%', height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { quarter: 'Q1', revenue: 15.2 },
                      { quarter: 'Q2', revenue: 18.5 },
                      { quarter: 'Q3', revenue: 20.8 },
                      { quarter: 'Q4', revenue: 19.8 }
                    ]}
                    margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                    <XAxis dataKey="quarter" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 14 }} />
                    <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 14 }} label={{ value: '₹ Cr', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.98)', border: '1px solid rgba(148, 163, 184, 0.3)', borderRadius: '8px', color: '#ffffff' }} formatter={(value) => [`₹${value} Cr`, 'Revenue']} />
                    <Bar dataKey="revenue" fill="#0176d3" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* 2. Upsell Revenue */}
            <GlassCard className="chart-card">
              <div className="chart-header">
                <div className="chart-title-group">
                  <ArrowUp size={24} className="chart-icon" style={{ color: '#22c55e' }} />
                  <div>
                    <h3 className="chart-title">Upsell Revenue</h3>
                    <p className="chart-subtitle">Total upsell revenue</p>
                  </div>
                </div>
                <div className="chart-value-badge success">
                  <span className="badge-value">{kpiData.upsellRevenue}</span>
                </div>
              </div>
              <div style={{ width: '100%', height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { quarter: 'Q1', revenue: 9.2 },
                      { quarter: 'Q2', revenue: 11.1 },
                      { quarter: 'Q3', revenue: 12.4 },
                      { quarter: 'Q4', revenue: 11.8 }
                    ]}
                    margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                    <XAxis dataKey="quarter" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 14 }} />
                    <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 14 }} label={{ value: '₹ Cr', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.98)', border: '1px solid rgba(148, 163, 184, 0.3)', borderRadius: '8px', color: '#ffffff' }} formatter={(value) => [`₹${value} Cr`, 'Revenue']} />
                    <Bar dataKey="revenue" fill="#22c55e" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* 3. Top Cross-Sell Service */}
            <GlassCard className="chart-card">
              <div className="chart-header">
                <div className="chart-title-group">
                  <Award size={24} className="chart-icon" style={{ color: '#f59e0b' }} />
                  <div>
                    <h3 className="chart-title">Top Cross-Sell Service</h3>
                    <p className="chart-subtitle">Leading service for cross-sell</p>
                  </div>
                </div>
                <div className="chart-value-badge warning">
                  <span className="badge-value">🏆 {kpiData.topCrossSellService}</span>
                </div>
              </div>
              <div style={{ width: '100%', height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: kpiData.topCrossSellService, value: 35, fill: '#f59e0b' },
                        { name: 'Cloud', value: 28, fill: '#3b82f6' },
                        { name: 'Analytics', value: 22, fill: '#8b5cf6' },
                        { name: 'Others', value: 15, fill: '#64748b' }
                      ]}
                      cx="50%" cy="50%" labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80} dataKey="value"
                    >
                      {[{ fill: '#f59e0b' }, { fill: '#3b82f6' }, { fill: '#8b5cf6' }, { fill: '#64748b' }].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.98)', border: '1px solid rgba(148, 163, 184, 0.3)', borderRadius: '8px', color: '#ffffff', fontSize: '12px' }} formatter={(value) => [`${value}%`, 'Share']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* 4. Top Upsell Service */}
            <GlassCard className="chart-card">
              <div className="chart-header">
                <div className="chart-title-group">
                  <Activity size={24} className="chart-icon" style={{ color: '#8b5cf6' }} />
                  <div>
                    <h3 className="chart-title">Top Upsell Service</h3>
                    <p className="chart-subtitle">Leading service for upsell</p>
                  </div>
                </div>
                <div className="chart-value-badge">
                  <span className="badge-value">⭐ {kpiData.topUpsellService}</span>
                </div>
              </div>
              <div style={{ width: '100%', height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { service: kpiData.topUpsellService?.substring(0, 8), crossSell: 15, upsell: 32 },
                      { service: kpiData.topCrossSellService, crossSell: 35, upsell: 18 },
                      { service: 'Cloud', crossSell: 28, upsell: 22 },
                      { service: 'Analytics', crossSell: 22, upsell: 28 }
                    ]}
                    margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                    <XAxis dataKey="service" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 14 }} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.98)', border: '1px solid rgba(148, 163, 184, 0.3)', borderRadius: '8px', color: '#ffffff' }} />
                    <Bar dataKey="crossSell" stackId="a" fill="#f59e0b" radius={[8, 8, 0, 0]} name="Cross-Sell" />
                    <Bar dataKey="upsell" stackId="a" fill="#8b5cf6" radius={[8, 8, 0, 0]} name="Upsell" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* 5. Top Region */}
            <GlassCard className="chart-card">
              <div className="chart-header">
                <div className="chart-title-group">
                  <MapPin size={24} className="chart-icon" style={{ color: '#06b6d4' }} />
                  <div>
                    <h3 className="chart-title">Top Region</h3>
                    <p className="chart-subtitle">By recommendation revenue</p>
                  </div>
                </div>
                <div className="chart-value-badge">
                  <span className="badge-value">📍 {kpiData.topRegion}</span>
                </div>
              </div>
              <div style={{ width: '100%', height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { region: kpiData.topRegion, revenue: 32.5 },
                      { region: 'North', revenue: 28.3 },
                      { region: 'South', revenue: 24.8 },
                      { region: 'East', revenue: 18.9 }
                    ]}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                    <XAxis type="number" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 14 }} label={{ value: '₹ Cr', position: 'insideBottom', offset: -10, fill: '#94a3b8' }} />
                    <YAxis type="category" dataKey="region" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 14 }} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.98)', border: '1px solid rgba(148, 163, 184, 0.3)', borderRadius: '8px', color: '#ffffff' }} formatter={(value) => [`₹${value} Cr`, 'Revenue']} />
                    <Bar dataKey="revenue" radius={[0, 8, 8, 0]}>
                      <Cell fill="#06b6d4" />
                      <Cell fill="#3b82f6" />
                      <Cell fill="#8b5cf6" />
                      <Cell fill="#64748b" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* 6. Top Recommended Account - Scatter + Line */}
            <GlassCard className="chart-card">
              <div className="chart-header">
                <div className="chart-title-group">
                  <BarChart3 size={24} className="chart-icon" style={{ color: '#a855f7' }} />
                  <div>
                    <h3 className="chart-title">Top Recommended Account</h3>
                    <p className="chart-subtitle">Revenue over time</p>
                  </div>
                </div>
                <div className="chart-value-badge">
                  <span className="badge-value" style={{ fontSize: '0.65rem', maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>🏅 {kpiData.topRecommendedAccount}</span>
                </div>
              </div>
              <div style={{
                background: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(99,102,241,0.1))',
                border: '1px solid rgba(168,85,247,0.3)',
                borderRadius: '8px',
                padding: '0.5rem 1rem',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#a855f7' }}>{kpiData.topRecommendedAccount}</span>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  Revenue: <strong style={{ color: '#a855f7' }}>₹{getAccountEngagementData[getAccountEngagementData.length - 1]?.revenue} Cr</strong>
                </span>
              </div>
              <div style={{ width: '100%', height: '210px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={getAccountEngagementData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                    <defs>
                      <linearGradient id="mgr-revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.08)" />
                    <XAxis dataKey="month" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <YAxis stroke="#a855f7" tick={{ fill: '#a855f7', fontSize: 11 }} label={{ value: '₹ Cr', angle: -90, position: 'insideLeft', fill: '#a855f7', fontSize: 10, dx: -5 }} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.98)', border: '1px solid rgba(168,85,247,0.4)', borderRadius: '10px', color: '#ffffff', fontSize: '12px' }} formatter={(value) => [`₹${value} Cr`, 'Revenue']} />
                    <Legend wrapperStyle={{ color: '#94a3b8', fontSize: '11px', paddingTop: '4px' }} />
                    <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#a855f7" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#a855f7' }} />
                    <Scatter dataKey="revenue" name="Revenue" fill="#a855f7" r={5} legendType="none" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

          </div>

          {/* High-Risk Deals Section - Enhanced with Progress Bars */}
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
            {highRiskDeals.map((deal) => {
              const progress = calculateDealProgress(deal);
              return (
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

                  {/* Deal Progress Bar */}
                  <div className="deal-progress-container">
                    <div className="progress-header">
                      <span className="progress-label">Deal Progress</span>
                      <span className="progress-value">{Math.round(progress)}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${progress}%`,
                          background: progress > 70 
                            ? 'linear-gradient(90deg, #22c55e, #86efac)' 
                            : progress > 40 
                            ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' 
                            : 'linear-gradient(90deg, #ef4444, #f87171)'
                        }}
                      ></div>
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
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesManagerDashboard;