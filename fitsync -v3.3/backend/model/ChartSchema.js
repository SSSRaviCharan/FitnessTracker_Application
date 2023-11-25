const mongoose = require("mongoose");

const ChartSchema = new mongoose.Schema(
  {
    _id: { type: String },
    name: { type: String },
    bmi_labels: { type: Array },
    bmi_data: { type: Array },
    fat_data: { type: Array },
    fat_labels: { type: Array },
    weight_data: { type: Array },
    weight_label: { type: Array },
  },
  {
    collection: "details",
  }
);

module.exports = mongoose.model("fitness", ChartSchema);
