# Sales Hierarchy & Access Control Guide

## Organizational Structure

```
SALES HEAD / VP
└── Vikram Singh
    │
    ├── MANAGER 1: Rajesh Kumar (North Region)
    │   ├── Rep 1: Rahul Sharma (Automotive OEM)
    │   └── Rep 2: Priya Mehta (Manufacturing & Industrial)
    │
    └── MANAGER 2: Priya Sharma (South Region)
        ├── Rep 3: Amit Kumar (Technology & IT Services)
        └── Rep 4: Neha Singh (Pharma & Healthcare)
```

## User Accounts & Login Credentials

### Sales Head / VP
- **Name:** Vikram Singh
- **Email:** vikram.singh@company.com
- **Password:** vp123
- **Security Token:** VP2026TOKEN
- **Access:** Full visibility across all regions, managers, and representatives

### Manager 1 (North Region)
- **Name:** Rajesh Kumar
- **Email:** rajesh.kumar@company.com
- **Password:** manager123
- **Security Token:** MGR2026TOKEN
- **Team:** Rep 1 (Rahul Sharma), Rep 2 (Priya Mehta)
- **Access:** Can only view data of Rep 1 and Rep 2

### Manager 2 (South Region)
- **Name:** Priya Sharma
- **Email:** priya.sharma@company.com
- **Password:** manager123
- **Security Token:** MGR2026TOKEN
- **Team:** Rep 3 (Amit Kumar), Rep 4 (Neha Singh)
- **Access:** Can only view data of Rep 3 and Rep 4

### Sales Representative 1 (North Region)
- **Name:** Rahul Sharma
- **Email:** rahul.sharma@company.com
- **Password:** sales123
- **Security Token:** REP2026TOKEN
- **Manager:** Rajesh Kumar
- **Access:** Can only view own data

### Sales Representative 2 (North Region)
- **Name:** Priya Mehta
- **Email:** priya.mehta@company.com
- **Password:** sales123
- **Security Token:** REP2026TOKEN
- **Manager:** Rajesh Kumar
- **Access:** Can only view own data

### Sales Representative 3 (South Region)
- **Name:** Amit Kumar
- **Email:** amit.kumar@company.com
- **Password:** sales123
- **Security Token:** REP2026TOKEN
- **Manager:** Priya Sharma
- **Access:** Can only view own data

### Sales Representative 4 (South Region)
- **Name:** Neha Singh
- **Email:** neha.singh@company.com
- **Password:** sales123
- **Security Token:** REP2026TOKEN
- **Manager:** Priya Sharma
- **Access:** Can only view own data

## Data Access Rules

### Sales Head / VP (Vikram Singh)
✅ **CAN ACCESS:**
- All data from all managers and representatives
- View all regions (North, South)
- Dashboard shows aggregated metrics across entire organization
- Manager Analytics shows performance of both managers
- Team Recommendations shows all reps' recommendations

❌ **CANNOT ACCESS:**
- N/A (Full access)

### Sales Managers (Rajesh Kumar & Priya Sharma)
✅ **CAN ACCESS:**
- Data only from their assigned 2 representatives
- Performance metrics of their team members only
- Deals and activities of their team members
- Recommendations for their team members

❌ **CANNOT ACCESS:**
- Data from other managers' representatives
- Other managers' performance metrics
- Other regions' data

