import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import foodRoutes from "./routes/foodRoutes.js";
import notesRoutes from "./routes/notesRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import impactRoutes from "./routes/impactRoutes.js";
import { connectDB } from "./config/db.js";
import { initializeBadges } from "./controllers/impactController.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// middleware
app.use(
    cors({
      origin: "http://localhost:5173",
    })
  );

app.use(express.json()); // this middleware will parse JSON bodies: req.body

app.use("/api/foods", foodRoutes);
app.use("/api/user", userRoutes);
app.use("/api/impact", impactRoutes);
// app.use("/api/notes", notesRoutes);

connectDB().then(async () => {
    await initializeBadges();
    app.listen(PORT, () => {
        console.log("Server started on PORT:", PORT);
    });
});
