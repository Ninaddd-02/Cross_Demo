import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarNavigation from '../../components/SidebarNavigation/SidebarNavigation';
import TopNavbar from '../../components/TopNavbar/TopNavbar';
import GlassCard from '../../components/GlassCard/GlassCard';
import GradientButton from '../../components/GradientButton/GradientButton';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import { ArrowRight, CheckCircle, XCircle, Zap } from 'lucide-react';
import logger from '../../utils/logger';
import './MapFields.css';

const MapFields = () => {
  const navigate = useNavigate();
  
  const [fieldMappings] = useState([
    { source: 'Account.Name', target: 'account_name', status: 'mapped', type: 'text', required: true },
    { source: 'Account.Industry', target: 'industry', status: 'mapped', type: 'text', required: true },
    { source: 'Account.AnnualRevenue', target: 'revenue', status: 'mapped', type: 'number', required: true },
    { source: 'Account.NumberOfEmployees', target: 'employee_count', status: 'mapped', type: 'number', required: false },
    { source: 'Opportunity.Amount', target: 'deal_value', status: 'mapped', type: 'number', required: true },
    { source: 'Opportunity.StageName', target: 'stage', status: 'mapped', type: 'text', required: true },
    { source: 'Opportunity.CloseDate', target: 'close_date', status: 'mapped', type: 'date', required: true },
    { source: 'Product2.Name', target: 'product_name', status: 'mapped', type: 'text', required: true },
    { source: 'Product2.ProductCode', target: 'product_id', status: 'unmapped', type: 'text', required: false },
    { source: 'Contact.Email', target: 'contact_email', status: 'mapped', type: 'email', required: false }
  ]);

  const handleAutoMap = () => {
    logger.info('Auto-mapping fields');
  };

  const handleSaveAndContinue = () => {
    navigate('/admin/train-model');
  };

  return (
    <div className="admin-layout">
      <SidebarNavigation role="admin" />
      <div className="admin-content">
        <TopNavbar 
          title="Field Mapping" 
          subtitle="Map source fields to Cross Sync canonical schema"
        />
        
        <div className="page-body">
          <div className="page-header-section">
            <div>
              <h2 className="page-section-title">Configure Field Mappings</h2>
              <p className="page-section-subtitle">
                Map your data fields to the engine's internal schema for optimal recommendations
              </p>
            </div>
            <GradientButton 
              variant="secondary" 
              icon={<Zap size={20} />}
              onClick={handleAutoMap}
            >
              Auto-Map Fields
            </GradientButton>
          </div>

          <GlassCard className="mapping-card">
            <div className="mapping-header">
              <div className="mapping-column-header">
                <h3>Source Field (CRM System)</h3>
                <StatusBadge status="success" label="10 Connected" size="small" />
              </div>
              <div className="mapping-arrow-header"></div>
              <div className="mapping-column-header">
                <h3>Target Schema (Cross Sync)</h3>
                <StatusBadge status="info" label="Canonical" size="small" />
              </div>
            </div>

            <div className="mapping-list">
              {fieldMappings.map((mapping, index) => (
                <div key={index} className={`mapping-row ${mapping.status}`}>
                  <div className="mapping-source">
                    <div className="field-info">
                      <span className="field-name">{mapping.source}</span>
                      <span className="field-type">{mapping.type}</span>
                    </div>
                    {mapping.required && (
                      <span className="required-badge">Required</span>
                    )}
                  </div>
                  
                  <div className="mapping-connector">
                    <ArrowRight 
                      size={20} 
                      className={mapping.status === 'mapped' ? 'connector-active' : 'connector-inactive'}
                    />
                  </div>
                  
                  <div className="mapping-target">
                    <div className="field-info">
                      <span className="field-name">{mapping.target}</span>
                      {mapping.status === 'mapped' ? (
                        <CheckCircle size={18} className="status-icon status-success" />
                      ) : (
                        <XCircle size={18} className="status-icon status-error" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="mapping-info-card">
            <h3 className="info-title">About Field Mapping</h3>
            <p className="info-text">
              Field mapping is a <strong>configuration layer</strong> that tells Cross Sync how to interpret your data. 
              The ML engine uses a canonical schema to ensure consistency across different data sources. 
              This mapping is <strong>not hardcoded</strong> — it's fully customizable for your business needs.
            </p>
            <div className="info-highlights">
              <div className="highlight-item">
                <CheckCircle size={20} className="highlight-icon" />
                <span>Flexible & Configurable</span>
              </div>
              <div className="highlight-item">
                <CheckCircle size={20} className="highlight-icon" />
                <span>Multi-Source Support</span>
              </div>
              <div className="highlight-item">
                <CheckCircle size={20} className="highlight-icon" />
                <span>Auto-Detection Available</span>
              </div>
            </div>
          </GlassCard>

          <div className="action-footer">
            <GradientButton 
              variant="secondary" 
              size="large"
              onClick={() => navigate('/admin/data-source')}
            >
              Back
            </GradientButton>
            <GradientButton 
              variant="primary" 
              size="large"
              onClick={handleSaveAndContinue}
            >
              Save & Continue to Training
            </GradientButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapFields;
