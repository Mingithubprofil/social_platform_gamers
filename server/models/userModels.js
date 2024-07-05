

/*
// models/User.js
const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://simonkjeldsen77:hM1RXte4YoRYborS@socialgamingplatform.dgsny73.mongodb.net/?retryWrites=true&w=majority&appName=socialgamingplatform";

// Assuming you have a function to get a MongoDB client connection
// You can abstract away the database connection logic as needed
const client = new MongoClient(uri);
const dbName = 'socialgamingplatform'; // Replace with your database name
const db = client.db(dbName);
const users = db.collection('users');


module.exports = users;
*/

// Require the central connection function from mongodb.js
const connectDB = require('../database/mongodb.js'); // Adjust the path as needed

// Function to retrieve the users collection
async function getUsersCollection() {
    const client = await connectDB();
    const dbName = 'socialgamingplatform'; // Replace with your actual database name
    return client.db(dbName).collection('users');
}

module.exports = {getUsersCollection};


