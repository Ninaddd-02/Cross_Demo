import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import SidebarNavigation from '../../components/SidebarNavigation/SidebarNavigation';
import TopNavbar from '../../components/TopNavbar/TopNavbar';
import { getTenantInfo } from '../../data/sharedData';
import {
  User, Target, TrendingUp, Clock, CheckCircle, AlertTriangle,
  Star, Zap, Calendar, BarChart2, ArrowRight, ChevronDown,
  ChevronUp, Lightbulb, Shield, Award, Layers, Activity
} from 'lucide-react';
import './MyPlan.css';

/* ─────────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────────── */
const priorityMeta = (confidenceScore) => {
  if (confidenceScore >= 0.9)  return { tier: 'critical', label: 'High Priority',  color: 'red',    icon: '🔴' };
  if (confidenceScore >= 0.78) return { tier: 'focus',    label: 'Current Focus',  color: 'blue',   icon: '🔵' };
  if (confidenceScore >= 0.65) return { tier: 'upcoming', label: 'Upcoming',       color: 'yellow', icon: '🟡' };
  return                              { tier: 'optional',  label: 'Optional',       color: 'purple', icon: '🟣' };
};

const phaseMeta = (index, total) => {
  const pct = index / total;
  if (pct < 0.33) return { phase: 'short', label: 'Short-term',  days: '0–30 days' };
  if (pct < 0.66) return { phase: 'mid',   label: 'Mid-term',   days: '30–60 days' };
  return               { phase: 'long',  label: 'Long-term',  days: '60–90 days' };
};

const fmt = (n) => `₹${(n / 1e7).toFixed(1)} Cr`;

const reasonFor = (rec) => {
  const map = {
    'CROSS-SELL': `${rec.CurrentProduct} customers show strong demand for adjacent services. AI model detected a ${Math.round(rec.ConfidenceScore * 100)}% fit.`,
    'UPSELL':     `Existing engagement with ${rec.CurrentProduct} creates a natural upgrade path to ${rec.RecommendedProduct}.`,
  };
  return map[rec.RecommendationType] || 'AI model pattern match based on peer account behaviour.';
};

const benefitFor = (rec) => {
  const base = Math.round(rec.ConfidenceScore * 28 + 12);
  return `Expected revenue uplift of ${base}–${base + 8}% on this account. Shortens avg. cycle time by ~15 days.`;
};

const riskFor = (rec) => {
  if (rec.ConfidenceScore >= 0.9) return 'Low risk — high confidence signal. Align internal delivery team early.';
  if (rec.ConfidenceScore >= 0.78) return 'Moderate risk — validate with account stakeholders before pitching.';
  return 'Higher risk — consider as secondary pitch once primary recommendation is progressed.';
};

/* ─────────────────────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────────────────────── */
const SectionHeader = ({ icon: Icon, title, subtitle, color }) => (
  <div className={`mp-section-header mp-section-header--${color}`}>
    <div className={`mp-section-icon mp-section-icon--${color}`}><Icon size={20} /></div>
    <div>
      <h2 className="mp-section-title">{title}</h2>
      {subtitle && <p className="mp-section-sub">{subtitle}</p>}
    </div>
  </div>
);

