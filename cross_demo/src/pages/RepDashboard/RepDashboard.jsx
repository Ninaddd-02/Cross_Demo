import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import SidebarNavigation from '../../components/SidebarNavigation/SidebarNavigation';
import TopNavbar from '../../components/TopNavbar/TopNavbar';
import GlassCard from '../../components/GlassCard/GlassCard';
import { calculateRepKPIs } from '../../data/sharedData';
import { Filter, TrendingUp, Activity, AlertTriangle, Target, RefreshCw, Zap } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  RadialBarChart, RadialBar, ScatterChart, Scatter, ZAxis,
  ComposedChart,
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

  // Calculate total wins
  const totalWins = kpiData.crossSellWins + kpiData.upsellWins;

  // Top Recommended Account scatter+line data by time period
  const getAccountEngagementData = useMemo(() => {
    switch (timePeriod) {
      case '3M':
        return [
          { month: 'Oct', revenue: 52.4, confidence: 91 },
          { month: 'Nov', revenue: 60.1, confidence: 96 },
          { month: 'Dec', revenue: 74.3, confidence: 100 },
        ];
      case '6M':
        return [
          { month: 'Jul', revenue: 28.5, confidence: 70 },
          { month: 'Aug', revenue: 36.2, confidence: 78 },
          { month: 'Sep', revenue: 44.8, confidence: 85 },
          { month: 'Oct', revenue: 52.4, confidence: 91 },
          { month: 'Nov', revenue: 60.1, confidence: 96 },
          { month: 'Dec', revenue: 74.3, confidence: 100 },
        ];
      case '1Y':
        return [
          { month: 'Jan', revenue: 12.1, confidence: 52 },
          { month: 'Feb', revenue: 16.3, confidence: 58 },
          { month: 'Mar', revenue: 20.5, confidence: 63 },
          { month: 'Apr', revenue: 24.8, confidence: 67 },
          { month: 'May', revenue: 28.5, confidence: 70 },
          { month: 'Jun', revenue: 36.2, confidence: 78 },
          { month: 'Jul', revenue: 40.1, confidence: 82 },
          { month: 'Aug', revenue: 44.8, confidence: 85 },
          { month: 'Sep', revenue: 50.2, confidence: 89 },
          { month: 'Oct', revenue: 52.4, confidence: 91 },
          { month: 'Nov', revenue: 60.1, confidence: 96 },
          { month: 'Dec', revenue: 74.3, confidence: 100 },
        ];
      case 'All':
        return [
          { month: 'Q1\'24', revenue: 8.2,  confidence: 42 },
          { month: 'Q2\'24', revenue: 14.5, confidence: 55 },
          { month: 'Q3\'24', revenue: 22.3, confidence: 64 },
          { month: 'Q4\'24', revenue: 31.8, confidence: 73 },
          { month: 'Q1\'25', revenue: 42.1, confidence: 83 },
          { month: 'Q2\'25', revenue: 52.4, confidence: 91 },
          { month: 'Q3\'25', revenue: 62.8, confidence: 97 },
          { month: 'Q4\'25', revenue: 74.3, confidence: 100 },
        ];
      default:
        return [
          { month: 'Jul', revenue: 28.5, confidence: 70 },
          { month: 'Aug', revenue: 36.2, confidence: 78 },
          { month: 'Sep', revenue: 44.8, confidence: 85 },
          { month: 'Oct', revenue: 52.4, confidence: 91 },
          { month: 'Nov', revenue: 60.1, confidence: 96 },
          { month: 'Dec', revenue: 74.3, confidence: 100 },
        ];
    }
  }, [timePeriod]);

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

          {/* KPI Cards Grid - 6 Cards */}
          <div className="charts-grid">

            {/* 1. Cross-Sell Revenue */}
            <GlassCard className="chart-card">
              <div className="chart-header">
                <div className="chart-title-section">
                  <h3 className="chart-title">Cross-Sell Revenue</h3>
                  <p className="chart-subtitle">Total cross-sell revenue</p>
                </div>
                <div className="chart-value-badge badge-blue">
                  <div className="badge-value">{kpiData.crossSellRevenue}</div>
                </div>
              </div>
              <div className="chart-container" style={{ height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[{ quarter: 'Q1', revenue: 15.2 }, { quarter: 'Q2', revenue: 18.5 }, { quarter: 'Q3', revenue: 20.8 }, { quarter: 'Q4', revenue: 19.8 }]} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                    <XAxis dataKey="quarter" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 14 }} />
                    <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 14 }} label={{ value: '₹ Cr', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.98)', border: '1px solid rgba(148, 163, 184, 0.3)', borderRadius: '8px', color: '#ffffff' }} formatter={(value) => [`₹${value} Cr`, 'Revenue']} />
                    <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* 2. Upsell Revenue */}
            <GlassCard className="chart-card">
              <div className="chart-header">
                <div className="chart-title-section">
                  <h3 className="chart-title">Upsell Revenue</h3>
                  <p className="chart-subtitle">Total upsell revenue</p>
                </div>
                <div className="chart-value-badge badge-green">
                  <div className="badge-value">{kpiData.upsellRevenue}</div>
                </div>
              </div>
              <div className="chart-container" style={{ height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[{ quarter: 'Q1', revenue: 9.2 }, { quarter: 'Q2', revenue: 11.1 }, { quarter: 'Q3', revenue: 12.4 }, { quarter: 'Q4', revenue: 11.8 }]} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                    <XAxis dataKey="quarter" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 14 }} />
                    <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 14 }} label={{ value: '₹ Cr', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.98)', border: '1px solid rgba(148, 163, 184, 0.3)', borderRadius: '8px', color: '#ffffff' }} formatter={(value) => [`₹${value} Cr`, 'Revenue']} />
                    <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* 3. Top Cross-Sell Service */}
            <GlassCard className="chart-card">
              <div className="chart-header">
                <div className="chart-title-section">
                  <h3 className="chart-title">Top Cross-Sell Service</h3>
                  <p className="chart-subtitle">Leading service for cross-sell</p>
                </div>
                <div className="chart-value-badge badge-blue">
                  <div className="badge-value">🏆 {kpiData.topCrossSellService}</div>
                </div>
              </div>
              <div className="chart-container" style={{ height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={[{ name: kpiData.topCrossSellService, value: 35, fill: '#f59e0b' }, { name: 'Cloud', value: 28, fill: '#3b82f6' }, { name: 'Analytics', value: 22, fill: '#8b5cf6' }, { name: 'Others', value: 15, fill: '#64748b' }]} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} dataKey="value">
                      {[{ fill: '#f59e0b' }, { fill: '#3b82f6' }, { fill: '#8b5cf6' }, { fill: '#64748b' }].map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.98)', border: '1px solid rgba(148, 163, 184, 0.3)', borderRadius: '8px', color: '#ffffff', fontSize: '12px' }} formatter={(value) => [`${value}%`, 'Share']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* 4. Top Upsell Service */}
            <GlassCard className="chart-card">
              <div className="chart-header">
                <div className="chart-title-section">
                  <h3 className="chart-title">Top Upsell Service</h3>
                  <p className="chart-subtitle">Leading service for upsell</p>
                </div>
                <div className="chart-value-badge badge-green">
                  <div className="badge-value">⭐ {kpiData.topUpsellService}</div>
                </div>
              </div>
              <div className="chart-container" style={{ height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[{ service: kpiData.topUpsellService?.substring(0, 8), crossSell: 15, upsell: 32 }, { service: kpiData.topCrossSellService, crossSell: 35, upsell: 18 }, { service: 'Cloud', crossSell: 28, upsell: 22 }, { service: 'Analytics', crossSell: 22, upsell: 28 }]} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
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
                <div className="chart-title-section">
                  <h3 className="chart-title">Top Region</h3>
                  <p className="chart-subtitle">By recommendation revenue</p>
                </div>
                <div className="chart-value-badge badge-blue">
                  <div className="badge-value">📍 {kpiData.topRegion}</div>
                </div>
              </div>
              <div className="chart-container" style={{ height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[{ region: kpiData.topRegion, revenue: 32.5 }, { region: 'North', revenue: 28.3 }, { region: 'South', revenue: 24.8 }, { region: 'East', revenue: 18.9 }]} layout="vertical" margin={{ top: 20, right: 30, left: 60, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                    <XAxis type="number" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 14 }} label={{ value: '₹ Cr', position: 'insideBottom', offset: -10, fill: '#94a3b8' }} />
                    <YAxis type="category" dataKey="region" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 14 }} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.98)', border: '1px solid rgba(148, 163, 184, 0.3)', borderRadius: '8px', color: '#ffffff' }} formatter={(value) => [`₹${value} Cr`, 'Revenue']} />
                    <Bar dataKey="revenue" radius={[0, 8, 8, 0]}>
                      <Cell fill="#06b6d4" /><Cell fill="#3b82f6" /><Cell fill="#8b5cf6" /><Cell fill="#64748b" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* 6. Top Recommended Account - Scatter + Line */}
            <GlassCard className="chart-card">
              <div className="chart-header">
                <div className="chart-title-section">
                  <h3 className="chart-title">Top Recommended Account</h3>
                  <p className="chart-subtitle">Revenue & confidence over time</p>
                </div>
                <div className="chart-value-badge badge-purple">
                  <div className="badge-value" style={{ fontSize: '0.65rem', maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>🏅 {kpiData.topRecommendedAccount}</div>
                </div>
              </div>

              {/* Account name highlight strip */}
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
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    Revenue: <strong style={{ color: '#a855f7' }}>₹{getAccountEngagementData[getAccountEngagementData.length - 1]?.revenue} Cr</strong>
                  </span>
                </div>
              </div>

              <div className="chart-container" style={{ height: '220px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={getAccountEngagementData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.08)" />
                    <XAxis
                      dataKey="month"
                      stroke="#94a3b8"
                      tick={{ fill: '#94a3b8', fontSize: 11 }}
                    />
                    <YAxis
                      yAxisId="left"
                      dataKey="revenue"
                      stroke="#a855f7"
                      tick={{ fill: '#a855f7', fontSize: 11 }}
                      label={{ value: '₹ Cr', angle: -90, position: 'insideLeft', fill: '#a855f7', fontSize: 10, dx: -5 }}
                    />

                    <Tooltip
                      contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.98)', border: '1px solid rgba(168,85,247,0.4)', borderRadius: '10px', color: '#ffffff', fontSize: '12px' }}
                      formatter={(value) => [`₹${value} Cr`, 'Revenue']}
                    />
                    <Legend wrapperStyle={{ color: '#94a3b8', fontSize: '11px', paddingTop: '4px' }} />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      name="Revenue"
                      stroke="#a855f7"
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 5, fill: '#a855f7' }}
                    />
                    <Scatter
                      yAxisId="left"
                      dataKey="revenue"
                      name="Revenue"
                      fill="#a855f7"
                      r={5}
                      legendType="none"
                    />

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

export default RepDashboard;
