const { MongoClient } = require('mongodb');
const uri = 'mongodb://127.0.0.1:27017/electronicsStore';
const client = new MongoClient(uri);

async function demonstrateViews() {
    try {
        await client.connect();
        const db = client.db();
        
        console.log('=== ДЕМОНСТРАЦІЯ РОБОТИ ПРЕДСТАВЛЕНЬ ===\n');
        
        // Демонстрація представлення orderDetails
        console.log('1. Представлення "orderDetails":');
        const orderDetails = await db.collection('orderDetails').find({}).limit(3).toArray();
        console.log('Перші 3 документи:');
        console.log(JSON.stringify(orderDetails, null, 2));
        console.log('\n');
        
        // Демонстрація представлення productDetails
        console.log('2. Представлення "productDetails":');
        const productDetails = await db.collection('productDetails').find({}).limit(3).toArray();
        console.log('Перші 3 документи:');
        console.log(JSON.stringify(productDetails, null, 2));
        console.log('\n');
        
        // Демонстрація представлення userActivity
        console.log('3. Представлення "userActivity":');
        const userActivity = await db.collection('userActivity').find({}).limit(3).toArray();
        console.log('Перші 3 документи:');
        console.log(JSON.stringify(userActivity, null, 2));
        console.log('\n');
        
        // Демонстрація агрегації, яка використана у представленнях
        console.log('4. Агрегаційний запит, аналогічний до productDetails:');
        const aggregationResult = await db.collection('products').aggregate([
            { $lookup: { from: "categories", localField: "categoryId", foreignField: "_id", as: "category" } },
            { $unwind: "$category" },
            { $lookup: { from: "reviews", localField: "_id", foreignField: "productId", as: "reviews" } },
            { $project: { name: 1, sku: 1, brand: 1, price: 1, stock: 1, "category.name": 1, reviewsCount: { $size: "$reviews" }, avgRating: { $avg: "$reviews.rating" } } },
            { $limit: 3 }
        ]).toArray();
        
        console.log('Результат агрегації:');
        console.log(JSON.stringify(aggregationResult, null, 2));
        
    } catch (error) {
        console.error('Помилка демонстрації:', error);
    } finally {
        await client.close();
    }
}

// Виклик функції демонстрації
demonstrateViews().catch(console.error);