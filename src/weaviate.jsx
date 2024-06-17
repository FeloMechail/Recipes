import weaviate from 'weaviate-client';


const Client = async () => {
    try{
        const client = await weaviate.connectToLocal();
        const collection = client.collections.get("Recipes")
        return collection 
    } catch (error) {
        console.error(error)
        throw error
    }

}

export default Client;