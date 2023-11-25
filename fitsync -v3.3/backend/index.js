const mongoose = require("mongoose");
const express = require("express");
const app = express();
const routes1 = require("./controller/Routes");
const routes2 = require("./controller/DietRoutes");
const routes3 = require("./controller/WorkoutRoutes");
const cors = require("cors");
const bodyParser = require("body-parser");

//do not remove!!!!
const DietModel = require("./model/DietSchema");
//do not remove!!!!
const WorkoutModel = require("./model/WorkoutSchema");

mongoose.set("strictQuery", true);
mongoose.connect(
  "mongodb+srv://admin:db1234@cluster0.d3nn0pc.mongodb.net/fitness"
);
var db = mongoose.connection;
db.on("open", () => console.log("Connected to DB"));
db.on("error", () => console.log("Error occurred"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/details", routes1);
app.use(routes2);
app.use(routes3);

//do not remove!!!!
app.delete("/api/addCalorie/:id", async (req, res) => {
  const id = req.params.id;
  await DietModel.findByIdAndDelete(id).exec();
  res.send("Item Deleted");
});

//do not remove!!!!
app.delete("/api/addExercise/:id", async (req, res) => {
  const id = req.params.id;
  await WorkoutModel.findByIdAndDelete(id).exec();
  res.send("Item Deleted");
});

app.listen(4000, () => {
  console.log("Server connected at 4000");
});
////////////////////////////////////////////////////////////////////////fallback//////////////////////////////////
//app.use(express.static('public'));
// const storage = multer.diskStorage({
//   destination:(req,file,cb)=>{
//     cb(null,'public/images')
//   },
//   filename:(req,file,cb)=>{
//     cb(null,file.fieldname + "_"+Date.now()+path.extname(file.originalname))
//   }
// })
// const upload = multer({storage:storage});
//app.post("/profilePic", upload.single('profile'), async(req, res) => {
//   const { userID } = req.body;
//   const imageName = req.file.filename;

//   try {
//     const existingRecord = await ProfileModel.findOne({ user_id: userID });
//     if (existingRecord) {
//       await ProfileModel.deleteOne({ user_id: userID });
//     }
//     const newRecord = await ProfileModel.create({ user_id: userID, image: imageName });

//     res.json(newRecord);
//   } catch (error) {
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// app.get("/getPic", async (req, res) => {
//   try {
//     const result = await ProfileModel.find({});
//     res.json(result);
//   } catch (err) {
//     res.json(err);
//   }
// });
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const ProfileModel = require("./model/profileimage");
const multer = require("multer");
const path = require("path");
const cloudinary = require("./utils/cloudinary");

const storage = multer.diskStorage({
  filename:function(req,file,cb){
    cb(null,file.fieldname + "_"+Date.now()+path.extname(file.originalname))
  }
});

const upload = multer({storage:storage});

app.post("/profilePic", upload.single('profile'), async (req, res) => {
  const { userID } = req.body;

  try {
    const result = await cloudinary.uploader.upload(req.file.path);

    // Delete existing record if it exists
    const existingRecord = await ProfileModel.findOne({ user_id: userID });
    if (existingRecord) {
      await cloudinary.uploader.destroy(existingRecord.cloudinary_id);
      await ProfileModel.deleteOne({ user_id: userID });
    }

    // Save the new record with Cloudinary details
    const newRecord = await ProfileModel.create({
      user_id: userID,
      image:result.secure_url,
      cloudinary_id:result.public_id,
    });
    //await newRecord.save();
    res.json(newRecord);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/getPic", async (req, res) => {
  try {
    const result = await ProfileModel.find({});
    res.json(result);
  } catch (err) {
    res.json(err);
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////