// TimeSeriesLabSolution.js
// Лабораторна робота 6: Часові ряди в MongoDB
// Виправлена версія з унікальними назвами колекцій та поясненнями
const { MongoClient } = require('mongodb');
const uri = 'mongodb://127.0.0.1:27017/electronicsStore';
const client = new MongoClient(uri);

/**
 * 1. Створення колекцій часових рядів
 * Завдання: Створити дві спеціалізовані колекції для аналізу даних
 */
async function createTimeSeriesCollections() {
    try {
        await client.connect();
        const db = client.db();
        // 1.1 Колекція user_activity_log
        // Призначення: Відстеження дій користувачів на сайті
        // Особливості:
        // - Гранулярність 'hours' (години) - достатньо для аналізу поведінки
        // - TTL 30 днів - оптимальний період для аналізу поведінки користувачів
        // - Дозволяє виявляти пікові періоди активності
        // - Корисно для оптимізації маркетингових кампаній
        await db.createCollection('user_activity_log', {
            timeseries: {
                timeField: 'timestamp',  // Поле з часовими мітками
                metaField: 'userId',     // Поле з ідентифікатором користувача
                granularity: 'hours'     // Рівень деталізації
            },
            expireAfterSeconds: 2592000 // 30 днів в секундах
        });
        console.log('Колекцію user_activity_log створено');
        // 1.2 Колекція sales_transactions
        // Призначення: Моніторинг продажів в реальному часі
        // Особливості:
        // - Гранулярність 'minutes' (хвилини) - для детального аналізу
        // - TTL 7 днів - достатньо для оперативного аналізу
        // - Дозволяє відстежувати динаміку продажів
        // - Корисно для управління запасами та логістикою
        await db.createCollection('sales_transactions', {
            timeseries: {
                timeField: 'timestamp',  // Поле з часовими мітками
                metaField: 'productId',  // Поле з ідентифікатором продукту
                granularity: 'minutes'  // Більш висока деталізація
            },
            expireAfterSeconds: 604800 // 7 днів в секундах
        });
        console.log('Колекцію sales_transactions створено');
    } catch (error) {
        console.error('Помилка при створенні колекцій:', error);
    } finally {
        await client.close();
    }
}

/**
 * 2. Заповнення колекцій тестовими даними
 * Завдання: Заповнити колекції реалістичними даними для аналізу
 */
async function populateCollections() {
    try {
        await client.connect();
        const db = client.db();
        // 2.1 Очистка колекцій перед заповненням
        await db.collection('user_activity_log').deleteMany({});
        await db.collection('sales_transactions').deleteMany({});
        console.log('Колекції очищено');
        // 2.2 Заповнення колекції user_activity_log
        // Формат документів:
        // - timestamp: Час дії користувача
        // - action: Тип дії (login, view_product, add_to_cart, checkout)
        // - userId: Ідентифікатор користувача
        // - metadata: Додаткові дані (пристрій, локація, тощо)
        await db.collection('user_activity_log').insertMany([
            {
                timestamp: new Date('2023-05-01T08:00:00Z'),
                action: 'login',
                userId: 'user1',
                metadata: { device: 'mobile', location: 'Kyiv' }
            },
            {
                timestamp: new Date('2023-05-01T09:30:00Z'),
                action: 'view_product',
                userId: 'user1',
                metadata: { productId: 'prod1', device: 'mobile' }
            },
            {
                timestamp: new Date('2023-05-01T10:15:00Z'),
                action: 'add_to_cart',
                userId: 'user1',
                metadata: { productId: 'prod2', device: 'mobile' }
            },
            {
                timestamp: new Date('2023-05-01T08:30:00Z'),
                action: 'login',
                userId: 'user2',
                metadata: { device: 'desktop', location: 'Lviv' }
            },
            {
                timestamp: new Date('2023-05-01T11:45:00Z'),
                action: 'checkout',
                userId: 'user2',
                metadata: { orderId: 'ord123', device: 'desktop' }
            }
        ]);
        console.log('Колекцію user_activity_log заповнено');
        // 2.3 Заповнення колекції sales_transactions
        // Формат документів:
        // - timestamp: Час продажу
        // - amount: Сума продажу
        // - productId: Ідентифікатор продукту
        // - metadata: Додаткові дані (категорія, регіон, тощо)
        await db.collection('sales_transactions').insertMany([
            {
                timestamp: new Date('2023-05-01T09:00:00Z'),
                amount: 1999,
                productId: 'prod1',
                metadata: { category: 'electronics', region: 'west' }
            },
            {
                timestamp: new Date('2023-05-01T09:30:00Z'),
                amount: 2999,
                productId: 'prod2',
                metadata: { category: 'appliances', region: 'east' }
            },
            {
                timestamp: new Date('2023-05-01T10:00:00Z'),
                amount: 999,
                productId: 'prod3',
                metadata: { category: 'accessories', region: 'center' }
            },
            {
                timestamp: new Date('2023-05-01T10:30:00Z'),
                amount: 1499,
                productId: 'prod1',
                metadata: { category: 'electronics', region: 'west' }
            }
        ]);
        console.log('Колекцію sales_transactions заповнено');
    } catch (error) {
        console.error('Помилка при заповненні колекцій:', error);
    } finally {
        await client.close();
    }
}

