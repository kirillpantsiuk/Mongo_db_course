const { MongoClient } = require('mongodb');
const uri = 'mongodb://127.0.0.1:27017/?replicaSet=rs0';
const client = new MongoClient(uri);

async function test() {
  try {
    await client.connect();
    console.log('✅ Підключення успішне');
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

test();
