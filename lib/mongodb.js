import { MongoClient } from 'mongodb';

let uri = process.env.MONGODB_URI;
let options = {};

let client;
let clientPromise;

if (!uri) {
    throw new Error('Please add your Mongo URI to .env.local');
}

if (true) {
    // In development mode, use a global variable so the MongoClient instance
    // is not constantly re-created.
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise.
export default clientPromise;