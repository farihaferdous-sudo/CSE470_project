import mongoose from "mongoose";

const foodDonationSchema = new mongoose.Schema({
  foodType: String,
  quantity: String,
  category: {
    type: String,
    enum: ["cooked", "uncooked", "packaged"]
  },
  pickupLocation: String,
  preparedAt: Date,
  maxSafeHours: Number,

  status: {
    type: String,
    enum: ["available", "claimed", "expired"],
    default: "available"
  },

  claimedBy: {
    type: String,
    default: null
  },

  donorEmail: String
}, { timestamps: true });

export default mongoose.model("FoodDonation", foodDonationSchema);
