import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import foodRoutes from "./routes/foodRoutes.js";
import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";

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
// app.use("/api/notes", notesRoutes);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server started on PORT:", PORT);
    });
});
