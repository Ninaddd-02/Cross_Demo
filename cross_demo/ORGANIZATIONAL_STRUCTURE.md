# Organizational Structure & Data Alignment

## 🔐 LOGIN CREDENTIALS - QUICK REFERENCE

**⚠️ SECURITY NOTE:** This is a demo application. All credentials below are for testing purposes only. In production, implement proper authentication with password hashing, MFA, and role-based access control.

### Complete Access Matrix

| Role | Name | Email | Password | Access Level | Dashboard Route |
|------|------|-------|----------|--------------|-----------------|
| **Sales VP** | Vikram Singh | vikram.singh@company.com | `vp123` | Full Access - All Regions | /sales-head/dashboard |
| **Manager (North)** | Rajesh Kumar | rajesh.kumar@company.com | `manager123` | North Region Only | /sales-manager/dashboard |
| **Manager (South)** | Priya Sharma | priya.sharma@company.com | `manager123` | South Region Only | /sales-manager/dashboard |
| **Manager (East)** | Sneha Reddy | sneha.reddy@company.com | `manager123` | East Region Only | /sales-manager/dashboard |
| **Manager (West)** | Amit Patel | amit.patel@company.com | `manager123` | West Region Only | /sales-manager/dashboard |
| **Sales Rep (North)** | Rahul Sharma | rahul.sharma@company.com | `sales123` | Personal Data Only | /sales/accounts |
| **Sales Rep (South)** | Priya Mehta | priya.mehta@company.com | `sales123` | Personal Data Only | /sales/accounts |
| **Sales Rep (East)** | Amit Kumar | amit.kumar@company.com | `sales123` | Personal Data Only | /sales/accounts |
| **Sales Rep (West)** | Neha Singh | neha.singh@company.com | `sales123` | Personal Data Only | /sales/accounts |

### Quick Login by Role

#### 👔 Sales VP / Head
```
Email:    vikram.singh@company.com
Password: vp123
Access:   All regions, all teams, all data
```

#### 👨‍💼 Sales Managers
```
North Region:
  Email:    rajesh.kumar@company.com
  Password: manager123
  Team:     Rahul Sharma

South Region:
  Email:    priya.sharma@company.com
  Password: manager123
  Team:     Priya Mehta

East Region:
  Email:    sneha.reddy@company.com
  Password: manager123
  Team:     Amit Kumar

West Region:
  Email:    amit.patel@company.com
  Password: manager123
  Team:     Neha Singh
```

#### 👤 Sales Representatives
```
Rahul Sharma (North - Automotive OEM):
  Email:    rahul.sharma@company.com
  Password: sales123
  Manager:  Rajesh Kumar

Priya Mehta (South - Manufacturing):
  Email:    priya.mehta@company.com
  Password: sales123
  Manager:  Priya Sharma

Amit Kumar (East - Technology):
  Email:    amit.kumar@company.com
  Password: sales123
  Manager:  Sneha Reddy

Neha Singh (West - Pharma):
  Email:    neha.singh@company.com
  Password: sales123
  Manager:  Amit Patel
```

### Feature Access by Role

| Feature | Sales VP | Manager | Sales Rep |
|---------|----------|---------|-----------|
| View All Opportunities | ✅ | ❌ (Team Only) | ❌ (Own Only) |
| Revenue Forecast | ✅ | ✅ (Team) | ❌ |
| Pipeline Risk Analysis | ✅ | ✅ (Team) | ❌ |
| Manager Analytics | ✅ | ❌ | ❌ |
| Team Recommendations | ✅ (All) | ✅ (Team) | ❌ |
| Team Activity | ✅ | ✅ | ❌ |
| Personal Recommendations | ❌ | ❌ | ✅ |
| My Plan / Daily Activities | ❌ | ❌ | ✅ |
| Deal Management (CRUD) | ❌ | ❌ | ✅ |
| Account Management | ❌ | ❌ | ✅ |

### Security Implementation Notes

**Current Demo Setup:**
- Simple email/password authentication
- No encryption on passwords (demo only!)
- Role stored in localStorage
- Client-side route protection

**Production Recommendations:**
- Implement OAuth 2.0 or SAML for enterprise SSO
- Use bcrypt or Argon2 for password hashing
- Add Multi-Factor Authentication (MFA/2FA)
- Implement JWT tokens with refresh mechanism
- Add session timeout (15-30 minutes)
- Enable audit logging for all access
- Implement rate limiting on login attempts
- Add IP whitelisting for sensitive roles
- Use HTTPS only with HSTS headers
- Implement RBAC (Role-Based Access Control) at API level

---

## Complete Hierarchy

