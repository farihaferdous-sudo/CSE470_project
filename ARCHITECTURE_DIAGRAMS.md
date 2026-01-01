# 📊 Visual Architecture & Flow Diagrams

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                          │
│  ┌──────────────┬──────────────┬────────────┬──────────────────┐
│  │  HomePage    │  CreatePage  │  EditPage  │  FoodDetailPage  │
│  └──────────────┴──────────────┴────────────┴──────────────────┘
│  ┌─────────────────────────────────────────────────────────────┐
│  │  NEW: ImpactDashboard.jsx  │  NEW: ProfilePage.jsx          │
│  └─────────────────────────────────────────────────────────────┘
│  ┌─────────────────────────────────────────────────────────────┐
│  │                    Navbar Component                          │
│  │  Home | Donate | Impact | Profile                           │
│  └─────────────────────────────────────────────────────────────┘
└─────────────────────────────────────────────────────────────────┘
                              ↕ (HTTP/REST)
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js + Express)                   │
│  ┌─────────────────────────────────────────────────────────────┐
│  │                    Routes Layer                              │
│  │  ├─ foodRoutes.js (existing + claim endpoint)               │
│  │  ├─ notesRoutes.js (existing)                               │
│  │  └─ NEW: impactRoutes.js                                    │
│  └─────────────────────────────────────────────────────────────┘
│  ┌─────────────────────────────────────────────────────────────┐
│  │                  Controllers Layer                           │
│  │  ├─ foodController.js (existing)                            │
│  │  ├─ notesController.js (existing)                           │
│  │  └─ NEW: impactController.js                                │
│  │      ├─ getOrCreateImpact()                                 │
│  │      ├─ updateImpactOnDonate()                              │
│  │      ├─ updateImpactOnClaim()                               │
│  │      ├─ checkAndAwardBadges()                               │
│  │      ├─ getDonorImpact()                                    │
│  │      └─ getCommunityStats()                                 │
│  └─────────────────────────────────────────────────────────────┘
│  ┌─────────────────────────────────────────────────────────────┐
│  │                    Models Layer                              │
│  │  ├─ Food.js (existing)                                      │
│  │  ├─ Note.js (existing)                                      │
│  │  ├─ NEW: Impact.js                                          │
│  │  └─ NEW: Badge.js                                           │
│  └─────────────────────────────────────────────────────────────┘
└─────────────────────────────────────────────────────────────────┘
                              ↕ (MongoDB Driver)
┌─────────────────────────────────────────────────────────────────┐
│                     DATABASE (MongoDB)                           │
│  ┌──────────────┬──────────────┬────────────┬──────────────────┐
│  │   Foods      │   Notes      │  Impacts   │     Badges       │
│  │ Collection   │ Collection   │ Collection │  Collection      │
│  └──────────────┴──────────────┴────────────┴──────────────────┘
└─────────────────────────────────────────────────────────────────┘
```

---

## User Journey: Creating & Claiming Food

```
┌─────────────────┐
│  User (Donor)   │
└────────┬────────┘
         │
         │ 1. Visit /create
         ↓
    ┌────────────────┐
    │  CreatePage    │────────→ 2. Submit Form
    └────────────────┘         (donorId, food details)
         │
         │ 3. POST /api/foods
         ↓
    ┌────────────────────┐
    │  foodController    │
    │  createFood()      │
    └────────┬───────────┘
             │
             ├─→ 4. Save Food to DB
             │
             ↓
    ┌───────────────────────────────────┐
    │  impactController                 │
    │  updateImpactOnDonate(donorId)    │
    └────────┬────────────────────────────┘
             │
             ├─→ 5. Find/Create Impact Record
             │
             ├─→ 6. totalFoodDonated++
             │
             ├─→ 7. Update monthlyStats[current_month]++
             │
             └─→ 8. Save Impact to DB
             
             ✅ Food listed on homepage
             
─────────────────────────────────────────────────

┌──────────────────┐
│ User (Recipient) │
└────────┬─────────┘
         │
         │ 1. Visit / (Home)
         ↓
    ┌────────────────┐
    │  HomePage      │
    │  (sees all     │
    │   available    │
    │   foods)       │
    └────────┬───────┘
             │
             │ 2. Clicks "✓ Claim Food"
             ↓
    ┌────────────────────────┐
    │  handleClaim()         │
    │  PATCH /api/foods/:id/ │
    │  claim                 │
    └────────┬───────────────┘
             │
             ├─→ 3. Change food.status = "claimed"
             │
             ↓
    ┌───────────────────────────────────┐
    │  impactController                 │
    │  updateImpactOnClaim(donorId)     │
    └────────┬────────────────────────────┘
             │
             ├─→ 4. Find Impact Record
             │
             ├─→ 5. mealsSaved += quantity
             │
             ├─→ 6. wasteReduced += estimate
             │
             ├─→ 7. Update monthlyStats[]
             │
             ├─→ 8. checkAndAwardBadges()
             │    (if any threshold met)
             │    └─→ Add badge to impact.badges[]
             │
             └─→ 9. Save Impact to DB
             
             ✅ Impact stats updated
             ✅ Possible badges awarded
