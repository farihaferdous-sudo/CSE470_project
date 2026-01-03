import Food from "../models/Food.js";

// Create food donation
export const createFood = async (req, res) => {
  try {
    const food = new Food({
      donorId: req.body.donorId, // TEMPORARY
      foodType: req.body.foodType,
      quantity: req.body.quantity,
      category: req.body.category, // Added category
      preparedAt: req.body.preparedAt,
      maxSafeHours: req.body.maxSafeHours,
      pickupLocation: req.body.pickupLocation,
      pickupTime: req.body.pickupTime,
      area: req.body.area
    //   status: "available"
    });

    await food.save();
    res.status(201).json(food);
    // } catch (error) {
    //     res.status(500).json({ message: "Failed to create food listing" });
    // } 
    } catch (error) {
        console.error("Create food error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get single food by ID
export const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: "Food not found" });
    //Update expired status dynamically for single fetch
    const expiryTime = new Date(food.preparedAt).getTime() + food.maxSafeHours * 60 * 60 * 1000;
    if (expiryTime < Date.now() && food.status !== "expired") {
      food.status = "expired";
      await food.save();
    }
    res.json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all foods
// export const getAllFoods = async (req, res) => {
//   try {
//     const foods = await Food.find(); // optionally: .sort({ createdAt: -1 })
//     const now = Date.now();

//     // compute expiry dynamically
//     const foodsWithExpiry = foods.map((food) => {
//       const expiryTime =
//         new Date(food.preparedAt).getTime() +
//         food.maxSafeHours * 60 * 60 * 1000;

//       return {
//         ...food.toObject(),
//         isExpired: expiryTime <= now 
//       };
//     });
    
//     res.json(foods);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };



// Area coordinates mapping (Approximate Lat/Lng for Dhaka areas)
const areaCoordinates = {
  "Banani": { lat: 23.7940, lng: 90.4043 },
  "Gulshan": { lat: 23.7925, lng: 90.4078 },
  "Dhanmondi": { lat: 23.7461, lng: 90.3742 },
  "Uttara": { lat: 23.8728, lng: 90.3810 },
  "Mirpur": { lat: 23.8042, lng: 90.3666 },
  "Mohammadpur": { lat: 23.7658, lng: 90.3584 }
};

// Haversine formula to calculate distance in km
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

export const getAllFoods = async (req, res) => {
  try {
    const { sortBy, lat, lng, category } = req.query;
    
    let query = {};
    if (category && category !== 'all') {
      query.category = category;
    }

    let foods = await Food.find(query);
    
    // Sort by freshness (preparedAt descending)
    if (sortBy === 'freshness') {
      foods = foods.sort((a, b) => new Date(b.preparedAt) - new Date(a.preparedAt));
    }

    const now = Date.now();
    let updatedFoods = foods.map((food) => {
      const expiryTime = new Date(food.preparedAt).getTime() + food.maxSafeHours * 60 * 60 * 1000;
      
      // Calculate distance if lat/lng are provided
      let distance = null;
      if (lat && lng && food.area && areaCoordinates[food.area]) {
        const foodCoords = areaCoordinates[food.area];
        distance = calculateDistance(
          parseFloat(lat), 
          parseFloat(lng), 
          foodCoords.lat, 
          foodCoords.lng
        );
      }

      return {
        ...food.toObject(),
        isExpired: expiryTime <= now,
        distance: distance // Add distance to response
      };
    });

    // Sort by distance if requested and coordinates available
    if (sortBy === 'distance' && lat && lng) {
      updatedFoods.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
    }

    res.json(updatedFoods);
  } catch (error) {
    console.error("Get all foods error:", error);
    res.status(500).json({ message: error.message });
  }
};

