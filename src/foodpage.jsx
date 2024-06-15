import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import SearchBar from './components/searchbar';
import Header from './components/header';
import RecipeDetails from './components/recipes';

const FoodPage = () => {
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState(null);

    useEffect(() => {
        // Asynchronously import the mockrecipe JSON data
        import('../mockrecipe.json')
            .then(data => {
                setRecipes(data.default); // Assuming the JSON data is the default export
            })
            .catch(error => console.error("Failed to load recipes:", error));
    }, []); // Empty dependency array ensures this effect runs once on mount

    const handleClick = () => {
        navigate('/');
    };

    return (
        <div>
            <Header />
            
            <div>
                <img src="https://picsum.photos/1920/1080" alt="Random Image" className="w-full h-80 object-cover" />
            </div>

            {recipes && <RecipeDetails recipe={recipes} />}
            <div style={{ position: 'fixed', bottom: 0, width: '100%', zIndex: 1000 }}>
                <SearchBar />
            </div>
        </div>
    );
};

export default FoodPage;