const mongoose = require("mongoose");

const PicSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User model (or the name of the model you use for users)
      ref: "login", // Replace "User" with the actual model name for users
      required: true,
    },
    image:String,
    cloudinary_id:String
  },
  {
    collection: "Pic",
  }
);

const ProfileModel = mongoose.model("Pic", PicSchema);
module.exports = ProfileModel;
