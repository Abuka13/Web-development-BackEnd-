const Measurement = require("../models/Measurement");

const getMeasurements = async (req, res) => {
  try {

    const field = req.query.field;
    const startDate = req.query.start_date;
    const endDate = req.query.end_date;


    if (!field) {
      return res.status(400).json({
        message: "Query parameter 'field' is required"
      });
    }

    if (field !== "field1" && field !== "field2" && field !== "field3") {
      return res.status(400).json({
        message: "Field must be field1, field2 or field3"
      });
    }


    const filter = {};

    if (startDate || endDate) {
      filter.timestamp = {};

      if (startDate) {
        filter.timestamp.$gte = new Date(startDate);
      }

      if (endDate) {
        filter.timestamp.$lte = new Date(endDate);
      }
    }


    const measurements = await Measurement.find(filter)
      .sort({ timestamp: 1 })
      .select({
        timestamp: 1,
        [field]: 1,
        _id: 0
      });


    if (measurements.length === 0) {
      return res.status(404).json({
        message: "No data found"
      });
    }


    res.status(200).json({
      field: field,
      count: measurements.length,
      data: measurements
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};



const getMetrics = async (req, res) => {
  try {
    const field = req.query.field;
    const startDate = req.query.start_date;
    const endDate = req.query.end_date;

    if (!field) {
      return res.status(400).json({
        message: "Query parameter 'field' is required"
      });
    }

    if (field !== "field1" && field !== "field2" && field !== "field3") {
      return res.status(400).json({
        message: "Field must be field1, field2 or field3"
      });
    }

    const filter = {};

    if (startDate || endDate) {
      filter.timestamp = {};

      if (startDate) {
        filter.timestamp.$gte = new Date(startDate);
      }

      if (endDate) {
        filter.timestamp.$lte = new Date(endDate);
      }
    }

    const data = await Measurement.find(filter).select({
      [field]: 1,
      _id: 0
    });

    if (data.length === 0) {
      return res.status(404).json({
        message: "No data found"
      });
    }


    const values = data.map(item => item[field]);


    let sum = 0;
    let min = values[0];
    let max = values[0];

    for (let i = 0; i < values.length; i++) {
      sum += values[i];

      if (values[i] < min) min = values[i];
      if (values[i] > max) max = values[i];
    }

    const avg = sum / values.length;

    let varianceSum = 0;
    for (let i = 0; i < values.length; i++) {
      varianceSum += Math.pow(values[i] - avg, 2);
    }

    const stdDev = Math.sqrt(varianceSum / values.length);


    res.status(200).json({avg: Number(avg.toFixed(2)), min, max, stdDev: Number(stdDev.toFixed(2))
    });

  } catch (error) {
    res.status(500).json({message: "Server error", error: error.message});
  }
};

module.exports = {getMeasurements, getMetrics};

