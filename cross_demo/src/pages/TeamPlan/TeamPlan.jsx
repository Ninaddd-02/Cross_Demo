import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SidebarNavigation from '../../components/SidebarNavigation/SidebarNavigation';
import TopNavbar from '../../components/TopNavbar/TopNavbar';
import DailyPlan from '../../components/DailyPlan/DailyPlan';
import { getRepActivities, getAISuggestions, getTargetCompanies, salesReps } from '../../data/sharedData';
import { Users, TrendingUp } from 'lucide-react';
import './TeamPlan.css';

const TeamPlan = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // Manager sees only their team reps (2 reps)
  const teamReps = useMemo(() => {
    if (currentUser?.managerId) {
      return salesReps.filter(rep => rep.managerId === currentUser.managerId);
    }
    return salesReps.filter(rep => rep.manager === currentUser?.name);
  }, [currentUser]);

  return (
    <div className="admin-layout">
      <SidebarNavigation role="sales-manager" />
      <div className="admin-content">
        <TopNavbar 
          title="Team Plan"
          subtitle="Your Team's Daily Plans"
          user={currentUser?.name}
        />
        
        <div className="page-body team-plan-page">
          {/* Page Header */}
          <div className="team-plan-header">
            <div className="header-stats">
              <div className="stat-item">
                <Users size={24} />
                <div>
                  <div className="stat-value">{teamReps.length}</div>
                  <div className="stat-label">Team Members</div>
                </div>
              </div>
              <div className="stat-item">
                <TrendingUp size={24} />
                <div>
                  <div className="stat-value">
                    {teamReps.reduce((sum, rep) => {
                      const activities = getRepActivities(rep.id);
                      return sum + (activities?.today?.length || 0);
                    }, 0)}
                  </div>
                  <div className="stat-label">Total Activities Today</div>
                </div>
              </div>
            </div>
          </div>

          {/* Team Reps' Daily Plans */}
          <div className="team-reps-plans">
            {teamReps.map(rep => {
              const activities = getRepActivities(rep.id);
              const aiSuggestions = getAISuggestions(rep.id);
              const targetCompanies = getTargetCompanies(rep.id);

              return (
                <div key={rep.id} className="rep-plan-section">
                  <div className="rep-plan-header">
                    <div className="rep-info">
                      <div className="rep-avatar">{rep.avatar}</div>
                      <div>
                        <h3>{rep.name}</h3>
                        <p className="rep-region">{rep.region} Region</p>
                      </div>
                    </div>
                  </div>
                  <DailyPlan 
                    activities={activities}
                    aiSuggestions={aiSuggestions}
                    targetCompanies={targetCompanies}
                    repName={rep.name}
                    viewOnly={true}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamPlan;
