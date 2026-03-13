import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

const useActivitiesStore = create(
  persist(
    (set, get) => ({
      activities: [],
      
      // Add new activity
      addActivity: (activity) => {
        const newActivity = {
          ...activity,
          id: uuidv4(),
          timestamp: new Date().toISOString()
        };
        
        set((state) => ({
          activities: [newActivity, ...state.activities]
        }));
        
        return newActivity;
      },
      
      // Log deal activity
      logDealActivity: (dealId, repId, type, description, metadata = {}) => {
        const activity = {
          id: uuidv4(),
          dealId,
          repId,
          type, // 'stage_change', 'note_added', 'value_updated', 'deal_created', etc.
          description,
          metadata,
          timestamp: new Date().toISOString()
        };
        
        set((state) => ({
          activities: [activity, ...state.activities]
        }));
        
        return activity;
      },
      
      // Log recommendation activity
      logRecommendationActivity: (recommendationId, repId, action, details = {}) => {
        const activity = {
          id: uuidv4(),
          recommendationId,
          repId,
          type: 'recommendation',
          action, // 'accepted', 'rejected', 'viewed'
          details,
          timestamp: new Date().toISOString()
        };
        
        set((state) => ({
          activities: [activity, ...state.activities]
        }));
        
        return activity;
      },
      
      // Log user action
      logUserAction: (userId, action, description, metadata = {}) => {
        const activity = {
          id: uuidv4(),
          userId,
          type: 'user_action',
          action,
          description,
          metadata,
          timestamp: new Date().toISOString()
        };
        
        set((state) => ({
          activities: [activity, ...state.activities]
        }));
        
        return activity;
      },
      
      // Get activities by rep
      getActivitiesByRep: (repId) => {
        return get().activities.filter(a => a.repId === repId);
      },
      
      // Get activities by deal
      getActivitiesByDeal: (dealId) => {
        return get().activities.filter(a => a.dealId === dealId);
      },
      
      // Get activities by region
      getActivitiesByRegion: (region, salesReps) => {
        const repIds = salesReps
          .filter(rep => rep.region === region)
          .map(rep => rep.id);
        
        return get().activities.filter(a => repIds.includes(a.repId));
      },
      
      // Get recent activities (last N)
      getRecentActivities: (limit = 10) => {
        return get().activities.slice(0, limit);
      },
      
      // Get activities by date range
      getActivitiesByDateRange: (startDate, endDate) => {
        return get().activities.filter(a => {
          const activityDate = new Date(a.timestamp);
          return activityDate >= startDate && activityDate <= endDate;
        });
      },
      
      // Get activities by type
      getActivitiesByType: (type) => {
        return get().activities.filter(a => a.type === type);
      },
      
      // Get activity stats for rep
      getActivityStats: (repId) => {
        const repActivities = get().getActivitiesByRep(repId);
        
        return {
          total: repActivities.length,
          byType: repActivities.reduce((acc, activity) => {
            acc[activity.type] = (acc[activity.type] || 0) + 1;
            return acc;
          }, {}),
          today: repActivities.filter(a => {
            const today = new Date();
            const activityDate = new Date(a.timestamp);
            return activityDate.toDateString() === today.toDateString();
          }).length
        };
      },
      
      // Clear old activities (older than specified days)
      clearOldActivities: (daysToKeep = 90) => {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
        
        set((state) => ({
          activities: state.activities.filter(a => 
            new Date(a.timestamp) >= cutoffDate
          )
        }));
      },
      
      // Clear all activities
      clearAllActivities: () => {
        set({ activities: [] });
      }
    }),
    {
      name: 'activities-storage',
      version: 1
    }
  )
);

export default useActivitiesStore;
