import { MongoClient } from 'mongodb';

const mongoClient = new MongoClient(process.env.MONGODB_URI);

const clientPromise = mongoClient.connect();

export const handler = async (event) => {
  try {
    const database = (await clientPromise).db(process.env.MONGODB_DATABASE);
    const collectionName = event.queryStringParameters.collection || 'products';
    const collection = database.collection(collectionName);
    
    const data = await collection.find({}).toArray();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Database Error:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.toString() }) };
  }
};

