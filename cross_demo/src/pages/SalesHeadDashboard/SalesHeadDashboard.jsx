import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SidebarNavigation from '../../components/SidebarNavigation/SidebarNavigation';
import TopNavbar from '../../components/TopNavbar/TopNavbar';
import GlassCard from '../../components/GlassCard/GlassCard';
import { 
  TrendingUp, 
  Target,
  BarChart3,
  ArrowUp,
  Activity,
  Star
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, ComposedChart, Scatter, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { 
  calculateHeadKPIs
} from '../../data/sharedData';
import './SalesHeadDashboard.css';

const SalesHeadDashboard = () => {
  const navigate = useNavigate();
  const { tenantId } = useAuth();
  const [timePeriod, setTimePeriod] = useState('6M');
  const [refreshKey, setRefreshKey] = useState(0);

  // Auto-refresh when tenant changes
  useEffect(() => {
    if (tenantId) {
      console.log('🔄 Tenant changed - refreshing head dashboard');
      setRefreshKey(prev => prev + 1);
    }
  }, [tenantId]);

  // Calculate Head KPIs from tenant data (SalesHead section)
  const kpiData = useMemo(() => calculateHeadKPIs(), [refreshKey]);

  // Generate cross-sell revenue data based on time period
  const getCrossSellRevenueData = useMemo(() => {
    switch (timePeriod) {
      case '3M':
        return [
          { quarter: 'Oct', revenue: 19.2 },
          { quarter: 'Nov', revenue: 19.5 },
          { quarter: 'Dec', revenue: 19.79 }
        ];
      case '6M':
        return [
          { quarter: 'Jul', revenue: 17.8 },
          { quarter: 'Aug', revenue: 18.3 },
          { quarter: 'Sep', revenue: 18.9 },
          { quarter: 'Oct', revenue: 19.2 },
          { quarter: 'Nov', revenue: 19.5 },
          { quarter: 'Dec', revenue: 19.79 }
        ];
      case '1Y':
        return [
          { quarter: 'Jan', revenue: 14.5 },
          { quarter: 'Feb', revenue: 15.2 },
          { quarter: 'Mar', revenue: 15.8 },
          { quarter: 'Apr', revenue: 16.2 },
          { quarter: 'May', revenue: 17.1 },
          { quarter: 'Jun', revenue: 17.6 },
          { quarter: 'Jul', revenue: 17.8 },
          { quarter: 'Aug', revenue: 18.3 },
          { quarter: 'Sep', revenue: 18.9 },
          { quarter: 'Oct', revenue: 19.2 },
          { quarter: 'Nov', revenue: 19.5 },
          { quarter: 'Dec', revenue: 19.79 }
        ];
      case 'All':
        return [
          { quarter: 'Q1 2024', revenue: 12.8 },
          { quarter: 'Q2 2024', revenue: 14.2 },
          { quarter: 'Q3 2024', revenue: 15.6 },
          { quarter: 'Q4 2024', revenue: 16.2 },
          { quarter: 'Q1 2025', revenue: 17.2 },
          { quarter: 'Q2 2025', revenue: 18.1 },
          { quarter: 'Q3 2025', revenue: 18.9 },
          { quarter: 'Q4 2025', revenue: 19.79 }
        ];
      default:
        return [
          { quarter: 'Jul', revenue: 17.8 },
          { quarter: 'Aug', revenue: 18.3 },
          { quarter: 'Sep', revenue: 18.9 },
          { quarter: 'Oct', revenue: 19.2 },
          { quarter: 'Nov', revenue: 19.5 },
          { quarter: 'Dec', revenue: 19.79 }
        ];
    }
  }, [timePeriod]);

  // Generate upsell revenue data based on time period
  const getUpsellRevenueData = useMemo(() => {
    switch (timePeriod) {
      case '3M':
        return [
          { quarter: 'Oct', revenue: 11.8 },
          { quarter: 'Nov', revenue: 12.3 },
          { quarter: 'Dec', revenue: 12.66 }
        ];
      case '6M':
        return [
          { quarter: 'Jul', revenue: 10.2 },
          { quarter: 'Aug', revenue: 10.6 },
          { quarter: 'Sep', revenue: 11.1 },
          { quarter: 'Oct', revenue: 11.8 },
          { quarter: 'Nov', revenue: 12.3 },
          { quarter: 'Dec', revenue: 12.66 }
        ];
      case '1Y':
        return [
          { quarter: 'Jan', revenue: 8.2 },
          { quarter: 'Feb', revenue: 8.6 },
          { quarter: 'Mar', revenue: 8.9 },
          { quarter: 'Apr', revenue: 9.8 },
          { quarter: 'May', revenue: 10.1 },
          { quarter: 'Jun', revenue: 10.4 },
          { quarter: 'Jul', revenue: 10.6 },
          { quarter: 'Aug', revenue: 11.0 },
          { quarter: 'Sep', revenue: 11.2 },
          { quarter: 'Oct', revenue: 11.8 },
          { quarter: 'Nov', revenue: 12.3 },
          { quarter: 'Dec', revenue: 12.66 }
        ];
      case 'All':
        return [
          { quarter: 'Q1 2024', revenue: 7.8 },
          { quarter: 'Q2 2024', revenue: 8.5 },
          { quarter: 'Q3 2024', revenue: 9.2 },
          { quarter: 'Q4 2024', revenue: 9.8 },
          { quarter: 'Q1 2025', revenue: 10.4 },
          { quarter: 'Q2 2025', revenue: 11.0 },
          { quarter: 'Q3 2025', revenue: 11.8 },
          { quarter: 'Q4 2025', revenue: 12.66 }
        ];
      default:
        return [
          { quarter: 'Jul', revenue: 10.2 },
          { quarter: 'Aug', revenue: 10.6 },
          { quarter: 'Sep', revenue: 11.1 },
          { quarter: 'Oct', revenue: 11.8 },
          { quarter: 'Nov', revenue: 12.3 },
          { quarter: 'Dec', revenue: 12.66 }
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

  // Log KPI data for verification
  console.log('📊 Sales Head KPIs:', {
    crossSellRevenue: kpiData.crossSellRevenue,
    upsellRevenue: kpiData.upsellRevenue,
    topCrossSellService: kpiData.topCrossSellService,
    topUpsellService: kpiData.topUpsellService,
    topRegion: kpiData.topRegion
  });

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

          {/* KPI Cards Grid */}
          <div className="charts-grid">
            {/* 1. Cross-Sell Revenue - Vertical Bar Chart */}
            <GlassCard className="chart-card">
              <div className="chart-header">
                <div className="chart-title-group">
                  <TrendingUp size={24} className="chart-icon" style={{ color: '#0176d3' }} />
                  <div>
                    <h3 className="chart-title">Cross-Sell Revenue</h3>
                    <p className="chart-subtitle">Total cross-sell revenue</p>
                  </div>
                </div>
                <div className="chart-value-badge" style={{ background: 'rgba(1, 118, 211, 0.1)', color: '#0176d3' }}>
                  <span className="badge-value">{kpiData.crossSellRevenue}</span>
                </div>
              </div>
              <div style={{ width: '100%', height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={getCrossSellRevenueData}
                    margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                    <XAxis 
                      dataKey="quarter" 
                      stroke="#94a3b8"
                      tick={{ fill: '#94a3b8', fontSize: 14 }}
                    />
                    <YAxis 
                      stroke="#94a3b8"
                      tick={{ fill: '#94a3b8', fontSize: 14 }}
                      label={{ value: '₹ Cr', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(1, 118, 211, 0.1)' }}
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.98)', 
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                        borderRadius: '8px',
                        color: '#ffffff'
                      }}
                      formatter={(value) => [`₹${value} Cr`, 'Revenue']}
                    />
                    <Bar dataKey="revenue" fill="#0176d3" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* 2. Upsell Revenue - Area Chart */}
            <GlassCard className="chart-card">
              <div className="chart-header">
                <div className="chart-title-group">
                  <ArrowUp size={24} className="chart-icon" style={{ color: '#22c55e' }} />
                  <div>
                    <h3 className="chart-title">Upsell Revenue</h3>
                    <p className="chart-subtitle">Total upsell revenue</p>
                  </div>
                </div>
                <div className="chart-value-badge" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>
                  <span className="badge-value">{kpiData.upsellRevenue}</span>
                </div>
              </div>
              <div style={{ width: '100%', height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart 
                    data={getUpsellRevenueData}
                    margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
                  >
                    <defs>
                      <linearGradient id="colorUpsell" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                    <XAxis 
                      dataKey="quarter" 
                      stroke="#94a3b8"
                      tick={{ fill: '#94a3b8', fontSize: 14 }}
                    />
                    <YAxis 
                      stroke="#94a3b8"
                      tick={{ fill: '#94a3b8', fontSize: 14 }}
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
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#22c55e" 
                      strokeWidth={3}
                      fill="url(#colorUpsell)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* 3. Top Cross-Sell Service - Pie Chart */}
            <GlassCard className="chart-card">
              <div className="chart-header">
                <div className="chart-title-group">
                  <Target size={24} className="chart-icon" style={{ color: '#f59e0b' }} />
                  <div>
                    <h3 className="chart-title">Top Cross-Sell Service</h3>
                    <p className="chart-subtitle">Leading service for cross-sell</p>
                  </div>
                </div>
                <div className="chart-value-badge" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                  <span className="badge-value">🏆 {kpiData.topCrossSellService}</span>
                </div>
              </div>
              <div style={{ width: '100%', height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Digital', value: 35, fill: '#f59e0b' },
                        { name: 'Cloud', value: 28, fill: '#3b82f6' },
                        { name: 'Analytics', value: 22, fill: '#8b5cf6' },
                        { name: 'Others', value: 15, fill: '#64748b' }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {[
                        { name: 'Digital', value: 35, fill: '#f59e0b' },
                        { name: 'Cloud', value: 28, fill: '#3b82f6' },
                        { name: 'Analytics', value: 22, fill: '#8b5cf6' },
                        { name: 'Others', value: 15, fill: '#64748b' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.98)', 
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '12px'
                      }}
                      formatter={(value) => [`${value}%`, 'Share']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* 4. Top Upsell Service - Stacked Bar Chart */}
            <GlassCard className="chart-card">
              <div className="chart-header">
                <div className="chart-title-group">
                  <Activity size={24} className="chart-icon" style={{ color: '#8b5cf6' }} />
                  <div>
                    <h3 className="chart-title">Top Upsell Service</h3>
                    <p className="chart-subtitle">Leading service for upsell</p>
                  </div>
                </div>
                <div className="chart-value-badge" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
                  <span className="badge-value">⭐ {kpiData.topUpsellService}</span>
                </div>
              </div>
              <div style={{ width: '100%', height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={[
                      { service: 'Data Eng.', crossSell: 15, upsell: 32 },
                      { service: 'Digital', crossSell: 35, upsell: 18 },
                      { service: 'Cloud', crossSell: 28, upsell: 22 },
                      { service: 'Analytics', crossSell: 22, upsell: 28 }
                    ]}
                    margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                    <XAxis 
                      dataKey="service" 
                      stroke="#94a3b8"
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#94a3b8"
                      tick={{ fill: '#94a3b8', fontSize: 14 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.98)', 
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                        borderRadius: '8px',
                        color: '#ffffff'
                      }}
                    />
                    <Bar dataKey="crossSell" stackId="a" fill="#f59e0b" radius={[8, 8, 0, 0]} name="Cross-Sell" />
                    <Bar dataKey="upsell" stackId="a" fill="#8b5cf6" radius={[8, 8, 0, 0]} name="Upsell" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* 5. Top Region by Recommendation Revenue - Horizontal Bar Chart */}
            <GlassCard className="chart-card">
              <div className="chart-header">
                <div className="chart-title-group">
                  <BarChart3 size={24} className="chart-icon" style={{ color: '#06b6d4' }} />
                  <div>
                    <h3 className="chart-title">Top Region</h3>
                    <p className="chart-subtitle">By recommendation revenue</p>
                  </div>
                </div>
                <div className="chart-value-badge" style={{ background: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4' }}>
                  <span className="badge-value">📍 {kpiData.topRegion}</span>
                </div>
              </div>
              <div style={{ width: '100%', height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={[
                      { region: 'West', revenue: 32.5 },
                      { region: 'North', revenue: 28.3 },
                      { region: 'South', revenue: 24.8 },
                      { region: 'East', revenue: 18.9 }
                    ]}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                    <XAxis 
                      type="number"
                      stroke="#94a3b8"
                      tick={{ fill: '#94a3b8', fontSize: 14 }}
                      label={{ value: '₹ Cr', position: 'insideBottom', offset: -10, fill: '#94a3b8' }}
                    />
                    <YAxis 
                      type="category"
                      dataKey="region"
                      stroke="#94a3b8"
                      tick={{ fill: '#94a3b8', fontSize: 14 }}
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(6, 182, 212, 0.1)' }}
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.98)', 
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                        borderRadius: '8px',
                        color: '#ffffff'
                      }}
                      formatter={(value) => [`₹${value} Cr`, 'Revenue']}
                    />
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
                  <Star size={24} className="chart-icon" style={{ color: '#a855f7' }} />
                  <div>
                    <h3 className="chart-title">Top Recommended Account</h3>
                    <p className="chart-subtitle">Revenue over time</p>
                  </div>
                </div>
                <div className="chart-value-badge" style={{ background: 'rgba(168,85,247,0.1)', color: '#a855f7' }}>
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
                      <linearGradient id="head-revenueGrad" x1="0" y1="0" x2="0" y2="1">
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
        </div>
      </div>
    </div>
  );
};

export default SalesHeadDashboard;
