import React from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

const TestQuery = () => {
    const testId = "000d6862-099a-4fd7-bfc1-975df3758694"; // Replace with your desired test ID

    const GET_RECIPE = gql`
        query GetRecipe($id: TextStringGetObjectsRecipes!) {
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

    const { loading, error, data } = useQuery(GET_RECIPE, {
        variables: { id: testId },
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    // Render your desired UI using the data returned from the query
    return (
        <div>
            {console.log("Data:", data)}
        </div>
    );
};

export default TestQuery;