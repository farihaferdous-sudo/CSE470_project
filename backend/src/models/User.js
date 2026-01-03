import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["donor", "receiver"], required: true, default: "receiver" },
    totalDonated: { type: Number, default: 0 },
    totalReceived: { type: Number, default: 0 },
    mealsSaved: { type: Number, default: 0 },
    donationCount: { type: Number, default: 0 },
    receptionCount: { type: Number, default: 0 },
    badges: [
      {
        name: String,
        description: String,
        achievedDate: Date,
        icon: String,
      },
    ],
    notifications: [],
  },
  { collection: "user" }  // forces collection name
);

export default mongoose.model("User", userSchema);