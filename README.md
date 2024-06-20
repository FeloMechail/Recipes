# Recipes
------------------
Recipe blog using Weaviate vector database and React. Utilizes the Weaviate, GraphQL API to search for recipes using hybrid search or Retrieval Augmented Generation (RAG) for recipe generation.

![[Pasted image 20240620164936.png]]

## Features
-------------
- Uses hybrid search to retrieve recipes based on ingredients, title or description
- Uses RAG to generate recipes based on user input
- Can toggle between Hybrid search and RAG
- Engage with AI on each recipe providing helpful response based on page's information 
- Weaviate's GraphQL API to search for recipes
- Front end was built using Vite + React
- TailwindCSS for styling
- Apollo Client to interact with API

`nomic-embed-text` was used to embed the recipe text in the Weaviate schema. `Mistral-7b` as the language model for RAG.

[Epicurious - Recipes with Rating and Nutrition (kaggle.com)](https://www.kaggle.com/datasets/hugodarwood/epirecipes/data) was used for recipe data

|                RAG response                 |                Hybrid search                |
| :-----------------------------------------: | :-----------------------------------------: |
| ![[images/Pasted image 20240620170423.png]] | ![[images/Pasted image 20240620170517.png]] |
|                  Food Page                  |         Recipe page AI interaction          |
| ![[images/Pasted image 20240620171239.png]] | ![[images/Pasted image 20240620171404.png]] |
|          Vector similarity search           |             Dynamic suggestions             |
| ![[images/Pasted image 20240620171433.png]] | ![[images/Pasted image 20240620171708.png]] |
|                  Filtering                  |                                             |
| ![[images/Pasted image 20240620171822.png]] |                                             |

## Setup
---------------
Everything is self hosted locally using `Docker Compose`

1. Clone repo
```
Repo url
```

2. Install docker (GPU setup is recommended)
3. Prepare for data ingestion

```
pip install -r requirements.txt
```

```
docker compose up -d
```

- download `full_format_recipes.json` from Kaggle
- run through `weaviate_pipline.ipynb`
	- You can change your database setup here

4.  Setup Front end
	- `npm install`
	- `npm run dev` or build using Vite



## Author
- [Felopater Mechail](mechailphilip@gmail.com)


