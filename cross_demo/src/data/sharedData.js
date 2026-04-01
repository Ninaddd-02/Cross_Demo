// Shared data across Sales Rep, Sales Manager, and Sales Head dashboards
// This creates a connected real-time demo experience
//
// =============================================================================
// DATA SOURCES (JSON-Based)
// =============================================================================
// 
// PRIMARY: tenant_data.json (Tenant: P2SCSJ91BR52L8U)
// - 3 Accounts: ACCELYA, ADANI GREEN ENERGY, ADANI WILMAR
// - 9 AI Recommendations
// - Real KPIs: Revenue ₹1,017.85 Cr, 79 days velocity, 18.1% renewal rate
//
// ALTERNATIVE: tenant_data_2.json (Tenant: 3DNYQNWGZEGT6PD) 
// - 20 Accounts: Various tech companies
// - 56 AI Recommendations
// - Real KPIs: Revenue ₹1,540.57 Cr, 103 days velocity, 36% renewal rate
// - Available for multi-tenant or expanded demo scenarios
//
// =============================================================================
// ORGANIZATIONAL HIERARCHY
// =============================================================================
//
// SALES HEAD / VP (Reports to: CEO)
//   ↓
// MANAGER: Rajesh Kumar - ALL REGIONS
//   ↓
// Rep: Rahul Sharma - ALL REGIONS (North, South, East, West)
//
// =============================================================================
// DATA ACCESS RULES:
// - Sales Head: Can view ALL data across all managers and reps
// - Manager: Can view data of assigned representative
// - Sales Rep: Can view their own data across all regions
// =============================================================================
// DATA FLOW: Rep Activities → Manager Dashboard → Head Regional View
// All KPIs, recommendations, and accounts are sourced from JSON tenant data
// =============================================================================

// Import tenant data from JSON file
import tenantData from './tenant_P2SCSJ91BR52L8U.json';

// Function to get current tenant ID from localStorage (set during login)
export const getTenantId = () => {
  return localStorage.getItem('tenantId') || 'P2SCSJ91BR52L8U'; // Default to first tenant
};

// Function to get tenant info dynamically based on stored tenant ID
export const getTenantInfo = () => {
  // Using P2SCSJ91BR52L8U as single source of truth
  return tenantData.tenant['P2SCSJ91BR52L8U'];
};

// DO NOT create static tenantInfo - always call getTenantInfo() for fresh data

// Sales Reps in the system
export const salesReps = [
  {
    id: 1,
    name: 'Rahul Sharma',
    email: 'rahul.sharma@company.com',
    region: 'All Regions',
    manager: 'Rajesh Kumar',
    managerId: 1,
    avatar: '👤'
  }
];

// Sales Managers in the system
export const salesManagers = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    region: 'All Regions',
    teamSize: 1,
    teamMembers: [1], // Rep IDs
    email: 'rajesh.kumar@company.com'
  }
];

