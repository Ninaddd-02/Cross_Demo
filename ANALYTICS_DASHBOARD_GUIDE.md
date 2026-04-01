# Analytics Dashboard - Implementation Guide

## Overview

A comprehensive visual analytics dashboard built with React + Vite and Recharts, transforming KPI data into interactive charts for better business insights.

## Features Implemented

### 📊 Chart Components (6 Types)

1. **Revenue Bar Chart** (`RevenueBarChart.jsx`)
   - Compares Cross-Sell Revenue vs Upsell Revenue
   - Colors: Green (Cross-Sell), Orange (Upsell)
   - Format: Vertical bar chart with revenue in Crores

2. **Wins Donut Chart** (`WinsDonutChart.jsx`)
   - Shows distribution of Cross-Sell Wins vs Upsell Wins
   - Interactive donut chart with total count in center
   - Displays percentages on hover

3. **Conversion Gauge** (`ConversionGauge.jsx`)
   - Displays Recommendation Conversion Rate (26.8%)
   - Color: Blue (Conversion)
   - Semi-circular gauge with percentage display

4. **Team Conversion Chart** (`TeamConversionChart.jsx`)
   - Grouped bar chart comparing Team Cross-Sell vs Upsell rates
   - Colors: Green (Cross-Sell), Orange (Upsell)
   - Shows percentage rates for both metrics

5. **Cycle Time Trend Chart** (`CycleTimeTrendChart.jsx`)
   - Line chart showing Recommendation to Win cycle time trend
   - Color: Purple (Revenue/Cycle Time)
   - Includes target line and historical data
   - Responds to time period filters (3M, 6M, 1Y)

6. **Top Performers Chart** (`TopPerformersChart.jsx`)
   - Horizontal bar chart highlighting top sales reps
   - Shows top rep by revenue and conversion rate
   - Colors: Purple (Revenue), Blue (Conversion)

### 🎨 UI/UX Features

- **Modern Glass-morphism Design**: Cards with glass effect and blur
- **Fully Responsive**: Mobile, tablet, and desktop optimized
- **Color Coding**:
  - Blue → Conversion metrics
  - Green → Cross-sell metrics
  - Orange → Upsell metrics
  - Purple → Revenue/performance metrics

- **Interactive Elements**:
  - Tooltips on all charts
  - Legends for multi-series charts
  - Hover effects on cards and filters
  - Loading state with spinner animation

- **Time Period Filters**: 3M, 6M, 1Y buttons
- **Refresh Button**: Manual data refresh
- **Key Insights Section**: Summary cards showing top metrics

### 📁 File Structure

```
src/
├── components/
│   └── Charts/
│       ├── RevenueBarChart.jsx
│       ├── WinsDonutChart.jsx
│       ├── ConversionGauge.jsx
│       ├── TeamConversionChart.jsx
│       ├── CycleTimeTrendChart.jsx
│       └── TopPerformersChart.jsx
└── pages/
    └── AnalyticsDashboard/
        ├── AnalyticsDashboard.jsx
        └── AnalyticsDashboard.css
```

## Data Mapping

### KPI Source Data

```json
{
  "SalesHead": {
    "CrossSellRevenue": 742860000,
    "UpsellRevenue": 442560000,
    "TopCrossSellService": "Digital",
    "TopUpsellService": "Data Engineering",
    "TopRegionByRecommendationRevenue": "West"
  },
  "SalesManager": {
    "TeamCrossSellConversionRate": 24.8,
    "TeamUpsellConversionRate": 19.6,
    "RecommendationToWinCycleTimeDays": 32.4,
    "TopSalesRepByRecommendationRevenue": "Rahul Sharma",
    "TopSalesRepByRecommendationConversionRate": "Neha Singh"
  },
  "SalesRep": {
    "RecommendationConversionRate": 26.8,
    "CrossSellWins": 68,
    "UpsellWins": 42,
    "TopRecommendedAccount": "ACCELYA SOLUTIONS INDIA LIMITED"
  }
}
```

### Chart Data Mapping

