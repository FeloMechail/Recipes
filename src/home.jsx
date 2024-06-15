import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import SearchBar from './components/searchbar';
import FoodCards from './components/food-cards';
import Header from './components/header';

// Import your components for different routes
function Home() {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/');
    }


    return (
<div className="h-full w-full">
    <Header />
    
      <div className="md:text-9xl text-center text-4xl">Text</div>

      <SearchBar/>

      <div className="text-center font-semibold text-3xl pb-1"> ~Here are our top `n` dishes~ </div>

      <div className="flex justify-center my-2">
      <div className="grid grid-cols-5 gap-10">
        {Array.from({ length: 10 }).map((_, index) => (
          <FoodCards
            key={index}
            image={`https://picsum.photos/350?random=${index}`}
            title={`Food ${index + 1}`}
            rating={Math.floor(Math.random() * 5) + 1}
          />
        ))}
      </div>
        </div>
    </div>
    );
}

export default Home;