```

---

## Badge Award Logic Flow

```
┌──────────────────────────────┐
│  Food Claimed Successfully   │
└──────────┬───────────────────┘
           │
           ↓
    ┌─────────────────────────────────────┐
    │  checkAndAwardBadges(impact)         │
    └─────────┬───────────────────────────┘
              │
              │ 1. Query all badge definitions
              ↓
    ┌──────────────────────┐
    │  Get all Badge docs  │
    │  from database       │
    └─────────┬────────────┘
              │
              │ 2. For each badge:
              ↓
    ┌────────────────────────────────────┐
    │  Does user already have badge?     │
    └────────┬─────────────────────────┬─┘
             │YES                      │NO
             ↓                         ↓
        SKIP this            ┌──────────────────────────┐
        badge                │ Check Badge Criteria     │
                             └─────┬──────────────────┬─┘
                                   │                  │
                        ┌──────────┼──────────┬──────┘
                        ↓          ↓          ↓
                    meals_  donations_ waste_
                    saved   made       reduced
                        │      │         │
             ┌──────────┘      │         └──────┐
             ↓                  ↓                 ↓
    mealsSaved >=      totalFoodDonated >=   wasteReduced >=
    threshold?         threshold?           threshold?
             │                  │                 │
             └────────┬─────────┬─────────────────┘
                      ↓
                   YES?  NO
                   │     │
                   ↓     └───→ Continue to next badge
            ┌────────────────┐
            │ Award Badge!   │
            │ Add to impact  │
            │ .badges[]      │
            └────────────────┘

           After all badges checked:
                      ↓
            ┌──────────────────────┐
            │  Save impact doc     │
            │  to database         │
            └──────────────────────┘
```

---

## Component Hierarchy

```
App.jsx
├─ Navbar.jsx
│  ├─ Link to /
│  ├─ Link to /create
│  ├─ Link to /impact (NEW)
│  └─ Link to /profile (NEW)
│
├─ Routes
│  ├─ Route / → HomePage.jsx
│  │  ├─ Fetch foods from API
│  │  ├─ Display food cards
│  │  ├─ Link to /food/:id
│  │  └─ Button: Claim Food (NEW)
│  │
│  ├─ Route /create → CreatePage.jsx
│  │  ├─ Form inputs
│  │  └─ Submit → POST /api/foods
│  │
│  ├─ Route /edit/:id → EditPage.jsx
│  │  ├─ Load food data
│  │  └─ Submit → PUT /api/foods/:id
│  │
│  ├─ Route /food/:id → FoodDetailPage.jsx
│  │  └─ Display food details
│  │
│  ├─ Route /impact → ImpactDashboard.jsx (NEW)
│  │  ├─ Fetch community stats
│  │  ├─ Display stat cards
│  │  ├─ Display charts
│  │  │  ├─ LineChart (meals/month)
│  │  │  └─ BarChart (waste/month)
│  │  └─ Display top donors list
│  │
│  └─ Route /profile → ProfilePage.jsx (NEW)
│     ├─ Profile ID switcher
│     ├─ Fetch donor impact
│     ├─ Display personal stats
│     ├─ Display badges
│     │  └─ Map badges with icons
│     └─ Display monthly activity table
│
└─ Styles & Layout
```

---

## Data Schema Relationships

```
FOOD COLLECTION
┌─────────────────────────────────────┐
│ _id: ObjectId                       │
│ donorId: String ────────────────────┼─────────┐
│ foodType: String                    │         │
│ quantity: String                    │         │
│ status: String (available/claimed)  │         │
│ ... (other fields)                  │         │
└─────────────────────────────────────┘         │
                                                │
                                    References  │
                                                │
                                                ↓
IMPACT COLLECTION
┌──────────────────────────────────────┐
│ _id: ObjectId                        │
│ donorId: String ◄────────────────────┤
│ totalFoodDonated: Number             │
│ mealsSaved: Number                   │
│ wasteReduced: Number                 │
│ monthlyStats: [                      │
│   {month, mealsSaved, ...}           │
│ ]                                    │
│ badges: [  ──────────────────────────┼──────────┐
│   {badgeId, title, ...}              │          │
│ ]                                    │          │
└──────────────────────────────────────┘          │
                                                   │
                                       References │
                                                   │
                                                   ↓
BADGE COLLECTION
┌────────────────────────────────────┐
│ _id: ObjectId                      │
│ badgeId: String ◄─────────────────┤
│ title: String                      │
│ description: String                │
│ icon: String (emoji)               │
│ criteria: String (enum)            │
│ threshold: Number                  │
└────────────────────────────────────┘
```

---

## API Endpoint Interaction Diagram

```
CLIENT                           SERVER                        DATABASE