const RecCard = ({ rec, index, total }) => {
  const [open, setOpen] = useState(false);
  const pm  = priorityMeta(rec.ConfidenceScore);
  const ph  = phaseMeta(index, total);
  const pct = Math.round(rec.ConfidenceScore * 100);

  return (
    <div className={`mp-rec-card mp-rec-card--${pm.color}`}>
      <div className="mp-rec-top" onClick={() => setOpen(o => !o)}>
        <div className="mp-rec-left">
          <span className="mp-rec-icon">{pm.icon}</span>
          <div>
            <div className="mp-rec-header-row">
              <span className={`mp-priority-badge mp-priority-badge--${pm.color}`}>{pm.label}</span>
              <span className={`mp-phase-badge mp-phase-badge--${ph.phase}`}>{ph.label} · {ph.days}</span>
            </div>
            <h4 className="mp-rec-title">
              {rec.RecommendedProduct}
              <span className="mp-rec-type-tag">{rec.RecommendationType}</span>
            </h4>
            <p className="mp-rec-account">
              <Target size={13} /> {rec.AccountName} &nbsp;·&nbsp;
              <Activity size={13} /> {rec.CurrentProduct} → <strong>{rec.RecommendedProduct}</strong>
            </p>
          </div>
        </div>
        <div className="mp-rec-right">
          <div className="mp-confidence-ring">
            <svg viewBox="0 0 36 36" className="mp-ring-svg">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15.9" fill="none"
                stroke="currentColor" strokeWidth="3"
                strokeDasharray={`${pct} ${100 - pct}`}
                strokeDashoffset="25"
                strokeLinecap="round"
              />
            </svg>
            <span className="mp-ring-label">{pct}%</span>
          </div>
          <span className="mp-region-tag">{rec.SalesRegion}</span>
          <button className="mp-toggle-btn" aria-label="toggle details">
            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mp-rec-details">
          <div className="mp-detail-grid">
            <div className="mp-detail-block mp-detail-block--reason">
              <Lightbulb size={14} />
              <div>
                <span className="mp-detail-label">Why suggested</span>
                <p>{reasonFor(rec)}</p>
              </div>
            </div>
            <div className="mp-detail-block mp-detail-block--benefit">
              <TrendingUp size={14} />
              <div>
                <span className="mp-detail-label">Expected benefit</span>
                <p>{benefitFor(rec)}</p>
              </div>
            </div>
            <div className="mp-detail-block mp-detail-block--risk">
              <Shield size={14} />
              <div>
                <span className="mp-detail-label">Risk / Alternative</span>
                <p>{riskFor(rec)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   Main Page
───────────────────────────────────────────────────────────── */
const MyPlan = () => {
  const { currentUser } = useAuth();
  const repName  = currentUser?.name  || 'Sales Representative';
  const repTitle = currentUser?.title || 'Sales Representative – All Regions';

  const tenantInfo   = getTenantInfo();
  const kpi          = tenantInfo?.KPI?.SalesRep || {};
  const recs         = (tenantInfo?.recommendations || []).slice().sort((a, b) => b.ConfidenceScore - a.ConfidenceScore);

  /* Segment recommendations by priority tier */
  const critical = recs.filter(r => r.ConfidenceScore >= 0.9);
  const focus    = recs.filter(r => r.ConfidenceScore >= 0.78 && r.ConfidenceScore < 0.9);
  const upcoming = recs.filter(r => r.ConfidenceScore >= 0.65 && r.ConfidenceScore < 0.78);
  const optional = recs.filter(r => r.ConfidenceScore < 0.65);

  /* Unique accounts */
  const accounts = [...new Set(recs.map(r => r.AccountName))];

  /* Revenue estimates */
  const crossRevenue = Math.round((kpi.CrossSellRevenue || 742860000) / 1e7);
  const upsellRevenue = Math.round((kpi.UpsellRevenue || 442560000) / 1e7);

  /* Timeline groups */
  const shortTerm = recs.slice(0, Math.ceil(recs.length * 0.33));
  const midTerm   = recs.slice(Math.ceil(recs.length * 0.33), Math.ceil(recs.length * 0.66));
  const longTerm  = recs.slice(Math.ceil(recs.length * 0.66));

  return (
    <div className="admin-layout">
      <SidebarNavigation role={currentUser?.role || 'sales-rep'} />
      <div className="admin-content">
        <TopNavbar title="My Plan" subtitle="AI-driven personalized plan for your accounts" />

        <div className="page-body">
          <div className="mp-root">

            {/* ── 1. USER SUMMARY ─────────────────────────────────── */}
            <section className="mp-section">
              <SectionHeader icon={User} title="✨ User Summary" subtitle="Your current sales standing" color="blue" />
              <div className="mp-summary-grid">
                <div className="mp-summary-hero">
                  <div className="mp-avatar">{repName.charAt(0)}</div>
                  <div>
                    <h3 className="mp-rep-name">{repName}</h3>
                    <p className="mp-rep-title">{repTitle}</p>
                    <div className="mp-rep-tags">
                      <span className="mp-tag mp-tag--blue"><Activity size={12}/> {recs.length} Active Recommendations</span>
                      <span className="mp-tag mp-tag--green"><CheckCircle size={12}/> {accounts.length} Target Accounts</span>
                      <span className="mp-tag mp-tag--purple"><Star size={12}/> Top Region: {kpi.TopRegionByRecommendationRevenue || 'West'}</span>
                    </div>
                  </div>
                </div>
                <div className="mp-summary-stats">
                  <div className="mp-stat-card mp-stat-card--red">
                    <AlertTriangle size={20} />
                    <span className="mp-stat-val">{critical.length}</span>
                    <span className="mp-stat-lbl">High Priority</span>
                  </div>
                  <div className="mp-stat-card mp-stat-card--blue">
                    <Zap size={20} />
                    <span className="mp-stat-val">{focus.length}</span>
                    <span className="mp-stat-lbl">In Focus</span>
                  </div>
                  <div className="mp-stat-card mp-stat-card--yellow">
                    <Clock size={20} />
                    <span className="mp-stat-val">{upcoming.length}</span>
                    <span className="mp-stat-lbl">Upcoming</span>
                  </div>
                  <div className="mp-stat-card mp-stat-card--purple">
                    <Layers size={20} />
                    <span className="mp-stat-val">{optional.length}</span>
                    <span className="mp-stat-lbl">Optional</span>
                  </div>
                </div>
              </div>
            </section>

            {/* ── 2. KEY GOALS ────────────────────────────────────── */}
            <section className="mp-section">
              <SectionHeader icon={Target} title="🎯 Key Goals" subtitle="Clearly defined targets for this quarter" color="green" />
              <div className="mp-goals-grid">
                <div className="mp-goal-card">
                  <div className="mp-goal-icon mp-goal-icon--green"><TrendingUp size={18}/></div>
                  <div>
                    <h4>Cross-Sell Revenue</h4>
                    <p className="mp-goal-value">₹{crossRevenue} Cr</p>
                    <p className="mp-goal-desc">Top service: <strong>{kpi.TopCrossSellService || 'Digital'}</strong>. Drive adoption across {accounts.length} accounts.</p>
                  </div>
                </div>
                <div className="mp-goal-card">
                  <div className="mp-goal-icon mp-goal-icon--blue"><BarChart2 size={18}/></div>
                  <div>
                    <h4>Upsell Revenue</h4>
                    <p className="mp-goal-value">₹{upsellRevenue} Cr</p>
                    <p className="mp-goal-desc">Top service: <strong>{kpi.TopUpsellService || 'Data Engineering'}</strong>. Expand existing deals.</p>
                  </div>
                </div>
                <div className="mp-goal-card">
                  <div className="mp-goal-icon mp-goal-icon--purple"><Award size={18}/></div>
                  <div>
                    <h4>Top Account Target</h4>
                    <p className="mp-goal-value" style={{fontSize:'0.95rem'}}>{kpi.TopRecommendedAccount || 'ACCELYA SOLUTIONS'}</p>
                    <p className="mp-goal-desc">Highest recommendation density. Close {recs.filter(r=>r.AccountName===kpi.TopRecommendedAccount).length} pending opportunities.</p>
                  </div>
                </div>
                <div className="mp-goal-card">
                  <div className="mp-goal-icon mp-goal-icon--red"><AlertTriangle size={18}/></div>
                  <div>
                    <h4>Priority Closes</h4>
                    <p className="mp-goal-value">{critical.length} deals</p>
                    <p className="mp-goal-desc">Confidence ≥ 90%. Immediate outreach required to capture pipeline value.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ── 3. PERSONALIZED PLAN ────────────────────────────── */}
            <section className="mp-section">
              <SectionHeader icon={Zap} title="📌 Personalized Plan" subtitle="Recommendations ranked by AI confidence score" color="red" />

              {critical.length > 0 && (
                <div className="mp-tier-block">
                  <div className="mp-tier-label mp-tier-label--red"><AlertTriangle size={14}/> 🔴 High Priority Actions</div>
                  {critical.map((r, i) => <RecCard key={r.OpportunityName} rec={r} index={i} total={recs.length} />)}
                </div>
              )}
              {focus.length > 0 && (
                <div className="mp-tier-block">
                  <div className="mp-tier-label mp-tier-label--blue"><Activity size={14}/> 🔵 Current Focus</div>
                  {focus.map((r, i) => <RecCard key={r.OpportunityName} rec={r} index={critical.length + i} total={recs.length} />)}
                </div>
              )}
              {upcoming.length > 0 && (
                <div className="mp-tier-block">
                  <div className="mp-tier-label mp-tier-label--yellow"><Clock size={14}/> 🟡 Upcoming Steps</div>
                  {upcoming.map((r, i) => <RecCard key={r.OpportunityName} rec={r} index={critical.length + focus.length + i} total={recs.length} />)}
                </div>
              )}
              {optional.length > 0 && (
                <div className="mp-tier-block">
                  <div className="mp-tier-label mp-tier-label--purple"><Star size={14}/> 🟣 Optional Improvements</div>
                  {optional.map((r, i) => <RecCard key={r.OpportunityName} rec={r} index={critical.length + focus.length + upcoming.length + i} total={recs.length} />)}
                </div>
              )}
            </section>

            {/* ── 4. TIMELINE ─────────────────────────────────────── */}
            <section className="mp-section">
              <SectionHeader icon={Calendar} title="🗓️ Timeline" subtitle="Phased execution plan across 90 days" color="purple" />
              <div className="mp-timeline-grid">
                {[
                  { label: 'Short-term', days: '0–30 days', phase: 'short', items: shortTerm, color: 'red', icon: <AlertTriangle size={16}/>, action: 'Pitch & qualify top opportunities immediately.' },
                  { label: 'Mid-term',   days: '30–60 days', phase: 'mid',  items: midTerm,   color: 'blue', icon: <Activity size={16}/>,      action: 'Progress proposals and run demos.' },
                  { label: 'Long-term',  days: '60–90 days', phase: 'long', items: longTerm,  color: 'purple', icon: <Layers size={16}/>,     action: 'Nurture optional leads and expand accounts.' },
                ].map(({ label, days, phase, items, color, icon, action }) => (
                  <div key={phase} className={`mp-timeline-card mp-timeline-card--${color}`}>
                    <div className="mp-tl-head">
                      <div className={`mp-tl-icon mp-tl-icon--${color}`}>{icon}</div>
                      <div>
                        <h4 className="mp-tl-label">{label}</h4>
                        <span className="mp-tl-days">{days}</span>
                      </div>
                      <span className="mp-tl-count">{items.length}</span>
                    </div>
                    <p className="mp-tl-action"><ArrowRight size={13}/> {action}</p>
                    <ul className="mp-tl-list">
                      {items.slice(0, 4).map(r => (
                        <li key={r.OpportunityName}>
                          <span className="mp-tl-dot" />
                          <strong>{r.RecommendedProduct}</strong>
                          <span className="mp-tl-account">&nbsp;·&nbsp;{r.AccountName.split(' ')[0]}</span>
                        </li>
                      ))}
                      {items.length > 4 && <li className="mp-tl-more">+{items.length - 4} more</li>}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* ── 5. EXPECTED RESULTS ─────────────────────────────── */}
            <section className="mp-section">
              <SectionHeader icon={BarChart2} title="📊 Expected Results" subtitle="Measurable milestones and checkpoints" color="green" />
              <div className="mp-results-grid">
                {[
                  { milestone: 'Week 2',  color: 'red',    icon: <AlertTriangle size={16}/>,  checkpoint: `Initiate outreach on all ${critical.length} high-priority accounts`, metric: `${critical.length} calls scheduled` },
                  { milestone: 'Week 4',  color: 'blue',   icon: <Activity size={16}/>,       checkpoint: `${focus.length} demos delivered for in-focus opportunities`, metric: `${focus.length} proposals in pipeline` },
                  { milestone: 'Week 6',  color: 'yellow', icon: <Clock size={16}/>,          checkpoint: `${Math.ceil(upcoming.length / 2)} upcoming deals progress to negotiation`, metric: `Pipeline value +₹${Math.round(upsellRevenue * 0.3)} Cr` },
                  { milestone: 'Week 8',  color: 'green',  icon: <CheckCircle size={16}/>,    checkpoint: `First ${Math.ceil(critical.length / 2)} closures achieved`, metric: `Revenue: ₹${Math.round(crossRevenue * 0.25)} Cr` },
                  { milestone: 'Week 10', color: 'purple', icon: <Star size={16}/>,           checkpoint: 'Optional improvements reviewed and enacted', metric: `${optional.length} leads nurtured` },
                  { milestone: 'Week 12', color: 'green',  icon: <Award size={16}/>,          checkpoint: '90-day plan completed — full pipeline reviewed', metric: `Target: ₹${Math.round((crossRevenue + upsellRevenue) * 0.6)} Cr closed` },
                ].map(({ milestone, color, icon, checkpoint, metric }) => (
                  <div key={milestone} className={`mp-result-card mp-result-card--${color}`}>
                    <div className={`mp-result-milestone mp-result-milestone--${color}`}>
                      {icon}
                      <span>{milestone}</span>
                    </div>
                    <p className="mp-result-checkpoint">{checkpoint}</p>
                    <div className={`mp-result-metric mp-result-metric--${color}`}>{metric}</div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPlan;
