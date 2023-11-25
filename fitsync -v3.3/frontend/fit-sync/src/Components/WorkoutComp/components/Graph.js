import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import Label from "./Label";
import Axios from "axios";
import authUtils from "./authUtils";

Chart.register(ArcElement, CategoryScale, LinearScale, Title, Tooltip);

const Graph = ({ goal }) => {
  const [exerciseData, setExerciseData] = useState([]);
  const userID = authUtils.getUserID();

  useEffect(() => {
    if (userID) {
      Axios.get(`http://localhost:4000/api/addExercise?user_id=${userID}`)
        .then((response) => {
          const data = response.data;
          const currentDate = new Date().toDateString();

          // Filter data for the current date and the authenticated user
          const filteredData = data.filter(
            (entry) =>
              entry.user_id === userID &&
              new Date(entry.date).toDateString() === currentDate
          );

          setExerciseData(filteredData);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [userID]);

  // Calculate remaining calories
  const remainingCalories =
    goal - exerciseData.reduce((total, entry) => total + entry.amount, 0);

  // Prepare data for the Pie Chart
  const pieData = {
    labels: [...exerciseData.map((entry) => entry.name), "Remaining Calories"],
    datasets: [
      {
        data: [...exerciseData.map((entry) => entry.amount), remainingCalories],
        backgroundColor: [
          "#f9c74f",
          "#a05195",
          "#2a9d8f",
          "#e76f51",
          "#89609e",
          "#b4aee8", // Color for remaining calories
        ],
        hoverOffset: 4,
        borderRadius: 30,
        spacing: 1,
      },
    ],
  };

  const config = {
    data: pieData,
    options: {
      plugins: {
        title: {
          display: false, // Disable the default title display
          text: `Exercise Calories`,
          font: {
            size: 18,
            weight: "bold",
          },
        },
        legend: {
          display: true,
          position: "bottom",
        },
      },
      onDraw: (chart) => {
        const ctx = chart.ctx;
        const width = chart.width;
        const height = chart.height;

        ctx.restore();
        const fontSize = (height / 114).toFixed(2);
        ctx.font = fontSize + "em Arial";
        ctx.textBaseline = "middle";
        const text = `Remaining: ${remainingCalories} KCal`;

        const textX = Math.round((width - ctx.measureText(text).width) / 2);
        const textY = height / 2;

        ctx.fillText(text, textX, textY);
        ctx.save();
      },
    },
  };

  return (
    <div className="flex items-center justify-center max-w-md mx-auto">
      <div className="bg-white rounded-md p-4 w-full">
        <div className="mx-auto relative">
          <Pie {...config}></Pie>
        </div>
        <Label
          goal={goal}
          totalCal={exerciseData.reduce(
            (total, entry) => total + entry.amount,
            0
          )}
        />
      </div>
    </div>
  );
};

export default Graph;

//Previous version using doughnut

// import React, { useState, useEffect } from "react";
// import { Doughnut } from "react-chartjs-2";
// import { Chart, ArcElement } from "chart.js";
// import Label from "./Label";
// import Axios from "axios";
// import authUtils from "./authUtils";

// Chart.register(ArcElement);

// const Graph = ({ goal }) => {
//   const [totalCal, setTotalCal] = useState(0);
//   const userID = authUtils.getUserID();

//   useEffect(() => {
//     if (userID) {
//       Axios.get(`http://localhost:4000/api/addExercise?user_id=${userID}`)
//         .then((response) => {
//           const data = response.data;
//           const currentDate = new Date().toDateString();

//           const sum = data
//             .filter(
//               (entry) =>
//                 entry.user_id === userID &&
//                 new Date(entry.date).toDateString() === currentDate
//             )
//             .reduce((total, entry) => total + entry.amount, 0);

//           setTotalCal(sum);
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//     }
//   }, [userID]);

//   const config = {
//     data: {
//       datasets: [
//         {
//           data: [totalCal, goal - totalCal],
//           backgroundColor: ["#f9c74f", "rgb(54, 162, 235)"],
//           hoverOffset: 4,
//           borderRadius: 30,
//           spacing: 10,
//         },
//       ],
//     },
//     options: {
//       cutout: 115,
//       plugins: {
//         title: {
//           display: true,
//           text: "Calorie Progress",
//           font: {
//             size: 18,
//             weight: "bold",
//           },
//         },
//         legend: {
//           display: false,
//         },
//       },
//     },
//   };

//   return (
//     <div className="flex items-center justify-center max-w-md mx-auto">
//       <div className="bg-white rounded-md p-4 w-full">
//         <div className="mx-auto top-[35%] inset-x-0 relative">
//           <Doughnut {...config}></Doughnut>
//           <h3 className="mt-4 font-semibold text-lg text-center absolute mx-auto top-[35%] inset-x-0">
//             Remaining
//             <span
//               className="block text-2xl"
//               style={{ color: "rgb(54, 162, 235)" }}
//             >
//               {goal - totalCal} KCal
//             </span>
//           </h3>
//         </div>
//         <Label goal={goal} totalCal={totalCal} />
//       </div>
//     </div>
//   );
// };

// export default Graph;