Get Home Foods
├─ GET /api/foods      ────────→  getAllFoods()      ────────→  Food.find()
└─ Display in HomePage ←────────  Return food array  ←────────  

Create Food Donation
├─ POST /api/foods     ────────→  createFood()       ────────→  Food.create()
│                                  ├─ Save food       
│                                  └─ updateImpactOnDonate()   
│                                     └─ Impact.update()
└─ Redirect to home    ←────────  Return food object ←────────

Claim Food
├─ PATCH /api/foods    ────────→  Food status="claimed"
│  /:id/claim                     updateImpactOnClaim()        ├─ Impact.findOne()
│                                  ├─ mealsSaved++             ├─ mealsSaved++
│                                  ├─ wasteReduced++           └─ Impact.update()
│                                  └─ checkAndAwardBadges()
│                                     └─ Badge.find()
└─ Refresh home        ←────────  Return updated food ←────────

Get Donor Profile
├─ GET /api/impact/    ────────→  getDonorImpact()  ────────→  Impact.findOne()
│  donor/:donorId                  Return impact               
└─ Display profile     ←────────  with stats, badges ←────────

Get Community Stats
├─ GET /api/impact/    ────────→  getCommunityStats()─────→  Impact.aggregate()
│  community/stats                 ├─ Sum all metrics       
│                                  ├─ Build monthly array
│                                  └─ Find top donors
└─ Display dashboard   ←────────  Return aggregated  ←────────
                                   stats & charts
```

---

## Monthly Stats Aggregation

```
IMPACT RECORDS (Multiple Donors)
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ donor1       │    │ donor2       │    │ donor3       │
├──────────────┤    ├──────────────┤    ├──────────────┤
│ monthly:     │    │ monthly:     │    │ monthly:     │
│ 2024-01:     │    │ 2024-01:     │    │ 2024-01:     │
│  meals: 10   │    │  meals: 5    │    │  meals: 8    │
│  waste: 5kg  │    │  waste: 2kg  │    │  waste: 4kg  │
│ 2024-02:     │    │ 2024-02:     │    │ 2024-02:     │
│  meals: 15   │    │  meals: 12   │    │  meals: 10   │
│  waste: 7.5  │    │  waste: 6kg  │    │  waste: 5kg  │
└──────────────┘    └──────────────┘    └──────────────┘
        │                   │                    │
        └───────────────────┼────────────────────┘
                            │
                            ↓ AGGREGATION
                ┌───────────────────────────┐
                │   COMMUNITY TOTALS        │
                ├───────────────────────────┤
                │ 2024-01:                  │
                │  meals: 10+5+8 = 23       │
                │  waste: 5+2+4 = 11kg      │
                │ 2024-02:                  │
                │  meals: 15+12+10 = 37     │
                │  waste: 7.5+6+5 = 18.5kg  │
                └───────────────────────────┘
                            │
                            ↓
            ┌─────────────────┐
            │   CHARTS        │
            ├─────────────────┤
            │ Line Chart:     │
            │ 2024-01: 23     │
            │ 2024-02: 37     │
            │                 │
            │ Bar Chart:      │
            │ 2024-01: 11kg   │
            │ 2024-02: 18.5kg │
            └─────────────────┘
```

---

## State Management Flow

```
HomePage
├─ State: foods[]
├─ State: refreshTrigger
│
├─ useEffect → GET /api/foods
│
├─ Render food cards
│
└─ handleClaim()
   ├─ PATCH /api/foods/:id/claim
   ├─ setRefreshTrigger(+1) → triggers useEffect
   └─ Foods list refreshes

ProfilePage
├─ State: donorId
├─ State: impact (stats & badges)
├─ State: loading
│
├─ useEffect → GET /api/impact/donor/:donorId
│
└─ Render:
   ├─ Donor ID switcher
   ├─ Stat cards (from impact)
   ├─ Badge display (from impact.badges)
   └─ Monthly table (from impact.monthlyStats)

ImpactDashboard
├─ State: stats (community data)
├─ State: loading
│
├─ useEffect → GET /api/impact/community/stats
│
└─ Render:
   ├─ Stat cards (totalMealsSaved, etc)
   ├─ Charts (from monthlyData)
   └─ Leaderboard (from topDonors)
```

---

## Error Handling Flow

```
User Action
    │
    ├─ Try-Catch Block
    │
    ├─ If SUCCESS
    │  └─ Update UI
    │     └─ Show success message
    │
    └─ If ERROR
       ├─ Log error to console
       ├─ Check error.response?.data?.message
       └─ Show user-friendly alert
          └─ "Error claiming food: [specific message]"
```

---

## Summary of Flows

✅ **Donation Flow** - User donates → Creates food → Updates impact  
✅ **Claim Flow** - User claims → Updates impact → Awards badges  
✅ **Profile Flow** - User visits profile → Loads impact data → Shows stats & badges  
✅ **Dashboard Flow** - Dashboard loads → Aggregates all impact → Shows charts  
✅ **Badge Flow** - Action completed → Check criteria → Award if threshold met  

