# Quick Start Guide - Requirement 4 Implementation

## What's New?

Your project now has complete **Community Impact Statistics** tracking with:
- 🎖️ Digital badges system
- 📊 Interactive impact dashboard
- 👤 Personal profile with stats
- 📈 Monthly trend charts

---

## Setup (5 minutes)

### 1. **Install Frontend Dependencies**
```bash
cd frontend
npm install
```
This installs Recharts for chart visualization.

### 2. **Backend Already Setup**
- New models and controllers are ready
- Badges auto-initialize on server startup
- No additional npm packages needed

### 3. **Start Both Servers**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Expected: Server starts on port 5001

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Expected: App runs on http://localhost:5173

---

## How to Test It

### Test 1: Donation & Claim Flow
1. Go to http://localhost:5173/create
2. Enter a donor ID (e.g., "donor1")
3. Fill out the food donation form and submit
4. Go to http://localhost:5173 (Home)
5. Click **"✓ Claim Food"** on the donated item
6. Go to http://localhost:5173/profile
7. See stats updated (1 food donated, meals saved, waste reduced)

### Test 2: Multiple Donations for Badges
1. Repeat Test 1 donation 10 times with same donor
2. Go to `/profile`
3. You should see badges:
   - 🎉 First Donor (1 donation)
   - ❤️ Generous Soul (10 donations)
   - 🦸 Meals Hero (50 meals - claim 50 foods)

### Test 3: Community Dashboard
1. Make several donations from different donors
2. Go to http://localhost:5173/impact
3. See:
   - Total statistics (meals saved, waste reduced)
   - Charts showing trends
   - Top 10 donors leaderboard

### Test 4: Profile Switching
1. Go to `/profile`
2. Use "Switch Profile" input to change donor ID
3. See different stats for each donor

---

## New Routes

### Backend API
```
GET  /api/impact/donor/:donorId       → Get donor's impact stats
GET  /api/impact/community/stats       → Get community statistics
PATCH /api/foods/:id/claim             → Claim food (updates impact)
```

### Frontend Pages
```
/              → Home (food list with claim button)
/impact        → Community Impact Dashboard
/profile       → Personal Profile & Badges
/create        → Donate Food (existing)
/edit/:id      → Edit Food (existing)
/food/:id      → Food Details (existing)
```

---

## File Changes Summary

### New Files (6)
- `backend/src/models/Impact.js` - Impact tracking model
- `backend/src/models/Badge.js` - Badge definitions
- `backend/src/controllers/impactController.js` - Impact logic
- `backend/src/routes/impactRoutes.js` - Impact endpoints
- `frontend/src/pages/ImpactDashboard.jsx` - Community stats page
- `frontend/src/pages/ProfilePage.jsx` - User profile page

### Modified Files (5)
- `backend/src/server.js` - Added impact routes & badge initialization
- `backend/src/routes/foodRoutes.js` - Added claim endpoint
- `frontend/src/App.jsx` - Added routes for new pages
- `frontend/src/components/Navbar.jsx` - Added Impact & Profile links
- `frontend/src/pages/HomePage.jsx` - Added Claim button
- `frontend/package.json` - Added recharts dependency

---

## Default Badges

| Badge | Requirement | Icon |
|-------|------------|------|
| First Donor | 1 donation | 🎉 |
| Generous Soul | 10 donations | ❤️ |
| Meals Hero | 50 meals saved | 🦸 |
| Eco Warrior | 100 kg waste reduced | 🌍 |
| Consistent Giver | 6 months active | 📅 |

---

## Features Checklist

✅ **Track total food donated** - Homepage shows "Food Donated" count  
✅ **Track waste reduced** - Profile shows "Waste Reduced" metric  
✅ **Visualize impact with charts** - ImpactDashboard has monthly trend charts  
✅ **Display personal contribution stats** - ProfilePage shows all donor metrics  
✅ **Reward active users** - ProfilePage displays earned badges with icons  
✅ **Automatic badge awarding** - System checks criteria when food is claimed  

---

## Troubleshooting

**Issue**: Badges not showing up
- **Solution**: Make sure you've made enough donations/claims to meet badge thresholds

**Issue**: Charts not displaying
- **Solution**: Ensure recharts is installed (`npm install` in frontend folder)

**Issue**: Stats not updating
- **Solution**: Hard refresh the page (Ctrl+F5) to clear cache

**Issue**: 404 on /impact or /profile
- **Solution**: Restart frontend server (npm run dev)

---

## Next Steps (Optional Enhancements)

- Add user authentication
- Export statistics as PDF/CSV
- Implement real-time notifications for badges
- Add organization-level impact tracking
- Create impact goals and progress tracking
- Add sharing features for social media

---

## Need Help?

See `IMPLEMENTATION_GUIDE.md` for detailed documentation of:
- All files and their purposes
- Data flow architecture
- Badge system details
- Complete API documentation

---

**You're all set! 🚀 Start the servers and test the community impact features.**
