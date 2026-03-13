import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import SidebarNavigation from '../../components/SidebarNavigation/SidebarNavigation';
import TopNavbar from '../../components/TopNavbar/TopNavbar';
import GlassCard from '../../components/GlassCard/GlassCard';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import DealForm from '../../components/DealForm/DealForm';
import useDealsStore from '../../stores/useDealsStore';
import useActivitiesStore from '../../stores/useActivitiesStore';
import { formatCurrency, formatDate, getStatusColor } from '../../utils/helpers';
import { notify } from '../../utils/notifications';
import { Plus, Search, Filter, Edit, Trash2, TrendingUp } from 'lucide-react';
import './DealsPage.css';

const DealsPage = () => {
  const { currentUser } = useAuth();
  const { getDealsByRep, updateDealStage, deleteDeal } = useDealsStore();
  const { logDealActivity } = useActivitiesStore();
  
  const [showDealForm, setShowDealForm] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [sortBy, setSortBy] = useState('updatedAt');

  // Get user's deals from store
  const userDeals = getDealsByRep(currentUser?.repId || 1);

  // Filter and sort deals
  const filteredDeals = useMemo(() => {
    let filtered = userDeals;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(deal =>
        deal.name?.toLowerCase().includes(query) ||
        deal.company?.toLowerCase().includes(query) ||
        deal.industry?.toLowerCase().includes(query)
      );
    }

    // Stage filter
    if (stageFilter !== 'all') {
      filtered = filtered.filter(deal => deal.stage === stageFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'value') {
        const aVal = typeof a.value === 'number' ? a.value : parseFloat(a.value.replace(/[^\d.]/g, '')) || 0;
        const bVal = typeof b.value === 'number' ? b.value : parseFloat(b.value.replace(/[^\d.]/g, '')) || 0;
        return bVal - aVal;
      } else if (sortBy === 'updatedAt') {
        return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
      }
      return 0;
    });

    return filtered;
  }, [userDeals, searchQuery, stageFilter, sortBy]);

  // Calculate pipeline stats
  const stats = useMemo(() => {
    const total = userDeals.length;
    const totalValue = userDeals.reduce((sum, deal) => {
      const val = typeof deal.value === 'number' ? deal.value : parseFloat(deal.value.replace(/[^\d.]/g, '')) || 0;
      return sum + val;
    }, 0);
    
    const byStage = userDeals.reduce((acc, deal) => {
      acc[deal.stage] = (acc[deal.stage] || 0) + 1;
      return acc;
    }, {});

    return { total, totalValue, byStage };
  }, [userDeals]);

  const stages = ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];

  const handleEditDeal = (deal) => {
    setEditingDeal(deal);
    setShowDealForm(true);
  };

  const handleDeleteDeal = (deal) => {
    if (window.confirm(`Are you sure you want to delete "${deal.name}"?`)) {
      deleteDeal(deal.id);
      notify.dealDeleted(deal.name);
      
      logDealActivity(
        deal.id,
        currentUser.repId,
        'deal_deleted',
        `${currentUser.name} deleted the deal`,
        { dealName: deal.name }
      );
    }
  };

  const handleStageChange = (deal, newStage) => {
    updateDealStage(deal.id, newStage);
    notify.stageChanged(deal.name, newStage);
    
    logDealActivity(
      deal.id,
      currentUser.repId,
      'stage_change',
      `${currentUser.name} moved deal to ${newStage}`,
      { oldStage: deal.stage, newStage }
    );
  };

  const handleFormClose = () => {
    setShowDealForm(false);
    setEditingDeal(null);
  };

  return (
    <div className="admin-layout">
      <SidebarNavigation role="sales" />
      <div className="admin-content">
        <TopNavbar 
          title="My Pipeline"
          subtitle="Manage your deals and opportunities"
          user={currentUser?.name}
        />
        
        <div className="page-body deals-page">
          {/* Stats Summary */}
          <div className="deals-stats-grid">
            <GlassCard>
              <div className="stat-card">
                <div className="stat-icon" style={{ background: 'rgba(27, 150, 255, 0.2)' }}>
                  <TrendingUp size={24} color="#1B96FF" />
                </div>
                <div>
                  <div className="stat-label">Total Deals</div>
                  <div className="stat-value">{stats.total}</div>
                </div>
              </div>
            </GlassCard>
            
            <GlassCard>
              <div className="stat-card">
                <div className="stat-icon" style={{ background: 'rgba(34, 211, 238, 0.2)' }}>
                  <TrendingUp size={24} color="#22D3EE" />
                </div>
                <div>
                  <div className="stat-label">Pipeline Value</div>
                  <div className="stat-value">{formatCurrency(stats.totalValue)}</div>
                </div>
              </div>
            </GlassCard>
            
            <GlassCard>
              <div className="stat-card">
                <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.2)' }}>
                  <TrendingUp size={24} color="#22C55E" />
                </div>
                <div>
                  <div className="stat-label">Active Deals</div>
                  <div className="stat-value">
                    {stats.byStage['Negotiation'] || 0 + stats.byStage['Proposal'] || 0}
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Controls */}
          <GlassCard className="deals-controls">
            <div className="controls-left">
              <div className="search-box">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search deals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="filter-group">
                <Filter size={18} />
                <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)}>
                  <option value="all">All Stages</option>
                  {stages.map(stage => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <span>Sort by:</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="updatedAt">Recently Updated</option>
                  <option value="value">Deal Value</option>
                </select>
              </div>
            </div>
            
            <button 
              className="btn-primary"
              onClick={() => setShowDealForm(true)}
            >
              <Plus size={18} />
              New Deal
            </button>
          </GlassCard>

          {/* Deals List */}
          <GlassCard className="deals-list-card">
            {filteredDeals.length === 0 ? (
              <div className="empty-state">
                <TrendingUp size={48} opacity={0.3} />
                <h3>No deals found</h3>
                <p>Create your first deal to get started</p>
                <button className="btn-primary" onClick={() => setShowDealForm(true)}>
                  <Plus size={18} />
                  Create Deal
                </button>
              </div>
            ) : (
              <div className="deals-table">
                <div className="table-header">
                  <div className="col-name">Deal Name</div>
                  <div className="col-company">Company</div>
                  <div className="col-stage">Stage</div>
                  <div className="col-value">Value</div>
                  <div className="col-date">Last Updated</div>
                  <div className="col-actions">Actions</div>
                </div>
                
                {filteredDeals.map((deal) => (
                  <div key={deal.id} className="table-row">
                    <div className="col-name">
                      <div className="deal-name-cell">
                        <div className="deal-name">{deal.name}</div>
                        <div className="deal-industry">{deal.industry}</div>
                      </div>
                    </div>
                    
                    <div className="col-company">{deal.company}</div>
                    
                    <div className="col-stage">
                      <select
                        value={deal.stage}
                        onChange={(e) => handleStageChange(deal, e.target.value)}
                        className="stage-selector"
                        style={{ borderColor: getStatusColor(deal.stage) }}
                      >
                        {stages.map(stage => (
                          <option key={stage} value={stage}>{stage}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="col-value deal-value">
                      {formatCurrency(deal.value)}
                    </div>
                    
                    <div className="col-date">
                      {formatDate(deal.updatedAt || deal.createdAt)}
                    </div>
                    
                    <div className="col-actions">
                      <button 
                        className="action-btn edit-btn"
                        onClick={() => handleEditDeal(deal)}
                        title="Edit deal"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteDeal(deal)}
                        title="Delete deal"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      </div>

      {/* Deal Form Modal */}
      {showDealForm && (
        <DealForm
          deal={editingDeal}
          repId={currentUser?.repId}
          repName={currentUser?.name}
          region={currentUser?.region}
          onClose={handleFormClose}
          onSave={() => {
            // Refresh happens automatically via Zustand
          }}
        />
      )}
    </div>
  );
};

export default DealsPage;
