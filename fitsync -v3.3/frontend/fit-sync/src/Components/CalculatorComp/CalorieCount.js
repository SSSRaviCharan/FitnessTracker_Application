import React from "react";
import { useState } from "react";

function CalorieCount() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("man");
  const [activityLevel, setActivityLevel] = useState("sedentary");
  const [calories, setCalories] = useState(null);

  const calculateCalories = () => {
    if (weight && height && age) {
      const weightKg = parseFloat(weight);
      const heightCm = parseFloat(height);
      const ageYears = parseFloat(age);

      let bmr;
      if (gender === "man") {
        bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageYears + 5;
      } else {
        bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageYears - 161;
      }

      let activityFactor;
      switch (activityLevel) {
        case "sedentary":
          activityFactor = 1.2;
          break;
        case "lightlyActive":
          activityFactor = 1.375;
          break;
        case "moderatelyActive":
          activityFactor = 1.55;
          break;
        case "veryActive":
          activityFactor = 1.725;
          break;
        case "extraActive":
          activityFactor = 1.9;
          break;
        default:
          activityFactor = 1.2;
      }

      const calculatedCalories = bmr * activityFactor;
      setCalories(calculatedCalories.toFixed(2));
    } else {
      // Handle missing inputs (e.g., show an alert)
      alert("Please fill in all the fields to calculate calories");
    }
  };

  return (
    <div className="bg-white-100 min-h-screen flex items-center justify-center">
      <div className="bg-white   p-8 rounded shadow-md w-full sm:w-96">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Calorie Calculator
        </h1>

        <div className="mb-4">
          <label className="block text-me font-bold mb-2 text-gray-800">
            Weight (kg):
            <input
              type="number"
              value={weight}
              className="input-field rounded"
              style={{
                width: "80%",
                fontSize: "1rem",
                border: "2px solid #ccc",
                borderRadius: "0.375rem",
              }}
              onChange={(e) => setWeight(e.target.value)}
            />
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-me font-bold mb-2 text-gray-800">
            Height (cm):
            <input
              type="number"
              value={height}
              className="input-field rounded"
              style={{
                width: "80%",
                fontSize: "1rem",
                border: "2px solid #ccc",
                borderRadius: "0.375rem",
              }}
              onChange={(e) => setHeight(e.target.value)}
            />
          </label>
        </div>

        <div className="mb-4">
          <label className="block text-me font-bold mb-2 text-gray-800">
            Age (years):
            <input
              type="number"
              value={age}
              className="input-field rounded"
              style={{
                width: "80%",
                fontSize: "1rem",
                border: "2px solid #ccc",
                borderRadius: "0.375rem",
              }}
              onChange={(e) => setAge(e.target.value)}
            />
          </label>
        </div>

        <div className="mb-4 relative ">
          <label className="block text-me font-bold mb-2 text-gray-800">
            Activity Level:
          </label>
          <div className="relative inline-block w-full text-gray-700">
            <select
              value={activityLevel}
              className="input-field appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline-blue focus:border-blue-500"
              onChange={(e) => setActivityLevel(e.target.value)}
              style={{
                width: "100%",
                fontSize: "1rem",
                border: "2px solid #ccc",
                borderRadius: "0.375rem",
              }}
            >
              <option value="sedentary">
                Sedentary (little or no exercise)
              </option>
              <option value="lightlyActive">
                Lightly Active (light exercise/sports 1-3 days/week)
              </option>
              <option value="moderatelyActive">
                Moderately Active (moderate exercise/sports 3-5 days/week)
              </option>
              <option value="veryActive">
                Very Active (hard exercise/sports 6-7 days a week)
              </option>
              <option value="extraActive">
                Extra Active (very hard exercise/sports & physical job or 2x
                training)
              </option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M14.35 7.649l-3.85 3.85-3.85-3.85a1 1 0 011.415-1.414l3.85 3.85 3.85-3.85a1 1 0 011.414 1.414z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="mb-6 flex justify-center">
          <button
            className="bg-blue-500 text-white text-me rounded-full py-2 px-6 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
            onClick={calculateCalories}
          >
            Calculate
          </button>
        </div>

        {calories !== null && (
          <div className="flex justify-center">
            <p className="block text-lg font-bold mb-2 text-gray-800">
              Calories: {calories} kcal
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CalorieCount;