// All deals in the system (Sales Rep level)
// ========================================
// DEPRECATED: Old hardcoded deals array
// ========================================
// This array is no longer used in the tenant-based architecture.
// All data now comes from tenant JSON files (tenant_*.json).
// Kept for backward compatibility only - do not use in new code.
// REAL DATA from data_tenant1.xlsx (199 deals)
// Generated on 2026-03-13 11:09:07
// Distribution: North (Rep 1), South (Rep 2), East+Central (Rep 3), West (Rep 4)
export const allDeals = [
  {
    id: 1,
    name: 'ERD - Embedded Systems',
    company: 'ADANI WILMAR LIMITED',
    value: 9.35,
    valueFormatted: '₹9.35 Cr',
    stage: 'Negotiation',
    closeDate: 'Aug 23, 2024',
    daysToClose: 0,
    repId: 1,
    repName: 'Rahul Sharma',
    region: 'North',
    manager: 'Rajesh Kumar',
    status: 'high-risk',
    margin: 28.9,
    industry: 'Solvent Extraction',
    sector: 'Edible Oil',
    technology: 'BMC TrueSight (Infrastructure Management)',
    partner: 'BMC',
    engagementScore: 57,
    stakeholders: 2
  },
  {
    id: 2,
    name: 'Infra - Workplace Services',
    company: 'ADANI WILMAR LIMITED',
    value: 8.95,
    valueFormatted: '₹8.95 Cr',
    stage: 'Proposal',
    closeDate: 'Jan 30, 2022',
    daysToClose: 0,
    repId: 1,
    repName: 'Rahul Sharma',
    region: 'North',
    manager: 'Rajesh Kumar',
    status: 'critical',
    margin: 11.33,
    industry: 'Solvent Extraction',
    sector: 'Edible Oil',
    technology: 'Dell EMC',
    partner: 'Dell Technologies',
    engagementScore: 56,
    stakeholders: 3
  },
  {
    id: 3,
    name: 'Consulting - AI Management',
    company: 'ACCELYA SOLUTIONS INDIA LIMITED',
    value: 8.34,
    valueFormatted: '₹8.34 Cr',
    stage: 'Proposal',
    closeDate: 'Apr 16, 2022',
    daysToClose: 0,
    repId: 1,
    repName: 'Rahul Sharma',
    region: 'North',
    manager: 'Rajesh Kumar',
    status: 'critical',
    margin: 14.5,
    industry: 'Computers - Software - Medium / Small',
    sector: 'IT - Software',
    technology: 'Zoho CRM (Customer Relationship Management)',
    partner: 'Zoho',
    engagementScore: 63,
    stakeholders: 4
  },
  {
    id: 4,
    name: 'Digital - Data Engineering',
    company: 'ADANI GREEN ENERGY LIMITED',
    value: 8.08,
    valueFormatted: '₹8.08 Cr',
    stage: 'Negotiation',
    closeDate: 'Feb 12, 2022',
    daysToClose: 0,
    repId: 1,
    repName: 'Rahul Sharma',
    region: 'North',
    manager: 'Rajesh Kumar',
    status: 'at-risk',
    margin: 15.37,
    industry: 'Power Generation And Supply',
    sector: 'Power Generation & Distribution',
    technology: 'Cisco Prime Infrastructure (Network Management)',
    partner: 'Cisco',
    engagementScore: 68,
    stakeholders: 2
  },
  {
    id: 5,
    name: 'Digital - Automation',
    company: 'ACCELYA SOLUTIONS INDIA LIMITED',
    value: 7.74,
    valueFormatted: '₹7.74 Cr',
    stage: 'Negotiation',
    closeDate: 'Sep 05, 2020',
    daysToClose: 0,
    repId: 1,
    repName: 'Rahul Sharma',
    region: 'North',
    manager: 'Rajesh Kumar',
    status: 'at-risk',
    margin: 16.32,
    industry: 'Computers - Software - Medium / Small',
    sector: 'IT - Software',
    technology: 'Samanage (now part of SolarWinds)',
    partner: 'Samanage',
    engagementScore: 64,
    stakeholders: 1
  },
  {
    id: 6,
    name: 'ERD - Engg OS Services',
    company: 'ADANI GREEN ENERGY LIMITED',
    value: 7.68,
    valueFormatted: '₹7.68 Cr',
    stage: 'Negotiation',
    closeDate: 'Jan 04, 2022',
    daysToClose: 0,
    repId: 1,
    repName: 'Rahul Sharma',
    region: 'North',
    manager: 'Rajesh Kumar',
    status: 'at-risk',
    margin: 24.46,
    industry: 'Power Generation And Supply',
    sector: 'Power Generation & Distribution',
    technology: 'Unity (VR and Metaverse Development Platform)',
    partner: 'Unity',
    engagementScore: 75,
    stakeholders: 1
  },
  {
    id: 7,
    name: 'Consulting - Enterprise Planning',
    company: 'ADANI GREEN ENERGY LIMITED',
    value: 7.4,
    valueFormatted: '₹7.4 Cr',
    stage: 'Proposal',
    closeDate: 'Jan 08, 2022',
    daysToClose: 0,
    repId: 1,
    repName: 'Rahul Sharma',
    region: 'North',
    manager: 'Rajesh Kumar',
    status: 'critical',
    margin: 14.51,
    industry: 'Power Generation And Supply',
    sector: 'Power Generation & Distribution',
    technology: 'Geometric PLM Solutions',
    partner: 'Geometric Limited',
    engagementScore: 95,
    stakeholders: 4
  },
  {
    id: 8,
    name: 'Consulting - Compliance',
    company: 'ACCELYA SOLUTIONS INDIA LIMITED',
    value: 7.39,
    valueFormatted: '₹7.39 Cr',
    stage: 'Negotiation',
    closeDate: 'Dec 04, 2021',
    daysToClose: 0,
    repId: 1,
    repName: 'Rahul Sharma',
    region: 'North',
    manager: 'Rajesh Kumar',
    status: 'critical',
    margin: 8.08,
    industry: 'Computers - Software - Medium / Small',
    sector: 'IT - Software',
    technology: 'R',
    partner: 'Open Source',
    engagementScore: 81,
    stakeholders: 3
  },
  {
    id: 9,
    name: 'CSD - Apps Development',
    company: 'ACCELYA SOLUTIONS INDIA LIMITED',
    value: 7.23,
    valueFormatted: '₹7.23 Cr',
    stage: 'Negotiation',
    closeDate: 'Jan 24, 2020',
    daysToClose: 0,
    repId: 1,
    repName: 'Rahul Sharma',
    region: 'North',
    manager: 'Rajesh Kumar',
    status: 'at-risk',
    margin: 19.92,
    industry: 'Computers - Software - Medium / Small',
    sector: 'IT - Software',
    technology: 'SNL Service Management',
    partner: 'SNL',
    engagementScore: 63,
    stakeholders: 1
  },
  {
    id: 10,
    name: 'Consulting - AI Management',
    company: 'ADANI WILMAR LIMITED',
    value: 7.03,
    valueFormatted: '₹7.03 Cr',
    stage: 'Negotiation',
    closeDate: 'May 21, 2021',
    daysToClose: 0,
    repId: 1,
    repName: 'Rahul Sharma',
    region: 'North',
    manager: 'Rajesh Kumar',
    status: 'high-risk',
    margin: 30.92,
    industry: 'Solvent Extraction',
    sector: 'Edible Oil',
    technology: 'Connected Care Solutions',
    partner: 'Philips Healthcare',
    engagementScore: 53,
    stakeholders: 2
  },
  {
    id: 11,
    name: 'Consulting - Compliance',
    company: 'ACCELYA SOLUTIONS INDIA LIMITED',
    value: 7.03,
    valueFormatted: '₹7.03 Cr',
    stage: 'Negotiation',
    closeDate: 'Oct 31, 2023',
    daysToClose: 0,
    repId: 1,
    repName: 'Rahul Sharma',
    region: 'North',
    manager: 'Rajesh Kumar',
    status: 'at-risk',
    margin: 17.95,
    industry: 'Computers - Software - Medium / Small',
    sector: 'IT - Software',
    technology: 'Gusto (HR, Payroll, and Benefits Management)',
    partner: 'Gusto',
    engagementScore: 88,
    stakeholders: 3
  },
  {
    id: 12,
    name: 'Digital - Data Engineering',
    company: 'ADANI GREEN ENERGY LIMITED',
    value: 6.86,
    valueFormatted: '₹6.86 Cr',
    stage: 'Proposal',
    closeDate: 'Feb 25, 2023',
    daysToClose: 0,
    repId: 1,
    repName: 'Rahul Sharma',
    region: 'North',
    manager: 'Rajesh Kumar',
    status: 'at-risk',
    margin: 17.05,
    industry: 'Power Generation And Supply',
    sector: 'Power Generation & Distribution',
    technology: 'Boomi',
    partner: 'Dell Technologies',
    engagementScore: 52,
    stakeholders: 1
  },
  {
    id: 13,
    name: 'PBS - Customization',
    company: 'ADANI GREEN ENERGY LIMITED',
    value: 8.38,
    valueFormatted: '₹8.38 Cr',
    stage: 'Negotiation',
    closeDate: 'Feb 18, 2020',
    daysToClose: 0,
    repId: 1,
    repName: 'Rahul Sharma',
    region: 'South',
    manager: 'Rajesh Kumar',
    status: 'high-risk',
    margin: 30.19,
    industry: 'Power Generation And Supply',
    sector: 'Power Generation & Distribution',
    technology: 'Cypress',
    partner: 'Cypress.io',
    engagementScore: 85,
    stakeholders: 3
  },
  {
    id: 14,
    name: 'PBS - Migrations',
    company: 'ADANI WILMAR LIMITED',
    value: 8.3,
    valueFormatted: '₹8.3 Cr',
    stage: 'Negotiation',
    closeDate: 'Mar 21, 2021',
    daysToClose: 0,
    repId: 1,
    repName: 'Rahul Sharma',
    region: 'South',
    manager: 'Rajesh Kumar',
    status: 'high-risk',
    margin: 26.6,
    industry: 'Solvent Extraction',
    sector: 'Edible Oil',
    technology: 'ServiceNow IT Service Management',
    partner: 'ServiceNow',
    engagementScore: 92,
    stakeholders: 3
  },
  {
    id: 15,
    name: 'Digital - Automation',
    company: 'ADANI GREEN ENERGY LIMITED',
    value: 8.23,
    valueFormatted: '₹8.23 Cr',
    stage: 'Proposal',
    closeDate: 'Aug 16, 2022',
    daysToClose: 0,
    repId: 1,
    repName: 'Rahul Sharma',
    region: 'South',
    manager: 'Rajesh Kumar',
    status: 'at-risk',
    margin: 19.15,
    industry: 'Power Generation And Supply',
    sector: 'Power Generation & Distribution',
    technology: 'Lansweeper IT Asset Management',
    partner: 'Lansweeper',
    engagementScore: 84,
    stakeholders: 5
  },
  {
    id: 16,
    name: 'CSD - DevOps',
    company: 'ACCELYA SOLUTIONS INDIA LIMITED',
    value: 8.15,
    valueFormatted: '₹8.15 Cr',
    stage: 'Negotiation',
    closeDate: 'Dec 22, 2023',
    daysToClose: 0,
    repId: 1,
    repName: 'Rahul Sharma',
    region: 'South',
    manager: 'Rajesh Kumar',
    status: 'critical',
    margin: 14.52,
    industry: 'Computers - Software - Medium / Small',
    sector: 'IT - Software',
    technology: 'Rust',
    partner: 'Open Source',
    engagementScore: 72,
    stakeholders: 4
  },
  {
    id: 17,
    name: 'PBS - Migrations',
    company: 'ACCELYA SOLUTIONS INDIA LIMITED',
    value: 7.39,
    valueFormatted: '₹7.39 Cr',
    stage: 'Negotiation',
    closeDate: 'Jul 09, 2023',
    daysToClose: 0,
    repId: 1,
    repName: 'Rahul Sharma',
    region: 'South',
    manager: 'Rajesh Kumar',
    status: 'at-risk',
    margin: 23.21,
    industry: 'Computers - Software - Medium / Small',
    sector: 'IT - Software',
    technology: 'Apache Cordova (Cross-Platform Mobile Framework)',
    partner: 'Apache Cordova',
    engagementScore: 53,
    stakeholders: 3
  },
  {
    id: 18,
    name: 'Digital - Data Engineering',
    company: 'ACCELYA SOLUTIONS INDIA LIMITED',
    value: 7.36,
    valueFormatted: '₹7.36 Cr',
    stage: 'Negotiation',
    closeDate: 'Feb 09, 2023',
    daysToClose: 0,
    repId: 1,
    repName: 'Rahul Sharma',
    region: 'South',
    manager: 'Rajesh Kumar',
    status: 'at-risk',
    margin: 17.9,
    industry: 'Computers - Software - Medium / Small',
    sector: 'IT - Software',
    technology: 'Flutter (UI Toolkit by Google)',
    partner: 'Flutter',
    engagementScore: 56,
    stakeholders: 5
  },
  {
    id: 19,
    name: 'Infra - Workplace Services',
    company: 'ADANI GREEN ENERGY LIMITED',
    value: 7.35,
    valueFormatted: '₹7.35 Cr',
    stage: 'Negotiation',
    closeDate: 'Sep 09, 2020',
    daysToClose: 0,
    repId: 1,
    repName: 'Rahul Sharma',
    region: 'South',
    manager: 'Rajesh Kumar',
    status: 'at-risk',
    margin: 18.79,
    industry: 'Power Generation And Supply',
    sector: 'Power Generation & Distribution',
    technology: 'Google Cloud Console (Cloud Management)',
    partner: 'Google Cloud Console',
    engagementScore: 57,
    stakeholders: 3
  },
  {
    id: 20,
    name: 'CySec - CySec-Architecture',
    company: 'ADANI GREEN ENERGY LIMITED',
    value: 6.95,
    valueFormatted: '₹6.95 Cr',
    stage: 'Negotiation',
    closeDate: 'Nov 11, 2023',
    daysToClose: 0,
    repId: 1,
    repName: 'Rahul Sharma',
    region: 'South',
    manager: 'Rajesh Kumar',
    status: 'at-risk',
    margin: 20.58,
    industry: 'Power Generation And Supply',
    sector: 'Power Generation & Distribution',
    technology: 'Urban Planning',
    partner: 'AECOM',
    engagementScore: 60,
    stakeholders: 3
  },
  {
    id: 21,
    name: 'Digital - Data Engineering',
    company: 'ADANI GREEN ENERGY LIMITED',
    value: 6.94,
    valueFormatted: '₹6.94 Cr',
    stage: 'Negotiation',
    closeDate: 'Dec 27, 2020',
    daysToClose: 0,
    repId: 1,
    repName: 'Rahul Sharma',
    region: 'South',
    manager: 'Rajesh Kumar',
    status: 'high-risk',
    margin: 34.88,
    industry: 'Power Generation And Supply',
    sector: 'Power Generation & Distribution',
    technology: 'SPSS',
    partner: 'IBM',
    engagementScore: 83,
    stakeholders: 3
  },
  {
    id: 22,
    name: 'ERD - Smart Services',
    company: 'ACCELYA SOLUTIONS INDIA LIMITED',
    value: 6.82,
    valueFormatted: '₹6.82 Cr',
    stage: 'Proposal',
    closeDate: 'Mar 21, 2024',
    daysToClose: 0,
    repId: 1,
    repName: 'Rahul Sharma',
    region: 'South',
    manager: 'Rajesh Kumar',
    status: 'high-risk',
    margin: 36.91,
    industry: 'Computers - Software - Medium / Small',
    sector: 'IT - Software',
    technology: 'AlienVault OSSIM (Open Source Security Information Management)',
    partner: 'AlienVault',
    engagementScore: 85,
    stakeholders: 5
  },
  {
    id: 23,
    name: 'ERD - Smart Services',
    company: 'ADANI GREEN ENERGY LIMITED',
    value: 6.51,
    valueFormatted: '₹6.51 Cr',
    stage: 'Negotiation',
    closeDate: 'Apr 06, 2020',
    daysToClose: 0,
    repId: 1,
    repName: 'Rahul Sharma',
    region: 'South',
    manager: 'Rajesh Kumar',
    status: 'at-risk',
    margin: 23.24,
    industry: 'Power Generation And Supply',
    sector: 'Power Generation & Distribution',
    technology: 'BMC Remedy IT Service Management',
    partner: 'Remedy',
    engagementScore: 88,
    stakeholders: 4
  },
  {
    id: 24,
    name: 'ERD - Embedded Systems',
    company: 'ADANI WILMAR LIMITED',
    value: 6.34,
    valueFormatted: '₹6.34 Cr',
    stage: 'Negotiation',
    closeDate: 'Sep 29, 2020',
    daysToClose: 0,
    repId: 1,
    repName: 'Rahul Sharma',
    region: 'South',
    manager: 'Rajesh Kumar',
    status: 'high-risk',
    margin: 29.82,
    industry: 'Solvent Extraction',
    sector: 'Edible Oil',
    technology: 'Aras Innovator',
    partner: 'Aras',
    engagementScore: 87,
    stakeholders: 4
  },
  {
    id: 25,
    name: 'Digital - Data Engineering',
    company: 'ACCELYA SOLUTIONS INDIA LIMITED',
    value: 7.64,
    valueFormatted: '₹7.64 Cr',
    stage: 'Negotiation',
    closeDate: 'Oct 07, 2022',
    daysToClose: 0,
    repId: 1,
    repName: 'Rahul Sharma',
    region: 'East',
    manager: 'Rajesh Kumar',
    status: 'at-risk',
    margin: 24.32,
    industry: 'Computers - Software - Medium / Small',
    sector: 'IT - Software',
    technology: 'Urban Planning',
    partner: 'Arcadis',
    engagementScore: 56,
    stakeholders: 5
  },
  {
    id: 26,
    name: 'Digital - Data Management',
    company: 'ADANI GREEN ENERGY LIMITED',
    value: 6.52,
    valueFormatted: '₹6.52 Cr',
    stage: 'Negotiation',
    closeDate: 'Apr 26, 2023',
    daysToClose: 0,
    repId: 1,
    repName: 'Rahul Sharma',
    region: 'East',
    manager: 'Rajesh Kumar',
    status: 'high-risk',
    margin: 37.75,
    industry: 'Power Generation And Supply',
    sector: 'Power Generation & Distribution',
    technology: 'SAP BW',
    partner: 'SAP',
    engagementScore: 71,
    stakeholders: 5
  },
  {
    id: 27,
    name: 'Digital - AI & Analytics',
    company: 'ADANI WILMAR LIMITED',
    value: 6.37,
    valueFormatted: '₹6.37 Cr',
    stage: 'Negotiation',
    closeDate: 'Dec 28, 2020',
    daysToClose: 0,
    repId: 1,
    repName: 'Rahul Sharma',
    region: 'East',
    manager: 'Rajesh Kumar',
    status: 'at-risk',
    margin: 15.11,
    industry: 'Solvent Extraction',
    sector: 'Edible Oil',
    technology: 'Autodesk Fusion 360',
    partner: 'Autodesk',
    engagementScore: 68,
    stakeholders: 3
  },
  {
    id: 28,
    name: 'ERD - PLM Services',
    company: 'ADANI GREEN ENERGY LIMITED',
    value: 5.78,
    valueFormatted: '₹5.78 Cr',
    stage: 'Negotiation',
    closeDate: 'Mar 19, 2024',
    daysToClose: 0,
    repId: 1,
    repName: 'Rahul Sharma',
    region: 'East',
    manager: 'Rajesh Kumar',
    status: 'critical',
    margin: 9.22,
    industry: 'Power Generation And Supply',
    sector: 'Power Generation & Distribution',
    technology: 'Propel PLM',
    partner: 'Propel',
    engagementScore: 95,
    stakeholders: 1
  },
  {
    id: 29,
    name: 'Consulting - CRM',
    company: 'ADANI WILMAR LIMITED',
    value: 5.68,
    valueFormatted: '₹5.68 Cr',
    stage: 'Negotiation',
    closeDate: 'Nov 04, 2020',
    daysToClose: 0,
    repId: 1,
    repName: 'Rahul Sharma',
    region: 'East',
    manager: 'Rajesh Kumar',
    status: 'high-risk',
    margin: 25.39,
    industry: 'Solvent Extraction',
    sector: 'Edible Oil',
    technology: 'Varjo XR-3 (High-Resolution VR Headset)',
    partner: 'Varjo',
    engagementScore: 95,
    stakeholders: 5
  },
  {
    id: 30,
    name: 'PBS - Maintenance',
    company: 'ADANI WILMAR LIMITED',
    value: 4.58,
    valueFormatted: '₹4.58 Cr',
    stage: 'Negotiation',
    closeDate: 'Apr 02, 2021',
    daysToClose: 0,
    repId: 1,
    repName: 'Rahul Sharma',
    region: 'East',
    manager: 'Rajesh Kumar',
    status: 'at-risk',
    margin: 16.37,
    industry: 'Solvent Extraction',
    sector: 'Edible Oil',
    technology: 'HPE SimpliVity',
    partner: 'Hewlett Packard',
    engagementScore: 91,
    stakeholders: 1
  },
  {
    id: 31,
    name: 'Digital - Data Engineering',
    company: 'ADANI GREEN ENERGY LIMITED',
    value: 4.1,
    valueFormatted: '₹4.1 Cr',
    stage: 'Negotiation',
    closeDate: 'Sep 11, 2022',
    daysToClose: 0,
    repId: 1,
    repName: 'Rahul Sharma',
    region: 'East',
    manager: 'Rajesh Kumar',
    status: 'at-risk',
    margin: 23.41,
    industry: 'Power Generation And Supply',
    sector: 'Power Generation & Distribution',
    technology: 'Engineering Procurement',
    partner: 'Fluor Corporation',
    engagementScore: 78,
    stakeholders: 5
  },
  {
    id: 32,
    name: 'Consulting - Customer Experince',
    company: 'ADANI WILMAR LIMITED',
    value: 1.95,
    valueFormatted: '₹1.95 Cr',
    stage: 'Proposal',
    closeDate: 'Sep 06, 2023',
    daysToClose: 0,
    repId: 1,
    repName: 'Rahul Sharma',
    region: 'East',
    manager: 'Rajesh Kumar',
    status: 'high-risk',
    margin: 33.8,
    industry: 'Solvent Extraction',
    sector: 'Edible Oil',
    technology: 'Oculus Rift, Horizon Workrooms',
    partner: 'Meta',
    engagementScore: 68,
    stakeholders: 4
  },
  {
    id: 33,
    name: 'QET - Test Env & Data Serv',
    company: 'ADANI GREEN ENERGY LIMITED',
    value: 7.09,
    valueFormatted: '₹7.09 Cr',
    stage: 'Negotiation',
    closeDate: 'Aug 01, 2024',
    daysToClose: 0,
    repId: 1,
    repName: 'Rahul Sharma',
    region: 'East',
    manager: 'Rajesh Kumar',
    status: 'high-risk',
    margin: 34.58,
    industry: 'Power Generation And Supply',
    sector: 'Power Generation & Distribution',
    technology: 'Water Resources Management',
    partner: 'AECOM',
    engagementScore: 68,
    stakeholders: 1
  },
  {
    id: 34,
    name: 'Consulting - Supply Chain',
    company: 'ADANI GREEN ENERGY LIMITED',
    value: 6.83,
    valueFormatted: '₹6.83 Cr',
    stage: 'Negotiation',
    closeDate: 'Sep 25, 2024',
    daysToClose: 0,
    repId: 1,
    repName: 'Rahul Sharma',
    region: 'East',
    manager: 'Rajesh Kumar',
    status: 'high-risk',
    margin: 36.12,
    industry: 'Power Generation And Supply',
    sector: 'Power Generation & Distribution',
    technology: 'Ahrefs',
    partner: 'Ahrefs',
    engagementScore: 78,
    stakeholders: 4
  },
  {
    id: 35,
    name: 'Infra - Workplace Services',
    company: 'ACCELYA SOLUTIONS INDIA LIMITED',
    value: 6.46,
    valueFormatted: '₹6.46 Cr',
    stage: 'Negotiation',
    closeDate: 'Jun 24, 2023',
    daysToClose: 0,
    repId: 1,
    repName: 'Rahul Sharma',
    region: 'East',
    manager: 'Rajesh Kumar',
    status: 'high-risk',
    margin: 30.91,
    industry: 'Computers - Software - Medium / Small',
    sector: 'IT - Software',
    technology: 'Xamarin (Microsoft Cross-Platform Tool)',
    partner: 'Xamarin',
    engagementScore: 94,
    stakeholders: 1
  },
  {
    id: 36,
    name: 'Digital - Automation',
    company: 'ADANI GREEN ENERGY LIMITED',
    value: 6.44,
    valueFormatted: '₹6.44 Cr',
    stage: 'Negotiation',
    closeDate: 'May 23, 2021',
    daysToClose: 0,
    repId: 1,
    repName: 'Rahul Sharma',
    region: 'East',
    manager: 'Rajesh Kumar',
    status: 'high-risk',
    margin: 39.53,
    industry: 'Power Generation And Supply',
    sector: 'Power Generation & Distribution',
    technology: 'Nimble (Social CRM)',
    partner: 'Nimble',
    engagementScore: 83,
    stakeholders: 4
  },
  {
    id: 37,
    name: 'CSD - Apps Management',
    company: 'ADANI GREEN ENERGY LIMITED',
    value: 8.19,
    valueFormatted: '₹8.19 Cr',
    stage: 'Negotiation',
    closeDate: 'May 04, 2024',
    daysToClose: 0,
    repId: 1,
    repName: 'Rahul Sharma',
    region: 'West',
    manager: 'Rajesh Kumar',
    status: 'at-risk',
    margin: 23.69,
    industry: 'Power Generation And Supply',
    sector: 'Power Generation & Distribution',
    technology: 'Dassault Systèmes 3DEXPERIENCE',
    partner: '3DEXPERIENCE',
    engagementScore: 79,
    stakeholders: 1
  },
  {
    id: 38,
    name: 'CySec - CySec-Architecture',
    company: 'ADANI GREEN ENERGY LIMITED',
    value: 8.17,
    valueFormatted: '₹8.17 Cr',
    stage: 'Negotiation',
    closeDate: 'Nov 14, 2023',
    daysToClose: 0,
    repId: 1,
    repName: 'Rahul Sharma',
    region: 'West',
    manager: 'Rajesh Kumar',
    status: 'high-risk',
    margin: 29.93,
    industry: 'Power Generation And Supply',
    sector: 'Power Generation & Distribution',
    technology: 'Falcon (Endpoint Protection)',
    partner: 'CrowdStrike',
    engagementScore: 53,
    stakeholders: 3
  },
  {
    id: 39,
    name: 'Consulting - Enterprise Planning',
    company: 'ACCELYA SOLUTIONS INDIA LIMITED',
    value: 8.15,
    valueFormatted: '₹8.15 Cr',
    stage: 'Negotiation',
    closeDate: 'Dec 25, 2022',
    daysToClose: 0,
    repId: 1,
    repName: 'Rahul Sharma',
    region: 'West',
    manager: 'Rajesh Kumar',
    status: 'at-risk',
    margin: 17.8,
    industry: 'Computers - Software - Medium / Small',
    sector: 'IT - Software',
    technology: 'CloudBolt (Hybrid Cloud Management)',
    partner: 'CloudBolt',
    engagementScore: 57,
    stakeholders: 4
  },
  {
    id: 40,
    name: 'Digital - Data Architecture',
    company: 'ADANI GREEN ENERGY LIMITED',
    value: 8.12,
    valueFormatted: '₹8.12 Cr',
    stage: 'Negotiation',
    closeDate: 'Nov 11, 2020',
    daysToClose: 0,
    repId: 1,
    repName: 'Rahul Sharma',
    region: 'West',
    manager: 'Rajesh Kumar',
    status: 'critical',
    margin: 13.26,
    industry: 'Power Generation And Supply',
    sector: 'Power Generation & Distribution',
    technology: 'Intel Xeon',
    partner: 'Intel',
    engagementScore: 73,
    stakeholders: 3
  },
  {
    id: 41,
    name: 'Digital - Data Management',
    company: 'ACCELYA SOLUTIONS INDIA LIMITED',
    value: 7.88,
    valueFormatted: '₹7.88 Cr',
    stage: 'Negotiation',
    closeDate: 'Feb 18, 2024',
    daysToClose: 0,
    repId: 1,
    repName: 'Rahul Sharma',
    region: 'West',
    manager: 'Rajesh Kumar',
    status: 'at-risk',
    margin: 21.73,
    industry: 'Computers - Software - Medium / Small',
    sector: 'IT - Software',
    technology: 'Toast POS (Restaurant Management)',
    partner: 'Toast',
    engagementScore: 82,
    stakeholders: 2
  },
  {
    id: 42,
    name: 'ERD - Embedded Systems',
    company: 'ADANI GREEN ENERGY LIMITED',
    value: 7.71,
    valueFormatted: '₹7.71 Cr',
    stage: 'Negotiation',
    closeDate: 'Sep 25, 2023',
    daysToClose: 0,
    repId: 1,
    repName: 'Rahul Sharma',
    region: 'West',
    manager: 'Rajesh Kumar',
    status: 'high-risk',
    margin: 38.55,
    industry: 'Power Generation And Supply',
    sector: 'Power Generation & Distribution',
    technology: 'AppDynamics (Cloud APM)',
    partner: 'AppDynamics',
    engagementScore: 51,
    stakeholders: 5
  },
  {
    id: 43,
    name: 'CSD - DevOps',
    company: 'ADANI GREEN ENERGY LIMITED',
    value: 7.59,
    valueFormatted: '₹7.59 Cr',
    stage: 'Negotiation',
    closeDate: 'Nov 24, 2020',
    daysToClose: 0,
    repId: 1,
    repName: 'Rahul Sharma',
    region: 'West',
    manager: 'Rajesh Kumar',
    status: 'high-risk',
    margin: 30.37,
    industry: 'Power Generation And Supply',
    sector: 'Power Generation & Distribution',
    technology: 'Life Sciences Equipment',
    partner: 'GE Healthcare',
    engagementScore: 72,
    stakeholders: 2
  },
  {
    id: 44,
    name: 'Consulting - Customer Experince',
    company: 'ADANI GREEN ENERGY LIMITED',
    value: 7.55,
    valueFormatted: '₹7.55 Cr',
    stage: 'Negotiation',
    closeDate: 'Nov 07, 2021',
    daysToClose: 0,
    repId: 1,
    repName: 'Rahul Sharma',
    region: 'West',
    manager: 'Rajesh Kumar',
    status: 'high-risk',
    margin: 29.25,
    industry: 'Power Generation And Supply',
    sector: 'Power Generation & Distribution',
    technology: 'Project Management',
    partner: 'SNC-Lavalin',
    engagementScore: 53,
    stakeholders: 5
  },
  {
    id: 45,
    name: 'Digital - Data Management',
    company: 'ADANI WILMAR LIMITED',
    value: 7.51,
    valueFormatted: '₹7.51 Cr',
    stage: 'Negotiation',
    closeDate: 'Apr 13, 2021',
    daysToClose: 0,
    repId: 1,
    repName: 'Rahul Sharma',
    region: 'West',
    manager: 'Rajesh Kumar',
    status: 'high-risk',
    margin: 38.17,
    industry: 'Solvent Extraction',
    sector: 'Edible Oil',
    technology: 'Nimble (Social CRM)',
    partner: 'Nimble',
    engagementScore: 69,
    stakeholders: 1
  },
  {
    id: 46,
    name: 'Consulting - Enterprise Planning',
    company: 'ACCELYA SOLUTIONS INDIA LIMITED',
    value: 7.33,
    valueFormatted: '₹7.33 Cr',
    stage: 'Proposal',
    closeDate: 'Jul 19, 2024',
    daysToClose: 0,
    repId: 1,
    repName: 'Rahul Sharma',
    region: 'West',
    manager: 'Rajesh Kumar',
    status: 'high-risk',
    margin: 32.69,
    industry: 'Computers - Software - Medium / Small',
    sector: 'IT - Software',
    technology: 'C#',
    partner: 'Open Source',
    engagementScore: 83,
    stakeholders: 4
  },
  {
    id: 47,
    name: 'Infra - Estate & CMDB',
    company: 'ADANI GREEN ENERGY LIMITED',
    value: 7.21,
    valueFormatted: '₹7.21 Cr',
    stage: 'Proposal',
    closeDate: 'Feb 12, 2023',
    daysToClose: 0,
    repId: 1,
    repName: 'Rahul Sharma',
    region: 'West',
    manager: 'Rajesh Kumar',
    status: 'at-risk',
    margin: 15.79,
    industry: 'Power Generation And Supply',
    sector: 'Power Generation & Distribution',
    technology: 'HPE OneView',
    partner: 'Hewlett Packard',
    engagementScore: 62,
    stakeholders: 1
  },
  {
    id: 48,
    name: 'Digital - Data Management',
    company: 'ACCELYA SOLUTIONS INDIA LIMITED',
    value: 7.09,
    valueFormatted: '₹7.09 Cr',
    stage: 'Negotiation',
    closeDate: 'May 30, 2024',
    daysToClose: 0,
    repId: 1,
    repName: 'Rahul Sharma',
    region: 'West',
    manager: 'Rajesh Kumar',
    status: 'critical',
    margin: 8.59,
    industry: 'Computers - Software - Medium / Small',
    sector: 'IT - Software',
    technology: 'WordPress',
    partner: 'WordPress',
    engagementScore: 64,
    stakeholders: 4
  }
];

