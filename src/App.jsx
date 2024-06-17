import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FoodPage from "./foodpage";
import Home from "./home";
import React, { useEffect, useState} from "react";
import { useQuery, gql } from "@apollo/client";


function App() {
  const weaviateReadyAPI = "http://host.docker.internal:8080/v1/schema/Recipes";
  const collectionReadyAPI = "http://localhost:8080/v1/schema/Recipes";
  const [error, setError] = useState(false);
  const [errorInfo, setErrorInfo] = useState(null);

  useEffect(() => {
    const fetchWeaviateReady = async () => {
      try {
        const response = await fetch(weaviateReadyAPI);

        if (!response.ok) {
          throw new Error("Weaviate not ready");
        }

        const collectionResponse = await fetch(collectionReadyAPI);

        if (!collectionResponse.ok) {
          throw new Error("Collection not found");
        }

      } catch (error) {
        setError(true);
        setErrorInfo(error);
      }
    }

    fetchWeaviateReady();

  }, []);

  // Error handling
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="font-bold">There was an error while trying to connect to Weaviate: {errorInfo.message}</p>
      </div>
    );
  }

  // Normal routing if there's no error
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:id" element={<FoodPage />} />
      </Routes>
    </Router>
  );
}

export default App;
