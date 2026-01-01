# 🔌 Complete API Documentation

## Base URL
```
http://localhost:5001/api
```

---

## 📚 Food API (Existing + New)

### Create Food Donation
```http
POST /foods
Content-Type: application/json

{
  "donorId": "donor1",
  "foodType": "Rice",
  "quantity": "10",
  "preparedAt": "2024-01-15T10:00:00Z",
  "maxSafeHours": 24,
  "pickupLocation": "123 Main St",
  "pickupTime": "2024-01-15T15:00:00Z",
  "area": "Banani"
}

Response: 201 Created
{
  "_id": "...",
  "donorId": "donor1",
  "foodType": "Rice",
  "quantity": "10",
  "status": "available",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Side Effects:**
- Updates Impact.totalFoodDonated++
- Updates Impact.monthlyStats for current month
- Creates Impact record if doesn't exist

---

### Get All Foods
```http
GET /foods

Response: 200 OK
[
  {
    "_id": "...",
    "donorId": "donor1",
    "foodType": "Rice",
    "quantity": "10",
    "preparedAt": "2024-01-15T10:00:00Z",
    "maxSafeHours": 24,
    "pickupLocation": "123 Main St",
    "status": "available",
    "isExpired": false
  },
  ...
]
```

---

### Get Food by ID
```http
GET /foods/:id

Response: 200 OK
{
  "_id": "...",
  "donorId": "donor1",
  "foodType": "Rice",
  "quantity": "10",
  "status": "available",
  ...
}

Response: 404 Not Found
{
  "message": "Food not found"
}
```

---

### Claim Food ✅ NEW
```http
PATCH /foods/:id/claim
Content-Type: application/json

{
  "recipientId": "recipient1"
}

Response: 200 OK
{
  "message": "Food claimed successfully",
  "food": {
    "_id": "...",
    "donorId": "donor1",
    "foodType": "Rice",
    "status": "claimed",
    ...
  }
}

Response: 400 Bad Request
{
  "message": "Food is not available"
}
```

**Side Effects:**
- Changes food.status = "claimed"
- Updates Impact.mealsSaved += quantity
- Updates Impact.wasteReduced += estimated waste
- Checks and awards badges if criteria met
- Updates monthlyStats for current month

---

### Update Food
```http
PUT /foods/:id
Content-Type: application/json

{
  "foodType": "Rice",
  "quantity": "12",
  "preparedAt": "2024-01-15T10:00:00Z",
  "maxSafeHours": 24,
  "pickupLocation": "456 Oak Ave",
  "area": "Gulshan"
}

Response: 200 OK
{
  "message": "Food updated successfully",
  "food": { ... }
}

Response: 400 Bad Request
{
  "message": "Cannot edit claimed or expired food"
}
```

---

### Delete Food
```http
DELETE /foods/:id

Response: 200 OK
{
  "message": "Food deleted successfully"
}

Response: 400 Bad Request
{
  "message": "Cannot delete claimed or expired food"
}

Response: 404 Not Found
{
  "message": "Food not found"
}
```

---

## 📊 Impact API ✅ NEW

### Get Donor Impact Stats
```http
GET /impact/donor/:donorId

Example: GET /impact/donor/donor1

Response: 200 OK
{
  "_id": "...",
  "donorId": "donor1",
  "totalFoodDonated": 15,
  "totalFoodReceived": 0,
  "mealsSaved": 85,
  "wasteReduced": 42.5,
  "monthlyStats": [
    {
      "month": "2024-01",
      "mealsSaved": 30,
      "foodDonated": 5,
      "wasteReduced": 15.0
    },
    {
      "month": "2024-02",
      "mealsSaved": 55,
      "foodDonated": 10,
      "wasteReduced": 27.5
    }
  ],
  "badges": [
    {
      "badgeId": "first_donor",
      "earnedAt": "2024-01-05T10:30:00Z",
      "title": "First Donor",
      "description": "Donated your first food item"
    },
    {
      "badgeId": "generous_soul",
      "earnedAt": "2024-02-15T14:20:00Z",
      "title": "Generous Soul",
      "description": "Donated 10 food items"
    }
  ],
  "createdAt": "2024-01-05T10:00:00Z",
  "updatedAt": "2024-02-20T15:45:00Z"
}
```

**Note:** If donor not found, automatically creates empty Impact record first, then returns it.

---

### Get Community Statistics
```http
GET /impact/community/stats

