import mongoose from "mongoose";

const impactSchema = new mongoose.Schema(
  {
    donorId: {
      type: String,
      required: true,
      unique: true
    },
    totalFoodDonated: {
      type: Number,
      default: 0
    },
    totalFoodReceived: {
      type: Number,
      default: 0
    },
    mealsSaved: {
      type: Number,
      default: 0
    },
    wasteReduced: {
      type: Number, // in kg
      default: 0
    },
    monthlyStats: [
      {
        month: String, // "2024-01" format
        mealsSaved: Number,
        foodDonated: Number,
        wasteReduced: Number
      }
    ],
    badges: [
      {
        badgeId: String,
        earnedAt: Date,
        title: String,
        description: String
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Impact", impactSchema);
