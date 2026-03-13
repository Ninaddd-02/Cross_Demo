import React from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarNavigation from '../../components/SidebarNavigation/SidebarNavigation';
import TopNavbar from '../../components/TopNavbar/TopNavbar';
import GlassCard from '../../components/GlassCard/GlassCard';
import GradientButton from '../../components/GradientButton/GradientButton';
import ProgressRing from '../../components/ProgressRing/ProgressRing';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import { TrendingUp, TrendingDown, Activity, RefreshCw, AlertTriangle } from 'lucide-react';
import './MonitorEngine.css';

const MonitorEngine = () => {
  const navigate = useNavigate();

  const performanceData = [
    { metric: 'Accuracy', value: 94, change: '+2.3%', trend: 'up' },
    { metric: 'Precision', value: 87, change: '+1.8%', trend: 'up' },
    { metric: 'Recall', value: 91, change: '-0.5%', trend: 'down' },
    { metric: 'F1 Score', value: 89, change: '+1.2%', trend: 'up' }
  ];

  const recentLogs = [
    { time: '14:23:45', type: 'success', message: 'Model inference completed - 247 recommendations generated' },
    { time: '14:20:12', type: 'info', message: 'Data sync from CRM system completed' },
    { time: '13:45:33', type: 'warning', message: 'Prediction confidence below threshold for 3 accounts' },
    { time: '13:12:09', type: 'success', message: 'Feedback loop updated with 15 new outcomes' },
    { time: '12:58:22', type: 'info', message: 'Daily health check passed' }
  ];

  return (
    <div className="admin-layout">
      <SidebarNavigation role="admin" />
      <div className="admin-content">
        <TopNavbar 
          title="Monitor Engine" 
          subtitle="Real-time performance metrics and health status"
        />
        
        <div className="page-body">
          <div className="monitor-header-actions">
            <GradientButton 
              variant="primary" 
              icon={<RefreshCw size={18} />}
              onClick={() => navigate('/admin/train-model')}
            >
              Retrain Model
            </GradientButton>
          </div>

          <div className="monitor-grid">
            <div className="performance-metrics">
              <h2 className="section-title">Performance Metrics</h2>
              <div className="metrics-grid">
                {performanceData.map((item, index) => (
                  <GlassCard key={index} className="metric-card">
                    <div className="metric-header">
                      <span className="metric-name">{item.metric}</span>
                      <span className={`metric-change ${item.trend}`}>
                        {item.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {item.change}
                      </span>
                    </div>
                    <ProgressRing 
                      percentage={item.value} 
                      size={120}
                      strokeWidth={10}
                      color={item.value >= 90 ? 'var(--success)' : item.value >= 80 ? 'var(--salesforce-blue)' : 'var(--warning)'}
                      showPercentage={true}
                    />
                  </GlassCard>
                ))}
              </div>
            </div>

            <GlassCard className="accuracy-chart-card">
              <h2 className="section-title">Accuracy Trend (30 Days)</h2>
              <div className="chart-placeholder">
                <Activity size={48} className="chart-icon" />
                <p>94% average accuracy over the past 30 days</p>
                <StatusBadge status="success" label="Healthy" />
              </div>
            </GlassCard>

            <GlassCard className="drift-detection-card">
              <h2 className="section-title">Model Drift Detection</h2>
              <div className="drift-status">
                <div className="drift-indicator drift-normal">
                  <Activity size={32} />
                </div>
                <StatusBadge status="success" label="No Drift Detected" />
                <p className="drift-description">
                  Model performance remains consistent with training baseline. 
                  No significant distribution shifts detected in input data.
                </p>
              </div>
              <div className="drift-details">
                <div className="drift-detail-item">
                  <span className="detail-label">Last Check:</span>
                  <span className="detail-value">5 minutes ago</span>
                </div>
                <div className="drift-detail-item">
                  <span className="detail-label">Drift Score:</span>
                  <span className="detail-value text-success">0.03</span>
                </div>
                <div className="drift-detail-item">
                  <span className="detail-label">Threshold:</span>
                  <span className="detail-value">0.15</span>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="system-logs-card">
              <div className="logs-header">
                <h2 className="section-title">System Logs</h2>
                <GradientButton variant="secondary" size="small">
                  View All
                </GradientButton>
              </div>
              <div className="logs-list">
                {recentLogs.map((log, index) => (
                  <div key={index} className={`log-entry log-${log.type}`}>
                    <span className="log-time">{log.time}</span>
                    <span className="log-message">{log.message}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="retraining-schedule-card">
              <h2 className="section-title">Retraining Schedule</h2>
              <div className="schedule-info">
                <div className="schedule-item">
                  <RefreshCw size={20} className="schedule-icon" />
                  <div>
                    <div className="schedule-label">Next Scheduled Training</div>
                    <div className="schedule-value">February 10, 2026 at 02:00 AM</div>
                  </div>
                </div>
                <div className="schedule-item">
                  <Activity size={20} className="schedule-icon" />
                  <div>
                    <div className="schedule-label">Training Frequency</div>
                    <div className="schedule-value">Weekly (Automatic)</div>
                  </div>
                </div>
              </div>
              <GradientButton 
                variant="primary" 
                size="medium"
                fullWidth
                onClick={() => navigate('/admin/train-model')}
              >
                Trigger Manual Retrain
              </GradientButton>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitorEngine;
