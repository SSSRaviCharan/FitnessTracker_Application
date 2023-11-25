import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
  Label,
} from "recharts";
import { subDays, format } from "date-fns";
import authUtils from "./authUtils";

function DurationChart() {
  const [exerciseData, setExerciseData] = useState([]);

  useEffect(() => {
    const userID = authUtils.getUserID();

    if (userID) {
      axios
        .get(`http://localhost:4000/api/addExercise?userID=${userID}`)
        .then((response) => {
          const data = response.data;
          setExerciseData(data);
        })
        .catch((error) => {
          console.error("Error fetching exercise data:", error);
        });
    }
  }, []);

  const calculateTotalDurationByDay = () => {
    const userExerciseData = exerciseData.filter(
      (item) => item.user_id === authUtils.getUserID()
    );

    const groupedData = {};

    userExerciseData.forEach((item) => {
      const date = format(new Date(item.date), "yyyy-MM-dd");

      if (groupedData[date]) {
        groupedData[date] += item.duration;
      } else {
        groupedData[date] = item.duration;
      }
    });

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), i);
      return format(date, "yyyy-MM-dd");
    });

    const chartData = last7Days.map((date) => ({
      date,
      totalDuration: groupedData[date] || 0,
    }));

    chartData.sort((a, b) => new Date(a.date) - new Date(b.date));

    return chartData;
  };

  const chartData = calculateTotalDurationByDay();

  return (
    <div className="border rounded shadow-lg p-4">
      <p className="text-center mb-2 font-semibold text-lg">
        Daily Exercise Duration
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8884d8" />
              <stop offset="100%" stopColor="#4caf50" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => format(new Date(date), "MMM dd")}
          >
            <Label
              value="Date"
              position="insideBottom"
              offset={-5}
              style={{ textAnchor: "middle" }}
            />
          </XAxis>
          <YAxis>
            <Label
              value="Duration"
              angle={-90}
              position="insideLeft"
              style={{ textAnchor: "middle" }}
            />
          </YAxis>
          <Tooltip />
          <Bar
            dataKey="totalDuration"
            fill="url(#gradient)"
            name="totalDuration"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DurationChart;
