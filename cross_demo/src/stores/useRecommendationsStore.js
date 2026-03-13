import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { broadcastSync, SYNC_EVENTS } from '../utils/syncManager';

const useRecommendationsStore = create(
  persist(
    (set, get) => ({
      recommendations: [],
      acceptedRecommendations: [],
      rejectedRecommendations: [],
      
      // Initialize recommendations for a rep
      initRecommendations: (repId, initialRecommendations) => {
        set((state) => {
          const existing = state.recommendations.filter(r => r.repId !== repId);
          return {
            recommendations: [
              ...existing,
              ...initialRecommendations.map(rec => ({
                ...rec,
                id: rec.id || uuidv4(),
                repId,
                createdAt: rec.createdAt || new Date().toISOString(),
                status: 'pending'
              }))
            ]
          };
        });
      },
      
      // Get recommendations by rep
      getRecommendationsByRep: (repId) => {
        return get().recommendations.filter(r => r.repId === repId && r.status === 'pending');
      },
      
      // Get recommendation by ID
      getRecommendationById: (recId) => {
        return get().recommendations.find(r => r.id === recId);
      },
      
      // Accept recommendation
      acceptRecommendation: (recId, notes = '') => {
        const recommendation = get().getRecommendationById(recId);
        if (!recommendation) return null;
        
        set((state) => ({
          recommendations: state.recommendations.map(r =>
            r.id === recId
              ? { ...r, status: 'accepted', acceptedAt: new Date().toISOString(), notes }
              : r
          ),
          acceptedRecommendations: [
            ...state.acceptedRecommendations,
            { ...recommendation, status: 'accepted', acceptedAt: new Date().toISOString(), notes }
          ]
        }));
        
        // Broadcast to other tabs
        broadcastSync(SYNC_EVENTS.RECOMMENDATION_ACCEPTED, {
          recId,
          repId: recommendation.repId,
          notes,
          timestamp: new Date().toISOString()
        });
        
        return recommendation;
      },
      
      // Reject recommendation
      rejectRecommendation: (recId, reason = '') => {
        const recommendation = get().getRecommendationById(recId);
        if (!recommendation) return null;
        
        set((state) => ({
          recommendations: state.recommendations.map(r =>
            r.id === recId
              ? { ...r, status: 'rejected', rejectedAt: new Date().toISOString(), reason }
              : r
          ),
          rejectedRecommendations: [
            ...state.rejectedRecommendations,
            { ...recommendation, status: 'rejected', rejectedAt: new Date().toISOString(), reason }
          ]
        }));
        
        // Broadcast to other tabs
        broadcastSync(SYNC_EVENTS.RECOMMENDATION_REJECTED, {
          recId,
          repId: recommendation.repId,
          reason,
          timestamp: new Date().toISOString()
        });
        
        return recommendation;
      },
      
      // Add new recommendation (AI generated or manual)
      addRecommendation: (recommendation) => {
        const newRec = {
          ...recommendation,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          status: 'pending'
        };
        
        set((state) => ({
          recommendations: [...state.recommendations, newRec]
        }));
        
        // Broadcast to other tabs
        broadcastSync(SYNC_EVENTS.RECOMMENDATION_CREATED, {
          recommendation: newRec,
          repId: newRec.repId,
          timestamp: new Date().toISOString()
        });
        
        return newRec;
      },
      
      // Generate recommendations based on deal stage
      generateRecommendationsForDeal: (deal, repId) => {
        const recommendations = [];
        
        // Cross-sell opportunities based on deal stage
        if (deal.stage === 'Negotiation' || deal.stage === 'Proposal') {
          recommendations.push({
            id: uuidv4(),
            repId,
            dealId: deal.id,
            type: 'cross-sell',
            title: 'Maintenance Package Upsell',
            description: `Based on ${deal.name}'s fleet size, recommend premium maintenance package`,
            confidence: 87,
            impact: 'High',
            estimatedValue: deal.value * 0.15,
            reason: 'Companies in negotiation stage have 72% acceptance rate for maintenance packages',
            createdAt: new Date().toISOString(),
            status: 'pending'
          });
        }
        
        if (deal.stage === 'Closed Won') {
          recommendations.push({
            id: uuidv4(),
            repId,
            dealId: deal.id,
            type: 'upsell',
            title: 'Extended Warranty Program',
            description: 'Perfect timing to offer extended warranty within 30 days of deal close',
            confidence: 92,
            impact: 'High',
            estimatedValue: deal.value * 0.08,
            reason: 'Post-purchase trust is highest, warranty acceptance rate: 89%',
            createdAt: new Date().toISOString(),
            status: 'pending'
          });
        }
        
        return recommendations;
      },
      
      // Get acceptance rate by rep
      getAcceptanceRate: (repId) => {
        const repAccepted = get().acceptedRecommendations.filter(r => r.repId === repId);
        const repRejected = get().rejectedRecommendations.filter(r => r.repId === repId);
        const total = repAccepted.length + repRejected.length;
        
        return total > 0 ? (repAccepted.length / total) * 100 : 0;
      },
      
      // Get all recommendations for a team (Manager view)
      getRecommendationsByTeam: (teamRepIds) => {
        return get().recommendations.filter(r => teamRepIds.includes(r.repId));
      },
      
      // Get all recommendations by region (VP view)
      getRecommendationsByRegion: (region, salesReps) => {
        const regionRepIds = salesReps
          .filter(rep => rep.region === region)
          .map(rep => rep.id);
        return get().recommendations.filter(r => regionRepIds.includes(r.repId));
      },
      
      // Get all recommendations with rep details (for managers/VPs)
      getAllRecommendationsWithRepInfo: (salesReps) => {
        return get().recommendations.map(rec => {
          const rep = salesReps.find(r => r.id === rec.repId);
          return {
            ...rec,
            repName: rep?.name || 'Unknown',
            repRegion: rep?.region || 'Unknown',
            repManager: rep?.manager || 'Unknown'
          };
        });
      },
      
      // Get team statistics for managers
      getTeamStats: (teamRepIds) => {
        const allRecs = get().recommendations.filter(r => teamRepIds.includes(r.repId));
        const pending = allRecs.filter(r => r.status === 'pending').length;
        const accepted = get().acceptedRecommendations.filter(r => teamRepIds.includes(r.repId)).length;
        const rejected = get().rejectedRecommendations.filter(r => teamRepIds.includes(r.repId)).length;
        const total = allRecs.length;
        
        return {
          total,
          pending,
          accepted,
          rejected,
          acceptanceRate: total > 0 ? ((accepted / (accepted + rejected)) * 100).toFixed(1) : 0
        };
      },
      
      // Clear all recommendations
      clearRecommendations: () => {
        set({
          recommendations: [],
          acceptedRecommendations: [],
          rejectedRecommendations: []
        });
      }
    }),
    {
      name: 'recommendations-storage',
      version: 3  // Bumped to clear cached data and reinitialize with all reps' recommendations
    }
  )
);

export default useRecommendationsStore;