Response: 200 OK
{
  "totalMealsSaved": 250,
  "totalWasteReduced": 125.5,
  "totalDonations": 45,
  "totalDonors": 12,
  "monthlyData": [
    {
      "month": "2024-01",
      "mealsSaved": 100,
      "wasteReduced": 50.0,
      "donations": 20
    },
    {
      "month": "2024-02",
      "mealsSaved": 150,
      "wasteReduced": 75.5,
      "donations": 25
    }
  ],
  "topDonors": [
    {
      "donorId": "donor1",
      "donations": 15,
      "mealsSaved": 85
    },
    {
      "donorId": "donor2",
      "donations": 12,
      "mealsSaved": 60
    },
    ...
  ]
}
```

**Note:** Returns top 10 donors, sorted by donation count

---

## 🎖️ Badge System (Backend Only)

Badges are created automatically on server startup. No API endpoints to manage them manually.

### Default Badges in Database
```javascript
Badge 1: {
  badgeId: "first_donor",
  title: "First Donor",
  description: "Donated your first food item",
  icon: "🎉",
  criteria: "donations_made",
  threshold: 1
}

Badge 2: {
  badgeId: "generous_soul",
  title: "Generous Soul",
  description: "Donated 10 food items",
  icon: "❤️",
  criteria: "donations_made",
  threshold: 10
}

Badge 3: {
  badgeId: "meals_hero",
  title: "Meals Hero",
  description: "Saved 50 meals",
  icon: "🦸",
  criteria: "meals_saved",
  threshold: 50
}

Badge 4: {
  badgeId: "eco_warrior",
  title: "Eco Warrior",
  description: "Reduced 100 kg of waste",
  icon: "🌍",
  criteria: "waste_reduced",
  threshold: 100
}

Badge 5: {
  badgeId: "consistent_giver",
  title: "Consistent Giver",
  description: "Active for 6 consecutive months",
  icon: "📅",
  criteria: "consistency",
  threshold: 6
}
```

### Badge Criteria Types
```
"donations_made"  - Count of food donations
"meals_saved"     - Total meals rescued
"waste_reduced"   - Total kg of waste prevented
"consistency"     - Number of months active
```

---

## 📱 Frontend API Calls

### HomePage.jsx
```javascript
// Fetch all foods
axios.get("http://localhost:5001/api/foods")
  .then(res => setFoods(res.data))

// Claim food
axios.patch(`http://localhost:5001/api/foods/${id}/claim`, {
  recipientId: localStorage.getItem("donorId")
})

// Delete food
axios.delete(`http://localhost:5001/api/foods/${id}`)
```

### ImpactDashboard.jsx
```javascript
// Get community stats
axios.get("http://localhost:5001/api/impact/community/stats")
  .then(res => setStats(res.data))
```

### ProfilePage.jsx
```javascript
// Get donor impact
axios.get(`http://localhost:5001/api/impact/donor/${donorId}`)
  .then(res => setImpact(res.data))
```

---

## 🔑 Request Headers

All requests should include:
```http
Content-Type: application/json
```

For POST/PATCH/PUT requests with body.

---

## 📊 Response Status Codes

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Successful GET/PUT/PATCH |
| 201 | Created | Successful POST |
| 400 | Bad Request | Invalid operation (e.g., claim expired food) |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Backend error |

---

## 🚨 Error Handling

### Sample Error Response
```json
{
  "message": "Cannot edit claimed or expired food"
}
```

### Error Messages
| Message | Cause | Solution |
|---------|-------|----------|
| "Food not found" | Invalid food ID | Check ID in URL |
| "Cannot edit claimed or expired food" | Food status != available | Can't modify claimed food |
| "Cannot delete claimed or expired food" | Food status != available | Can't delete claimed food |
| "Food is not available" | Can't claim non-available food | Check food status |

---

## 🧪 Testing with cURL

### Create Food
```bash
curl -X POST http://localhost:5001/api/foods \
  -H "Content-Type: application/json" \
  -d '{
    "donorId": "donor1",
    "foodType": "Rice",
    "quantity": "10",
    "preparedAt": "2024-01-15T10:00:00Z",
    "maxSafeHours": 24,
    "pickupLocation": "123 Main St",
    "pickupTime": "2024-01-15T15:00:00Z",
    "area": "Banani"
  }'
