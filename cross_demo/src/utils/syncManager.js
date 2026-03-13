/**
 * Real-time Cross-Tab Sync Manager
 * Enables data synchronization across multiple browser tabs/windows
 * Simulates real-time backend behavior using localStorage events
 */

// Sync event types
export const SYNC_EVENTS = {
  RECOMMENDATION_CREATED: 'recommendation_created',
  RECOMMENDATION_ACCEPTED: 'recommendation_accepted',
  RECOMMENDATION_REJECTED: 'recommendation_rejected',
  DEAL_UPDATED: 'deal_updated',
  ACTIVITY_UPDATED: 'activity_updated',
  STORE_UPDATED: 'store_updated'
};

// Broadcast a sync event to all tabs
export const broadcastSync = (eventType, data) => {
  const syncEvent = {
    type: eventType,
    data,
    timestamp: Date.now(),
    tabId: getTabId()
  };
  
  // Store in localStorage to trigger storage event in other tabs
  localStorage.setItem('sync_event', JSON.stringify(syncEvent));
  
  // Immediately remove to allow same event type to fire again
  setTimeout(() => {
    localStorage.removeItem('sync_event');
  }, 100);
};

// Generate unique tab ID
let tabId = null;
export const getTabId = () => {
  if (!tabId) {
    tabId = `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  return tabId;
};

// Listen for sync events from other tabs
export const onSyncEvent = (callback) => {
  const handler = (e) => {
    // Only listen to sync_event changes
    if (e.key === 'sync_event' && e.newValue) {
      try {
        const syncEvent = JSON.parse(e.newValue);
        
        // Ignore events from the current tab
        if (syncEvent.tabId !== getTabId()) {
          callback(syncEvent);
        }
      } catch (error) {
        console.error('Error parsing sync event:', error);
      }
    }
  };
  
  window.addEventListener('storage', handler);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('storage', handler);
  };
};

// Trigger a manual refresh of store data
export const triggerStoreRefresh = () => {
  window.dispatchEvent(new CustomEvent('store_refresh'));
};

// Listen for store refresh events (same tab)
export const onStoreRefresh = (callback) => {
  const handler = () => callback();
  window.addEventListener('store_refresh', handler);
  
  return () => {
    window.removeEventListener('store_refresh', handler);
  };
};

// Polling mechanism for same-page updates
export const createPollingRefresh = (callback, intervalMs = 5000) => {
  const interval = setInterval(callback, intervalMs);
  
  return () => {
    clearInterval(interval);
  };
};

// Check if data has been updated since last check
let lastUpdateTimestamp = Date.now();

export const checkForUpdates = (storeName) => {
  const storeData = localStorage.getItem(storeName);
  if (storeData) {
    try {
      const parsed = JSON.parse(storeData);
      if (parsed.state && parsed.version) {
        const storeTimestamp = parsed.version;
        if (storeTimestamp > lastUpdateTimestamp) {
          lastUpdateTimestamp = storeTimestamp;
          return true;
        }
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
    }
  }
  return false;
};

// Force reload component data
export const forceDataReload = () => {
  const event = new CustomEvent('force_data_reload', {
    detail: { timestamp: Date.now() }
  });
  window.dispatchEvent(event);
};

export const onForceReload = (callback) => {
  const handler = (e) => callback(e.detail);
  window.addEventListener('force_data_reload', handler);
  
  return () => {
    window.removeEventListener('force_data_reload', handler);
  };
};