// Calculate pipeline and performance metrics by rep];

// Calculate pipeline and performance metrics by rep
export const getRepMetrics = (repId) => {
  const repDeals = allDeals.filter(deal => deal.repId === repId);
  const totalPipeline = repDeals.reduce((sum, deal) => sum + deal.value, 0);
  const highRiskDeals = repDeals.filter(deal => deal.status === 'high-risk' || deal.status === 'critical');
  const avgEngagement = repDeals.reduce((sum, deal) => sum + (deal.engagementScore || 50), 0) / repDeals.length;
  const avgStakeholders = repDeals.reduce((sum, deal) => sum + (deal.stakeholders || 1), 0) / repDeals.length;
  
  return {
    activeDeals: repDeals.length,
    pipeline: `₹${totalPipeline.toFixed(1)} Cr`,
    pipelineValue: totalPipeline,
    highRiskCount: highRiskDeals.length,
    avgEngagement: Math.round(avgEngagement),
    avgStakeholders: avgStakeholders.toFixed(1)
  };
};

// Rep performance data for Sales Manager dashboard
// Dynamic Rep Performance Calculation - Computed from actual deals
export const calculateRepPerformance = (repId) => {
  const rep = salesReps.find(r => r.id === repId);
  if (!rep) return null;

  // Get all deals for this rep
  const repDeals = allDeals.filter(d => d.repId === repId);
  const activeDeals = repDeals.length;

  if (activeDeals === 0) {
    return {
      id: repId,
      name: rep.name,
      conversion: 0,
      dealVelocity: 0,
      winPattern: ['No active deals to analyze'],
      coachingNeeded: ['Increase prospecting activity'],
      actions: ['Schedule pipeline review'],
      avatar: '👤'
    };
  }

  // Calculate conversion rate (Negotiation stage deals as % of total)
  const advancedDeals = repDeals.filter(d => d.stage === 'Negotiation').length;
  const conversion = Math.round((advancedDeals / activeDeals) * 100);

  // Calculate deal velocity (average engagement score as proxy for momentum)
  const avgEngagement = Math.round(
    repDeals.reduce((sum, d) => sum + (d.engagementScore || 50), 0) / activeDeals
  );
  const dealVelocity = avgEngagement;

  // Analyze win patterns
  const winPattern = [];
  const avgStakeholders = repDeals.reduce((sum, d) => sum + (d.stakeholders || 0), 0) / activeDeals;
  const highEngagementDeals = repDeals.filter(d => d.engagementScore >= 65).length;
  const highMarginDeals = repDeals.filter(d => d.margin >= 20).length;
  
  if (avgStakeholders >= 3) {
    winPattern.push(`Strong multi-threading with average ${Math.round(avgStakeholders)} stakeholders`);
  } else {
    winPattern.push(`Building stakeholder engagement (avg ${Math.round(avgStakeholders)} per deal)`);
  }
  
  if (highEngagementDeals > activeDeals * 0.4) {
    winPattern.push(`High engagement in ${Math.round((highEngagementDeals/activeDeals)*100)}% of deals`);
  }
  
  if (highMarginDeals > 0) {
    winPattern.push(`Maintaining healthy margins on ${highMarginDeals} deal${highMarginDeals > 1 ? 's' : ''}`);
  }

  // Identify coaching needs
  const coachingNeeded = [];
  const criticalDeals = repDeals.filter(d => d.status === 'critical').length;
  const highRiskDeals = repDeals.filter(d => d.status === 'high-risk').length;
  const atRiskDeals = repDeals.filter(d => d.status === 'at-risk').length;
  const lowMarginDeals = repDeals.filter(d => d.margin < 15).length;
  const lowEngagementDeals = repDeals.filter(d => d.engagementScore < 60).length;
  
  if (criticalDeals > 0) {
    coachingNeeded.push(`${criticalDeals} critical deal${criticalDeals > 1 ? 's' : ''} need immediate attention`);
  }
  
  if (highRiskDeals + atRiskDeals > activeDeals * 0.3) {
    coachingNeeded.push(`High percentage of at-risk deals (${highRiskDeals + atRiskDeals} of ${activeDeals})`);
  }
  
  if (lowMarginDeals > activeDeals * 0.4) {
    coachingNeeded.push(`Focus on value selling - ${lowMarginDeals} deals below margin target`);
  }
  
  if (lowEngagementDeals > activeDeals * 0.3) {
    coachingNeeded.push(`Improve engagement strategy on ${lowEngagementDeals} deals`);
  }
  
  if (avgStakeholders < 2.5) {
    coachingNeeded.push('Expand stakeholder engagement across deals');
  }
  
  if (coachingNeeded.length === 0) {
    coachingNeeded.push('Strong performance across all metrics');
  }

  // Generate actions based on real deals
  const actions = [];
  
  // Find most urgent deal (critical > high-risk > at-risk)
  const urgentDeal = repDeals.find(d => d.status === 'critical') ||
                     repDeals.find(d => d.status === 'high-risk') ||
                     repDeals.find(d => d.status === 'at-risk');
  
  if (urgentDeal) {
    actions.push(`Join call: ${urgentDeal.company} - ${urgentDeal.name} (${urgentDeal.status})`);
  }
  
  // Add coaching action based on primary need
  if (criticalDeals > 0) {
    actions.push('Conduct deal rescue strategy session');
  } else if (lowEngagementDeals > 2) {
    actions.push('Coach on stakeholder mapping and engagement strategy');
  } else if (lowMarginDeals > 2) {
    actions.push('Review pricing and value positioning approach');
  } else {
    actions.push('Continue current strategy - monitor progress');
  }
  
  if (actions.length === 0) {
    actions.push('Schedule regular progress review');
  }

  return {
    id: repId,
    name: rep.name,
    conversion,
    dealVelocity,
    winPattern,
    coachingNeeded,
    actions,
    avatar: '👤'
  };
};

