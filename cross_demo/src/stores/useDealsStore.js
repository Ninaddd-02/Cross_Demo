import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { allDeals } from '../data/sharedData';
import { v4 as uuidv4 } from 'uuid';

const useDealsStore = create(
  persist(
    (set, get) => ({
      deals: allDeals,
      
      // Get deals by sales rep ID
      getDealsByRep: (repId) => {
        return get().deals.filter(deal => deal.repId === repId);
      },
      
      // Get deals by region
      getDealsByRegion: (region) => {
        return get().deals.filter(deal => deal.region === region);
      },
      
      // Get deal by ID
      getDealById: (dealId) => {
        return get().deals.find(deal => deal.id === dealId);
      },
      
      // Add new deal
      addDeal: (dealData) => {
        const newDeal = {
          ...dealData,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          activities: [],
          aiRecommendations: []
        };
        
        set((state) => ({
          deals: [...state.deals, newDeal]
        }));
        
        return newDeal;
      },
      
      // Update deal
      updateDeal: (dealId, updates) => {
        set((state) => ({
          deals: state.deals.map(deal =>
            deal.id === dealId
              ? {
                  ...deal,
                  ...updates,
                  updatedAt: new Date().toISOString()
                }
              : deal
          )
        }));
      },
      
      // Delete deal
      deleteDeal: (dealId) => {
        set((state) => ({
          deals: state.deals.filter(deal => deal.id !== dealId)
        }));
      },
      
      // Update deal stage
      updateDealStage: (dealId, newStage) => {
        set((state) => ({
          deals: state.deals.map(deal =>
            deal.id === dealId
              ? {
                  ...deal,
                  stage: newStage,
                  updatedAt: new Date().toISOString()
                }
              : deal
          )
        }));
      },
      
      // Add activity to deal
      addDealActivity: (dealId, activity) => {
        set((state) => ({
          deals: state.deals.map(deal =>
            deal.id === dealId
              ? {
                  ...deal,
                  activities: [
                    ...(deal.activities || []),
                    {
                      ...activity,
                      id: uuidv4(),
                      timestamp: new Date().toISOString()
                    }
                  ],
                  updatedAt: new Date().toISOString()
                }
              : deal
          )
        }));
      },
      
      // Update deal value
      updateDealValue: (dealId, value) => {
        set((state) => ({
          deals: state.deals.map(deal =>
            deal.id === dealId
              ? {
                  ...deal,
                  value,
                  updatedAt: new Date().toISOString()
                }
              : deal
          )
        }));
      },
      
      // Search deals
      searchDeals: (query) => {
        const lowerQuery = query.toLowerCase();
        return get().deals.filter(deal =>
          deal.name?.toLowerCase().includes(lowerQuery) ||
          deal.company?.toLowerCase().includes(lowerQuery) ||
          deal.industry?.toLowerCase().includes(lowerQuery)
        );
      },
      
      // Filter deals by status
      filterDealsByStatus: (status) => {
        return get().deals.filter(deal => deal.status === status);
      },
      
      // Get pipeline value by rep
      getPipelineValueByRep: (repId) => {
        const repDeals = get().getDealsByRep(repId);
        return repDeals.reduce((total, deal) => {
          const value = typeof deal.value === 'string' 
            ? parseFloat(deal.value.replace(/[^\d.]/g, ''))
            : deal.value;
          return total + (value || 0);
        }, 0);
      },
      
      // Reset to initial data
      resetDeals: () => {
        set({ deals: allDeals });
      }
    }),
    {
      name: 'deals-storage',
      version: 1
    }
  )
);

export default useDealsStore;
