import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAuth } from './context/AuthContext';

// Auth
import Login from './pages/Login/Login';

// Sales Pages
import SalesforceAccount from './pages/SalesforceAccount/SalesforceAccount';
import AIRecommendations from './pages/AIRecommendations/AIRecommendations';
import ActionConfirmation from './pages/ActionConfirmation/ActionConfirmation';
import RetrainVisualization from './pages/RetrainVisualization/RetrainVisualization';
import MyPlan from './pages/MyPlan/MyPlan';
import AccountsList from './pages/AccountsList/AccountsList';

// Sales Head Pages
import SalesHeadDashboard from './pages/SalesHeadDashboard/SalesHeadDashboard';
import OrganizationPlan from './pages/OrganizationPlan/OrganizationPlan';

// Sales Manager Pages
import SalesManagerDashboard from './pages/SalesManagerDashboard/SalesManagerDashboard';
import TeamActivityPage from './pages/TeamActivityPage/TeamActivityPage';
import TeamRecommendations from './pages/TeamRecommendations/TeamRecommendations';
import TeamPlan from './pages/TeamPlan/TeamPlan';

// Loading Component
const LoadingScreen = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'var(--bg-primary)',
    color: 'var(--text-primary)'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid rgba(1, 118, 211, 0.3)',
        borderTop: '3px solid var(--salesforce-blue)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        margin: '0 auto 1rem'
      }}></div>
      <p>Loading...</p>
    </div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <>
      <Toaster 
        position="top-right" 
        theme="dark"
        richColors
        closeButton
        duration={3000}
      />
      <Router>
        <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        
        {/* Sales Routes */}
        <Route path="/sales/dashboard" element={
          <ProtectedRoute allowedRoles={['sales-rep']}>
            <SalesforceAccount />
          </ProtectedRoute>
        } />
        <Route path="/sales/accounts" element={
          <ProtectedRoute allowedRoles={['sales-rep']}>
            <SalesforceAccount />
          </ProtectedRoute>
        } />
        <Route path="/sales/my-plan" element={
          <ProtectedRoute allowedRoles={['sales-rep']}>
            <MyPlan />
          </ProtectedRoute>
        } />
        <Route path="/sales/recommendations" element={
          <ProtectedRoute allowedRoles={['sales-rep']}>
            <AIRecommendations />
          </ProtectedRoute>
        } />
        <Route path="/sales/action-confirmation" element={
          <ProtectedRoute allowedRoles={['sales-rep']}>
            <ActionConfirmation />
          </ProtectedRoute>
        } />
        <Route path="/sales/retrain-visualization" element={
          <ProtectedRoute allowedRoles={['sales-rep']}>
            <RetrainVisualization />
          </ProtectedRoute>
        } />
        
        {/* Sales Head Routes */}
        <Route path="/sales-head/dashboard" element={
          <ProtectedRoute allowedRoles={['sales-head']}>
            <SalesHeadDashboard />
          </ProtectedRoute>
        } />
        <Route path="/sales-head/accounts" element={
          <ProtectedRoute allowedRoles={['sales-head']}>
            <AccountsList />
          </ProtectedRoute>
        } />
        <Route path="/sales-head/organization-plan" element={
          <ProtectedRoute allowedRoles={['sales-head']}>
            <OrganizationPlan />
          </ProtectedRoute>
        } />
        <Route path="/sales-head/all-recommendations" element={
          <ProtectedRoute allowedRoles={['sales-head']}>
            <TeamRecommendations />
          </ProtectedRoute>
        } />
        <Route path="/sales-head/revenue-forecast" element={
          <ProtectedRoute allowedRoles={['sales-head']}>
            <SalesHeadDashboard />
          </ProtectedRoute>
        } />
        <Route path="/sales-head/pipeline-risk" element={
          <ProtectedRoute allowedRoles={['sales-head']}>
            <SalesHeadDashboard />
          </ProtectedRoute>
        } />
        <Route path="/sales-head/manager-analytics" element={
          <ProtectedRoute allowedRoles={['sales-head']}>
            <SalesHeadDashboard />
          </ProtectedRoute>
        } />
        <Route path="/sales-head/insights" element={
          <ProtectedRoute allowedRoles={['sales-head']}>
            <SalesHeadDashboard />
          </ProtectedRoute>
        } />
        <Route path="/sales-head/team-recommendations" element={
          <ProtectedRoute allowedRoles={['sales-head']}>
            <TeamRecommendations />
          </ProtectedRoute>
        } />
        
        {/* Sales Manager Routes */}
        <Route path="/sales-manager/dashboard" element={
          <ProtectedRoute allowedRoles={['sales-manager', 'sales-head']}>
            <SalesManagerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/sales-manager/team-activity" element={
          <ProtectedRoute allowedRoles={['sales-manager', 'sales-head']}>
            <TeamActivityPage />
          </ProtectedRoute>
        } />
        <Route path="/sales-manager/team-performance" element={
          <ProtectedRoute allowedRoles={['sales-manager', 'sales-head']}>
            <SalesManagerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/sales-manager/deal-risk" element={
          <ProtectedRoute allowedRoles={['sales-manager', 'sales-head']}>
            <SalesManagerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/sales-manager/coaching" element={
          <ProtectedRoute allowedRoles={['sales-manager', 'sales-head']}>
            <SalesManagerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/sales-manager/forecast" element={
          <ProtectedRoute allowedRoles={['sales-manager', 'sales-head']}>
            <SalesManagerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/sales-manager/team-plan" element={
          <ProtectedRoute allowedRoles={['sales-manager', 'sales-head']}>
            <TeamPlan />
          </ProtectedRoute>
        } />
        <Route path="/sales-manager/team-recommendations" element={
          <ProtectedRoute allowedRoles={['sales-manager', 'sales-head']}>
            <TeamRecommendations />
          </ProtectedRoute>
        } />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
