import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SidebarNavigation from '../../components/SidebarNavigation/SidebarNavigation';
import TopNavbar from '../../components/TopNavbar/TopNavbar';
import GlassCard from '../../components/GlassCard/GlassCard';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import useRecommendationsStore from '../../stores/useRecommendationsStore';
import { salesReps, getAIRecommendations } from '../../data/sharedData';
import { formatCurrency, formatRelativeTime, getStatusColor } from '../../utils/helpers';
import { onSyncEvent, createPollingRefresh, SYNC_EVENTS } from '../../utils/syncManager';
import { Users, TrendingUp, Sparkles, Filter, Search, Eye, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import './TeamRecommendations.css';

const TeamRecommendations = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const { 
    getAllRecommendationsWithRepInfo,
    getTeamStats,
    initRecommendations 
  } = useRecommendationsStore();
  
  // Get account from navigation state if coming from Accounts page
  const selectedAccount = location.state?.accountName || '';
  
  const [searchQuery, setSearchQuery] = useState(selectedAccount);
  const [regionFilter, setRegionFilter] = useState('all');
  const [repFilter, setRepFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [refreshKey, setRefreshKey] = useState(0); // Force re-render on sync

  // Update search when coming from account selection
  useEffect(() => {
    if (selectedAccount) {
      setSearchQuery(selectedAccount);
    }
  }, [selectedAccount]);

  // Get fresh recommendations based on current tenant
  const aiRecommendations = useMemo(() => getAIRecommendations(), [refreshKey]);

  // Determine which reps the current user can see
  const visibleReps = useMemo(() => {
    if (!currentUser) return [];
    
    if (currentUser.role === 'sales-head') {
      // VP sees everyone
      return salesReps;
    } else if (currentUser.role === 'sales-manager') {
      // Manager sees their team - filter by managerId (preferred) or manager name (fallback)
      if (currentUser.managerId) {
        return salesReps.filter(rep => rep.managerId === currentUser.managerId);
      } else {
        return salesReps.filter(rep => rep.manager === currentUser.name);
      }
    }
    return [];
  }, [currentUser]);

  const visibleRepIds = visibleReps.map(r => r.id);

  // Helper function to get recommendations for a specific rep from tenant data
  const getTenantRecommendationsForRep = (repId) => {
    return aiRecommendations
      .filter(rec => rec.repId === repId)
      .map(rec => ({
        id: `team-rec-${repId}-${rec.id}`,
        type: rec.type,
        accountName: rec.company || 'Unknown',
        opportunityName: rec.opportunityName,
        currentProduct: rec.currentProduct,
        recommendedProduct: rec.recommendedProduct,
        salesRegion: rec.salesRegion,
        title: rec.title,
        description: rec.description,
        confidence: rec.confidence,
        reason: rec.reason,
        estimatedValue: rec.estimatedValue,
        impact: rec.confidence >= 85 ? 'High' : rec.confidence >= 75 ? 'Medium' : 'Low',
        region: rec.region || rec.salesRegion,
        product: rec.product,
        technology: rec.technology,
        partner: rec.partner
      }));
  };

  // Initialize recommendations from current tenant data
  useEffect(() => {
    console.log('🔄 Initializing Team Recommendations from tenant data...');
    // Initialize recommendations for each rep using current tenant's data
    salesReps.forEach(rep => {
      const tenantRecs = getTenantRecommendationsForRep(rep.id);
      console.log(`  📝 Rep ${rep.id} (${rep.name}): ${tenantRecs.length} recommendations from tenant`);
      if (tenantRecs.length > 0) {
        initRecommendations(rep.id, tenantRecs);
        console.log(`  ✅ Initialized ${tenantRecs.length} tenant recommendations for Rep ${rep.id}`);
      }
    });
    console.log('✅ Team Recommendations initialization complete with tenant data');
  }, [aiRecommendations, initRecommendations]);

  // REAL-TIME SYNC: Listen for cross-tab updates
  useEffect(() => {
    const cleanup = onSyncEvent((syncEvent) => {
      console.log('📡 Sync event received:', syncEvent.type, syncEvent.data);
      
      // Check if this event is relevant to visible reps
      if (syncEvent.data.repId && visibleRepIds.includes(syncEvent.data.repId)) {
        console.log('✅ Relevant to this manager/head - refreshing data');
        setRefreshKey(prev => prev + 1); // Force re-render
      }
    });

    return cleanup;
  }, [visibleRepIds]);

  // POLLING: Auto-refresh every 5 seconds for same-tab updates
  useEffect(() => {
    const cleanup = createPollingRefresh(() => {
      setRefreshKey(prev => prev + 1);
    }, 5000);

    return cleanup;
  }, []);

  // Get all recommendations with rep info (reactive to refreshKey)
  const allRecommendations = useMemo(() => {
    return getAllRecommendationsWithRepInfo(salesReps);
  }, [refreshKey]); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Filter recommendations to only show those for visible reps
  const teamRecommendations = allRecommendations.filter(rec => 
    visibleRepIds.includes(rec.repId)
  );

  // Debug: Verify filtering is working
  console.log('🔍 Team Recommendations Debug:', {
    currentUserRole: currentUser?.role,
    currentUserName: currentUser?.name,
    currentManagerId: currentUser?.managerId,
    visibleReps: visibleReps.map(r => `${r.name} (id:${r.id})`),
    visibleRepIds,
    totalRecommendations: allRecommendations.length,
    filteredRecommendations: teamRecommendations.length,
    recommendationsByRep: visibleRepIds.map(repId => ({
      repId,
      repName: visibleReps.find(r => r.id === repId)?.name,
      count: teamRecommendations.filter(r => r.repId === repId).length
    }))
  });

  // Apply filters
  const filteredRecommendations = useMemo(() => {
    let filtered = teamRecommendations;

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(rec =>
        rec.title?.toLowerCase().includes(query) ||
        rec.description?.toLowerCase().includes(query) ||
        rec.repName?.toLowerCase().includes(query)
      );
    }

    // Region filter
    if (regionFilter !== 'all') {
      filtered = filtered.filter(rec => rec.repRegion === regionFilter);
    }

    // Rep filter
    if (repFilter !== 'all') {
      filtered = filtered.filter(rec => rec.repId === parseInt(repFilter));
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(rec => rec.type === typeFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(rec => rec.status === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'confidence') {
        return b.confidence - a.confidence;
      } else if (sortBy === 'value') {
        const aVal = typeof a.estimatedValue === 'number' ? a.estimatedValue : 0;
        const bVal = typeof b.estimatedValue === 'number' ? b.estimatedValue : 0;
        return bVal - aVal;
      } else if (sortBy === 'createdAt') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });

    return filtered;
  }, [teamRecommendations, searchQuery, regionFilter, repFilter, typeFilter, statusFilter, sortBy]);

  // Calculate stats
  const stats = getTeamStats(visibleRepIds);
  console.log('📊 Team Stats:', stats);

  // Get unique regions for filter
  const regions = [...new Set(visibleReps.map(r => r.region))];
  
  // Get unique opportunity types from recommendations (tenant-aware)
  const opportunityTypes = useMemo(() => {
    return [...new Set(teamRecommendations.map(rec => rec.type).filter(Boolean))].sort();
  }, [teamRecommendations]);
  
  // Helper to format opportunity type for display
  const formatOpportunityType = (type) => {
    if (!type) return 'Unknown';
    // Convert "cross-sell" to "Cross-Sell", "upsell" to "Upsell", etc.
    return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-');
  };

  // Loading check - after all hooks
  if (!currentUser) {
    return (
      <div className="admin-layout">
        <div className="admin-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h2>Loading...</h2>
            <p>Please wait while we load your team recommendations</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <SidebarNavigation role={currentUser.role === 'sales-head' ? 'sales-head' : 'sales-manager'} />
      <div className="admin-content">
        <TopNavbar 
          title={currentUser.role === 'sales-head' ? 'All Recommendations' : 'Team Recommendations'}
          subtitle={currentUser.role === 'sales-head' 
            ? 'View recommendations across all regions'
            : `Monitor your team's recommendations`}
          user={currentUser?.name}
        />
        
        <div className="page-body team-recommendations-page">
          {/* Stats Grid */}
          <div className="stats-grid">
            <GlassCard>
              <div className="stat-item">
                <Sparkles size={24} color="#1B96FF" />
                <div>
                  <div className="stat-value">{stats.total}</div>
                  <div className="stat-label">Total Recommendations</div>
                </div>
              </div>
            </GlassCard>
            
            <GlassCard>
              <div className="stat-item">
                <Clock size={24} color="#FFA726" />
                <div>
                  <div className="stat-value">{stats.pending}</div>
                  <div className="stat-label">Pending Review</div>
                </div>
              </div>
            </GlassCard>
            
            <GlassCard>
              <div className="stat-item">
                <CheckCircle size={24} color="#22C55E" />
                <div>
                  <div className="stat-value">{stats.accepted}</div>
                  <div className="stat-label">Accepted</div>
                </div>
              </div>
            </GlassCard>
            
            <GlassCard>
              <div className="stat-item">
                <TrendingUp size={24} color="#A855F7" />
                <div>
                  <div className="stat-value">{stats.acceptanceRate}%</div>
                  <div className="stat-label">Acceptance Rate</div>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Filters & Controls */}
          <GlassCard className="controls-card">
            <div className="controls-row">
              <div className="search-box">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search recommendations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <button 
                className="refresh-button"
                onClick={() => setRefreshKey(prev => prev + 1)}
                title="Refresh recommendations"
              >
                <RefreshCw size={18} />
                Refresh
              </button>
              
              <div className="filters-group">
                {currentUser.role === 'sales-head' && regions.length > 1 && (
                  <select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)}>
                    <option value="all">All Regions</option>
                    {regions.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                )}
                
                <select value={repFilter} onChange={(e) => setRepFilter(e.target.value)}>
                  <option value="all">All Reps</option>
                  {visibleReps.map(rep => (
                    <option key={rep.id} value={rep.id}>{rep.name}</option>
                  ))}
                </select>
                
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                  <option value="all">All Types</option>
                  {opportunityTypes.map(type => (
                    <option key={type} value={type}>{formatOpportunityType(type)}</option>
                  ))}
                </select>
                
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
                
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="createdAt">Recent First</option>
                  <option value="confidence">High Confidence</option>
                  <option value="value">High Value</option>
                </select>
              </div>
            </div>
          </GlassCard>

          {/* Recommendations List */}
          <div className="recommendations-list">
            {filteredRecommendations.length === 0 ? (
              <GlassCard className="empty-state">
                <Sparkles size={48} opacity={0.3} />
                <h3>No recommendations found{selectedAccount && ` for ${selectedAccount}`}</h3>
                <p>Try adjusting your filters or check back later</p>
                {selectedAccount && (
                  <button 
                    className="refresh-button"
                    onClick={() => {
                      setSearchQuery('');
                      window.history.replaceState({}, document.title);
                    }}
                    style={{marginTop: '1rem', background: 'var(--salesforce-blue)', color: 'white', border: 'none'}}
                  >
                    View All Recommendations
                  </button>
                )}
              </GlassCard>
            ) : (
              filteredRecommendations.map((rec) => (
                <GlassCard key={rec.id} className="recommendation-card-readonly">
                  <div className="rec-header">
                    <div className="rec-title-row">
                      {rec.accountName && (
                        <div className="rec-account-name">{rec.accountName}</div>
                      )}
                      <div className="rec-badges">
                        <StatusBadge 
                          status={rec.type === 'cross-sell' ? 'info' : 'active'} 
                          label={formatOpportunityType(rec.type)} 
                        />
                        <StatusBadge 
                          status={rec.confidence >= 85 ? 'success' : 'warning'} 
                          label={`${rec.confidence}% Confidence`} 
                        />
                        <StatusBadge 
                          status={rec.status === 'accepted' ? 'success' : rec.status === 'rejected' ? 'error' : 'warning'} 
                          label={rec.status.charAt(0).toUpperCase() + rec.status.slice(1)} 
                        />
                      </div>
                    </div>
                    
                    <div className="rec-rep-info">
                      <Users size={16} />
                      <span className="rep-name">{rec.repName}</span>
                      {currentUser.role === 'sales-head' && (
                        <span className="rep-region">• {rec.repRegion} Region</span>
                      )}
                      <span className="rec-time">• {formatRelativeTime(rec.createdAt)}</span>
                    </div>
                  </div>
                  
                  <div className="rec-details-grid">
                    {rec.opportunityName && (
                      <div className="detail-item">
                        <span className="detail-label">Opportunity</span>
                        <span className="detail-value">{rec.opportunityName}</span>
                      </div>
                    )}
                    
                    {rec.currentProduct && (
                      <div className="detail-item">
                        <span className="detail-label">Current Product</span>
                        <span className="detail-value">{rec.currentProduct}</span>
                      </div>
                    )}
                    
                    {rec.recommendedProduct && (
                      <div className="detail-item">
                        <span className="detail-label">Recommended Product</span>
                        <span className="detail-value">{rec.recommendedProduct}</span>
                      </div>
                    )}
                    
                    {rec.salesRegion && (
                      <div className="detail-item">
                        <span className="detail-label">Region</span>
                        <span className="detail-value">{rec.salesRegion}</span>
                      </div>
                    )}
                    
                    {rec.impact && (
                      <div className="detail-item">
                        <span className="detail-label">Impact Level</span>
                        <StatusBadge 
                          status={rec.impact === 'High' ? 'success' : 'info'} 
                          label={rec.impact} 
                        />
                      </div>
                    )}
                  </div>

                  {(rec.notes || rec.reason) && rec.status !== 'pending' && (
                    <div className={`rec-decision ${rec.status}`}>
                      <strong>
                        {rec.status === 'accepted' ? '✓ Rep Accepted' : '✗ Rep Dismissed'}:
                      </strong>
                      <span>{rec.notes || rec.reason || 'No feedback provided'}</span>
                    </div>
                  )}
                </GlassCard>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get static recommendations by rep ID
export default TeamRecommendations;
