import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    donorId: {
    //   type: mongoose.Schema.Types.ObjectId,
      type: String,
      required: true
    },

    recipientId: {           
      type: String,
      default: null
    },


    foodType: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true,
      enum: ["cooked", "uncooked", "packaged"], // Added category
      default: "cooked"
    },

    quantity: {
      type: String,
      required: true
    },

    preparedAt: {
      type: Date,
      required: true
    },

    maxSafeHours: {
      type: Number,
      required: true
    },

    pickupLocation: {
      type: String,
      required: true
    },

    pickupTime: {        
      type: Date,
      // required: true
      default: null
    },

    area: {
      type: String,
      required: true,
      enum: [
        "Banani",
        "Gulshan",
        "Dhanmondi",
        "Uttara",
        "Mirpur",
        "Mohammadpur"
      ]
    },

    status: {
      type: String,
      enum: ["available", "claimed", "expired"],
      default: "available"
    },

    reminderSent: {       
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model("Food", foodSchema);
