import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  Label,
} from "recharts";
import { subDays, format, formatDistanceToNow, addDays } from "date-fns";
import authUtils from "./authUtils";

function CalorieAreaChart() {
  const [calorieData, setCalorieData] = useState([]);
  const [exerciseData, setExerciseData] = useState([]);

  useEffect(() => {
    const userID = authUtils.getUserID();

    if (userID) {
      axios
        .get(`http://localhost:4000/api/addCalorie?userID=${userID}`)
        .then((response) => {
          const data = response.data;
          setCalorieData(data);
        })
        .catch((error) => {
          console.error("Error fetching calorie consumed data:", error);
        });

      axios
        .get(`http://localhost:4000/api/addExercise?userID=${userID}`)
        .then((response) => {
          const data = response.data;
          setExerciseData(data);
        })
        .catch((error) => {
          console.error("Error fetching calorie burned data:", error);
        });
    }
  }, []);

  //total calories consumed by day
  const calculatecaloriesConsumedByDay = () => {
    //filtering data basd on user_id
    const userCalorieData = calorieData.filter(
      (item) => item.user_id === authUtils.getUserID()
    );

    const groupedData = {};

    userCalorieData.forEach((item) => {
      const date = format(new Date(item.date), "yyyy-MM-dd");

      if (groupedData[date]) {
        groupedData[date] += item.amount;
      } else {
        groupedData[date] = item.amount;
      }
    });

    const last4Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), i);
      return format(date, "yyyy-MM-dd");
    });

    //array of objects with the date and total calories
    const chartData = last4Days.map((date) => ({
      date,
      caloriesConsumed: groupedData[date] || 0,
    }));

    //Sort in ascending order
    chartData.sort((a, b) => new Date(a.date) - new Date(b.date));

    return chartData;
  };

  const chartData1 = calculatecaloriesConsumedByDay();

  const caloriesConsumedThisWeek = chartData1.reduce(
    (total, entry) => total + entry.caloriesConsumed,
    0
  );

  const caloriesConsumedToday =
    chartData1.length > 0
      ? chartData1[chartData1.length - 1].caloriesConsumed
      : 0;

  const averageCaloriesPerDay = caloriesConsumedThisWeek / 7;

  //total calories burned by day
  const calculatecaloriesBurnedByDay = () => {
    const userExerciseData = exerciseData.filter(
      (item) => item.user_id === authUtils.getUserID()
    );

    const groupedData = {};

    userExerciseData.forEach((item) => {
      const date = format(new Date(item.date), "yyyy-MM-dd");

      if (groupedData[date]) {
        groupedData[date] += item.amount;
      } else {
        groupedData[date] = item.amount;
      }
    });

    const last4Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), i);
      return format(date, "yyyy-MM-dd");
    });

    //array of objects with the date and total calories
    const chartData = last4Days.map((date) => ({
      date,
      caloriesBurned: groupedData[date] || 0,
    }));

    //sort
    chartData.sort((a, b) => new Date(a.date) - new Date(b.date));

    return chartData;
  };

  const chartData2 = calculatecaloriesBurnedByDay();

  const caloriesBurnedThisWeek = chartData2.reduce(
    (total, entry) => total + entry.caloriesBurned,
    0
  );

  const caloriesBurnedToday =
    chartData2.length > 0
      ? chartData2[chartData2.length - 1].caloriesBurned
      : 0;

  const averageExercisesPerDay = caloriesBurnedThisWeek / 7;

  // console.log("ChartData1:", chartData1);
  // console.log("ChartData2:", chartData2);

  const chartData = chartData1.map(({ date, caloriesConsumed }) => {
    const correspondingEntry = chartData2.find((entry) => entry.date === date);

    return {
      date,
      caloriesConsumed,
      caloriesBurned: correspondingEntry
        ? correspondingEntry.caloriesBurned
        : 0,
    };
  });

  // console.log("Combined ChartData:", chartData);

  return (
    <div className="border rounded shadow-lg p-4">
      <div className="grid grid-cols-3 gap-4 mb-3">
        {/* calorie consumed */}
        <div className="bg-white p-4 rounded shadow-md">
          <h2 className="text-lg font-semibold">Calories Consumed This Week</h2>
          <p className="text-xl">{caloriesConsumedThisWeek} Calories</p>
        </div>
        <div className="bg-white p-4 rounded shadow-md">
          <h2 className="text-lg font-semibold">Calories Consumed Today</h2>
          <p className="text-xl">{caloriesConsumedToday} Calories</p>
        </div>
        <div className="bg-white p-4 rounded shadow-md">
          <h2 className="text-lg font-semibold">
            Average Calories Consumed Per Day
          </h2>
          <p className="text-xl">{averageCaloriesPerDay.toFixed(2)} Calories</p>
        </div>
        {/* calorie burned */}
        <div className="bg-white p-4 rounded shadow-md">
          <h2 className="text-lg font-semibold">Calories Burned This Week</h2>
          <p className="text-xl">{caloriesBurnedThisWeek} Calories</p>
        </div>
        <div className="bg-white p-4 rounded shadow-md">
          <h2 className="text-lg font-semibold">Calories Burned Today</h2>
          <p className="text-xl">{caloriesBurnedToday} Calories</p>
        </div>
        <div className="bg-white p-4 rounded shadow-md">
          <h2 className="text-lg font-semibold">
            Average Calories Burned Per Day
          </h2>
          <p className="text-xl">
            {averageExercisesPerDay.toFixed(2)} Calories
          </p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            {/* caloriesConsumed */}
            <linearGradient
              id="caloriesConsumedGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2} />
            </linearGradient>
            {/* caloriesBurned */}
            <linearGradient
              id="caloriesBurnedGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor="#de8cbf" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#de8cbf" stopOpacity={0.2} />
            </linearGradient>
          </defs>
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
              value="Calories"
              angle={-90}
              position="insideLeft"
              style={{ textAnchor: "middle" }}
            />
          </YAxis>
          <Tooltip />
          <Legend
            verticalAlign="top"
            height={36}
            align="right"
            layout="insideTop"
          />
          <Area
            type="monotone"
            dataKey="caloriesConsumed"
            stroke="#8884d8"
            fill="url(#caloriesConsumedGradient)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="caloriesBurned"
            stroke="#de8cbf"
            fill="url(#caloriesBurnedGradient)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CalorieAreaChart;
