const routes = require("express").Router();
const WorkoutModel = require("../model/WorkoutSchema");

//post request
async function create_Exercise(req, res) {
  if (!req.body) return res.status(400).json("Post HTTP data not provided");
  // console.log(req.body);
  const { userID, name, amount, duration, date } = req.body; // Make sure the user ID is sent from the frontend

  const Create = new WorkoutModel({
    user_id: userID, // Set the user field with the user's ID
    name: name,
    amount: amount,
    duration: duration,
    date: date,
  });

  await Create.save(function (err) {
    if (!err) return res.json(Create);
    return res
      .status(400)
      .json({ message: `Error while creating exercise ${err}` });
  });
}

//get request
async function get_Exercise(req, res) {
  let data = await WorkoutModel.find({});
  return res.json(data);
}

//delete request

// async function delete_Exercise(req, res) {
//   if (!req.body) res.status(400).json({ message: "Request body not Found" });
//   await WorkoutModel.deleteOne(req.body, function (err) {
//     if (!err) res.json("Record Deleted...!");
//   })
//     .clone()
//     .catch(function (err) {
//       res.json("Error while deleting Transaction Record");
//     });
// }

// update request
async function update_Exercise(req, res) {
  const { name, amount, duration, date } = req.body;
  const itemId = req.params.id;

  try {
    const updatedItem = await WorkoutModel.findByIdAndUpdate(
      itemId,
      { name, amount, duration, date },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ message: `Error while updating exercise: ${err}` });
  }
}

routes.route("/api/addExercise").post(create_Exercise).get(get_Exercise);

// routes.route("/api/addCalorie/:id").delete(delete_Exercise);

routes.route("/api/updateExercise/:id").put(update_Exercise);

module.exports = routes;
