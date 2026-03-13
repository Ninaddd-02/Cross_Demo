# 🔐 Login Credentials & Access Control

**Application:** Cross Sync - AI Recommendation Engine  
**Purpose:** Demo/Testing Credentials  
**Last Updated:** March 5, 2026

---

## ⚠️ SECURITY WARNING

**THIS IS A DEMO APPLICATION**

All credentials listed below are for **demonstration and testing purposes only**. These passwords are:
- ❌ NOT encrypted
- ❌ NOT secure for production use
- ❌ Stored in plain text in code
- ✅ Safe for local development and demos only

**For Production:** Implement proper authentication (OAuth, SSO, password hashing, MFA, etc.)

---

## 📋 COMPLETE USER DIRECTORY

### 1. SALES VP / HEAD (1 User)

**Vikram Singh** - VP of Sales
```
Email:     vikram.singh@company.com
Password:  vp123
Role:      sales-head
User ID:   head-1

Access Rights:
  ✅ All regions (North, South, East, West)
  ✅ All manager dashboards
  ✅ All sales rep data
  ✅ Strategic KPIs and forecasts
  ✅ Cross-tenant pattern insights
  ✅ Revenue predictions
  ✅ Manager performance analytics
  ✅ Team recommendations (read-only for all teams)

Dashboard Routes:
  - /sales-head/dashboard (Main)
  - /sales-head/revenue-forecast
  - /sales-head/pipeline-risk
  - /sales-head/manager-analytics
  - /sales-head/insights
  - /sales-head/team-recommendations

Test Scenario:
  "Login as VP to view company-wide metrics, compare regional performance,
   and review all team recommendations across the organization."
```

---

### 2. SALES MANAGERS (2 Users)

#### 2.1 MANAGER 1 (North & South Regions)

**Rajesh Kumar** - Sales Manager
```
Email:     rajesh.kumar@company.com
Password:  manager123
Role:      sales-manager
User ID:   manager-1
Region:    North & South
Manager ID: 1
Team Size: 2 reps

Direct Reports:
  - Rep 1: Rahul Sharma (repId: 1, North) - Automotive OEM
  - Rep 2: Priya Mehta (repId: 2, South) - Manufacturing & Industrial

Access Rights:
  ✅ North & South region data only
  ✅ Can view data ONLY for Rahul Sharma and Priya Mehta
  ✅ Team performance metrics for 2 reps
  ✅ High-risk deal alerts for team
  ✅ Intervention queue for assigned reps
  ✅ Coaching insights for team
  ✅ Team recommendations (read-only for assigned reps)
  ❌ CANNOT view East or West region data
  ❌ CANNOT view Amit Kumar or Neha Singh's data

Dashboard Routes:
  - /sales-manager/dashboard (Main)
  - /sales-manager/team-activity
  - /sales-manager/team-performance
  - /sales-manager/deal-risk
  - /sales-manager/coaching
  - /sales-manager/forecast
  - /sales-manager/team-recommendations

Test Scenario:
  "Login as Manager 1 to coach Rahul (North) and Priya (South) on strategy
   and monitor high-risk deals. You should ONLY see data for these 2 reps."
```

#### 2.2 MANAGER 2 (East & West Regions)

**Priya Sharma** - Sales Manager
```
Email:     priya.sharma@company.com
Password:  manager123
Role:      sales-manager
User ID:   manager-2
Region:    East & West
Manager ID: 2
Team Size: 2 reps

Direct Reports:
  - Rep 3: Amit Kumar (repId: 3, East) - Technology & IT Services
  - Rep 4: Neha Singh (repId: 4, West) - Pharma & Healthcare

Access Rights:
  ✅ East & West region data only
  ✅ Can view data ONLY for Amit Kumar and Neha Singh
  ✅ Team performance metrics for 2 reps
  ✅ Deal coaching opportunities
  ✅ Activity tracking for team
  ✅ Team recommendations (read-only for assigned reps)
  ❌ CANNOT view North or South region data
  ❌ CANNOT view Rahul Sharma or Priya Mehta's data

Dashboard Routes:
  - /sales-manager/dashboard (Main)
  - /sales-manager/team-activity
  - /sales-manager/team-performance
  - /sales-manager/deal-risk
  - /sales-manager/forecast
  - /sales-manager/team-recommendations

Test Scenario:
  "Login as Manager 2 to review Amit's (East) tech deals and Neha's (West) pharma pipeline.
   You should ONLY see data for these 2 reps."
```