/**
 * 3. Агрегаційні запити до колекцій
 * Завдання: Виконати 5 аналітичних запитів для бізнес-аналізу
 */
async function runAnalytics() {
    try {
        await client.connect();
        const db = client.db();
        // 3.1 Активність користувачів по годинах
        // Призначення: Виявлення пікових періодів активності
        // Користь:
        // - Допомагає планувати серверні ресурси
        // - Корисно для оптимізації маркетингових кампаній
        const activityByHour = [
            {
                $group: {
                    _id: {
                        userId: "$userId",
                        hour: { $dateToString: { format: "%Y-%m-%d %H:00", date: "$timestamp" } }
                    },
                    actions: { $push: "$action" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.hour": 1 } }
        ];
        console.log("\n3.1 Активність користувачів по годинах:");
        const activityResult = await db.collection('user_activity_log').aggregate(activityByHour).toArray();
        console.log(activityResult);
        // 3.2 Продажі по годинах
        // Призначення: Аналіз динаміки продажів
        // Користь:
        // - Допомагає в плануванні маркетингових акцій
        // - Корисно для управління персоналом
        const salesByHour = [
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d %H:00", date: "$timestamp" }
                    },
                    totalSales: { $sum: "$amount" },
                    transactions: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ];
        console.log("\n3.2 Продажі по годинах:");
        const salesResult = await db.collection('sales_transactions').aggregate(salesByHour).toArray();
        console.log(salesResult);
        // 3.3 Найпопулярніші продукти
        // Призначення: Визначення лідируючих товарів
        // Користь:
        // - Оптимізація асортименту
        // - Управління запасами
        const popularProducts = [
            {
                $group: {
                    _id: "$productId",
                    totalSales: { $sum: "$amount" },
                    transactions: { $sum: 1 }
                }
            },
            { $sort: { "totalSales": -1 } },
            { $limit: 3 }
        ];
        console.log("\n3.3 Найпопулярніші продукти:");
        const productsResult = await db.collection('sales_transactions').aggregate(popularProducts).toArray();
        console.log(productsResult);
        // 3.4 Продажі по регіонах
        // Призначення: Географічний аналіз продажів
        // Користь:
        // - Оптимізація логістики
        // - Регіональні маркетингові стратегії
        const salesByRegion = [
            {
                $group: {
                    _id: "$metadata.region",
                    totalAmount: { $sum: "$amount" },
                    productsSold: { $sum: 1 }
                }
            },
            { $sort: { "totalAmount": -1 } }
        ];
        console.log("\n3.4 Продажі по регіонах:");
        const regionResult = await db.collection('sales_transactions').aggregate(salesByRegion).toArray();
        console.log(regionResult);
        // 3.5 Аналіз використання пристроїв
        // Призначення: Вивчення переваг користувачів
        // Користь:
        // - Покращення користувацького досвіду
        // - Оптимізація сайту для різних пристроїв
        const deviceAnalysis = [
            {
                $group: {
                    _id: "$metadata.device",
                    users: { $addToSet: "$userId" },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    device: "$_id",
                    userCount: { $size: "$users" },
                    actions: "$count"
                }
            },
            { $sort: { "actions": -1 } }
        ];
        console.log("\n3.5 Аналіз використання пристроїв:");
        const deviceResult = await db.collection('user_activity_log').aggregate(deviceAnalysis).toArray();
        console.log(deviceResult);
    } catch (error) {
        console.error('Помилка при виконанні агрегацій:', error);
    } finally {
        await client.close();
    }
}

/**
 * 4. Головна функція виконання роботи
 */
async function main() {
    try {
        console.log("Лабораторна робота 6: Часові ряди в MongoDB\n");
        console.log("Ця програма демонструє використання колекцій часових рядів для аналізу даних електронного магазину\n");
        // Виконання всіх етапів
        await createTimeSeriesCollections();
        await populateCollections();
        await runAnalytics();
        console.log("\nЛабораторна робота успішно завершена!");
        console.log("\nОбгрунтування використаних рішень:");
        console.log("1. Колекція user_activity_log:");
        console.log("- Гранулярність 'hours' достатня для аналізу поведінки користувачів");
        console.log("- TTL 30 днів дозволяє аналізувати довгострокові тренди");
        console.log("- Дані про активність корисно для оптимізації сайту");
        console.log("\n2. Колекція sales_transactions:");
        console.log("- Гранулярність 'minutes' необхідна для оперативного аналізу");
        console.log("- TTL 7 днів забезпечує актуальність даних для швидких рішень");
        console.log("- Дані про продажі критично важливі для бізнес-аналізу");
        console.log("\n3. Агрегаційні запити:");
        console.log("- Дозволяють отримати цінну аналітику для прийняття рішень");
        console.log("- Кожен запит має конкретне бізнес-застосування");
    } catch (error) {
        console.error('Помилка в головній функції:', error);
    }
}

main().catch(console.error);