| Chart | Data Source | KPIs Used |
|-------|------------|-----------|
| Revenue Bar Chart | `calculateHeadKPIs()` | CrossSellRevenue, UpsellRevenue |
| Wins Donut Chart | `calculateRepKPIs()` | CrossSellWins, UpsellWins |
| Conversion Gauge | `calculateRepKPIs()` | RecommendationConversionRate |
| Team Conversion | `calculateManagerKPIs()` | TeamCrossSellConversionRate, TeamUpsellConversionRate |
| Cycle Time Trend | `calculateManagerKPIs()` | RecommendationToWinCycleTimeDays |
| Top Performers | `calculateManagerKPIs()` | TopSalesRepByRecommendationRevenue, TopSalesRepByRecommendationConversionRate |

## Routing

- **Path**: `/sales-head/analytics`
- **Access**: Sales Head role only
- **Navigation**: Available in sidebar under "Analytics"

## Usage

### 1. Access the Dashboard

```javascript
// Navigate to analytics page
navigate('/sales-head/analytics');
```

### 2. Time Period Filtering

Click on period buttons (3M, 6M, 1Y) to adjust the time range for trend charts.

### 3. Manual Refresh

Click the "Refresh" button to reload KPI data.

### 4. Chart Interactions

- **Hover**: View detailed tooltips with formatted values
- **Click**: Legends to show/hide series (on applicable charts)

## Component API

### RevenueBarChart

```jsx
<RevenueBarChart 
  crossSellRevenue={742860000}  // Number in base currency
  upsellRevenue={442560000}     // Number in base currency
/>
```

### WinsDonutChart

```jsx
<WinsDonutChart 
  crossSellWins={68}   // Integer count
  upsellWins={42}      // Integer count
/>
```

### ConversionGauge

```jsx
<ConversionGauge 
  conversionRate={26.8}  // Percentage (0-100)
/>
```

### TeamConversionChart

```jsx
<TeamConversionChart 
  crossSellRate={24.8}  // Percentage
  upsellRate={19.6}     // Percentage
/>
```

### CycleTimeTrendChart

```jsx
<CycleTimeTrendChart 
  currentCycleTime={32.4}  // Number of days
  timePeriod="6M"          // "3M", "6M", or "1Y"
/>
```

### TopPerformersChart

```jsx
<TopPerformersChart 
  topRepRevenue="Rahul Sharma"         // String name
  topRepConversion="Neha Singh"        // String name
/>
```

## Customization

### Update Colors

Edit chart fill colors in individual component files:

```javascript
// Example: Change cross-sell color in RevenueBarChart.jsx
{
  name: 'Cross-Sell',
  revenue: crossSellRevenue / 10000000,
  fill: '#22c55e'  // Change this hex value
}
```

### Modify Chart Layout

Adjust grid layout in `AnalyticsDashboard.css`:

```css
.analytics-grid {
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
}
```

### Add New Charts

1. Create new chart component in `src/components/Charts/`
2. Import in `AnalyticsDashboard.jsx`
3. Add to analytics grid with appropriate card size class
4. Update data props from KPI functions

## Dependencies

- **recharts** - Chart library (already installed)
- **lucide-react** - Icons (already installed)
- **react-router-dom** - Routing (already installed)

## Performance Notes

- Charts use `ResponsiveContainer` for automatic resizing
- Loading state implemented to prevent render blocking
- KPI calculations memoized with `useMemo`
- Auto-refresh on tenant change

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (with `-webkit-backdrop-filter` fallback)
- Mobile browsers: Responsive design with touch support

## Troubleshooting

### Charts not displaying

1. Verify Recharts is installed: `npm list recharts`
2. Check console for errors
3. Ensure data props are numbers, not strings

### Layout issues on mobile

- Check responsive breakpoints in CSS
- Verify viewport meta tag in HTML

### Data not updating

1. Check if `refreshKey` state is incrementing
2. Verify KPI functions are being called
3. Ensure tenant data is loaded

## Future Enhancements

- [ ] Export charts as images/PDF
- [ ] Add date range picker for custom periods
- [ ] Drill-down to detailed views
- [ ] Real-time data updates
- [ ] Chart configuration panel
- [ ] Comparison modes (YoY, MoM)
- [ ] Custom KPI builder

## Support

For issues or questions, refer to:
- Recharts documentation: https://recharts.org/
- Project codebase: `cross_demo/src/`
