import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarNavigation from '../../components/SidebarNavigation/SidebarNavigation';
import TopNavbar from '../../components/TopNavbar/TopNavbar';
import GlassCard from '../../components/GlassCard/GlassCard';
import GradientButton from '../../components/GradientButton/GradientButton';
import { RefreshCw, Database, Brain, TrendingUp, CheckCircle } from 'lucide-react';
import './RetrainVisualization.css';

const RetrainVisualization = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate completion after 5 seconds
    const timer = setTimeout(() => {
      // Auto-navigate back or stay on page
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const stages = [
    { 
      icon: <Database size={32} />, 
      label: 'Collect Feedback', 
      status: 'complete',
      description: 'User feedback aggregated'
    },
    { 
      icon: <Brain size={32} />, 
      label: 'Update Model', 
      status: 'active',
      description: 'ML engine retraining'
    },
    { 
      icon: <TrendingUp size={32} />, 
      label: 'Improve Accuracy', 
      status: 'pending',
      description: 'Enhanced predictions'
    },
    { 
      icon: <CheckCircle size={32} />, 
      label: 'Deploy Changes', 
      status: 'pending',
      description: 'Live recommendations updated'
    }
  ];

  return (
    <div className="admin-layout">
      <SidebarNavigation role="sales" />
      <div className="admin-content">
        <TopNavbar 
          title="Feedback Loop" 
          subtitle="Continuous Learning in Action"
          user="Sales User"
        />
        
        <div className="page-body">
          <div className="retrain-container">
            <GlassCard className="retrain-card">
              <div className="retrain-header">
                <div className="retrain-icon-main">
                  <RefreshCw size={64} className="rotating-icon" />
                </div>
                <h1 className="retrain-title">Model Retraining in Progress</h1>
                <p className="retrain-subtitle">
                  Your feedback is being processed to improve future recommendations
                </p>
              </div>

              <div className="retrain-stages">
                {stages.map((stage, index) => (
                  <div key={index} className="stage-container">
                    <div className={`stage-card stage-${stage.status}`}>
                      <div className="stage-icon-wrapper">
                        {stage.icon}
                        {stage.status === 'complete' && (
                          <div className="stage-checkmark">
                            <CheckCircle size={20} />
                          </div>
                        )}
                      </div>
                      <h3 className="stage-label">{stage.label}</h3>
                      <p className="stage-description">{stage.description}</p>
                    </div>
                    {index < stages.length - 1 && (
                      <div className={`stage-connector ${index === 0 ? 'connector-active' : ''}`}>
                        →
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <GlassCard className="feedback-loop-explanation">
                <h3 className="explanation-title">The Continuous Learning Cycle</h3>
                <div className="cycle-diagram">
                  <div className="cycle-step">
                    <div className="cycle-number">1</div>
                    <div className="cycle-content">
                      <h4>Generate Recommendations</h4>
                      <p>AI creates personalized suggestions</p>
                    </div>
                  </div>
                  <div className="cycle-arrow">→</div>
                  <div className="cycle-step">
                    <div className="cycle-number">2</div>
                    <div className="cycle-content">
                      <h4>User Takes Action</h4>
                      <p>Accept, reject, or modify</p>
                    </div>
                  </div>
                  <div className="cycle-arrow">→</div>
                  <div className="cycle-step">
                    <div className="cycle-number">3</div>
                    <div className="cycle-content">
                      <h4>Provide Feedback</h4>
                      <p>Rate recommendation quality</p>
                    </div>
                  </div>
                  <div className="cycle-arrow">→</div>
                  <div className="cycle-step">
                    <div className="cycle-number">4</div>
                    <div className="cycle-content">
                      <h4>Model Retrains</h4>
                      <p>Engine learns and improves</p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <div className="impact-stats">
                <div className="impact-stat">
                  <div className="impact-value">+2.3%</div>
                  <div className="impact-label">Accuracy Improvement</div>
                </div>
                <div className="impact-stat">
                  <div className="impact-value">847</div>
                  <div className="impact-label">Feedback Points Collected</div>
                </div>
                <div className="impact-stat">
                  <div className="impact-value">Daily</div>
                  <div className="impact-label">Retrain Frequency</div>
                </div>
              </div>

              <div className="retrain-actions">
                <GradientButton 
                  variant="primary" 
                  size="large"
                  fullWidth
                  onClick={() => navigate('/sales/recommendations')}
                >
                  Back to Recommendations
                </GradientButton>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetrainVisualization;
