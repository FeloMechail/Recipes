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

const generatedHybridFilterTask = (Ai, query, proteinMin, proteinMax, caloriesMin, caloriesMax, fatMin, fatMax, sodiumMin, sodiumMax, ratingMin, ratingMax) => {
  let requireAi = Ai;
  return `
  {
  Get {
    Recipes (
        where: {
          operator: And,
          operands: [
          ` + (proteinMin ? `
            {
              path: ["protein"],
              operator: GreaterThanEqual,
              valueNumber: ${proteinMin}
            },` : ``) + `` + (proteinMax ? `
            {
              path: ["protein"],
              operator: LessThanEqual,
              valueNumber: ${proteinMax}
            }, ` : ``) + `` + (caloriesMin ? `
            {
              path: ["calories"],
              operator: GreaterThanEqual,
              valueNumber: ${caloriesMin}
            }, ` : ``) + `` + (caloriesMax ? `
            {
              path: ["calories"],
              operator: LessThanEqual,
              valueNumber: ${caloriesMax}
            }, ` : ``) + `` + (fatMin ? `
            {
              path: ["fat"],
              operator: GreaterThanEqual,
              valueNumber: ${fatMin}
            }, ` : ``) + `` + (fatMax ? `
            {
              path: ["fat"],
              operator: LessThanEqual,
              valueNumber: ${fatMax}
            }, ` : ``) + `` + (sodiumMin ? `
            {
              path: ["sodium"],
              operator: GreaterThanEqual,
              valueNumber: ${sodiumMin}
            }, ` : ``) + `` + (sodiumMax ? `
            {
              path: ["sodium"],
              operator: LessThanEqual,
              valueNumber: ${sodiumMax}
            }, ` : ``) + ` ` + (ratingMin ? ` 
            {
              path: ["rating"],
              operator: GreaterThanEqual,
              valueNumber: ${ratingMin}
            }, ` : ``) + `` + (ratingMax ? `
            {
              path: ["rating"],
              operator: LessThanEqual,
              valueNumber: ${ratingMax}
            } ` : ``) + ` 
          ]
        }
      hybrid: {
        query: "${query}"
      }
      limit: ` + (requireAi ? `5` : `10`) + ` 
    ) {
      title
      rating
      _additional {
        id
        ` + (requireAi ? `generate(
          groupedResult: {
            task: """
                          You are a professional cook assistant AI. You will assist with cooking-related inquiries by using the given list of information about recipes. Your responses should be clear, precise, and tailored to the specific prompt without repeating any information.
                          do not start with here's a summary, or according to the recipe, or any other generic phrase. answer only from the given information about recipes. if there is not information to answer the prompt, respond with "I don't have that information." give 2-3 sentences.

                          "prompt"

                          ${query}
            """
          }
        ) {
          groupedResult
          error
        }` : ``) + `
      }
    }
  }
}
  `};

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
                          do not start with here's a summary, or according to the recipe, or any other generic phrase. answer only from the given information about recipes. if there is not information to answer the prompt, respond with "I don't have that information." give 2-3 sentences.
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
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState({});

  const client = useApolloClient();
 
    // Use the useQuery hook at the top level of your component
    const { data, loading, error, refetch } = useQuery(GET_SUGGESTIONS_QUERY, {
      variables: { query: searchTerm },
      skip: !searchTerm, // Skip the query if searchTerm is empty
    });

    console.log('AI switch:', useAi);
    console.log("filter", showFilter) 
    console.log("filter", typeof filter)
    console.log("filter length", Object.keys(filter).length)

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
      if(!showFilter){
        setFilter({});
      }

        if (searchTerm) {
          setIsSuggestionVisible(true);
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
    let filteredQuery = null;

    if (Object.keys(filter).length > 0) {
      console.log('Filter:', filter);
      let { proteinMin, proteinMax, caloriesMin, caloriesMax, fatMin, fatMax, sodiumMin, sodiumMax, ratingMin, ratingMax } = filter;

      filteredQuery = generatedHybridFilterTask(useAi, searchTerm, proteinMin || null, proteinMax || null, caloriesMin || null, caloriesMax || null, fatMin || null, fatMax || null, sodiumMin || null, sodiumMax || null, ratingMin || null, ratingMax || null);
      console.log('Generated query:', filteredQuery);
    }

    if (useAi) {
      setStopSearch(false);
      const query = filteredQuery || generateTask(searchTerm);
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

      if(Object.keys(filter).length > 0){

        const { data } = await client.query({
          query: gql`${filteredQuery}`,
        });

        if (data) {
          console.log('Filtered data:', data);
          searchResults({ searchTerm, dataDict: data.Get.Recipes, useAi });
        }
        
      } else {
        console.log("here")
        searchResults({ searchTerm, dataDict, useAi });

    }
  };
}

    const handleSuggestionClick = (suggestion) => {
      navigate(`/${suggestion[2]}`);
    }

    const handleFilterChange = (filter, value) => {
      console.log('Filter:', filter, 'Value:', value);
      setFilter((prevFilter) => ({ ...prevFilter, [filter]: value }));
    }

  return (
    <form
      onSubmit={handleSearch}
      className="md:max-w-4xl lg:max-w-5xl mx-auto m-5 max-w-sm"
      onBlur={() => {
        setTimeout(() => {setIsSuggestionVisible(false)}, 100);
      }}    
    >
      {showFilter && (
        <div className="shadow-sm rounded-lg p-4 w-auto max-w-96 my-2">
          <div className="text-lg font-semibold">Filter</div>
          <div className="grid grid-cols-2 gap-2 w-auto">
            <div>
              <label htmlFor="protein-min" className="mb-2 text-sm font-medium text-primary">
                Protein (min)
              </label>
              <input
                id="protein-min"
                type="number"
                className="block w-full p-2 text-sm rounded-lg bg-secondary border-solid border- focus:ring-primary focus:border-primary hover:shadow-md"
                placeholder="Min Protein"
                onChange={(e) => handleFilterChange("proteinMin", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="protein-max" className="mb-2 text-sm font-medium text-primary">
                Protein (max)
              </label>
              <input
                id="protein-max"
                type="number"
                className="block w-full p-2 text-sm rounded-lg bg-secondary border-solid border- focus:ring-primary focus:border-primary hover:shadow-md"
                placeholder="Max Protein"
                onChange={(e) => handleFilterChange("proteinMax", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="calories-min" className="mb-2 text-sm font-medium text-primary">
                Calories (min)
              </label>
              <input
                id="calories-min"
                type="number"
                className="block w-full p-2 text-sm rounded-lg bg-secondary border-solid border- focus:ring-primary focus:border-primary hover:shadow-md"
                placeholder="Min Calories"
                onChange={(e) => handleFilterChange("caloriesMin", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="calories-max" className="mb-2 text-sm font-medium text-primary">
                Calories (max)
              </label>
              <input
                id="calories-max"
                type="number"
                className="block w-full p-2 text-sm rounded-lg bg-secondary border-solid border- focus:ring-primary focus:border-primary hover:shadow-md"
                placeholder="Max Calories"
                onChange={(e) => handleFilterChange("caloriesMax", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="fat-min" className="mb-2 text-sm font-medium text-primary">
                Fat (min)
              </label>
              <input
                id="fat-min"
                type="number"
                className="block w-full p-2 text-sm rounded-lg bg-secondary border-solid border- focus:ring-primary focus:border-primary hover:shadow-md"
                placeholder="Min Fat"
                onChange={(e) => handleFilterChange("fatMin", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="fat-max" className="mb-2 text-sm font-medium text-primary">
                Fat (max)
              </label>
              <input
                id="fat-max"
                type="number"
                className="block w-full p-2 text-sm rounded-lg bg-secondary border-solid border- focus:ring-primary focus:border-primary hover:shadow-md"
                placeholder="Max Fat"
                onChange={(e) => handleFilterChange("fatMax", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="sodium-min" className="mb-2 text-sm font-medium text-primary">
                Sodium (min)
              </label>
              <input
                id="sodium-min"
                type="number"
                className="block w-full p-2 text-sm rounded-lg bg-secondary border-solid border- focus:ring-primary focus:border-primary hover:shadow-md"
                placeholder="Min Sodium"
                onChange={(e) => handleFilterChange("sodiumMin", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="sodium-max" className="mb-2 text-sm font-medium text-primary">
                Sodium (max)
              </label>
              <input
                id="sodium-max"
                type="number"
                className="block w-full p-2 text-sm rounded-lg bg-secondary border-solid border- focus:ring-primary focus:border-primary hover:shadow-md"
                placeholder="Max Sodium"
                onChange={(e) => handleFilterChange("sodiumMax", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="rating-min" className="mb-2 text-sm font-medium text-primary">
                Rating (min)
              </label>
              <input
                id="rating-min"
                type="number"
                min="0"
                max="5"
                step="0.1"
                className="block w-full p-2 text-sm rounded-lg bg-secondary border-solid border- focus:ring-primary focus:border-primary hover:shadow-md"
                placeholder="Min Rating"
                onChange={(e) => handleFilterChange("ratingMin", e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="rating-max" className="mb-2 text-sm font-medium text-primary">
                Rating (max)
              </label>
              <input
                id="rating-max"
                type="number"
                min="0"
                max="5"
                step="0.1"
                className="block w-full p-2 text-sm rounded-lg bg-secondary border-solid border- focus:ring-primary focus:border-primary hover:shadow-md"
                placeholder="Max Rating"
                onChange={(e) => handleFilterChange("ratingMax", e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex">
      <div className="flex-grow mx-2">
      <label
        htmlFor="default-search"
        className="mb-2 text-sm font-medium text-primary sr-only"
      >
        Search
      </label>
      <div className="relative" tabIndex="0" >
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
          onFocus={() => setIsSuggestionVisible(true)}
          required
        />
         {/* Suggestions dropdown */}
         {(suggestions.length > 0 && searchTerm.length != 0 ) && (
            <ul className= {`absolute z-10 w-full bg-white shadow-md max-h-60 overflow-auto rounded-lg ${isSuggestionVisible ? 'block' : 'hidden'}`}>
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
      </div>
      <button type="button" onClick={()=>setShowFilter(!showFilter)} className="">
    <svg height="20" viewBox="0 0 1792 1792" width="20" xmlns="http://www.w3.org/2000/svg"><path d="M1595 295q17 41-14 70l-493 493v742q0 42-39 59-13 5-25 5-27 0-45-19l-256-256q-19-19-19-45v-486l-493-493q-31-29-14-70 17-39 59-39h1280q42 0 59 39z"/></svg>
      </button>
      </div>
    </form>


  );
};

export default SearchBar;
