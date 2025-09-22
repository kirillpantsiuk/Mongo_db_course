const { MongoClient } = require('mongodb');
const uri = 'mongodb://127.0.0.1:27017/electronicsStore';
const client = new MongoClient(uri);

async function performanceComparison() {
    try {
        await client.connect();
        const db = client.db();
        
        console.log('=== ПОРІВНЯННЯ ПРОДУКТИВНОСТІ ===\n');
        
        // Тестування швидкості запиту через представлення
        console.time('Через представлення');
        const viaView = await db.collection('productDetails').find({}).toArray();
        console.timeEnd('Через представлення');
        
        // Тестування швидкості агрегаційного запиту
        console.time('Агрегаційний запит');
        const viaAggregation = await db.collection('products').aggregate([
            { $lookup: { from: "categories", localField: "categoryId", foreignField: "_id", as: "category" } },
            { $unwind: "$category" },
            { $lookup: { from: "reviews", localField: "_id", foreignField: "productId", as: "reviews" } },
            { $project: { name: 1, sku: 1, brand: 1, price: 1, stock: 1, "category.name": 1, reviewsCount: { $size: "$reviews" }, avgRating: { $avg: "$reviews.rating" } } }
        ]).toArray();
        console.timeEnd('Агрегаційний запит');
        
        console.log('\nРезультати однакові:', JSON.stringify(viaView) === JSON.stringify(viaAggregation));
        
    } catch (error) {
        console.error('Помилка порівняння:', error);
    } finally {
        await client.close();
    }
}

// Виклик функції порівняння
performanceComparison().catch(console.error);