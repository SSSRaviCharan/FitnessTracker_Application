import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import Label from "./Label";
import Axios from "axios";

const Test = ({ goal }) => {
  const [totalCal, setTotalcal] = useState(0);

  useEffect(() => {
    Axios.get("http://localhost:4000/api/addCalorie")
      .then((response) => {
        const data = response.data;
        let sum = 0;
        data.forEach((element) => (sum += element.amount));

        setTotalcal(sum);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const data = [
    { name: "Total Calories", value: totalCal },
    { name: "Remaining Calories", value: goal - totalCal },
  ];

  return (
    <div className="flex justify-content max-w-xs mx-auto">
      <div className="item">
        <div className="chart relative">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#f9c74f"
                fill="#f9c74f"
              />
            </AreaChart>
          </ResponsiveContainer>
          <h3 className="mb-4 font-bold title">
            Remaining
            <span
              className="block text-3xl"
              style={{ color: "rgb(54, 162, 235)" }}
            >
              {goal - totalCal} Cal
            </span>
          </h3>
        </div>
        <div className="flex flex-col py-10 gap-4">
          <Label goal={goal} totalCal={totalCal} />
        </div>
      </div>
    </div>
  );
};

export default Test;