// Generate rep performance data dynamically for all reps
export const repPerformanceData = salesReps.map(rep => calculateRepPerformance(rep.id)).filter(Boolean);

// Calculate regional metrics for Sales Head dashboard
export const getRegionalMetrics = (region) => {
  const regionalDeals = allDeals.filter(deal => deal.region === region);
  const totalPipeline = regionalDeals.reduce((sum, deal) => sum + deal.value, 0);
  const atRiskDeals = regionalDeals.filter(deal => 
    deal.status === 'high-risk' || deal.status === 'critical' || deal.status === 'at-risk'
  );
  const riskValue = atRiskDeals.reduce((sum, deal) => sum + deal.value, 0);
  
  return {
    pipeline: `₹${totalPipeline.toFixed(0)} Cr`,
    pipelineValue: totalPipeline,
    risk: `₹${riskValue.toFixed(0)} Cr`,
    riskValue: riskValue,
    riskPercent: ((riskValue / totalPipeline) * 100).toFixed(1),
    deals: regionalDeals.length,
    status: riskValue / totalPipeline > 0.15 ? 'warning' : 'success'
  };
};

// Manager performance data for Sales Head dashboard
export const managerPerformanceData = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    region: 'North',
    teamSize: 2,
    conversion: 72,
    dealVelocity: 38,
    coachingScore: 94,
    closed: '₹12 Cr'
  },
  {
    id: 2,
    name: 'Priya Sharma',
    region: 'South',
    teamSize: 2,
    conversion: 68,
    dealVelocity: 45,
    coachingScore: 88,
    closed: '₹15 Cr'
  }
];

