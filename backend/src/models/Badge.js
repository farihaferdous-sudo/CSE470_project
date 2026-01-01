import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema(
  {
    badgeId: {
      type: String,
      required: true,
      unique: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    icon: {
      type: String, // emoji or icon name
      required: true
    },
    criteria: {
      type: String,
      enum: ["meals_saved", "donations_made", "waste_reduced", "consistency"],
      required: true
    },
    threshold: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Badge", badgeSchema);
