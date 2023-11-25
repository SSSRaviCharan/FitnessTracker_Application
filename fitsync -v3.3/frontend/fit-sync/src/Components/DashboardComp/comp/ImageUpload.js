import React, { useEffect, useState } from "react";
import defaultUserProfilePhoto from "../img/pfp.jpg";
import { FaRegFolderOpen } from "react-icons/fa6";
import axios from "axios";
const ImageUpload= () => {
  const [profile,setProfile] = useState("");
  const [image,setImage] = useState();
  const [edit,setEdit] = useState(false);
  const userID = window.localStorage.getItem("userID");
  const handleUpload =(e)=>{
    e.preventDefault();
    const formData = new FormData();
    formData.append("profile",profile);
    formData.append("userID", userID);
    axios.post("http://localhost:4000/profilePic",formData)
    .then((res) => {
      console.log(res);
      window.location.reload();
    })
    .catch(error=>console.log(error))
  }

  useEffect(() => {
    axios.get(`http://localhost:4000/getPic`)
    .then((res) => {
      const userImage = res.data.find(item => item.user_id === userID);
      if (userImage) {
        setImage(userImage.image);
        console.log(userImage.image);
        setEdit(edit);
      }
    })
      .catch(error => console.log(error));
  }, [userID]);

  return (
    <div>
    <div>
      <div className="flex justify-end">
      <button onClick={() =>setEdit(!edit)} className="bg-gray-700 hover:bg-gray-900 active:bg-green-800 px-3 py-1 text-sm rounded-lg text-white">Update?</button>
      </div>
      <img
    src={image?image:defaultUserProfilePhoto}
    alt="User Profile"
    className="w-32 mx-auto my-auto h-auto mt-8 mb-4 rounded-lg"
  />
    </div>
    {!edit?"":<div className="flex items-center justify-center">
  <label className="hover:bg-gray-500 rounded-full bg-black inline-block px-[12px] py-[6px] cursor-pointer">
    <input type="file" accept="image/*" onChange={e => setProfile(e.target.files[0])} className="hidden" />
    <FaRegFolderOpen color="white"/>
  </label>
  <button onClick={handleUpload} className="inline-block text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-xl text-sm px-4 ml-2 py-2 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Upload Image</button>
</div>}
</div>
    
  );
};

export default ImageUpload;
