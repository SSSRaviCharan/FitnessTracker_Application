const mongoose = require("mongoose");

const DietSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User model (or the name of the model you use for users)
      ref: "login", // Replace "User" with the actual model name for users
      required: true,
    },
    name: {
      type: String,
      required: false,
    },
    amount: {
      type: Number,
      required: false,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    collection: "calories",
  }
);

const DietModel = mongoose.model("calories", DietSchema);
module.exports = DietModel;