// Get high-risk deals for Sales Manager dashboard
export const getHighRiskDeals = () => {
  return allDeals
    .filter(deal => deal.status === 'high-risk' || deal.status === 'critical')
    .slice(0, 3)
    .map(deal => ({
      id: deal.id,
      name: deal.name,
      value: deal.valueFormatted,
      rep: deal.repName,
      risks: deal.risks || [],
      daysToClose: deal.daysToClose,
      action: getActionForDeal(deal),
      actionTaken: false
    }));
};

// Get action recommendation for a deal based on its risks
const getActionForDeal = (deal) => {
  if (deal.risks) {
    const hasSponsorIssue = deal.risks.some(r => r.type === 'sponsor');
    const isStalled = deal.risks.some(r => r.type === 'stalled');
    const hasCompetitor = deal.risks.some(r => r.type === 'competitor');
    const isUrgent = deal.daysToClose <= 5;
    
    if (isUrgent && hasSponsorIssue) {
      return 'Schedule immediate executive alignment call - deal closing soon';
    }
    if (hasSponsorIssue) {
      return 'Schedule executive alignment call - connect with VP Operations';
    }
    if (isStalled) {
      return 'Escalate to senior management - deal requires intervention';
    }
    if (hasCompetitor) {
      return 'Prepare competitive differentiation document and ROI justification';
    }
  }
  return 'Review deal progress and provide coaching';
};

// Intervention queue data for Sales Manager - Generated from real deals
export const interventionQueueData = (() => {
  const criticalDeals = allDeals.filter(d => d.status === 'critical' || d.status === 'high-risk');
  return criticalDeals.slice(0, 4).map((deal, index) => {
    const issues = {
      'critical': `Critical status - only ${deal.stakeholders} stakeholder${deal.stakeholders > 1 ? 's' : ''} engaged`,
      'high-risk': `High-risk deal with ${deal.engagementScore}% engagement score`
    };
    const actions = {
      'critical': 'Join next call for critical deal recovery',
      'high-risk': 'Coach on stakeholder mapping strategy'
    };
    const recommendations = {
      'critical': 'Schedule immediate executive alignment',
      'high-risk': 'Review stakeholder map this week'
    };
    
    return {
      id: index + 1,
      priority: deal.status === 'critical' ? 'urgent' : 'high',
      action: actions[deal.status] || 'Review deal progress',
      deal: `${deal.company} - ${deal.name}`,
      dealValue: deal.valueFormatted,
      issue: issues[deal.status] || `Deal requires attention`,
      recommendation: recommendations[deal.status] || 'Provide coaching support',
      daysOpen: Math.floor(Math.random() * 5),
      status: 'pending',
      repId: deal.repId
    };
  });
})();

// Forecast alert data for Sales Manager - Calculated from real deals
export const forecastAlertData = (() => {
  const totalPipeline = allDeals.reduce((sum, d) => sum + d.value, 0);
  const target = totalPipeline * 1.15; // 15% above current
  const gap = target - totalPipeline;
  const gapPercent = ((gap / target) * 100).toFixed(1);
  
  const proposalDeals = allDeals.filter(d => d.stage === 'Proposal');
  const negotiationDeals = allDeals.filter(d => d.stage === 'Negotiation');
  const atRiskDeals = allDeals.filter(d => d.status === 'at-risk' || d.status === 'high-risk' || d.status === 'critical').length;
  
  // Generate actions from real deals
  const topDeals = allDeals.sort((a, b) => b.value - a.value).slice(0, 3);
  const actions = topDeals.map(deal => 
    `Accelerate ${deal.company} ${deal.name} (${deal.valueFormatted}) to close`
  );
  
  return {
    current: `₹${totalPipeline.toFixed(2)} Cr`,
    target: `₹${target.toFixed(2)} Cr`,
    gap: `₹${gap.toFixed(2)} Cr`,
    gapPercent: parseFloat(gapPercent),
    confidence: 73,
    riskLevel: gapPercent > 15 ? 'high' : gapPercent > 10 ? 'medium' : 'low',
    toCloseGap: actions,
    atRiskDeals,
    commitDeals: negotiationDeals.length
  };
})();

// Strategic KPIs for Sales Head dashboard
// ========================================
// DEPRECATED: Old strategic KPIs calculator
// ========================================
// This function is no longer used. Use calculateHeadKPIs() instead.
// Uses the old allDeals array instead of tenant JSON data.
export const calculateStrategicKPIs = () => {
  // Format currency in Crores
  const formatCrores = (value) => {
    const crores = value / 10000000;
    return `₹${crores.toFixed(2)} Cr`;
  };

  // Calculate metrics from actual deals
  const totalRevenue = allDeals.reduce((sum, deal) => sum + (deal.value * 10000000), 0);
  const revenueAtRisk = allDeals
    .filter(d => d.status === 'critical' || d.status === 'high-risk' || d.status === 'at-risk')
    .reduce((sum, d) => sum + (d.value * 10000000), 0);
  
  // Calculate average deal velocity from engagement scores
  const avgEngagement = allDeals.reduce((sum, d) => sum + (d.engagementScore || 50), 0) / allDeals.length;
  const avgDealVelocity = Math.round(avgEngagement * 0.5);
  
  // Calculate average margin
  const avgMargin = (allDeals.reduce((sum, d) => sum + (d.margin || 0), 0) / allDeals.length).toFixed(1);
  
  // Calculate revenue by region from actual deals
  const revenueByRegion = {};
  allDeals.forEach(deal => {
    const region = deal.region || 'Other';
    if (!revenueByRegion[region]) {
      revenueByRegion[region] = 0;
    }
    revenueByRegion[region] += deal.value * 10000000;
  });

  // Calculate total pipeline and risk percentage
  const riskPercentage = ((revenueAtRisk / totalRevenue) * 100).toFixed(1);

  // Calculate total regional revenue
  const regionalTotal = Object.values(revenueByRegion).reduce((sum, val) => sum + val, 0);
  
  // Calculate average contribution
  const avgContribution = totalRevenue / allDeals.length;
  
  return {
    totalRevenue: formatCrores(totalRevenue),
    totalRevenueRaw: totalRevenue,
    revenueAtRisk: formatCrores(revenueAtRisk),
    revenueAtRiskRaw: revenueAtRisk,
    riskPercentage: riskPercentage,
    avgDealVelocity,
    avgMargin,
    avgContribution: formatCrores(avgContribution),
    revenueByRegion: Object.fromEntries(
      Object.entries(revenueByRegion).map(([region, value]) => [region, formatCrores(value)])
    ),
    revenueByRegionRaw: revenueByRegion,
    regionalTotal: formatCrores(regionalTotal),
    totalDeals: allDeals.length,
    atRiskCount: allDeals.filter(deal => 
      deal.status === 'high-risk' || deal.status === 'critical' || deal.status === 'at-risk'
    ).length
  };
};

// Calculate Sales Manager KPIs
export const calculateManagerKPIs = () => {
  // Get real KPIs from JSON backend data - dynamically from current tenant
  const currentTenantInfo = getTenantInfo();
  const kpiData = currentTenantInfo.KPI.SalesManager;
  const headKPI = currentTenantInfo.KPI.SalesHead;
  
  // Format currency in Crores
  const formatCrores = (value) => {
    const crores = value / 10000000;
    return `₹${crores.toFixed(2)} Cr`;
  };

  // NEW FORMAT ONLY - TeamCrossSellConversionRate, TeamUpsellConversionRate, etc.
  const totalRevenue = headKPI.CrossSellRevenue + headKPI.UpsellRevenue;
  
  return {
    totalRevenue: formatCrores(totalRevenue),
    totalRevenueRaw: totalRevenue,
    avgDealVelocity: Math.round(kpiData.RecommendationToWinCycleTimeDays),
    avgDealVelocityDays: kpiData.RecommendationToWinCycleTimeDays,
    revenueAtRisk: formatCrores(totalRevenue * 0.15),
    revenueAtRiskRaw: totalRevenue * 0.15,
    topServiceLine: headKPI.TopCrossSellService,
    topTechnology: headKPI.TopUpsellService,
    topRegion: headKPI.TopRegionByRecommendationRevenue,
    avgSalesCycle: Math.round(kpiData.RecommendationToWinCycleTimeDays),
    crossUpsellRate: ((kpiData.TeamCrossSellConversionRate + kpiData.TeamUpsellConversionRate) / 2).toFixed(1),
    topProduct: {
      name: headKPI.TopCrossSellService,
      revenue: formatCrores(totalRevenue * 0.3)
    },
    topSalesRep: kpiData.TopSalesRepByRecommendationRevenue,
    topRepByConversion: kpiData.TopSalesRepByRecommendationConversionRate
  };
};

// Calculate Sales Head KPIs
export const calculateHeadKPIs = () => {
  // Get real KPIs from JSON backend data - dynamically from current tenant
  const currentTenantInfo = getTenantInfo();
  const kpiData = currentTenantInfo.KPI.SalesHead;
  
  // Format currency in Crores
  const formatCrores = (value) => {
    const crores = value / 10000000;
    return `₹${crores.toFixed(2)} Cr`;
  };

  // NEW FORMAT ONLY - CrossSellRevenue + UpsellRevenue based KPIs
  const totalRevenue = kpiData.CrossSellRevenue + kpiData.UpsellRevenue;
  const revenueAtRisk = totalRevenue * 0.046; // 4.6% as shown in UI
  
  return {
    // Revenue metrics
    totalRevenue: formatCrores(totalRevenue),
    totalRevenueRaw: totalRevenue,
    crossSellRevenue: formatCrores(kpiData.CrossSellRevenue),
    crossSellRevenueRaw: kpiData.CrossSellRevenue,
    upsellRevenue: formatCrores(kpiData.UpsellRevenue),
    upsellRevenueRaw: kpiData.UpsellRevenue,
    
    // Service/Region insights
    topCrossSellService: kpiData.TopCrossSellService,
    topUpsellService: kpiData.TopUpsellService,
    topRegion: kpiData.TopRegionByRecommendationRevenue,
    
    // Calculated/default metrics for UI compatibility
    avgDealVelocity: 79,
    avgDealVelocityDays: 79,
    revenueAtRisk: formatCrores(revenueAtRisk),
    revenueAtRiskRaw: revenueAtRisk,
    renewalRevenueShare: '39.6',
    renewalRevenueSharePct: 39.6,
    avgMargin: '23.9',
    avgMarginPct: 23.9,
    avgContributionMargin: '₹1.22 Cr',
    avgContributionMarginRaw: 12200000
  };
};

