import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import SidebarNavigation from '../../components/SidebarNavigation/SidebarNavigation';
import TopNavbar from '../../components/TopNavbar/TopNavbar';
import useActivitiesStore from '../../stores/useActivitiesStore';
import { salesManagers, salesReps } from '../../data/sharedData';
import { allUsers } from '../../context/AuthContext';
import {
  Users, Activity, CheckCircle, Play, Clock, ChevronDown, ChevronUp,
  Phone, Presentation, FileText, Mail, TrendingUp, Circle, Target,
  AlertTriangle, BarChart2, Search, Filter
} from 'lucide-react';
import './SalesHeadTeamActivity.css';

/* ─── helpers ─────────────────────────────────────────────── */
const formatTime = (iso) => {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

const mapType = (a) => {
  if (a.type === 'recommendation') return a.action === 'rejected' ? 'email' : 'target';
  if (a.type === 'deal') return 'proposal';
  return 'email';
};

const mapStatus = () => 'completed';

const activityIcon = (type) => {
  switch (type) {
    case 'call':     return <Phone size={14} />;
    case 'demo':     return <Presentation size={14} />;
    case 'proposal': return <FileText size={14} />;
    case 'email':    return <Mail size={14} />;
    case 'target':   return <Target size={14} />;
    default:         return <TrendingUp size={14} />;
  }
};

const CompletionRing = ({ pct, size = 52 }) => {
  const r = 15.9155;
  const dash = `${pct} ${100 - pct}`;
  const color = pct >= 80 ? '#22c55e' : pct >= 50 ? '#3b82f6' : '#ef4444';
  return (
    <div className="shta-ring" style={{ width: size, height: size }}>
      <svg viewBox="0 0 36 36" width={size} height={size}>
        <circle cx="18" cy="18" r={r} fill="none" stroke="#e2e8f0" strokeWidth="3.5" />
        <circle
          cx="18" cy="18" r={r} fill="none"
          stroke={color} strokeWidth="3.5"
          strokeDasharray={dash} strokeDashoffset="25"
          strokeLinecap="round"
        />
      </svg>
      <span className="shta-ring-label" style={{ color }}>{pct}%</span>
    </div>
  );
};

/* ─── rep row ─────────────────────────────────────────────── */
const RepRow = ({ rep, activities, repFilter }) => {
  const [open, setOpen] = useState(false);
  const total     = activities.length;
  const completed = activities.filter(a => a.status === 'completed').length;
  const inProg    = activities.filter(a => a.status === 'in-progress').length;
  const pending   = activities.filter(a => a.status === 'pending').length;
  const rate      = total ? Math.round((completed / total) * 100) : 0;

  if (repFilter && !rep.name.toLowerCase().includes(repFilter.toLowerCase())) return null;

  return (
    <div className="shta-rep-block">
      <div className="shta-rep-header" onClick={() => setOpen(o => !o)}>
        <div className="shta-rep-left">
          <div className="shta-rep-avatar">{rep.name.charAt(0)}</div>
          <div>
            <span className="shta-rep-name">{rep.name}</span>
            <span className="shta-rep-email">{rep.email}</span>
          </div>
        </div>
        <div className="shta-rep-metrics">
          <span className="shta-chip shta-chip--blue">{total} Total</span>
          <span className="shta-chip shta-chip--green">{completed} Done</span>
          <span className="shta-chip shta-chip--yellow">{inProg} Active</span>
          <span className="shta-chip shta-chip--red">{pending} Pending</span>
          <CompletionRing pct={rate} size={44} />
        </div>
        <button className="shta-toggle">{open ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}</button>
      </div>

      {open && (
        <div className="shta-rep-activities">
          {activities.length === 0 ? (
            <p className="shta-empty">No activities recorded for today.</p>
          ) : (
            <div className="shta-activity-list">
              {activities.map(act => (
                <div key={act.id} className={`shta-activity-row shta-activity-row--${act.status}`}>
                  <div className={`shta-act-dot shta-act-dot--${act.status}`} />
                  <span className="shta-act-time">{act.time}</span>
                  <span className={`shta-act-icon shta-act-icon--${act.type}`}>{activityIcon(act.type)}</span>
                  <span className="shta-act-title">{act.title || act.type}</span>
                  {act.company && <span className="shta-act-company">&nbsp;·&nbsp;{act.company}</span>}
                  {act.outcome && <span className="shta-act-outcome">✓ {act.outcome}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ─── manager card ────────────────────────────────────────── */
const ManagerCard = ({ manager, repsData, allActivities, repFilter, defaultOpen }) => {
  const [open, setOpen] = useState(defaultOpen);

  const mgrReps    = repsData.filter(r => r.managerId === manager.id);
  const mgrRepIds  = mgrReps.map(r => r.id);
  const mgrActs    = allActivities.filter(a => mgrRepIds.includes(a.repId));
  const total      = mgrActs.length;
  const completed  = mgrActs.filter(a => a.status === 'completed').length;
  const inProg     = mgrActs.filter(a => a.status === 'in-progress').length;
  const pending    = mgrActs.filter(a => a.status === 'pending').length;
  const rate       = total ? Math.round((completed / total) * 100) : 0;

  // Sort reps by completion rate desc
  const sortedReps = [...mgrReps].sort((a, b) => {
    const aActs = allActivities.filter(x => x.repId === a.id);
    const bActs = allActivities.filter(x => x.repId === b.id);
    const aRate = aActs.length ? (aActs.filter(x => x.status === 'completed').length / aActs.length) : 0;
    const bRate = bActs.length ? (bActs.filter(x => x.status === 'completed').length / bActs.length) : 0;
    return bRate - aRate;
  });

  const perfLabel = rate >= 80 ? 'High Performer' : rate >= 50 ? 'On Track' : 'Needs Attention';
  const perfColor = rate >= 80 ? 'green' : rate >= 50 ? 'blue' : 'red';

  return (
    <div className={`shta-manager-card shta-manager-card--${perfColor}`}>
      {/* Manager header row */}
      <div className="shta-mgr-header" onClick={() => setOpen(o => !o)}>
        <div className="shta-mgr-left">
          <div className="shta-mgr-avatar">{manager.name.charAt(0)}</div>
          <div>
            <h3 className="shta-mgr-name">{manager.name}</h3>
            <span className="shta-mgr-meta">
              Sales Manager · {manager.region} · {mgrReps.length} Rep{mgrReps.length !== 1 ? 's' : ''}
            </span>
          </div>
          <span className={`shta-perf-badge shta-perf-badge--${perfColor}`}>{perfLabel}</span>
        </div>

        <div className="shta-mgr-stats">
          <div className="shta-mgr-stat shta-mgr-stat--blue">
            <Activity size={16}/>
            <span className="shta-mgr-val">{total}</span>
            <span className="shta-mgr-lbl">Activities</span>
          </div>
          <div className="shta-mgr-stat shta-mgr-stat--green">
            <CheckCircle size={16}/>
            <span className="shta-mgr-val">{completed}</span>
            <span className="shta-mgr-lbl">Completed</span>
          </div>
          <div className="shta-mgr-stat shta-mgr-stat--yellow">
            <Play size={16}/>
            <span className="shta-mgr-val">{inProg}</span>
            <span className="shta-mgr-lbl">In Progress</span>
          </div>
          <div className="shta-mgr-stat shta-mgr-stat--red">
            <Clock size={16}/>
            <span className="shta-mgr-val">{pending}</span>
            <span className="shta-mgr-lbl">Pending</span>
          </div>
          <CompletionRing pct={rate} size={56} />
        </div>

        <button className="shta-toggle shta-toggle--mgr">
          {open ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
        </button>
      </div>

      {/* Reps list */}
      {open && (
        <div className="shta-reps-list">
          <div className="shta-reps-list-header">
            <Users size={14}/> Sales Representatives ({sortedReps.length})
            <span className="shta-reps-hint">Sorted by completion rate</span>
          </div>
          {sortedReps.length === 0 ? (
            <p className="shta-empty">No reps assigned to this manager.</p>
          ) : (
            sortedReps.map(rep => (
              <RepRow
                key={rep.id}
                rep={rep}
                activities={allActivities.filter(a => a.repId === rep.id)}
                repFilter={repFilter}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

/* ─── main page ───────────────────────────────────────────── */
const SalesHeadTeamActivity = () => {
  const { currentUser } = useAuth();
  const allActivities = useActivitiesStore(state => state.activities);

  const [managerFilter, setManagerFilter] = useState('all');
  const [repFilter, setRepFilter]         = useState('');

  // Transform store activities to display format
  const teamActivities = useMemo(() => {
    return allActivities.map(activity => {
      const rep  = salesReps.find(r => r.id === activity.repId || r.id === activity.userId);
      const user = allUsers.find(u => u.id === activity.userId);
      const meta = activity.metadata || activity.details || {};
      return {
        id:       activity.id,
        repId:    activity.repId || activity.userId,
        repName:  rep?.name || user?.name || 'Unknown',
        type:     mapType(activity),
        time:     formatTime(activity.timestamp),
        status:   mapStatus(activity),
        title:    activity.description || 'Activity',
        company:  meta.accountName || meta.company || '',
        outcome:  meta.outcome || (activity.action === 'accepted' ? 'Accepted' : activity.action === 'rejected' ? 'Rejected' : ''),
        timestamp: activity.timestamp,
      };
    }).sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
  }, [allActivities]);

  // Top-level totals
  const total     = teamActivities.length;
  const completed = teamActivities.filter(a => a.status === 'completed').length;
  const inProg    = teamActivities.filter(a => a.status === 'in-progress').length;
  const pending   = teamActivities.filter(a => a.status === 'pending').length;
  const rate      = total ? Math.round((completed / total) * 100) : 0;

  // Filter managers
  const visibleManagers = managerFilter === 'all'
    ? salesManagers
    : salesManagers.filter(m => m.id.toString() === managerFilter);

  return (
    <div className="admin-layout">
      <SidebarNavigation role="sales-head" />
      <div className="admin-content">
        <TopNavbar
          title="Team Activity"
          subtitle={`Hierarchical view · Manager → Reps · ${total} total activities`}
        />

        <div className="page-body">
          <div className="shta-root">

            {/* ── Org-wide KPI strip ───────────────────────── */}
            <div className="shta-kpi-strip">
              <div className="shta-kpi shta-kpi--blue">
                <Activity size={20}/>
                <div>
                  <span className="shta-kpi-val">{total}</span>
                  <span className="shta-kpi-lbl">Total Activities</span>
                </div>
              </div>
              <div className="shta-kpi shta-kpi--green">
                <CheckCircle size={20}/>
                <div>
                  <span className="shta-kpi-val">{completed}</span>
                  <span className="shta-kpi-lbl">Completed</span>
                </div>
              </div>
              <div className="shta-kpi shta-kpi--yellow">
                <Play size={20}/>
                <div>
                  <span className="shta-kpi-val">{inProg}</span>
                  <span className="shta-kpi-lbl">In Progress</span>
                </div>
              </div>
              <div className="shta-kpi shta-kpi--red">
                <AlertTriangle size={20}/>
                <div>
                  <span className="shta-kpi-val">{pending}</span>
                  <span className="shta-kpi-lbl">Pending</span>
                </div>
              </div>
              <div className="shta-kpi shta-kpi--ring">
                <CompletionRing pct={rate} size={64} />
                <span className="shta-kpi-lbl">Org Completion</span>
              </div>
            </div>

            {/* ── Filters ─────────────────────────────────── */}
            <div className="shta-filters">
              <div className="shta-filter-group">
                <Filter size={14} />
                <label>Manager</label>
                <select value={managerFilter} onChange={e => setManagerFilter(e.target.value)}>
                  <option value="all">All Managers</option>
                  {salesManagers.map(m => (
                    <option key={m.id} value={m.id.toString()}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div className="shta-filter-group">
                <Search size={14} />
                <label>Rep Search</label>
                <input
                  type="text"
                  placeholder="Search rep by name…"
                  value={repFilter}
                  onChange={e => setRepFilter(e.target.value)}
                />
              </div>
            </div>

            {/* ── Hierarchy ────────────────────────────────── */}
            <div className="shta-hierarchy">
              <div className="shta-hierarchy-label">
                <BarChart2 size={15}/> Manager → Representatives · Today's Activity
              </div>
              {visibleManagers.length === 0 ? (
                <p className="shta-empty">No managers found.</p>
              ) : (
                visibleManagers.map((mgr, idx) => (
                  <ManagerCard
                    key={mgr.id}
                    manager={mgr}
                    repsData={salesReps}
                    allActivities={teamActivities}
                    repFilter={repFilter}
                    defaultOpen={idx === 0}
                  />
                ))
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesHeadTeamActivity;
