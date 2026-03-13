// Notification utilities using Sonner toast library
import { toast } from 'sonner';

export const notify = {
  success: (message, description) => {
    toast.success(message, {
      description,
      duration: 3000,
    });
  },
  
  error: (message, description) => {
    toast.error(message, {
      description,
      duration: 4000,
    });
  },
  
  info: (message, description) => {
    toast.info(message, {
      description,
      duration: 3000,
    });
  },
  
  warning: (message, description) => {
    toast.warning(message, {
      description,
      duration: 3500,
    });
  },
  
  promise: (promise, messages) => {
    return toast.promise(promise, {
      loading: messages.loading || 'Loading...',
      success: messages.success || 'Success!',
      error: messages.error || 'Something went wrong',
    });
  },
  
  // Specific business notifications
  dealCreated: (dealName) => {
    toast.success('Deal Created', {
      description: `${dealName} has been added to your pipeline`,
      duration: 3000,
    });
  },
  
  dealUpdated: (dealName) => {
    toast.success('Deal Updated', {
      description: `${dealName} has been updated successfully`,
      duration: 3000,
    });
  },
  
  dealDeleted: (dealName) => {
    toast.info('Deal Removed', {
      description: `${dealName} has been removed from your pipeline`,
      duration: 3000,
    });
  },
  
  stageChanged: (dealName, newStage) => {
    toast.success('Stage Updated', {
      description: `${dealName} moved to ${newStage}`,
      duration: 3000,
    });
  },
  
  recommendationAccepted: (title) => {
    toast.success('Recommendation Accepted', {
      description: `"${title}" added to your plan`,
      duration: 3000,
    });
  },
  
  recommendationRejected: (title) => {
    toast.info('Recommendation Dismissed', {
      description: `"${title}" has been dismissed`,
      duration: 2500,
    });
  },
  
  activityLogged: (type) => {
    toast.success('Activity Logged', {
      description: `${type} has been recorded`,
      duration: 2500,
    });
  },
  
  accountCreated: (accountName) => {
    toast.success('Account Created', {
      description: `${accountName} has been added`,
      duration: 3000,
    });
  },
  
  accountUpdated: (accountName) => {
    toast.success('Account Updated', {
      description: `${accountName} information updated`,
      duration: 3000,
    });
  },
  
  validationError: (field) => {
    toast.error('Validation Error', {
      description: `Please check the ${field} field`,
      duration: 3000,
    });
  },
  
  saveSuccess: () => {
    toast.success('Saved', {
      description: 'Your changes have been saved',
      duration: 2500,
    });
  },
  
  saveError: () => {
    toast.error('Save Failed', {
      description: 'Could not save changes. Please try again.',
      duration: 4000,
    });
  }
};

export default notify;
