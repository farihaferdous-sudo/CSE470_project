import Impact from "../models/Impact.js";
import Badge from "../models/Badge.js";
import Food from "../models/Food.js";

// Get or create impact record for a donor
export const getOrCreateImpact = async (donorId) => {
  // Sanitize donorId: trim whitespace and convert to lowercase for consistency
  const sanitizedDonorId = donorId.trim().toLowerCase();
  
  let impact = await Impact.findOne({ donorId: sanitizedDonorId });
  if (!impact) {
    impact = new Impact({ donorId: sanitizedDonorId });
    await impact.save();
    console.log(`Created new impact record for donor: ${sanitizedDonorId}`);
  }
  return impact;
};

// Update impact when food is claimed
export const updateImpactOnClaim = async (donorId, mealQuantity, estimatedWaste) => {
  try {
    const impact = await getOrCreateImpact(donorId);
    
    // Ensure numeric values
    const qty = parseFloat(mealQuantity) || 1;
    const waste = parseFloat(estimatedWaste) || 0;
    
    impact.mealsSaved += qty;
    impact.wasteReduced += waste;
    
    console.log(`Updated impact for ${donorId}: mealsSaved += ${qty}, wasteReduced += ${waste}`);
    
    // Update monthly stats
    const currentMonth = new Date().toISOString().slice(0, 7);
    let monthlyRecord = impact.monthlyStats.find(m => m.month === currentMonth);
    
    if (!monthlyRecord) {
      monthlyRecord = { month: currentMonth, mealsSaved: 0, foodDonated: 0, wasteReduced: 0 };
      impact.monthlyStats.push(monthlyRecord);
    }
    
    monthlyRecord.mealsSaved += qty;
    monthlyRecord.wasteReduced += waste;
    
    // Check for badge eligibility
    await checkAndAwardBadges(impact, donorId);
    
    await impact.save();
    console.log(`Impact saved for ${donorId}`);
    return impact;
  } catch (error) {
    console.error(`Error updating impact on claim for ${donorId}:`, error);
    throw error;
  }
};

// Update impact when food is donated
export const updateImpactOnDonate = async (donorId) => {
  try {
    const impact = await getOrCreateImpact(donorId);
    
    impact.totalFoodDonated += 1;
    
    console.log(`Updated donation count for ${donorId}: ${impact.totalFoodDonated}`);
    
    // Update monthly stats
    const currentMonth = new Date().toISOString().slice(0, 7);
    let monthlyRecord = impact.monthlyStats.find(m => m.month === currentMonth);
    
    if (!monthlyRecord) {
      monthlyRecord = { month: currentMonth, mealsSaved: 0, foodDonated: 0, wasteReduced: 0 };
      impact.monthlyStats.push(monthlyRecord);
    }
    
    monthlyRecord.foodDonated += 1;
    
    await impact.save();
    console.log(`Impact saved for donor ${donorId} - Total donations: ${impact.totalFoodDonated}`);
    return impact;
  } catch (error) {
    console.error(`Error updating impact on donate for ${donorId}:`, error);
    throw error;
  }
};

// Check and award badges
export const checkAndAwardBadges = async (impact, donorId) => {
  const badges = await Badge.find();
  
  for (let badge of badges) {
    const hasBadge = impact.badges.some(b => b.badgeId === badge.badgeId);
    
    if (hasBadge) continue; // Already has badge
    
    let shouldAward = false;
    
    switch (badge.criteria) {
      case "meals_saved":
        shouldAward = impact.mealsSaved >= badge.threshold;
        break;
      case "donations_made":
        shouldAward = impact.totalFoodDonated >= badge.threshold;
        break;
      case "waste_reduced":
        shouldAward = impact.wasteReduced >= badge.threshold;
        break;
      case "consistency":
        shouldAward = impact.monthlyStats.length >= badge.threshold;
        break;
    }
    
    if (shouldAward) {
      impact.badges.push({
        badgeId: badge.badgeId,
        earnedAt: new Date(),
        title: badge.title,
        description: badge.description
      });
    }
  }
};

// Get donor's impact stats
export const getDonorImpact = async (req, res) => {
  try {
    const { donorId } = req.params;
    const impact = await getOrCreateImpact(donorId);
    res.json(impact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get community impact statistics
export const getCommunityStats = async (req, res) => {
  try {
    const impacts = await Impact.find();
    
    const totalMealsSaved = impacts.reduce((sum, i) => sum + i.mealsSaved, 0);
    const totalWasteReduced = impacts.reduce((sum, i) => sum + i.wasteReduced, 0);
    const totalDonations = impacts.reduce((sum, i) => sum + i.totalFoodDonated, 0);
    const totalDonors = impacts.length;
    
    // Get monthly breakdown
    const monthlyData = {};
    impacts.forEach(impact => {
      impact.monthlyStats.forEach(stat => {
        if (!monthlyData[stat.month]) {
          monthlyData[stat.month] = { mealsSaved: 0, wasteReduced: 0, donations: 0 };
        }
        monthlyData[stat.month].mealsSaved += stat.mealsSaved;
        monthlyData[stat.month].wasteReduced += stat.wasteReduced;
        monthlyData[stat.month].donations += stat.foodDonated;
      });
    });
    
    // Sort by month
    const sortedMonthlyData = Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({ month, ...data }));
    
    res.json({
      totalMealsSaved,
      totalWasteReduced,
      totalDonations,
      totalDonors,
      monthlyData: sortedMonthlyData,
      topDonors: impacts
        .sort((a, b) => b.totalFoodDonated - a.totalFoodDonated)
        .slice(0, 10)
        .map(i => ({ donorId: i.donorId, donations: i.totalFoodDonated, mealsSaved: i.mealsSaved }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Initialize default badges
export const initializeBadges = async () => {
  const existingBadges = await Badge.countDocuments();
  if (existingBadges > 0) return;
  
  const defaultBadges = [
    {
      badgeId: "first_donor",
      title: "First Donor",
      description: "Donated your first food item",
      icon: "🎉",
      criteria: "donations_made",
      threshold: 1
    },
    {
      badgeId: "generous_soul",
      title: "Generous Soul",
      description: "Donated 10 food items",
      icon: "❤️",
      criteria: "donations_made",
      threshold: 10
    },
    {
      badgeId: "meals_hero",
      title: "Meals Hero",
      description: "Saved 50 meals",
      icon: "🦸",
      criteria: "meals_saved",
      threshold: 50
    },
    {
      badgeId: "eco_warrior",
      title: "Eco Warrior",
      description: "Reduced 100 kg of waste",
      icon: "🌍",
      criteria: "waste_reduced",
      threshold: 100
    },
    {
      badgeId: "consistent_giver",
      title: "Consistent Giver",
      description: "Active for 6 consecutive months",
      icon: "📅",
      criteria: "consistency",
      threshold: 6
    }
  ];
  
  await Badge.insertMany(defaultBadges);
  console.log("Default badges initialized");
};
