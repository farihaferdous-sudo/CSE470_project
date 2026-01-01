const API_URL = "http://localhost:5001/api";

async function test() {
  try {
    console.log("\n🧪 Testing Impact Consolidation Fix...\n");

    // Helper function for API calls
    async function apiCall(method, endpoint, body = null) {
      const options = {
        method,
        headers: { "Content-Type": "application/json" },
      };
      if (body) options.body = JSON.stringify(body);

      const response = await fetch(`${API_URL}${endpoint}`, options);
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      return response.json();
    }

    // 1. Create donations from different case variations
    console.log("1️⃣  Creating donations from different case variations...");
    const testDonors = ["TestUser", "TESTUSER", "testuser", "TestUser "]; // Last one has space

    for (const donor of testDonors) {
      try {
        const response = await apiCall("POST", "/foods", {
          foodType: "rice",
          quantity: "5",
          preparedAt: new Date(),
          maxSafeHours: 4,
          pickupLocation: "Home",
          pickupTime: new Date(),
          area: "Downtown",
          donorId: donor,
        });
        console.log(`   ✅ Created donation from "${donor}"`);
      } catch (e) {
        console.log(`   ❌ Failed for "${donor}": ${e.message}`);
      }
    }

    // 2. Check community stats
    console.log("\n2️⃣  Checking community stats...");
    const stats = await apiCall("GET", "/impact/community/stats");

    console.log(`   📊 Total Donations: ${stats.totalDonations}`);
    console.log(`   🌍 Total Donors: ${stats.totalDonors}`);
    console.log(`   🍽️  Meals Saved: ${stats.totalMealsSaved}`);
    console.log(`   ♻️  Waste Reduced: ${stats.totalWasteReduced} kg`);

    console.log("\n   Top Donors:");
    stats.topDonors.forEach((donor, i) => {
      console.log(
        `     ${i + 1}. "${donor.donorId}": ${donor.totalFoodDonated} donations, ${donor.mealsSaved} meals`
      );
    });

    // 3. Check individual donor profiles
    console.log("\n3️⃣  Checking individual donor profiles...");
    const testProfiles = ["testuser", "TestUser", "TESTUSER"];

    for (const profile of testProfiles) {
      try {
        const donor = await apiCall("GET", `/impact/donor/${profile.toLowerCase()}`);
        console.log(
          `   "${profile}" → ${donor.totalFoodDonated} donations, ${donor.mealsSaved} meals`
        );
      } catch (e) {
        console.log(`   ❌ Error fetching "${profile}": ${e.message}`);
      }
    }

    console.log(
      "\n✅ All donations should be consolidated under a single 'testuser' record!"
    );
  } catch (error) {
    console.error("Test failed:", error.message);
  }

  process.exit(0);
}

test();
