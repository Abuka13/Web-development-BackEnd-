const express = require("express");
const router = express.Router();

const {
  getMeasurements
} = require("../controllers/measurementController");

router.get("/", getMeasurements);

module.exports = router;
