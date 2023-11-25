import React, { useState, useEffect } from "react";
import axios from "axios";
import { format, parse } from "date-fns";
import CalorieChart from "../comp/CalorieChart";
import DurationChart from "../comp/DurationChart";
import ActivitiesChart from "../comp/ActivitiesChart";
import defaultUserProfilePhoto from "../img/pfp.jpg";
import ImageUpload from "../comp/ImageUpload";
import Typed from "typed.js";
import BMI_upper from "../../CalculatorComp/charts/BMI_upper";
import BodyFat from "../../CalculatorComp/Bodyfat";
import BodyFatChart from "../../CalculatorComp/charts/BodyFatChart";
import WeightChart from "../../CalculatorComp/charts/WeightChart";

function Dashboard() {
  // const [userProfilePhoto, setUserProfilePhoto] = useState(
  //   JSON.parse(localStorage.getItem("profilePicture")) || "../img/pfp.jpg"
  // );

  // const handleImageUpload = (imgUrl) => {
  //   setUserProfilePhoto(imgUrl);
  //   localStorage.setItem("profilePicture", JSON.stringify(imgUrl));
  // };

  const [user, setUser] = useState("");
  const [userData, setUserData] = useState({
    profilePicture: "",
    height: "",
    weight: "",
    dob: "",
  });
  const [goal, setGoal] = useState(() =>
    JSON.parse(localStorage.getItem("goal"))
  );
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    const currentUser = window.localStorage.getItem("name");
    setUser(currentUser);

    const userID = window.localStorage.getItem("userID");

    axios
      .get(`http://localhost:4000/details/retrieve_data/${userID}`)
      .then(({ data }) => {
        setUserData(data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get("http://localhost:4000/api/addExercise")
      .then(({ data }) => {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

        const sevenDaysData = data.filter(
          (item) =>
            new Date(item.date) >= sevenDaysAgo &&
            new Date(item.date) <= new Date()
        );

        const groupedData = sevenDaysData.reduce((acc, item) => {
          if (!acc[item.user_id]) {
            acc[item.user_id] = [];
          }
          acc[item.user_id].push(item);
          return acc;
        }, {});

        const averages = Object.keys(groupedData).map((user_id) => {
          const totalDuration = groupedData[user_id].reduce(
            (acc, item) => acc + item.duration,
            0
          );
          const averageDuration = totalDuration / groupedData[user_id].length;

          return {
            user_id,
            averageDuration,
          };
        });

        const sortedUsers = averages.sort(
          (a, b) => b.averageDuration - a.averageDuration
        );

        setLeaderboardData(sortedUsers.slice(0, 5));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem("goal", JSON.stringify(goal));
  }, [goal]);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const [userNames, setUserNames] = useState([]);

  const getUserName = async (user_id) => {
    console.log(user_id);
    try {
      const response = await axios.get(
        `http://localhost:4000/details/login/${user_id}`
      );
      return capitalizeFirstLetter(response.data.name);
    } catch (error) {
      console.error("Error fetching user name:", error);
      return "Unknown User";
    }
  };

  useEffect(() => {
    const fetchUserNames = async () => {
      const names = await Promise.all(
        leaderboardData.map(async (user) => getUserName(user.user_id))
      );
      setUserNames(names);
    };

    fetchUserNames();
  }, [leaderboardData]);

  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const user = window.localStorage.getItem("name");
    setGreeting(`Welcome back ${capitalizeFirstLetter(user)}!`);

    const options = {
      strings: [greeting],
      typeSpeed: 30,
      backSpeed: 25,
      showCursor: false,
    };

    const typed = new Typed("#greeting", options);

    return () => {
      typed.destroy();
    };
  }, [greeting]);

  const displayLeaderboard = () => {
    return (
      <div className="overflow-x-auto mt-4">
        <table className="w-full min-w-max bg-white border border-gray-300">
          <thead className="border">
            <tr>
              <th className="py-1 px-1 text-center border-b">Rank</th>
              <th className="py-1 px-1 text-center border-b">User</th>
              <th className="py-1 px-1 text-center border-b">Daily Average</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((user, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
              >
                <td className="py-1 px-1 text-center border">{index + 1}</td>
                <td className="py-1 px-1 text-center border">
                  {userNames[index]}
                </td>
                <td className="py-1 px-1 text-center border">
                  {user.averageDuration.toFixed(2)} min
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="overflow-y-auto max-h-screen overflow-x-hidden">
      <div className="grid grid-cols-4 relative">
        <div className="col-span-3 container relative mr-32 p-4 max-w-5xl">
          <h1 id="greeting" className="text-[28px] mt-10 mb-5 text-center"></h1>
          <div className="flex-wrap mb-8">
            <CalorieChart className="w-full" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white col-span-1 flex-wrap mb-8">
              <ActivitiesChart className="w-full" />
            </div>
            <div className="bg-white col-span-1 flex-wrap mb-8">
              <DurationChart className="w-full" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
            Body Metric Charts
          </h1>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white col-span-1 flex-wrap mb-8 shadow-lg">
              <BMI_upper />
            </div>
            <div className="bg-white col-span-1 flex-wrap mb-8 shadow-lg">
              <BodyFatChart />
            </div>
          </div>
          <div className=" bg-white flex-wrap mb-8 shadow-lg">
            <WeightChart />
          </div>
        </div>

        <div className="col-span-1 border sticky top-0 rounded shadow-xl p-3 h-[685px]">
          <div className="sticky top-5">
            <ImageUpload />
            <h2 className="text-xl font-semibold text-center mb-6">
              {capitalizeFirstLetter(user)}
            </h2>
            <div className="grid grid-cols-3">
              <div className="col-span-1 text-center font-medium">
                <p>{userData.height} cm</p>
                <p className="text-sm">Height</p>
              </div>
              <div className="col-span-1 text-center">
                <p>{userData.weight} kg</p>
                <p className="text-sm">Weight</p>
              </div>
              <div className="col-span-1 text-center">
                {userData.dob && (
                  <>
                    {(() => {
                      const dobDate = parse(
                        userData.dob,
                        "yyyy-MM-dd",
                        new Date()
                      );
                      const currentDate = new Date();
                      const age =
                        currentDate.getFullYear() - dobDate.getFullYear();

                      if (
                        currentDate.getMonth() < dobDate.getMonth() ||
                        (currentDate.getMonth() === dobDate.getMonth() &&
                          currentDate.getDate() < dobDate.getDate())
                      ) {
                        return <p>{age - 1} Y</p>;
                      } else {
                        return <p>{age} Y</p>;
                      }
                    })()}
                    <p className="text-sm">Age</p>
                  </>
                )}
              </div>
            </div>
            <p className="mt-16 text-lg font-semibold text-center">
              🏆 The top 5 users with the most impressive daily workout averages
              over the last 7 days.
            </p>
            <p></p>
            {displayLeaderboard()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
