import React, { useEffect, useState } from "react";
import List from "./List";
import Axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import authUtils from "./authUtils";

const Form = () => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState();
  const [duration, setDuration] = useState();
  const [newdate, setDate] = useState(null);
  const [calorieList, setCalorieList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [userID, setUserID] = useState(null);

  const addFood = () => {
    if (!name || amount === 0 || duration === 0 || !newdate) {
      console.log("Please fill in all fields.");
      return;
    }

    const user = authUtils.getUserID(); // Retrieve the user ID only when needed

    if (!user) {
      console.log("User is not authenticated. Cannot add food entry.");
      return;
    }

    setUserID(user); // Set the userID in the component's state

    // Convert the date to UTC
    // const utcDate = new Date(newdate);
    // const istDate = new Date(utcDate.getTime() + 5.5 * 60 * 60 * 1000);
    // const istDateString = istDate.toISOString();

    // newdate.setTime(
    //   newdate.getTime() - new Date().getTimezoneOffset() * 60 * 1000
    // );

    // var myDate = new Date(newdate).toISOString();

    if (selectedItem) {
      // If an item is selected, it's an update
      Axios.put(
        `http://localhost:4000/api/updateExercise/${selectedItem._id}`,
        {
          userID: user,
          name: name,
          amount: amount,
          duration: duration,
          date: newdate,
        }
      )
        .then((response) => {
          console.log(response);
          // Clearing the form and reset selected item
          setName("");
          setAmount(0);
          setSelectedItem(null);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      // If no item is selected, it's an add
      Axios.post("http://localhost:4000/api/addExercise", {
        userID: user,
        name: name,
        amount: amount,
        duration: duration,
        date: newdate,
      })
        .then((response) => {
          console.log(response);
          setName("");
          setAmount(0);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    Axios.get("http://localhost:4000/api/addExercise")
      .then((response) => {
        setCalorieList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [selectedItem]); // dependency array

  const deleteCalorie = (id) => {
    Axios.delete(`http://localhost:4000/api/addExercise/${id}`).then(() => {
      setCalorieList(calorieList.filter((val) => val._id !== id));
    });
  };

  return (
    <div className="form max-w-sm mx-auto w-96">
      <h1 className="font-bold pb-4 text-xl"> Add Exercise</h1>
      <form id="form" onSubmit={addFood}>
        <div className="grid gap-4">
          <div className="input-group">
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              placeholder="Exercise name"
              value={name} //Bind
              className="mt-1 block w-full py-2 px-3 border border-gray-200 bg-white rounded-md focus:outline-none focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Calories Burned"
              value={amount}
              className="mt-1 block w-full py-2 px-3 border border-gray-200 bg-white rounded-md focus:outline-none focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Duration (in minutes)"
              value={duration}
              className="mt-1 block w-full py-2 px-3 border border-gray-200 bg-white rounded-md focus:outline-none focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div className="input-group">
            <DatePicker
              selected={newdate}
              onChange={(newdate) => setDate(newdate)}
              placeholderText="Select Date"
              dateFormat="yyyy-MM-dd"
              isClearable
              filterDate={(d) => new Date() > d}
            />
          </div>
          <div>
            <button
              className="border py-2 text-white bg-green-400 w-full"
              type="submit"
            >
              {selectedItem ? "Update" : "Add"}
            </button>
            {selectedItem && (
              <button
                onClick={() => setSelectedItem(null)}
                className="border py-2 text-white bg-red-400 w-full mt-2"
              >
                Cancel Update
              </button>
            )}
          </div>
        </div>
      </form>
      <List
        calorieList={calorieList}
        deleteCalorie={deleteCalorie}
        setSelectedItem={setSelectedItem}
      />
    </div>
  );
};

export default Form;
