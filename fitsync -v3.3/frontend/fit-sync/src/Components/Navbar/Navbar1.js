import React, { useState, useEffect } from "react";
import { BsArrowLeftShort, BsChevronDown } from "react-icons/bs";
import { GiMeal } from "react-icons/gi";
import { RxDashboard } from "react-icons/rx";
import { GiRunningShoe } from "react-icons/gi";
import { ImCalculator } from "react-icons/im";
import { ImProfile } from "react-icons/im";
import { IoIosContacts, IoIosLogOut } from "react-icons/io";
import BMIcalc from "../CalculatorComp/BMIcalc";
import Bodyfat from "../CalculatorComp/Bodyfat";
import CalorieCount from "../CalculatorComp/CalorieCount";
import IdealWeightCalculator from "../CalculatorComp/IdealWeightCalculator";
import { useNavigate } from "react-router-dom";
import Dash from "../DashboardComp/pages/Dashboard";
import Workout from "../WorkoutComp/pages/Workout";
import Di from "../CalorieComp/pages/Diet";
import ContactForm from "../BluffPages/Contact";
import UpdateProfile from "../BluffPages/UpdateProfile";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Navbar1() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [buttonStates, setButtonStates] = useState({
    one: true,
    two: false,
    three: false,
    four: false,
    five: false,
    six: false,
    seven: false,
    eight: false,
    nine: false,
  });

  const notify = () => {
    toast("✅ Logged Out Successfully", {
      position: "top-center",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  const signout = () => {
    window.localStorage.removeItem("isLoggedIn");
    window.localStorage.removeItem("userID");
    notify();
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  const Menus = [
    { title: "Dashboard", icon: <RxDashboard />, statekey: "one" },
    { title: "Meal Tracker", icon: <GiMeal />, statekey: "two" },
    { title: "Workout", icon: <GiRunningShoe />, statekey: "three" },
    {
      title: "Calculator",
      icon: <ImCalculator />,
      statekey: "four",
      submenu: true,
      submenuItems: [
        { title: "Bodyfat Calculator", statekey: "four" },
        { title: "Calorie Calculator", statekey: "five" },
        { title: "Ideal Weight Calculator", statekey: "six" },
        { title: "BMI Calculator", statekey: "seven" },
      ],
    },
    { title: "Profile", icon: <ImProfile />, statekey: "eight" },
    { title: "Contact", icon: <IoIosContacts />, statekey: "nine" },
    { title: "Logout", spacing: true, line: true, icon: <IoIosLogOut /> },
  ];
  const customStyles = (menu) => ({
    section: {
      marginTop: menu ? "480px" : "8px",
    },
  });

  const handleMenuClick = (title, statekey) => {
    if (title === "Logout") {
      sessionStorage.removeItem("currentPage");
      signout();
      const newButtonStates = {
        one: true,
        two: false,
        three: false,
        four: false,
        five: false,
        six: false,
        seven: false,
        eight: false,
        nine: false,
      };

      setButtonStates(newButtonStates);
      sessionStorage.setItem("buttonStates", JSON.stringify(newButtonStates));
    } else {
      setButtonStates((prevButtonStates) => {
        const newButtonStates = { ...prevButtonStates };

        Object.keys(newButtonStates).forEach((key) => {
          newButtonStates[key] = key === statekey;
        });

        sessionStorage.setItem("buttonStates", JSON.stringify(newButtonStates));

        return newButtonStates;
      });

      setCurrentPage(title);
      sessionStorage.setItem("currentPage", title);
    }
  };

  useEffect(() => {
    const storedButtonStates = JSON.parse(
      sessionStorage.getItem("buttonStates")
    );

    if (storedButtonStates) {
      setButtonStates(storedButtonStates);
    }
  }, []);

  useEffect(() => {
    const storedCurrentPage = sessionStorage.getItem("currentPage");

    if (storedCurrentPage) {
      setCurrentPage(storedCurrentPage);
    }
  }, []);

  return (
    <div className="flex">
      <div className={` self-start mr-auto `}>
        <div
          className={`sticky top-0 bg-dark-purple h-screen p-5 pt-8 ${
            open ? "w-72" : "w-20"
          } duration-300 relative`}
        >
          <BsArrowLeftShort
            className={`bg-white text-dark-purple text-3xl rounded-full absolute -right-3 top-9 border border-dark-purple cursor-pointer ${
              !open && "rotate-180"
            }`}
            onClick={() => setOpen(!open)}
          />
          <div className="inline-flex">
            <img
              src="/fitSync.jpg"
              className={`block float-left cursor-pointer h-10 mr-2 duration-500 ${
                open && "rotate-[360deg]"
              }`}
              alt="logo"
              onClick={() => navigate("/")}
            />
            <h1
              className={`text-white origin-left font-medium text-2xl duration-300 ${
                !open && "scale-0"
              }`}
            >
              FitSync
            </h1>
          </div>
          <ul className="pt-2">
            {Menus.map((menu, index) => (
              <>
                <li
                  key={index}
                  onClick={() => handleMenuClick(menu.title, menu.statekey)}
                  className={`text-gray-300 text-sm flex items-center gap-x-34 cursor pointer p-2 hover:bg-light-white rounded-md ${
                    menu.line && open
                      ? `border-2 px-20 bottom-5 absolute left-4 duration-200`
                      : ""
                  } ${
                    menu.title === "Logout" && !open
                      ? "border-2 pr-0 pl-3 bottom-5 absolute left-4"
                      : ""
                  }`}
                  style={customStyles(menu.spacing).section}
                >
                  <span className="text-2xl block mr-2 float-left">
                    {menu.icon}
                  </span>
                  <span
                    className={`text-lg font-medium flex-1 duration-200 ${
                      !open && "hidden"
                    }`}
                  >
                    {menu.title}
                  </span>
                  {menu.submenu && open && (
                    <BsChevronDown
                      className={`${submenuOpen && "rotate-180"}`}
                      onClick={() => setSubmenuOpen(!submenuOpen)}
                    />
                  )}
                </li>
                {menu.submenu && submenuOpen && open && (
                  <ul>
                    {menu.submenuItems.map((submenuItem, index) => (
                      <li
                        key={index}
                        onClick={() =>
                          handleMenuClick(
                            submenuItem.title,
                            submenuItem.statekey
                          )
                        }
                        className="text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 px-5 hover:bg-light-white rounded-md"
                      >
                        {submenuItem.title}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ))}
          </ul>
        </div>
      </div>
      <div className={`py-6`}>
        <h1 className="text-2xl font-semibold pl-5">{currentPage}</h1>
      </div>
      <div className="flex w-[100%] max-h-screen justify-center">
        <div
          className={`max-w-screen flex flex-col items-center  justify-center `}
        >
          {buttonStates.one && <Dash />}
          {buttonStates.two && <Di />}
          {buttonStates.three && <Workout />}
          {buttonStates.four && <Bodyfat />}
          {buttonStates.five && <CalorieCount />}
          {buttonStates.six && <IdealWeightCalculator />}
          {buttonStates.seven && <BMIcalc />}
          {buttonStates.eight && <UpdateProfile />}
          {buttonStates.nine && <ContactForm />}
          <ToastContainer
            position="bottom-center"
            autoClose={100}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </div>
      </div>
    </div>
  );
}

export default Navbar1;
