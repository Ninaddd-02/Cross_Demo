# Real-Time Cross-Tab Synchronization Guide

## Overview

The system now supports **real-time data synchronization** across multiple browser tabs/windows, simulating a production application with live backend updates.

## Architecture

### Data Flow: Sales Rep → Manager → Sales Head

```
┌──────────────┐
│  Sales Rep   │
│  (Tab 1)     │──┐
└──────────────┘  │
                  │ localStorage
┌──────────────┐  │ Storage Events
│   Manager    │◄─┤
│  (Tab 2)     │  │
└──────────────┘  │
                  │
┌──────────────┐  │
│ Sales Head   │◄─┘
│  (Tab 3)     │
└──────────────┘
```

## How It Works

### 1. **Cross-Tab Communication**
- Uses `localStorage` with `storage` events
- When data changes in one tab, all other tabs are notified instantly
- Each tab has a unique ID to prevent self-notification

### 2. **Event Broadcasting**
All recommendation actions broadcast sync events:
- ✅ **Recommendation Created** - New AI recommendation generated
- ✅ **Recommendation Accepted** - Rep accepts a recommendation
- ✅ **Recommendation Rejected** - Rep rejects a recommendation

### 3. **Auto-Refresh Mechanism**
- **Cross-tab sync**: Instant updates via `storage` events (0ms delay)
- **Polling**: Same-page refresh every 5 seconds
- **Force refresh**: Manual refresh trigger support

## Implementation Details

### Files Modified

#### **New File: `/src/utils/syncManager.js`**
Central sync manager handling all cross-tab communication:
- `broadcastSync()` - Send events to all tabs
- `onSyncEvent()` - Listen for events from other tabs
- `createPollingRefresh()` - Set up auto-refresh polling
- `getTabId()` - Unique tab identifier

#### **Updated: `/src/stores/useRecommendationsStore.js`**
- Added sync broadcasting to `acceptRecommendation()`
- Added sync broadcasting to `rejectRecommendation()`
- Added sync broadcasting to `addRecommendation()`
- Bumped version to v2 to clear old cache

#### **Updated: `/src/pages/TeamRecommendations/TeamRecommendations.jsx`**
Manager & Sales Head view:
- Added cross-tab sync listener
- Added 5-second auto-refresh polling
- Added `refreshKey` state for reactive updates
- Reactive to changes from any sales rep

#### **Updated: `/src/pages/AIRecommendations/AIRecommendations.jsx`**
Sales Rep view:
- Integrated with recommendations store
- Added sync broadcasting on accept/reject
- Added cross-tab sync listener
- Now properly persists actions

## Testing Real-Time Sync

### Scenario 1: Rep Accept/Reject → Manager Sees Instantly

1. **Open Tab 1:** Login as **Sales Rep** (e.g., rahul.sharma@company.com)
   - Navigate to "AI Recommendations"
   
2. **Open Tab 2:** Login as **Manager** (e.g., rajesh.kumar@company.com)
   - Navigate to "Team Recommendations"
   
3. **In Tab 1 (Rep):**
   - Accept or reject any recommendation
   - Check console: `✅ Recommendation accepted and synced`

4. **In Tab 2 (Manager):**
   - Within seconds, the change appears automatically
   - Check console: `📡 Sync event received: recommendation_accepted`
   - The recommendation status updates without manual refresh

### Scenario 2: Multi-Level Visibility (Rep → Manager → Head)

1. **Open Tab 1:** Sales Rep 1 (Rahul Sharma - Rep 1)
2. **Open Tab 2:** Manager 1 (Rajesh Kumar - manages Reps 1 & 2)
3. **Open Tab 3:** Sales Head (Vikram Malhotra - sees all)

**Action in Tab 1:**
- Rep 1 accepts a recommendation

**Result:**
- Tab 2 (Manager 1): Sees Rep 1's update instantly ✅
- Tab 3 (Sales Head): Sees Rep 1's update instantly ✅
- Manager 2's tab: Does NOT see it (correct - not their rep) ✅

###Scenario 3: Cross-Tab Data Consistency

1. **Open multiple tabs** with same user
2. **Perform action in one tab**
3. All tabs show consistent data within 5 seconds

