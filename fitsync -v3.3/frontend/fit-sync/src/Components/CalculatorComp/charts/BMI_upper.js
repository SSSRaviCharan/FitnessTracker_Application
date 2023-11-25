import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Dot,
} from "recharts";
import { subDays, format, formatDistanceToNow, addDays } from "date-fns";

function BMI_upper(props) {
  const [details, setDetails] = useState({});
  const [bmi_labels, setBmi_labels] = useState([]);
  const [bmi_data, setBmi_data] = useState([]);

  const { refreshUpperBMI } = props;
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
  }, [refreshUpperBMI]);

  useEffect(() => {
    if (details && details.bmi_labels && details.bmi_data) {
      setBmi_labels(details.bmi_labels);
      setBmi_data(details.bmi_data);
    }
  }, [details]);

  const bmi_data_float = bmi_data.map((value) => parseFloat(value));

  const combinedArray = bmi_labels.map((date, index) => {
    return {
      date,
      totalBMI: bmi_data_float[index],
    };
  });

  // console.log("combinedArray");
  // console.log(combinedArray);

  // console.log("bmi_labels", bmi_labels);

  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      <h4>BMI GRAPH</h4>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={combinedArray}>
          <XAxis
            dataKey="date"
            tickFormatter={(date) => format(new Date(date), "MMM dd")}
            label={{
              value: "Date",
              position: "insideBottomRight",
              offset: 250,
              dy: 250,
            }}
          />

          <YAxis
            label={{
              value: "BMI",
              angle: -90,
              position: "insideLeft",
              dy: 10,
            }}
          />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="totalBMI"
            stroke="rgba(255, 99, 132, 1)"
            fill="rgba(255, 99, 132, 0.5)"
            strokeWidth={3}
            dot={{
              fill: "red",
              r: 4,
              strokeWidth: 2,
              stroke: "rgba(255, 99, 132, 1)",
            }}
          />
          <CartesianGrid />
        </AreaChart>
      </ResponsiveContainer>
      {/* <img src={chartUrl} alt="BMI Chart" />; */}
    </div>
  );
}

export default BMI_upper;

// const final_bmi_labels = bmi_labels.map((date) => {
//   const [day, month] = date.split("/");
//   return `${day}/${month}`;
// });

// const chartData = encodeURIComponent(
//   JSON.stringify({
//     type: "line",
//     data: {
//       labels: final_bmi_labels,
//       datasets: [
//         {
//           backgroundColor: "rgba(255, 99, 132, 0.5)",
//           borderColor: "rgb(255, 99, 132)",
//           data: bmi_data,
//           label: "BMI",
//           fill: "start",
//         },
//       ],
//     },
//     options: {
//       title: {
//         text: "BMI History",
//         display: true,
//       },
//       scales: {
//         xAxes: [
//           {
//             scaleLabel: {
//               display: true,
//               labelString: "Date",
//             },
//           },
//         ],
//         yAxes: [
//           {
//             stacked: true,
//             scaleLabel: {
//               display: true,
//               labelString: "BMI",
//             },
//           },
//         ],
//       },
//     },
//   })
// );

// const chartUrl = `https://quickchart.io/chart?c=${chartData}`;
