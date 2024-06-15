import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import SearchBar from "./components/searchbar";
import Header from "./components/header";
import RecipeDetails from "./components/recipes";
import ChatBar from "./components/chatbar";
import FoodCards from "./components/food-cards";

const FoodPage = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState(null);

  useEffect(() => {
    // Asynchronously import the mockrecipe JSON data
    import("../mockrecipe.json")
      .then((data) => {
        setRecipes(data.default); // Assuming the JSON data is the default export
      })
      .catch((error) => console.error("Failed to load recipes:", error));
  }, []); // Empty dependency array ensures this effect runs once on mount

  const handleClick = () => {
    navigate("/");
  };

  return (
    <div className="pb-20">
      <Header />
      <SearchBar />

      <div>
        <img
          src="https://picsum.photos/1920/1080"
          alt="Random Image"
          className="w-full h-80 object-cover"
        />
      </div>

      {recipes && <RecipeDetails recipe={recipes} />}

      <div
        style={{ position: "fixed", bottom: 0, width: "100%", zIndex: 1000 }}
      >
        <ChatBar />
      </div>

    


    <div className="border scale bg-secondary-100 my-3">
    <div className="text-center font-bold text-3xl my-5">Similar items</div>
      <div className="flex justify-center py-2">
        <div className="grid grid-cols-6 gap-20">
          {Array.from({ length: 6 }).map((_, index) => (
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
    
    </div>
  );
};

export default FoodPage;
