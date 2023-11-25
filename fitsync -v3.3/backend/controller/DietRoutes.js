const routes = require("express").Router();
const DietModel = require("../model/DietSchema");

//post request
async function create_Calories(req, res) {
  if (!req.body) return res.status(400).json("Post HTTP data not provided");
  // console.log(req.body);
  const { userID, name, amount, date } = req.body; // Make sure the user ID is sent from the frontend

  const Create = new DietModel({
    user_id: userID, // Set the user field with the user's ID
    name: name,
    amount: amount,
    date: date,
  });

  await Create.save(function (err) {
    if (!err) return res.json(Create);
    return res
      .status(400)
      .json({ message: `Error while creating calories ${err}` });
  });
}

//get request
async function get_Calories(req, res) {
  let data = await DietModel.find({});
  return res.json(data);
}

//delete request

// async function delete_Calorie(req, res) {
//   if (!req.body) res.status(400).json({ message: "Request body not Found" });
//   await DietModel.deleteOne(req.body, function (err) {
//     if (!err) res.json("Record Deleted...!");
//   })
//     .clone()
//     .catch(function (err) {
//       res.json("Error while deleting Transaction Record");
//     });
// }

// update request
async function update_Calorie(req, res) {
  const { name, amount, date } = req.body;
  const itemId = req.params.id;

  try {
    const updatedItem = await DietModel.findByIdAndUpdate(
      itemId,
      { name, amount, date },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ message: `Error while updating calorie: ${err}` });
  }
}

routes.route("/api/addCalorie").post(create_Calories).get(get_Calories);

// routes.route("/api/addCalorie/:id").delete(delete_Calorie);

routes.route("/api/updateCalorie/:id").put(update_Calorie);

module.exports = routes;
