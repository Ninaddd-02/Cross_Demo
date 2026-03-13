# Integration Instructions - Add New Features to Your App

## Quick Copy-Paste Integration

### Step 1: Update App.jsx to Add New Routes

Add these imports at the top of `src/App.jsx`:

```javascript
import DealsPage from './pages/DealsPage/DealsPage';
import AIRecommendationsEnhanced from './pages/AIRecommendations/AIRecommendationsEnhanced';
```

Then add these routes in the Sales Routes section:

```javascript
{/* Sales Routes */}
<Route path="/sales/deals" element={
  <ProtectedRoute allowedRoles={['sales-rep']}>
    <DealsPage />
  </ProtectedRoute>
} />

{/* Replace existing recommendations route with enhanced version */}
<Route path="/sales/recommendations" element={
  <ProtectedRoute allowedRoles={['sales-rep']}>
    <AIRecommendationsEnhanced />
  </ProtectedRoute>
} />
```

### Step 2: Update Sidebar Navigation

In `src/components/SidebarNavigation/SidebarNavigation.jsx`, find the sales navigation items and add:

```javascript
{
  icon: <TrendingUp size={20} />,
  label: 'My Deals',
  path: '/sales/deals',
  badge: null
},
```

### Step 3: Update Any Page to Use Stores

Example: Update `src/pages/SalesforceAccount/SalesforceAccount.jsx`

Add imports:
```javascript
import useDealsStore from '../../stores/useDealsStore';
import useRecommendationsStore from '../../stores/useRecommendationsStore';
import { notify } from '../../utils/notifications';
```

Use in component:
```javascript
const { getDealsByRep } = useDealsStore();
const { getRecommendationsByRep } = useRecommendationsStore();

const myDeals = getDealsByRep(currentUser?.repId);
const recommendations = getRecommendationsByRep(currentUser?.repId);
```

### Step 4: Add "Create Deal" Button

In any page, add a button that opens the deal form:

```javascript
import { useState } from 'react';
import DealForm from '../../components/DealForm/DealForm';

function YourPage() {
  const [showDealForm, setShowDealForm] = useState(false);
  const { currentUser } = useAuth();
  
  return (
    <>
      <button onClick={() => setShowDealForm(true)}>
        Create Deal
      </button>
      
      {showDealForm && (
        <DealForm
          repId={currentUser?.repId}
          repName={currentUser?.name}
          region={currentUser?.region}
          onClose={() => setShowDealForm(false)}
        />
      )}
    </>
  );
}
```

## Complete App.jsx Reference

Here's the complete imports section for App.jsx:

```javascript
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAuth } from './context/AuthContext';

// Auth
import Login from './pages/Login/Login';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import ConnectDataSource from './pages/ConnectDataSource/ConnectDataSource';
import MapFields from './pages/MapFields/MapFields';
import TrainModel from './pages/TrainModel/TrainModel';
import MonitorEngine from './pages/MonitorEngine/MonitorEngine';

// Sales Pages
import SalesforceAccount from './pages/SalesforceAccount/SalesforceAccount';
import DealsPage from './pages/DealsPage/DealsPage';
import AIRecommendationsEnhanced from './pages/AIRecommendations/AIRecommendationsEnhanced';
import ActionConfirmation from './pages/ActionConfirmation/ActionConfirmation';
import RetrainVisualization from './pages/RetrainVisualization/RetrainVisualization';
import MyPlan from './pages/MyPlan/MyPlan';

// Sales Head Pages
import SalesHeadDashboard from './pages/SalesHeadDashboard/SalesHeadDashboard';

// Sales Manager Pages
import SalesManagerDashboard from './pages/SalesManagerDashboard/SalesManagerDashboard';
import TeamActivityPage from './pages/TeamActivityPage/TeamActivityPage';
```

## Testing Checklist

After integration, test these features:

### 1. Deal Management
- [ ] Navigate to `/sales/deals`
- [ ] Click "New Deal" button
- [ ] Fill out form and submit
- [ ] See toast notification
- [ ] Verify deal appears in list
- [ ] Edit a deal
- [ ] Change deal stage
- [ ] Delete a deal
- [ ] Search for deals
- [ ] Filter by stage

### 2. AI Recommendations
- [ ] Navigate to `/sales/recommendations`
- [ ] See personalized recommendations
- [ ] Click "Accept" on a recommendation
- [ ] Add optional notes
- [ ] See success notification
- [ ] Click "Dismiss" on a recommendation
- [ ] Add optional feedback
- [ ] Filter by Cross-Sell/Upsell

