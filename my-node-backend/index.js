const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 3001; // Choose a port number that is not in use

const uri = 'mongodb://127.0.0.1:27017';
const dbName = 'UniName';
const collectionName = 'EdUni';

// Enable CORS
app.use(cors());

app.get('/api/names', async (req, res) => {
  try {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    const names = await extractNames(client);

    await client.close();

    res.json({ names });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

async function extractNames(client) {
  const db = client.db(dbName);
  const collection = db.collection(collectionName);
  const query = {};
  const projection = { _id: 0, name: 1 };
  const result = await collection.find(query, { projection }).toArray();
  return result.map((entry) => entry.name);
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
