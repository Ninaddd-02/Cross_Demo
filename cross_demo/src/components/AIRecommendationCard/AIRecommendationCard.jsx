import React, { useState } from 'react';
import { Sparkles, TrendingUp, Target, Brain, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import GlassCard from '../GlassCard/GlassCard';
import StatusBadge from '../StatusBadge/StatusBadge';
import GradientButton from '../GradientButton/GradientButton';
import './AIRecommendationCard.css';

const AIRecommendationCard = ({ 
  type = 'cross-sell',
  accountName = '',
  title = '',
  description = '',
  confidence = 0,
  reason = '',
  product = '',
  estimatedValue = '',
  optionA = null,
  optionB = null,
  onAccept,
  onReject
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const getTypeConfig = () => {
    switch(type) {
      case 'cross-sell':
        return { icon: <Target size={20} />, color: 'cyan', label: 'Cross-Sell' };
      case 'upsell':
        return { icon: <TrendingUp size={20} />, color: 'purple', label: 'Upsell' };
      case 'priority':
        return { icon: <Brain size={20} />, color: 'blue', label: 'Priority' };
      default:
        return { icon: <Sparkles size={20} />, color: 'blue', label: 'Insight' };
    }
  };

  const config = getTypeConfig();
  const confidenceLevel = confidence >= 80 ? 'success' : confidence >= 60 ? 'warning' : 'info';
  const hasOptions = optionA && optionB;

  return (
    <GlassCard className="ai-recommendation-card" glow={true} glowColor={config.color}>
      <div className="recommendation-header">
        <div className="recommendation-type">
          <span className={`type-icon type-icon-${config.color}`}>{config.icon}</span>
          <StatusBadge status={confidenceLevel} label={config.label} size="small" />
        </div>
        <div className="recommendation-confidence">
          <Sparkles size={16} className="sparkle-icon" />
          <span className="confidence-text">{confidence}% Match</span>
        </div>
      </div>

      <div className="recommendation-body">
        {accountName && (
          <div className="recommendation-account-name">{accountName}</div>
        )}
        <h3 className="recommendation-title">{title}</h3>
        <p className="recommendation-description">{description}</p>
        
        {product && !hasOptions && (
          <div className="recommendation-detail">
            <span className="detail-label">Recommended Product:</span>
            <span className="detail-value">{product}</span>
          </div>
        )}
        
        {estimatedValue && !hasOptions && (
          <div className="recommendation-detail">
            <span className="detail-label">Estimated Value:</span>
            <span className="detail-value highlight">{estimatedValue}</span>
          </div>
        )}

        {/* Option A & B Section */}
        {hasOptions && (
          <div className="options-section">
            <button 
              className="options-toggle"
              onClick={() => setShowOptions(!showOptions)}
            >
              <span className="options-toggle-text">
                <Sparkles size={16} />
                AI suggests 2 implementation approaches
              </span>
              {showOptions ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {showOptions && (
              <div className="options-container">
                {/* Primary Recommendation */}
                <div 
                  className={`option-card option-a ${selectedOption === 'A' ? 'selected' : ''}`}
                  onClick={() => setSelectedOption('A')}
                >
                  <div className="option-header">
                    <div className="option-label">
                      <span className="option-badge option-badge-primary">Primary Recommendation</span>
                      <span className="option-confidence">{optionA.confidence}%</span>
                    </div>
                    {selectedOption === 'A' && <CheckCircle size={20} className="selected-icon" />}
                  </div>
                  <h4 className="option-title">{optionA.title}</h4>
                  <div className="option-product">{optionA.product}</div>
                  <div className="option-value">{optionA.value}</div>
                  
                  <div className="option-pros-cons">
                    <div className="pros">
                      <span className="pros-label">✓ Pros:</span>
                      <ul>
                        {optionA.pros.map((pro, idx) => <li key={idx}>{pro}</li>)}
                      </ul>
                    </div>
                    <div className="cons">
                      <span className="cons-label">✗ Cons:</span>
                      <ul>
                        {optionA.cons.map((con, idx) => <li key={idx}>{con}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Alternative Approach */}
                <div 
                  className={`option-card option-b ${selectedOption === 'B' ? 'selected' : ''}`}
                  onClick={() => setSelectedOption('B')}
                >
                  <div className="option-header">
                    <div className="option-label">
                      <span className="option-badge option-badge-secondary">Alternative Approach</span>
                      <span className="option-confidence">{optionB.confidence}%</span>
                    </div>
                    {selectedOption === 'B' && <CheckCircle size={20} className="selected-icon" />}
                  </div>
                  <h4 className="option-title">{optionB.title}</h4>
                  <div className="option-product">{optionB.product}</div>
                  <div className="option-value">{optionB.value}</div>
                  
                  <div className="option-pros-cons">
                    <div className="pros">
                      <span className="pros-label">✓ Pros:</span>
                      <ul>
                        {optionB.pros.map((pro, idx) => <li key={idx}>{pro}</li>)}
                      </ul>
                    </div>
                    <div className="cons">
                      <span className="cons-label">✗ Cons:</span>
                      <ul>
                        {optionB.cons.map((con, idx) => <li key={idx}>{con}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="recommendation-actions">
        <GradientButton 
          variant="primary" 
          size="small"
          onClick={onAccept}
          fullWidth
        >
          {selectedOption ? `Apply Option ${selectedOption}` : 'Apply Recommendation'}
        </GradientButton>
        <GradientButton 
          variant="secondary" 
          size="small"
          onClick={onReject}
        >
          Dismiss
        </GradientButton>
      </div>
    </GlassCard>
  );
};

export default AIRecommendationCard;