### 3. Data Persistence
- [ ] Create a deal
- [ ] Refresh browser (Ctrl+R)
- [ ] Deal still appears
- [ ] Accept a recommendation
- [ ] Refresh browser
- [ ] Recommendation moved to accepted list

### 4. Notifications
- [ ] Create deal → See "Deal Created" toast
- [ ] Update deal → See "Deal Updated" toast
- [ ] Delete deal → See "Deal Removed" toast
- [ ] Change stage → See "Stage Updated" toast
- [ ] Accept recommendation → See success toast
- [ ] Reject recommendation → See info toast

## Common Integration Points

### Display Pipeline Value
```javascript
import useDealsStore from '../../stores/useDealsStore';

const { getPipelineValueByRep } = useDealsStore();
const pipelineValue = getPipelineValueByRep(currentUser?.repId);

// Shows: formatCurrency(pipelineValue) → "₹18.8 Cr"
```

### Show Recent Activities
```javascript
import useActivitiesStore from '../../stores/useActivitiesStore';

const { getActivitiesByRep } = useActivitiesStore();
const activities = getActivitiesByRep(currentUser?.repId);

// Display activities in a list
activities.map(activity => (
  <div key={activity.id}>
    {activity.description}
    <small>{formatRelativeTime(activity.timestamp)}</small>
  </div>
))
```

### Display Recommendation Count
```javascript
import useRecommendationsStore from '../../stores/useRecommendationsStore';

const { getRecommendationsByRep } = useRecommendationsStore();
const recommendations = getRecommendationsByRep(currentUser?.repId);

// Badge showing count
<Badge>{recommendations.length} New</Badge>
```

## Utility Functions Available

### Currency Formatting
```javascript
import { formatCurrency } from '../../utils/helpers';

formatCurrency(68000000)  // "₹68 Lakh"
formatCurrency(32000000000)  // "₹3.2 Cr"
```

### Date Formatting
```javascript
import { formatDate, formatRelativeTime } from '../../utils/helpers';

formatDate(new Date())  // "Mar 02, 2026"
formatRelativeTime(new Date())  // "just now"
```

### Status Colors
```javascript
import { getStatusColor } from '../../utils/helpers';

const color = getStatusColor('Negotiation');  // "#FFCA28"
// Use in styles: style={{ borderColor: color }}
```

## Advanced: Custom Hooks

Create a custom hook for common operations:

```javascript
// src/hooks/useDeals.js
import useDealsStore from '../stores/useDealsStore';
import useActivitiesStore from '../stores/useActivitiesStore';
import { notify } from '../utils/notifications';

export const useDeals = (repId) => {
  const { 
    getDealsByRep, 
    addDeal, 
    updateDeal, 
    deleteDeal 
  } = useDealsStore();
  
  const { logDealActivity } = useActivitiesStore();
  
  const createDeal = (dealData) => {
    const deal = addDeal(dealData);
    logDealActivity(deal.id, repId, 'deal_created', 'New deal created');
    notify.dealCreated(deal.name);
    return deal;
  };
  
  return {
    deals: getDealsByRep(repId),
    createDeal,
    updateDeal,
    deleteDeal
  };
};
```

Usage:
```javascript
import { useDeals } from '../../hooks/useDeals';

const { deals, createDeal } = useDeals(currentUser?.repId);
```

## Environment-Specific Notes

### Development
- Data stored in localStorage
- Hot reload works with Zustand
- Dev tools available

### Production Build
```bash
npm run build
npm run preview
```

### Deployment
- All data is client-side (localStorage)
- No backend required
- Can deploy to:
  - Vercel
  - Netlify
  - GitHub Pages
  - Any static hosting

## Troubleshooting Integration

### Issue: Stores not updating UI
**Solution**: Ensure you're calling store actions, not modifying state directly
```javascript
// ❌ Wrong
deals.push(newDeal);

// ✅ Correct
addDeal(newDeal);
```

### Issue: Toasts not appearing
**Solution**: Add Toaster component to App.jsx
```javascript
<Toaster position="top-right" theme="dark" richColors closeButton />
```

### Issue: Data lost on refresh
**Solution**: Check localStorage permissions in browser
```javascript
// Test in console
localStorage.setItem('test', '1');
localStorage.getItem('test');  // Should return '1'
```

### Issue: Form validation not working
**Solution**: Ensure react-hook-form is properly configured
```javascript
const { register, handleSubmit, formState: { errors } } = useForm();
```

---

## You're All Set! 🎉

Your Cross Sync app now has:
- ✅ Full CRUD operations
- ✅ Real-time state management
- ✅ Data persistence
- ✅ Interactive recommendations
- ✅ Activity tracking
- ✅ Smart notifications

Start testing and customizing! 🚀
