import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarNavigation from '../../components/SidebarNavigation/SidebarNavigation';
import TopNavbar from '../../components/TopNavbar/TopNavbar';
import GlassCard from '../../components/GlassCard/GlassCard';
import GradientButton from '../../components/GradientButton/GradientButton';
import ProgressRing from '../../components/ProgressRing/ProgressRing';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import { Cpu, Database, Brain, Zap, CheckCircle } from 'lucide-react';
import './TrainModel.css';

const TrainModel = () => {
  const navigate = useNavigate();
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);

  const handleStartTraining = () => {
    setIsTraining(true);
    // Simulate training progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setTrainingProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          navigate('/admin/monitor');
        }, 1000);
      }
    }, 300);
  };

  return (
    <div className="admin-layout">
      <SidebarNavigation role="admin" />
      <div className="admin-content">
        <TopNavbar 
          title="Train Model" 
          subtitle="Initiate ML training with your data"
        />
        
        <div className="page-body">
          <div className="training-grid">
            <GlassCard className="dataset-summary-card">
              <h2 className="section-title">Dataset Summary</h2>
              
              <div className="dataset-stats">
                <div className="stat-card">
                  <Database size={24} className="stat-icon" />
                  <div className="stat-content">
                    <div className="stat-value">1,245,672</div>
                    <div className="stat-label">Total Records</div>
                  </div>
                </div>
                
                <div className="stat-card">
                  <Brain size={24} className="stat-icon" />
                  <div className="stat-content">
                    <div className="stat-value">24</div>
                    <div className="stat-label">Features</div>
                  </div>
                </div>
                
                <div className="stat-card">
                  <CheckCircle size={24} className="stat-icon" />
                  <div className="stat-content">
                    <div className="stat-value">98.7%</div>
                    <div className="stat-label">Data Quality</div>
                  </div>
                </div>
              </div>

              <div className="dataset-breakdown">
                <h3 className="breakdown-title">Data Breakdown</h3>
                <div className="breakdown-item">
                  <span className="breakdown-label">Accounts</span>
                  <span className="breakdown-value">125,430</span>
                </div>
                <div className="breakdown-item">
                  <span className="breakdown-label">Opportunities</span>
                  <span className="breakdown-value">89,234</span>
                </div>
                <div className="breakdown-item">
                  <span className="breakdown-label">Products</span>
                  <span className="breakdown-value">1,245</span>
                </div>
                <div className="breakdown-item">
                  <span className="breakdown-label">Transactions</span>
                  <span className="breakdown-value">1,029,763</span>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="training-control-card">
              <h2 className="section-title">Training Control</h2>
              
              {!isTraining ? (
                <>
                  <div className="training-status-idle">
                    <Cpu size={64} className="training-icon-idle" />
                    <h3>Ready to Train</h3>
                    <p>Start training the Cross Sync ML model with your configured data</p>
                  </div>

                  <div className="training-info-box">
                    <h4>What happens during training:</h4>
                    <ul>
                      <li>Historical data is processed through the ML engine</li>
                      <li>Patterns and correlations are identified</li>
                      <li>Recommendation algorithms are optimized</li>
                      <li>Model accuracy is validated</li>
                    </ul>
                  </div>

                  <GradientButton 
                    variant="primary" 
                    size="large"
                    fullWidth
                    icon={<Zap size={20} />}
                    onClick={handleStartTraining}
                  >
                    Start Training
                  </GradientButton>
                </>
              ) : (
                <div className="training-progress-container">
                  <div className="progress-ring-wrapper">
                    <ProgressRing 
                      percentage={trainingProgress} 
                      size={180}
                      strokeWidth={12}
                      color="var(--salesforce-blue)"
                      label="Training"
                    />
                  </div>

                  <div className="training-status-active">
                    <StatusBadge status="active" label="Training in Progress" />
                    <p className="training-message">
                      {trainingProgress < 30 && "Preprocessing data..."}
                      {trainingProgress >= 30 && trainingProgress < 60 && "Learning patterns..."}
                      {trainingProgress >= 60 && trainingProgress < 90 && "Optimizing model..."}
                      {trainingProgress >= 90 && "Finalizing..."}
                    </p>
                  </div>

                  <div className="training-log">
                    <div className="log-item">✓ Data loaded successfully</div>
                    {trainingProgress >= 30 && <div className="log-item">✓ Feature engineering complete</div>}
                    {trainingProgress >= 60 && <div className="log-item">✓ Model training complete</div>}
                    {trainingProgress >= 90 && <div className="log-item">✓ Validation passed</div>}
                  </div>
                </div>
              )}
            </GlassCard>

            <GlassCard className="ml-info-card">
              <h2 className="section-title">About the ML Engine</h2>
              
              <div className="ml-description">
                <div className="ml-icon-large">
                  <Brain size={48} />
                </div>
                <div className="ml-text">
                  <p>
                    Cross Sync uses a <strong>black-box ML engine</strong> running on Python infrastructure. 
                    The training process is fully automated and optimized for B2B sales recommendations.
                  </p>
                  <p>
                    The engine learns from:
                  </p>
                  <ul>
                    <li>Historical transaction data</li>
                    <li>Account and opportunity patterns</li>
                    <li>Product affinity relationships</li>
                    <li>Market trends and seasonality</li>
                    <li>User feedback and outcomes</li>
                  </ul>
                  <p className="ml-note">
                    <strong>Note:</strong> Algorithm internals are not exposed through the UI. 
                    This is by design to maintain model integrity and security.
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainModel;
