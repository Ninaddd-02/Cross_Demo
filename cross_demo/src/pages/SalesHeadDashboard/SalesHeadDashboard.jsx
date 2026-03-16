import React from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarNavigation from '../../components/SidebarNavigation/SidebarNavigation';
import TopNavbar from '../../components/TopNavbar/TopNavbar';
import GlassCard from '../../components/GlassCard/GlassCard';
import { 
  TrendingUp, 
  AlertTriangle, 
  Target,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Activity,
  RefreshCw
} from 'lucide-react';
import { 
  calculateHeadKPIs
} from '../../data/sharedData';
import './SalesHeadDashboard.css';

const SalesHeadDashboard = () => {
  const navigate = useNavigate();

  // Calculate Head KPIs from tenant data (SalesHead section)
  const kpiData = calculateHeadKPIs();

  // Strategic KPIs - Real Data from Tenant JSON (SalesHead section)
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
      title: 'Avg Deal Velocity',
      value: `${kpiData.avgDealVelocity} days`,
      change: '-8 days',
      trend: 'up',
      subtitle: 'Time to close',
      icon: <Activity size={24} />,
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
      title: 'Renewal Revenue Share',
      value: `${kpiData.renewalRevenueShare}%`,
      change: '+3.5%',
      trend: 'up',
      subtitle: 'Revenue from renewals',
      icon: <RefreshCw size={24} />,
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
      title: 'Avg Contribution Margin',
      value: kpiData.avgContribution,
      change: '+5.4%',
      trend: 'up',
      subtitle: 'Per deal margin',
      icon: <BarChart3 size={24} />,
      status: 'success'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'var(--success)';
      case 'warning': return 'var(--warning)';
      case 'error': return 'var(--error)';
      default: return 'var(--info)';
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
        </div>
      </div>
    </div>
  );
};

export default SalesHeadDashboard;
