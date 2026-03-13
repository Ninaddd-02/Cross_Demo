// Shared data across Sales Rep, Sales Manager, and Sales Head dashboards
// This creates a connected real-time demo experience
//
// =============================================================================
// ORGANIZATIONAL HIERARCHY (For Demo Understanding)
// =============================================================================
//
// SALES HEAD / VP (Reports to: CEO)
//   ↓
// ├── MANAGER 1: Rajesh Kumar - NORTH REGION
// │   ├── Rep 1: Rahul Sharma (Automotive OEM)
// │   └── Rep 2: Priya Mehta (Manufacturing & Industrial)
// │
// └── MANAGER 2: Priya Sharma - SOUTH REGION
//     ├── Rep 3: Amit Kumar (Technology & IT Services)
//     └── Rep 4: Neha Singh (Pharma & Healthcare)
//
// =============================================================================
// DATA ACCESS RULES:
// - Sales Head: Can view ALL data across all managers and reps
// - Managers: Can ONLY view data of their assigned 2 representatives
// - Sales Reps: Can ONLY view their own data
// =============================================================================
// DATA FLOW: Rep Activities → Manager Dashboard → Head Regional View
// All deals, activities, and recommendations are connected through repId
// =============================================================================

// Sales Reps in the system
export const salesReps = [
  // Manager 1 Team
  {
    id: 1,
    name: 'Rahul Sharma',
    email: 'rahul.sharma@company.com',
    region: 'North',
    manager: 'Rajesh Kumar',
    managerId: 1,
    avatar: '👤'
  },
  {
    id: 2,
    name: 'Priya Mehta',
    email: 'priya.mehta@company.com',
    region: 'South',
    manager: 'Rajesh Kumar',
    managerId: 1,
    avatar: '👤'
  },
  // Manager 2 Team
  {
    id: 3,
    name: 'Amit Kumar',
    email: 'amit.kumar@company.com',
    region: 'East',
    manager: 'Priya Sharma',
    managerId: 2,
    avatar: '👤'
  },
  {
    id: 4,
    name: 'Neha Singh',
    email: 'neha.singh@company.com',
    region: 'West',
    manager: 'Priya Sharma',
    managerId: 2,
    avatar: '👤'
  }
];

// Sales Managers in the system
export const salesManagers = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    region: 'North & South',
    teamSize: 2,
    teamMembers: [1, 2], // Rep IDs
    email: 'rajesh.kumar@company.com'
  },
  {
    id: 2,
    name: 'Priya Sharma',
    region: 'East & West',
    teamSize: 2,
    teamMembers: [3, 4], // Rep IDs
    email: 'priya.sharma@company.com'
  }
];

