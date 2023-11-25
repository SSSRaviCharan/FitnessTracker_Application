//import "./Diet.css";
import Graph from "../components/Graph";
import Form from "../components/Form";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";

function Diet() {
  const [goal, setGoal] = useState(() =>
    JSON.parse(localStorage.getItem("goal"))
  );
  useEffect(() => {
    localStorage.setItem("goal", JSON.stringify(goal));
  }, [goal]);

  const setGoalSubmit = () => {
    const newGoal = prompt("Add new Goal");
    setGoal(newGoal);
    toast.success("Goal set successfully!", {
      autoClose: 2000,
      position: "top-right",
    });
  };

  return (
    <div className="Diet">
      <div className="container mx-auto max-w-6xl text-center drop-shadow-lg text-gray-800">
        {/* <button
          className="border py-3 px-3 mb-8 text-white bg-indigo-500 rounded-lg"
          onClick={setGoalSubmit}
        >
          Click Me to Set Goal
        </button> */}
        <header className="bg-green-900 py-4 mb-8 text-white">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold">Daily Meal Planner</h1>
          </div>
        </header>
        <div className="grid md:grid-cols-2 gap-10 ">
          {/* <Graph goal={goal} />
          <Form /> */}
          <div className="col-span-1">
            <div className="bg-white rounded-md shadow p-4 w-96">
              <button
                className="border py-3 px-3 mb-8 text-white bg-indigo-500 rounded-lg"
                onClick={setGoalSubmit}
              >
                Click to Set Today's Goal
              </button>
              <Graph goal={goal} />
            </div>
          </div>

          {/* Form Component */}
          <div className="row-span-2">
            <Form />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Diet;
