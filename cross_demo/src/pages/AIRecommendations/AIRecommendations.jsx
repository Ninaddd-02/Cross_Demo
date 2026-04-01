import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SidebarNavigation from '../../components/SidebarNavigation/SidebarNavigation';
import TopNavbar from '../../components/TopNavbar/TopNavbar';
import AIRecommendationCard from '../../components/AIRecommendationCard/AIRecommendationCard';
import GlassCard from '../../components/GlassCard/GlassCard';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import useRecommendationsStore from '../../stores/useRecommendationsStore';
import { onSyncEvent, SYNC_EVENTS } from '../../utils/syncManager';
import { Sparkles, TrendingUp, Filter, X, ChevronDown, RefreshCw } from 'lucide-react';
import { getAIRecommendations } from '../../data/sharedData';
import './AIRecommendations.css';

// Helper function to format time since last update
const getTimeSinceUpdate = (lastUpdated) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - lastUpdated) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
};

const AIRecommendations = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, tenantId } = useAuth();
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [dismissedIds, setDismissedIds] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [timeDisplay, setTimeDisplay] = useState('Just now');
  
  // Update time display every minute
  useEffect(() => {
    const updateTimeDisplay = () => {
      setTimeDisplay(getTimeSinceUpdate(lastUpdated));
    };
    
    updateTimeDisplay(); // Initial update
    const interval = setInterval(updateTimeDisplay, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [lastUpdated]);
  
  // Get account from navigation state if coming from Accounts page
  const selectedAccount = location.state?.accountName || '';
  
  const [filters, setFilters] = useState({
    technology: '',
    partner: '',
    opportunityType: '',
    accountName: ''
  });

  // Update filter when coming from account selection
  useEffect(() => {
    if (selectedAccount) {
      setFilters(prev => ({
        ...prev,
        accountName: selectedAccount
      }));
      // Filter is applied but panel stays closed unless user opens it
    }
  }, [selectedAccount]);
  
  // Auto-refresh when tenant changes
  useEffect(() => {
    if (tenantId) {
      console.log('🔄 Tenant changed - refreshing recommendations');
      setRefreshKey(prev => prev + 1);
      setLastUpdated(new Date());
    }
  }, [tenantId]);
  
  // Get fresh recommendations based on current tenant
  const sharedAIRecommendations = useMemo(() => getAIRecommendations(), [refreshKey]);
  
  const {
    getRecommendationsByRep,
    acceptRecommendation,
    rejectRecommendation,
    initRecommendations
  } = useRecommendationsStore();

  // Recommendations by industry (defined early for use in useEffect)
  const recommendationsByRep = useMemo(() => ({
    1: { // Rahul Sharma - Automotive OEM (All Regions)
      accountName: 'Tata Motors Ltd',
      topRecommendations: [
        {
          id: 1,
          type: 'cross-sell',
          title: 'EV Charging Infrastructure',
          description: 'Tata Motors Ltd shows growing EV fleet adoption patterns similar to manufacturers who benefit from integrated charging solutions.',
          confidence: 92,
          reason: 'Based on current EV production ramp-up and industry benchmarks, charging infrastructure would optimize operations.',
          product: 'Commercial EV Charging Network - 50 Units',
          estimatedValue: '₹68 Lakh/year',
          optionA: {
            title: 'Fast Charging Network (Primary)',
            product: 'Commercial EV Fast Charging - 50 Units',
            value: '₹68 Lakh/year',
            pros: ['Quick charging (80% in 30 min)', 'Higher customer satisfaction', 'Premium pricing'],
            cons: ['Higher upfront cost', 'Requires robust power infrastructure'],
            confidence: 92
          },
          optionB: {
            title: 'Solar-Integrated Charging (Alternative)',
            product: 'Solar-Powered EV Charging Hubs - 50 Units',
            value: '₹52 Lakh/year',
            pros: ['Lower operating costs', 'Sustainability goals alignment', 'Government incentives'],
            cons: ['Slower charging speed', 'Weather dependent', 'Higher maintenance'],
            confidence: 85
          }
        },
        {
          id: 2,
          type: 'upsell',
          title: 'Premium Fleet Maintenance Package',
          description: 'Upgrade to 24/7 comprehensive maintenance support for commercial vehicle fleet.',
          confidence: 87,
          reason: 'Recent vehicle downtime patterns indicate need for predictive maintenance and dedicated service management.',
          product: 'Premium Fleet Care Plus',
          estimatedValue: '₹36 Lakh/year',
          optionA: {
            title: '24/7 Premium Support (Primary)',
            product: 'Fleet Care Plus - Full Service',
            value: '₹36 Lakh/year',
            pros: ['Round-the-clock support', 'Predictive maintenance', '2-hour SLA'],
            cons: ['Higher cost', 'Requires dedicated team'],
            confidence: 87
          },
          optionB: {
            title: 'Business Hours Enhanced (Alternative)',
            product: 'Fleet Care Standard - Enhanced',
            value: '₹24 Lakh/year',
            pros: ['Cost effective', 'Covers business hours', 'On-call emergency'],
            cons: ['Limited night support', '4-hour SLA', 'Additional charges for emergencies'],
            confidence: 79
          }
        },
        {
          id: 3,
          type: 'cross-sell',
          title: 'Telematics & Fleet Monitoring',
          description: 'Industry trends in automotive sector make fleet telematics a strategic operational advantage.',
          confidence: 78,
          reason: 'Similar automotive manufacturers in their scale typically adopt telematics solutions for efficiency gains.',
          product: 'Advanced Fleet Telematics Suite',
          estimatedValue: '₹48 Lakh/year',
          optionA: {
            title: 'AI-Powered Telematics (Primary)',
            product: 'Advanced Fleet Telematics with AI',
            value: '₹48 Lakh/year',
            pros: ['Real-time analytics', 'Predictive insights', 'Driver behavior scoring'],
            cons: ['Complex implementation', 'Training required'],
            confidence: 78
          },
          optionB: {
            title: 'Basic GPS Tracking (Alternative)',
            product: 'Essential Fleet Tracking System',
            value: '₹28 Lakh/year',
            pros: ['Easy to implement', 'Lower cost', 'Proven technology'],
            cons: ['Limited analytics', 'No predictive features', 'Basic reporting'],
            confidence: 82
          }
        }
      ]
    }
  }), []);

  // Real-time sync listener
  useEffect(() => {
    const cleanup = onSyncEvent((syncEvent) => {
      // Refresh when any recommendation event happens for this rep
      if (syncEvent.data.repId === currentUser?.repId) {
        console.log('📡 Recommendation updated in another tab - refreshing');
        setRefreshKey(prev => prev + 1);
        setLastUpdated(new Date());
      }
    });

    return cleanup;
  }, [currentUser?.repId]);

  // Initialize recommendations in store on mount
  useEffect(() => {
    const repId = currentUser?.repId || 1;
    // Use AI recommendations from shared data filtered by rep
    let repRecommendations = sharedAIRecommendations.filter(rec => rec.repId === repId);
    
    // Fallback to hardcoded recommendations if shared data is empty
    if (repRecommendations.length === 0 && recommendationsByRep[repId]) {
      repRecommendations = recommendationsByRep[repId].topRecommendations || [];
    }
    
    // Initialize these recommendations in the store
    if (repRecommendations.length > 0) {
      initRecommendations(repId, repRecommendations);
    }
  }, [currentUser?.repId, initRecommendations]);

  // Get recommendations based on current user's repId from shared data
  const currentRepId = currentUser?.repId || 1;
  let repRecommendations = sharedAIRecommendations.filter(rec => rec.repId === currentRepId);
  
  // Fallback to hardcoded recommendations if shared data is empty
  if (repRecommendations.length === 0 && recommendationsByRep[currentRepId]) {
    repRecommendations = recommendationsByRep[currentRepId].topRecommendations || [];
  }
  
  // Get unique filter options from recommendations
  // TENANT-AWARE: These options are automatically extracted from the current tenant's
  // recommendations. When user switches tenants (different Org ID), the filter options
  // will automatically update to show only technologies/partners/opportunity types from that tenant's data.
  const filterOptions = useMemo(() => {
    return {
      technologies: [...new Set(repRecommendations.map(rec => rec.technology).filter(Boolean))].sort(),
      partners: [...new Set(repRecommendations.map(rec => rec.partner).filter(Boolean))].sort(),
      opportunityTypes: [...new Set(repRecommendations.map(rec => rec.opportunityType).filter(Boolean))].sort(),
      accountNames: [...new Set(repRecommendations.map(rec => rec.company).filter(Boolean))].sort()
    };
  }, [repRecommendations]);
  
  // Apply filters to recommendations
  const filteredRecommendations = useMemo(() => {
    return repRecommendations.filter(rec => {
      if (dismissedIds.includes(rec.id)) return false;
      if (filters.technology && rec.technology !== filters.technology) return false;
      if (filters.partner && rec.partner !== filters.partner) return false;
      if (filters.opportunityType && rec.opportunityType !== filters.opportunityType) return false;
      if (filters.accountName && rec.company !== filters.accountName) return false;
      return true;
    });
  }, [repRecommendations, filters, dismissedIds]);
  
  // Sort by confidence and get top 3 across ALL accounts
  const topRecommendations = useMemo(() => {
    return [...filteredRecommendations]
      .sort((a, b) => (b.confidence || 0) - (a.confidence || 0)) // Sort by confidence descending
      .slice(0, 3); // Take top 3 highest confidence
  }, [filteredRecommendations]);
  
  // More recommendations: remaining items after top 3, sorted by confidence
  const moreRecommendations = useMemo(() => {
    return [...filteredRecommendations]
      .sort((a, b) => (b.confidence || 0) - (a.confidence || 0))
      .slice(3); // Skip top 3, take the rest
  }, [filteredRecommendations]);
  
  // Get unique account names from ALL recommendations
  const uniqueAccountNames = [...new Set(filteredRecommendations.map(rec => rec.company).filter(Boolean))];
  const accountName = uniqueAccountNames.length === 1 
    ? uniqueAccountNames[0] 
    : uniqueAccountNames.length > 1 
    ? `${uniqueAccountNames.length} Accounts` 
    : (recommendationsByRep[currentRepId]?.accountName || 'Your Accounts');

  const allRecommendations = filteredRecommendations;
  
  // Clear filters function
  const clearFilters = () => {
    setFilters({
      technology: '',
      partner: '',
      opportunityType: '',
      accountName: ''
    });
  };
  
  // Check if any filters are active
  const hasActiveFilters = filters.technology || filters.partner || filters.opportunityType || filters.accountName;

  // Calculate dynamic stats from actual recommendations
  const recommendationStats = useMemo(() => {
    const activeCount = allRecommendations.length;
    
    // Calculate total opportunity value
    const totalValue = allRecommendations.reduce((sum, rec) => {
      // Parse value from string like "₹68 Lakh/year" or "₹48 Lakh/year"
      if (rec.estimatedValue && typeof rec.estimatedValue === 'string') {
        const match = rec.estimatedValue.match(/₹?(\d+(?:\.\d+)?)\s*(?:Lakh|Cr)/i);
        if (match) {
          let value = parseFloat(match[1]);
          // Convert Lakh to Cr if needed
          if (rec.estimatedValue.toLowerCase().includes('lakh')) {
            value = value / 100; // Convert Lakh to Cr
          }
          return sum + value;
        }
      }
      return sum;
    }, 0);
    
    // Calculate average confidence
    const avgConfidence = activeCount > 0
      ? Math.round(allRecommendations.reduce((sum, rec) => sum + (rec.confidence || 0), 0) / activeCount)
      : 0;
    
    return {
      activeCount,
      totalValue: totalValue.toFixed(2),
      avgConfidence
    };
  }, [allRecommendations]);

  const handleAccept = (id) => {
    // Store the recommendation in Zustand store
    const rec = allRecommendations.find(r => r.id === id);
    if (rec) {
      acceptRecommendation(id, 'Accepted from AI Recommendations page');
      console.log('✅ Recommendation accepted and synced');
      
      // Navigate with recommendation data
      navigate('/sales/action-confirmation', {
        state: {
          accountName: rec.company || rec.title || 'Account',
          product: rec.product || rec.title || 'Product',
          value: rec.estimatedValue || `₹${(rec.confidence * 0.8).toFixed(2)} Cr`,
          confidence: rec.confidence || 0
        }
      });
    } else {
      navigate('/sales/action-confirmation');
    }
    setSelectedRecommendation(id);
  };

  const handleReject = (id) => {
    // Store the rejection in Zustand store
    const rec = allRecommendations.find(r => r.id === id);
    if (rec) {
      rejectRecommendation(id, 'Rejected from AI Recommendations page');
      console.log('❌ Recommendation rejected and synced');
    }
    // Dismiss the card without navigating away
    setDismissedIds(prev => [...prev, id]);
  };

  return (
    <div className="admin-layout">
      <SidebarNavigation role="sales" />
      <div className="admin-content">
        <TopNavbar 
          title="Product Recommendations" 
          subtitle={selectedAccount 
            ? `Recommendations for ${selectedAccount}` 
            : `Intelligent insights for ${accountName}`
          }
          user="Sales User"
        />
        
        <div className="page-body">
          <div className="recommendations-container">
          <div className="recommendations-controls">
            <div className="controls-left">
              <StatusBadge status="active" label="Real-time" icon={<TrendingUp size={14} />} />
              <span className="update-text">Last updated: {timeDisplay}</span>
            </div>
            <div className="controls-right">
              <button 
                className="refresh-button"
                onClick={() => {
                  setRefreshKey(prev => prev + 1);
                  setLastUpdated(new Date());
                }}
                title="Refresh recommendations"
              >
                <RefreshCw size={18} />
                Refresh
              </button>
              <button 
                className={`filter-button ${showFilters ? 'active' : ''} ${hasActiveFilters ? 'has-filters' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={18} />
                Filter
                {hasActiveFilters && <span className="filter-count">{Object.values(filters).filter(Boolean).length}</span>}
              </button>
            </div>
          </div>

          {/* Filter Dropdown Panel */}
          {showFilters && (
            <GlassCard className="filter-panel">
              <div className="filter-panel-header">
                <h4>Filter Recommendations</h4>
                {hasActiveFilters && (
                  <button className="clear-filters-btn" onClick={clearFilters}>
                    <X size={16} />
                    Clear All
                  </button>
                )}
              </div>
              
              <div className="filter-panel-body">
                {/* Technology Filter */}
                <div className="filter-group">
                  <label className="filter-label">Technology</label>
                  <div className="filter-select-wrapper">
                    <select 
                      className="filter-select"
                      value={filters.technology}
                      onChange={(e) => setFilters({...filters, technology: e.target.value})}
                    >
                      <option value="">All Technologies</option>
                      {filterOptions.technologies.map(tech => (
                        <option key={tech} value={tech}>{tech}</option>
                      ))}
                    </select>
                    <ChevronDown size={18} className="select-icon" />
                  </div>
                </div>

                {/* Partner Filter */}
                <div className="filter-group">
                  <label className="filter-label">Partner</label>
                  <div className="filter-select-wrapper">
                    <select 
                      className="filter-select"
                      value={filters.partner}
                      onChange={(e) => setFilters({...filters, partner: e.target.value})}
                    >
                      <option value="">All Partners</option>
                      {filterOptions.partners.map(partner => (
                        <option key={partner} value={partner}>{partner}</option>
                      ))}
                    </select>
                    <ChevronDown size={18} className="select-icon" />
                  </div>
                </div>

                {/* Opportunity Type Filter */}
                <div className="filter-group">
                  <label className="filter-label">Opportunity Type</label>
                  <div className="filter-select-wrapper">
                    <select 
                      className="filter-select"
                      value={filters.opportunityType}
                      onChange={(e) => setFilters({...filters, opportunityType: e.target.value})}
                    >
                      <option value="">All Types</option>
                      {filterOptions.opportunityTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <ChevronDown size={18} className="select-icon" />
                  </div>
                </div>

                {/* Account Name Filter */}
                <div className="filter-group">
                  <label className="filter-label">Account Name</label>
                  <div className="filter-select-wrapper">
                    <select 
                      className="filter-select"
                      value={filters.accountName}
                      onChange={(e) => setFilters({...filters, accountName: e.target.value})}
                    >
                      <option value="">All Accounts</option>
                      {filterOptions.accountNames.map(account => (
                        <option key={account} value={account}>{account}</option>
                      ))}
                    </select>
                    <ChevronDown size={18} className="select-icon" />
                  </div>
                </div>
              </div>
            </GlassCard>
          )}

          <div className="recommendations-section">
            <div className="section-header">
              <h3 className="section-title">Top 3 Recommendations</h3>
              <p className="section-subtitle">Highest confidence opportunities across {accountName}</p>
            </div>
            <div className="recommendations-grid">
              {topRecommendations.length === 0 ? (
                <GlassCard className="empty-state" style={{gridColumn: '1 / -1', textAlign: 'center', padding: '3rem'}}>
                  <Sparkles size={48} style={{opacity: 0.3, margin: '0 auto 1rem'}} />
                  <h3>No recommendations found{selectedAccount && ` for ${selectedAccount}`}</h3>
                  <p style={{marginBottom: '1.5rem'}}>There are no recommendations matching your current filters.</p>
                  {selectedAccount && (
                    <button 
                      className="filter-button"
                      onClick={() => {
                        setFilters({technology: '', partner: '', opportunityType: '', accountName: ''});
                        window.history.replaceState({}, document.title);
                      }}
                      style={{background: 'var(--salesforce-blue)', color: 'white', border: 'none'}}
                    >
                      View All Recommendations
                    </button>
                  )}
                </GlassCard>
              ) : (
                topRecommendations.map((reco) => (
                <AIRecommendationCard
                  key={reco.id}
                  type={reco.type}
                  accountName={reco.company || accountName}
                  opportunityName={reco.opportunityName}
                  currentProduct={reco.currentProduct}
                  recommendedProduct={reco.recommendedProduct}
                  recommendationType={reco.opportunityType}
                  salesRegion={reco.salesRegion}
                  title={reco.title}
                  description={reco.description}
                  confidence={reco.confidence}
                  reason={reco.reason}
                  product={reco.product}
                  technology={reco.technology}
                  partner={reco.partner}
                  estimatedValue={reco.estimatedValue}
                  optionA={reco.optionA}
                  optionB={reco.optionB}
                  onAccept={() => handleAccept(reco.id)}
                  onReject={() => handleReject(reco.id)}
                />
              ))
              )}
            </div>
          </div>

          <div className="recommendations-section">
            <div className="section-header">
              <h3 className="section-title">More Recommendations</h3>
              <p className="section-subtitle">Additional opportunities for growth and optimization</p>
            </div>
            <div className="recommendations-grid">
              {moreRecommendations.length > 0 ? (
                moreRecommendations.map((reco) => (
                <AIRecommendationCard
                  key={reco.id}
                  type={reco.type}
                  accountName={reco.company || accountName}
                  opportunityName={reco.opportunityName}
                  currentProduct={reco.currentProduct}
                  recommendedProduct={reco.recommendedProduct}
                  recommendationType={reco.opportunityType}
                  salesRegion={reco.salesRegion}
                  title={reco.title}
                  description={reco.description}
                  confidence={reco.confidence}
                  reason={reco.reason}
                  product={reco.product}
                  technology={reco.technology}
                  partner={reco.partner}
                  estimatedValue={reco.estimatedValue}
                  onAccept={() => handleAccept(reco.id)}
                  onReject={() => handleReject(reco.id)}
                />
              ))
              ) : topRecommendations.length > 0 ? (
                <p style={{gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)', padding: '2rem'}}>No additional recommendations at this time.</p>
              ) : null}
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendations;
