const express = require("express");
const router = express.Router();

const {getMeasurements, getMetrics} = require("../controllers/measurementController");

router.get("/", getMeasurements);
router.get("/metrics", getMetrics);

module.exports = router;
