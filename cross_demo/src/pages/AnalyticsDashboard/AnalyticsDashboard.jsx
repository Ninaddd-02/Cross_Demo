import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SidebarNavigation from '../../components/SidebarNavigation/SidebarNavigation';
import TopNavbar from '../../components/TopNavbar/TopNavbar';
import GlassCard from '../../components/GlassCard/GlassCard';
import { BarChart3, TrendingUp, Target, Activity, Users, Clock, RefreshCw } from 'lucide-react';

// Import chart components
import RevenueBarChart from '../../components/Charts/RevenueBarChart';
import WinsDonutChart from '../../components/Charts/WinsDonutChart';
import ConversionGauge from '../../components/Charts/ConversionGauge';
import TeamConversionChart from '../../components/Charts/TeamConversionChart';
import CycleTimeTrendChart from '../../components/Charts/CycleTimeTrendChart';
import TopPerformersChart from '../../components/Charts/TopPerformersChart';

import { 
  calculateHeadKPIs,
  calculateManagerKPIs,
  calculateRepKPIs,
  getTenantInfo
} from '../../data/sharedData';

import './AnalyticsDashboard.css';

const AnalyticsDashboard = () => {
  const navigate = useNavigate();
  const { tenantId } = useAuth();
  const [timePeriod, setTimePeriod] = useState('6M');
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Simulate loading state
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [timePeriod, refreshKey]);

  // Auto-refresh when tenant changes
  useEffect(() => {
    if (tenantId) {
      console.log('🔄 Tenant changed - refreshing analytics dashboard');
      setRefreshKey(prev => prev + 1);
    }
  }, [tenantId]);

  // Get KPI data from all roles
  const headKPIs = useMemo(() => calculateHeadKPIs(), [refreshKey]);
  const managerKPIs = useMemo(() => calculateManagerKPIs(), [refreshKey]);
  const repKPIs = useMemo(() => calculateRepKPIs(), [refreshKey]);
  
  // Get direct access to tenant data for team conversion rates
  const tenantInfo = useMemo(() => getTenantInfo(), [refreshKey]);
  const teamCrossSellRate = tenantInfo?.KPI?.SalesManager?.TeamCrossSellConversionRate || 24.8;
  const teamUpsellRate = tenantInfo?.KPI?.SalesManager?.TeamUpsellConversionRate || 19.6;

  // Handle refresh
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <SidebarNavigation role="sales-head" />
        <div className="admin-content">
          <TopNavbar 
            title="Analytics Dashboard" 
            subtitle="Visual Performance Insights & Metrics"
            user="Sales Head"
          />
          <div className="analytics-loading">
            <div className="loading-spinner"></div>
            <p>Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <SidebarNavigation role="sales-head" />
      <div className="admin-content">
        <TopNavbar 
          title="Analytics Dashboard" 
          subtitle="Visual Performance Insights & Metrics"
          user="Sales Head"
        />
        
        <div className="dashboard-body analytics-body">
          {/* Filters Section */}
          <div className="analytics-header">
            <div className="filter-group">
              <span className="filter-label">Time Period:</span>
              <div className="filter-buttons">
                {['3M', '6M', '1Y'].map((period) => (
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
            <button className="refresh-btn" onClick={handleRefresh}>
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>

          {/* Charts Grid */}
          <div className="analytics-grid">
            {/* Revenue Comparison - Bar Chart */}
            <GlassCard className="analytics-card card-medium">
              <div className="chart-header">
                <div className="chart-title-group">
                  <BarChart3 size={24} className="chart-icon" style={{ color: '#8b5cf6' }} />
                  <div>
                    <h3 className="chart-title">Revenue Comparison</h3>
                    <p className="chart-subtitle">Cross-Sell vs Upsell Revenue</p>
                  </div>
                </div>
                <div className="chart-badge purple">
                  ₹{((headKPIs.crossSellRevenueRaw + headKPIs.upsellRevenueRaw) / 10000000).toFixed(2)} Cr
                </div>
              </div>
              <div className="chart-container">
                <RevenueBarChart 
                  crossSellRevenue={headKPIs.crossSellRevenueRaw}
                  upsellRevenue={headKPIs.upsellRevenueRaw}
                />
              </div>
            </GlassCard>

            {/* Wins Distribution - Donut Chart */}
            <GlassCard className="analytics-card card-medium">
              <div className="chart-header">
                <div className="chart-title-group">
                  <Target size={24} className="chart-icon" style={{ color: '#22c55e' }} />
                  <div>
                    <h3 className="chart-title">Wins Distribution</h3>
                    <p className="chart-subtitle">Cross-Sell vs Upsell Wins</p>
                  </div>
                </div>
                <div className="chart-badge green">
                  {repKPIs.crossSellWins + repKPIs.upsellWins} Total
                </div>
              </div>
              <div className="chart-container">
                <WinsDonutChart 
                  crossSellWins={repKPIs.crossSellWins}
                  upsellWins={repKPIs.upsellWins}
                />
              </div>
            </GlassCard>

            {/* Conversion Rate - Gauge Chart */}
            <GlassCard className="analytics-card card-small">
              <div className="chart-header">
                <div className="chart-title-group">
                  <TrendingUp size={24} className="chart-icon" style={{ color: '#0176d3' }} />
                  <div>
                    <h3 className="chart-title">Conversion Rate</h3>
                    <p className="chart-subtitle">Recommendation to Win</p>
                  </div>
                </div>
              </div>
              <div className="chart-container">
                <ConversionGauge conversionRate={parseFloat(repKPIs.renewalRate)} />
              </div>
            </GlassCard>

            {/* Team Conversion Rates - Grouped Bar Chart */}
            <GlassCard className="analytics-card card-medium">
              <div className="chart-header">
                <div className="chart-title-group">
                  <Users size={24} className="chart-icon" style={{ color: '#22c55e' }} />
                  <div>
                    <h3 className="chart-title">Team Conversion Rates</h3>
                    <p className="chart-subtitle">Cross-Sell vs Upsell Performance</p>
                  </div>
                </div>
                <div className="chart-badge green">
                  Avg {((teamCrossSellRate + teamUpsellRate) / 2).toFixed(1)}%
                </div>
              </div>
              <div className="chart-container">
                <TeamConversionChart 
                  crossSellRate={teamCrossSellRate}
                  upsellRate={teamUpsellRate}
                />
              </div>
            </GlassCard>

            {/* Cycle Time Trend - Line Chart */}
            <GlassCard className="analytics-card card-large">
              <div className="chart-header">
                <div className="chart-title-group">
                  <Clock size={24} className="chart-icon" style={{ color: '#8b5cf6' }} />
                  <div>
                    <h3 className="chart-title">Deal Cycle Time Trend</h3>
                    <p className="chart-subtitle">Recommendation to Win Timeline</p>
                  </div>
                </div>
                <div className="chart-badge purple">
                  {managerKPIs.avgDealVelocityDays.toFixed(1)} days
                </div>
              </div>
              <div className="chart-container">
                <CycleTimeTrendChart 
                  currentCycleTime={managerKPIs.avgDealVelocityDays}
                  timePeriod={timePeriod}
                />
              </div>
            </GlassCard>

            {/* Top Performers - Horizontal Bar Chart */}
            <GlassCard className="analytics-card card-medium">
              <div className="chart-header">
                <div className="chart-title-group">
                  <Activity size={24} className="chart-icon" style={{ color: '#8b5cf6' }} />
                  <div>
                    <h3 className="chart-title">Top Performers</h3>
                    <p className="chart-subtitle">By Revenue & Conversion</p>
                  </div>
                </div>
                <div className="chart-badge purple">
                  Star Reps
                </div>
              </div>
              <div className="chart-container">
                <TopPerformersChart 
                  topRepRevenue={managerKPIs.topSalesRep}
                  topRepConversion={managerKPIs.topRepByConversion}
                />
              </div>
            </GlassCard>
          </div>

          {/* Key Insights Section */}
          <div className="insights-section">
            <h3 className="insights-title">Key Insights</h3>
            <div className="insights-grid">
              <div className="insight-card">
                <div className="insight-icon green">🎯</div>
                <div className="insight-content">
                  <h4>Top Service</h4>
                  <p><strong>{headKPIs.topCrossSellService}</strong> leads cross-sell</p>
                </div>
              </div>
              <div className="insight-card">
                <div className="insight-icon orange">⚡</div>
                <div className="insight-content">
                  <h4>Top Upsell</h4>
                  <p><strong>{headKPIs.topUpsellService}</strong> drives upsell</p>
                </div>
              </div>
              <div className="insight-card">
                <div className="insight-icon blue">📍</div>
                <div className="insight-content">
                  <h4>Top Region</h4>
                  <p><strong>{headKPIs.topRegion}</strong> region performing best</p>
                </div>
              </div>
              <div className="insight-card">
                <div className="insight-icon purple">🏆</div>
                <div className="insight-content">
                  <h4>Top Account</h4>
                  <p><strong>{repKPIs.topRecommendedAccount.split(' ').slice(0, 2).join(' ')}</strong></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
