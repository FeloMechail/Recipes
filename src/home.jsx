import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SearchBar from "./components/searchbar";
import FoodCards from "./components/food-cards";
import Header from "./components/header";
import { useQuery, gql } from "@apollo/client";
import { set } from "lodash";

function Home() {
  const [searchResults, setSearchResults] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [useAi, setUseAi] = useState(false);  // State to toggle AI
  const location = useLocation();

  useEffect(() => {
    if (location.state.e != null) {
      console.log("location.state: ", location.state.e);
      handleSearchResults(location.state.e);
    } else if (location.state.e == null) {
      //reset search results
      setSearchResults({});
      setSearchTerm('');
    }
  }
  , [location]);

  const handleSearchResults = (results) => {
    console.log("results: ", results);
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
  const displayData = searchTerm ? searchResults.dataDict : data?.Get?.Recipes || [];

  return (
    <div className="h-full w-full">
      <Header />
      <div className="md:text-9xl text-center text-4xl">Text</div>
      <SearchBar searchResults={handleSearchResults} />
      <div className="text-center font-semibold text-3xl pb-1">
        {/* Display search term if present */}
        {searchTerm && `Results for "${searchTerm}"`}
        {searchTerm && useAi && <div className="bg-secondary-200 border text-xs p-2">{displayData[0]._additional.generate.groupedResult} </div>}
      </div>
      {loading ? <p>Loading...</p> :
      <div className="flex justify-center m-2">
        <div className="grid grid-cols-5 gap-10">
          {displayData.map((recipe) => (
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