
// connection string: 

//mongodb+srv://simonkjeldsen77:hM1RXte4YoRYborS@socialgamingplatform.dgsny73.mongodb.net/?retryWrites=true&w=majority&appName=socialgamingplatform

// mongodb+srv://simonkjeldsen77:hM1RXte4YoRYborS@socialgamingplatform.dgsny73.mongodb.net/


const { MongoClient, ServerApiVersion } = require('mongodb');

// Directly using the URI for simplicity as per your request
const uri = "mongodb+srv://simonkjeldsen77:hM1RXte4YoRYborS@socialgamingplatform.dgsny73.mongodb.net/?retryWrites=true&w=majority&appName=socialgamingplatform";

const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1,
});

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB!");
    // Export or use the client as needed
    return client;
  } catch (e) {
    console.error("Could not connect to MongoDB:", e);
    process.exit(1);
  }
}

module.exports = connectDB;


