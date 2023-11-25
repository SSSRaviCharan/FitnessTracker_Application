const getUserID = () => {
  // // Check if the user is authenticated (you can use your own logic)
  // const isLoggedIn = window.localStorage.getItem("isLoggedIn");

  // if (isLoggedIn === "true") {
  //   // If the user is authenticated, retrieve their user ID
  //   // alert("FOUND ID");
  //   const userID = window.localStorage.getItem("userID");
  //   // alert("Found");
  //   return userID;
  // } else {
  //   alert("ID not found");
  //   // Handle the case when the user is not authenticated
  //   // You can return a default value or handle it as needed
  //   return null;
  // }
  const userID = window.localStorage.getItem("userID");
  return userID;
};

const authUtils = {
  getUserID,
};

export default authUtils;
