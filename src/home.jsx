import React, {useEffect, useState} from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import SearchBar from "./components/searchbar";
import FoodCards from "./components/food-cards";
import Header from "./components/header";
import { useQuery, gql } from "@apollo/client";


// Import your components for different routes
function Home() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  const GET_TOP_RECIPES = gql `
  {
  Get {
    Recipes(
      sort: {
        path: ["rating"]  # Path to the property to sort by
        order: desc        # Sort order, asc (default) or desc
      }
      limit: 10
    ) {
      title
      rating
			_additional {
				id
			}
    }
  }
}`

  const { loading, error, data } = useQuery(GET_TOP_RECIPES);
  if (error) return <pre>{error.message}</pre>

  return (
    <div className="h-full w-full">
      <Header />

      <div className="md:text-9xl text-center text-4xl">Text</div>

      <SearchBar />

      <div className="text-center font-semibold text-3xl pb-1">
        {" "}
        ~Here are our top `n` dishes~{" "}
      </div>

      {loading ? <p>Loading...</p> :
      <div className="flex justify-center my-2">
        <div className="grid grid-cols-5 gap-10">
          {data.Get.Recipes.map((recipe) => (
            <FoodCards
              key={recipe._additional.id}
              image={"https://picsum.photos/350"}
              title={recipe.title}
              rating={recipe.rating}
              id={recipe._additional.id}
            />
          ))}
        </div>
      </div>
      }
      
    </div>
  );
}

export default Home;
