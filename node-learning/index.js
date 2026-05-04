//import
const express = require("express");
const connectDB = require("./src/config/db");
const { connectRedis } = require("./src/config/redis");

const userRoutes = require("./src/routes/user.routes");

const app = express();

app.use(express.json());

// connect DB & Redis
connectDB();
connectRedis();

// routes
app.use("/", userRoutes);

// test route
app.get("/", (req, res) => {
  res.json({ message: "Server working" });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});