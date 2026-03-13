import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarNavigation from '../../components/SidebarNavigation/SidebarNavigation';
import TopNavbar from '../../components/TopNavbar/TopNavbar';
import GlassCard from '../../components/GlassCard/GlassCard';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import GradientButton from '../../components/GradientButton/GradientButton';
import { Database, Cloud, Server, FileText, CheckCircle, AlertCircle, Plus, Upload } from 'lucide-react';
import './ConnectDataSource.css';

const ConnectDataSource = () => {
  const navigate = useNavigate();
  
  const [csvFile, setCsvFile] = useState(null);
  const [csvConnected, setCsvConnected] = useState(false);
  const [csvRecords, setCsvRecords] = useState('0');
  const [lastSync, setLastSync] = useState('Never');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
    } else {
      alert('Please select a valid CSV file');
    }
  };

  const handleCsvConnect = () => {
    if (csvFile) {
      setCsvConnected(true);
      const randomRecords = Math.floor(Math.random() * 1000) + 100;
      setCsvRecords(randomRecords.toLocaleString());
      const now = new Date();
      setLastSync(now.toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }));
      alert(`CSV file "${csvFile.name}" uploaded successfully! ${randomRecords} records imported.`);
    } else {
      alert('Please select a CSV file first');
    }
  };
  
  const [dataSources] = useState([
    {
      id: 1,
      name: 'Salesforce',
      type: 'CRM',
      icon: <Cloud size={32} />,
      status: 'connected',
      description: 'Primary CRM for account and opportunity data',
      lastSync: '2 minutes ago',
      records: '125,430'
    },
    {
      id: 2,
      name: 'SAP ERP',
      type: 'ERP',
      icon: <Server size={32} />,
      status: 'connected',
      description: 'Financial and transaction history',
      lastSync: '1 hour ago',
      records: '89,234'
    },
    {
      id: 3,
      name: 'PostgreSQL',
      type: 'Database',
      icon: <Database size={32} />,
      status: 'inactive',
      description: 'Custom product catalog database',
      lastSync: 'Never',
      records: '0'
    },

  ]);

  const handleConnect = (sourceId) => {
    console.log('Connecting source:', sourceId);
    // Navigate to field mapping after connection
    navigate('/admin/map-fields');
  };

  return (
    <div className="admin-layout">
      <SidebarNavigation role="admin" />
      <div className="admin-content">
        <TopNavbar 
          title="Connect Data Sources" 
          subtitle="Configure data ingestion from CRM, ERP, and custom sources"
        />
        
        <div className="page-body">
          <div className="page-header-section">
            <div>
              <h2 className="page-section-title">Available Data Sources</h2>
              <p className="page-section-subtitle">
                Cross Sync integrates with multiple systems via secure API connections
              </p>
            </div>
            <GradientButton 
              variant="primary" 
              icon={<Plus size={20} />}
              onClick={() => console.log('Add custom source')}
            >
              Add Custom Source
            </GradientButton>
          </div>

          <div className="data-sources-grid">
            {dataSources.map((source) => (
              <GlassCard key={source.id} className="data-source-card">
                <div className="source-header">
                  <div className={`source-icon source-icon-${source.status}`}>
                    {source.icon}
                  </div>
                  <StatusBadge 
                    status={source.status === 'connected' ? 'success' : 'inactive'} 
                    label={source.status === 'connected' ? 'Connected' : 'Not Connected'}
                    icon={source.status === 'connected' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                  />
                </div>

                <h3 className="source-name">{source.name}</h3>
                <div className="source-type">{source.type}</div>
                <p className="source-description">{source.description}</p>

                <div className="source-stats">
                  <div className="stat-item">
                    <span className="stat-label">Last Sync</span>
                    <span className="stat-value">{source.lastSync}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Records</span>
                    <span className="stat-value">{source.records}</span>
                  </div>
                </div>

                <div className="source-actions">
                  {source.status === 'connected' ? (
                    <>
                      <GradientButton 
                        variant="secondary" 
                        size="small"
                        fullWidth
                      >
                        Configure
                      </GradientButton>
                      <GradientButton 
                        variant="primary" 
                        size="small"
                        onClick={() => handleConnect(source.id)}
                      >
                        Sync Now
                      </GradientButton>
                    </>
                  ) : (
                    <GradientButton 
                      variant="primary" 
                      size="small"
                      fullWidth
                      onClick={() => handleConnect(source.id)}
                    >
                      Connect
                    </GradientButton>
                  )}
                </div>
              </GlassCard>
            ))}

            <GlassCard className="data-source-card csv-upload-source-card">
              <div className="source-header">
                <div className={`source-icon source-icon-${csvConnected ? 'connected' : 'inactive'}`}>
                  <FileText size={32} />
                </div>
                <StatusBadge 
                  status={csvConnected ? 'success' : 'inactive'} 
                  label={csvConnected ? 'Connected' : 'Not Connected'}
                  icon={csvConnected ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                />
              </div>

              <h3 className="source-name">CSV Upload</h3>
              <div className="source-type">File</div>
              <p className="source-description">Manual data import via CSV files</p>

              <div className="csv-upload-area">
                <label htmlFor="csv-file-input" className="file-input-label">
                  <Upload size={18} />
                  <span>{csvFile ? csvFile.name : 'File'}</span>
                </label>
                <input
                  id="csv-file-input"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="file-input-hidden"
                />
              </div>

              <div className="source-stats">
                <div className="stat-item">
                  <span className="stat-label">Last Sync</span>
                  <span className="stat-value">{lastSync}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Records</span>
                  <span className="stat-value">{csvRecords}</span>
                </div>
              </div>

              <div className="source-actions">
                <GradientButton 
                  variant="primary" 
                  size="small"
                  fullWidth
                  onClick={handleCsvConnect}
                >
                  Connect
                </GradientButton>
              </div>
            </GlassCard>
          </div>

          <GlassCard className="integration-info-card">
            <h3 className="info-card-title">How Data Integration Works</h3>
            <div className="info-steps">
              <div className="info-step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Connect Source</h4>
                  <p>Establish secure API connection to your data source</p>
                </div>
              </div>
              <div className="info-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>Map Fields</h4>
                  <p>Configure field mappings to Cross Sync's canonical schema</p>
                </div>
              </div>
              <div className="info-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>Sync Data</h4>
                  <p>Data flows automatically into the ML engine for processing</p>
                </div>
              </div>
              <div className="info-step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h4>Train & Deploy</h4>
                  <p>Model learns from your data and generates recommendations</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default ConnectDataSource;
