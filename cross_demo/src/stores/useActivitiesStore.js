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
      },
      
      // Seed demo activities (for testing)
      seedDemoActivities: () => {
        const now = new Date();
        const demoActivities = [
          {
            id: uuidv4(),
            repId: 1,
            type: 'recommendation',
            action: 'accepted',
            description: 'Accepted AI recommendation for Data Engineering',
            metadata: {
              productName: 'Data Engineering',
              accountName: 'ACCELYA SOLUTIONS INDIA LIMITED',
              confidence: 100
            },
            timestamp: new Date(now.getTime() - 1000 * 60 * 5).toISOString() // 5 min ago
          },
          {
            id: uuidv4(),
            repId: 1,
            type: 'recommendation',
            action: 'viewed',
            description: 'Viewed AI recommendations',
            metadata: {},
            timestamp: new Date(now.getTime() - 1000 * 60 * 15).toISOString() // 15 min ago
          },
          {
            id: uuidv4(),
            repId: 1,
            type: 'recommendation',
            action: 'rejected',
            description: 'Rejected AI recommendation for Connectivity & Comms',
            metadata: {
              productName: 'Connectivity & Comms',
              accountName: 'ACCELYA SOLUTIONS INDIA LIMITED',
              confidence: 87.9,
              reason: 'Not aligned with current priorities'
            },
            timestamp: new Date(now.getTime() - 1000 * 60 * 30).toISOString() // 30 min ago
          },
          {
            id: uuidv4(),
            repId: 1,
            type: 'user_action',
            action: 'login',
            description: 'Logged into system',
            metadata: {},
            timestamp: new Date(now.getTime() - 1000 * 60 * 60).toISOString() // 1 hour ago
          }
        ];
        
        set({ activities: demoActivities });
      }
    }),
    {
      name: 'activities-storage',
      version: 2 // Bumped version to reset store with demo data
    }
  )
);

// Initialize demo activities on first load
const store = useActivitiesStore.getState();
if (store.activities.length === 0) {
  store.seedDemoActivities();
}

export default useActivitiesStore;
