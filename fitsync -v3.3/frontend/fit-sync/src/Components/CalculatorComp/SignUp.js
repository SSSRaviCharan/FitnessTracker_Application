import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { DatePicker } from "rsuite";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
  const [dob, setDob] = useState("");
  const [bmi, setBMI] = useState(0);
  const navigate = useNavigate();

  const notify = (text) => {
    toast(`${text}`, {
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

  const calculateBMI = () => {
    if (height && weight) {
      const heightInMeters = height / 100;
      const bmiValue = weight / (heightInMeters * heightInMeters);
      setBMI(bmiValue.toFixed(2));
      return bmiValue.toFixed(2);
    }
    return 0;
  };

  function getCurrentDate() {
    const today = new Date();
    const year = String(today.getFullYear());
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const handleSubmit = async (e) => {
    calculateBMI();
    e.preventDefault();
    if (!name || !email || !password || !height || !weight || !dob) {
      alert("Please fill in all the required fields");
      return;
    }
    const bmiValue = calculateBMI();
    const obj = { name, email, password, height, weight, dob };

    const url_ = "http://localhost:4000/details/create-user";
    const checkEmailResponse = await axios.post(
      "http://localhost:4000/details/check_email",
      { email }
    );

    if (checkEmailResponse.data.status !== "Accepted") {
      notify("❌ Email is already in use");
      return;
    }
    axios
      .post(url_, obj)
      .then((res) => {
        window.localStorage.setItem("name", res.data.name);

        const bmi_labels = [];
        const bmi_data = [];
        const fat_data = [];
        const fat_labels = [];
        const weight_data = [];
        const weight_label = [];
        const _id = res.data._id;

        const obj2 = {
          _id,
          name,
          bmi_labels,
          bmi_data,
          fat_data,
          fat_labels,
          weight_data,
          weight_label,
        };

        const url_2 = "http://localhost:4000/details/create-user-data";

        return axios.post(url_2, obj2);
      })
      .then((res) => {
        // alert("User Data Created");
        window.localStorage.setItem("isLoggedIn", true);

        const updated_labels = [];
        const updated_data = [];
        const currentDate = getCurrentDate();

        updated_data.push(bmiValue);
        updated_labels.push(currentDate);
        const user = window.localStorage.getItem("userID");

        const url_ = "http://localhost:4000/details/updateBmiData";
        const obj = { updated_labels, updated_data, user };

        axios
          .post(url_, obj)
          .then((res) => {
            // console.log("success");
            // console.log(res.data.message);
            // alert(res.data.message);
            // alert(`User Created Successfully`);
          })
          .catch((err) => {
            console.log("error in BMI");
            alert(err);
          });
        notify("✅ User Created Successfully");
        setTimeout(() => {
          navigate("/track");
        }, 1500);
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <section className=" h-full min-h-screen pb-40 body">
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
      <div class="flex flex-col h-full items-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <Link
          to="/login"
          className="flex items-center mt-3 mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img class="w-8 h-8 mr-2" src="/fitSync.jpg" alt="logo" />
          FitSync
        </Link>
        <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create and account
            </h1>
            <form class="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  for="name"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Enter Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Eg. Jack Ingof"
                  required
                />
              </div>
              <div>
                <label
                  for="email"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required
                />
              </div>
              <div>
                <label
                  for="password"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  minLength="5"
                  name="password"
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  placeholder="Enter Password"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  for="height"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your Height(cm)
                </label>
                <input
                  type="number"
                  name="height"
                  id="height"
                  placeholder="Eg. 176cm"
                  onChange={(e) => setHeight(e.target.value)}
                  value={height}
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  for="weight"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your Weight(kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  id="weight"
                  placeholder="Eg. 86kg"
                  onChange={(e) => setWeight(e.target.value)}
                  value={weight}
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  for="DOB"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="DOB"
                  id="DOB"
                  onChange={(e) => setDob(e.target.value)}
                  value={dob}
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="remember"
                    aria-describedby="remember"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    for="remember"
                    className="text-gray-500 dark:text-gray-300"
                  >
                    I have read the Terms and Conditions
                  </label>
                </div>
              </div>
              <button
                type="submit"
                class="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Create an account
              </button>
              <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  class="font-medium text-blue-600 hover:underline dark:text-primary-500"
                >
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SignUp;
