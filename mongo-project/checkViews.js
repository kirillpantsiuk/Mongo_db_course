const { MongoClient } = require('mongodb');

const uri = 'mongodb://127.0.0.1:27017/electronicsStore';
const client = new MongoClient(uri);

async function checkViews() {
    try {
        await client.connect();
        const db = client.db();

        // Перевірка orderDetails
        const orderDetails = await db.collection('orderDetails').find().toArray();
        console.log('--- orderDetails ---');
        console.log(orderDetails);

        // Перевірка productDetails
        const productDetails = await db.collection('productDetails').find().toArray();
        console.log('--- productDetails ---');
        console.log(productDetails);

        // Перевірка userActivity
        const userActivity = await db.collection('userActivity').find().toArray();
        console.log('--- userActivity ---');
        console.log(userActivity);

    } catch (error) {
        console.error('Помилка при перевірці view:', error);
    } finally {
        await client.close();
        console.log('З\'єднання з MongoDB закрите');
    }
}

// Виклик функції
checkViews();
