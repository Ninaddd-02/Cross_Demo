import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SidebarNavigation from '../../components/SidebarNavigation/SidebarNavigation';
import TopNavbar from '../../components/TopNavbar/TopNavbar';
import AIRecommendationCard from '../../components/AIRecommendationCard/AIRecommendationCard';
import GlassCard from '../../components/GlassCard/GlassCard';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import useRecommendationsStore from '../../stores/useRecommendationsStore';
import useActivitiesStore from '../../stores/useActivitiesStore';
import useDealsStore from '../../stores/useDealsStore';
import { notify } from '../../utils/notifications';
import { Sparkles, TrendingUp, Filter, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import './AIRecommendations.css';

const AIRecommendationsEnhanced = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { 
    getRecommendationsByRep, 
    acceptRecommendation, 
    rejectRecommendation,
    initRecommendations,
    generateRecommendationsForDeal 
  } = useRecommendationsStore();
  const { logRecommendationActivity } = useActivitiesStore();
  const { getDealsByRep } = useDealsStore();
  
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [currentRecId, setCurrentRecId] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [actionType, setActionType] = useState('');

  // Initialize recommendations from static data
  useEffect(() => {
    const staticRecommendations = getStaticRecommendations(currentUser?.repId);
    initRecommendations(currentUser?.repId, staticRecommendations);
    
    // Generate recommendations for deals
    const deals = getDealsByRep(currentUser?.repId);
    deals.forEach(deal => {
      const newRecs = generateRecommendationsForDeal(deal, currentUser?.repId);
      if (newRecs.length > 0) {
        initRecommendations(currentUser?.repId, newRecs);
      }
    });
  }, [currentUser?.repId]);

  // Get recommendations from store
  const recommendations = getRecommendationsByRep(currentUser?.repId || 1);

  // Filter recommendations
  const filteredRecommendations = selectedFilter === 'all' 
    ? recommendations 
    : recommendations.filter(r => r.type === selectedFilter);

  const handleAccept = (recId) => {
    setCurrentRecId(recId);
    setActionType('accept');
    setShowFeedbackModal(true);
  };

  const handleReject = (recId) => {
    setCurrentRecId(recId);
    setActionType('reject');
    setShowFeedbackModal(true);
  };

  const handleFeedbackSubmit = () => {
    if (actionType === 'accept') {
      const rec = acceptRecommendation(currentRecId, feedbackText);
      if (rec) {
        notify.recommendationAccepted(rec.title);
        logRecommendationActivity(currentRecId, currentUser.repId, 'accepted', {
          notes: feedbackText
        });
      }
    } else {
      const rec = rejectRecommendation(currentRecId, feedbackText);
      if (rec) {
        notify.recommendationRejected(rec.title);
        logRecommendationActivity(currentRecId, currentUser.repId, 'rejected', {
          reason: feedbackText
        });
      }
    }
    
    setShowFeedbackModal(false);
    setFeedbackText('');
    setCurrentRecId(null);
    setActionType('');
  };

  // Stats
  const stats = {
    total: recommendations.length,
    highConfidence: recommendations.filter(r => r.confidence >= 85).length,
    crossSell: recommendations.filter(r => r.type === 'cross-sell').length,
    upsell: recommendations.filter(r => r.type === 'upsell').length
  };

  return (
    <div className="admin-layout">
      <SidebarNavigation role="sales" />
      <div className="admin-content">
        <TopNavbar 
          title="AI Recommendations"
          subtitle="Personalized opportunities powered by Cross Sync"
          user={currentUser?.name}
        />
        
        <div className="page-body ai-recommendations-page">
          {/* Header Stats */}
          <div className="recommendations-header">
            <GlassCard className="header-banner" glow={true} glowColor="blue">
              <div className="banner-content">
                <div className="banner-icon">
                  <Sparkles size={32} />
                </div>
                <div>
                  <h1>Product Recommendations</h1>
                  <p>{stats.total} opportunities identified for your territory</p>
                </div>
              </div>
            </GlassCard>

            <div className="stats-grid">
              <GlassCard>
                <div className="stat-item">
                  <TrendingUp size={24} color="#1B96FF" />
                  <div>
                    <div className="stat-value">{stats.total}</div>
                    <div className="stat-label">Total Opportunities</div>
                  </div>
                </div>
              </GlassCard>
              
              <GlassCard>
                <div className="stat-item">
                  <Sparkles size={24} color="#22D3EE" />
                  <div>
                    <div className="stat-value">{stats.highConfidence}</div>
                    <div className="stat-label">High Confidence</div>
                  </div>
                </div>
              </GlassCard>
              
              <GlassCard>
                <div className="stat-item">
                  <TrendingUp size={24} color="#22C55E" />
                  <div>
                    <div className="stat-value">{stats.crossSell}</div>
                    <div className="stat-label">Cross-Sell</div>
                  </div>
                </div>
              </GlassCard>
              
              <GlassCard>
                <div className="stat-item">
                  <TrendingUp size={24} color="#A855F7" />
                  <div>
                    <div className="stat-value">{stats.upsell}</div>
                    <div className="stat-label">Upsell</div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Filters */}
          <GlassCard className="filters-card">
            <div className="filters-group">
              <Filter size={18} />
              <button 
                className={`filter-btn ${selectedFilter === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedFilter('all')}
              >
                All ({stats.total})
              </button>
              <button 
                className={`filter-btn ${selectedFilter === 'cross-sell' ? 'active' : ''}`}
                onClick={() => setSelectedFilter('cross-sell')}
              >
                Cross-Sell ({stats.crossSell})
              </button>
              <button 
                className={`filter-btn ${selectedFilter === 'upsell' ? 'active' : ''}`}
                onClick={() => setSelectedFilter('upsell')}
              >
                Upsell ({stats.upsell})
              </button>
            </div>
          </GlassCard>

          {/* Recommendations List */}
          <div className="recommendations-list">
            {filteredRecommendations.length === 0 ? (
              <GlassCard className="empty-state">
                <Sparkles size={48} opacity={0.3} />
                <h3>No recommendations yet</h3>
                <p>AI is analyzing your deals to generate recommendations</p>
              </GlassCard>
            ) : (
              filteredRecommendations.map((rec) => (
                <GlassCard key={rec.id} className="recommendation-card" glow={rec.confidence >= 85}>
                  <div className="rec-header">
                    <div className="rec-title-section">
                      <h3>{rec.title}</h3>
                      <div className="rec-badges">
                        <StatusBadge 
                          status={rec.type === 'cross-sell' ? 'info' : 'active'} 
                          label={rec.type ? rec.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('-') : 'Unknown'} 
                        />
                        <StatusBadge 
                          status={rec.confidence >= 85 ? 'success' : 'warning'} 
                          label={`${rec.confidence}% Confidence`} 
                        />
                      </div>
                    </div>
                  </div>

                  <p className="rec-description">{rec.description}</p>
                  
                  <div className="rec-details">
                    <div className="detail-row">
                      <span className="detail-label">Estimated Value:</span>
                      <span className="detail-value highlight">{rec.estimatedValue || formatCurrency(rec.estimatedValue)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Reason:</span>
                      <span className="detail-value">{rec.reason}</span>
                    </div>
                    {rec.impact && (
                      <div className="detail-row">
                        <span className="detail-label">Impact:</span>
                        <StatusBadge 
                          status={rec.impact === 'High' ? 'success' : 'info'} 
                          label={rec.impact} 
                        />
                      </div>
                    )}
                  </div>

                  <div className="rec-actions">
                    <button 
                      className="btn-accept"
                      onClick={() => handleAccept(rec.id)}
                    >
                      <CheckCircle size={18} />
                      Accept & Add to Plan
                    </button>
                    <button 
                      className="btn-reject"
                      onClick={() => handleReject(rec.id)}
                    >
                      <XCircle size={18} />
                      Dismiss
                    </button>
                  </div>
                </GlassCard>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="modal-overlay" onClick={() => setShowFeedbackModal(false)}>
          <div className="modal-content feedback-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {actionType === 'accept' ? 'Accept Recommendation' : 'Dismiss Recommendation'}
              </h2>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>
                  {actionType === 'accept' 
                    ? 'Add notes (optional)' 
                    : 'Why are you dismissing this? (optional)'}
                </label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder={actionType === 'accept' 
                    ? 'Add any notes about this opportunity...' 
                    : 'Help us improve our recommendations...'}
                  rows={4}
                />
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn-secondary"
                onClick={() => setShowFeedbackModal(false)}
              >
                Cancel
              </button>
              <button 
                className={actionType === 'accept' ? 'btn-primary' : 'btn-reject'}
                onClick={handleFeedbackSubmit}
              >
                {actionType === 'accept' ? 'Accept' : 'Dismiss'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get static recommendations
function getStaticRecommendations(repId) {
  const recommendations = {
    1: [ // Rahul Sharma
      {
        id: 'rec-1-1',
        type: 'cross-sell',
        title: 'EV Charging Infrastructure',
        description: 'Growing EV fleet adoption patterns indicate strong fit for integrated charging solutions.',
        confidence: 92,
        reason: 'Based on current EV production ramp-up and industry benchmarks',
        estimatedValue: '₹68 Lakh/year',
        impact: 'High'
      },
      {
        id: 'rec-1-2',
        type: 'upsell',
        title: 'Premium Fleet Maintenance Package',
        description: 'Upgrade to 24/7 comprehensive maintenance support for commercial vehicle fleet.',
        confidence: 87,
        reason: 'Recent downtime patterns indicate need for predictive maintenance',
        estimatedValue: '₹36 Lakh/year',
        impact: 'High'
      },
      {
        id: 'rec-1-3',
        type: 'cross-sell',
        title: 'Telematics & Fleet Monitoring',
        description: 'Fleet telematics provides strategic operational advantage for automotive manufacturers.',
        confidence: 78,
        reason: 'Similar manufacturers at this scale benefit from telematics',
        estimatedValue: '₹48 Lakh/year',
        impact: 'Medium'
      }
    ],
    2: [ // Priya Mehta
      {
        id: 'rec-2-1',
        type: 'cross-sell',
        title: 'Industrial IoT Sensors Network',
        description: 'Strong digitization initiatives make IoT monitoring a natural fit.',
        confidence: 91,
        reason: 'Current smart factory projects align with Industry 4.0 adoption',
        estimatedValue: '₹85 Lakh/year',
        impact: 'High'
      },
      {
        id: 'rec-2-2',
        type: 'upsell',
        title: 'Predictive Analytics Platform',
        description: 'Upgrade analytics capabilities for production optimization.',
        confidence: 84,
        reason: 'Growing data volumes require advanced analytics',
        estimatedValue: '₹54 Lakh/year',
        impact: 'High'
      }
    ],
    3: [ // Amit Kumar
      {
        id: 'rec-3-1',
        type: 'cross-sell',
        title: 'Cloud Infrastructure Expansion',
        description: 'Scale cloud capabilities to support growing workloads.',
        confidence: 88,
        reason: 'Current infrastructure utilization indicates capacity need',
        estimatedValue: '₹72 Lakh/year',
        impact: 'High'
      }
    ],
    4: [ // Neha Singh
      {
        id: 'rec-4-1',
        type: 'cross-sell',
        title: 'Quality Management System',
        description: 'Enhanced quality control for pharmaceutical compliance.',
        confidence: 85,
        reason: 'Regulatory requirements and scale demand enterprise QMS',
        estimatedValue: '₹42 Lakh/year',
        impact: 'High'
      }
    ]
  };
  
  return recommendations[repId] || [];
}

function formatCurrency(value) {
  if (typeof value === 'string') return value;
  return `₹${(value / 100000).toFixed(1)} Lakh/year`;
}

export default AIRecommendationsEnhanced;
