import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaTasks, FaRegEdit, FaCheckCircle, FaClock } from "react-icons/fa";

const Header = () => {
  const { userdata } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <header className="bg-gradient-to-br from-white to-gray-50 py-12 px-4 sm:px-6 md:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

        {/* Left Section */}
        <div className="space-y-8 mt-14" data-aos="fade-right">
          
          {/* 👋 Greeting */}
          <div className="flex items-center gap-3 justify-center md:justify-start mt-10 md:mt-6 lg:mt-4">
            <img src={assets.hand_wave} alt="wave" className="h-8 w-8" />
            <h4 className="text-2xl sm:text-3xl font-semibold text-gray-800">
              Hi, {userdata ? userdata.name : "Developer!"}
            </h4>
          </div>

          {/* 🖼️ Image shown below greeting on mobile */}
        <div className="flex md:hidden mt-6 justify-center" data-aos="fade-up">

            <img
              src={assets.header_img}
              alt="Task Manager Illustration"
              className="w-full max-w-xs sm:max-w-sm rounded-xl shadow-xl"
            />
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight text-center md:text-left">
            Welcome to Your Personal Task Manager 🗂️
          </h1>

          {/* Subheading */}
          <p className="text-gray-600 text-lg sm:text-xl max-w-xl text-center md:text-left mx-auto md:mx-0">
            Simplify your day. Create, track, and manage your tasks efficiently — all in one beautiful place.
          </p>
          {userdata && (
  <div className="grid sm:grid-cols-2 gap-6 pt-2">
    {[
      {
        icon: <FaTasks className="text-blue-500 text-3xl mb-3" />,
        title: "Add Task Titles",
        desc: "Stay organized with meaningful task names.",
      },
      {
        icon: <FaRegEdit className="text-purple-500 text-3xl mb-3" />,
        title: "Add Descriptions",
        desc: "Include details and requirements for clarity.",
      },
      {
        icon: (
          <div className="flex gap-2 text-2xl mb-3">
            <FaClock className="text-yellow-500" title="Pending" />
            <FaRegEdit className="text-blue-500" title="In Progress" />
            <FaCheckCircle className="text-green-500" title="Completed" />
          </div>
        ),
        title: "Status Tracking",
        desc: "Easily monitor whether tasks are pending, in progress, or completed.",
      },
      {
        icon: <FaClock className="text-yellow-500 text-3xl mb-3" />,
        title: "Track Progress",
        desc: "Monitor deadlines and progress easily.",
      },
    ].map((item, i) => (
      <div
        key={i}
        className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm hover:shadow-lg transition duration-300 text-center"
        data-aos="zoom-in"
      >
        <div className="flex flex-col items-center">
          {item.icon}
          <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
        </div>
      </div>
    ))}
  </div>
)}


          {/* Call to Action */}
          <div className="pt-4 text-center md:text-left">
            <button
              onClick={() => navigate(userdata ? "/home" : "/signup")}
              className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow-md hover:bg-blue-700 hover:scale-105 transition duration-300"
            >
              {userdata ? "Get Started" : "Sign Up"}
            </button>
          </div>
        </div>

        {/* 🖼️ Image for tablet/laptop view */}
        <div className="hidden md:flex justify-center md:justify-end" data-aos="fade-left">
          <img
            src={assets.header_img}
            alt="Task Manager Illustration"
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg rounded-xl shadow-xl"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
