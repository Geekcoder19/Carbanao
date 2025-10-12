import React from "react";
import Button from "./ui/Button";
import Tablink from "./ui/Tablink";
import logo from "../assets/images/white_logo.png";
import { FaBars } from "react-icons/fa6";
import AnimButton from "./ui/AnimButton";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext"; // ✅ import context

export default function Header() {
  const navigate = useNavigate();
  const { user, logoutUser } = useUser(); // ✅ get user info + logout function

  const handleLogout = () => {
    logoutUser(); // clear global user
    navigate("/login");
  };

  return (
    <header className="relative z-50 flex flex-row items-center gap-x-3 justify-between w-full pr-10">
      {/* Logo Section */}
      <div className="pl-28 w-3/5">
        <img
          src={logo}
          alt="Company Logo"
          className="w-56 h-24 bg-black rounded-[56px] object-cover"
        />
      </div>

      {/* Navigation + Buttons */}
      <div className="flex flex-row gap-x-3 justify-end items-center w-4/5">
        {/* Navigation Tabs */}
        <nav>
          <div className="bg-black rounded-[56px] text-white px-4 py-2.5 gap-x-8 flex flex-row items-center">
            <Tablink text="Home" path="/home" />
            <Tablink text="About" path="/about" />
            <Tablink text="Models" path="/Explore" />
            <Tablink text="Cars" path="/cars" />
            <Tablink text="Contact" path="/contact" />
          </div>
        </nav>

        {/* Hamburger Menu */}
        <button
          onClick={() => console.log("Menu clicked")}
          className="text-3xl text-black block relative z-50 cursor-pointer duration-300 p-2 
            before:absolute before:-z-10 before:hidden hover:before:block
            before:h-full before:w-full before:rounded-full
            hover:before:transition-all hover:before:duration-300
            before:top-0 before:left-0 before:bg-white before:opacity-30"
        >
          <FaBars />
        </button>

        {/* 🔹 Conditional Rendering */}
        {user ? (
          <AnimButton
            text="Logout"
            properties="bg-red-600 hover:bg-red-700"
            onClick={handleLogout}
          />
        ) : (
          <AnimButton
            text="Login / Sign up"
            properties="bg-black"
            onClick={() => navigate("/login")}
          />
        )}
      </div>
    </header>
  );
}
