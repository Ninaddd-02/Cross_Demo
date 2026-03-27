import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import SidebarNavigation from '../../components/SidebarNavigation/SidebarNavigation';
import TopNavbar from '../../components/TopNavbar/TopNavbar';
import GlassCard from '../../components/GlassCard/GlassCard';
import { calculateRepKPIs } from '../../data/sharedData';
import { Filter, TrendingUp, Activity, AlertTriangle, Target, RefreshCw, Zap } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  RadialBarChart, RadialBar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './RepDashboard.css';

const RepDashboard = () => {
  const { currentUser, tenantId } = useAuth();
  const [timePeriod, setTimePeriod] = useState('6M');
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Auto-refresh when tenant changes
  useEffect(() => {
    if (tenantId) {
      console.log('🔄 Tenant changed - refreshing dashboard');
      setRefreshKey(prev => prev + 1);
    }
  }, [tenantId]);
  
  // Get KPI data from tenant (recalculated when refreshKey changes)
  const kpiData = useMemo(() => calculateRepKPIs(), [refreshKey]);

  // Generate monthly revenue data (12 months)
  const generateMonthlyRevenue = (totalRevenue) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyAvg = totalRevenue / 12;
    
    return months.map((month, index) => ({
      month,
      revenue: Number((monthlyAvg * (0.85 + Math.random() * 0.3)).toFixed(2))
    }));
  };

  // Generate deal velocity distribution by stage
  const generateVelocityByStage = (avgVelocity) => {
    return [
      { stage: 'Prospecting', velocity: Math.round(avgVelocity * 0.15), fill: '#3b82f6' },
      { stage: 'Discovery', velocity: Math.round(avgVelocity * 0.20), fill: '#8b5cf6' },
      { stage: 'Proposal', velocity: Math.round(avgVelocity * 0.30), fill: '#06b6d4' },
      { stage: 'Negotiation', velocity: Math.round(avgVelocity * 0.35), fill: '#10b981' }
    ];
  };

  // Generate revenue at risk data
  const generateRiskData = (riskRevenue, totalRevenue) => {
    const atRisk = riskRevenue;
    const secured = totalRevenue - riskRevenue;
    
    return [
      { name: 'At Risk', value: Number((atRisk / 10000000).toFixed(2)), fill: '#ef4444' },
      { name: 'Secured', value: Number((secured / 10000000).toFixed(2)), fill: '#10b981' }
    ];
  };

  // Generate project duration distribution
  const generateDurationData = (avgDuration) => {
    return [
      { range: '0-30', count: Math.round(avgDuration * 0.1), fill: '#3b82f6' },
      { range: '31-60', count: Math.round(avgDuration * 0.25), fill: '#8b5cf6' },
      { range: '61-90', count: Math.round(avgDuration * 0.35), fill: '#06b6d4' },
      { range: '91-120', count: Math.round(avgDuration * 0.20), fill: '#f59e0b' },
      { range: '120+', count: Math.round(avgDuration * 0.10), fill: '#ef4444' }
    ];
  };

  // Generate renewal rate data (Cross-sell vs Upsell comparison)
  const generateRenewalComparisonData = () => {
    return [
      { 
        type: 'Cross Sell', 
        rate: parseFloat(kpiData.crossSellRenewalRate),
        fill: '#3b82f6'
      },
      { 
        type: 'Upsell', 
        rate: parseFloat(kpiData.upSellRenewalRate),
        fill: '#10b981'
      }
    ];
  };

  // Chart data
  const revenueData = useMemo(() => generateMonthlyRevenue(kpiData.totalRevenueRaw), [kpiData.totalRevenueRaw]);
  const velocityData = useMemo(() => generateVelocityByStage(kpiData.avgDealVelocity), [kpiData.avgDealVelocity]);
  const riskData = useMemo(() => generateRiskData(kpiData.revenueAtRiskRaw, kpiData.totalRevenueRaw), [kpiData.revenueAtRiskRaw, kpiData.totalRevenueRaw]);
  const durationData = useMemo(() => generateDurationData(kpiData.avgProjectDuration), [kpiData.avgProjectDuration]);
  const renewalComparisonData = useMemo(() => generateRenewalComparisonData(), [kpiData.crossSellRenewalRate, kpiData.upSellRenewalRate]);

  // Dynamic trend calculations
  const trends = useMemo(() => {
    const revenueGrowth = ((kpiData.totalRevenueRaw - (kpiData.totalRevenueRaw * 0.95)) / (kpiData.totalRevenueRaw * 0.95) * 100).toFixed(1);
    const velocityImprovement = 120 - kpiData.avgDealVelocity;
    const riskPercentage = (kpiData.revenueAtRiskRaw / kpiData.totalRevenueRaw * 100).toFixed(1);
    const durationTrend = ((kpiData.avgProjectDuration - 90) / 90 * 100).toFixed(1);
    const renewalImprovement = (parseFloat(kpiData.renewalRate) - 15).toFixed(1);
    const crossSellVsUpsell = (parseFloat(kpiData.crossSellRenewalRate) - parseFloat(kpiData.upSellRenewalRate)).toFixed(1);
    
    return {
      revenueGrowth,
      velocityImprovement,
      riskPercentage,
      durationTrend,
      renewalImprovement,
      crossSellVsUpsell
    };
  }, [kpiData]);

  // Gauge data for renewal rate
  const renewalGaugeData = [
    {
      name: 'Renewal Rate',
      value: parseFloat(kpiData.renewalRate),
      fill: '#10b981'
    }
  ];

  return (
    <div className="admin-layout">
      <SidebarNavigation role={currentUser?.role} />
      <div className="admin-content">
        <TopNavbar 
          title="Dashboard"
          subtitle="Sales Performance Analytics"
          user={currentUser?.name || "Sales Rep"}
        />
        
        <div className="page-body">
          {/* Time Period Filters */}
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

          {/* Charts Grid */}
          <div className="charts-grid">
            {/* Total Revenue - Line Chart */}
            <GlassCard className="chart-card">
              <div className="chart-header">
                <div className="chart-title-section">
                  <h3 className="chart-title">Total Revenue</h3>
                  <p className="chart-subtitle">Monthly trend</p>
                </div>
                <div className="chart-value-badge badge-blue">
                  <div className="badge-value">{kpiData.totalRevenue}</div>
                  <div className="badge-trend">
                    <TrendingUp size={12} /> +{trends.revenueGrowth}%
                  </div>
                </div>
              </div>
              <div className="chart-container" style={{ height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
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
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      fill="url(#revenueGradient)"
                      dot={{ fill: '#3b82f6', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Avg Deal Velocity - Horizontal Bar Chart */}
            <GlassCard className="chart-card">
              <div className="chart-header">
                <div className="chart-title-section">
                  <h3 className="chart-title">Deal Velocity by Stage</h3>
                  <p className="chart-subtitle">Days per stage</p>
                </div>
                <div className="chart-value-badge badge-green">
                  <div className="badge-value">{kpiData.avgDealVelocity} days</div>
                  <div className="badge-trend">
                    <Activity size={12} /> -{Math.round(trends.velocityImprovement)} days
                  </div>
                </div>
              </div>
              <div className="chart-container" style={{ height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={velocityData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                    <YAxis type="category" dataKey="stage" stroke="#94a3b8" fontSize={12} width={90} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                        border: '1px solid rgba(148, 163, 184, 0.2)',
                        borderRadius: '8px',
                        color: '#ffffff'
                      }}
                      labelStyle={{ color: '#ffffff' }}
                      itemStyle={{ color: '#ffffff' }}
                      formatter={(value) => `${value} days`}
                    />
                    <Bar dataKey="velocity" radius={[0, 8, 8, 0]}>
                      {velocityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Revenue at Risk - Donut Chart */}
            <GlassCard className="chart-card">
              <div className="chart-header">
                <div className="chart-title-section">
                  <h3 className="chart-title">Revenue at Risk</h3>
                  <p className="chart-subtitle">Risk vs Secured</p>
                </div>
                <div className="chart-value-badge badge-warning">
                  <div className="badge-value">{kpiData.revenueAtRisk}</div>
                  <div className="badge-trend">
                    <AlertTriangle size={12} /> {trends.riskPercentage}% of pipeline
                  </div>
                </div>
              </div>
              <div className="chart-container" style={{ height: '280px' }}>
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
                        <Cell key={`cell-${index}`} fill={entry.fill} />
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
                        `₹${Number(value).toFixed(2)} Cr`,
                        name
                      ]}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Project Duration - Bar Chart */}
            <GlassCard className="chart-card">
              <div className="chart-header">
                <div className="chart-title-section">
                  <h3 className="chart-title">Project Duration Distribution</h3>
                  <p className="chart-subtitle">Duration in days</p>
                </div>
                <div className="chart-value-badge badge-blue">
                  <div className="badge-value">{kpiData.avgProjectDuration} days</div>
                  <div className="badge-trend">
                    <Target size={12} /> {trends.durationTrend > 0 ? '+' : ''}{trends.durationTrend}%
                  </div>
                </div>
              </div>
              <div className="chart-container" style={{ height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={durationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="range" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                        border: '1px solid rgba(148, 163, 184, 0.2)',
                        borderRadius: '8px',
                        color: '#ffffff'
                      }}
                      labelStyle={{ color: '#ffffff' }}
                      itemStyle={{ color: '#ffffff' }}
                      formatter={(value) => `${value} projects`}
                    />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                      {durationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Renewal Rate - Gauge Chart */}
            <GlassCard className="chart-card">
              <div className="chart-header">
                <div className="chart-title-section">
                  <h3 className="chart-title">Overall Renewal Rate</h3>
                  <p className="chart-subtitle">Customer retention</p>
                </div>
                <div className="chart-value-badge badge-green">
                  <div className="badge-value">{kpiData.renewalRate}%</div>
                  <div className="badge-trend">
                    <RefreshCw size={12} /> +{trends.renewalImprovement}%
                  </div>
                </div>
              </div>
              <div className="chart-container" style={{ height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart 
                    cx="50%" 
                    cy="50%" 
                    innerRadius="60%" 
                    outerRadius="90%" 
                    data={renewalGaugeData}
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
                      className="gauge-text"
                      style={{ fontSize: '2.5rem', fontWeight: '700', fill: '#10b981' }}
                    >
                      {kpiData.renewalRate}%
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
                        `${value}%`,
                        'Renewal Rate'
                      ]}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Cross-Sell vs Upsell Comparison - Grouped Bar Chart */}
            <GlassCard className="chart-card">
              <div className="chart-header">
                <div className="chart-title-section">
                  <h3 className="chart-title">Cross-Sell vs Upsell Renewal Rate</h3>
                  <p className="chart-subtitle">Comparison analysis</p>
                </div>
                <div className="chart-value-badge badge-blue">
                  <div className="badge-value">
                    {parseFloat(kpiData.crossSellRenewalRate) > parseFloat(kpiData.upSellRenewalRate) 
                      ? 'Cross-Sell Leading' 
                      : 'Upsell Leading'}
                  </div>
                  <div className="badge-trend">
                    <Zap size={12} /> Δ {Math.abs(trends.crossSellVsUpsell)}%
                  </div>
                </div>
              </div>
              <div className="chart-container" style={{ height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={renewalComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="type" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                        border: '1px solid rgba(148, 163, 184, 0.2)',
                        borderRadius: '8px',
                        color: '#ffffff'
                      }}
                      labelStyle={{ color: '#ffffff' }}
                      itemStyle={{ color: '#ffffff' }}
                      formatter={(value) => `${value}%`}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                    />
                    <Bar 
                      dataKey="rate" 
                      name="Renewal Rate (%)"
                      radius={[8, 8, 0, 0]}
                      barSize={80}
                    >
                      {renewalComparisonData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepDashboard;