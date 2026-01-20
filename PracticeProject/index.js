require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();

const MONGO_URL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wpjd2lz.mongodb.net/?retryWrites=true&w=majority`;

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("Connected to MongoDB cluster"))
  .catch(err => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("Connected to MongoDB Atlas 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
