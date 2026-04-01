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

          {/* KPI Cards Grid - 5 Cards */}
          <div className="charts-grid">
            
            {/* 1. Team Cross-Sell Conversion Rate - Radial Gauge */}
            <GlassCard className="chart-card large-chart">
              <div className="chart-header">
                <div className="chart-title-group">
                  <TrendingUp size={24} className="chart-icon" />
                  <div>
                    <h3 className="chart-title">Team Cross-Sell Conversion Rate</h3>
                    <p className="chart-subtitle">Cross-sell success rate</p>
                  </div>
                </div>
                <div className="chart-value-badge success">
                  <span className="badge-value">24.8%</span>
                  <span className="badge-trend">
                    <ArrowUp size={14} />
                    Conversion
                  </span>
                </div>
              </div>
              <div style={{ width: '100%', height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart 
                    cx="50%" 
                    cy="50%" 
                    innerRadius="60%" 
                    outerRadius="90%" 
                    data={[{ name: 'Cross-Sell Rate', value: 24.8, fill: '#3b82f6' }]}
                    startAngle={180}
                    endAngle={0}
                  >
                    <RadialBar
                      minAngle={15}
                      background
                      clockWise
                      dataKey="value"
                      cornerRadius={10}
                    />
                    <text 
                      x="50%" 
                      y="50%" 
                      textAnchor="middle" 
                      dominantBaseline="middle"
                      style={{ fontSize: '2.5rem', fontWeight: '700', fill: '#3b82f6' }}
                    >
                      24.8%
                    </text>
                    <Tooltip 
                      cursor={false}
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.98)', 
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                        borderRadius: '8px',
                        color: '#ffffff'
                      }}
                      formatter={(value) => [`${value}%`, 'Conversion Rate']}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* 2. Team Upsell Conversion Rate - Pie Chart */}
            <GlassCard className="chart-card large-chart">
              <div className="chart-header">
                <div className="chart-title-group">
                  <Activity size={24} className="chart-icon" />
                  <div>
                    <h3 className="chart-title">Team Upsell Conversion Rate</h3>
                    <p className="chart-subtitle">Upsell success rate</p>
                  </div>
                </div>
                <div className="chart-value-badge success">
                  <span className="badge-value">19.6%</span>
                  <span className="badge-trend">
                    <ArrowUp size={14} />
                    Conversion
                  </span>
                </div>
              </div>
              <div style={{ width: '100%', height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Converted', value: 19.6, fill: '#a78bfa' },
                        { name: 'Pending', value: 80.4, fill: '#1e293b' }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius="60%"
                      outerRadius="80%"
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {[
                        { name: 'Converted', value: 19.6, fill: '#a78bfa' },
                        { name: 'Pending', value: 80.4, fill: '#1e293b' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.98)', 
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                        borderRadius: '8px',
                        color: '#ffffff'
                      }}
                      formatter={(value) => [`${value.toFixed(1)}%`, '']}
                    />
                    <text 
                      x="50%" 
                      y="50%" 
                      textAnchor="middle" 
                      dominantBaseline="middle"
                      style={{ fontSize: '2rem', fontWeight: '700', fill: '#a78bfa' }}
                    >
                      19.6%
                    </text>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* 3. Recommendation to Win Cycle Time - Line Chart */}
            <GlassCard className="chart-card">
              <div className="chart-header">
                <div className="chart-title-group">
                  <Clock size={24} className="chart-icon" />
                  <div>
                    <h3 className="chart-title">Recommendation to Win Cycle Time</h3>
                    <p className="chart-subtitle">Days to close from recommendation</p>
                  </div>
                </div>
                <div className="chart-value-badge warning">
                  <span className="badge-value">32.4 days</span>
                  <span className="badge-trend">
                    <Clock size={14} />
                    Cycle Time
                  </span>
                </div>
              </div>
              <div style={{ width: '100%', height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={getCycleTimeTrendData}
                    margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
                  >
                    <defs>
                      <linearGradient id="colorDays" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#94a3b8"
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#94a3b8"
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      domain={timePeriod === 'All' ? [25, 55] : [25, 50]}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.98)', 
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                        borderRadius: '8px',
                        color: '#ffffff'
                      }}
                      formatter={(value) => [`${value} days`, 'Cycle Time']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="days" 
                      stroke="#f59e0b" 
                      strokeWidth={3}
                      dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                      fill="url(#colorDays)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* 4. Top Sales Rep by Recommendation Revenue - Vertical Bar Chart */}
            <GlassCard className="chart-card">
              <div className="chart-header">
                <div className="chart-title-group">
                  <Award size={24} className="chart-icon" />
                  <div>
                    <h3 className="chart-title">Top Sales Rep by Recommendation Revenue</h3>
                    <p className="chart-subtitle">Revenue leader</p>
                  </div>
                </div>
                <div className="chart-value-badge success">
                  <span className="badge-value">🏆</span>
                  <span className="badge-trend">
                    <Award size={14} />
                    Leader
                  </span>
                </div>
              </div>
              <div style={{ width: '100%', height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={[
                      { name: 'Rahul Sharma', revenue: 25.6, fill: '#22c55e' },
                      { name: 'Neha Singh', revenue: 22.3, fill: '#3b82f6' },
                      { name: 'Priya Patel', revenue: 18.9, fill: '#8b5cf6' }
                    ]}
                    margin={{ top: 20, right: 20, left: 10, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#94a3b8"
                      tick={{ fill: '#94a3b8', fontSize: 11 }}
                      angle={-15}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis 
                      stroke="#94a3b8"
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      label={{ value: '₹ Cr', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.98)', 
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                        borderRadius: '8px',
                        color: '#ffffff'
                      }}
                      formatter={(value) => [`₹${value} Cr`, 'Revenue']}
                    />
                    <Bar dataKey="revenue" radius={[8, 8, 0, 0]}>
                      {[
                        { name: 'Rahul Sharma', revenue: 25.6, fill: '#22c55e' },
                        { name: 'Neha Singh', revenue: 22.3, fill: '#3b82f6' },
                        { name: 'Priya Patel', revenue: 18.9, fill: '#8b5cf6' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* 5. Top Sales Rep by Conversion Rate - Horizontal Bar Chart */}
            <GlassCard className="chart-card">
              <div className="chart-header">
                <div className="chart-title-group">
                  <CheckCircle size={24} className="chart-icon" />
                  <div>
                    <h3 className="chart-title">Top Sales Rep by Conversion Rate</h3>
                    <p className="chart-subtitle">Conversion leader</p>
                  </div>
                </div>
                <div className="chart-value-badge success">
                  <span className="badge-value">⭐</span>
                  <span className="badge-trend">
                    <TrendingUp size={14} />
                    Leader
                  </span>
                </div>
              </div>
              <div style={{ width: '100%', height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={[
                      { name: 'Neha Singh', rate: 32.8 },
                      { name: 'Rahul Sharma', rate: 28.4 },
                      { name: 'Priya Patel', rate: 25.2 }
                    ]}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                    <XAxis 
                      type="number"
                      stroke="#94a3b8"
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      label={{ value: 'Conversion %', position: 'insideBottom', offset: -10, fill: '#94a3b8' }}
                    />
                    <YAxis 
                      type="category"
                      dataKey="name"
                      stroke="#94a3b8"
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(245, 158, 11, 0.1)' }}
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.98)', 
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                        borderRadius: '8px',
                        color: '#ffffff'
                      }}
                      formatter={(value) => [`${value}%`, 'Conversion']}
                    />
                    <Bar dataKey="rate" radius={[0, 8, 8, 0]}>
                      <Cell fill="#f59e0b" />
                      <Cell fill="#3b82f6" />
                      <Cell fill="#8b5cf6" />
                    </Bar>
                  </BarChart>
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
