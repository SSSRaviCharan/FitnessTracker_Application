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

function BodyFatChart(props) {
  const [details, setDetails] = useState({});
  const [fat_labels, setFat_labels] = useState([]);
  const [fat_data, setFat_data] = useState([]);

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
    if (details && details.fat_labels && details.fat_data) {
      setFat_labels(details.fat_labels);
      setFat_data(details.fat_data);
      console.log(fat_labels);
      console.log(fat_data);
    }
  }, [details]);

  const fat_data_float = fat_data.map((value) => parseFloat(value));

  const combinedArray = fat_labels.map((date, index) => {
    return {
      date,
      totalFAT: fat_data_float[index],
    };
  });

  // const final_fat_labels = fat_labels.map((date) => {
  //   const [day, month] = date.split("/");
  //   return `${day}/${month}`;
  // });

  // const chartData = encodeURIComponent(
  //   JSON.stringify({
  //     type: "line",
  //     data: {
  //       labels: final_fat_labels,
  //       datasets: [
  //         {
  //           backgroundColor: "rgba(147, 216, 132, 0.7)",
  //           borderColor: "rgb(255, 99, 132)",
  //           data: fat_data,
  //           label: "Body Fat",
  //           fill: "start",
  //         },
  //       ],
  //     },
  //     options: {
  //       title: {
  //         text: "Body Fat History",
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
  //               labelString: "Body Fat (%)",
  //             },
  //           },
  //         ],
  //       },
  //     },
  //   })
  // );

  // const chartUrl = `https://quickchart.io/chart?c=${chartData}`;

  // return <img src={chartUrl} alt="Body Fat Chart" />;
  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      <h4>FAT GRAPH</h4>

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
              value: "FAT(%)",
              angle: -90,
              position: "insideLeft",
              dy: 10,
            }}
          />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="totalFAT"
            stroke="rgba(147, 216, 132, 1)"
            fill="rgba(147, 216, 132, 0.5)"
            strokeWidth={3}
            dot={{
              fill: "rgba(147, 216, 132, 1)",
              r: 4,
              strokeWidth: 2,
              stroke: "rgba(147, 216, 132, 1)",
            }}
          />
          <CartesianGrid />
        </AreaChart>
      </ResponsiveContainer>
      {/* <img src={chartUrl} alt="BMI Chart" />; */}
    </div>
  );
}

export default BodyFatChart;
