import express from "express";
import { getDonorImpact, getCommunityStats } from "../controllers/impactController.js";

const router = express.Router();

// Health check
router.get("/health", (req, res) => {
  res.json({ status: "Impact API is running" });
});

router.get("/donor/:donorId", getDonorImpact);
router.get("/community/stats", getCommunityStats);

export default router;
