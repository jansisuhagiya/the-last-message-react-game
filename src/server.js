const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const progressRoutes = require("./routes/progressRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/progress", progressRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "The Last Message API is alive.",
  });
});

app.listen(PORT, () => {
  console.log(
    `🎬 The Last Message API running on http://localhost:${PORT}`
  );
});