// All deals in the system (Sales Rep level)
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
    repId: 2,
    repName: 'Priya Mehta',
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
    repId: 2,
    repName: 'Priya Mehta',
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
    repId: 2,
    repName: 'Priya Mehta',
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
    repId: 2,
    repName: 'Priya Mehta',
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
    repId: 2,
    repName: 'Priya Mehta',
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
    repId: 2,
    repName: 'Priya Mehta',
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
    repId: 2,
    repName: 'Priya Mehta',
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
    repId: 2,
    repName: 'Priya Mehta',
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
    repId: 2,
    repName: 'Priya Mehta',
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
    repId: 2,
    repName: 'Priya Mehta',
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
    repId: 2,
    repName: 'Priya Mehta',
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
    repId: 2,
    repName: 'Priya Mehta',
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
    repId: 3,
    repName: 'Amit Kumar',
    region: 'East',
    manager: 'Priya Sharma',
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
    repId: 3,
    repName: 'Amit Kumar',
    region: 'East',
    manager: 'Priya Sharma',
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
    repId: 3,
    repName: 'Amit Kumar',
    region: 'East',
    manager: 'Priya Sharma',
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
    repId: 3,
    repName: 'Amit Kumar',
    region: 'East',
    manager: 'Priya Sharma',
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
    repId: 3,
    repName: 'Amit Kumar',
    region: 'East',
    manager: 'Priya Sharma',
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
    repId: 3,
    repName: 'Amit Kumar',
    region: 'East',
    manager: 'Priya Sharma',
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
    repId: 3,
    repName: 'Amit Kumar',
    region: 'East',
    manager: 'Priya Sharma',
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
    repId: 3,
    repName: 'Amit Kumar',
    region: 'East',
    manager: 'Priya Sharma',
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
    repId: 3,
    repName: 'Amit Kumar',
    region: 'East',
    manager: 'Priya Sharma',
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
    repId: 3,
    repName: 'Amit Kumar',
    region: 'East',
    manager: 'Priya Sharma',
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
    repId: 3,
    repName: 'Amit Kumar',
    region: 'East',
    manager: 'Priya Sharma',
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
    repId: 3,
    repName: 'Amit Kumar',
    region: 'East',
    manager: 'Priya Sharma',
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
    repId: 4,
    repName: 'Neha Singh',
    region: 'West',
    manager: 'Priya Sharma',
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
    repId: 4,
    repName: 'Neha Singh',
    region: 'West',
    manager: 'Priya Sharma',
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
    repId: 4,
    repName: 'Neha Singh',
    region: 'West',
    manager: 'Priya Sharma',
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
    repId: 4,
    repName: 'Neha Singh',
    region: 'West',
    manager: 'Priya Sharma',
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
    repId: 4,
    repName: 'Neha Singh',
    region: 'West',
    manager: 'Priya Sharma',
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
    repId: 4,
    repName: 'Neha Singh',
    region: 'West',
    manager: 'Priya Sharma',
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
    repId: 4,
    repName: 'Neha Singh',
    region: 'West',
    manager: 'Priya Sharma',
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
    repId: 4,
    repName: 'Neha Singh',
    region: 'West',
    manager: 'Priya Sharma',
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
    repId: 4,
    repName: 'Neha Singh',
    region: 'West',
    manager: 'Priya Sharma',
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
    repId: 4,
    repName: 'Neha Singh',
    region: 'West',
    manager: 'Priya Sharma',
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
    repId: 4,
    repName: 'Neha Singh',
    region: 'West',
    manager: 'Priya Sharma',
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
    repId: 4,
    repName: 'Neha Singh',
    region: 'West',
    manager: 'Priya Sharma',
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
  // Format currency in Crores
  const formatCrores = (value) => {
    const crores = value / 10000000;
    return `₹${crores.toFixed(2)} Cr`;
  };

  // Calculate revenue by service line from actual deals
  const serviceRevenueMap = {};
  const productRevenueMap = {};
  
  allDeals.forEach(deal => {
    // Extract service line (part before " - " in deal name)
    const serviceLine = deal.name.split(' - ')[0] || 'Other';
    
    // Aggregate by service line
    if (!serviceRevenueMap[serviceLine]) {
      serviceRevenueMap[serviceLine] = 0;
    }
    serviceRevenueMap[serviceLine] += deal.value * 10000000; // Convert Cr to rupees
    
    // Also aggregate by technology/product
    const product = deal.technology ? deal.technology.split('(')[0].trim() : 'Other';
    if (!productRevenueMap[product]) {
      productRevenueMap[product] = 0;
    }
    productRevenueMap[product] += deal.value * 10000000;
  });

  // Calculate revenue at risk (critical + high-risk deals)
  const revenueAtRisk = allDeals
    .filter(d => d.status === 'critical' || d.status === 'high-risk')
    .reduce((sum, d) => sum + (d.value * 10000000), 0);

  // Calculate average deal velocity from engagement scores
  const avgEngagement = allDeals.reduce((sum, d) => sum + (d.engagementScore || 50), 0) / allDeals.length;
  const avgDealVelocity = Math.round(avgEngagement * 0.5); // Convert engagement to approximate days

  // Calculate cross/upsell rate (deals with high engagement as proxy)
  const highEngagementDeals = allDeals.filter(d => d.engagementScore >= 65).length;
  const crossUpsellRate = ((highEngagementDeals / allDeals.length) * 100).toFixed(1);

  // Find top service line and top product
  const sortedServices = Object.entries(serviceRevenueMap).sort((a, b) => b[1] - a[1]);
  const sortedProducts = Object.entries(productRevenueMap).sort((a, b) => b[1] - a[1]);
  
  const topService = sortedServices[0] || ['Consulting', 0];
  const topProduct = sortedProducts[0] || ['Technology Services', 0];

  // Calculate totals
  const totalServiceRevenue = Object.values(serviceRevenueMap).reduce((sum, val) => sum + val, 0);
  const totalProductRevenue = Object.values(productRevenueMap).reduce((sum, val) => sum + val, 0);

  // Build service revenue breakdown (top 3)
  const serviceRevenue = {};
  sortedServices.slice(0, 3).forEach(([name, value]) => {
    serviceRevenue[name] = formatCrores(value);
  });

  // Build product revenue breakdown (top 3)
  const productRevenue = {};
  sortedProducts.slice(0, 3).forEach(([name, value]) => {
    productRevenue[name] = formatCrores(value);
  });

  return {
    avgSalesCycle: 36, // Default value
    avgDealVelocity,
    crossUpsellRate,
    revenueAtRisk: formatCrores(revenueAtRisk),
    revenueAtRiskRaw: revenueAtRisk,
    totalProductRevenue: formatCrores(totalProductRevenue),
    totalServiceRevenue: formatCrores(totalServiceRevenue),
    topProduct: {
      name: topProduct[0],
      revenue: formatCrores(topProduct[1])
    },
    topService: {
      name: topService[0],
      revenue: formatCrores(topService[1])
    },
    productRevenue,
    serviceRevenue
  };
};

