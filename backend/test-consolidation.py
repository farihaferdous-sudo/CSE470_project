#!/usr/bin/env python3
import urllib.request
import json
import sys

API_URL = "http://localhost:5001/api"

def api_call(method, endpoint, data=None):
    url = f"{API_URL}{endpoint}"
    headers = {"Content-Type": "application/json"}
    
    if data:
        req_data = json.dumps(data).encode('utf-8')
        req = urllib.request.Request(url, data=req_data, headers=headers, method=method)
    else:
        req = urllib.request.Request(url, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode('utf-8'))
    except Exception as e:
        print(f"Error: {e}")
        return None

print("\n🧪 Testing Impact Consolidation Fix...\n")

# 1. Create donations
print("1️⃣  Creating donations from different case variations...")
test_donors = ["TestUser", "TESTUSER", "testuser", "TestUser "]

for donor in test_donors:
    response = api_call("POST", "/foods", {
        "foodType": "rice",
        "quantity": "5",
        "maxSafeHours": 4,
        "pickupLocation": "Home",
        "area": "Downtown",
        "donorId": donor
    })
    if response:
        print(f"   ✅ Created donation from \"{donor}\"")
    else:
        print(f"   ❌ Failed for \"{donor}\"")

# 2. Check community stats
print("\n2️⃣  Checking community stats...")
stats = api_call("GET", "/impact/community/stats")

if stats:
    print(f"   📊 Total Donations: {stats.get('totalDonations', 0)}")
    print(f"   🌍 Total Donors: {stats.get('totalDonors', 0)}")
    print(f"   🍽️  Meals Saved: {stats.get('totalMealsSaved', 0)}")
    print(f"   ♻️  Waste Reduced: {stats.get('totalWasteReduced', 0)} kg")
    
    print("\n   Top Donors:")
    for i, donor in enumerate(stats.get('topDonors', [])[:5]):
        print(f"     {i+1}. \"{donor['donorId']}\": {donor['totalFoodDonated']} donations, {donor['mealsSaved']} meals")

# 3. Check individual profiles
print("\n3️⃣  Checking individual donor profiles...")
for profile in ["testuser", "TestUser", "TESTUSER"]:
    donor = api_call("GET", f"/impact/donor/{profile.lower()}")
    if donor:
        print(f"   \"{profile}\" → {donor['totalFoodDonated']} donations, {donor['mealsSaved']} meals")
    else:
        print(f"   ❌ Error fetching \"{profile}\"")

print("\n✅ All donations should be consolidated under a single 'testuser' record!")
