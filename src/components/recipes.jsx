import React from "react";

// RecipeDetails component
const RecipeDetails = ({ recipe }) => {
  console.log(recipe);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800">{recipe.title}</h1>
      <p className="text-md text-gray-600 mt-2">
        Published on: {recipe.date ? recipe.date : "Unknown"}
      </p>
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Description</h2>
        {recipe.desc ? (
          <p className="text-gray-700">{recipe.desc}</p>
        ) : (
          <p className="italic text-gray-700">No description provided.</p>
        )}
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Nutritional Facts</h2>
        <ul className="list-disc pl-5">
          <li>Calories: {recipe.calories}</li>
          <li>Fat: {recipe.fat}g</li>
          <li>Protein: {recipe.protein}g</li>
          <li>Sodium: {recipe.sodium}mg</li>
          <li>Rating: {recipe.rating} / 5</li>
        </ul>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Ingredients</h2>
        <ul className="list-disc pl-5">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Directions</h2>
        <ol className="list-decimal pl-5">
          {recipe.directions.map((direction, index) => (
            <li key={index}>{direction}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default RecipeDetails;
