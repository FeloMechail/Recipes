import React, { useState, useEffect, useCallback } from "react";
import { useQuery, gql, useApolloClient } from "@apollo/client";
import {useNavigate, useParams} from "react-router-dom";
import { set, debounce } from "lodash";

// Define the GraphQL query outside of the component
const GET_SUGGESTIONS_QUERY = gql`
  query GetSuggestions($query: String!) {
    Get {
      Recipes (
        hybrid: {
          query: $query
        }
        limit: 10
      ) {
        title
        rating
        _additional { id }
      }
    }
  }
`;

//maybe it doesnt work beccause of second query
const generateTask = (text) => {
  return `
  {
  Get {
    Recipes (
      hybrid: {
        query: "${text}"
      }
      limit: 5
    ) {
      title
			rating
			ingredients
			calories
			protein
			fat
      _additional {
				id
        generate(
          groupedResult: {
            task: """
                          You are a professional cook assistant AI. You will assist with cooking-related inquiries by using the given list of information about recipes. Your responses should be clear, precise, and tailored to the specific prompt without repeating any information.
                          do not start with here's a summary, or according to the recipe, or any other generic phrase. just answer the prompt
						
						"prompt"

						${text}
            """
          }
        ) {
          groupedResult
          error
        }
      }
    }
  }
}
  `};

const SearchBar = ({searchResults}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [dataDict, setDataDict] = useState({});
  const [useAi, setUseAi] = useState(false);  // State to toggle AI
  const [stopSearch, setStopSearch] = useState(false);
  const [aiiloading, setLoading] = useState(false);
  const [isSuggestionVisible, setIsSuggestionVisible] = useState(false);
  const client = useApolloClient();

 
    // Use the useQuery hook at the top level of your component
    const { data, loading, error, refetch } = useQuery(GET_SUGGESTIONS_QUERY, {
      variables: { query: searchTerm },
      skip: !searchTerm, // Skip the query if searchTerm is empty
    });

    console.log('AI switch:', useAi);

    // Debounce the search input to avoid multiple renders
    const debouncedSearch = useCallback(
      debounce((query) => {
        console.log('Debouncing search with query:', query); // Add this line
        if (!stopSearch) {
          refetch({ query });
        }
      }, 500),
      [stopSearch, refetch]
    );

    useEffect(() => {
        if (searchTerm) {
          // Only refetch the query if searchTerm is not empty
          debouncedSearch(searchTerm);
        }
    }, [searchTerm]);
   
    useEffect(() => {
      if (data) {
        // Update suggestions based on the query result
        setDataDict(data.Get.Recipes);
        setSuggestions(data.Get.Recipes.map((recipe) => [recipe.title, recipe.rating, recipe._additional.id]));
      } 
    }, [data]);


  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = async (event) => {
    event.preventDefault(); // Prevent the form from submitting
    if (useAi) {
      setStopSearch(false);
      let query = generateTask(searchTerm);
      setLoading(true);
      
      const { data } = await client.query({
        query: gql`${query}`,
      });

      setLoading(false);

      if (data) {
        console.log('AI data:', data);
        searchResults({ searchTerm, dataDict: data.Get.Recipes, useAi });
      }

    } else {
      searchResults({ searchTerm, dataDict, useAi });
    }
  };

    const handleSuggestionClick = (suggestion) => {
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
      <div className="relative" tabIndex="0" onBlur={() => setIsSuggestionVisible(false)} onFocus={() => setIsSuggestionVisible(true)}>
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
         {(suggestions.length > 0 && searchTerm.length != 0 && isSuggestionVisible ) && (
            <ul className="absolute z-10 w-full bg-white shadow-md max-h-60 overflow-auto rounded-lg">
              {suggestions.slice(0, 5).map((suggestion, index) => (
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

        
        <div
          className="absolute end-14 bottom-2.5 px-5 pb-1.5">

            {aiiloading && 
            <button
          type="button"
          className="text-button-primary bg-primary hover:bg-hover-primary font-medium rounded-lg text-sm pr-2"
          onClick={() => setStopSearch(true)}
        >
          STOP
        </button>
            }

          <label className="inline-flex items-center cursor-pointer">
              <div className="font-extralight text-xs mx-1.5">Toggle ai</div>
  <input type="checkbox" value="" className="sr-only peer" checked={useAi} onChange={() => setUseAi(!useAi)} />
  <div className="relative w-9 h-5 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
</label>
        </div>

        <button
          type="submit"
          className="text-button-primary absolute end-2.5 bottom-2.5 bg-primary hover:bg-hover-primary font-medium rounded-lg text-sm px-4 py-2"
        >
          Search
        </button>
      </div>
    </form>


  );
};

export default SearchBar;
