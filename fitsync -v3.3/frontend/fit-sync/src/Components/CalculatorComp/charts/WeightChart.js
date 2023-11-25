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

function WeightChart(props) {
  const [details, setDetails] = useState({});
  const [weight_labels, setWeight_labels] = useState([]);
  const [weight_data, setWeight_data] = useState([]);
  const user = window.localStorage.getItem("userID");
  const { refreshUpperBMI } = props;

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
    if (details && details.weight_label && details.weight_data) {
      setWeight_labels(details.weight_label);
      setWeight_data(details.weight_data);
      // console.log(weight_labels);
      // console.log(weight_data);
    }
  }, [details]);

  const weight_data_float = weight_data.map((value) => parseFloat(value));

  const combinedArray = weight_labels.map((date, index) => {
    return {
      date,
      totalWEIGHT: weight_data_float[index],
    };
  });

  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      <h4>WEIGHT GRAPH</h4>

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
              value: "Weight",
              angle: -90,
              position: "insideLeft",
              dy: 10,
            }}
          />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="totalWEIGHT"
            stroke="rgba(149, 189, 242, 1)"
            fill="rgba(149, 189, 242, 0.534)"
            strokeWidth={3}
            dot={{
              fill: "rgba(149, 189, 242, 0.534)",
              r: 4,
              strokeWidth: 2,
              stroke: "rgba(149, 189, 242, 1)",
            }}
          />
          <CartesianGrid />
        </AreaChart>
      </ResponsiveContainer>
      {/* <img src={chartUrl} alt="BMI Chart" />; */}
    </div>
  );
}

export default WeightChart;

// const final_weight_labels = weight_labels.map((date) => {
//   const [day, month] = date.split("/");
//   return `${day}/${month}`;
// });

// const chartData = encodeURIComponent(
//   JSON.stringify({
//     type: "line",
//     data: {
//       labels: final_weight_labels,
//       datasets: [
//         {
//           backgroundColor: "rgba(149, 189, 242, 0.534)",
//           borderColor: "rgb(255, 99, 132)",
//           data: weight_data,
//           label: "Body weight",
//           fill: "start",
//         },
//       ],
//     },
//     options: {
//       title: {
//         text: "Body Weight History",
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
//               labelString: "Value",
//             },
//           },
//         ],
//       },
//     },
//   })
// );

// const chartUrl = `https://quickchart.io/chart?c=${chartData}`;

// return <img src={chartUrl} alt="Body Weight Chart" />;
