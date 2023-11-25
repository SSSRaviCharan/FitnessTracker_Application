const mongoose = require("mongoose");

const LoginSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    password: { type: String },
    height: { type: Number },
    weight: { type: Number },
    dob: { type: String },
  },
  {
    collection: "login",
  }
);

module.exports = mongoose.model("login", LoginSchema);