```

### Get All Foods
```bash
curl http://localhost:5001/api/foods
```

### Claim Food
```bash
curl -X PATCH http://localhost:5001/api/foods/{food_id}/claim \
  -H "Content-Type: application/json" \
  -d '{"recipientId": "recipient1"}'
```

### Get Donor Impact
```bash
curl http://localhost:5001/api/impact/donor/donor1
```

### Get Community Stats
```bash
curl http://localhost:5001/api/impact/community/stats
```

---

## 🔄 API Rate Limiting

Currently: **No rate limiting** - Can be added for production

---

## 📝 Authentication

Currently: **No authentication** - Uses donorId from request

Future enhancement:
- Add JWT tokens
- User login/signup
- Protected routes

---

## 🔐 CORS Configuration

Configured for frontend at:
```
http://localhost:5173
```

Can be updated in `backend/src/server.js`:
```javascript
app.use(cors({
  origin: "http://localhost:5173"
}));
```

---

## 📦 Request/Response Examples

### Full Donation Workflow

**Step 1: Create Food**
```http
POST /foods HTTP/1.1
Host: localhost:5001
Content-Type: application/json

{
  "donorId": "donor1",
  "foodType": "Biryani",
  "quantity": "20",
  "preparedAt": "2024-01-15T10:00:00Z",
  "maxSafeHours": 4,
  "pickupLocation": "Gulshan Park",
  "pickupTime": "2024-01-15T12:00:00Z",
  "area": "Gulshan"
}

HTTP/1.1 201 Created
{
  "_id": "507f1f77bcf86cd799439011",
  "donorId": "donor1",
  "foodType": "Biryani",
  "quantity": "20",
  "status": "available",
  ...
}
```

**Step 2: Get All Foods**
```http
GET /foods HTTP/1.1
Host: localhost:5001

HTTP/1.1 200 OK
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "donorId": "donor1",
    "foodType": "Biryani",
    "status": "available",
    ...
  }
]
```

**Step 3: Claim Food**
```http
PATCH /foods/507f1f77bcf86cd799439011/claim HTTP/1.1
Host: localhost:5001
Content-Type: application/json

{
  "recipientId": "recipient1"
}

HTTP/1.1 200 OK
{
  "message": "Food claimed successfully",
  "food": {
    "_id": "507f1f77bcf86cd799439011",
    "status": "claimed",
    ...
  }
}
```

**Step 4: Check Impact**
```http
GET /impact/donor/donor1 HTTP/1.1
Host: localhost:5001

HTTP/1.1 200 OK
{
  "donorId": "donor1",
  "totalFoodDonated": 1,
  "mealsSaved": 20,
  "wasteReduced": 10,
  "badges": [
    {
      "badgeId": "first_donor",
      "earnedAt": "2024-01-15T11:00:00Z",
      "title": "First Donor",
      "description": "Donated your first food item"
    }
  ]
}
```

---

## 🚀 Performance Notes

- Food listing: O(n) where n = total foods
- Claim food: O(1) update + O(b) where b = badge count (usually 5)
- Community stats: O(d*m) where d = donors, m = months (aggregation)

---

## 🔮 Future Enhancements

Potential API additions:
- `GET /impact/donor/:donorId/monthly/:month` - Get monthly details
- `GET /badges` - Get all badge definitions
- `POST /impact/donate-milestone` - Trigger custom milestones
- `DELETE /impact/donor/:donorId` - Remove impact record
- `PUT /badges/:badgeId` - Update badge definition

---

**API Documentation Complete!**

For implementation details, see `IMPLEMENTATION_GUIDE.md`
For database schema, see `DATABASE_SCHEMA.md`
