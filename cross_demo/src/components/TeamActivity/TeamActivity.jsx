import React, { useState } from 'react';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  Play, 
  Circle,
  Phone,
  Presentation,
  FileText,
  Mail,
  TrendingUp,
  Target,
  Calendar,
  Activity,
  AlertCircle
} from 'lucide-react';
import GlassCard from '../GlassCard/GlassCard';
import StatusBadge from '../StatusBadge/StatusBadge';
import './TeamActivity.css';

const TeamActivity = ({ teamActivities = [], teamMembers = [] }) => {
  const [selectedRep, setSelectedRep] = useState('all');

  const getActivityIcon = (type) => {
    switch (type) {
      case 'call': return <Phone size={16} />;
      case 'meeting': return <Users size={16} />;
      case 'demo': return <Presentation size={16} />;
      case 'proposal': return <FileText size={16} />;
      case 'follow-up': return <TrendingUp size={16} />;
      case 'email': return <Mail size={16} />;
      default: return <Circle size={16} />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} className="status-completed" />;
      case 'in-progress': return <Play size={16} className="status-progress" />;
      default: return <Circle size={16} className="status-pending" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed': return 'completed';
      case 'in-progress': return 'in-progress';
      default: return 'pending';
    }
  };

  // Filter activities by selected rep
  const filteredActivities = selectedRep === 'all' 
    ? teamActivities 
    : teamActivities.filter(a => a.repId === parseInt(selectedRep));

  // Group activities by rep
  const activitiesByRep = teamMembers.map(member => {
    const repActivities = teamActivities.filter(a => a.repId === member.id);
    return {
      ...member,
      activities: repActivities,
      completed: repActivities.filter(a => a.status === 'completed').length,
      inProgress: repActivities.filter(a => a.status === 'in-progress').length,
      pending: repActivities.filter(a => a.status === 'pending').length,
      total: repActivities.length
    };
  });

  // Overall stats
  const stats = {
    totalActivities: teamActivities.length,
    completed: teamActivities.filter(a => a.status === 'completed').length,
    inProgress: teamActivities.filter(a => a.status === 'in-progress').length,
    pending: teamActivities.filter(a => a.status === 'pending').length
  };

  const completionRate = stats.totalActivities > 0 
    ? Math.round((stats.completed / stats.totalActivities) * 100) 
    : 0;

  return (
    <div className="team-activity-container">
      {/* Header */}
      <div className="team-activity-header">
        <div className="header-title">
          <Users size={24} className="header-icon" />
          <div>
            <h2 className="title">Team Activity Dashboard</h2>
            <p className="subtitle">Real-time view of your team's daily activities</p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="activity-stats-grid">
        <GlassCard className="stat-card">
          <div className="stat-icon stat-icon-total">
            <Activity size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.totalActivities}</div>
            <div className="stat-label">Total Activities</div>
          </div>
        </GlassCard>

        <GlassCard className="stat-card">
          <div className="stat-icon stat-icon-completed">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.completed}</div>
            <div className="stat-label">Completed</div>
          </div>
        </GlassCard>

        <GlassCard className="stat-card">
          <div className="stat-icon stat-icon-progress">
            <Play size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.inProgress}</div>
            <div className="stat-label">In Progress</div>
          </div>
        </GlassCard>

        <GlassCard className="stat-card">
          <div className="stat-icon stat-icon-pending">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Pending</div>
          </div>
        </GlassCard>

        <GlassCard className="stat-card stat-card-completion">
          <div className="completion-ring">
            <svg viewBox="0 0 36 36" className="circular-chart">
              <path className="circle-bg"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path className="circle"
                strokeDasharray={`${completionRate}, 100`}
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <text x="18" y="20.35" className="percentage">{completionRate}%</text>
            </svg>
          </div>
          <div className="stat-label">Completion Rate</div>
        </GlassCard>
      </div>

      {/* Team Member Cards */}
      <div className="team-members-section">
        <h3 className="section-title">Team Members</h3>
        <div className="team-members-grid">
          {activitiesByRep.map(member => (
            <GlassCard 
              key={member.id} 
              className={`team-member-card ${selectedRep === member.id.toString() ? 'selected' : ''}`}
              onClick={() => setSelectedRep(member.id.toString())}
            >
              <div className="member-header">
                <div className="member-avatar">{member.avatar}</div>
                <div className="member-info">
                  <h4 className="member-name">{member.name}</h4>
                  <p className="member-email">{member.email}</p>
                </div>
              </div>
              <div className="member-stats">
                <div className="member-stat">
                  <span className="stat-num">{member.total}</span>
                  <span className="stat-txt">Total</span>
                </div>
                <div className="member-stat member-stat-success">
                  <span className="stat-num">{member.completed}</span>
                  <span className="stat-txt">Done</span>
                </div>
                <div className="member-stat member-stat-warning">
                  <span className="stat-num">{member.inProgress}</span>
                  <span className="stat-txt">Active</span>
                </div>
                <div className="member-stat member-stat-info">
                  <span className="stat-num">{member.pending}</span>
                  <span className="stat-txt">Pending</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Filter */}
      <div className="activity-filter">
        <label htmlFor="rep-filter">Show activities for:</label>
        <select 
          id="rep-filter" 
          value={selectedRep} 
          onChange={(e) => setSelectedRep(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Team Members</option>
          {teamMembers.map(member => (
            <option key={member.id} value={member.id}>{member.name}</option>
          ))}
        </select>
      </div>

      {/* Activities Timeline */}
      <div className="activities-timeline">
        <h3 className="section-title">
          <Calendar size={20} />
          Today's Activities
          {selectedRep !== 'all' && ` - ${teamMembers.find(m => m.id === parseInt(selectedRep))?.name}`}
        </h3>
        
        {filteredActivities.length === 0 ? (
          <div className="empty-state">
            <AlertCircle size={48} />
            <p>No activities found</p>
          </div>
        ) : (
          <div className="timeline">
            {filteredActivities
              .sort((a, b) => {
                // Sort by time
                const timeA = a.time.split(':')[0] + a.time.split(' ')[1];
                const timeB = b.time.split(':')[0] + b.time.split(' ')[1];
                return timeA.localeCompare(timeB);
              })
              .map(activity => (
                <div key={activity.id} className={`timeline-item ${getStatusClass(activity.status)}`}>
                  <div className="timeline-marker">
                    {getStatusIcon(activity.status)}
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-time">{activity.time}</div>
                    <div className="timeline-rep">
                      <Users size={14} />
                      {activity.repName}
                    </div>
                    <div className="timeline-header">
                      <div className="timeline-type">
                        {getActivityIcon(activity.type)}
                        <span>{activity.type.toUpperCase()}</span>
                      </div>
                      <StatusBadge 
                        status={
                          activity.status === 'completed' ? 'success' :
                          activity.status === 'in-progress' ? 'warning' : 'info'
                        }
                        label={activity.status}
                        size="small"
                      />
                    </div>
                    <h4 className="timeline-title">{activity.title}</h4>
                    {activity.company && (
                      <div className="timeline-company">
                        <Target size={14} />
                        {activity.company}
                      </div>
                    )}
                    {activity.dealName && (
                      <div className="timeline-deal">Deal: {activity.dealName}</div>
                    )}
                    <div className="timeline-footer">
                      <span className="timeline-duration">
                        <Clock size={14} />
                        {activity.duration}
                      </span>
                      {activity.outcome && (
                        <span className="timeline-outcome">
                          <CheckCircle size={14} />
                          {activity.outcome}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamActivity;
