# Database Schema Updates

## New Collections Added

### 1. Impact Collection

Stores impact metrics for each donor.

```javascript
{
  _id: ObjectId,
  donorId: String,           // Unique donor identifier
  totalFoodDonated: Number,  // Count of food items donated
  totalFoodReceived: Number, // Count of foods claimed/received
  mealsSaved: Number,        // Total meals saved
  wasteReduced: Number,      // Total kg of waste reduced
  monthlyStats: [
    {
      month: String,         // Format: "2024-01"
      mealsSaved: Number,
      foodDonated: Number,
      wasteReduced: Number
    }
  ],
  badges: [
    {
      badgeId: String,       // e.g., "first_donor"
      earnedAt: Date,
      title: String,         // e.g., "First Donor"
      description: String
    }
  ],
  createdAt: Date,           // Auto-generated
  updatedAt: Date            // Auto-generated
}
```

**Example Document:**
```javascript
{
  _id: ObjectId("..."),
  donorId: "donor1",
  totalFoodDonated: 15,
  totalFoodReceived: 0,
  mealsSaved: 85,
  wasteReduced: 42.5,
  monthlyStats: [
    {
      month: "2024-01",
      mealsSaved: 30,
      foodDonated: 5,
      wasteReduced: 15.0
    },
    {
      month: "2024-02",
      mealsSaved: 55,
      foodDonated: 10,
      wasteReduced: 27.5
    }
  ],
  badges: [
    {
      badgeId: "first_donor",
      earnedAt: ISODate("2024-01-05T10:30:00Z"),
      title: "First Donor",
      description: "Donated your first food item"
    },
    {
      badgeId: "generous_soul",
      earnedAt: ISODate("2024-02-15T14:20:00Z"),
      title: "Generous Soul",
      description: "Donated 10 food items"
    }
  ],
  createdAt: ISODate("2024-01-05T10:00:00Z"),
  updatedAt: ISODate("2024-02-20T15:45:00Z")
}
```

---

### 2. Badge Collection

Defines all available badges and their criteria.

```javascript
{
  _id: ObjectId,
  badgeId: String,          // Unique identifier (e.g., "first_donor")
  title: String,            // Display name (e.g., "First Donor")
  description: String,      // How to earn it
  icon: String,             // Emoji icon (e.g., "🎉")
  criteria: String,         // enum: ["meals_saved", "donations_made", "waste_reduced", "consistency"]
  threshold: Number,        // Value needed to earn badge
  createdAt: Date,
  updatedAt: Date
}
```

**Example Documents (5 default badges):**
```javascript
// Badge 1
{
  _id: ObjectId("..."),
  badgeId: "first_donor",
  title: "First Donor",
  description: "Donated your first food item",
  icon: "🎉",
  criteria: "donations_made",
  threshold: 1,
  createdAt: ISODate("2024-01-01T00:00:00Z"),
  updatedAt: ISODate("2024-01-01T00:00:00Z")
}

// Badge 2
{
  _id: ObjectId("..."),
  badgeId: "generous_soul",
  title: "Generous Soul",
  description: "Donated 10 food items",
  icon: "❤️",
  criteria: "donations_made",
  threshold: 10,
  createdAt: ISODate("2024-01-01T00:00:00Z"),
  updatedAt: ISODate("2024-01-01T00:00:00Z")
}

// Badge 3
{
  _id: ObjectId("..."),
  badgeId: "meals_hero",
  title: "Meals Hero",
  description: "Saved 50 meals",
  icon: "🦸",
  criteria: "meals_saved",
  threshold: 50,
  createdAt: ISODate("2024-01-01T00:00:00Z"),
  updatedAt: ISODate("2024-01-01T00:00:00Z")
}

// Badge 4
{
  _id: ObjectId("..."),
  badgeId: "eco_warrior",
  title: "Eco Warrior",
  description: "Reduced 100 kg of waste",
  icon: "🌍",
  criteria: "waste_reduced",
  threshold: 100,
  createdAt: ISODate("2024-01-01T00:00:00Z"),
  updatedAt: ISODate("2024-01-01T00:00:00Z")
}

// Badge 5
{
  _id: ObjectId("..."),
  badgeId: "consistent_giver",
  title: "Consistent Giver",
  description: "Active for 6 consecutive months",
  icon: "📅",
  criteria: "consistency",
  threshold: 6,
  createdAt: ISODate("2024-01-01T00:00:00Z"),
  updatedAt: ISODate("2024-01-01T00:00:00Z")
}
```

