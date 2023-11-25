import { useForm } from "react-hook-form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Contact() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ mode: "onChange" });

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

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/details/send-email",
        data
      );

      console.log(response.data);
      notify("✅ Your Query has been sent");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };
  return (
    <div className="bg-white flex p-10 mx-10">
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

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-8 justify-center"
      >
        <h1 className="text-3xl font-bold text-center text-blue-600 mx-12">
          Get In Touch
        </h1>
        <div className="flex flex-col">
          <label classname="block text-me font-bold mb-2 text-gray-800">
            Your Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register("name", {
              required: true,
              minLength: 3,
              maxLength: 100,
            })}
            style={{
              width: "100%",
              fontSize: "1rem",
              border: "2px solid #ccc",
              borderRadius: "0.375rem",
            }}
            className="input-field rounded py-2 "
          />
          {errors.name?.type === "required" && (
            <span className="text-red-500 mt-1">Your name is required</span>
          )}
          {errors.name?.type === "minLength" && (
            <span className="text-red-500 mt-1">Your name min length is 3</span>
          )}
          {errors.name?.type === "maxLength" && (
            <span className="text-red-500 mt-1">
              Your name max length is 100
            </span>
          )}
        </div>
        <div className="flex flex-col">
          <label classname="block text-me font-bold mb-2 text-gray-800">
            Your Email <span className="text-red-500">*</span>
          </label>
          <input
            {...register("email", {
              required: true,
              minLength: 3,
              maxLength: 100,
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "invalid email address",
              },
            })}
            style={{
              width: "100%",
              fontSize: "1rem",
              border: "2px solid #ccc",
              borderRadius: "0.375rem",
            }}
            className="input-field rounded py-2"
          />
          {errors.email?.type === "pattern" && (
            <span className="text-red-500 mt-1">Your email is invalid</span>
          )}
          {errors.email?.type === "required" && (
            <span className="text-red-500 mt-1">Your email is required</span>
          )}
          {errors.email?.type === "minLength" && (
            <span className="text-red-500 mt-1">
              Your email min length is 3
            </span>
          )}
          {errors.email?.type === "maxLength" && (
            <span className="text-red-500 mt-1">
              Your email max length is 100
            </span>
          )}
        </div>

        <div className="flex flex-col">
          <label classname="block text-me font-bold mb-2 text-gray-800">
            Your Message <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register("message", {
              minLength: 3,
              maxLength: 500,
            })}
            cols="10"
            rows="5"
            style={{
              width: "100%",
              fontSize: "1rem",
              border: "2px solid #ccc",
              borderRadius: "0.375rem",
            }}
            className="input-field rounded py-2 resize-none border-2 border-gray-200 focus:border-gray-400 p-2"
          ></textarea>
          {errors.message?.type === "minLength" && (
            <span className="text-red-500 mt-1">
              Your message min length is 3
            </span>
          )}
          {errors.message?.type === "maxLength" && (
            <span className="text-red-500 mt-1">
              Your message max length is 500
            </span>
          )}
        </div>
        <button className="bg-blue-500 text-white  text-me rounded-full py-2 px-6 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue">
          Send
        </button>
      </form>
    </div>
  );
}

export default Contact;
