import React, { useState, useEffect } from "react";
import "boxicons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import authUtils from "./authUtils";

const List = ({ calorieList, deleteCalorie, setSelectedItem }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [userCalorieList, setUserCalorieList] = useState([]);
  const user = authUtils.getUserID();

  useEffect(() => {
    //filtering the calorieList by user_id to get entries for the authenticated user
    const filteredList = calorieList.filter((item) => item.user_id === user);
    setUserCalorieList(filteredList);
  }, [calorieList, user]);

  // fltering items by selected date
  const filteredCalorieList = userCalorieList.filter(
    (item) => new Date(item.date).toDateString() === selectedDate.toDateString()
  );

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    // <div className="flex flex-col py-6 gap-4">
    //   <h1 className="py-4 font-bold text-xl">Calorie Intake History</h1>
    //   <div className="flex items-center">
    //     <label className="mr-2 text-gray-600">Select Date:</label>
    //     <DatePicker
    //       selected={selectedDate}
    //       onChange={handleDateChange}
    //       className="border rounded p-2"
    //     />
    //   </div>
    //   {filteredCalorieList.map((value, index) => (
    //     <CalorieIntake
    //       key={index}
    //       category={value}
    //       deleteCalorie={deleteCalorie}
    //       setSelectedItem={setSelectedItem}
    //     />
    //   ))}
    // </div>
    <div className="flex flex-col">
      <h1 className="py-4 mt-8 font-bold text-xl">Food Intake Log</h1>
      <div className="flex items-center">
        <label className="mr-2 text-gray-600">Select Date:</label>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          className="w-21 border rounded"
        />
      </div>
      <div className="overflow-x-auto mt-4 ">
        <table className=" w-full bg-white border border-gray-300">
          <thead className="border">
            <tr>
              <th className="text-center py-2 px-4">Food Name</th>
              <th className="text-center py-2 px-4">Calorie Content</th>
              <th className="text-center py-2 px-4">Date</th>
              <th className="text-center py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCalorieList.map((value, index) => (
              <CalorieIntake
                key={index}
                category={value}
                deleteCalorie={deleteCalorie}
                setSelectedItem={setSelectedItem}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CalorieIntake = ({ category, deleteCalorie, setSelectedItem }) => {
  if (!category) return null;

  const handleUpdateClick = () => {
    setSelectedItem(category);
  };

  const handleDeleteClick = () => {
    deleteCalorie(category._id);
    window.location.reload(); //reolad page
  };

  return (
    // <div className="bg-white shadow-md rounded-lg px-4 py-3 mt-3">
    //   <div className="flex justify-between">
    //     <div>
    //       <h2 className="font-semibold text-lg">
    //         {category.name ?? "Unknown"}
    //       </h2>
    //       <p className="text-gray-600">{category.amount ?? 0} Calories</p>
    //     </div>
    //     <div className="flex items-center space-x-2">
    //       <p className="text-gray-600">
    //         {category.date
    //           ? new Date(category.date).toLocaleDateString()
    //           : "Unknown Date"}
    //       </p>
    //       <button
    //         className="text-red-500 hover:text-red-700"
    //         onClick={handleDeleteClick}
    //       >
    //         <box-icon name="trash" color="red"></box-icon>
    //       </button>
    //       <button
    //         className="text-blue-500 hover:text-blue-700"
    //         onClick={handleUpdateClick}
    //       >
    //         <box-icon name="pencil" color="blue"></box-icon>
    //       </button>
    //     </div>
    //   </div>
    // </div>
    <tr>
      <td className="border p-2">{category.name ?? "Unknown"}</td>
      <td className="border">{category.amount ?? 0} Calories</td>
      <td className="border">
        {category.date
          ? new Date(category.date).toLocaleDateString()
          : "Unknown Date"}
      </td>
      <td className="border justify-center p-1 space-x-2 ">
        <button
          className="text-blue-500 hover:text-blue-700"
          onClick={() => handleUpdateClick(category)}
        >
          <box-icon type="solid" name="edit" color="blue"></box-icon>
        </button>
        <button
          className="text-red-500 hover:text-red-700"
          onClick={() => handleDeleteClick(category._id)}
        >
          <box-icon name="trash" color="red"></box-icon>
        </button>
      </td>
    </tr>
  );
};

export default List;
