# Recipes
------------------
Recipe blog using Weaviate vector database and React. Utilizes the Weaviate, GraphQL API to search for recipes using hybrid search or Retrieval Augmented Generation (RAG) for recipe generation.

![20240620190920](https://github.com/FeloMechail/Recipes/assets/23366181/9153a4d9-722c-4320-832e-27bcbcee592a)

## Features
-------------
- Hybrid Search: Retrieve recipes based on ingredients, title, or description.
- Recipe Generation: Use RAG to generate recipes based on user input.
- AI Interaction: Engage with AI on each recipe page for helpful responses based on the page's information.
- GraphQL API: Utilize Weaviate's GraphQL API to search for recipes. 
- Frontend: Built using Vite + React
- Styling: Styled with TailwindCSS.
- API Interaction: Use Apollo Client to interact with the API.

`nomic-embed-text` was used to embed the recipe text in the Weaviate schema. `Mistral-7b` serves as the language model for RAG.

[Epicurious - Recipes with Rating and Nutrition (kaggle.com)](https://www.kaggle.com/datasets/hugodarwood/epirecipes/data) was used for recipe data

|                RAG response                 |                Hybrid search                |
| :-----------------------------------------: | :-----------------------------------------: |
| ![alt](images/Pasted%20image%2020240620170423.png) | ![alt](images/Pasted%20image%2020240620170517.png) |
|                  Food Page                  |         Recipe page AI interaction          |
| ![](images/Pasted%20image%2020240620171239.png) | ![](images/Pasted%20image%2020240620171404.png) |
|          Vector similarity search           |             Dynamic suggestions             |
| ![](images/Pasted%20image%2020240620171433.png) | ![](images/Pasted%20image%2020240620171708.png) |
|                  Filtering                  |                                             |
| ![](images/Pasted%20image%2020240620171822.png) |                                             |

## Setup
---------------
Everything is self hosted locally using `Docker Compose`

1. Clone repo
```
git clone https://github.com/FeloMechail/Recipes.git
cd Recipes
```

2. Install docker:  
GPU setup is recommended for optimal performance

4. Prepare for data ingestion  
Install the required Python packages:
```
pip install -r requirements.txt
```
Start Docker containers:
```
docker compose up -d
```

- Download `full_format_recipes.json` from Kaggle
- Run through `weaviate_pipline.ipynb` to setup database and ingest data

4. Setup Frontend  
`npm install`

	Start Development server or build with vite:    
	`npm run dev`



## Author
- [Felopater Mechail](mechailphilip@gmail.com)


