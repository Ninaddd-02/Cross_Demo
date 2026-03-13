import React from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarNavigation from '../../components/SidebarNavigation/SidebarNavigation';
import TopNavbar from '../../components/TopNavbar/TopNavbar';
import GlassCard from '../../components/GlassCard/GlassCard';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import ProgressRing from '../../components/ProgressRing/ProgressRing';
import { Database, Cpu, Activity, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const kpiData = [
    {
      title: 'Data Sources',
      value: '3',
      subtitle: 'Connected',
      status: 'success',
      icon: <Database size={24} />,
      change: '+1 this month'
    },
    {
      title: 'Model Status',
      value: 'Active',
      subtitle: 'Last trained 2 days ago',
      status: 'success',
      icon: <Cpu size={24} />,
      change: '94% accuracy'
    },
    {
      title: 'Recommendations',
      value: '847',
      subtitle: 'Generated today',
      status: 'active',
      icon: <Activity size={24} />,
      change: '+23% vs yesterday'
    },
    {
      title: 'Conversion Rate',
      value: '68%',
      subtitle: 'Avg acceptance',
      status: 'success',
      icon: <TrendingUp size={24} />,
      change: '+5.2% this week'
    }
  ];

  const dataFlow = [
    { label: 'Salesforce', status: 'active', connected: true },
    { label: 'Data Ingestion', status: 'success', connected: true },
    { label: 'Field Mapping', status: 'success', connected: true },
    { label: 'ML Engine', status: 'active', connected: true },
    { label: 'API Layer', status: 'active', connected: true },
    { label: 'Recommendations', status: 'success', connected: true }
  ];

  return (
    <div className="admin-layout">
      <SidebarNavigation role="admin" />
      <div className="admin-content">
        <TopNavbar 
          title="Admin Dashboard" 
          subtitle="System Overview & Configuration"
        />
        
        <div className="dashboard-body">
          <div className="kpi-grid">
            {kpiData.map((kpi, index) => (
              <GlassCard key={index} className="kpi-card">
                <div className="kpi-header">
                  <div className="kpi-icon">{kpi.icon}</div>
                  <StatusBadge status={kpi.status} label={kpi.value} />
                </div>
                <h3 className="kpi-title">{kpi.title}</h3>
                <p className="kpi-subtitle">{kpi.subtitle}</p>
                <div className="kpi-change">{kpi.change}</div>
              </GlassCard>
            ))}
          </div>

          <div className="dashboard-main-grid">
            <GlassCard className="architecture-card">
              <h2 className="section-title">System Architecture</h2>
              <p className="section-subtitle">Data flow from source to recommendation</p>
              
              <div className="architecture-flow">
                {dataFlow.map((node, index) => (
                  <React.Fragment key={index}>
                    <div className="flow-node">
                      <div className={`node-indicator ${node.connected ? 'node-connected' : 'node-disconnected'}`}>
                        {node.connected && <CheckCircle size={16} />}
                      </div>
                      <div className="node-label">{node.label}</div>
                      <StatusBadge status={node.status} label="Active" size="small" />
                    </div>
                    {index < dataFlow.length - 1 && (
                      <div className="flow-arrow">
                        <ArrowRight size={20} />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div className="architecture-description">
                <p>Cross Sync operates as a <strong>black-box ML engine</strong> that processes data from multiple sources, applies intelligent field mapping, and generates actionable recommendations through a secure API layer.</p>
              </div>
            </GlassCard>

            <GlassCard className="quick-actions-card">
              <h2 className="section-title">Quick Actions</h2>
              
              <div className="quick-actions-list">
                <button 
                  className="quick-action-item"
                  onClick={() => navigate('/admin/data-source')}
                >
                  <Database size={20} />
                  <div>
                    <div className="action-title">Connect Data Source</div>
                    <div className="action-description">Add Salesforce, SAP, or custom sources</div>
                  </div>
                  <ArrowRight size={18} />
                </button>

                <button 
                  className="quick-action-item"
                  onClick={() => navigate('/admin/map-fields')}
                >
                  <Activity size={20} />
                  <div>
                    <div className="action-title">Configure Field Mapping</div>
                    <div className="action-description">Map source fields to engine schema</div>
                  </div>
                  <ArrowRight size={18} />
                </button>

                <button 
                  className="quick-action-item"
                  onClick={() => navigate('/admin/train-model')}
                >
                  <Cpu size={20} />
                  <div>
                    <div className="action-title">Train Model</div>
                    <div className="action-description">Initiate ML training with new data</div>
                  </div>
                  <ArrowRight size={18} />
                </button>

                <button 
                  className="quick-action-item"
                  onClick={() => navigate('/admin/monitor')}
                >
                  <TrendingUp size={20} />
                  <div>
                    <div className="action-title">Monitor Performance</div>
                    <div className="action-description">View metrics, logs, and health status</div>
                  </div>
                  <ArrowRight size={18} />
                </button>
              </div>
            </GlassCard>

            <GlassCard className="model-health-card">
              <h2 className="section-title">Model Health</h2>
              
              <div className="health-metrics">
                <div className="health-metric">
                  <ProgressRing 
                    percentage={94} 
                    size={100}
                    strokeWidth={8}
                    color="var(--success)"
                    label="Accuracy"
                  />
                </div>
                <div className="health-metric">
                  <ProgressRing 
                    percentage={87} 
                    size={100}
                    strokeWidth={8}
                    color="var(--salesforce-blue)"
                    label="Precision"
                  />
                </div>
                <div className="health-metric">
                  <ProgressRing 
                    percentage={91} 
                    size={100}
                    strokeWidth={8}
                    color="var(--cyan)"
                    label="Recall"
                  />
                </div>
              </div>

              <div className="health-info">
                <div className="info-row">
                  <span className="info-label">Last Training:</span>
                  <span className="info-value">Feb 3, 2026 14:30</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Dataset Size:</span>
                  <span className="info-value">1.2M records</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Next Scheduled:</span>
                  <span className="info-value">Feb 10, 2026</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
