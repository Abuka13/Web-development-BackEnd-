require("dotenv").config();
const express = require("express");
const path = require("path");
const connectDB = require("./src/config/db");

const app = express();

app.use(express.json());

connectDB();

app.use(express.static(path.join(__dirname, "view")));

app.use("/api/measurements", require("./src/routes/measurementRoute"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Error with MongoDb"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
