import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement } from "chart.js";
import Label from "./Label";
import Axios from "axios";
import authUtils from "./authUtils";

Chart.register(ArcElement);

const Graph = ({ goal }) => {
  const [totalCal, setTotalCal] = useState(0);
  const userID = authUtils.getUserID();

  useEffect(() => {
    if (userID) {
      Axios.get(`http://localhost:4000/api/addCalorie?user_id=${userID}`)
        .then((response) => {
          const data = response.data;
          const currentDate = new Date().toDateString();

          const sum = data
            .filter(
              (entry) =>
                entry.user_id === userID &&
                new Date(entry.date).toDateString() === currentDate
            )
            .reduce((total, entry) => total + entry.amount, 0);

          setTotalCal(sum);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [userID]);

  const config = {
    data: {
      datasets: [
        {
          data: [totalCal, goal - totalCal],
          backgroundColor: ["#f9c74f", "rgb(54, 162, 235)"],
          hoverOffset: 4,
          borderRadius: 30,
          spacing: 10,
          borderWidth: 1,
        },
      ],
    },
    options: {
      cutout: 115,
      plugins: {
        title: {
          display: true,
          text: "Today's Progress",
          font: {
            size: 18,
            weight: "bold",
          },
        },
        legend: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="flex items-center justify-center max-w-md mx-auto">
      <div className="p-4 mr-5">
        <div className="mx-auto top-[35%] inset-x-0 relative">
          <Doughnut {...config}></Doughnut>
          <h3 className="mt-4 font-semibold text-lg text-center absolute mx-auto top-[35%] inset-x-0">
            Remaining
            <span
              className="block text-2xl"
              style={{ color: "rgb(54, 162, 235)" }}
            >
              {goal - totalCal} KCal
            </span>
          </h3>
        </div>
        <Label goal={goal} totalCal={totalCal} />
      </div>
    </div>
  );
};

export default Graph;
