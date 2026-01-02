import express from "express";
import {
  getAvailableFoods,
  claimFood
} from "../controllers/FoodDonationController.js";

const router = express.Router();

router.get("/", getAvailableFoods);
router.put("/claim/:id", claimFood);

export default router;

