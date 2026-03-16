import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SidebarNavigation from '../../components/SidebarNavigation/SidebarNavigation';
import TopNavbar from '../../components/TopNavbar/TopNavbar';
import GlassCard from '../../components/GlassCard/GlassCard';
import GradientButton from '../../components/GradientButton/GradientButton';
import { CheckCircle, FileText, DollarSign, Calendar } from 'lucide-react';
import './ActionConfirmation.css';

const ActionConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  
  // Get recommendation data from navigation state
  const recommendationData = location.state || {};
  const {
    accountName = 'Account',
    product = 'Recommended Product',
    value = 'Value TBD',
    confidence = 0
  } = recommendationData;

  // Format current date
  const formatDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleContinue = () => {
    navigate('/sales/accounts');
  };

  return (
    <div className="admin-layout">
      <SidebarNavigation role={currentUser?.role || 'sales-rep'} />
      <div className="admin-content">
        <TopNavbar 
          title="Action Confirmation" 
          subtitle="Recommendation Applied"
          user="Sales User"
        />
        
        <div className="page-body">
          <div className="confirmation-container">
            <GlassCard className="confirmation-card">
              <div className="success-animation">
                <div className="success-checkmark">
                  <CheckCircle size={80} />
                </div>
                <div className="success-ripple"></div>
                <div className="success-ripple ripple-delay"></div>
              </div>

              <h1 className="confirmation-title">Recommendation Applied Successfully!</h1>
              <p className="confirmation-subtitle">
                Your action has been logged and will be used to improve future recommendations
              </p>

              <div className="action-summary">
                <h3 className="summary-title">Action Summary</h3>
                <div className="summary-item">
                  <FileText size={20} className="summary-icon" />
                  <div>
                    <div className="summary-label">Recommendation Applied</div>
                    <div className="summary-value">{product} for {accountName}</div>
                  </div>
                </div>
                <div className="summary-item">
                  <DollarSign size={20} className="summary-icon" />
                  <div>
                    <div className="summary-label">Estimated Value</div>
                    <div className="summary-value">{value || 'Value estimation pending'}</div>
                  </div>
                </div>
                <div className="summary-item">
                  <Calendar size={20} className="summary-icon" />
                  <div>
                    <div className="summary-label">Action Date</div>
                    <div className="summary-value">{formatDate()}</div>
                  </div>
                </div>
              </div>

              <div className="next-steps-box">
                <h4>What happens next?</h4>
                <ul>
                  <li>Opportunity created in CRM system</li>
                  <li>Follow-up tasks automatically scheduled</li>
                  <li>Your feedback will improve AI accuracy</li>
                  <li>Similar accounts will receive refined recommendations</li>
                </ul>
              </div>

              <div className="action-buttons">
                <GradientButton 
                  variant="primary" 
                  size="large"
                  fullWidth
                  onClick={handleContinue}
                >
                  Back to Accounts
                </GradientButton>
                <GradientButton 
                  variant="secondary" 
                  size="large"
                  fullWidth
                  onClick={() => navigate('/sales/recommendations')}
                >
                  View More Recommendations
                </GradientButton>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionConfirmation;
