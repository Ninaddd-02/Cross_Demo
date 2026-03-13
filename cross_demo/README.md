# Cross Sync - Automotive Industry Sales Recommendation Engine UI

A premium, enterprise-grade dark theme UI for the Cross Sync recommendation engine, built with React for the automotive manufacturing industry, following modern design patterns.

## Features

### Admin Dashboard
- **System Overview**: Real-time KPIs and performance metrics
- **Data Source Management**: Connect CRM systems, ERP, databases, and CSV files
- **Field Mapping**: Configure source-to-schema mappings
- **Model Training**: Initiate and monitor ML training processes
- **Engine Monitoring**: Track accuracy, drift detection, and system health

### Sales User Experience
- **Account Management**: Automotive manufacturer and dealer account views
- **AI Recommendations**: Personalized cross-sell, upsell, and priority insights for vehicles, parts, and services
- **Action Tracking**: Log user decisions and outcomes
- **Feedback Loop**: Collect feedback to improve model accuracy
- **Retraining Visualization**: See how feedback improves the system

## Technology Stack

- **React 18** - UI framework
- **React Router v6** - Navigation
- **Lucide React** - Icon library
- **Vite** - Build tool
- **CSS3** - Custom styling with glassmorphism effects

## Design System

- **Dark Theme**: Deep navy/charcoal backgrounds (#0B1220, #0E1A2B)
- **Primary Color**: Salesforce Blue (#1B96FF)
- **Accents**: Cyan (#22D3EE), Purple (#A855F7), Green (#22C55E)
- **Typography**: Inter font family
- **Effects**: Glassmorphism cards, glow effects, smooth animations

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
cross-synch-ui/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── GlassCard/
│   │   ├── GradientButton/
│   │   ├── StatusBadge/
│   │   ├── SidebarNavigation/
│   │   ├── TopNavbar/
│   │   ├── ProgressRing/
│   │   └── AIRecommendationCard/
│   ├── pages/              # Application screens
│   │   ├── Login/
│   │   ├── AdminDashboard/
│   │   ├── ConnectDataSource/
│   │   ├── MapFields/
│   │   ├── TrainModel/
│   │   ├── MonitorEngine/
│   │   ├── SalesforceAccount/
│   │   ├── AIRecommendations/
│   │   ├── ActionConfirmation/
│   │   ├── Feedback/
│   │   └── RetrainVisualization/
│   ├── App.jsx             # Main app with routing
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── index.html
├── package.json
└── vite.config.js
```

## User Flows

### Admin Flow
1. Login → Admin Dashboard
2. Connect Data Source
3. Map Fields to Schema
4. Train Model
5. Monitor Engine Performance

### Sales User Flow
1. Login → Salesforce Account View
2. View AI Recommendations
3. Accept/Apply Recommendation
4. Provide Feedback
5. See Retraining Cycle

## Key Features

### Black-Box ML Architecture
- Backend Python ML engine (not exposed in UI)
- API-driven interactions only
- Focus on configuration and observability

### Feedback Loop
- User actions logged automatically
- Feedback improves model accuracy
- Visual representation of continuous learning

### Enterprise Design
- Professional, polished interface
- Responsive layouts
- Accessibility considerations
- Smooth animations and transitions

## Development

The application uses:
- **Component-based architecture** for reusability
- **React Router** for navigation between screens
- **CSS Modules** pattern with dedicated stylesheets
- **Modular design** for easy maintenance

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

Proprietary - Cross Sync Enterprise Solution

## Contact

For questions or support, contact the Cross Sync development team.
