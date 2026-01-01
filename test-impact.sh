#!/bin/bash

# Test script to verify impact tracking

echo "🧪 Testing Impact Tracking System..."
echo ""

# Test 1: Create a food donation
echo "1️⃣  Creating a test food donation..."
FOOD_RESPONSE=$(curl -s -X POST http://localhost:5001/api/foods \
  -H "Content-Type: application/json" \
  -d '{
    "donorId": "testdonor123",
    "foodType": "Test Rice",
    "quantity": "5",
    "preparedAt": "2026-01-02T10:00:00Z",
    "maxSafeHours": 24,
    "pickupLocation": "Test Location",
    "pickupTime": "2026-01-02T15:00:00Z",
    "area": "Banani"
  }')

FOOD_ID=$(echo $FOOD_RESPONSE | grep -o '"_id":"[^"]*"' | head -1 | sed 's/"_id":"\|"//g')
echo "✅ Food created with ID: $FOOD_ID"
echo ""

# Test 2: Check donor impact after donation
echo "2️⃣  Checking donor impact after donation..."
IMPACT=$(curl -s http://localhost:5001/api/impact/donor/testdonor123)
echo "Donor Impact: $IMPACT" | head -c 200
echo "..."
echo ""

# Test 3: Claim the food
echo "3️⃣  Claiming the food..."
CLAIM=$(curl -s -X PATCH http://localhost:5001/api/foods/$FOOD_ID/claim \
  -H "Content-Type: application/json" \
  -d '{"recipientId": "testrecipient"}')
echo "Claim Response: $CLAIM" | head -c 200
echo "..."
echo ""

# Test 4: Check donor impact after claim
echo "4️⃣  Checking donor impact after claim..."
IMPACT_AFTER=$(curl -s http://localhost:5001/api/impact/donor/testdonor123)
echo "Donor Impact After Claim: $IMPACT_AFTER" | head -c 200
echo "..."
echo ""

echo "✅ Testing complete! Check the impact API responses above."
