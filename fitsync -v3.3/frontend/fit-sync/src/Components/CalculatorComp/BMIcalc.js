import React, { useEffect, useState } from "react";
import BMI_lower from "./charts/BMI_lower";
import BMI_upper from "./charts/BMI_upper";
import axios from "axios";

function BMIcalc() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBMI] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [details, setDetails] = useState({});
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

  const calculateBMI = () => {
    if (height && weight) {
      const heightInMeters = height / 100;
      const bmiValue = weight / (heightInMeters * heightInMeters);
      setBMI(bmiValue.toFixed(2));
      setIsVisible(true);
    } else {
      alert("Please fill in both height and weight to calculate BMI");
    }
  };

  const saveBMI = () => {
    if (bmi !== null && height && weight) {
      const updated_labels = details.bmi_labels;
      const updated_data = details.bmi_data;
      const currentDate = getCurrentDate();

      updated_data.push(bmi);
      updated_labels.push(currentDate);

      const url_ = "http://localhost:4000/details/updateBmiData";
      const obj = { updated_labels, updated_data, user };

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
      alert(
        "Please calculate BMI before saving, and ensure height and weight are filled"
      );
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
    <div className=" flex  items-center w-[100%] h-screen">
      <div className="flex bg-white items-center m-0 p-0 justify-center w-[90%]">
        <div className="bg-white   p-8 rounded  h-[55%] w-{full} sm:w-96">
          <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
            BMI Calculator
          </h1>
          <label className="block text-me font-bold mb-2 text-gray-800">
            Height (cm):
            <input
              type="number"
              value={height}
              style={{
                width: "100%",
                fontSize: "1rem",
                border: "2px solid #ccc",
                borderRadius: "0.375rem",
              }}
              className="input-field rounded"
              onChange={(e) => setHeight(e.target.value)}
            />
          </label>
          <label className="block text-me font-bold mb-2 text-gray-800">
            Weight (kg):
            <input
              type="number"
              style={{
                width: "100%",
                fontSize: "1rem",
                border: "2px solid #ccc",
                borderRadius: "0.375rem",
              }}
              value={weight}
              className="input-field rounded"
              onChange={(e) => setWeight(e.target.value)}
            />
          </label>
          <div className="mb-4 flex justify-center">
            <button
              className="bg-blue-500 text-white  text-me rounded-full py-2 px-6 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
              onClick={calculateBMI}
            >
              Calculate BMI
            </button>
          </div>
          {bmi !== null && (
            <div className="mb-2 flex justify-center">
              <p
                className="block text-lg font-bold mb-2 text-gray-800"
                style={{ visibility: isVisible ? "visible" : "hidden" }}
              >
                Your BMI: {bmi}
              </p>
            </div>
          )}
          {bmi !== null && (
            <div className="mb-2 flex justify-center">
              <button
                onClick={saveBMI}
                className="bg-blue-500 text-white text-me rounded-full  py-2 px-6 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
                style={{ visibility: isVisible ? "visible" : "hidden" }}
              >
                Save BMI
              </button>
            </div>
          )}
        </div>
        <div className="bg-white w-[50%] h-[55%] flex-row  justify-between items-center">
          <div
            id="bmi-chart"
            className="w-full flex flex-col justify-between items-center"
          >
            <BMI_upper refreshUpperBMI={refreshUpperBMI} />
          </div>

          {bmi !== null && (
            <div
              className="max-w-96 max-h-[50%] bg-white"
              style={{ visibility: isVisible ? "visible" : "hidden" }}
            >
              <BMI_lower bmi={bmi.toString()} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BMIcalc;
