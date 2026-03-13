# Team Recommendations - Testing Guide

## Feature Overview
View-only recommendations access for Sales Managers and Sales VPs to monitor and coach their teams.

## How to Test

### 1. Login as Sales Manager (Rajesh Kumar)
```
Email: rajesh.kumar@company.com
Password: manager123
```

**Expected Behavior:**
- Navigate to "Team Recommendations" in the sidebar (Eye icon)
- Should see recommendations from **North region** reps only (Rahul Sharma)
- Cards are **read-only** (no Accept/Reject buttons)
- Each card shows the rep's name badge at the top
- Can filter by:
  - Sales Rep (dropdown)
  - Recommendation Type (Cross-sell, Upsell, Retention, Win-back)
  - Status (Pending, Accepted, Rejected)
  - Sort by (Newest First, Oldest First, Highest Confidence, Lowest Confidence)
- Search box filters by account name or type
- Stats dashboard shows: Total, Pending, Accepted, Acceptance Rate

### 2. Login as Sales VP (Vikram Singh)
```
Email: vikram.singh@company.com
Password: vp123
```

**Expected Behavior:**
- Navigate to "Team Recommendations" in the sidebar (Eye icon)
- Should see recommendations from **ALL regions** (North, South, East, West)
- All 4 sales reps visible in the rep filter (Rahul Sharma, Priya Mehta, Amit Kumar, Neha Singh)
- Everything else same as Manager view
- Stats show combined metrics across all teams

### 3. Sales Rep Access (Sanity Check)
```
Email: rahul.sharma@company.com
Password: sales123
```

**Expected Behavior:**
- No "Team Recommendations" link in sidebar
- Only sees "Recommendations" (their own personal recommendations page)

## Sample Data
The page includes `getStaticRecommendations()` which generates sample recommendations:
- Total of 4 sales reps across 4 regions
- 2 recommendations for Rahul Sharma (North)
- 1 recommendation for Priya Mehta (South)
- 1 recommendation for Amit Kumar (East)
- 1 recommendation for Neha Singh (West)
- All recommendations are high-impact cross-sell or upsell opportunities
- Confidence scores: 85-92%

Note: You can extend this by manually adding more recommendations via the sales rep interface.

## Key Features to Verify

### Role-Based Filtering
- ✅ Manager sees only their region
- ✅ VP sees all regions
- ✅ Sales Rep doesn't see the page at all

### Read-Only Access
- ✅ No Accept/Reject buttons on cards
- ✅ Rep name badge visible on each card
- ✅ Status shown but not editable

### Filtering & Search
- ✅ Region filter (VP only, shows all 4 regions)
- ✅ Sales rep dropdown (filtered by role)
- ✅ Type filter (4 recommendation types)
- ✅ Status filter (3 statuses)
- ✅ Sort options (4 sorting methods)
- ✅ Search by account name or type
- ✅ "Clear Filters" button resets everything

### Stats Dashboard
- ✅ Total Recommendations count
- ✅ Pending count
- ✅ Accepted count
- ✅ Acceptance Rate percentage

### Responsive Design
- ✅ Desktop: 3-column grid (max-width 1200px)
- ✅ Tablet: 2-column grid (< 1024px)
- ✅ Mobile: 1-column stack (< 768px)

## Technical Integration

### New Files Created
1. `src/pages/TeamRecommendations/TeamRecommendations.jsx` (429 lines)
2. `src/pages/TeamRecommendations/TeamRecommendations.css` (294 lines)

### Files Modified
1. `src/stores/useRecommendationsStore.js` - Added team viewing methods:
   - `getRecommendationsByTeam(teamRepIds)`
   - `getRecommendationsByRegion(region, salesReps)`
   - `getAllRecommendationsWithRepInfo(salesReps)`
   - `getTeamStats(teamRepIds)`

2. `src/App.jsx` - Added routes:
   - `/sales-manager/team-recommendations` → TeamRecommendations (role: sales-manager)
   - `/sales-head/team-recommendations` → TeamRecommendations (role: sales-head)

3. `src/components/SidebarNavigation/SidebarNavigation.jsx` - Added menu items:
   - Sales Manager: "Team Recommendations" (Eye icon)
   - Sales VP: "Team Recommendations" (Eye icon)

## Future Enhancements (Phase 2)
- Manager comments on recommendations
- Flagging recommendations for discussion
- Coaching notes per rep/recommendation
- Export recommendations report (PDF/Excel)
- Push notifications when rep accepts high-value recommendations
- Historical trends and analytics

## Troubleshooting

### No Recommendations Showing
- Check console for errors
- Verify `getStaticRecommendations()` is being called
- Check if filters are too restrictive (click "Clear Filters")

### Wrong Reps Visible
- Verify logged-in user's role and region
- Check `salesReps` data in `src/data/sharedData.js`
- Ensure manager ID matches `managerId` field in salesReps array

### Styling Issues
- Check browser console for CSS warnings
- Verify `TeamRecommendations.css` is imported
- Clear browser cache

## Success Criteria
✅ Managers see only their team's recommendations
✅ VPs see all team recommendations
✅ Sales reps don't have access
✅ All filters and search work correctly
✅ Stats calculate accurately
✅ Mobile responsive design works
✅ Read-only cards display correctly with rep badges
