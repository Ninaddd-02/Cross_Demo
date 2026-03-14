import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SidebarNavigation from '../../components/SidebarNavigation/SidebarNavigation';
import TopNavbar from '../../components/TopNavbar/TopNavbar';
import TeamActivity from '../../components/TeamActivity/TeamActivity';
import { getTeamActivitiesByManager, salesReps } from '../../data/sharedData';
import './TeamActivityPage.css';

const TeamActivityPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // Get manager name from logged-in user (for managers) or allow sales head to view any manager
  const managerName = currentUser?.name || 'Rajesh Kumar';
  
  const teamActivities = getTeamActivitiesByManager(managerName);
  const teamMembers = salesReps.filter(rep => rep.manager === managerName);

  return (
    <div className="admin-layout">
      <SidebarNavigation role={currentUser?.role} />
      <div className="admin-content">
        <TopNavbar 
          title="Team Activity"
          subtitle="Monitor your team's daily progress"
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