// Calculate Sales Rep KPIs
export const calculateRepKPIs = () => {
  // Real KPIs from JSON backend data - get current tenant dynamically
  const currentTenantInfo = getTenantInfo();
  const kpiData = currentTenantInfo.KPI.SalesRep;
  const recommendations = currentTenantInfo.recommendations || [];
  
  // Format currency in Crores
  const formatCrores = (value) => {
    const crores = value / 10000000;
    return `₹${crores.toFixed(2)} Cr`;
  };

  // NEW FORMAT ONLY - RecommendationConversionRate, CrossSellWins, UpsellWins
  const avgRecommendationValue = 50000000; // ₹5 Cr per win
  const totalWins = kpiData.CrossSellWins + kpiData.UpsellWins;
  const estimatedRevenue = totalWins * avgRecommendationValue;
  
  // Calculate rates
  const crossSellRecommendations = recommendations.filter(r => r.RecommendationType === 'CROSS-SELL').length || 1;
  const upsellRecommendations = recommendations.filter(r => r.RecommendationType === 'UPSELL' || r.RecommendationType === 'UP-SELL').length || 1;
  const crossSellRate = (kpiData.CrossSellWins / crossSellRecommendations * 100).toFixed(1);
  const upsellRate = (kpiData.UpsellWins / upsellRecommendations * 100).toFixed(1);
  
  return {
    avgDealVelocity: 75, // Default estimate
    revenueAtRisk: formatCrores(estimatedRevenue * 0.15),
    revenueAtRiskRaw: estimatedRevenue * 0.15,
    dealsClosed: totalWins,
    avgDealSize: formatCrores(avgRecommendationValue),
    avgDealSizeRaw: avgRecommendationValue,
    renewalRate: kpiData.RecommendationConversionRate.toFixed(1),
    crossSellRenewalRate: crossSellRate,
    upSellRenewalRate: upsellRate,
    crossSellWins: kpiData.CrossSellWins,
    upsellWins: kpiData.UpsellWins,
    crossSellPotential: formatCrores(kpiData.CrossSellWins * avgRecommendationValue * 0.3),
    crossSellPotentialRaw: kpiData.CrossSellWins * avgRecommendationValue * 0.3,
    upsellPotential: formatCrores(kpiData.UpsellWins * avgRecommendationValue * 0.3),
    upsellPotentialRaw: kpiData.UpsellWins * avgRecommendationValue * 0.3,
    totalExpansionPotential: formatCrores(totalWins * avgRecommendationValue * 0.3),
    totalRevenue: formatCrores(estimatedRevenue),
    totalRevenueRaw: estimatedRevenue,
    avgProjectDuration: 90, // Default estimate
    totalUsers: totalWins * 5, // Estimate
    topRecommendedAccount: kpiData.TopRecommendedAccount
  };
};

// Pattern insights for Sales Head dashboard
export const patternInsights = [
  {
    title: 'Multi-Stakeholder Advantage',
    insight: 'Deals with 4+ stakeholders close 28% faster',
    impact: 'High',
    recommendation: 'Encourage early engagement with multiple decision-makers',
    confidence: 94
  },
  {
    title: 'Discount Impact on Renewals',
    insight: 'Discounts above 18% reduce renewal probability by 32%',
    impact: 'Critical',
    recommendation: 'Review discount approval thresholds',
    confidence: 89
  },
  {
    title: 'Technical Demo Correlation',
    insight: 'POC demonstrations increase win rate by 42%',
    impact: 'High',
    recommendation: 'Prioritize technical demos for deals >₹1 Cr',
    confidence: 91
  },
  {
    title: 'Industry Trend',
    insight: 'EV sector deals have 35% higher Average Deal Value',
    impact: 'Medium',
    recommendation: 'Allocate senior resources to EV opportunities',
    confidence: 86
  }
];

// AI Recommendations for Sales Rep - Based on real JSON backend data
// Generated from tenant recommendation engine
// This needs to be a function to react to tenant changes
export const getAIRecommendations = () => {
  const currentTenantInfo = getTenantInfo();
  return currentTenantInfo.recommendations.map((rec, index) => {
    // NEW FORMAT ONLY - OpportunityName, CurrentProduct, RecommendedProduct, ConfidenceScore, SalesRegion
    const confidencePct = Math.round(rec.ConfidenceScore * 100);
    const type = rec.RecommendationType ? rec.RecommendationType.toLowerCase().replace('-', '') : 'crosssell';
    
    // Generate description
    const description = `Recommend ${rec.RecommendedProduct} as ${rec.RecommendationType} opportunity for customer currently using ${rec.CurrentProduct}.`;
    
    // Generate reason
    const confidenceLevel = rec.ConfidenceScore >= 0.9 ? 'High' : rec.ConfidenceScore >= 0.8 ? 'Strong' : 'Good';
    const reason = `${confidenceLevel} confidence (${confidencePct}%) for ${rec.SalesRegion} region opportunity.`;
    
    return {
      id: index + 1,
      repId: 1,
      company: rec.AccountName,
      type: type,
      opportunityType: rec.RecommendationType,
      opportunityName: rec.OpportunityName,
      currentProduct: rec.CurrentProduct,
      recommendedProduct: rec.RecommendedProduct,
      salesRegion: rec.SalesRegion,
      title: rec.RecommendedProduct,
      description: description,
      confidence: confidencePct,
      reason: reason,
      product: rec.RecommendedProduct,
      productName: rec.RecommendedProduct,
      status: confidencePct >= 90 ? 'high-opportunity' : confidencePct >= 80 ? 'medium-opportunity' : 'standard',
      priority: confidencePct >= 90 ? 'High' : confidencePct >= 80 ? 'Medium' : 'Low',
      targetCompanies: [rec.AccountName]
    };
  });
};

// DEPRECATED: For backward compatibility only - use getAIRecommendations() instead
// This will not update when tenant changes - kept only for gradual migration
export const aiRecommendations = getAIRecommendations();

export const activityTypes = {
  CALL: 'call',
  MEETING: 'meeting',
  DEMO: 'demo',
  PROPOSAL: 'proposal',
  FOLLOWUP: 'follow-up',
  EMAIL: 'email',
  UPDATE: 'update'
};

// Daily Activities for Sales Reps (Feb 20, 2026)
export const dailyActivities = [
  // Rahul Sharma's activities
  {
    id: 1,
    repId: 1,
    repName: 'Rahul Sharma',
    date: '2026-02-20',
    time: '10:00 AM',
    type: activityTypes.CALL,
    title: 'Follow-up call: ACCELYA Software Integration',
    company: 'ACCELYA SOLUTIONS INDIA LIMITED',
    dealId: 3,
    dealName: 'Consulting - AI Management',
    status: 'completed',
    source: 'manual', // manual or ai-suggested
    outcome: 'Scheduled demo for next week',
    duration: '30 min'
  },
  {
    id: 2,
    repId: 1,
    repName: 'Rahul Sharma',
    date: '2026-02-20',
    time: '02:00 PM',
    type: activityTypes.DEMO,
    title: 'Product demo: Data Engineering Solutions',
    company: 'ADANI GREEN ENERGY LIMITED',
    dealId: 4,
    dealName: 'Digital - Data Engineering',
    status: 'in-progress',
    source: 'ai-suggested',
    duration: '60 min'
  },
  {
    id: 3,
    repId: 1,
    repName: 'Rahul Sharma',
    date: '2026-02-20',
    time: '04:00 PM',
    type: activityTypes.PROPOSAL,
    title: 'Send pricing proposal: Embedded Systems',
    company: 'ADANI WILMAR LIMITED',
    dealId: 1,
    dealName: 'ERD - Embedded Systems',
    status: 'pending',
    source: 'ai-suggested',
    duration: '45 min'
  },
  {
    id: 4,
    repId: 1,
    repName: 'Rahul Sharma',
    date: '2026-02-20',
    time: '06:00 PM',
    type: activityTypes.UPDATE,
    title: 'Update Salesforce - 3 deals',
    company: null,
    dealId: null,
    dealName: null,
    status: 'pending',
    source: 'manual',
    duration: '30 min'
  },

  // Priya Mehta's activities
  {
    id: 5,
    repId: 1,
    repName: 'Rahul Sharma',
    date: '2026-02-20',
    time: '09:30 AM',
    type: activityTypes.EMAIL,
    title: 'Send ROI analysis: Green Energy Projects',
    company: 'ADANI GREEN ENERGY LIMITED',
    dealId: 13,
    dealName: 'PBS - Customization',
    status: 'completed',
    source: 'ai-suggested',
    outcome: 'Positive response, meeting scheduled',
    duration: '20 min'
  },
  {
    id: 6,
    repId: 1,
    repName: 'Rahul Sharma',
    date: '2026-02-20',
    time: '11:00 AM',
    type: activityTypes.PROPOSAL,
    title: 'Prepare technical proposal',
    company: 'ACCELYA SOLUTIONS INDIA LIMITED',
    dealId: 5,
    dealName: 'CSD - DevOps',
    status: 'completed',
    source: 'manual',
    outcome: 'Proposal ready for review',
    duration: '90 min'
  },
  {
    id: 7,
    repId: 1,
    repName: 'Rahul Sharma',
    date: '2026-02-20',
    time: '03:00 PM',
    type: activityTypes.MEETING,
    title: 'Executive meeting: ADANI WILMAR',
    company: 'ADANI WILMAR LIMITED',
    dealId: 4,
    dealName: 'PBS - Migrations',
    status: 'pending',
    source: 'manual',
    duration: '45 min'
  },

  // Amit Kumar's activities
  {
    id: 8,
    repId: 1,
    repName: 'Rahul Sharma',
    date: '2026-02-20',
    time: '10:30 AM',
    type: activityTypes.CALL,
    title: 'Escalation call: ADANI GREEN ENERGY',
    company: 'ADANI GREEN ENERGY LIMITED',
    dealId: 6,
    dealName: 'Digital - Data Management',
    status: 'completed',
    source: 'ai-suggested',
    outcome: 'Management engaged, unstalling progress',
    duration: '45 min'
  },
  {
    id: 9,
    repId: 1,
    repName: 'Rahul Sharma',
    date: '2026-02-20',
    time: '02:30 PM',
    type: activityTypes.FOLLOWUP,
    title: 'Follow-up: Outstanding questions',
    company: 'ACCELYA SOLUTIONS INDIA LIMITED',
    dealId: 6,
    dealName: 'CSD - Apps Development',
    status: 'pending',
    source: 'manual',
    duration: '30 min'
  },

  // Neha Singh's activities
  {
    id: 10,
    repId: 1,
    repName: 'Rahul Sharma',
    date: '2026-02-20',
    time: '01:00 PM',
    type: activityTypes.CALL,
    title: 'Discovery call: New prospect',
    company: 'ADANI GREEN ENERGY LIMITED',
    dealId: null,
    dealName: 'Renewable Energy Expansion',
    status: 'completed',
    source: 'manual',
    outcome: 'Qualified lead, next steps defined',
    duration: '40 min'
  }
];

