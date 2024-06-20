import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SearchBar from "./components/searchbar";
import FoodCards from "./components/food-cards";
import Header from "./components/header";
import { useQuery, gql } from "@apollo/client";

//home page
function Home() {
  const [searchResults, setSearchResults] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [useAi, setUseAi] = useState(false);  // State to toggle AI
  const location = useLocation();

  // Handle search results from search bar component
  useEffect(() => {
    if (location.state && location.state.e != null) {
      handleSearchResults(location.state.e);
    } else if (location.state && location.state.e == null) {
      //reset search results
      setSearchResults({});
      setSearchTerm('');
    }
  }
  , [location]);

  // Handle search results and check if AI is enabled
  const handleSearchResults = (results) => {
    setSearchResults(results);
    setSearchTerm(results.searchTerm);
    setUseAi(results.useAi);
  };

  const GET_TOP_RECIPES = gql`
  {
    Get {
      Recipes(
        sort: {
          path: ["rating"]
          order: desc
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
  }`;

  const { loading, error, data } = useQuery(GET_TOP_RECIPES);

  if (error) return <pre>{error.message}</pre>;
  console.log("data: ", data);

  // Determine whether to display search results or top recipes
  const displayData = searchTerm ? searchResults.dataDict || [] : data?.Get?.Recipes || [];

  return (
    <div className="h-full w-full">
      <Header />
      <div className="md:text-8xl text-center text-4xl">Explore Recipes or Ask for recommendations</div>
      <SearchBar searchResults={handleSearchResults} />
      <div className="text-center font-semibold text-3xl pb-1">
        {/* Display search term if present */}
        {searchTerm && `Results for "${searchTerm}"`}
        { searchTerm && useAi &&
      <div className="flex flex-col items-center gap-2">
        <div className="p-6 rounded-md shadow bg-white">
          <div className="w-auto max-w-4xl flex flex-col items-start text-black">
            <span className="text-lg font-bold">AI response</span>
            <p className="mt-4 text-base text-left">
              {searchResults.dataDict ? searchResults.dataDict[0]._additional.generate.groupedResult : "No data found"}
            </p>
          </div>
        </div>
      </div>
      }

      </div>

      {loading ? <p className="flex justify-center items-center h-full">Loading...</p> :
      <div className="flex justify-center m-2">
        <div className="grid grid-cols-5 gap-10">
          {displayData.map((recipe) => (
            <FoodCards
              key={recipe._additional.id}
              title={recipe.title}
              rating={recipe.rating}
              id={recipe._additional.id}
            />
          ))}
        </div>
      </div>
      }


      <div className="m-3 text-right text-gray-500 text-sm">Made by: Felopater Mechail @ mechailphilip@gmail.com</div>
    </div>
  );
}

export default Home;