---

### 3. SALES REPRESENTATIVES (4 Users)

#### 3.1 REP 1 - NORTH REGION (Manager: Rajesh Kumar)

**Rahul Sharma** - Sales Representative
```
Email:     rahul.sharma@company.com
Password:  sales123
Role:      sales-rep
User ID:   rep-1
Region:    North
Rep ID:    1
Manager:   Rajesh Kumar (managerId: 1)
Industry:  Automotive OEM

Access Rights:
  ✅ Personal accounts (Tata Motors, Mahindra, Bajaj Auto)
  ✅ Personal deals (6 active)
  ✅ Personal pipeline (₹18.8 Cr)
  ✅ Personal recommendations (AI-generated)
  ✅ Daily activity plan
  ✅ Deal CRUD operations
  ❌ Team data
  ❌ Other reps' data (including Priya Mehta)
  ❌ Manager dashboards

Dashboard Routes:
  - /sales/accounts (Main)
  - /sales/my-plan
  - /sales/recommendations

Current Deals:
  - Tata Motors Telematics (₹3.2 Cr) - High Risk
  - Commercial Vehicle Fleet (₹4.5 Cr) - Healthy
  - Spare Parts Contract (₹1.8 Cr) - Healthy
  - Mahindra Fleet Management (₹2.4 Cr) - High Risk
  - Mahindra Logistics ERP (₹4.1 Cr) - At Risk
  - Bajaj Auto Fleet (₹2.8 Cr) - Critical

Test Scenario:
  "Login as Rahul to accept AI cross-sell recommendation for EV charging
   infrastructure and manage high-risk Tata Motors deal."
```

#### 3.2 REP 2 - SOUTH REGION (Manager: Rajesh Kumar)

**Priya Mehta** - Sales Representative
```
Email:     priya.mehta@company.com
Password:  sales123
Role:      sales-rep
User ID:   rep-2
Region:    South
Rep ID:    2
Manager:   Rajesh Kumar (managerId: 1)
Industry:  Manufacturing & Industrial

Access Rights:
  ✅ Personal accounts (Larsen & Toubro, Siemens India)
  ✅ Personal deals (2 active)
  ✅ Personal pipeline (₹5.4 Cr)
  ✅ Personal recommendations (AI-generated)
  ✅ Daily activity plan
  ❌ Team data
  ❌ Other reps' data (including Rahul Sharma)

Dashboard Routes:
  - /sales/accounts (Main)
  - /sales/my-plan
  - /sales/recommendations

Current Deals:
  - Smart Factory Digitization (₹3.6 Cr) - High Risk
  - Industrial Automation Platform (₹1.8 Cr) - At Risk

Test Scenario:
  "Login as Priya Mehta to improve demo conversion rate and handle
   competitive situation at Larsen & Toubro."
```

#### 3.3 REP 3 - EAST REGION (Manager: Priya Sharma)