```
SALES VP (Vikram Singh)
├── NORTH Region - Manager: Rajesh Kumar (ID: 1)
│   └── Sales Rep: Rahul Sharma (repId: 1, managerId: 1)
│       ├── Email: rahul.sharma@company.com
│       ├── Industry: Automotive OEM
│       └── Deals: Multiple deals in pipeline
│
├── SOUTH Region - Manager: Priya Sharma (ID: 2)
│   └── Sales Rep: Priya Mehta (repId: 2, managerId: 2)
│       ├── Email: priya.mehta@company.com
│       ├── Industry: Manufacturing & Industrial
│       └── Deals: Active accounts
│
├── EAST Region - Manager: Sneha Reddy (ID: 4)
│   └── Sales Rep: Amit Kumar (repId: 3, managerId: 4)
│       ├── Email: amit.kumar@company.com
│       ├── Industry: Technology & IT Services
│       └── Deals: Tech sector deals
│
└── WEST Region - Manager: Amit Patel (ID: 3)
    └── Sales Rep: Neha Singh (repId: 4, managerId: 3)
        ├── Email: neha.singh@company.com
        ├── Industry: Pharma & Healthcare
        └── Deals: Healthcare accounts
```

## User Roles & Access

### Sales VP (sales-head)
- **User:** Vikram Singh
- **Email:** vikram.singh@company.com
- **Password:** vp123
- **Access:**
  - All regions: North, South, East, West
  - All managers' teams
  - All sales reps
  - Team Recommendations (view-only for all)

### Sales Managers (sales-manager)

#### Rajesh Kumar - North Region
- **Email:** rajesh.kumar@company.com
- **Password:** manager123
- **Manager ID:** 1
- **Team:** Rahul Sharma (repId: 1)
- **Access:** Team Recommendations for North region only

#### Priya Sharma - South Region
- **Email:** priya.sharma@company.com
- **Password:** manager123
- **Manager ID:** 2
- **Team:** Priya Mehta (repId: 2)
- **Access:** Team Recommendations for South region only

#### Sneha Reddy - East Region
- **Email:** sneha.reddy@company.com
- **Password:** manager123
- **Manager ID:** 4
- **Team:** Amit Kumar (repId: 3)
- **Access:** Team Recommendations for East region only

#### Amit Patel - West Region
- **Email:** amit.patel@company.com
- **Password:** manager123
- **Manager ID:** 3
- **Team:** Neha Singh (repId: 4)
- **Access:** Team Recommendations for West region only

### Sales Representatives (sales-rep)

#### Rahul Sharma - North
- **Email:** rahul.sharma@company.com
- **Password:** sales123
- **Rep ID:** 1
- **Manager ID:** 1 (Rajesh Kumar)
- **Access:** Personal accounts, deals, recommendations

#### Priya Mehta - South
- **Email:** priya.mehta@company.com
- **Password:** sales123
- **Rep ID:** 2
- **Manager ID:** 2 (Priya Sharma)
- **Access:** Personal accounts, deals, recommendations

#### Amit Kumar - East
- **Email:** amit.kumar@company.com
- **Password:** sales123
- **Rep ID:** 3
- **Manager ID:** 4 (Sneha Reddy)
- **Access:** Personal accounts, deals, recommendations

#### Neha Singh - West
- **Email:** neha.singh@company.com
- **Password:** sales123
- **Rep ID:** 4
- **Manager ID:** 3 (Amit Patel)
- **Access:** Personal accounts, deals, recommendations

## Data Structure Alignment

### salesReps (src/data/sharedData.js)
```javascript
{
  id: 1,              // Unique rep identifier
  name: 'Rahul Sharma',
  email: 'rahul.sharma@company.com',
  region: 'North',
  manager: 'Rajesh Kumar',  // Manager name (string)
  managerId: 1,       // Manager ID reference (number)
  avatar: '👤'
}
```

### salesManagers (src/data/sharedData.js)
```javascript
{
  id: 1,              // Manager ID (matches managerId in salesReps)
  name: 'Rajesh Kumar',
  region: 'North',
  teamSize: 8,
  email: 'rajesh.kumar@company.com'
}
```

### AuthContext Users
```javascript
// Sales Manager
{
  id: 'manager-1',
  name: 'Rajesh Kumar',
  email: 'rajesh.kumar@company.com',
  role: 'sales-manager',
  title: 'Sales Manager - North',
  region: 'North',
  managerId: 1,       // Links to salesManagers.id
  teamSize: 8,
  avatar: '👤'
}

// Sales Rep
{
  id: 'rep-1',
  name: 'Rahul Sharma',
  email: 'rahul.sharma@company.com',
  role: 'sales-rep',
  title: 'Sales Representative',
  region: 'North',
  manager: 'Rajesh Kumar',
  managerId: 1,       // Links to salesManagers.id
  repId: 1,          // Links to salesReps.id
  avatar: '👤',
  industry: 'Automotive OEM'
}
```

