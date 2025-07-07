import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";

// Initialize Express App
const app = express();

// ✅ Use .env value for CORS origin
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.options("*", cors());

// Connect Database
await connectDB();

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Server is Running");
});
app.use("/api/user", userRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/bookings", bookingRouter);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
