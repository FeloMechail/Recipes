import {React, useState} from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import FoodPage from "../foodpage";


const FoodCards = ({ title, rating, id }) => {
  const navigate = useNavigate();

  const handleClick = () => {``
    navigate(`/${id}`);
  };

  // Function to render stars on the card
  const renderStars = (rating) => {
    let stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg
          key={i}
          className="w-4 h-4 text-yellow-300"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill={i < Math.floor(rating) ? "currentColor" : "text-gray-200"}
          viewBox="0 0 22 20"
        >
          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
        </svg>
      );
    }
    return stars;
  };

  return (
    <a onClick={handleClick} className="cursor-pointer">
      <div className="w-full max-w-xs bg-background-100 rounded-2xl shadow-md">
        <img
          className="rounded-t-2xl hover:opacity-75 w-full object-cover"  
          src={"https://images.unsplash.com/photo-1624811533744-f85d5325d49c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
          alt="Photo by Towfiqu barbhuiya on Unsplash"
        />
        <div className="p-2 font-semibold">
          <div className="text-lg">
            {title}
          </div>
          <div className="flex items-center mt-2">
            <div className="flex items-center space-x-1 rtl:space-x-reverse">
              {renderStars(rating)}
            </div>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ms-3">
              {rating}
            </span>
          </div>
        </div>
      </div>
    </a>
  );
};

export default FoodCards;