## Data Flow & Relationships

### 1. Deals → Sales Reps
```javascript
// Deal structure
{
  id: 1,
  name: 'Tata Motors Telematics',
  repId: 1,           // Links to salesReps.id
  repName: 'Rahul Sharma',
  region: 'North',
  manager: 'Rajesh Kumar',
  // ... other fields
}
```

### 2. Recommendations → Sales Reps
```javascript
// Recommendation structure (in store)
{
  id: 'rec-123',
  repId: 1,           // Links to salesReps.id
  accountId: 'acc-456',
  type: 'cross-sell',
  status: 'pending',
  // ... other fields
}
```

### 3. Activities → Sales Reps
```javascript
// Activity structure (in store)
{
  id: 'act-789',
  repId: 1,           // Links to salesReps.id
  type: 'deal_update',
  description: '...',
  timestamp: '...',
  // ... other fields
}
```

### 4. Team Filtering (Manager View)
```javascript
// In TeamRecommendations.jsx
const visibleReps = useMemo(() => {
  if (currentUser.role === 'sales-head') {
    return salesReps; // VP sees all
  } else if (currentUser.role === 'sales-manager') {
    // Filter by managerId (preferred)
    if (currentUser.managerId) {
      return salesReps.filter(rep => rep.managerId === currentUser.managerId);
    } else {
      // Fallback to name matching
      return salesReps.filter(rep => rep.manager === currentUser.name);
    }
  }
  return [];
}, [currentUser]);
```

## Testing the Alignment

### Test 1: Manager Can See Their Team's Recommendations
1. Login as Rajesh Kumar (manager123)
2. Navigate to "Team Recommendations"
3. **Expected:** See only Rahul Sharma's recommendations (repId: 1)

### Test 2: VP Can See All Recommendations
1. Login as Vikram Singh (vp123)
2. Navigate to "Team Recommendations"
3. **Expected:** See recommendations from all 4 reps (repId: 1, 2, 3, 4)

### Test 3: Sales Rep Cannot Access Team View
1. Login as Rahul Sharma (sales123)
2. Check sidebar navigation
3. **Expected:** No "Team Recommendations" link visible

### Test 4: Cross-Role Data Consistency
1. As Rahul Sharma: Create a new deal
2. As Rajesh Kumar: View team activity
3. **Expected:** New deal shows up in manager's team view
4. As Vikram Singh: View regional performance
5. **Expected:** New deal reflected in VP's North region stats

## Key Alignment Points

✅ **Rep IDs:** All repId values (1, 2, 3, 4) match salesReps.id
✅ **Manager IDs:** All managerId values link correctly to salesManagers.id
✅ **Region Assignment:** Each rep has one region, each manager owns one region
✅ **Email Uniqueness:** All users have unique email addresses
✅ **Role Consistency:** Roles match between AuthContext and routing
✅ **Data References:** Deals, activities, and recommendations all use repId for linking

## Store Methods Using Relationships

### useDealsStore
- `getDealsByRep(repId)` - Get deals for specific rep
- `getPipelineValueByRep(repId)` - Calculate pipeline for rep

### useRecommendationsStore
- `getRecommendationsByRep(repId)` - Get pending recommendations
- `getRecommendationsByTeam(teamRepIds)` - Get team recommendations (array of repIds)
- `getRecommendationsByRegion(region, salesReps)` - Filter by region
- `getAllRecommendationsWithRepInfo(salesReps)` - Enrich with rep details
- `getTeamStats(teamRepIds)` - Calculate team metrics

### useActivitiesStore
- `getActivitiesByRep(repId)` - Get activities for rep
- `getActivitiesByRegion(region, salesReps)` - Filter by region
- `getActivityStats(repId)` - Calculate rep activity metrics

### useAccountsStore
- `getAccountsByRep(repId)` - Get accounts assigned to rep

## Troubleshooting

### Issue: Manager sees no recommendations
**Cause:** managerId mismatch between currentUser and salesReps
**Fix:** Verify currentUser.managerId matches rep.managerId in salesReps array

### Issue: VP sees only some reps
**Cause:** Role check failing or filter applied
**Fix:** Verify currentUser.role === 'sales-head' and no filters active

### Issue: Sales rep can access team view
**Cause:** Route not properly protected or role check failing
**Fix:** Verify ProtectedRoute wraps team routes with allowedRoles=['sales-manager', 'sales-head']

### Issue: Data not showing for specific rep
**Cause:** repId mismatch in store data
**Fix:** Check localStorage data structure, clear and reinitialize if needed
