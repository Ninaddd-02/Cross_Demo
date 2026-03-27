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

  // Data Generation Functions - Dynamic based on real KPI data
  const generateMonthlyRevenue = (totalRevenue) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const avgMonthly = totalRevenue / 10000000 / 12;
    return months.map((month, index) => {
      const variation = (Math.random() - 0.5) * 0.3;
      const revenue = avgMonthly * (1 + variation);
      const target = avgMonthly * 0.95;
      return { 
        month, 
        revenue: Math.round(revenue * 10) / 10, 
        target: Math.round(target * 10) / 10 
      };
    });
  };

  const generateVelocityByStage = (avgVelocity) => {
    return [
      { stage: 'Prospecting', days: Math.round(avgVelocity * 0.15), fill: '#3b82f6' },
      { stage: 'Qualification', days: Math.round(avgVelocity * 0.20), fill: '#0176d3' },
      { stage: 'Proposal', days: Math.round(avgVelocity * 0.30), fill: '#1b96ff' },
      { stage: 'Negotiation', days: Math.round(avgVelocity * 0.35), fill: '#00d1ff' }
    ];
  };

  const generateServiceLineData = (topServiceLine, totalRevenue) => {
    const serviceLines = ['Cloud', 'Digital', 'Infrastructure', 'Security', 'Analytics'];
    return serviceLines.map(service => {
      const isTop = service === topServiceLine;
      const baseRevenue = totalRevenue / 10000000;
      const revenue = isTop 
        ? baseRevenue * 0.35 
        : baseRevenue * (0.1 + Math.random() * 0.15);
      return {
        service,
        revenue: Math.round(revenue * 10) / 10,
        fill: isTop ? '#0176d3' : '#1b96ff'
      };
    }).sort((a, b) => b.revenue - a.revenue);
  };

  const generateTechnologyData = (topTechnology, totalRevenue) => {
    const technologies = ['Project Management', 'CRM', 'Analytics', 'Cloud Platform', 'Security'];
    return technologies.map(tech => {
      const isTop = tech === topTechnology;
      const baseRevenue = totalRevenue / 10000000;
      const revenue = isTop 
        ? baseRevenue * 0.30 
        : baseRevenue * (0.12 + Math.random() * 0.12);
      return {
        technology: tech,
        revenue: Math.round(revenue * 10) / 10,
        fill: isTop ? '#22c55e' : '#86efac'
      };
    }).sort((a, b) => b.revenue - a.revenue);
  };

  const generateRegionData = (topRegion, totalRevenue) => {
    const regions = ['West', 'North', 'South', 'East'];
    return regions.map(region => {
      const isTop = region === topRegion;
      const percentage = isTop 
        ? 35 + Math.random() * 10 
        : 15 + Math.random() * 10;
      return {
        name: region,
        value: Math.round(percentage * 10) / 10,
        color: isTop ? '#0176d3' : (region === 'North' ? '#1b96ff' : (region === 'South' ? '#00d1ff' : '#86efac'))
      };
    });
  };

  // Chart Data - All dynamic based on real KPIs
  const revenueData = useMemo(() => generateMonthlyRevenue(kpiData.totalRevenueRaw), [kpiData.totalRevenueRaw]);
  const velocityData = useMemo(() => generateVelocityByStage(kpiData.avgDealVelocity), [kpiData.avgDealVelocity]);
  
  const riskData = useMemo(() => [
    { name: 'Secured Revenue', value: kpiData.totalRevenueRaw - kpiData.revenueAtRiskRaw, color: '#22c55e' },
    { name: 'Revenue at Risk', value: kpiData.revenueAtRiskRaw, color: '#f59e0b' }
  ], [kpiData.totalRevenueRaw, kpiData.revenueAtRiskRaw]);

  const serviceLineData = useMemo(() => generateServiceLineData(kpiData.topServiceLine, kpiData.totalRevenueRaw), [kpiData.topServiceLine, kpiData.totalRevenueRaw]);
  const technologyData = useMemo(() => generateTechnologyData(kpiData.topTechnology, kpiData.totalRevenueRaw), [kpiData.topTechnology, kpiData.totalRevenueRaw]);
  const regionData = useMemo(() => generateRegionData(kpiData.topRegion, kpiData.totalRevenueRaw), [kpiData.topRegion, kpiData.totalRevenueRaw]);

  // Velocity Gauge Data
  const velocityGaugeData = useMemo(() => [{
    name: 'Velocity',
    value: kpiData.avgDealVelocity,
    fill: kpiData.avgDealVelocity < 70 ? '#22c55e' : (kpiData.avgDealVelocity < 100 ? '#f59e0b' : '#ef4444')
  }], [kpiData.avgDealVelocity]);

  // Dynamic Trend Calculations
  const trends = useMemo(() => {
    // Revenue Growth: Compare to target (assuming 95% of actual is target)
    const targetRevenue = kpiData.totalRevenueRaw * 0.95;
    const revenueGrowth = ((kpiData.totalRevenueRaw - targetRevenue) / targetRevenue * 100).toFixed(1);
    
    // Velocity Improvement: Compare to industry benchmark (120 days)
    const benchmarkVelocity = 120;
    const velocityImprovement = benchmarkVelocity - kpiData.avgDealVelocity;
    
    // Risk Percentage: Calculate actual percentage
    const riskPercentage = ((kpiData.revenueAtRiskRaw / kpiData.totalRevenueRaw) * 100).toFixed(1);
    
    // Service Line Percentage: Calculate top performer's share
    const topServiceRevenue = serviceLineData.find(s => s.service === kpiData.topServiceLine)?.revenue || 0;
    const totalServiceRevenue = serviceLineData.reduce((sum, s) => sum + s.revenue, 0);
    const serviceLinePercentage = totalServiceRevenue > 0 ? ((topServiceRevenue / totalServiceRevenue) * 100).toFixed(1) : 0;
    
    // Technology Percentage: Calculate top tech's share
    const topTechRevenue = technologyData.find(t => t.technology === kpiData.topTechnology)?.revenue || 0;
    const totalTechRevenue = technologyData.reduce((sum, t) => sum + t.revenue, 0);
    const technologyPercentage = totalTechRevenue > 0 ? ((topTechRevenue / totalTechRevenue) * 100).toFixed(1) : 0;
    
    // Region Percentage: Calculate top region's share
    const topRegionShare = regionData.find(r => r.name === kpiData.topRegion)?.value || 0;
    
    return {
      revenueGrowth,
      velocityImprovement,
      riskPercentage,
      serviceLinePercentage,
      technologyPercentage,
      topRegionShare: topRegionShare.toFixed(1)
    };
  }, [kpiData, serviceLineData, technologyData, regionData]);

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

          {/* Chart-Based KPIs Grid */}
          <div className="charts-grid">
            
            {/* 1. Total Revenue - Line Chart */}
            <GlassCard className="chart-card large-chart">
              <div className="chart-header">
                <div className="chart-title-group">
                  <TrendingUp size={24} className="chart-icon" />
                  <div>
                    <h3 className="chart-title">Total Revenue</h3>
                    <p className="chart-subtitle">Monthly revenue trends</p>
                  </div>
                </div>
                <div className="chart-value-badge success">
                  <span className="badge-value">{kpiData.totalRevenue}</span>
                  <span className="badge-trend">
                    <ArrowUp size={14} />
                    +{trends.revenueGrowth}%
                  </span>
                </div>
              </div>
              <div style={{ width: '100%', height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                    <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '0.75rem' }} />
                    <YAxis stroke="#6b7280" style={{ fontSize: '0.75rem' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                        border: '1px solid rgba(148, 163, 184, 0.2)',
                        borderRadius: '8px',
                        color: '#ffffff'
                      }}
                      labelStyle={{ color: '#ffffff' }}
                      itemStyle={{ color: '#ffffff' }}
                      formatter={(value) => `₹${Number(value).toFixed(2)} Cr`}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#0176d3" 
                      strokeWidth={3}
                      dot={{ fill: '#0176d3', r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Revenue (Cr)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="target" 
                      stroke="#22c55e" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: '#22c55e', r: 3 }}
                      name="Target (Cr)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* 2. Avg Deal Velocity - Gauge Chart */}
            <GlassCard className="chart-card large-chart">
              <div className="chart-header">
                <div className="chart-title-group">
                  <Activity size={24} className="chart-icon" />
                  <div>
                    <h3 className="chart-title">Avg Deal Velocity</h3>
                    <p className="chart-subtitle">Time to close deals</p>
                  </div>
                </div>
                <div className="chart-value-badge warning">
                  <span className="badge-value">{kpiData.avgDealVelocity} days</span>
                  <span className="badge-trend">
                    <ArrowDown size={14} />
                    -{Math.round(trends.velocityImprovement)} days
                  </span>
                </div>
              </div>
              <div style={{ width: '100%', height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart 
                    cx="50%" 
                    cy="50%" 
                    innerRadius="60%" 
                    outerRadius="100%" 
                    data={velocityGaugeData}
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
                      y="45%" 
                      textAnchor="middle" 
                      dominantBaseline="middle" 
                      className="gauge-value"
                      fill="#1f2937"
                      fontSize="32"
                      fontWeight="700"
                    >
                      {kpiData.avgDealVelocity}
                    </text>
                    <text 
                      x="50%" 
                      y="60%" 
                      textAnchor="middle" 
                      dominantBaseline="middle"
                      fill="#6b7280"
                      fontSize="14"
                      fontWeight="500"
                    >
                      days to close
                    </text>
                    <Tooltip 
                      cursor={false}
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.98)', 
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                        color: '#ffffff'
                      }}
                      labelStyle={{ 
                        color: '#94a3b8', 
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        marginBottom: '4px'
                      }}
                      itemStyle={{ 
                        color: '#ffffff',
                        fontSize: '0.875rem',
                        fontWeight: '600'
                      }}
                      formatter={(value, name) => [
                        value || value === 0 ? `${value} days` : 'No data',
                        'Deal Velocity'
                      ]}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* 3. Revenue at Risk - Donut Chart */}
            <GlassCard className="chart-card">
              <div className="chart-header">
                <div className="chart-title-group">
                  <AlertTriangle size={24} className="chart-icon warning" />
                  <div>
                    <h3 className="chart-title">Revenue at Risk</h3>
                    <p className="chart-subtitle">Risk vs secured revenue</p>
                  </div>
                </div>
                <div className="chart-value-badge warning">
                  <span className="badge-value">{kpiData.revenueAtRisk}</span>
                  <span className="badge-trend">{trends.riskPercentage}%</span>
                </div>
              </div>
              <div style={{ width: '100%', height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {riskData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      cursor={false}
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.98)', 
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                        color: '#ffffff'
                      }}
                      labelStyle={{ 
                        color: '#94a3b8', 
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        marginBottom: '4px'
                      }}
                      itemStyle={{ 
                        color: '#ffffff',
                        fontSize: '0.875rem',
                        fontWeight: '600'
                      }}
                      formatter={(value, name) => [
                        value || value === 0 ? `₹${Number(value / 10000000).toFixed(2)} Cr` : 'No data',
                        name
                      ]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* 4. Top Service Line - Bar Chart */}
            <GlassCard className="chart-card">
              <div className="chart-header">
                <div className="chart-title-group">
                  <Briefcase size={24} className="chart-icon" />
                  <div>
                    <h3 className="chart-title">Service Line Revenue</h3>
                    <p className="chart-subtitle">Revenue by service line</p>
                  </div>
                </div>
                <div className="chart-value-badge success">
                  <span className="badge-value">{kpiData.topServiceLine}</span>
                  <span className="badge-trend">{trends.serviceLinePercentage}%</span>
                </div>
              </div>
              <div style={{ width: '100%', height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={serviceLineData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                    <XAxis 
                      dataKey="service" 
                      stroke="#6b7280"
                      angle={-20}
                      textAnchor="end"
                      height={60}
                      style={{ fontSize: '0.75rem' }}
                    />
                    <YAxis stroke="#6b7280" style={{ fontSize: '0.75rem' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                        border: '1px solid rgba(148, 163, 184, 0.2)',
                        borderRadius: '8px',
                        color: '#ffffff'
                      }}
                      labelStyle={{ color: '#ffffff' }}
                      itemStyle={{ color: '#ffffff' }}
                    />
                    <Bar dataKey="revenue" name="Revenue (Cr)" radius={[8, 8, 0, 0]}>
                      {serviceLineData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* 5. Top Technology - Horizontal Bar Chart */}
            <GlassCard className="chart-card">
              <div className="chart-header">
                <div className="chart-title-group">
                  <Zap size={24} className="chart-icon" />
                  <div>
                    <h3 className="chart-title">Technology Contribution</h3>
                    <p className="chart-subtitle">Revenue by technology</p>
                  </div>
                </div>
                <div className="chart-value-badge success">
                  <span className="badge-value">{kpiData.topTechnology}</span>
                  <span className="badge-trend">{trends.technologyPercentage}%</span>
                </div>
              </div>
              <div style={{ width: '100%', height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={technologyData} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                    <XAxis type="number" stroke="#6b7280" style={{ fontSize: '0.75rem' }} />
                    <YAxis 
                      dataKey="technology" 
                      type="category" 
                      stroke="#6b7280"
                      width={120}
                      style={{ fontSize: '0.75rem' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                        border: '1px solid rgba(148, 163, 184, 0.2)',
                        borderRadius: '8px',
                        color: '#ffffff'
                      }}
                      labelStyle={{ color: '#ffffff' }}
                      itemStyle={{ color: '#ffffff' }}
                      formatter={(value) => `₹${Number(value).toFixed(2)} Cr`}
                    />
                    <Bar dataKey="revenue" name="Revenue (Cr)" radius={[0, 8, 8, 0]}>
                      {technologyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* 6. Top Region - Pie Chart */}
            <GlassCard className="chart-card">
              <div className="chart-header">
                <div className="chart-title-group">
                  <MapPin size={24} className="chart-icon" />
                  <div>
                    <h3 className="chart-title">Region Distribution</h3>
                    <p className="chart-subtitle">Regional revenue split</p>
                  </div>
                </div>
                <div className="chart-value-badge success">
                  <span className="badge-value">{kpiData.topRegion}</span>
                  <span className="badge-trend">{trends.topRegionShare}%</span>
                </div>
              </div>
              <div style={{ width: '100%', height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={regionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name} ${value}%`}
                      outerRadius={90}
                      dataKey="value"
                    >
                      {regionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      cursor={false}
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.98)', 
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                        color: '#ffffff'
                      }}
                      labelStyle={{ 
                        color: '#94a3b8', 
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        marginBottom: '4px'
                      }}
                      itemStyle={{ 
                        color: '#ffffff',
                        fontSize: '0.875rem',
                        fontWeight: '600'
                      }}
                      formatter={(value, name) => [
                        value || value === 0 ? `${Number(value).toFixed(1)}%` : 'No data',
                        name
                      ]}
                    />
                  </PieChart>
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