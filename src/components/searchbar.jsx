import React, { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import {useNavigate} from "react-router-dom";

// Define the GraphQL query outside of the component
const GET_SUGGESTIONS_QUERY = gql`
  query GetSuggestions($query: String!) {
    Get {
      Recipes (
        hybrid: {
          query: $query
        }
        limit: 5
      ) {
        title
        rating
        _additional { id }
      }
    }
  }
`;

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
 
    // Use the useQuery hook at the top level of your component
    const { data, loading, error, refetch } = useQuery(GET_SUGGESTIONS_QUERY, {
      variables: { query: searchTerm },
      skip: !searchTerm, // Skip the query if searchTerm is empty
    });
  
    useEffect(() => {
        if (searchTerm) {
          // Only refetch the query if searchTerm is not empty
          refetch({ query: searchTerm });
        }
    }, [searchTerm]);
   
    useEffect(() => {
      if (data) {
        // Update suggestions based on the query result
        setSuggestions(data.Get.Recipes.map((recipe) => [recipe.title, recipe.rating, recipe._additional.id]));
      }
    }, [data]);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

    const handleSearch = () => {
      // Implement your search logic here
      console.log("Searching for:", searchTerm);

    };

    const handleSuggestionClick = (suggestion) => {
      console.log("Clicked on suggestion:", suggestion);
      navigate(`/${suggestion[2]}`);
    }


  return (
    <form
      onSubmit={handleSearch}
      className="md:max-w-4xl lg:max-w-5xl mx-auto m-5 max-w-sm"
    >
      <label
        htmlFor="default-search"
        className="mb-2 text-sm font-medium text-primary sr-only"
      >
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-icon-primary"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          id="default-search"
          className="block w-full p-4 ps-10 text-sm rounded-lg bg-secondary border-solid border- focus:ring-primary focus:border-primary hover:shadow-md "
          placeholder="Search Mockups, Logos..."
          value={searchTerm}
          onChange={handleInputChange}
          required
        />
         {/* Suggestions dropdown */}
         {(suggestions.length > 0 && searchTerm.length != 0 ) && (
            <ul className="absolute z-10 w-full bg-white shadow-md max-h-60 overflow-auto rounded-lg">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <span className="font-semibold">{suggestion[0]}</span> - Rating: {suggestion[1]}
                </li>
              ))}
            </ul>
          )}
        <button
          type="submit"
          className="text-button-primary absolute end-2.5 bottom-2.5 bg-primary hover:bg-hover-primary focus:ring-4 focus:outline-none focus:ring-focus-primary font-medium rounded-lg text-sm px-4 py-2"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
