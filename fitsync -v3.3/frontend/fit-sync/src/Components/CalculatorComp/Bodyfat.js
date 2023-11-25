import React, { useEffect, useState } from "react";
import BodyFatChart from "./charts/BodyFatChart";
import axios from "axios";

function BodyFat() {
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState(0);
  const [weight, setWeight] = useState(0);
  const [height, setHeight] = useState(0);
  const [neck, setNeck] = useState(0);
  const [waist, setWaist] = useState(0);
  const [hip, setHip] = useState(0);
  const [final, setFinal] = useState(0);

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

  const calculateBodyFat = () => {
    if (
      age &&
      weight &&
      height &&
      neck &&
      waist &&
      (gender === "male" || hip)
    ) {
      if (gender === "male") {
        const bodyFat =
          495 /
            (1.0324 -
              0.19077 * Math.log10(waist - neck) +
              0.15456 * Math.log10(height)) -
          450;
        // console.log(bodyFat);
        if (bodyFat < 0 || bodyFat > 100) {
          alert("Invalid Input: Please Check Entered Values");
          return;
        }

        setIsVisible(true);
        setFinal(bodyFat.toFixed(2));
      } else if (gender === "female") {
        const bodyFat =
          495 /
            (1.29579 -
              0.35004 *
                Math.log10(
                  parseFloat(waist) + parseFloat(hip) - parseFloat(neck)
                ) +
              0.221 * Math.log10(parseFloat(height))) -
          450;
        if (bodyFat < 0 || bodyFat > 100) {
          alert("Invalid Input: Please Check Entered Values");
          return;
        }
        setFinal(bodyFat.toFixed(2));
        setIsVisible(true);
      }
    } else {
      alert("Please fill in all required fields to calculate body fat");
    }
  };

  const saveFAT = () => {
    if (
      final &&
      age &&
      weight &&
      height &&
      neck &&
      waist &&
      (gender === "male" || hip)
    ) {
      const updated_labels = details.fat_labels;
      const updated_data = details.fat_data;
      const currentDate = getCurrentDate();

      updated_data.push(final);
      updated_labels.push(currentDate);

      const url_ = "http://localhost:4000/details/updatefatData";
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
        "Please calculate body fat before saving and ensure all required fields are filled"
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
    <div class="flex justify-center items-center w-full h-screen">
      <div className="flex bg-white items-center m-0 p-0 justify-center w-[90%]">
        <div className="bg-white w-[60%] p-5 border-r-[#ccc] border-r border-solid">
          <h1
            id="254"
            className="text-3xl font-bold mb-6 text-center text-blue-600"
          >
            Body Fat Calculator
          </h1>
          <div className="flex items-center mb-4">
            <label className="block w-[50%] text-me font-bold mb-2 text-gray-800">
              Gender:{" "}
            </label>
            <select
              style={{
                width: "60%",
                fontSize: "1rem",
                border: "2px solid #ccc",
                borderRadius: "0.375rem",
              }}
              className="w-[40%] border rounded text-base p-2.5 border-solid border-[#ccc]"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="flex items-center mb-4">
            <label className="block w-[50%] text-me font-bold mb-2 text-gray-800">
              Age (years):{" "}
            </label>
            <input
              type="number"
              value={age}
              style={{
                width: "60%",
                fontSize: "1rem",
                border: "2px solid #ccc",
                borderRadius: "0.375rem",
              }}
              className="w-[30%] border rounded text-base p-2.5 border-solid border-[#ccc]"
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
          <div className="flex items-center mb-4">
            <label className="block w-[50%] text-me font-bold mb-2 text-gray-800">
              Weight (kg):{" "}
            </label>
            <input
              type="number"
              value={weight}
              style={{
                width: "60%",
                fontSize: "1rem",
                border: "2px solid #ccc",
                borderRadius: "0.375rem",
              }}
              className="w-[30%] border rounded text-base p-2.5 border-solid border-[#ccc]"
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
          <div className="flex items-center mb-4">
            <label className="block w-[50%] text-me font-bold mb-2 text-gray-800">
              Height (cm):{" "}
            </label>
            <input
              type="number"
              value={height}
              style={{
                width: "60%",
                fontSize: "1rem",
                border: "2px solid #ccc",
                borderRadius: "0.375rem",
              }}
              className="w-[30%] border rounded text-base p-2.5 border-solid border-[#ccc]"
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>
          <div className="flex items-center mb-4">
            <label className="block w-[50%] text-me font-bold mb-2 text-gray-800">
              Neck (cm):{" "}
            </label>
            <input
              type="number"
              style={{
                width: "60%",
                fontSize: "1rem",
                border: "2px solid #ccc",
                borderRadius: "0.375rem",
              }}
              value={neck}
              className="w-[30%] border rounded text-base p-2.5 border-solid border-[#ccc]"
              onChange={(e) => setNeck(e.target.value)}
            />
          </div>
          <div className="flex items-center mb-4">
            <label className="block w-[50%] text-me font-bold mb-2 text-gray-800">
              Waist (cm):{" "}
            </label>
            <input
              type="number"
              value={waist}
              style={{
                width: "60%",
                fontSize: "1rem",
                border: "2px solid #ccc",
                borderRadius: "0.375rem",
              }}
              className="w-[30%] border rounded text-base p-2.5 border-solid border-[#ccc]"
              onChange={(e) => setWaist(e.target.value)}
            />
          </div>
          {gender === "female" && (
            <div className="flex items-center mb-4">
              <label className="block w-[50%] text-me font-bold mb-2 text-gray-800">
                Hip (cm):{" "}
              </label>
              <input
                type="number"
                value={hip}
                className="w-[30%] border rounded text-base p-2.5 border-solid border-[#ccc]"
                onChange={(e) => setHip(e.target.value)}
              />
            </div>
          )}
          <div className="mb-2 flex justify-center items-center flex-col">
            <button
              className="bg-blue-500 text-white text-me rounded-full py-2 px-6 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
              onClick={calculateBodyFat}
            >
              Calculate Body Fat
            </button>
            <p
              className="block w-[50%] text-me font-bold mb-2 text-gray-800 text-center"
              style={{ visibility: isVisible ? "visible" : "hidden" }}
            >
              Body Fat: {final + "%"}
            </p>
            <button
              onClick={saveFAT}
              className="bg-blue-500 text-white text-me rounded-full py-2 px-6 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
              style={{ visibility: isVisible ? "visible" : "hidden" }}
            >
              Save Body FAT
            </button>
          </div>
        </div>
        <div className="w-[100%] bg-white h-[85%] flex flex-col justify-center items-center">
          <div
            id="bmi-chart"
            className="w-full flex flex-col w-[95%] justify-between items-center"
          >
            {/* <BodyFatChart /> */}
            <BodyFatChart refreshUpperBMI={refreshUpperBMI} />
            <p className="block w-[50%] text-me font-bold mb-2 text-gray-800 text-center">
              The American Council on Exercise Body Fat Categorization
            </p>
            <img src="/bodyFat_data.png" alt="Example" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BodyFat;