## Console Debug Messages

Watch the browser console to see real-time sync in action:

```javascript
// When Rep takes action:
✅ Recommendation accepted and synced
  { recId: '123', repId: 1, notes: '...', timestamp: '...' }

// When Manager/Head receives update:
📡 Sync event received: recommendation_accepted
  { repId: 1, ... }
✅ Relevant to this manager/head - refreshing data

// Team Recommendations Debug:
🔍 Team Recommendations Debug:
  currentUserRole: 'sales-manager'
  currentManagerId: 1
  visibleRepIds: [1, 2]
  filteredRecommendations: 3
  recommendationRepIds: [1, 2]
```

## Access Control with Real-Time Sync

### Sales Representative
- **Sees:** Only their own recommendations
- **Actions sync to:** Their manager + Sales Head
- **Can:** Accept/Reject recommendations (synced instantly)

### Manager
- **Sees:** Only their assigned reps' recommendations
  - Manager 1: Reps 1 & 2
  - Manager 2: Reps 3 & 4
- **Actions sync to:** Sales Head
- **View:** Read-only (for coaching)

### Sales Head
- **Sees:** All recommendations from all reps
- **Actions sync to:** N/A (top of hierarchy)
- **View:** Read-only (for oversight)

## Data Persistence

### localStorage Storage
All data persists across page reloads using Zustand persist middleware:
- Storage key: `recommendations-storage`
- Version: 2 (auto-clears on version change)

### Clear Cache
If you need to reset all data:
```javascript
localStorage.clear()
// Or selective:
localStorage.removeItem('recommendations-storage')
```

## Performance Considerations

1. **Storage Events** are lightweight (< 1ms)
2. **Polling** runs every 5 seconds (can be adjusted)
3. **localStorage** has ~10MB limit (more than sufficient)
4. **No backend calls** - all synchronization is client-side

## Future Enhancements

For production with real backend:

1. **Replace localStorage with WebSockets**
   ```javascript
   // Instead of: broadcastSync(SYNC_EVENTS.RECOMMENDATION_ACCEPTED, data)
   // Use: socket.emit('recommendation:accepted', data)
   ```

2. **Add Socket.IO or Server-Sent Events (SSE)**
   ```javascript
   const socket = io('wss://api.yourapp.com');
   socket.on('recommendation:updated', handleUpdate);
   ```

3. **Add Optimistic Updates**
   - Update UI immediately
   - Confirm with backend
   - Rollback if fails

4. **Add Conflict Resolution**
   - Last-write-wins
   - Version vectors
   - Operational transforms

## Adding Your Custom Dataset

To use your own data without changing functionality:

### Option 1: Update sharedData.js
Replace the existing data arrays while maintaining the structure:
```javascript
export const salesReps = [
  { id: 1, name: 'Your Rep', managerId: 1, ... },
  // Your data here
];
```

### Option 2: Dynamic Data Loading
Create a data loader that fetches from your API:
```javascript
// src/utils/dataLoader.js
export const loadCustomData = async () => {
  const response = await fetch('/api/your-data');
  return response.json();
};
```

### Option 3: Import from JSON
```javascript
import customData from './data/your-custom-data.json';
```

**Important:** Maintain the same data structure:
- `id`, `name`, `managerId`, `repId`
- Recommendation fields: `type`, `title`, `confidence`, `status`
- This ensures all filtering and access control works correctly

## Troubleshooting

### Not seeing updates?
1. Check console for sync events
2. Verify both tabs are logged in as different roles
3. Clear localStorage and refresh
4. Check that repId/managerId relationships are correct

### Updates slow?
1. Reduce polling interval (default 5000ms)
2. Check browser performance tab
3. Ensure no console errors

### Data out of sync?
1. Clear localStorage: `localStorage.clear()`
2. Refresh all tabs
3. Check store version matches (v2)

## Summary

✅ **Multi-tab sync working** via localStorage storage events  
✅ **Real-time updates** within 5 seconds maximum (instant for cross-tab)  
✅ **Access control maintained** - managers only see their reps  
✅ **Data persistence** across page reloads  
✅ **Ready for custom data** - just replace the dataset  

The system now behaves like a production application with real-time backend, simulated entirely client-side!
