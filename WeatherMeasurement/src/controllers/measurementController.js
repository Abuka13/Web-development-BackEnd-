const Measurement = require("../models/Measurement");

const MIN_YEAR = 2023;
const MAX_YEAR = new Date().getFullYear() + 1;

const isValidDate = (value) => {
  const d = new Date(value);
  return !isNaN(d.getTime());
};

const isValidYear = (value) => {
  const year = new Date(value).getFullYear();
  return year >= MIN_YEAR && year <= MAX_YEAR;
};

const validateParams = (req) => {
  let { field, start_date, end_date } = req.query;

    start_date = start_date && start_date.trim() !== "" ? start_date : undefined;
    end_date = end_date && end_date.trim() !== "" ? end_date : undefined;

  if (!field) {
    return "Query parameter 'field' is required";
  }

  if (!["field1", "field2", "field3"].includes(field)) {
    return "Field must be field1, field2 or field3";
  }

  if (start_date) {
    if (!isValidDate(start_date) || !isValidYear(start_date)) {
      return "start_date must be between 2023 and current year";
    }
  }

  if (end_date) {
    if (!isValidDate(end_date) || !isValidYear(end_date)) {
      return "end_date must be between 2023 and current year";
    }
  }

  if (start_date && end_date && new Date(start_date) > new Date(end_date)) {
    return "start_date cannot be later than end_date";
  }

  return null;
};

const buildFilter = (start_date, end_date) => {
  const filter = {};
  if (start_date || end_date) {
    filter.timestamp = {};
    if (start_date) filter.timestamp.$gte = new Date(start_date);
    if (end_date) filter.timestamp.$lte = new Date(end_date);
  }
  return filter;
};

const getMeasurements = async (req, res) => {
  try {
    const error = validateParams(req);
    if (error) {
      return res.status(400).json({ message: error });
    }

    const { field, start_date, end_date } = req.query;
    const filter = buildFilter(start_date, end_date);

    const data = await Measurement.find(filter)
      .sort({ timestamp: 1 })
      .select({ timestamp: 1, [field]: 1, _id: 0 });

    if (data.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    res.json({field, count: data.length, data});
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

const getMetrics = async (req, res) => {
  try {
    const error = validateParams(req);
    if (error) {
      return res.status(400).json({ message: error });
    }

    let { field, start_date, end_date } = req.query;

    start_date = start_date && start_date.trim() !== "" ? start_date : undefined;
    end_date = end_date && end_date.trim() !== "" ? end_date : undefined;
    const filter = buildFilter(start_date, end_date);

    const docs = await Measurement.find(filter).select({ [field]: 1, _id: 0 });

    if (docs.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    const values = docs.map(d => d[field]);

    let sum = 0;
    let min = values[0];
    let max = values[0];

    for (const v of values) {
      sum += v;
      if (v < min) min = v;
      if (v > max) max = v;
    }

    const avg = sum / values.length;

    let variance = 0;
    for (const v of values) {
      variance += Math.pow(v - avg, 2);
    }

    const stdDev = Math.sqrt(variance / values.length);

    res.json({avg: Number(avg.toFixed(2)), min, max, stdDev: Number(stdDev.toFixed(2))
    });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {getMeasurements, getMetrics};
