import React, { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useParams,
} from "react-router-dom";
import SearchBar from "./components/searchbar";
import Header from "./components/header";
import RecipeDetails from "./components/recipes";
import ChatBar from "./components/chatbar";
import FoodCards from "./components/food-cards";
import TestQuery from "./testquery";

const GET_RECIPE = gql`
query GetRecipe($id: TextStringGetObjectsRecipes!)
{
  Get {
    Recipes(
      where: {
        path: ["id"],
        operator: Equal,
        valueString: $id
      }
    ) {
      directions
      fat
      categories
      desc
      protein
      rating
      title
      ingredients
      sodium
      _additional {
        id
      }
    }
  }
}
`;

const GET_SIMILIAR_RECIPES = gql`
query GetRecipe($id: String! $ids: TextStringGetObjectsRecipes!)
{
  Get{
    Recipes(
      nearObject: {
        id: $id
        distance: 0.6  # prior to v1.14, use certainty: 0.7
      }  where: {
        path: ["id"],
        operator: NotEqual,
        valueString: $ids
      }
			limit: 6
    ) {
      title
      rating
      _additional {
        id
      }
    }
  }
}
`;

const FoodPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');


  const { loading, error, data } = useQuery(GET_RECIPE, {
    variables: { id },
  });

  const { loading: similarLoading, error: similarError, data: similarData } = useQuery(GET_SIMILIAR_RECIPES, {
    variables: { id: id, ids: id },
  });


  const handleSearch = (e) => {
    navigate('/', { state: { e } });
    console.log("Search term:", e);
  }

  useEffect(() => {
    if (error) {
      console.error("Failed to load recipe:", error);

    }
    if (data) {
      setRecipes(data.Get.Recipes[0]);
    }
  }, [data, error, id]);


  useEffect(() => {
    if (similarError) {
      console.error("Failed to load similar recipes:", similarError);
    }
    if (similarData) {
      console.log("Similar recipes:", similarData.Get.Recipes);
    }
  }
  , [similarData, similarError, id]);


  const handleClick = () => {
    navigate("/");
  };

  return (
    <div className="pb-20">
      <Header />
      <SearchBar searchResults={handleSearch} />

      <div>
        <img
          src="https://images.unsplash.com/photo-1624811533744-f85d5325d49c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Photo by Towfiqu barbhuiya on Unsplash"
          className="w-full h-80 object-cover"
        />
      </div>

      {recipes ? (
        <div>
        <RecipeDetails recipe={recipes} />

        <div
        style={{ position: "fixed", bottom: 0, width: "100%", zIndex: 1000 }}
      >
        <ChatBar />
      </div>

        </div>
      ) : (
        <p> Recipe not found</p>
      )}  


    <div className="border scale bg-secondary-100 my-3">
    <div className="text-center font-bold text-3xl my-5">Similar items</div>
      <div className="flex justify-center py-2">
        <div className="grid grid-cols-6 gap-20">
          {similarData && similarData.Get.Recipes.map((recipe) => (
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
    </div>
    
    </div>
  );
};

export default FoodPage;
