const axios = require("axios");
const ModelMetrics = require("../models/ModelMetrics");
const FormData = require("form-data");

// Proxy retrain to Flask
exports.retrainModel = async (req, res) => {
  try {
    const response = await axios.post(
      "http://localhost:5001/api/retrain_model"
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fetch latest metrics from MongoDB
exports.getLatestMetrics = async (req, res) => {
  try {
    const latest = await ModelMetrics.findOne().sort({ trained_at: -1 });
    if (!latest) {
      return res.status(404).json({ error: "No metrics found" });
    }
    res.json(latest.metrics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Proxy file upload to Flask
exports.uploadCsv = async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.files.file;
    const form = new FormData();
    form.append("file", file.data, file.name);

    const response = await axios.post(
      "http://localhost:5001/api/upload_csv",
      form,
      { headers: form.getHeaders() }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