// AI-Suggested Daily Agenda (generated by Cross Sync engine) - Based on real deals
export const aiSuggestedAgenda = (() => {
  const agenda = [];
  
  // For each rep, generate suggestions from their actual deals
  [1, 2, 3, 4].forEach(repId => {
    const rep = salesReps.find(r => r.id === repId);
    const repDeals = allDeals.filter(d => d.repId === repId);
    const criticalDeals = repDeals.filter(d => d.status === 'critical' || d.status === 'high-risk');
    const lowEngagement = repDeals.filter(d => d.engagementScore < 60);
    
    const suggestions = [];
    
    // Critical deal suggestion
    if (criticalDeals[0]) {
      const deal = criticalDeals[0];
      suggestions.push({
        priority: deal.status === 'critical' ? 'critical' : 'urgent',
        activity: `Schedule executive alignment call for ${deal.company} - ${deal.name}`,
        reason: `${deal.status.charAt(0).toUpperCase() + deal.status.slice(1)} status with ${deal.engagementScore}% engagement - risk of losing ${deal.valueFormatted}`,
        recommendedTime: 'Morning',
        estimatedDuration: '45 min',
        linkedDealId: deal.id
      });
    }
    
    // Low engagement suggestion
    if (lowEngagement[0] && lowEngagement[0].id !== criticalDeals[0]?.id) {
      const deal = lowEngagement[0];
      suggestions.push({
        priority: 'high',
        activity: `Multi-threading strategy: Engage more stakeholders in ${deal.company}`,
        reason: `Only ${deal.stakeholders} stakeholder${deal.stakeholders > 1 ? 's' : ''} engaged - similar deals close faster with 3+`,
        recommendedTime: 'Afternoon',
        estimatedDuration: '45 min',
        linkedDealId: deal.id
      });
    }
    
    // General deal advancement
    if (repDeals[2]) {
      const deal = repDeals[2];
      suggestions.push({
        priority: 'medium',
        activity: `Send technical documentation to ${deal.company}`,
        reason: `${deal.stage} stage - need to provide decision-making materials`,
        recommendedTime: 'End of day',
        estimatedDuration: '30 min',
        linkedDealId: deal.id
      });
    }
    
    if (suggestions.length > 0) {
      agenda.push({
        repId,
        repName: rep.name,
        date: '2026-02-20',
        suggestions
      });
    }
  });
  
  return agenda;
})();

// Target Companies for each Sales Rep
export const targetCompanies = [
  {
    repId: 1,
    repName: 'Rahul Sharma',
    targets: [
      {
        company: 'ACCELYA SOLUTIONS INDIA LIMITED',
        status: 'active',
        priority: 'high',
        activeDeals: 5,
        pipelineValue: '₹37.7 Cr',
        nextAction: 'Close pending deals this quarter',
        industry: 'Computers - Software - Medium / Small'
      },
      {
        company: 'ADANI GREEN ENERGY LIMITED',
        status: 'active',
        priority: 'medium',
        activeDeals: 4,
        pipelineValue: '₹30.0 Cr',
        nextAction: 'Schedule executive alignment call',
        industry: 'Power Generation And Supply'
      },
      {
        company: 'ADANI WILMAR LIMITED',
        status: 'warm-prospect',
        priority: 'medium',
        activeDeals: 3,
        pipelineValue: '₹25.3 Cr',
        nextAction: 'Demo presentation scheduled',
        industry: 'Solvent Extraction'
      }
    ]
  },
  {
    repId: 1,
    repName: 'Rahul Sharma',
    targets: [
      {
        company: 'ADANI GREEN ENERGY LIMITED',
        status: 'active',
        priority: 'high',
        activeDeals: 6,
        pipelineValue: '₹44.4 Cr',
        nextAction: 'Close pending deals this quarter',
        industry: 'Power Generation And Supply'
      },
      {
        company: 'ACCELYA SOLUTIONS INDIA LIMITED',
        status: 'active',
        priority: 'medium',
        activeDeals: 4,
        pipelineValue: '₹29.7 Cr',
        nextAction: 'Schedule executive alignment call',
        industry: 'Computers - Software - Medium / Small'
      },
      {
        company: 'ADANI WILMAR LIMITED',
        status: 'warm-prospect',
        priority: 'medium',
        activeDeals: 2,
        pipelineValue: '₹14.6 Cr',
        nextAction: 'Demo presentation scheduled',
        industry: 'Solvent Extraction'
      }
    ]
  },
  {
    repId: 1,
    repName: 'Rahul Sharma',
    targets: [
      {
        company: 'ADANI GREEN ENERGY LIMITED',
        status: 'active',
        priority: 'high',
        activeDeals: 6,
        pipelineValue: '₹36.8 Cr',
        nextAction: 'Close pending deals this quarter',
        industry: 'Power Generation And Supply'
      },
      {
        company: 'ADANI WILMAR LIMITED',
        status: 'active',
        priority: 'medium',
        activeDeals: 4,
        pipelineValue: '₹18.6 Cr',
        nextAction: 'Schedule executive alignment call',
        industry: 'Solvent Extraction'
      },
      {
        company: 'ACCELYA SOLUTIONS INDIA LIMITED',
        status: 'warm-prospect',
        priority: 'medium',
        activeDeals: 2,
        pipelineValue: '₹14.1 Cr',
        nextAction: 'Demo presentation scheduled',
        industry: 'Computers - Software - Medium / Small'
      }
    ]
  },
  {
    repId: 1,
    repName: 'Rahul Sharma',
    targets: [
      {
        company: 'ADANI GREEN ENERGY LIMITED',
        status: 'active',
        priority: 'high',
        activeDeals: 7,
        pipelineValue: '₹54.5 Cr',
        nextAction: 'Close pending deals this quarter',
        industry: 'Power Generation And Supply'
      },
      {
        company: 'ACCELYA SOLUTIONS INDIA LIMITED',
        status: 'active',
        priority: 'medium',
        activeDeals: 4,
        pipelineValue: '₹30.4 Cr',
        nextAction: 'Schedule executive alignment call',
        industry: 'Computers - Software - Medium / Small'
      },
      {
        company: 'ADANI WILMAR LIMITED',
        status: 'warm-prospect',
        priority: 'medium',
        activeDeals: 1,
        pipelineValue: '₹7.5 Cr',
        nextAction: 'Demo presentation scheduled',
        industry: 'Solvent Extraction'
      }
    ]
  }
];