// Calculate Sales Rep KPIs
export const calculateRepKPIs = () => {
  // Real KPIs from backend data
  const data = {
    average_deal_velocity_days: 32.33,
    revenue_at_risk: 467868710,
    number_of_deals_closed: 48,
    average_deal_size: 1250000,
    renewal_rate_percent: 72.4,
    cross_sell_revenue_potential: 95000000,
    upsell_revenue_potential: 143000000
  };

  // Format currency in Crores
  const formatCrores = (value) => {
    const crores = value / 10000000;
    return `₹${crores.toFixed(2)} Cr`;
  };

  // Format currency in Lakhs for smaller amounts
  const formatLakhs = (value) => {
    const lakhs = value / 100000;
    return `₹${lakhs.toFixed(2)} L`;
  };

  return {
    avgDealVelocity: Math.round(data.average_deal_velocity_days),
    revenueAtRisk: formatCrores(data.revenue_at_risk),
    revenueAtRiskRaw: data.revenue_at_risk,
    dealsClosed: data.number_of_deals_closed,
    avgDealSize: formatLakhs(data.average_deal_size),
    avgDealSizeRaw: data.average_deal_size,
    renewalRate: data.renewal_rate_percent.toFixed(1),
    crossSellPotential: formatCrores(data.cross_sell_revenue_potential),
    crossSellPotentialRaw: data.cross_sell_revenue_potential,
    upsellPotential: formatCrores(data.upsell_revenue_potential),
    upsellPotentialRaw: data.upsell_revenue_potential,
    totalExpansionPotential: formatCrores(data.cross_sell_revenue_potential + data.upsell_revenue_potential)
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

// AI Recommendations for Sales Rep - Based on real deals from data_tenant1.xlsx
// Generated from actual ADANI GREEN ENERGY, ACCELYA SOLUTIONS, and ADANI WILMAR accounts
export const aiRecommendations = [
  // Rep 1 (Rahul Sharma - North) - Top Focus: ACCELYA SOLUTIONS
  {
    id: 1,
    repId: 1,
    type: 'cross-sell',
    title: 'Advanced Analytics Platform for ACCELYA',
    description: 'ACCELYA SOLUTIONS shows strong adoption of software solutions. Industry benchmarks indicate 40% efficiency gains with advanced analytics integration.',
    confidence: 92,
    reason: 'Based on current IT infrastructure and growth in software deployment, analytics platform would optimize their operations.',
    product: 'Enterprise Analytics Suite',
    estimatedValue: '₹12.5 Cr',
    relatedDeal: 'CSD - Apps Development',
    company: 'ACCELYA SOLUTIONS INDIA LIMITED',
    region: 'North',
    optionA: {
      title: 'Full Enterprise Suite (Primary)',
      product: 'Advanced Analytics Platform - Enterprise',
      value: '₹12.5 Cr',
      pros: ['Real-time insights', 'Predictive analytics', 'Integrated reporting'],
      cons: ['Higher implementation cost', 'Requires training'],
      confidence: 92
    },
    optionB: {
      title: 'Business Intelligence Module (Alternative)',
      product: 'BI Analytics Starter Pack',
      value: '₹8.5 Cr',
      pros: ['Quick deployment', 'Lower cost', 'Proven ROI'],
      cons: ['Limited features', 'May need upgrade later'],
      confidence: 85
    }
  },
  {
    id: 2,
    repId: 1,
    type: 'upsell',
    title: 'Cloud Migration Services for ADANI GREEN',
    description: 'Upgrade existing infrastructure to full cloud-native architecture for ADANI GREEN ENERGY operations.',
    confidence: 88,
    reason: 'Current hybrid setup shows bottlenecks. Full cloud migration would reduce operational costs by 30%.',
    product: 'Cloud Transformation Package',
    estimatedValue: '₹9.8 Cr',
    relatedDeal: 'Digital - Data Engineering',
    company: 'ADANI GREEN ENERGY LIMITED',
    region: 'North',
    optionA: {
      title: 'Full Migration (Primary)',
      product: 'Complete Cloud Transformation',
      value: '₹9.8 Cr',
      pros: ['Scalability', 'Cost efficiency', 'Modern architecture'],
      cons: ['Migration complexity', 'Temporary disruption'],
      confidence: 88
    },
    optionB: {
      title: 'Phased Approach (Alternative)',
      product: 'Incremental Cloud Migration',
      value: '₹7.2 Cr',
      pros: ['Lower risk', 'Gradual transition', 'Learn as you go'],
      cons: ['Longer timeline', 'Interim dual costs'],
      confidence: 82
    }
  },
  
  // Rep 2 (Priya Mehta - South) - Top Focus: ADANI GREEN ENERGY
  {
    id: 3,
    repId: 2,
    type: 'cross-sell',
    title: 'Smart Grid Integration for ADANI GREEN',
    description: 'ADANI GREEN ENERGY shows expansion in renewable infrastructure. Smart grid technology would optimize energy distribution.',
    confidence: 90,
    reason: 'Renewable energy plants require intelligent grid management. Industry standard for facilities of this scale.',
    product: 'Smart Grid Management System',
    estimatedValue: '₹15.8 Cr',
    relatedDeal: 'PBS - Customization',
    company: 'ADANI GREEN ENERGY LIMITED',
    region: 'South',
    optionA: {
      title: 'AI-Powered Grid (Primary)',
      product: 'Intelligent Grid Management Platform',
      value: '₹15.8 Cr',
      pros: ['AI optimization', 'Predictive maintenance', 'Real-time load balancing'],
      cons: ['Complex setup', 'Requires skilled operators'],
      confidence: 90
    },
    optionB: {
      title: 'Standard Grid System (Alternative)',
      product: 'Essential Grid Management',
      value: '₹10.5 Cr',
      pros: ['Proven technology', 'Lower cost', 'Easier training'],
      cons: ['Limited automation', 'Manual interventions needed'],
      confidence: 83
    }
  },
  {
    id: 4,
    repId: 2,
    type: 'upsell',
    title: 'Enterprise Security Suite for ACCELYA',
    description: 'Enhance existing cybersecurity infrastructure with comprehensive enterprise protection for ACCELYA SOLUTIONS.',
    confidence: 86,
    reason: 'Recent industry breaches highlight need for advanced threat protection in IT services sector.',
    product: 'Advanced Security Platform',
    estimatedValue: '₹8.9 Cr',
    relatedDeal: 'CSD - DevOps',
    company: 'ACCELYA SOLUTIONS INDIA LIMITED',
    region: 'South',
    optionA: {
      title: 'Full Security Suite (Primary)',
      product: 'Enterprise Security Platform',
      value: '₹8.9 Cr',
      pros: ['Comprehensive protection', '24/7 monitoring', 'Compliance ready'],
      cons: ['Higher cost', 'Complex management'],
      confidence: 86
    },
    optionB: {
      title: 'Core Security Package (Alternative)',
      product: 'Essential Security Bundle',
      value: '₹5.8 Cr',
      pros: ['Cost effective', 'Core protection', 'Quick deployment'],
      cons: ['Limited features', 'No advanced threat detection'],
      confidence: 78
    }
  },

  // Rep 3 (Amit Kumar - East) - Top Focus: ADANI GREEN ENERGY
  {
    id: 5,
    repId: 3,
    type: 'cross-sell',
    title: 'Renewable Energy Monitoring for ADANI GREEN',
    description: 'ADANI GREEN ENERGY operations in East region need advanced monitoring for distributed solar farms.',
    confidence: 89,
    reason: 'Multiple site operations require centralized monitoring. Critical for maintaining 99.5% uptime SLA.',
    product: 'Renewable Energy Monitoring Suite',
    estimatedValue: '₹11.2 Cr',
    relatedDeal: 'Digital - Data Management',
    company: 'ADANI GREEN ENERGY LIMITED',
    region: 'East',
    optionA: {
      title: 'Advanced Monitoring (Primary)',
      product: 'Enterprise Energy Monitoring Platform',
      value: '₹11.2 Cr',
      pros: ['Multi-site visibility', 'Predictive analytics', 'Mobile access'],
      cons: ['Implementation time', 'Training required'],
      confidence: 89
    },
    optionB: {
      title: 'Basic Monitoring (Alternative)',
      product: 'Standard Energy Dashboard',
      value: '₹7.5 Cr',
      pros: ['Quick setup', 'Lower cost', 'Proven system'],
      cons: ['Limited sites', 'Basic reporting only'],
      confidence: 81
    }
  },
  {
    id: 6,
    repId: 3,
    type: 'upsell',
    title: 'Automated Logistics for ADANI WILMAR',
    description: 'Upgrade supply chain operations with AI-powered logistics management for ADANI WILMAR edible oil distribution.',
    confidence: 84,
    reason: 'Current manual processes creating bottlenecks. Automation would reduce delivery times by 35%.',
    product: 'Smart Logistics Platform',
    estimatedValue: '₹6.8 Cr',
    relatedDeal: 'Digital - AI & Analytics',
    company: 'ADANI WILMAR LIMITED',
    region: 'East',
    optionA: {
      title: 'AI Logistics Suite (Primary)',
      product: 'Intelligent Supply Chain Platform',
      value: '₹6.8 Cr',
      pros: ['Route optimization', 'Real-time tracking', 'Cost reduction'],
      cons: ['Integration complexity', 'Change management needed'],
      confidence: 84
    },
    optionB: {
      title: 'Standard Tracking (Alternative)',
      product: 'Basic Logistics Management',
      value: '₹4.2 Cr',
      pros: ['Simple implementation', 'Lower cost', 'Minimal training'],
      cons: ['No AI features', 'Manual planning required'],
      confidence: 76
    }
  },

  // Rep 4 (Neha Singh - West) - Top Focus: ADANI GREEN ENERGY
  {
    id: 7,
    repId: 4,
    type: 'cross-sell',
    title: 'Energy Storage Solutions for ADANI GREEN',
    description: 'ADANI GREEN ENERGY West operations show peak demand management challenges. Battery storage would optimize grid stability.',
    confidence: 91,
    reason: 'West region has highest solar capacity. Storage systems critical for managing evening peak loads.',
    product: 'Grid-Scale Battery Storage',
    estimatedValue: '₹18.5 Cr',
    relatedDeal: 'CSD - Apps Management',
    company: 'ADANI GREEN ENERGY LIMITED',
    region: 'West',
    optionA: {
      title: 'Advanced Battery System (Primary)',
      product: 'Lithium-Ion Grid Storage - 50 MWh',
      value: '₹18.5 Cr',
      pros: ['High efficiency', 'Fast response', '15-year lifespan'],
      cons: ['Higher upfront cost', 'Requires cooling system'],
      confidence: 91
    },
    optionB: {
      title: 'Flow Battery System (Alternative)',
      product: 'Vanadium Flow Battery - 40 MWh',
      value: '₹14.2 Cr',
      pros: ['Longer lifespan', 'Safer technology', 'Scalable'],
      cons: ['Lower energy density', 'Larger footprint required'],
      confidence: 84
    }
  },
  {
    id: 8,
    repId: 4,
    type: 'upsell',
    title: 'Premium IT Support for ACCELYA',
    description: 'Upgrade to 24/7 mission-critical support for ACCELYA SOLUTIONS software operations in West region.',
    confidence: 87,
    reason: 'Growing client base requires enhanced SLAs. Premium support reduces incident resolution time by 60%.',
    product: 'Platinum Support Package',
    estimatedValue: '₹9.2 Cr',
    relatedDeal: 'Consulting - AI Management',
    company: 'ACCELYA SOLUTIONS INDIA LIMITED',
    region: 'West',
    optionA: {
      title: 'Platinum 24/7 Support (Primary)',
      product: 'Mission-Critical Support Suite',
      value: '₹9.2 Cr',
      pros: ['24/7 availability', '1-hour SLA', 'Dedicated team'],
      cons: ['Premium pricing', 'Requires resource allocation'],
      confidence: 87
    },
    optionB: {
      title: 'Gold Business Hours (Alternative)',
      product: 'Enhanced Business Support',
      value: '₹6.5 Cr',
      pros: ['Cost effective', 'Business hours coverage', 'On-call backup'],
      cons: ['Limited night support', '4-hour SLA'],
      confidence: 79
    }
  },
  
  // Additional 3rd recommendation for Rep 1 (Rahul Sharma - North)
  {
    id: 9,
    repId: 1,
    type: 'cross-sell',
    title: 'DevOps Platform for ACCELYA',
    description: 'ACCELYA SOLUTIONS software development can benefit from integrated DevOps automation platform.',
    confidence: 85,
    reason: 'Development cycle analysis shows 40% time spent on manual deployment. DevOps automation would accelerate releases.',
    product: 'Enterprise DevOps Suite',
    estimatedValue: '₹7.8 Cr',
    relatedDeal: 'Digital - Automation',
    company: 'ACCELYA SOLUTIONS INDIA LIMITED',
    region: 'North',
    optionA: {
      title: 'Complete DevOps Platform (Primary)',
      product: 'Full-Stack DevOps Suite',
      value: '₹7.8 Cr',
      pros: ['CI/CD automation', 'Container orchestration', 'Integrated monitoring'],
      cons: ['Learning curve', 'Migration effort'],
      confidence: 85
    },
    optionB: {
      title: 'Basic CI/CD Tools (Alternative)',
      product: 'Essential DevOps Toolkit',
      value: '₹5.2 Cr',
      pros: ['Quick setup', 'Lower cost', 'Easy adoption'],
      cons: ['Limited features', 'Manual steps remain'],
      confidence: 77
    }
  },
  
  // Additional 3rd recommendation for Rep 2 (Priya Mehta - South)
  {
    id: 10,
    repId: 2,
    type: 'cross-sell',
    title: 'Quality Management for ADANI WILMAR',
    description: 'ADANI WILMAR edible oil production needs comprehensive quality tracking system for regulatory compliance.',
    confidence: 83,
    reason: 'Food safety regulations require end-to-end traceability. QMS would ensure compliance and reduce audit risks.',
    product: 'Food Safety QMS Platform',
    estimatedValue: '₹6.9 Cr',
    relatedDeal: 'PBS - Migrations',
    company: 'ADANI WILMAR LIMITED',
    region: 'South',
    optionA: {
      title: 'Enterprise QMS (Primary)',
      product: 'Comprehensive Quality Management System',
      value: '₹6.9 Cr',
      pros: ['Full traceability', 'Compliance automation', 'Real-time alerts'],
      cons: ['Implementation complexity', 'Training required'],
      confidence: 83
    },
    optionB: {
      title: 'Basic Quality Tracking (Alternative)',
      product: 'Essential QMS Module',
      value: '₹4.5 Cr',
      pros: ['Lower cost', 'Quick deployment', 'Core compliance'],
      cons: ['Limited automation', 'Manual reporting'],
      confidence: 75
    }
  },
  
  // Additional 3rd recommendation for Rep 3 (Amit Kumar - East)
  {
    id: 11,
    repId: 3,
    type: 'cross-sell',
    title: 'Testing Automation for ACCELYA',
    description: 'ACCELYA SOLUTIONS IT software projects show high manual testing overhead. Automation would improve quality and speed.',
    confidence: 81,
    reason: 'Current testing cycles take 3 weeks. Automation platform would reduce to 5 days while improving coverage.',
    product: 'Test Automation Platform',
    estimatedValue: '₹5.5 Cr',
    relatedDeal: 'CSD - Apps Development',
    company: 'ACCELYA SOLUTIONS INDIA LIMITED',
    region: 'East',
    optionA: {
      title: 'AI-Powered Testing (Primary)',
      product: 'Intelligent Test Automation Suite',
      value: '₹5.5 Cr',
      pros: ['Self-healing tests', 'Visual AI validation', 'Cross-platform'],
      cons: ['Initial setup time', 'Maintenance learning'],
      confidence: 81
    },
    optionB: {
      title: 'Script-Based Testing (Alternative)',
      product: 'Standard Test Automation',
      value: '₹3.8 Cr',
      pros: ['Proven approach', 'Lower cost', 'Good ROI'],
      cons: ['Manual script maintenance', 'No AI features'],
      confidence: 73
    }
  },
  
  // Additional 3rd recommendation for Rep 4 (Neha Singh - West)
  {
    id: 12,
    repId: 4,
    type: 'cross-sell',
    title: 'Supply Chain Visibility for ADANI WILMAR',
    description: 'ADANI WILMAR distribution network needs real-time tracking for oil shipments across West region.',
    confidence: 86,
    reason: 'Current blind spots in logistics cause delays. End-to-end visibility would reduce delivery time by 25%.',
    product: 'Supply Chain Control Tower',
    estimatedValue: '₹8.3 Cr',
    relatedDeal: 'ERD - Smart Services',
    company: 'ADANI WILMAR LIMITED',
    region: 'West',
    optionA: {
      title: 'Control Tower Platform (Primary)',
      product: 'Complete Supply Chain Visibility',
      value: '₹8.3 Cr',
      pros: ['Real-time tracking', 'Predictive alerts', 'Multi-modal visibility'],
      cons: ['Integration complexity', 'Change management'],
      confidence: 86
    },
    optionB: {
      title: 'Basic Tracking Dashboard (Alternative)',
      product: 'Essential Logistics Monitor',
      value: '₹5.7 Cr',
      pros: ['Quick implementation', 'Lower cost', 'Core tracking'],
      cons: ['Limited predictive features', 'Manual interventions'],
      confidence: 78
    }
  },

  // ========== MORE RECOMMENDATIONS - 5 per Rep ==========

  // Rep 1 (Rahul Sharma - North) - More Recommendations
  {
    id: 13,
    repId: 1,
    type: 'upsell',
    title: 'Advanced Security for ADANI GREEN',
    description: 'Upgrade security infrastructure for ADANI GREEN ENERGY power generation facilities in North region.',
    confidence: 79,
    reason: 'Critical infrastructure requires enhanced security. Recent industry attacks show need for advanced protection.',
    product: 'Industrial Security Suite',
    estimatedValue: '₹6.5 Cr',
    relatedDeal: 'ERD - Engg OS Services',
    company: 'ADANI GREEN ENERGY LIMITED',
    region: 'North'
  },
  {
    id: 14,
    repId: 1,
    type: 'cross-sell',
    title: 'Mobile Workforce Management for ACCELYA',
    description: 'ACCELYA SOLUTIONS field teams need mobile-first tools for remote client support and deployment.',
    confidence: 76,
    reason: '60% of client engagements require on-site work. Mobile platform would improve efficiency by 45%.',
    product: 'Field Service Management Platform',
    estimatedValue: '₹5.8 Cr',
    relatedDeal: 'Consulting - Compliance',
    company: 'ACCELYA SOLUTIONS INDIA LIMITED',
    region: 'North'
  },
  {
    id: 15,
    repId: 1,
    type: 'upsell',
    title: 'Disaster Recovery for ADANI WILMAR',
    description: 'Implement comprehensive DR solution for ADANI WILMAR production data and systems.',
    confidence: 74,
    reason: 'Single data center creates risk. DR solution ensures business continuity with 99.99% uptime.',
    product: 'Enterprise Disaster Recovery',
    estimatedValue: '₹7.2 Cr',
    relatedDeal: 'Infra - Workplace Services',
    company: 'ADANI WILMAR LIMITED',
    region: 'North'
  },
  {
    id: 16,
    repId: 1,
    type: 'cross-sell',
    title: 'Customer Portal for ACCELYA',
    description: 'ACCELYA SOLUTIONS clients requesting self-service portal for ticket management and documentation.',
    confidence: 71,
    reason: 'Customer surveys show 80% prefer self-service. Portal would reduce support calls by 40%.',
    product: 'Customer Experience Portal',
    estimatedValue: '₹4.9 Cr',
    relatedDeal: 'CSD - Apps Development',
    company: 'ACCELYA SOLUTIONS INDIA LIMITED',
    region: 'North'
  },
  {
    id: 17,
    repId: 1,
    type: 'upsell',
    title: 'Performance Optimization for ADANI GREEN',
    description: 'Optimize application performance and database queries for ADANI GREEN ENERGY systems.',
    confidence: 68,
    reason: 'System response times degrading. Optimization would improve user satisfaction by 50%.',
    product: 'Performance Tuning Services',
    estimatedValue: '₹3.8 Cr',
    relatedDeal: 'Consulting - Enterprise Planning',
    company: 'ADANI GREEN ENERGY LIMITED',
    region: 'North'
  },

  // Rep 2 (Priya Mehta - South) - More Recommendations
  {
    id: 18,
    repId: 2,
    type: 'cross-sell',
    title: 'Asset Tracking for ADANI GREEN',
    description: 'ADANI GREEN ENERGY needs RFID-based asset management for equipment across South region solar farms.',
    confidence: 80,
    reason: 'Manual asset tracking causing inventory discrepancies. RFID solution would provide 99% accuracy.',
    product: 'RFID Asset Management System',
    estimatedValue: '₹6.8 Cr',
    relatedDeal: 'Digital - Automation',
    company: 'ADANI GREEN ENERGY LIMITED',
    region: 'South'
  },
  {
    id: 19,
    repId: 2,
    type: 'upsell',
    title: 'Data Warehouse for ACCELYA',
    description: 'Upgrade to enterprise data warehouse for ACCELYA SOLUTIONS analytics and reporting needs.',
    confidence: 77,
    reason: 'Current databases struggling with reporting. Data warehouse would enable real-time business insights.',
    product: 'Enterprise Data Warehouse',
    estimatedValue: '₹8.5 Cr',
    relatedDeal: 'Digital - Data Engineering',
    company: 'ACCELYA SOLUTIONS INDIA LIMITED',
    region: 'South'
  },
  {
    id: 20,
    repId: 2,
    type: 'cross-sell',
    title: 'Predictive Analytics for ADANI WILMAR',
    description: 'ADANI WILMAR production planning can benefit from AI-powered demand forecasting platform.',
    confidence: 75,
    reason: 'Current forecasting accuracy 65%. AI platform would increase to 90% and reduce waste by 30%.',
    product: 'AI Demand Forecasting Platform',
    estimatedValue: '₹5.9 Cr',
    relatedDeal: 'ERD - Embedded Systems',
    company: 'ADANI WILMAR LIMITED',
    region: 'South'
  },
  {
    id: 21,
    repId: 2,
    type: 'upsell',
    title: 'Compliance Automation for ADANI GREEN',
    description: 'Automate regulatory compliance reporting for ADANI GREEN ENERGY renewable energy certifications.',
    confidence: 72,
    reason: 'Manual compliance reporting takes 200 hours/month. Automation would reduce to 20 hours.',
    product: 'Regulatory Compliance Platform',
    estimatedValue: '₹4.7 Cr',
    relatedDeal: 'CySec - CySec-Architecture',
    company: 'ADANI GREEN ENERGY LIMITED',
    region: 'South'
  },
  {
    id: 22,
    repId: 2,
    type: 'cross-sell',
    title: 'Vendor Management for ACCELYA',
    description: 'ACCELYA SOLUTIONS needs centralized vendor and procurement management system.',
    confidence: 69,
    reason: 'Managing 500+ vendors manually. System would streamline procurement and save 25% costs.',
    product: 'Vendor Management System',
    estimatedValue: '₹3.9 Cr',
    relatedDeal: 'PBS - Migrations',
    company: 'ACCELYA SOLUTIONS INDIA LIMITED',
    region: 'South'
  },

  // Rep 3 (Amit Kumar - East) - More Recommendations
  {
    id: 23,
    repId: 3,
    type: 'upsell',
    title: 'Advanced Reporting for ADANI GREEN',
    description: 'Upgrade to executive dashboard with real-time KPIs for ADANI GREEN ENERGY East operations.',
    confidence: 78,
    reason: 'Leadership requires faster insights. Advanced reporting would enable data-driven decisions.',
    product: 'Executive Intelligence Dashboard',
    estimatedValue: '₹5.2 Cr',
    relatedDeal: 'ERD - PLM Services',
    company: 'ADANI GREEN ENERGY LIMITED',
    region: 'East'
  },
  {
    id: 24,
    repId: 3,
    type: 'cross-sell',
    title: 'Document Management for ADANI WILMAR',
    description: 'ADANI WILMAR operations need centralized document management for compliance and quality records.',
    confidence: 76,
    reason: 'Paper-based processes causing delays. Digital document system would improve retrieval by 80%.',
    product: 'Enterprise Document Management',
    estimatedValue: '₹4.8 Cr',
    relatedDeal: 'PBS - Customization',
    company: 'ADANI WILMAR LIMITED',
    region: 'East'
  },
  {
    id: 25,
    repId: 3,
    type: 'upsell',
    title: 'API Management for ACCELYA',
    description: 'ACCELYA SOLUTIONS requires API gateway for secure third-party integrations.',
    confidence: 73,
    reason: 'Growing partner ecosystem needs secure API access. Gateway would enable scalable integrations.',
    product: 'API Management Platform',
    estimatedValue: '₹6.1 Cr',
    relatedDeal: 'Digital - AI & Analytics',
    company: 'ACCELYA SOLUTIONS INDIA LIMITED',
    region: 'East'
  },
  {
    id: 26,
    repId: 3,
    type: 'cross-sell',
    title: 'Maintenance Scheduling for ADANI GREEN',
    description: 'ADANI GREEN ENERGY needs automated maintenance scheduling for wind and solar assets.',
    confidence: 70,
    reason: 'Manual scheduling creating downtime. Automation would increase asset availability by 15%.',
    product: 'Maintenance Automation System',
    estimatedValue: '₹5.5 Cr',
    relatedDeal: 'Digital - Data Management',
    company: 'ADANI GREEN ENERGY LIMITED',
    region: 'East'
  },
  {
    id: 27,
    repId: 3,
    type: 'upsell',
    title: 'Collaboration Tools for ADANI WILMAR',
    description: 'Upgrade to enterprise collaboration platform for ADANI WILMAR distributed teams.',
    confidence: 67,
    reason: 'Remote teams struggling with coordination. Modern tools would improve productivity by 30%.',
    product: 'Enterprise Collaboration Suite',
    estimatedValue: '₹4.2 Cr',
    relatedDeal: 'Digital - AI & Analytics',
    company: 'ADANI WILMAR LIMITED',
    region: 'East'
  },

  // Rep 4 (Neha Singh - West) - More Recommendations
  {
    id: 28,
    repId: 4,
    type: 'cross-sell',
    title: 'Workforce Analytics for ADANI GREEN',
    description: 'ADANI GREEN ENERGY West operations need HR analytics for workforce optimization.',
    confidence: 77,
    reason: 'High turnover in field operations. Analytics would identify retention strategies and reduce costs.',
    product: 'HR Analytics Platform',
    estimatedValue: '₹5.6 Cr',
    relatedDeal: 'CSD - Apps Management',
    company: 'ADANI GREEN ENERGY LIMITED',
    region: 'West'
  },
  {
    id: 29,
    repId: 4,
    type: 'upsell',
    title: 'Enhanced Monitoring for ACCELYA',
    description: 'Upgrade to AI-powered application monitoring for ACCELYA SOLUTIONS production systems.',
    confidence: 74,
    reason: 'Current monitoring reactive. AI monitoring predicts issues before impact, reducing downtime 70%.',
    product: 'AI Application Monitoring',
    estimatedValue: '₹6.9 Cr',
    relatedDeal: 'Digital - Data Engineering',
    company: 'ACCELYA SOLUTIONS INDIA LIMITED',
    region: 'West'
  },
  {
    id: 30,
    repId: 4,
    type: 'cross-sell',
    title: 'Training Platform for ADANI WILMAR',
    description: 'ADANI WILMAR needs e-learning platform for employee training and compliance in West facilities.',
    confidence: 72,
    reason: 'Manual training inefficient and costly. Digital platform would reduce training time by 50%.',
    product: 'Corporate Learning Management System',
    estimatedValue: '₹4.3 Cr',
    relatedDeal: 'ERD - Smart Services',
    company: 'ADANI WILMAR LIMITED',
    region: 'West'
  },
  {
    id: 31,
    repId: 4,
    type: 'upsell',
    title: 'Network Optimization for ACCELYA',
    description: 'Optimize network infrastructure for ACCELYA SOLUTIONS cloud and hybrid deployments.',
    confidence: 69,
    reason: 'Network latency affecting performance. Optimization would improve response times by 60%.',
    product: 'Network Performance Optimization',
    estimatedValue: '₹5.8 Cr',
    relatedDeal: 'CSD - Apps Management',
    company: 'ACCELYA SOLUTIONS INDIA LIMITED',
    region: 'West'
  },
  {
    id: 32,
    repId: 4,
    type: 'cross-sell',
    title: 'Environmental Monitoring for ADANI GREEN',
    description: 'ADANI GREEN ENERGY requires environmental impact tracking for renewable energy projects.',
    confidence: 66,
    reason: 'ESG reporting requirements increasing. Monitoring system ensures compliance and transparency.',
    product: 'Environmental Impact Management',
    estimatedValue: '₹3.7 Cr',
    relatedDeal: 'Digital - Data Engineering',
    company: 'ADANI GREEN ENERGY LIMITED',
    region: 'West'
  }
];

// Activity Types
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
    repId: 2,
    repName: 'Priya Mehta',
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
    repId: 2,
    repName: 'Priya Mehta',
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
    repId: 2,
    repName: 'Priya Mehta',
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
    repId: 3,
    repName: 'Amit Kumar',
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
    repId: 3,
    repName: 'Amit Kumar',
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
    repId: 4,
    repName: 'Neha Singh',
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
    repId: 2,
    repName: 'Priya Mehta',
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
    repId: 3,
    repName: 'Amit Kumar',
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
    repId: 4,
    repName: 'Neha Singh',
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

// Get activities for a specific rep
export const getRepActivities = (repId, date = '2026-02-20') => {
  return dailyActivities.filter(activity => 
    activity.repId === repId && activity.date === date
  );
};

// Get AI suggestions for a rep
export const getAISuggestions = (repId) => {
  const suggestions = aiSuggestedAgenda.find(agenda => agenda.repId === repId);
  return suggestions ? suggestions.suggestions : [];
};

// Get target companies for a rep
export const getTargetCompanies = (repId) => {
  const targets = targetCompanies.find(t => t.repId === repId);
  return targets ? targets.targets : [];
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

// Generate accounts from real deals data
export const generateAccountsFromDeals = (repId = null) => {
  // Filter deals by rep if repId is provided
  const relevantDeals = repId ? allDeals.filter(d => d.repId === repId) : allDeals;
  
  // Group deals by company
  const accountsMap = {};
  
  relevantDeals.forEach(deal => {
    const companyKey = deal.company;
    
    if (!accountsMap[companyKey]) {
      // Initialize account object
      accountsMap[companyKey] = {
        id: companyKey.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        name: deal.company,
        industry: deal.sector || deal.industry || 'Technology',
        revenue: 0,
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
    
    // Aggregate data
    accountsMap[companyKey].revenue += deal.value * 10000000; // Convert Cr to rupees
    accountsMap[companyKey].opportunities += 1;
    accountsMap[companyKey].deals.push(deal);
  });
  
  // Convert to array and format
  const accounts = Object.values(accountsMap).map(account => ({
    ...account,
    revenue: `₹${(account.revenue / 10000000).toFixed(0)} Cr`,
    deals: undefined // Remove deals array from final output
  }));
  
  return accounts;
};

// Get accounts by rep ID
export const getAccountsByRepId = (repId) => {
  return generateAccountsFromDeals(repId);
};

// Get all accounts (for Sales Head)
export const getAllAccounts = () => {
  return generateAccountsFromDeals();
};

// Get accounts by manager ID (aggregates accounts from team members)
export const getAccountsByManagerId = (managerId) => {
  const teamMembers = getTeamMembersByManagerId(managerId);
  const teamRepIds = teamMembers.map(rep => rep.id);
  
  // Get deals from all team members
  const teamDeals = allDeals.filter(deal => teamRepIds.includes(deal.repId));
  
  // Use the same aggregation logic but with filtered deals
  const accountsMap = {};
  
  teamDeals.forEach(deal => {
    const companyKey = deal.company;
    
    if (!accountsMap[companyKey]) {
      accountsMap[companyKey] = {
        id: companyKey.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        name: deal.company,
        industry: deal.sector || deal.industry || 'General',
        revenue: 0,
        employees: deal.companySize ? `${deal.companySize}+` : 'Not Available',
        location: deal.location || 'India',
        status: 'Active',
        opportunities: 0,
        deals: []
      };
    }
    
    // Sum up revenue (deal.value is in Cr, convert to actual value for summing)
    accountsMap[companyKey].revenue += deal.value * 10000000; // Convert Cr to actual value
    accountsMap[companyKey].opportunities += 1;
    accountsMap[companyKey].deals.push(deal);
  });
  
  // Format and return
  const accounts = Object.values(accountsMap).map(account => ({
    ...account,
    revenue: `₹${(account.revenue / 10000000).toFixed(0)} Cr`,
    deals: undefined // Remove deals array from final output
  }));
  
  return accounts;
};
