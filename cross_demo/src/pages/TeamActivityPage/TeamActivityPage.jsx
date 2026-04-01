import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SidebarNavigation from '../../components/SidebarNavigation/SidebarNavigation';
import TopNavbar from '../../components/TopNavbar/TopNavbar';
import TeamActivity from '../../components/TeamActivity/TeamActivity';
import useActivitiesStore from '../../stores/useActivitiesStore';
import { salesReps } from '../../data/sharedData';
import { allUsers } from '../../context/AuthContext';
import { onSyncEvent, createPollingRefresh } from '../../utils/syncManager';
import './TeamActivityPage.css';

const TeamActivityPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Get activities from store
  const getActivitiesByRep = useActivitiesStore(state => state.getActivitiesByRep);
  const allActivities = useActivitiesStore(state => state.activities);
  
  // Determine visible team members based on role
  const teamMembers = useMemo(() => {
    if (!currentUser) return [];
    
    if (currentUser.role === 'sales-head') {
      // Sales Head sees all reps
      return salesReps;
    } else if (currentUser.role === 'sales-manager') {
      // Sales Manager sees their team
      return salesReps.filter(rep => 
        rep.managerId === currentUser.managerId || 
        rep.manager === currentUser.name
      );
    }
    return [];
  }, [currentUser]);
  
  // Get activities for visible team members
  const teamActivities = useMemo(() => {
    const visibleRepIds = teamMembers.map(rep => rep.id);
    
    // Get all activities for visible reps
    const activities = allActivities.filter(activity => 
      visibleRepIds.includes(activity.repId) || 
      visibleRepIds.includes(activity.userId)
    );
    
    // Helper to format timestamp to time string
    const formatTime = (isoString) => {
      const date = new Date(isoString);
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    };
    
    // Helper to map activity to display type
    const mapActivityType = (activity) => {
      if (activity.type === 'recommendation') {
        if (activity.action === 'accepted') return 'target';
        if (activity.action === 'rejected') return 'email';
        if (activity.action === 'viewed') return 'follow-up';
      }
      if (activity.type === 'user_action') return 'email';
      if (activity.type === 'deal') return 'proposal';
      return 'email';
    };
    
    // Helper to map activity to status
    const mapActivityStatus = (activity) => {
      if (activity.type === 'recommendation') {
        if (activity.action === 'accepted' || activity.action === 'rejected') {
          return 'completed';
        }
        if (activity.action === 'viewed') return 'completed';
      }
      return 'completed';
    };
    
    // Transform to TeamActivity component format
    return activities.map(activity => {
      const rep = salesReps.find(r => r.id === activity.repId || r.id === activity.userId);
      const user = allUsers.find(u => u.id === activity.userId);
      const metadata = activity.metadata || activity.details || {};
      
      return {
        id: activity.id,
        repId: activity.repId || activity.userId,
        repName: rep?.name || user?.name || 'Unknown',
        type: mapActivityType(activity),
        time: formatTime(activity.timestamp),
        status: mapActivityStatus(activity),
        title: activity.description || 'Activity',
        company: metadata.accountName || metadata.company || '',
        dealName: metadata.dealName || '',
        duration: metadata.duration || 'Just now',
        outcome: metadata.outcome || (activity.action === 'accepted' ? 'Accepted' : activity.action === 'rejected' ? 'Rejected' : ''),
        timestamp: activity.timestamp, // Keep for sorting
        // Keep original data for reference
        originalType: activity.type,
        action: activity.action,
        metadata: metadata
      };
    }).sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
  }, [allActivities, teamMembers, refreshKey]);
  
  // Real-time sync: Listen for activity updates from other tabs
  useEffect(() => {
    const cleanup = onSyncEvent((syncEvent) => {
      if (syncEvent.type === 'activity_updated' || 
          syncEvent.type === 'recommendation_accepted' || 
          syncEvent.type === 'recommendation_rejected') {
        console.debug('Activity update received:', syncEvent.type);
        setRefreshKey(prev => prev + 1); // Force refresh
      }
    });
    
    return cleanup;
  }, []);
  
  // Polling: Auto-refresh every 30 seconds for same-tab updates
  useEffect(() => {
    const cleanup = createPollingRefresh(() => {
      setRefreshKey(prev => prev + 1);
    }, 30000);
    
    return cleanup;
  }, []);

  return (
    <div className="admin-layout">
      <SidebarNavigation role={currentUser?.role} />
      <div className="admin-content">
        <TopNavbar 
          title="Team Activity"
          subtitle={`Monitor your team's progress • ${teamActivities.length} recent activities`}
          user={currentUser?.role === 'sales-head' ? 'Sales Head' : 'Sales Manager'}
        />
        
        <div className="page-body">
          <TeamActivity 
            teamActivities={teamActivities}
            teamMembers={teamMembers}
          />
        </div>
      </div>
    </div>
  );
};

export default TeamActivityPage;