**Amit Kumar** - Sales Representative
```
Email:     amit.kumar@company.com
Password:  sales123
Role:      sales-rep
User ID:   rep-3
Region:    East
Rep ID:    3
Manager:   Priya Sharma (managerId: 2)
Industry:  Technology & IT Services

Access Rights:
  ✅ Personal accounts (Tata Consultancy Services)
  ✅ Personal deals (1 active)
  ✅ Personal pipeline (₹1.9 Cr)
  ✅ Personal recommendations (AI-generated)
  ✅ Daily activity plan
  ❌ Team data
  ❌ Other reps' data (including Neha Singh)

Dashboard Routes:
  - /sales/accounts (Main)
  - /sales/my-plan
  - /sales/recommendations

Current Deals:
  - Cloud Infrastructure Migration (₹1.9 Cr) - Critical

Test Scenario:
  "Login as Amit to escalate the stalled TCS deal and improve
   executive engagement skills."
```

**Neha Singh** - Sales Representative (Rep 4)
```
Email:     neha.singh@company.com
Password:  sales123
Role:      sales-rep
User ID:   rep-4
Region:    West
Rep ID:    4
Manager:   Priya Sharma (managerId: 2)
Industry:  Pharma & Healthcare

Access Rights:
  ✅ Personal accounts (Pharmaceutical companies)
  ✅ Personal deals
  ✅ Personal pipeline
  ✅ Personal recommendations (AI-generated)
  ✅ Daily activity plan
  ❌ Team data
  ❌ Other reps' data (including Amit Kumar)

Dashboard Routes:
  - /sales/accounts (Main)
  - /sales/my-plan
  - /sales/recommendations

Current Status:
  - Prospecting phase
  - Building pipeline
  - New opportunity identification

Test Scenario:
  "Login as Neha to practice prospecting techniques and build
   initial pipeline in pharma sector."
```

---

## 🎯 TESTING SCENARIOS BY USE CASE

### Scenario 1: VP Reviewing Company Performance
```
Login as: vikram.singh@company.com / vp123
Navigate: /sales-head/dashboard
Tasks:
  1. Review ₹186 Cr total pipeline
  2. Identify ₹38 Cr at risk (20.4%)
  3. Compare regional performance
  4. Review manager coaching scores
  5. Check cross-tenant pattern insights
  6. Navigate to /sales-head/team-recommendations
  7. Filter by region to see all teams
```

### Scenario 2: Manager Coaching Sales Rep
```
Login as: rajesh.kumar@company.com / manager123
Navigate: /sales-manager/dashboard
Tasks:
  1. Review Rahul Sharma's 6 active deals
  2. Identify high-risk deals (3 deals)
  3. Check intervention queue
  4. Navigate to /sales-manager/team-recommendations
  5. See only Rahul's recommendations
  6. Plan coaching session on multi-threading
```

### Scenario 3: Sales Rep Managing Deals
```
Login as: rahul.sharma@company.com / sales123
Navigate: /sales/accounts
Tasks:
  1. Review personal pipeline (₹18.8 Cr)
  2. Update deal stages
  3. Navigate to /sales/recommendations
  4. Accept AI cross-sell recommendation
  5. Navigate to /sales/my-plan
  6. Complete daily activities
```

### Scenario 4: Cross-Role Workflow
```
Step 1: Rep accepts AI recommendation
  Login: rahul.sharma@company.com / sales123
  Action: Accept EV Charging recommendation (₹68 Lakh)
  
Step 2: Manager sees acceptance in team view
  Login: rajesh.kumar@company.com / manager123
  Navigate: /sales-manager/team-recommendations
  Observe: Recommendation status = Accepted
  
Step 3: VP sees impact on forecasts
  Login: vikram.singh@company.com / vp123
  Navigate: /sales-head/revenue-forecast
  Observe: ₹186 Cr + ₹0.68 Cr = updated forecast
```

---

## 🔄 PASSWORD RESET (Demo)

**Current Setup:** No password reset functionality (demo app)

**To Change Password (Manual):**
1. Edit `src/context/AuthContext.jsx`
2. Locate user in `allUsers` array
3. Update password field
4. Save and refresh application

**Production Implementation Needed:**
- Email-based password reset
- Temporary password generation
- Password complexity requirements
- Password expiry (90 days)
- Password history (prevent reuse of last 5)

