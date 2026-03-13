import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SidebarNavigation from '../../components/SidebarNavigation/SidebarNavigation';
import TopNavbar from '../../components/TopNavbar/TopNavbar';
import DailyPlan from '../../components/DailyPlan/DailyPlan';
import { getRepActivities, getAISuggestions, getTargetCompanies } from '../../data/sharedData';
import './MyPlan.css';

const MyPlan = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // Get repId from logged-in user
  const repId = currentUser?.repId || 1;
  const repName = currentUser?.name || 'Rahul Sharma';
  
  const activities = getRepActivities(repId);
  const aiSuggestions = getAISuggestions(repId);
  const targetCompanies = getTargetCompanies(repId);

  return (
    <div className="admin-layout">
      <SidebarNavigation role="sales" />
      <div className="admin-content">
        <TopNavbar 
          title="My Daily Plan"
          subtitle="Stay organized and hit your targets"
        />
        
        <div className="page-body">
          <div className="my-plan-container">
            <DailyPlan 
              activities={activities}
              aiSuggestions={aiSuggestions}
              targetCompanies={targetCompanies}
              repName={repName}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPlan;
