# Cross Sync - Connected Data Architecture

## Overview
All three user levels (Sales Rep, Sales Manager, Sales Head) now share a unified data source located in `/src/data/sharedData.js`. This creates a realistic demo where data flows from individual deals → team performance → strategic insights.

---

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      SHARED DATA SOURCE                          │
│                   /src/data/sharedData.js                        │
└─────────────────────────────────────────────────────────────────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
                    ▼            ▼            ▼
         ┌──────────────┐ ┌──────────┐ ┌────────────┐
         │  Sales Rep   │ │  Sales   │ │ Sales Head │
         │   (Rahul)    │ │ Manager  │ │ (Strategic)│
         └──────────────┘ └──────────┘ └────────────┘
```

---

## Connected Data Elements

### 1. **Sales Rep Level** (Individual Contributor)
**Files:** `SalesforceAccount.jsx`, `AIRecommendations.jsx`

**Connected Data:**
- **Deals**: Shows Tata Motors deals from `allDeals` array
  - Commercial Vehicle Fleet Order (₹4.5 Cr)
  - Tata Motors Telematics (₹3.2 Cr)
  - Spare Parts Annual Contract (₹1.8 Cr)
  
- **AI Recommendations**: From `aiRecommendations` array
  - EV Charging Infrastructure (92% confidence)
  - Premium Fleet Maintenance (87% confidence)
  - Telematics & Fleet Monitoring (78% confidence)

**Real Connection:**
- When Sales Rep views "Tata Motors Telematics" deal:
  - This same deal appears in Sales Manager's "High-Risk Deals" section
  - It's counted in Sales Head's "Revenue at Risk" metrics
  - Rep's manager "Rajesh Kumar" owns this in their pipeline

---

### 2. **Sales Manager Level** (Team Performance)
**File:** `SalesManagerDashboard.jsx`

**Connected Data:**

#### A. High-Risk Deals (from `getHighRiskDeals()`)
- **Mahindra Fleet Management** - Rahul's deal
- **TVS Motor Supply Chain** - Priya's deal  
- **Ashok Leyland Service Portal** - Amit's deal

Each deal shows:
- Rep name (matches sales reps in system)
- Deal value (aggregates into pipeline metrics)
- Risk factors (flow up to Sales Head risk analysis)

#### B. Rep Performance (from `repPerformanceData`)
- **Rahul Sharma**: 
  - Active deals: Calculated from `allDeals` where `repId = 1`
  - Pipeline: Sum of all Rahul's deal values
  - Shows specific coaching needs based on his deals

- **Priya Mehta**, **Amit Kumar**, **Sneha Reddy**: 
  - All metrics dynamically calculated from shared data

#### C. Intervention Queue (from `interventionQueueData`)
- "Coach Rahul on multi-threading" → Links to Tata Motors Telematics deal
- "Join call for Bajaj Auto Fleet" → Links to actual deal in pipeline
- "Review demo with Priya" → Links to Hero MotoCorp deal

#### D. Forecast Alert (from `forecastAlertData`)
- Gap analysis references real deals:
  - "Move Mahindra deal (₹2.4 Cr)" → Actual deal in system
  - "Fast-track Tata Motors opportunity" → Rep's active deal

---

### 3. **Sales Head Level** (Strategic Intelligence)
**File:** `SalesHeadDashboard.jsx`

**Connected Data:**

#### A. Strategic KPIs (from `calculateStrategicKPIs()`)
- **Total Pipeline**: Sum of ALL deals in `allDeals` array
- **Revenue at Risk**: Sum of deals with status = 'high-risk', 'critical', 'at-risk'
- **Risk Percentage**: Dynamically calculated from real deal data

#### B. Pipeline Risk by Region (from `getRegionalMetrics()`)
- **North Region**: 
  - Pipeline: Sum of all Rahul's + other North deals
  - Risk: Calculated from deals with risks in North
  - Managed by: Rajesh Kumar (Sales Manager)
  
- **South/East/West**: All calculated from actual regional deals

#### C. Manager Effectiveness (from `managerPerformanceData`)
- **Rajesh Kumar (North Manager)**:
  - Pipeline: Aggregated from his team's deals
  - Team includes: Rahul Sharma
  - Metrics reflect actual team performance

- **Priya Sharma**, **Amit Patel**, **Sneha Reddy**: 
  - All managers' pipelines calculated from their regions

#### D. Pattern Insights (from `patternInsights`)
- Insights derived from cross-tenant analysis
- Recommendations affect all levels (multi-stakeholder, discounts, demos)

---

## Real-Time Demo Flow Example

### Scenario: "Tata Motors Telematics Deal"

1. **Sales Rep View** (Rahul Sharma)
   - Views deal in Salesforce Account page
   - Value: ₹3.2 Cr
   - Status: Negotiation
   - Gets AI recommendation for related Telematics upsell

2. **Sales Manager View** (Rajesh Kumar)
   - Sees same deal in "High-Risk Deals" section
   - Risk factors shown: Stalled 18 days, No executive sponsor
   - Action item: "Coach Rahul on multi-threading"
   - Intervention Queue: "Review stakeholder map this week"

3. **Sales Head View** (Strategic)
   - Deal contributes to:
     - Total Pipeline calculation
     - "Revenue at Risk" (₹3.2 Cr counted)
     - North Region risk percentage
     - Rajesh Kumar's team pipeline
   - Pattern insight applied: "Multi-stakeholder advantage" recommendation

---

## Data Calculation Functions

### Key Utility Functions in `sharedData.js`:

1. **`getRepMetrics(repId)`**
   - Filters deals by rep
   - Calculates: activeDeals, pipeline, highRiskCount, avgEngagement
   - Used by: Sales Manager dashboard

2. **`getRegionalMetrics(region)`**
   - Filters deals by region
   - Calculates: pipeline, risk, riskPercent, deal count
   - Used by: Sales Head dashboard

3. **`calculateStrategicKPIs()`**
   - Aggregates all deals
   - Returns: totalPipeline, revenueAtRisk, riskPercentage
   - Used by: Sales Head KPI cards

4. **`getHighRiskDeals()`**
   - Filters deals with status: 'high-risk', 'critical'
   - Generates action recommendations
   - Used by: Sales Manager high-risk section

---

## Benefits of Connected Data

✅ **Consistency**: All dashboards show the same underlying reality
✅ **Realistic Demo**: Changes in one level reflect in others
✅ **Easy Updates**: Modify `sharedData.js` to update entire system
✅ **Traceability**: Can follow a single deal through all three levels
✅ **Scalability**: Add new deals/reps without changing component logic

---

## How to Add New Data

### To add a new deal:
```javascript
// In sharedData.js, add to allDeals array:
{
  id: 10,
  name: 'New Deal Name',
  company: 'Company Name',
  value: 2.5,
  valueFormatted: '₹2.5 Cr',
  stage: 'Proposal',
  closeDate: 'Mar 30, 2026',
  repId: 1, // Assign to rep
  repName: 'Rahul Sharma',
  region: 'North',
  manager: 'Rajesh Kumar',
  status: 'healthy', // or 'high-risk', 'critical'
  stakeholders: 3,
  engagementScore: 75
}
```

### To add a new sales rep:
```javascript
// In sharedData.js, add to salesReps array and repPerformanceData
// Then assign deals with their repId
```

---

## Current Data Snapshot

**Total Deals in System**: 9 deals
**Total Pipeline Value**: ₹29.5 Cr
**Sales Reps**: 4 (Rahul, Priya, Amit, Sneha)
**Sales Managers**: 4 (Rajesh, Priya Sharma, Amit Patel, Sneha Reddy)
**Regions**: 4 (North, South, East, West)
**Companies**: Tata Motors, Mahindra, TVS Motor, Hero MotoCorp, Bajaj Auto, Ashok Leyland

---

## Testing the Connections

1. Login as **Sales Rep** → View Tata Motors deals
2. Login as **Sales Manager** → See Rahul's deals in high-risk section
3. Login as **Sales Head** → See aggregated metrics from all deals
4. Verify the same ₹3.2 Cr "Tata Motors Telematics" deal appears in all three views with appropriate context

---

**Last Updated**: February 20, 2026
**Version**: 1.0 - Initial Connected Data Implementation
