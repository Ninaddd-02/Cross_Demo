import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SidebarNavigation from '../../components/SidebarNavigation/SidebarNavigation';
import TopNavbar from '../../components/TopNavbar/TopNavbar';
import AIRecommendationCard from '../../components/AIRecommendationCard/AIRecommendationCard';
import GlassCard from '../../components/GlassCard/GlassCard';
import StatusBadge from '../../components/StatusBadge/StatusBadge';
import useRecommendationsStore from '../../stores/useRecommendationsStore';
import { onSyncEvent, SYNC_EVENTS } from '../../utils/syncManager';
import { Sparkles, TrendingUp, Filter } from 'lucide-react';
import { aiRecommendations as sharedAIRecommendations } from '../../data/sharedData';
import './AIRecommendations.css';

const AIRecommendations = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const {
    getRecommendationsByRep,
    acceptRecommendation,
    rejectRecommendation,
    initRecommendations
  } = useRecommendationsStore();

  // Real-time sync listener
  useEffect(() => {
    const cleanup = onSyncEvent((syncEvent) => {
      // Refresh when any recommendation event happens for this rep
      if (syncEvent.data.repId === currentUser?.repId) {
        console.log('📡 Recommendation updated in another tab - refreshing');
        setRefreshKey(prev => prev + 1);
      }
    });

    return cleanup;
  }, [currentUser?.repId]);

  // Initialize recommendations in store on mount
  useEffect(() => {
    const repId = currentUser?.repId || 1;
    // Use AI recommendations from shared data filtered by rep
    const repRecommendations = sharedAIRecommendations.filter(rec => rec.repId === repId);
    
    // Initialize these recommendations in the store
    if (repRecommendations.length > 0) {
      initRecommendations(repId, repRecommendations);
    }
  }, [currentUser?.repId, initRecommendations]);

  // Recommendations by industry
  const recommendationsByRep = {
    1: { // Rahul Sharma - Automotive OEM
      accountName: 'Tata Motors Ltd',
      topRecommendations: [
        {
          id: 1,
          type: 'cross-sell',
          title: 'EV Charging Infrastructure',
          description: 'Tata Motors Ltd shows growing EV fleet adoption patterns similar to manufacturers who benefit from integrated charging solutions.',
          confidence: 92,
          reason: 'Based on current EV production ramp-up and industry benchmarks, charging infrastructure would optimize operations.',
          product: 'Commercial EV Charging Network - 50 Units',
          estimatedValue: '₹68 Lakh/year',
          optionA: {
            title: 'Fast Charging Network (Primary)',
            product: 'Commercial EV Fast Charging - 50 Units',
            value: '₹68 Lakh/year',
            pros: ['Quick charging (80% in 30 min)', 'Higher customer satisfaction', 'Premium pricing'],
            cons: ['Higher upfront cost', 'Requires robust power infrastructure'],
            confidence: 92
          },
          optionB: {
            title: 'Solar-Integrated Charging (Alternative)',
            product: 'Solar-Powered EV Charging Hubs - 50 Units',
            value: '₹52 Lakh/year',
            pros: ['Lower operating costs', 'Sustainability goals alignment', 'Government incentives'],
            cons: ['Slower charging speed', 'Weather dependent', 'Higher maintenance'],
            confidence: 85
          }
        },
        {
          id: 2,
          type: 'upsell',
          title: 'Premium Fleet Maintenance Package',
          description: 'Upgrade to 24/7 comprehensive maintenance support for commercial vehicle fleet.',
          confidence: 87,
          reason: 'Recent vehicle downtime patterns indicate need for predictive maintenance and dedicated service management.',
          product: 'Premium Fleet Care Plus',
          estimatedValue: '₹36 Lakh/year',
          optionA: {
            title: '24/7 Premium Support (Primary)',
            product: 'Fleet Care Plus - Full Service',
            value: '₹36 Lakh/year',
            pros: ['Round-the-clock support', 'Predictive maintenance', '2-hour SLA'],
            cons: ['Higher cost', 'Requires dedicated team'],
            confidence: 87
          },
          optionB: {
            title: 'Business Hours Enhanced (Alternative)',
            product: 'Fleet Care Standard - Enhanced',
            value: '₹24 Lakh/year',
            pros: ['Cost effective', 'Covers business hours', 'On-call emergency'],
            cons: ['Limited night support', '4-hour SLA', 'Additional charges for emergencies'],
            confidence: 79
          }
        },
        {
          id: 3,
          type: 'cross-sell',
          title: 'Telematics & Fleet Monitoring',
          description: 'Industry trends in automotive sector make fleet telematics a strategic operational advantage.',
          confidence: 78,
          reason: 'Similar automotive manufacturers in their scale typically adopt telematics solutions for efficiency gains.',
          product: 'Advanced Fleet Telematics Suite',
          estimatedValue: '₹48 Lakh/year',
          optionA: {
            title: 'AI-Powered Telematics (Primary)',
            product: 'Advanced Fleet Telematics with AI',
            value: '₹48 Lakh/year',
            pros: ['Real-time analytics', 'Predictive insights', 'Driver behavior scoring'],
            cons: ['Complex implementation', 'Training required'],
            confidence: 78
          },
          optionB: {
            title: 'Basic GPS Tracking (Alternative)',
            product: 'Essential Fleet Tracking System',
            value: '₹28 Lakh/year',
            pros: ['Easy to implement', 'Lower cost', 'Proven technology'],
            cons: ['Limited analytics', 'No predictive features', 'Basic reporting'],
            confidence: 82
          }
        }
      ],
      moreRecommendations: [
        {
          id: 4,
          type: 'upsell',
          title: 'Advanced Vehicle Diagnostics System',
          description: 'Enhanced diagnostic capabilities to reduce vehicle downtime and improve quality control.',
          confidence: 72,
          reason: 'Growing production volume and quality requirements indicate need for enterprise-level diagnostic tools.',
          product: 'Diagnostic Pro Suite',
          estimatedValue: '₹28 Lakh/year'
        },
        {
          id: 5,
          type: 'cross-sell',
          title: 'Spare Parts Inventory Optimization',
          description: 'AI-powered inventory management to reduce costs and improve part availability.',
          confidence: 68,
          reason: 'Multiple stockout incidents in service records suggest need for predictive inventory platform.',
          product: 'Smart Parts Management System',
          estimatedValue: '₹42 Lakh/year'
        }
      ]
    },
    2: { // Priya Mehta - Manufacturing & Industrial
      accountName: 'Larsen & Toubro Ltd',
      topRecommendations: [
        {
          id: 1,
          type: 'cross-sell',
          title: 'Industrial IoT Sensors Network',
          description: 'L&T shows strong digitization initiatives similar to manufacturers who benefit from comprehensive IoT monitoring.',
          confidence: 91,
          reason: 'Based on current smart factory projects and Industry 4.0 adoption, IoT sensors would provide real-time production insights.',
          product: 'Industrial IoT Sensor Suite - 200 Units',
          estimatedValue: '₹85 Lakh/year',
          optionA: {
            title: 'Enterprise IoT Platform (Primary)',
            product: 'Complete IoT Monitoring - 200 Sensors',
            value: '₹85 Lakh/year',
            pros: ['Real-time monitoring', 'Predictive maintenance', 'Cloud dashboard'],
            cons: ['Higher investment', 'Network infrastructure needed'],
            confidence: 91
          },
          optionB: {
            title: 'Basic Monitoring (Alternative)',
            product: 'Essential IoT Starter Pack - 100 Sensors',
            value: '₹52 Lakh/year',
            pros: ['Lower cost', 'Quick deployment', 'Scalable'],
            cons: ['Limited features', 'Manual reporting', 'No predictive analytics'],
            confidence: 83
          }
        },
        {
          id: 2,
          type: 'upsell',
          title: 'Predictive Maintenance Platform',
          description: 'Upgrade to AI-powered predictive maintenance to minimize equipment downtime and optimize production.',
          confidence: 88,
          reason: 'Equipment failure patterns and maintenance costs indicate significant ROI from predictive analytics.',
          product: 'SmartMaintain Pro Edition',
          estimatedValue: '₹62 Lakh/year',
          optionA: {
            title: 'AI-Powered Prediction (Primary)',
            product: 'SmartMaintain Pro with ML',
            value: '₹62 Lakh/year',
            pros: ['99% accuracy', 'Prevents breakdowns', 'Cost optimization'],
            cons: ['Training period required', 'Data integration needed'],
            confidence: 88
          },
          optionB: {
            title: 'Rule-Based System (Alternative)',
            product: 'SmartMaintain Standard',
            value: '₹38 Lakh/year',
            pros: ['Immediate start', 'Lower cost', 'Proven methodology'],
            cons: ['85% accuracy', 'Manual rules', 'Limited learning'],
            confidence: 76
          }
        },
        {
          id: 3,
          type: 'cross-sell',
          title: 'Supply Chain Visibility Platform',
          description: 'Industry trends in manufacturing emphasize end-to-end supply chain transparency for efficiency.',
          confidence: 82,
          reason: 'Similar industrial companies achieve 15-20% cost reduction with real-time supply chain monitoring.',
          product: 'Supply Chain Command Center',
          estimatedValue: '₹55 Lakh/year',
          optionA: {
            title: 'Full Visibility Suite (Primary)',
            product: 'Complete Supply Chain Platform',
            value: '₹55 Lakh/year',
            pros: ['End-to-end tracking', 'Vendor integration', 'Risk alerts'],
            cons: ['Complex setup', 'Vendor onboarding time'],
            confidence: 82
          },
          optionB: {
            title: 'Core Tracking (Alternative)',
            product: 'Essential Supply Chain Tracker',
            value: '₹32 Lakh/year',
            pros: ['Quick setup', 'Core features', 'Lower cost'],
            cons: ['Limited vendors', 'Basic reporting', 'Manual updates'],
            confidence: 79
          }
        }
      ],
      moreRecommendations: [
        {
          id: 4,
          type: 'upsell',
          title: 'Energy Management System',
          description: 'Optimize energy consumption across manufacturing facilities with AI-driven insights.',
          confidence: 75,
          reason: 'Rising energy costs and sustainability goals make energy optimization a strategic priority.',
          product: 'SmartEnergy Industrial Suite',
          estimatedValue: '₹45 Lakh/year'
        },
        {
          id: 5,
          type: 'cross-sell',
          title: 'Quality Control Automation',
          description: 'Computer vision-based quality inspection to improve accuracy and reduce manual inspection time.',
          confidence: 71,
          reason: 'Quality metrics show opportunity for automation in repetitive inspection tasks.',
          product: 'Vision-QC Pro System',
          estimatedValue: '₹38 Lakh/year'
        }
      ]
    },
    3: { // Amit Kumar - Technology & IT Services
      accountName: 'Tata Consultancy Services',
      topRecommendations: [
        {
          id: 1,
          type: 'cross-sell',
          title: 'Multi-Cloud Management Platform',
          description: 'TCS shows growing multi-cloud infrastructure similar to enterprises who benefit from unified cloud management.',
          confidence: 89,
          reason: 'Based on current cloud adoption patterns, centralized multi-cloud management would optimize costs and operations.',
          product: 'CloudMaster Enterprise Suite',
          estimatedValue: '₹95 Lakh/year',
          optionA: {
            title: 'Full Multi-Cloud Suite (Primary)',
            product: 'CloudMaster Complete - All Clouds',
            value: '₹95 Lakh/year',
            pros: ['AWS, Azure, GCP support', 'Cost optimization', 'Unified dashboard'],
            cons: ['Higher investment', 'Learning curve'],
            confidence: 89
          },
          optionB: {
            title: 'Dual-Cloud Starter (Alternative)',
            product: 'CloudMaster Essentials - 2 Clouds',
            value: '₹58 Lakh/year',
            pros: ['Lower cost', 'Quick setup', 'Core features'],
            cons: ['Limited to 2 clouds', 'Basic analytics'],
            confidence: 81
          }
        },
        {
          id: 2,
          type: 'upsell',
          title: 'DevOps Automation Platform',
          description: 'Upgrade to enterprise DevOps platform with AI-powered CI/CD pipelines and automated testing.',
          confidence: 86,
          reason: 'Development velocity and deployment frequency patterns show strong ROI potential from DevOps automation.',
          product: 'DevOps Pro Enterprise',
          estimatedValue: '₹72 Lakh/year',
          optionA: {
            title: 'AI-Powered DevOps (Primary)',
            product: 'DevOps Pro with ML Testing',
            value: '₹72 Lakh/year',
            pros: ['Intelligent testing', 'Auto-rollback', 'Predictive insights'],
            cons: ['Complex setup', 'Team training needed'],
            confidence: 86
          },
          optionB: {
            title: 'Standard Automation (Alternative)',
            product: 'DevOps Standard Edition',
            value: '₹45 Lakh/year',
            pros: ['Quick implementation', 'Proven tools', 'Lower cost'],
            cons: ['Manual testing', 'Basic CI/CD', 'No AI features'],
            confidence: 78
          }
        },
        {
          id: 3,
          type: 'cross-sell',
          title: 'AI/ML Model Training Platform',
          description: 'Industry trends in IT services emphasize AI capabilities as competitive advantage.',
          confidence: 84,
          reason: 'Similar IT service companies accelerate AI project delivery by 40% with dedicated ML platforms.',
          product: 'ML Training Cloud Platform',
          estimatedValue: '₹68 Lakh/year',
          optionA: {
            title: 'Enterprise ML Platform (Primary)',
            product: 'Complete ML Training Suite',
            value: '₹68 Lakh/year',
            pros: ['GPU acceleration', 'AutoML', 'Model versioning'],
            cons: ['Higher cost', 'Requires ML expertise'],
            confidence: 84
          },
          optionB: {
            title: 'Basic Training (Alternative)',
            product: 'Starter ML Environment',
            value: '₹42 Lakh/year',
            pros: ['Lower cost', 'Easy start', 'Pre-built models'],
            cons: ['Limited GPU', 'Manual tuning', 'Basic features'],
            confidence: 76
          }
        }
      ],
      moreRecommendations: [
        {
          id: 4,
          type: 'upsell',
          title: 'Cybersecurity Operations Center',
          description: '24/7 SOC with AI-powered threat detection and response for enterprise security.',
          confidence: 80,
          reason: 'Growing security threats and compliance requirements make dedicated SOC essential.',
          product: 'SecureWatch 24/7 SOC',
          estimatedValue: '₹88 Lakh/year'
        },
        {
          id: 5,
          type: 'cross-sell',
          title: 'Container Orchestration Platform',
          description: 'Kubernetes-based platform for scalable microservices deployment and management.',
          confidence: 77,
          reason: 'Microservices adoption trends indicate strong fit for container orchestration.',
          product: 'K8s Enterprise Manager',
          estimatedValue: '₹52 Lakh/year'
        }
      ]
    },
    4: { // Neha Singh - Pharma & Healthcare
      accountName: 'Sun Pharmaceutical',
      topRecommendations: [
        {
          id: 1,
          type: 'cross-sell',
          title: 'Regulatory Compliance Management',
          description: 'Sun Pharma shows expanding global operations similar to pharmaceutical companies who benefit from automated compliance tracking.',
          confidence: 93,
          reason: 'Based on current regulatory requirements and audit patterns, compliance automation would reduce risk and costs.',
          product: 'PharmCompliance 360 Suite',
          estimatedValue: '₹78 Lakh/year',
          optionA: {
            title: 'Global Compliance Suite (Primary)',
            product: 'PharmCompliance Complete - All Regions',
            value: '₹78 Lakh/year',
            pros: ['FDA, EMA, CDSCO support', 'Auto-updates', 'Audit trails'],
            cons: ['Higher cost', 'Initial setup time'],
            confidence: 93
          },
          optionB: {
            title: 'Regional Compliance (Alternative)',
            product: 'PharmCompliance India Edition',
            value: '₹48 Lakh/year',
            pros: ['Lower cost', 'CDSCO focused', 'Quick start'],
            cons: ['India only', 'Manual global updates'],
            confidence: 85
          }
        },
        {
          id: 2,
          type: 'upsell',
          title: 'Clinical Trial Management Platform',
          description: 'Upgrade to comprehensive clinical trial management with real-time monitoring and data analytics.',
          confidence: 88,
          reason: 'Growing clinical trial portfolio and data complexity indicate strong ROI from dedicated CTMS platform.',
          product: 'TrialMaster Pro Enterprise',
          estimatedValue: '₹92 Lakh/year',
          optionA: {
            title: 'AI-Enhanced CTMS (Primary)',
            product: 'TrialMaster Pro with ML',
            value: '₹92 Lakh/year',
            pros: ['Predictive enrollment', 'Risk detection', 'Real-time insights'],
            cons: ['Complex setup', 'Training required'],
            confidence: 88
          },
          optionB: {
            title: 'Standard CTMS (Alternative)',
            product: 'TrialMaster Standard',
            value: '₹58 Lakh/year',
            pros: ['Proven system', 'Lower cost', 'Quick deployment'],
            cons: ['Manual processes', 'Basic reporting', 'No AI'],
            confidence: 79
          }
        },
        {
          id: 3,
          type: 'cross-sell',
          title: 'Pharma Supply Chain Tracking',
          description: 'Industry trends in pharmaceutical sector emphasize end-to-end supply chain visibility for compliance and safety.',
          confidence: 85,
          reason: 'Similar pharma companies achieve 25% reduction in counterfeit risk with blockchain-based tracking.',
          product: 'PharmaTrack Blockchain Suite',
          estimatedValue: '₹65 Lakh/year',
          optionA: {
            title: 'Blockchain Tracking (Primary)',
            product: 'PharmaTrack Complete - Blockchain',
            value: '₹65 Lakh/year',
            pros: ['Tamper-proof', 'Full traceability', 'Compliance ready'],
            cons: ['Higher cost', 'Vendor onboarding'],
            confidence: 85
          },
          optionB: {
            title: 'Basic Serialization (Alternative)',
            product: 'PharmaTrack Essentials',
            value: '₹38 Lakh/year',
            pros: ['Lower cost', 'Quick setup', 'Core tracking'],
            cons: ['No blockchain', 'Limited security', 'Manual verification'],
            confidence: 77
          }
        }
      ],
      moreRecommendations: [
        {
          id: 4,
          type: 'upsell',
          title: 'Pharmacovigilance System',
          description: 'AI-powered adverse event tracking and reporting for drug safety monitoring.',
          confidence: 82,
          reason: 'Regulatory requirements and patient safety priorities make advanced pharmacovigilance essential.',
          product: 'SafetyWatch AI Platform',
          estimatedValue: '₹58 Lakh/year'
        },
        {
          id: 5,
          type: 'cross-sell',
          title: 'Lab Information Management System',
          description: 'Comprehensive LIMS for quality control, R&D, and manufacturing labs.',
          confidence: 76,
          reason: 'Lab efficiency metrics show opportunity for automation and standardization.',
          product: 'LabMaster Enterprise LIMS',
          estimatedValue: '₹48 Lakh/year'
        }
      ]
    }
  };

  // Get recommendations based on current user's repId from shared data
  const currentRepId = currentUser?.repId || 1;
  const repRecommendations = sharedAIRecommendations.filter(rec => rec.repId === currentRepId);
  
  const topRecommendations = repRecommendations.slice(0, 3); // First 3 as top recommendations
  const moreRecommendations = repRecommendations.slice(3); // Rest as more recommendations
  
  // Get account name from first recommendation's company
  const accountName = repRecommendations.length > 0 ? repRecommendations[0].company : 'No Account';

  const allRecommendations = repRecommendations;

  // Calculate dynamic stats from actual recommendations
  const recommendationStats = useMemo(() => {
    const activeCount = allRecommendations.length;
    
    // Calculate total opportunity value
    const totalValue = allRecommendations.reduce((sum, rec) => {
      // Parse value from string like "₹68 Lakh/year" or "₹48 Lakh/year"
      if (rec.estimatedValue && typeof rec.estimatedValue === 'string') {
        const match = rec.estimatedValue.match(/₹?(\d+(?:\.\d+)?)\s*(?:Lakh|Cr)/i);
        if (match) {
          let value = parseFloat(match[1]);
          // Convert Lakh to Cr if needed
          if (rec.estimatedValue.toLowerCase().includes('lakh')) {
            value = value / 100; // Convert Lakh to Cr
          }
          return sum + value;
        }
      }
      return sum;
    }, 0);
    
    // Calculate average confidence
    const avgConfidence = activeCount > 0
      ? Math.round(allRecommendations.reduce((sum, rec) => sum + (rec.confidence || 0), 0) / activeCount)
      : 0;
    
    return {
      activeCount,
      totalValue: totalValue.toFixed(2),
      avgConfidence
    };
  }, [allRecommendations]);

  const handleAccept = (id) => {
    // Store the recommendation in Zustand store
    const rec = allRecommendations.find(r => r.id === id);
    if (rec) {
      acceptRecommendation(id, 'Accepted from AI Recommendations page');
      console.log('✅ Recommendation accepted and synced');
    }
    setSelectedRecommendation(id);
    navigate('/sales/action-confirmation');
  };

  const handleReject = (id) => {
    // Store the rejection in Zustand store
    const rec = allRecommendations.find(r => r.id === id);
    if (rec) {
      rejectRecommendation(id, 'Rejected from AI Recommendations page');
      console.log('❌ Recommendation rejected and synced');
    }
    navigate('/sales/feedback');
  };

  return (
    <div className="admin-layout">
      <SidebarNavigation role="sales" />
      <div className="admin-content">
        <TopNavbar 
          title="Product Recommendations" 
          subtitle={`Intelligent insights for ${accountName}`}
          user="Sales User"
        />
        
        <div className="page-body">
          <div className="recommendations-container">
            <GlassCard className="recommendations-header-card">
            <div className="reco-header-content">
              <div className="reco-icon">
                <Sparkles size={32} />
              </div>
              <div>
                <h2 className="reco-header-title">Product Recommendations</h2>
                <p className="reco-header-subtitle">
                  Cross Sync analyzed historical data, market trends, and account behavior to generate these personalized recommendations
                </p>
              </div>
            </div>
            <div className="reco-stats">
              <div className="reco-stat-item">
                <div className="stat-number">{recommendationStats.activeCount}</div>
                <div className="stat-text">Active Recommendations</div>
              </div>
              <div className="reco-stat-item">
                <div className="stat-number">₹{recommendationStats.totalValue} Cr</div>
                <div className="stat-text">Total Opportunity Value</div>
              </div>
              <div className="reco-stat-item">
                <div className="stat-number">{recommendationStats.avgConfidence}%</div>
                <div className="stat-text">Avg Confidence Score</div>
              </div>
            </div>
          </GlassCard>

          <div className="recommendations-controls">
            <div className="controls-left">
              <StatusBadge status="active" label="Real-time" icon={<TrendingUp size={14} />} />
              <span className="update-text">Last updated: 2 minutes ago</span>
            </div>
            <button className="filter-button">
              <Filter size={18} />
              Filter
            </button>
          </div>

          <div className="recommendations-section">
            <div className="section-header">
              <h3 className="section-title">Top 3 Recommendations</h3>
              <p className="section-subtitle">Highest confidence opportunities for {accountName}</p>
            </div>
            <div className="recommendations-grid">
              {topRecommendations.map((reco) => (
                <AIRecommendationCard
                  key={reco.id}
                  type={reco.type}
                  accountName={accountName}
                  title={reco.title}
                  description={reco.description}
                  confidence={reco.confidence}
                  reason={reco.reason}
                  product={reco.product}
                  estimatedValue={reco.estimatedValue}
                  optionA={reco.optionA}
                  optionB={reco.optionB}
                  onAccept={() => handleAccept(reco.id)}
                  onReject={() => handleReject(reco.id)}
                />
              ))}
            </div>
          </div>

          <div className="recommendations-section">
            <div className="section-header">
              <h3 className="section-title">More Recommendations</h3>
              <p className="section-subtitle">Additional opportunities for growth and optimization</p>
            </div>
            <div className="recommendations-grid">
              {moreRecommendations.map((reco) => (
                <AIRecommendationCard
                  key={reco.id}
                  type={reco.type}
                  accountName={accountName}
                  title={reco.title}
                  description={reco.description}
                  confidence={reco.confidence}
                  reason={reco.reason}
                  product={reco.product}
                  estimatedValue={reco.estimatedValue}
                  onAccept={() => handleAccept(reco.id)}
                  onReject={() => handleReject(reco.id)}
                />
              ))}
            </div>
          </div>

          <GlassCard className="how-it-works-card">
            <h3 className="how-title">How Cross Sync Generates Recommendations</h3>
            <div className="how-steps">
              <div className="how-step">
                <div className="step-num">1</div>
                <div>
                  <h4>Data Analysis</h4>
                  <p>Analyzes account history, product usage, and transaction patterns</p>
                </div>
              </div>
              <div className="how-step">
                <div className="step-num">2</div>
                <div>
                  <h4>Pattern Recognition</h4>
                  <p>ML engine identifies similarities with successful customer journeys</p>
                </div>
              </div>
              <div className="how-step">
                <div className="step-num">3</div>
                <div>
                  <h4>Confidence Scoring</h4>
                  <p>Each recommendation receives a confidence score based on multiple factors</p>
                </div>
              </div>
              <div className="how-step">
                <div className="step-num">4</div>
                <div>
                  <h4>Continuous Learning</h4>
                  <p>Feedback loops improve accuracy over time</p>
                </div>
              </div>
            </div>
          </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendations;
