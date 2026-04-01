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

  // Calculate total wins
  const totalWins = kpiData.crossSellWins + kpiData.upsellWins;

  // Generate engagement trend data based on time period
  const getEngagementTrendData = useMemo(() => {
    switch (timePeriod) {
      case '3M':
        return [
          { month: 'Oct', score: 82 },
          { month: 'Nov', score: 85 },
          { month: 'Dec', score: 92 }
        ];
      case '6M':
        return [
          { month: 'Jul', score: 72 },
          { month: 'Aug', score: 76 },
          { month: 'Sep', score: 80 },
          { month: 'Oct', score: 82 },
          { month: 'Nov', score: 85 },
          { month: 'Dec', score: 92 }
        ];
      case '1Y':
        return [
          { month: 'Jan', score: 65 },
          { month: 'Feb', score: 68 },
          { month: 'Mar', score: 70 },
          { month: 'Apr', score: 72 },
          { month: 'May', score: 74 },
          { month: 'Jun', score: 76 },
          { month: 'Jul', score: 78 },
          { month: 'Aug', score: 80 },
          { month: 'Sep', score: 82 },
          { month: 'Oct', score: 85 },
          { month: 'Nov', score: 88 },
          { month: 'Dec', score: 92 }
        ];
      case 'All':
        return [
          { month: 'Q1 2024', score: 58 },
          { month: 'Q2 2024', score: 62 },
          { month: 'Q3 2024', score: 68 },
          { month: 'Q4 2024', score: 72 },
          { month: 'Q1 2025', score: 76 },
          { month: 'Q2 2025', score: 80 },
          { month: 'Q3 2025', score: 85 },
          { month: 'Q4 2025', score: 92 }
        ];
      default:
        return [
          { month: 'Jul', score: 72 },
          { month: 'Aug', score: 76 },
          { month: 'Sep', score: 80 },
          { month: 'Oct', score: 82 },
          { month: 'Nov', score: 85 },
          { month: 'Dec', score: 92 }
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

          {/* KPI Cards Grid - 5 Cards */}
          <div className="charts-grid">
            {/* 1. Total Wins - Stacked Bar Chart */}
            <GlassCard className="chart-card">
              <div className="chart-header">
                <div className="chart-title-section">
                  <h3 className="chart-title">Total Wins</h3>
                  <p className="chart-subtitle">All opportunities closed</p>
                </div>
                <div className="chart-value-badge badge-blue">
                  <div className="badge-value">{totalWins}</div>
                  <div className="badge-trend">
                    <TrendingUp size={12} /> Opportunities
                  </div>
                </div>
              </div>
              <div className="chart-container" style={{ height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={[
                      { name: 'Cross-Sell', value: 68, fill: '#3b82f6' },
                      { name: 'Upsell', value: 42, fill: '#10b981' }
                    ]}
                    margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#94a3b8"
                      tick={{ fill: '#94a3b8', fontSize: 14 }}
                    />
                    <YAxis 
                      stroke="#94a3b8"
                      tick={{ fill: '#94a3b8', fontSize: 14 }}
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.98)', 
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                        borderRadius: '8px',
                        color: '#ffffff'
                      }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {[
                        { name: 'Cross-Sell', value: 68, fill: '#3b82f6' },
                        { name: 'Upsell', value: 42, fill: '#10b981' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* 2. Cross-Sell Wins - Donut Chart */}
            <GlassCard className="chart-card">
              <div className="chart-header">
                <div className="chart-title-section">
                  <h3 className="chart-title">Cross-Sell Wins</h3>
                  <p className="chart-subtitle">New service opportunities</p>
                </div>
                <div className="chart-value-badge badge-blue">
                  <div className="badge-value">{kpiData.crossSellWins}</div>
                  <div className="badge-trend">
                    <Target size={12} /> {((kpiData.crossSellWins / totalWins) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
              <div className="chart-container" style={{ height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Cross-Sell', value: 68, fill: '#3b82f6' },
                        { name: 'Upsell', value: 42, fill: '#94a3b8' }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius="60%"
                      outerRadius="80%"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {[
                        { name: 'Cross-Sell', value: 68, fill: '#3b82f6' },
                        { name: 'Upsell', value: 42, fill: '#94a3b8' }
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
                    />
                    <text 
                      x="50%" 
                      y="50%" 
                      textAnchor="middle" 
                      dominantBaseline="middle"
                      style={{ fontSize: '2rem', fontWeight: '700', fill: '#3b82f6' }}
                    >
                      68
                    </text>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* 3. Upsell Wins - Horizontal Bar Chart */}
            <GlassCard className="chart-card">
              <div className="chart-header">
                <div className="chart-title-section">
                  <h3 className="chart-title">Upsell Wins</h3>
                  <p className="chart-subtitle">Expansion opportunities</p>
                </div>
                <div className="chart-value-badge badge-green">
                  <div className="badge-value">{kpiData.upsellWins}</div>
                  <div className="badge-trend">
                    <Activity size={12} /> {((kpiData.upsellWins / totalWins) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
              <div className="chart-container" style={{ height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={[
                      { name: 'Upsell', value: 42, target: 110 },
                      { name: 'Cross-Sell', value: 68, target: 110 }
                    ]}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                    <XAxis 
                      type="number"
                      stroke="#94a3b8"
                      tick={{ fill: '#94a3b8', fontSize: 14 }}
                    />
                    <YAxis 
                      type="category"
                      dataKey="name"
                      stroke="#94a3b8"
                      tick={{ fill: '#94a3b8', fontSize: 14 }}
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.98)', 
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                        borderRadius: '8px',
                        color: '#ffffff'
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                      <Cell fill="#10b981" />
                      <Cell fill="#3b82f6" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* 4. Recommendation Conversion Rate */}
            <GlassCard className="chart-card">
              <div className="chart-header">
                <div className="chart-title-section">
                  <h3 className="chart-title">Recommendation Conversion Rate</h3>
                  <p className="chart-subtitle">AI recommendation success</p>
                </div>
                <div className="chart-value-badge badge-green">
                  <div className="badge-value">{kpiData.renewalRate}%</div>
                  <div className="badge-trend">
                    <RefreshCw size={12} /> Conversion
                  </div>
                </div>
              </div>
              <div className="chart-container" style={{ height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart 
                    cx="50%" 
                    cy="50%" 
                    innerRadius="60%" 
                    outerRadius="90%" 
                    data={[{ name: 'Conversion Rate', value: parseFloat(kpiData.renewalRate), fill: '#10b981' }]}
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
                      formatter={(value) => [
                        `${value}%`,
                        'Conversion Rate'
                      ]}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* 5. Top Recommended Account - Line Chart with Trend */}
            <GlassCard className="chart-card">
              <div className="chart-header">
                <div className="chart-title-section">
                  <h3 className="chart-title">Top Recommended Account</h3>
                  <p className="chart-subtitle">Priority engagement</p>
                </div>
                <div className="chart-value-badge badge-purple">
                  <div className="badge-value">🏆</div>
                  <div className="badge-trend">
                    <Zap size={12} /> Priority
                  </div>
                </div>
              </div>
              <div className="chart-container" style={{ height: '280px', display: 'flex', flexDirection: 'column', padding: '1rem' }}>
                <div style={{ 
                  textAlign: 'center', 
                  padding: '0.5rem 1rem 1rem 1rem',
                  borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
                  marginBottom: '0.75rem'
                }}>
                  <div style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: '700', 
                    color: '#a855f7', 
                    marginBottom: '0.25rem',
                    lineHeight: '1.4',
                    wordWrap: 'break-word'
                  }}>
                    {kpiData.topRecommendedAccount}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Engagement Score Trend
                  </div>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={getEngagementTrendData}
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#94a3b8"
                      tick={{ fill: '#94a3b8', fontSize: 11 }}
                    />
                    <YAxis 
                      stroke="#94a3b8"
                      tick={{ fill: '#94a3b8', fontSize: 11 }}
                      domain={timePeriod === 'All' ? [50, 100] : [60, 100]}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.98)', 
                        border: '1px solid rgba(148, 163, 184, 0.3)',
                        borderRadius: '8px',
                        color: '#ffffff'
                      }}
                      formatter={(value) => [`${value}`, 'Score']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#a855f7" 
                      strokeWidth={3}
                      dot={{ fill: '#a855f7', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                      fill="url(#colorScore)"
                    />
                  </LineChart>
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