---

## Updated Food Collection

The existing Food collection remains unchanged. However, the `status` field is now used to track:
- `"available"` - Food is available to be claimed
- `"claimed"` - Food has been claimed
- `"expired"` - Food has passed its safe time

**When food is claimed (status changes to "claimed"):**
1. Impact record is updated with:
   - `mealsSaved += quantity` (meal count from food)
   - `wasteReduced += (quantity * 0.5)` (estimated waste reduction)
   - Monthly stats are updated
2. Badge checking is triggered

---

## Data Integrity

### Indexes
Currently using default MongoDB indexing. For production, consider adding:
```javascript
// On Impact collection
db.impacts.createIndex({ donorId: 1 }, { unique: true })

// On Badge collection
db.badges.createIndex({ badgeId: 1 }, { unique: true })
```

### Validation Rules
- `Impact.donorId` must be unique
- `Badge.badgeId` must be unique
- Numerical values (meals, waste) cannot be negative
- Dates must be valid ISO format

---

## Data Flow During Operations

### When Creating a Food Donation:
```
POST /api/foods
{
  donorId: "donor1",
  foodType: "Rice",
  quantity: "10",
  ...
}
  ↓
Food document created
  ↓
Impact.updateImpactOnDonate("donor1")
  ↓
Impact document updated:
  - totalFoodDonated: +1
  - monthlyStats[current_month].foodDonated: +1
```

### When Claiming Food:
```
PATCH /api/foods/:id/claim
{
  recipientId: "recipient1"
}
  ↓
Food.status changed to "claimed"
  ↓
Impact.updateImpactOnClaim(donorId, mealQuantity, wasteEstimate)
  ↓
Impact document updated:
  - mealsSaved: +mealQuantity
  - wasteReduced: +wasteEstimate
  - monthlyStats updated
  ↓
Impact.checkAndAwardBadges()
  ↓
Check each badge criteria
  ↓
If threshold met → Add badge to impact.badges array
```

---

## Querying Examples

### Get a Donor's Total Impact:
```javascript
db.impacts.findOne({ donorId: "donor1" })
// Returns all stats and badges for donor1
```

### Get Monthly Breakdown:
```javascript
db.impacts.findOne({ donorId: "donor1" }, { monthlyStats: 1 })
```

### Get All Badges Earned:
```javascript
db.impacts.findOne({ donorId: "donor1" }, { badges: 1 })
```

### Get Badge Definition:
```javascript
db.badges.findOne({ badgeId: "first_donor" })
```

### Aggregate Community Stats:
```javascript
db.impacts.aggregate([
  {
    $group: {
      _id: null,
      totalMealsSaved: { $sum: "$mealsSaved" },
      totalWasteReduced: { $sum: "$wasteReduced" },
      totalDonators: { $sum: 1 }
    }
  }
])
```

### Get Top Donors:
```javascript
db.impacts.find().sort({ totalFoodDonated: -1 }).limit(10)
```

---

## Automatic Initialization

When the backend server starts, it automatically:
1. Checks if badges exist in the Badge collection
2. If no badges found, inserts the 5 default badges
3. This happens once on first server startup

No manual database setup needed!

---

## MongoDB Notes

- No special MongoDB version required
- All features use standard CRUD operations
- Dates are stored as ISO format for consistency
- Numeric fields are properly typed (Number, not String)
- Arrays are used for nested documents (monthlyStats, badges)

---

## Backup Recommendations

Since this is new data, consider:
1. Regular MongoDB backups
2. Export impact data monthly
3. Maintain audit logs for badge awarding

---

## Future Database Considerations

If scaling:
- Add indexes on `donorId` and `badgeId`
- Archive old monthly stats to separate collection
- Consider caching frequently accessed aggregations
- Implement read replicas for reporting queries

