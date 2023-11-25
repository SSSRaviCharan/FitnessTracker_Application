import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Label,
} from "recharts";
import { subMonths, format } from "date-fns";
import authUtils from "./authUtils";

function ActivitiesRadarChart() {
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

  const calculateExercisesByMonth = () => {
    const userExerciseData = exerciseData.filter(
      (item) => item.user_id === authUtils.getUserID()
    );

    const groupedData = {};

    userExerciseData.forEach((item) => {
      const month = format(new Date(item.date), "yyyy-MM");

      if (groupedData[month]) {
        groupedData[month]++;
      } else {
        groupedData[month] = 1;
      }
    });

    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const month = subMonths(new Date(), i);
      return format(month, "yyyy-MM");
    });

    const chartData = last6Months.map((month) => ({
      month,
      exerciseCount: groupedData[month] || 0,
    }));

    chartData.sort((a, b) => new Date(a.month) - new Date(b.month));

    return chartData;
  };

  const chartData = calculateExercisesByMonth();

  return (
    <div className="border rounded shadow-lg p-4">
      <p className="text-center mb-2 font-semibold text-lg">
        Activities Over Time
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart outerRadius={100} data={chartData}>
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8884d8" />
              <stop offset="100%" stopColor="#4caf50" />
            </linearGradient>
          </defs>
          <PolarGrid />
          <PolarAngleAxis
            dataKey="month"
            tickFormatter={(month) => format(new Date(month), "MMM yyyy")}
          />
          <PolarRadiusAxis angle={30} domain={[0, "dataMax"]} />
          <Radar
            name="Exercise Count"
            dataKey="exerciseCount"
            stroke="#8884d8"
            fill="url(#gradient)"
            fillOpacity={0.6}
          />
          <Tooltip contentStyle={{ fontWeight: "bold" }} />
          <Legend wrapperStyle={{ fontWeight: "bold" }} />
          <Label
            value="Activities over time"
            position="top"
            style={{ fontWeight: "bold" }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ActivitiesRadarChart;
