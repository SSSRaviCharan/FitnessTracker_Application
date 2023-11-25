import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const ChangePassword = () => {
  const [details, setDetails] = useState();
  const [old, setOld] = useState("");
  const [new_, setNew] = useState("");
  const [renew, setRenew] = useState("");
  const navigate = useNavigate();
  const user = window.localStorage.getItem("userID");

  useEffect(() => {
    axios
      .get(`http://localhost:4000/details/retrieve_password/${user}`)
      .then(({ data }) => {
        setDetails(data.password);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user]);

  const notify = () => {
    toast("✅ Password Updated", {
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

  const notify_1 = () => {
    toast("❌ Incorrect Current Password", {
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

  const notify_2 = () => {
    toast("❌ New Passwords Don't Match", {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (details === old) {
      if (new_ === renew) {
        const response = await axios.post(
          "http://localhost:4000/details/updatePassword",
          {
            user,
            new_,
          }
        );
        notify();
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        notify_2();
      }
    } else {
      notify_1();
    }
  };

  return (
    <section className="body h-full min-h-screen pb-40 ">
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
      <div className="flex flex-col h-full items-center mt-20 px-6 py-8 mx-auto md:h-screen lg:py-0">
        <Link
          to="/login"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img className="w-8 h-8 mr-2" src="/fitSync.jpg" alt="logo" />
          FitSync
        </Link>
        {/* <a
          href="#"
          className="flex items-center mt-3 mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img className="w-8 h-8 mr-2" src="/fitSync.jpg" alt="logo" />
          FitSync
        </a> */}
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold text-center leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Update Your Password
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              {details ? (
                <>
                  <div>
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="password_1"
                      name="password_1"
                      placeholder="Current Password"
                      onChange={(e) => setOld(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      New Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="New Password"
                      onChange={(e) => setNew(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="height"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Re-enter New Password
                    </label>
                    <input
                      type="password"
                      id="password_2"
                      name="password_2"
                      placeholder="Re-enter New Password"
                      onChange={(e) => setRenew(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    />
                  </div>
                </>
              ) : (
                <p>Loading...</p>
              )}
              <button
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                onClick={handleSubmit}
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChangePassword;
