import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SidebarNavigation from '../../components/SidebarNavigation/SidebarNavigation';
import TopNavbar from '../../components/TopNavbar/TopNavbar';
import DailyPlan from '../../components/DailyPlan/DailyPlan';
import { getRepActivities, getAISuggestions, getTargetCompanies, salesReps } from '../../data/sharedData';
import { Users, TrendingUp } from 'lucide-react';
import './OrganizationPlan.css';

const OrganizationPlan = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // Sales Head sees ALL reps (4 reps)
  const allReps = salesReps;

  return (
    <div className="admin-layout">
      <SidebarNavigation role="sales-head" />
      <div className="admin-content">
        <TopNavbar 
          title="Organization Plan"
          subtitle="All Sales Representatives' Daily Plans"
          user={currentUser?.name}
        />
        
        <div className="page-body organization-plan-page">
          {/* Page Header */}
          <div className="org-plan-header">
            <div className="header-stats">
              <div className="stat-item">
                <Users size={24} />
                <div>
                  <div className="stat-value">{allReps.length}</div>
                  <div className="stat-label">Sales Representatives</div>
                </div>
              </div>
              <div className="stat-item">
                <TrendingUp size={24} />
                <div>
                  <div className="stat-value">
                    {allReps.reduce((sum, rep) => {
                      const activities = getRepActivities(rep.id);
                      return sum + (activities?.today?.length || 0);
                    }, 0)}
                  </div>
                  <div className="stat-label">Total Activities Today</div>
                </div>
              </div>
            </div>
          </div>

          {/* All Reps' Daily Plans */}
          <div className="all-reps-plans">
            {allReps.map(rep => {
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
                        <p className="rep-region">{rep.region} Region • Manager: {rep.manager}</p>
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

export default OrganizationPlan;
