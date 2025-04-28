const mongoose = require("mongoose");

const ModelMetricsSchema = new mongoose.Schema({
  metrics: { type: Object, required: true },
  model_versions: { type: Object },
  trained_at: { type: Date, default: Date.now },
  dataset_files: { type: Object },
});

module.exports = mongoose.model(
  "ModelMetrics",
  ModelMetricsSchema,
  "model_metrics"
);
