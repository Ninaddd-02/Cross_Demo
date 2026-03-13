import React from 'react';
import { 
  Calendar, 
  Clock, 
  Phone, 
  Users, 
  Presentation, 
  FileText, 
  Mail, 
  CheckCircle,
  Circle,
  Play,
  Zap,
  User,
  Target,
  TrendingUp
} from 'lucide-react';
import GlassCard from '../GlassCard/GlassCard';
import StatusBadge from '../StatusBadge/StatusBadge';
import './DailyPlan.css';

const DailyPlan = ({ 
  activities = [], 
  aiSuggestions = [],
  targetCompanies = [],
  repName = 'Sales Rep'
}) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'call': return <Phone size={18} />;
      case 'meeting': return <Users size={18} />;
      case 'demo': return <Presentation size={18} />;
      case 'proposal': return <FileText size={18} />;
      case 'follow-up': return <TrendingUp size={18} />;
      case 'email': return <Mail size={18} />;
      default: return <Circle size={18} />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle size={18} className="status-icon-completed" />;
      case 'in-progress': return <Play size={18} className="status-icon-progress" />;
      default: return <Circle size={18} className="status-icon-pending" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed': return 'activity-completed';
      case 'in-progress': return 'activity-in-progress';
      default: return 'activity-pending';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'critical': return { status: 'error', label: 'Critical' };
      case 'urgent': return { status: 'error', label: 'Urgent' };
      case 'high': return { status: 'warning', label: 'High' };
      case 'medium': return { status: 'active', label: 'Medium' };
      default: return { status: 'success', label: 'Low' };
    }
  };

  const getActivitySource = (source) => {
    return source === 'ai-suggested' ? (
      <span className="source-badge source-ai">
        <Zap size={12} /> AI
      </span>
    ) : (
      <span className="source-badge source-manual">
        <User size={12} /> Manual
      </span>
    );
  };

  const activityStats = {
    total: activities.length,
    completed: activities.filter(a => a.status === 'completed').length,
    inProgress: activities.filter(a => a.status === 'in-progress').length,
    pending: activities.filter(a => a.status === 'pending').length
  };

  return (
    <div className="daily-plan-container">
      {/* Header */}
      <div className="daily-plan-header">
        <div className="plan-title-section">
          <Calendar size={24} className="plan-icon" />
          <div>
            <h2 className="plan-title">My Daily Plan</h2>
            <p className="plan-subtitle">Today's activities and schedule</p>
          </div>
        </div>
        <div className="plan-stats">
          <div className="stat-item">
            <span className="stat-number">{activityStats.completed}</span>
            <span className="stat-label">Completed</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{activityStats.inProgress}</span>
            <span className="stat-label">In Progress</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{activityStats.pending}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="plan-tabs">
        <button 
          className="plan-tab active"
        >
          <Clock size={16} />
          Today's Schedule ({activities.length})
        </button>
      </div>

      {/* Today's Schedule Tab */}
      <div className="activities-list">
          {activities.length === 0 ? (
            <div className="empty-state">
              <Circle size={48} />
              <p>No activities scheduled for today</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className={`activity-card ${getStatusClass(activity.status)}`}>
                <div className="activity-time">
                  <Clock size={16} />
                  <span>{activity.time}</span>
                </div>
                <div className="activity-main">
                  <div className="activity-header">
                    <div className="activity-type">
                      {getActivityIcon(activity.type)}
                      <span className="activity-type-label">{activity.type.toUpperCase()}</span>
                    </div>
                    <div className="activity-meta">
                      {getActivitySource(activity.source)}
                      {getStatusIcon(activity.status)}
                    </div>
                  </div>
                  <h4 className="activity-title">{activity.title}</h4>
                  {activity.company && (
                    <div className="activity-company">
                      <Target size={14} />
                      {activity.company}
                    </div>
                  )}
                  {activity.dealName && (
                    <div className="activity-deal">Deal: {activity.dealName}</div>
                  )}
                  <div className="activity-footer">
                    <span className="activity-duration">{activity.duration}</span>
                    {activity.outcome && (
                      <span className="activity-outcome">✓ {activity.outcome}</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      {/* Target Companies Section */}
      {targetCompanies.length > 0 && (
        <div className="target-companies-section">
          <h3 className="section-title">
            <Target size={20} />
            My Target Accounts
          </h3>
          <div className="target-companies-grid">
            {targetCompanies.map((target, index) => (
              <div key={index} className={`target-company-card target-${target.status}`}>
                <div className="target-header">
                  <h4 className="target-company">{target.company}</h4>
                  <StatusBadge 
                    status={target.priority === 'critical' || target.priority === 'urgent' ? 'error' : 
                            target.priority === 'high' ? 'warning' : 'success'} 
                    label={target.priority.toUpperCase()} 
                    size="small"
                  />
                </div>
                <div className="target-info">
                  <span className="target-industry">{target.industry}</span>
                  {target.activeDeals > 0 && (
                    <span className="target-deals">{target.activeDeals} active deals</span>
                  )}
                </div>
                <div className="target-pipeline">{target.pipelineValue}</div>
                <div className="target-action">
                  <span className="action-label">Next:</span>
                  <span className="action-text">{target.nextAction}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyPlan;