---

## 🚨 TROUBLESHOOTING LOGIN ISSUES

### Issue: "Invalid credentials"
**Cause:** Incorrect email or password
**Solution:** 
  - Verify email is lowercase
  - Passwords are case-sensitive
  - Check for extra spaces

### Issue: "Cannot access [route]"
**Cause:** Incorrect role trying to access protected route
**Solution:**
  - Verify user role in AuthContext
  - Check ProtectedRoute allowedRoles in App.jsx
  - Use correct dashboard route for role

### Issue: "User data not loading"
**Cause:** localStorage might be corrupted
**Solution:**
  1. Open browser DevTools (F12)
  2. Go to Application > Local Storage
  3. Clear 'currentUser' entry
  4. Refresh and login again

### Issue: "Manager sees no team data"
**Cause:** managerId mismatch
**Solution:**
  - Verify currentUser.managerId = rep.managerId
  - Check console for filtering errors
  - Review ORGANIZATIONAL_STRUCTURE.md

---

## 📊 ACCESS SUMMARY TABLE

| Role | Users | Password | Regions | Team View | Personal Data | Analytics |
|------|-------|----------|---------|-----------|---------------|-----------|
| **VP** | 1 | `vp123` | All 4 | All Teams | No | Company-wide |
| **Manager** | 4 | `manager123` | Own Region | Own Team | No | Team-level |
| **Sales Rep** | 4 | `sales123` | Own Region | No | Yes | Personal |

---

## 📝 NOTES FOR ADMINISTRATORS

### Adding New Users
1. Add user to `src/context/AuthContext.jsx` in `allUsers` array
2. If sales rep, add to `src/data/sharedData.js` in `salesReps` array
3. If manager, add to `salesManagers` array
4. Ensure managerId relationships are correct
5. Test login and access rights

### Removing Users
1. Remove from AuthContext.allUsers
2. Remove from sharedData (if rep/manager)
3. Update related deals/activities to reassign or archive
4. Clear localStorage if user was logged in

### Changing Roles
1. Update role field in AuthContext
2. Update managerId if promoting rep to manager
3. Clear user's localStorage session
4. User must re-login for changes to take effect

---

## 🔒 SECURITY BEST PRACTICES (For Production)

**Authentication:**
- ✅ Implement OAuth 2.0 or OIDC
- ✅ Use JWT tokens with short expiry (15 min)
- ✅ Implement refresh tokens
- ✅ Hash passwords with bcrypt/Argon2
- ✅ Add rate limiting (5 failed attempts = 15 min lockout)

**Authorization:**
- ✅ Validate roles server-side (never trust client)
- ✅ Implement RBAC at API gateway
- ✅ Use middleware for route protection
- ✅ Audit log all access attempts

**Session Management:**
- ✅ Session timeout after 30 minutes
- ✅ Logout on browser close
- ✅ Invalidate tokens on password change
- ✅ Single sign-on (SSO) integration

**Data Protection:**
- ✅ HTTPS only (no HTTP)
- ✅ Encrypt sensitive data at rest
- ✅ Mask credentials in logs
- ✅ Regular security audits

---

## 📞 SUPPORT

**For Demo/Testing Issues:**
- Check [ORGANIZATIONAL_STRUCTURE.md](ORGANIZATIONAL_STRUCTURE.md)
- Review [TEAM_RECOMMENDATIONS_TESTING.md](TEAM_RECOMMENDATIONS_TESTING.md)
- Verify dev server is running: http://localhost:3002/

**For Production Deployment:**
- Implement proper authentication provider
- Set up user management system
- Configure environment variables for secrets
- Enable SSL/TLS certificates
- Set up monitoring and alerting

---

**Document Version:** 1.0  
**Last Updated:** March 5, 2026  
**Maintained By:** Development Team  
**Review Frequency:** Every sprint / As users are added or modified
