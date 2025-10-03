// AggregationOperations.js
const { MongoClient } = require('mongodb');
const uri = 'mongodb://127.0.0.1:27017/electronicsStore';
const client = new MongoClient(uri);

async function runAggregations() {
    try {
        await client.connect();
        const db = client.db();

        // 1. $match: Знайти всі замовлення з промокодом
        const matchPipeline = [
            { $match: { promoCode: { $exists: true, $ne: null } } }
        ];
        console.log("1. Замовлення з промокодами:");
        const matchResult = await db.collection('orders').aggregate(matchPipeline).toArray();
        console.log(matchResult);

        // 2. $group: Підрахувати загальну суму замовлень по статусах
        const groupPipeline = [
            { $group: {
                _id: "$status",
                count: { $sum: 1 },
                totalAmount: { $sum: "$totalAmount" }
            }}
        ];
        console.log("\n2. Сума замовлень по статусах:");
        const groupResult = await db.collection('orders').aggregate(groupPipeline).toArray();
        console.log(groupResult);

        // 3. $project: Вибрати тільки потрібні поля продуктів
        const projectPipeline = [
            { $project: {
                name: 1,
                price: 1,
                category: "$categoryId",
                brand: 1,
                isAvailable: { $gt: ["$stock", 0] }
            }}
        ];
        console.log("\n3. Спрощена інформація про продукти:");
        const projectResult = await db.collection('products').aggregate(projectPipeline).limit(5).toArray();
        console.log(projectResult);

        // 4. $sort: Сортувати продукти за ціною (спадінням)
        const sortPipeline = [
            { $sort: { price: -1 } },
            { $limit: 5 }
        ];
        console.log("\n4. Найдорожчі продукти:");
        const sortResult = await db.collection('products').aggregate(sortPipeline).toArray();
        console.log(sortResult);

        // 5. $lookup: Об'єднати замовлення з інформацією про користувачів
        const lookupPipeline = [
            { $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user"
            }},
            { $unwind: "$user" },
            { $project: {
                orderNumber: 1,
                totalAmount: 1,
                userEmail: "$user.email",
                userName: { $concat: ["$user.firstName", " ", "$user.lastName"] }
            }}
        ];
        console.log("\n5. Замовлення з інформацією про користувачів:");
        const lookupResult = await db.collection('orders').aggregate(lookupPipeline).limit(3).toArray();
        console.log(lookupResult);

        // 6. $unwind: Розгорнути масив товарів у замовленнях
        const unwindPipeline = [
            { $unwind: "$items" },
            { $project: {
                orderNumber: 1,
                productName: "$items.name",
                productPrice: "$items.price",
                quantity: "$items.quantity"
            }}
        ];
        console.log("\n6. Розгорнуті товари в замовленнях:");
        const unwindResult = await db.collection('orders').aggregate(unwindPipeline).limit(5).toArray();
        console.log(unwindResult);

        // Комбінований приклад: Середній рейтинг продуктів по категоріях
        const combinedPipeline = [
            { $lookup: {
                from: "categories",
                localField: "categoryId",
                foreignField: "_id",
                as: "category"
            }},
            { $unwind: "$category" },
            { $group: {
                _id: "$category.name",
                avgPrice: { $avg: "$price" },
                count: { $sum: 1 }
            }},
            { $sort: { avgPrice: -1 } }
        ];
        console.log("\n7. Середня ціна продуктів по категоріях:");
        const combinedResult = await db.collection('products').aggregate(combinedPipeline).toArray();
        console.log(combinedResult);

    } catch (error) {
        console.error('Помилка при виконанні агрегацій:', error);
    } finally {
        await client.close();
    }
}

runAggregations().catch(console.error);
