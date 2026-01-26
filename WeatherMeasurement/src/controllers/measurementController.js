const Measurement = require("../models/Measurement");

const getMeasurements = async (req, res) => {
  try {
    const data = await Measurement
      .find()
      .sort({ timestamp: 1 })
      .limit(10);

    res.status(200).json({
      count: data.length,
      data
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

module.exports = {
  getMeasurements
};
