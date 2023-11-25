import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const UpdateProfile = () => {
  const [details, setDetails] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
  const [dob, setDob] = useState("");
  const navigate = useNavigate();
  const user = window.localStorage.getItem("userID");

  useEffect(() => {
    axios
      .get(`http://localhost:4000/details/retrieve_data/${user}`)
      .then(({ data }) => {
        setDetails(data);
        // console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user]);

  useEffect(() => {
    // Set state variables with default values from details
    if (details) {
      setName((prevName) => prevName || details.name || "");
      setEmail((prevEmail) => prevEmail || details.email || "");
      setHeight((prevHeight) => prevHeight || details.height || 0);
      setWeight((prevWeight) => prevWeight || details.weight || 0);
      setDob((prevDob) => prevDob || details.dob || "");
    }
  }, [details]);

  const notify = () => {
    toast("✅ Profile Updated", {
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

    try {
      console.log({
        user,
        name,
        email,
        height,
        weight,
        dob,
      });
      const response = await axios.post(
        "http://localhost:4000/details/updateUser",
        {
          user,
          name,
          email,
          height,
          weight,
          dob,
        }
      );

      //   console.log(response.data);
      //   alert("Successfully submitted");
      notify();
      setTimeout(() => {
        navigate("/track");
      }, 1500);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="flex-grow min-h-screen body">
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
      <div className="flex items-center py-3 mx-auto md:h-screen lg:py-0">
        {/* <a
          href="#"
          className="flex items-center mt-3 mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img className="w-8 h-8 mr-2" src="/fitSync.jpg" alt="logo" />
          FitSync
        </a> */}
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight text-center tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Update Your Profile
            </h1>
            <form className="space-y-2 md:space-y-6" onSubmit={handleSubmit}>
              {details ? (
                <>
                  <div>
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      defaultValue={details.name || ""}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      defaultValue={details.email || ""}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="height"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Your Height (cm)
                    </label>
                    <input
                      type="number"
                      id="height"
                      name="height"
                      defaultValue={details.height || ""}
                      onChange={(e) => setHeight(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="weight"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Your Weight (kg)
                    </label>
                    <input
                      type="number"
                      id="weight"
                      name="weight"
                      placeholder="Eg. 86kg"
                      defaultValue={details.weight || ""}
                      onChange={(e) => setWeight(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="dob"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      id="dob"
                      name="dob"
                      defaultValue={details.dob || ""}
                      onChange={(e) => setDob(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    />
                  </div>
                </>
              ) : (
                <p>Loading...</p>
              )}
              <>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Want to Change Password?{" "}
                  <Link
                    to="/update_password"
                    className="font-medium text-primary-600 text-blue-900 hover:underline dark:text-primary-500"
                  >
                    Change Password
                  </Link>
                </p>
                <button
                  type="submit"
                  className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Save Changes
                </button>
              </>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UpdateProfile;
