import Graph from "../components/Graph";
import Form from "../components/Form";
import { useState, useEffect } from "react";

function Workout() {
  const [goal, setGoal] = useState(() =>
    JSON.parse(localStorage.getItem("goal"))
  );
  useEffect(() => {
    localStorage.setItem("goal", JSON.stringify(goal));
  }, [goal]);

  const setGoalSubmit = () => {
    const newGoal = prompt("Add new Goal");
    setGoal(newGoal);
  };

  return (
    <div className="Workout">
      <div className="container mx-auto max-w-6xl text-center drop-shadow-lg text-gray-800">
        {/* <h1 className="text-4xl py-8 mb-10 bg-slate-800 text-white rounded">
          Calorie Tracker
        </h1> */}
        {/* <button
          className="border py-3 px-3 mb-8 text-white bg-indigo-500 rounded-lg"
          onClick={setGoalSubmit}
        >
          Click Me to Set Goal
        </button>
        <div className="grid md:grid-cols-2 gap-4">
          <Graph goal={goal} />
          <Form />
        </div> */}
        <div className="grid md:grid-cols-2 gap-10 ">
          {/* <Graph goal={goal} />
          <Form /> */}
          <div className="col-span-1">
            <div className="bg-white rounded-md shadow p-4 w-96">
              <button
                className="border py-3 px-3 mb-8 text-white bg-indigo-500 rounded-lg"
                onClick={setGoalSubmit}
              >
                Click to Set Goal
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

export default Workout;