// Generate daily activities from tenant recommendations
const generateActivitiesFromTenant = () => {
  const currentTenantInfo = getTenantInfo();
  const recommendations = currentTenantInfo.recommendations || [];
  
  // Get today's date
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  
  // Activity types rotation
  const activityTypesArray = [
    { type: activityTypes.CALL, prefix: 'Follow-up call:' },
    { type: activityTypes.DEMO, prefix: 'Product demo:' },
    { type: activityTypes.PROPOSAL, prefix: 'Send pricing proposal:' },
    { type: activityTypes.MEETING, prefix: 'Client meeting:' },
    { type: activityTypes.EMAIL, prefix: 'Send proposal:' }
  ];
  
  // Status rotation
  const statuses = ['completed', 'in-progress', 'pending', 'pending'];
  
  // Time slots starting from 09:00 AM
  const generateTimeSlot = (index) => {
    const hour = 9 + Math.floor(index * 1.5);
    const minute = (index % 2) * 30;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${String(displayHour).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${ampm}`;
  };
  
  // Take first 10 recommendations and create activities
  return recommendations.slice(0, 10).map((rec, index) => {
    const activityType = activityTypesArray[index % activityTypesArray.length];
    const status = statuses[index % statuses.length];
    
    return {
      id: index + 1,
      repId: 1,
      repName: 'Rahul Sharma',
      date: dateStr,
      time: generateTimeSlot(index),
      type: activityType.type,
      title: `${activityType.prefix} ${rec.Recommended_Product}`,
      company: rec.AccountName,
      dealId: index + 1,
      dealName: `${rec.Recommended_Product} - ${rec.Technology}`,
      status: status,
      source: rec.Method === 'hybrid' ? 'ai-suggested' : 'manual',
      outcome: status === 'completed' ? 'Scheduled demo for next week' : undefined,
      duration: activityType.type === activityTypes.DEMO ? '60 min' : activityType.type === activityTypes.MEETING ? '45 min' : '30 min'
    };
  });
};

// Get activities for a specific rep
export const getRepActivities = (repId, date = new Date().toISOString().split('T')[0]) => {
  const activities = generateActivitiesFromTenant();
  return activities.filter(activity => 
    activity.repId === repId && activity.date === date
  );
};

// Get AI suggestions for a rep - Generated from tenant recommendations
export const getAISuggestions = (repId) => {
  const currentTenantInfo = getTenantInfo();
  const recommendations = currentTenantInfo.recommendations || [];
  
  // Generate AI suggestions from high-confidence recommendations
  const highConfidenceRecs = recommendations
    .filter(rec => rec.Confidence >= 7)
    .slice(0, 3);
  
  return highConfidenceRecs.map((rec, index) => {
    const priorities = ['critical', 'high', 'medium'];
    const timings = ['Morning', 'Afternoon', 'End of day'];
    
    return {
      priority: priorities[index % priorities.length],
      activity: `Schedule demo for ${rec.Recommended_Product} at ${rec.AccountName}`,
      reason: `High confidence (${(rec.Confidence * 10).toFixed(0)}%) recommendation - ${rec.Technology} stack aligns with customer needs`,
      recommendedTime: timings[index % timings.length],
      estimatedDuration: '45 min',
      linkedDealId: index + 1
    };
  });
};

// Get target companies for a rep - Generated from tenant recommendations
export const getTargetCompanies = (repId) => {
  const currentTenantInfo = getTenantInfo();
  const recommendations = currentTenantInfo.recommendations || [];
  
  // Group recommendations by account
  const accountGroups = recommendations.reduce((acc, rec) => {
    if (!acc[rec.AccountName]) {
      acc[rec.AccountName] = [];
    }
    acc[rec.AccountName].push(rec);
    return acc;
  }, {});
  
  // Create target companies from account groups
  return Object.entries(accountGroups)
    .slice(0, 5) // Top 5 target companies
    .map(([accountName, recs], index) => {
      const totalConfidence = recs.reduce((sum, r) => sum + r.Confidence, 0);
      const avgConfidence = totalConfidence / recs.length;
      const pipelineValue = (totalConfidence * 2).toFixed(2);
      
      return {
        company: accountName,
        status: index === 0 ? 'active' : index < 3 ? 'active' : 'warm-prospect',
        priority: avgConfidence >= 8 ? 'high' : 'medium',
        activeDeals: recs.length,
        pipelineValue: `₹${pipelineValue} Cr`,
        nextAction: index < 2 ? 'Close pending deals this quarter' : 'Schedule executive alignment call',
        industry: recs[0].Technology || 'Technology'
      };
    });
};

// Get all team activities for a manager (by region)
export const getTeamActivitiesByManager = (managerName, date = '2026-02-20') => {
  const teamReps = salesReps.filter(rep => rep.manager === managerName);
  const teamRepIds = teamReps.map(rep => rep.id);
  
  return dailyActivities.filter(activity => 
    teamRepIds.includes(activity.repId) && activity.date === date
  );
};

// Get activity summary for manager dashboard
export const getActivitySummary = (managerName) => {
  const teamActivities = getTeamActivitiesByManager(managerName);
  
  const summary = {
    totalActivities: teamActivities.length,
    completed: teamActivities.filter(a => a.status === 'completed').length,
    inProgress: teamActivities.filter(a => a.status === 'in-progress').length,
    pending: teamActivities.filter(a => a.status === 'pending').length,
    byType: {
      calls: teamActivities.filter(a => a.type === activityTypes.CALL).length,
      meetings: teamActivities.filter(a => a.type === activityTypes.MEETING).length,
      demos: teamActivities.filter(a => a.type === activityTypes.DEMO).length,
      proposals: teamActivities.filter(a => a.type === activityTypes.PROPOSAL).length,
      followups: teamActivities.filter(a => a.type === activityTypes.FOLLOWUP).length
    }
  };
  
  return summary;
};

// =============================================================================
// ACCESS CONTROL HELPER FUNCTIONS
// =============================================================================

// Get team members by managerId
export const getTeamMembersByManagerId = (managerId) => {
  return salesReps.filter(rep => rep.managerId === managerId);
};

// Get deals accessible to a manager (by managerId)
export const getDealsByManagerId = (managerId) => {
  const teamRepIds = getTeamMembersByManagerId(managerId).map(rep => rep.id);
  return allDeals.filter(deal => teamRepIds.includes(deal.repId));
};

// Get rep performance data accessible to a manager
export const getRepPerformanceByManagerId = (managerId) => {
  const teamRepIds = getTeamMembersByManagerId(managerId).map(rep => rep.id);
  return repPerformanceData.filter(perf => teamRepIds.includes(perf.id));
};

// Get high-risk deals accessible to a manager (by managerId)
export const getHighRiskDealsByManagerId = (managerId) => {
  const teamRepIds = getTeamMembersByManagerId(managerId).map(rep => rep.id);
  return allDeals
    .filter(deal => 
      (deal.status === 'high-risk' || deal.status === 'critical') &&
      teamRepIds.includes(deal.repId)
    )
    .slice(0, 3)
    .map(deal => ({
      id: deal.id,
      name: deal.name,
      value: deal.valueFormatted,
      rep: deal.repName,
      risks: deal.risks || [],
      daysToClose: deal.daysToClose,
      action: getActionForDeal(deal),
      actionTaken: false
    }));
};

// Get intervention queue accessible to a manager (by managerId)
export const getInterventionsByManagerId = (managerId) => {
  const teamRepIds = getTeamMembersByManagerId(managerId).map(rep => rep.id);
  return interventionQueueData.filter(item => teamRepIds.includes(item.repId));
};

// Filter data based on user role and access control
export const filterByUserAccess = (data, currentUser, repIdField = 'repId') => {
  if (!currentUser || !data) return [];
  
  // Sales Head can see all data
  if (currentUser.role === 'sales-head') {
    return data;
  }
  
  // Sales Manager can see only their team's data
  if (currentUser.role === 'sales-manager') {
    const teamRepIds = getTeamMembersByManagerId(currentUser.managerId).map(rep => rep.id);
    return data.filter(item => teamRepIds.includes(item[repIdField]));
  }
  
  // Sales Rep can see only their own data
  if (currentUser.role === 'sales-rep') {
    return data.filter(item => item[repIdField] === currentUser.repId);
  }
  
  return [];
};

// Get accessible managers for current user
export const getAccessibleManagersData = (currentUser) => {
  if (!currentUser) return [];
  
  // Sales Head can see all managers
  if (currentUser.role === 'sales-head') {
    return salesManagers;
  }
  
  // Sales Manager can see only themselves
  if (currentUser.role === 'sales-manager') {
    return salesManagers.filter(mgr => mgr.id === currentUser.managerId);
  }
  
  // Sales Rep can see their manager
  if (currentUser.role === 'sales-rep') {
    return salesManagers.filter(mgr => mgr.id === currentUser.managerId);
  }
  
  return [];
};

// Get accessible reps for current user
export const getAccessibleRepsData = (currentUser) => {
  if (!currentUser) return [];
  
  // Sales Head can see all reps
  if (currentUser.role === 'sales-head') {
    return salesReps;
  }
  
  // Sales Manager can see only their team members
  if (currentUser.role === 'sales-manager') {
    return salesReps.filter(rep => rep.managerId === currentUser.managerId);
  }
  
  // Sales Rep can see only themselves
  if (currentUser.role === 'sales-rep') {
    return salesReps.filter(rep => rep.id === currentUser.repId);
  }
  
  return [];
};

// Generate accounts from tenant JSON data (primary method)
export const generateAccountsFromTenant = () => {
  const currentTenantInfo = getTenantInfo();
  // Calculate total revenue from SalesHead KPIs (CrossSellRevenue + UpsellRevenue)
  const headKPI = currentTenantInfo.KPI.SalesHead;
  const totalRevenueFromKPI = (headKPI.CrossSellRevenue || 0) + (headKPI.UpsellRevenue || 0);
  const recommendations = currentTenantInfo.recommendations;
  
  // Group recommendations by account to get unique accounts
  const accountsMap = {};
  
  recommendations.forEach(rec => {
    const accountName = rec.AccountName;
    
    if (!accountsMap[accountName]) {
      accountsMap[accountName] = {
        id: accountName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        name: accountName,
        recommendations: [],
        technologies: new Set(),
        partners: new Set()
      };
    }
    
    accountsMap[accountName].recommendations.push(rec);
    accountsMap[accountName].technologies.add(rec.Technology);
    accountsMap[accountName].partners.add(rec.Partner);
  });
  
  // Convert to array and distribute revenue proportionally
  const accountCount = Object.keys(accountsMap).length;
  const accounts = Object.values(accountsMap).map((account, index) => {
    // Distribute revenue proportionally based on recommendation count
    const revenueShare = account.recommendations.length / recommendations.length;
    const accountRevenue = totalRevenueFromKPI * revenueShare;
    
    // Estimate employees based on revenue (rough heuristic)
    const employeeCount = Math.floor(10000 + (accountRevenue / 100000000) * 1000);
    
    return {
      id: account.id,
      name: account.name,
      industry: account.recommendations[0]?.Technology || 'Technology',
      revenue: `₹${(accountRevenue / 10000000).toFixed(0)} Cr`,
      revenueRaw: accountRevenue,
      employees: employeeCount.toLocaleString(),
      location: 'India', // Generic location
      status: 'Active',
      opportunities: account.recommendations.length,
      technologies: Array.from(account.technologies).join(', '),
      partners: Array.from(account.partners).join(', ')
    };
  });
  
  return accounts.sort((a, b) => b.revenueRaw - a.revenueRaw);
};

// Generate accounts from real deals data (fallback/legacy method)
export const generateAccountsFromDeals = (repId = null) => {
  // Filter deals by rep if repId is provided
  const relevantDeals = repId ? allDeals.filter(d => d.repId === repId) : allDeals;
  
  // Get total revenue from JSON KPI data - dynamically from current tenant
  const currentTenantInfo = getTenantInfo();
  // Calculate total revenue from SalesHead KPIs (CrossSellRevenue + UpsellRevenue)
  const headKPI = currentTenantInfo.KPI.SalesHead;
  const totalRevenueFromKPI = (headKPI.CrossSellRevenue || 0) + (headKPI.UpsellRevenue || 0);
  
  // Group deals by company
  const accountsMap = {};
  let totalDealValue = 0;
  
  relevantDeals.forEach(deal => {
    const companyKey = deal.company;
    
    if (!accountsMap[companyKey]) {
      // Initialize account object
      accountsMap[companyKey] = {
        id: companyKey.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        name: deal.company,
        industry: deal.sector || deal.industry || 'Technology',
        revenue: 0,
        dealValue: 0,
        employees: deal.industry === 'Power Generation And Supply' ? '15,000' : 
                   deal.industry === 'Computers - Software - Medium / Small' ? '8,500' :
                   deal.industry === 'Solvent Extraction' ? '12,000' : '10,000',
        location: deal.region === 'North' ? 'New Delhi' :
                  deal.region === 'South' ? 'Chennai, Tamil Nadu' :
                  deal.region === 'East' ? 'Kolkata, West Bengal' :
                  deal.region === 'West' ? 'Mumbai, Maharashtra' : 'Mumbai, Maharashtra',
        status: 'Active',
        opportunities: 0,
        deals: []
      };
    }
    
    // Aggregate deal values for proportional distribution
    accountsMap[companyKey].dealValue += deal.value * 10000000; // Convert Cr to rupees
    accountsMap[companyKey].opportunities += 1;
    accountsMap[companyKey].deals.push(deal);
    totalDealValue += deal.value * 10000000;
  });
  
  // Distribute total revenue from KPI proportionally based on deal values
  const accounts = Object.values(accountsMap).map(account => {
    const proportion = totalDealValue > 0 ? account.dealValue / totalDealValue : 1 / Object.keys(accountsMap).length;
    const accountRevenue = totalRevenueFromKPI * proportion;
    
    return {
      ...account,
      revenue: `₹${(accountRevenue / 10000000).toFixed(0)} Cr`,
      dealValue: undefined, // Remove temporary field
      deals: undefined // Remove deals array from final output
    };
  });
  
  return accounts;
};

// Get accounts by rep ID
export const getAccountsByRepId = (repId) => {
  // Use tenant-based account generation instead of deals
  return generateAccountsFromTenant();
};

// Get all accounts (for Sales Head)
export const getAllAccounts = () => {
  // Use tenant-based account generation
  return generateAccountsFromTenant();
};

// Get accounts by manager ID (aggregates accounts from team members)
export const getAccountsByManagerId = (managerId) => {
  // Use tenant-based account generation instead of manager-filtered deals
  // For multi-tenancy, all users see the same tenant's accounts
  return generateAccountsFromTenant();
};

// Get account by ID
export const getAccountById = (accountId) => {
  const allAccounts = getAllAccounts();
  const account = allAccounts.find(acc => acc.id === accountId);
  
  if (!account) return null;
  
  // Get detailed information including deals
  const accountDeals = allDeals.filter(deal => {
    const dealAccountId = deal.company.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return dealAccountId === accountId;
  });
  
  // Return account with full details
  return {
    ...account,
    deals: accountDeals,
    phone: '+91 22 0000-0000',
    email: `contact@${account.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
    since: 'January 2022'
  };
};
