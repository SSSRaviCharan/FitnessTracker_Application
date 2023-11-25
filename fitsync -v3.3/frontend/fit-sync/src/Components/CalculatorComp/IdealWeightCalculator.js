import React, { useEffect, useState } from "react";
import WeightChart from "./charts/WeightChart";
import axios from "axios";

function IdealWeightCalculator() {
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [idealWeight, setIdealWeight] = useState("");
  const [details, setDetails] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [refreshUpperBMI, setRefreshUpperBMI] = useState(false);

  const user = window.localStorage.getItem("userID");

  useEffect(() => {
    axios
      .get(`http://localhost:4000/details/retrieve/${user}`)
      .then(({ data }) => {
        setDetails(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const calculateIdealWeight = () => {
    if (gender && age && heightCm) {
      if (gender === "male") {
        const idealWeightMale = 50 + 0.91 * (heightCm - 152.4);
        setIdealWeight(idealWeightMale.toFixed(2));
        setIsVisible(true);
      } else {
        const idealWeightFemale = 45.5 + 0.91 * (heightCm - 152.4);
        setIdealWeight(idealWeightFemale.toFixed(2));
        setIsVisible(true);
      }
    } else {
      // Handle missing inputs (e.g., show an alert)
      alert("Please fill in all the fields");
    }
  };

  const saveWEIGHT = () => {
    if (idealWeight !== "" && gender && age && heightCm) {
      const updated_labels = details.weight_label;
      const updated_data = details.weight_data;
      const currentDate = getCurrentDate();

      updated_data.push(idealWeight);
      updated_labels.push(currentDate);

      const url_ = "http://localhost:4000/details/updateweightData";
      const obj = { updated_labels, updated_data, user };
      console.log(obj);
      axios
        .post(url_, obj)
        .then((res) => {
          console.log("success");
          console.log(res.data.message);
          setRefreshUpperBMI((prev) => !prev);
          alert(res.data.message);
        })
        .catch((err) => {
          console.log("error");
          alert(err);
        });
    } else {
      alert("Please fill in all the fields and calculate ideal weight");
    }
  };

  function getCurrentDate() {
    const today = new Date();
    const year = String(today.getFullYear());
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  return (
    <div className="flex justify-between items-center w-[100%] h-screen">
      <div className="flex bg-white items-center m-0 p-0 justify-center w-[90%]">
        <div className="w-[60%] bg-white p-5 border-r-[#ccc] border-r border-solid">
          <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
            Ideal Weight Calculator
          </h1>
          <div className="mb-5">
            <label className="block text-me font-bold mb-2 text-gray-800">
              Gender:{" "}
            </label>
            <select
              className="w-[40%] border rounded text-base p-2.5 border-solid border-[#ccc]"
              value={gender}
              style={{
                width: "100%",
                fontSize: "1rem",
                border: "2px solid #ccc",
                borderRadius: "0.375rem",
              }}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="mb-5">
            <label className="block text-me font-bold mb-2 text-gray-800">
              Age (years):{" "}
            </label>
            <input
              type="number"
              value={age}
              className="input-field rounded"
              style={{
                width: "100%",
                fontSize: "1rem",
                border: "2px solid #ccc",
                borderRadius: "0.375rem",
              }}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
          <div className="mb-5">
            <label className="block text-me font-bold mb-2 text-gray-800">
              Height (cm):{" "}
            </label>
            <input
              type="number"
              value={heightCm}
              className="input-field rounded"
              style={{
                width: "100%",
                fontSize: "1rem",
                border: "2px solid #ccc",
                borderRadius: "0.375rem",
              }}
              onChange={(e) => setHeightCm(e.target.value)}
            />
          </div>
          <div className="mb-2 flex justify-center items-center flex-col">
            <div>
              <button
                className="bg-blue-500 text-white  text-me rounded-full py-2 px-6 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
                onClick={calculateIdealWeight}
              >
                Calculate Ideal Weight
              </button>
            </div>
            {idealWeight !== "" && (
              <div>
                <p className="block text-lg font-bold my-2 text-gray-800">
                  Ideal Weight: {idealWeight} kg
                </p>
              </div>
            )}
            {idealWeight !== null && (
              <button
                className="bg-blue-500 text-white  text-me rounded-full py-2 px-6 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
                onClick={saveWEIGHT}
                style={{ visibility: isVisible ? "visible" : "hidden" }}
              >
                Save Weight
              </button>
            )}
          </div>
        </div>
        <div className="w-[100%] h-[100%] bg-white flex flex-col justify-center items-center">
          <div id="weight-chart" className="w-full">
            <WeightChart refreshUpperBMI={refreshUpperBMI} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default IdealWeightCalculator;
