import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarNavigation from '../../components/SidebarNavigation/SidebarNavigation';
import TopNavbar from '../../components/TopNavbar/TopNavbar';
import GlassCard from '../../components/GlassCard/GlassCard';
import GradientButton from '../../components/GradientButton/GradientButton';
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import './Feedback.css';

const Feedback = () => {
  const navigate = useNavigate();
  const [feedbackType, setFeedbackType] = useState(null);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    // Submit feedback to API
    console.log('Feedback submitted:', { type: feedbackType, comment });
    navigate('/sales/retrain-visualization');
  };

  return (
    <div className="admin-layout">
      <SidebarNavigation role="sales" />
      <div className="admin-content">
        <TopNavbar 
          title="Provide Feedback" 
          subtitle="Help us improve recommendations"
          user="Sales User"
        />
        
        <div className="page-body">
          <div className="feedback-container">
            <GlassCard className="feedback-card">
              <div className="feedback-header">
                <MessageSquare size={48} className="feedback-icon" />
                <h1 className="feedback-title">How was this recommendation?</h1>
                <p className="feedback-subtitle">
                  Your feedback directly improves the AI engine and helps generate better recommendations for you and your team
                </p>
              </div>

              <div className="feedback-options">
                <button 
                  className={`feedback-button ${feedbackType === 'positive' ? 'feedback-button-active positive' : ''}`}
                  onClick={() => setFeedbackType('positive')}
                >
                  <ThumbsUp size={32} />
                  <span className="feedback-label">Helpful</span>
                  <span className="feedback-description">This recommendation was accurate and useful</span>
                </button>

                <button 
                  className={`feedback-button ${feedbackType === 'negative' ? 'feedback-button-active negative' : ''}`}
                  onClick={() => setFeedbackType('negative')}
                >
                  <ThumbsDown size={32} />
                  <span className="feedback-label">Not Helpful</span>
                  <span className="feedback-description">This recommendation was not relevant</span>
                </button>
              </div>

              <div className="feedback-comment-section">
                <label htmlFor="feedback-comment" className="comment-label">
                  Additional Comments (Optional)
                </label>
                <textarea
                  id="feedback-comment"
                  className="comment-textarea"
                  placeholder="Tell us more about your experience..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="feedback-impact-box">
                <h4>Why your feedback matters:</h4>
                <ul>
                  <li>Refines ML model accuracy for future predictions</li>
                  <li>Helps identify patterns and edge cases</li>
                  <li>Improves confidence scoring algorithms</li>
                  <li>Benefits the entire sales team</li>
                </ul>
              </div>

              <div className="feedback-actions">
                <GradientButton 
                  variant="secondary" 
                  size="large"
                  onClick={() => navigate('/sales/recommendations')}
                >
                  Skip for Now
                </GradientButton>
                <GradientButton 
                  variant="primary" 
                  size="large"
                  onClick={handleSubmit}
                  disabled={!feedbackType}
                >
                  Submit Feedback
                </GradientButton>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