**Example:**
- Rajesh Kumar (Manager 1) can see data for Rahul Sharma and Priya Mehta
- Rajesh Kumar CANNOT see data for Amit Kumar or Neha Singh (Manager 2's team)
- Priya Sharma (Manager 2) can see data for Amit Kumar and Neha Singh
- Priya Sharma CANNOT see data for Rahul Sharma or Priya Mehta (Manager 1's team)

### Sales Representatives (All 4 Reps)
✅ **CAN ACCESS:**
- Only their own sales data
- Their own deals and activities
- Their own recommendations
- Their own performance metrics

❌ **CANNOT ACCESS:**
- Data from other sales representatives
- Manager-level aggregated views
- Other reps' deals or activities

## Access Control Implementation

### AuthContext Functions
The following functions enforce access control:

1. **`getAccessibleReps()`** - Returns list of reps the current user can access
2. **`getAccessibleManagers()`** - Returns list of managers the current user can access
3. **`filterDataByAccess(data, repIdField)`** - Filters any dataset by repId based on user role
4. **`canAccessRepData(repId)`** - Checks if user can access specific rep's data
5. **`getTeamMembers(managerId)`** - Returns team members for a specific manager

### SharedData Functions
The following functions in sharedData.js support access control:

1. **`getTeamMembersByManagerId(managerId)`** - Get reps assigned to a manager
2. **`getDealsByManagerId(managerId)`** - Get deals for a manager's team
3. **`getRepPerformanceByManagerId(managerId)`** - Get performance data for a manager's team
4. **`filterByUserAccess(data, currentUser, repIdField)`** - Filter data based on user role
5. **`getAccessibleManagersData(currentUser)`** - Get managers accessible to user
6. **`getAccessibleRepsData(currentUser)`** - Get reps accessible to user

## Testing Access Control

### Test 1: Sales Head Full Access
1. Login as: vikram.singh@company.com (password: vp123)
2. Navigate to Sales Head Dashboard
3. ✅ Should see data from all 4 representatives
4. ✅ Should see both managers (Rajesh Kumar & Priya Sharma)
5. ✅ Manager Analytics should show both managers' performance
6. ✅ Team Recommendations should show all reps' recommendations

### Test 2: Manager 1 Limited Access
1. Login as: rajesh.kumar@company.com (password: manager123)
2. Navigate to Sales Manager Dashboard
3. ✅ Should see data only from Rep 1 (Rahul Sharma) and Rep 2 (Priya Mehta)
4. ❌ Should NOT see data from Rep 3 (Amit Kumar) or Rep 4 (Neha Singh)
5. ✅ Team performance should only show 2 reps
6. ✅ High-risk deals should only show deals from Rep 1 & Rep 2

### Test 3: Manager 2 Limited Access
1. Login as: priya.sharma@company.com (password: manager123)
2. Navigate to Sales Manager Dashboard
3. ✅ Should see data only from Rep 3 (Amit Kumar) and Rep 4 (Neha Singh)
4. ❌ Should NOT see data from Rep 1 (Rahul Sharma) or Rep 2 (Priya Mehta)
5. ✅ Team performance should only show 2 reps
6. ✅ High-risk deals should only show deals from Rep 3 & Rep 4

### Test 4: Rep 1 Own Data Only
1. Login as: rahul.sharma@company.com (password: sales123)
2. Navigate to Sales Rep Dashboard (My Account)
3. ✅ Should see only Rahul Sharma's deals and activities
4. ❌ Should NOT see any other rep's data
5. ✅ My Daily Plan should show only own activities
6. ✅ AI Recommendations should show only own recommendations

### Test 5: Rep 2 Own Data Only
1. Login as: priya.mehta@company.com (password: sales123)
2. Navigate to Sales Rep Dashboard (My Account)
3. ✅ Should see only Priya Mehta's deals and activities
4. ❌ Should NOT see any other rep's data

### Test 6: Cross-Region Access Control
1. Login as Manager 1 (Rajesh Kumar - North Region)
2. ✅ Should see only North Region reps (Rep 1 & Rep 2)
3. ❌ Should NOT see South Region reps (Rep 3 & Rep 4)
4. Logout and login as Manager 2 (Priya Sharma - South Region)
5. ✅ Should see only South Region reps (Rep 3 & Rep 4)
6. ❌ Should NOT see North Region reps (Rep 1 & Rep 2)

## Implementation Files

### Updated Files
1. **`src/context/AuthContext.jsx`**
   - Updated user accounts (1 Head, 2 Managers, 4 Reps)
   - Added teamMembers array to managers
   - Added access control helper functions

2. **`src/data/sharedData.js`**
   - Updated organizational hierarchy documentation
   - Updated salesReps array with new manager assignments
   - Updated salesManagers array (reduced to 2 managers)
   - Updated managerPerformanceData (only 2 managers)
   - Added access control helper functions

### Key Changes
- Reduced managers from 4 to 2
- Each manager now has exactly 2 direct reports
- Manager 1 (Rajesh Kumar): managerId = 1, team = [rep 1, rep 2]
- Manager 2 (Priya Sharma): managerId = 2, team = [rep 3, rep 4]
- Updated regions: North (Manager 1), South (Manager 2)
- All access control enforced through helper functions

## Usage in Components

### Example: Filter deals by manager
```javascript
import { useAuth } from '../context/AuthContext';
import { getDealsByManagerId } from '../data/sharedData';

const ManagerDashboard = () => {
  const { currentUser } = useAuth();
  
  // Get only deals for this manager's team
  const deals = getDealsByManagerId(currentUser.managerId);
  
  return <div>... display deals ...</div>;
};
```

### Example: Filter data by current user
```javascript
import { useAuth } from '../context/AuthContext';
import { allDeals } from '../data/sharedData';

const Dashboard = () => {
  const { currentUser, filterDataByAccess } = useAuth();
  
  // Automatically filters based on role
  const accessibleDeals = filterDataByAccess(allDeals);
  
  return <div>... display deals ...</div>;
};
```

## Security Notes

⚠️ **Important:** This is a demo/prototype implementation. In production:
- Access control should be enforced on the backend/API level
- Frontend filtering is for UX only and should not be relied upon for security
- API endpoints should validate user permissions before returning data
- Implement proper JWT/session-based authentication
- Add audit logging for data access
- Implement row-level security in database

## Current Functionality Preserved

✅ All existing features remain functional:
- KPI cards for all roles
- Dashboard views for all roles
- AI Recommendations
- Daily Plan
- Accounts view
- Deals pipeline
- Team Activity
- Status badges
- Navigation structure

❌ No breaking changes to existing functionality
✅ Only data visibility is restricted based on role
