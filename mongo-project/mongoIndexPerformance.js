// mongoIndexPerformance.js
const { MongoClient } = require('mongodb');
const uri = 'mongodb://127.0.0.1:27017/electronicsStore';
const client = new MongoClient(uri);

async function createDatabase() {
    try {
        await client.connect();
        console.log('Підключено до MongoDB сервера');
        const db = client.db();

        // Перевірка існування колекцій
        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(col => col.name);

        // Створення колекцій
        if (!collectionNames.includes('users')) {
            await db.createCollection('users', {
                validator: {
                    $jsonSchema: {
                        bsonType: 'object',
                        required: ['email', 'password', 'firstName', 'lastName'],
                        properties: {
                            email: { bsonType: 'string', pattern: '^\\S+@\\S+\\.\\S+$' },
                            password: { bsonType: 'string' },
                            firstName: { bsonType: 'string' },
                            lastName: { bsonType: 'string' },
                            phone: { bsonType: 'string' },
                            addresses: {
                                bsonType: 'array',
                                items: {
                                    bsonType: 'object',
                                    required: ['type', 'street', 'city', 'postalCode'],
                                    properties: {
                                        type: { bsonType: 'string' },
                                        street: { bsonType: 'string' },
                                        city: { bsonType: 'string' },
                                        postalCode: { bsonType: 'string' },
                                        country: { bsonType: 'string' }
                                    }
                                }
                            },
                            wishlist: { bsonType: 'array', items: { bsonType: 'objectId' } },
                            cart: {
                                bsonType: 'array',
                                items: {
                                    bsonType: 'object',
                                    required: ['productId', 'quantity'],
                                    properties: {
                                        productId: { bsonType: 'objectId' },
                                        quantity: { bsonType: 'number' },
                                        addedAt: { bsonType: 'date' }
                                    }
                                }
                            },
                            createdAt: { bsonType: 'date' },
                            lastLogin: { bsonType: 'date' }
                        }
                    }
                }
            });
            console.log('Колекція users створена');
        }

        if (!collectionNames.includes('products')) {
            await db.createCollection('products', {
                validator: {
                    $jsonSchema: {
                        bsonType: 'object',
                        required: ['name', 'sku', 'categoryId', 'price', 'stock'],
                        properties: {
                            name: { bsonType: 'string' },
                            description: { bsonType: 'string' },
                            sku: { bsonType: 'string' },
                            categoryId: { bsonType: 'objectId' },
                            brand: { bsonType: 'string' },
                            price: { bsonType: 'number' },
                            oldPrice: { bsonType: 'number' },
                            specifications: { bsonType: 'object' },
                            images: { bsonType: 'array', items: { bsonType: 'string' } },
                            stock: { bsonType: 'number' },
                            tags: { bsonType: 'array', items: { bsonType: 'string' } },
                            rating: { bsonType: 'object', properties: { average: { bsonType: 'number' }, count: { bsonType: 'number' } } },
                            isActive: { bsonType: 'bool' },
                            createdAt: { bsonType: 'date' },
                            updatedAt: { bsonType: 'date' }
                        }
                    }
                }
            });
            console.log('Колекція products створена');
        }

        if (!collectionNames.includes('categories')) {
            await db.createCollection('categories', {
                validator: {
                    $jsonSchema: {
                        bsonType: 'object',
                        required: ['name', 'slug'],
                        properties: {
                            name: { bsonType: 'string' },
                            slug: { bsonType: 'string' },
                            description: { bsonType: 'string' },
                            parentId: { bsonType: 'objectId' },
                            specifications: {
                                bsonType: 'array',
                                items: {
                                    bsonType: 'object',
                                    required: ['name', 'type'],
                                    properties: {
                                        name: { bsonType: 'string' },
                                        type: { bsonType: 'string', enum: ['string', 'number', 'boolean'] },
                                        required: { bsonType: 'bool' },
                                        options: { bsonType: 'array', items: { bsonType: 'string' } }
                                    }
                                }
                            },
                            image: { bsonType: 'string' },
                            isActive: { bsonType: 'bool' }
                        }
                    }
                }
            });
            console.log('Колекція categories створена');
        }

        if (!collectionNames.includes('orders')) {
            await db.createCollection('orders', {
                validator: {
                    $jsonSchema: {
                        bsonType: 'object',
                        required: ['userId', 'items', 'totalAmount', 'status'],
                        properties: {
                            userId: { bsonType: 'objectId' },
                            orderNumber: { bsonType: 'string' },
                            items: {
                                bsonType: 'array',
                                items: {
                                    bsonType: 'object',
                                    required: ['productId', 'name', 'price', 'quantity'],
                                    properties: {
                                        productId: { bsonType: 'objectId' },
                                        name: { bsonType: 'string' },
                                        price: { bsonType: 'number' },
                                        quantity: { bsonType: 'number' },
                                        specifications: { bsonType: 'object' }
                                    }
                                }
                            },
                            totalAmount: { bsonType: 'number' },
                            discountAmount: { bsonType: 'number' },
                            finalAmount: { bsonType: 'number' },
                            status: { bsonType: 'string', enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] },
                            shippingAddress: {
                                bsonType: 'object',
                                required: ['street', 'city', 'postalCode', 'country'],
                                properties: {
                                    street: { bsonType: 'string' },
                                    city: { bsonType: 'string' },
                                    postalCode: { bsonType: 'string' },
                                    country: { bsonType: 'string' }
                                }
                            },
                            paymentMethod: { bsonType: 'string', enum: ['credit_card', 'paypal', 'cash_on_delivery'] },
                            paymentStatus: { bsonType: 'string', enum: ['pending', 'completed', 'failed'] },
                            promoCode: { bsonType: 'string' },
                            trackingNumber: { bsonType: 'string' },
                            createdAt: { bsonType: 'date' },
                            updatedAt: { bsonType: 'date' }
                        }
                    }
                }
            });
            console.log('Колекція orders створена');
        }

        if (!collectionNames.includes('reviews')) {
            await db.createCollection('reviews', {
                validator: {
                    $jsonSchema: {
                        bsonType: 'object',
                        required: ['productId', 'userId', 'rating', 'comment'],
                        properties: {
                            productId: { bsonType: 'objectId' },
                            userId: { bsonType: 'objectId' },
                            rating: { bsonType: 'number', minimum: 1, maximum: 5 },
                            title: { bsonType: 'string' },
                            comment: { bsonType: 'string' },
                            advantages: { bsonType: 'string' },
                            disadvantages: { bsonType: 'string' },
                            isVerified: { bsonType: 'bool' },
                            createdAt: { bsonType: 'date' },
                            helpful: { bsonType: 'number' },
                            status: { bsonType: 'string', enum: ['pending', 'approved', 'rejected'] }
                        }
                    }
                }
            });
            console.log('Колекція reviews створена');
        }

        if (!collectionNames.includes('promotions')) {
            await db.createCollection('promotions', {
                validator: {
                    $jsonSchema: {
                        bsonType: 'object',
                        required: ['code', 'discountType', 'discountValue', 'startDate', 'endDate'],
                        properties: {
                            code: { bsonType: 'string' },
                            description: { bsonType: 'string' },
                            discountType: { bsonType: 'string', enum: ['percentage', 'fixed'] },
                            discountValue: { bsonType: 'number' },
                            minOrderAmount: { bsonType: 'number' },
                            maxDiscountAmount: { bsonType: 'number' },
                            startDate: { bsonType: 'date' },
                            endDate: { bsonType: 'date' },
                            usageLimit: { bsonType: 'number' },
                            usedCount: { bsonType: 'number' },
                            isActive: { bsonType: 'bool' },
                            applicableCategories: { bsonType: 'array', items: { bsonType: 'objectId' } },
                            applicableProducts: { bsonType: 'array', items: { bsonType: 'objectId' } }
                        }
                    }
                }
            });
            console.log('Колекція promotions створена');
        }

        if (!collectionNames.includes('shipping')) {
            await db.createCollection('shipping', {
                validator: {
                    $jsonSchema: {
                        bsonType: 'object',
                        required: ['name', 'price', 'isActive'],
                        properties: {
                            name: { bsonType: 'string' },
                            description: { bsonType: 'string' },
                            price: { bsonType: 'number' },
                            freeShippingThreshold: { bsonType: 'number' },
                            estimatedDays: { bsonType: 'string' },
                            isActive: { bsonType: 'bool' },
                            regions: { bsonType: 'array', items: { bsonType: 'string' } }
                        }
                    }
                }
            });
            console.log('Колекція shipping створена');
        }

        // Створення індексів для покращення продуктивності
        await db.collection('products').createIndexes([
            { key: { categoryId: 1 } },
            { key: { price: 1 } },
            { key: { name: "text", description: "text", brand: "text" } }
        ]);
        await db.collection('users').createIndex({ email: 1 }, { unique: true });
        await db.collection('orders').createIndex({ userId: 1, createdAt: -1 });
        await db.collection('reviews').createIndex({ productId: 1, userId: 1 }, { unique: true });
        await db.collection('categories').createIndex({ slug: 1 });
        await db.collection('promotions').createIndex({ code: 1 });
        await db.collection('shipping').createIndex({ isActive: 1 });
        console.log('Індекси успішно створені');

        // Створення представлень (view)
        const views = [
            {
                name: "orderDetails",
                viewOn: "orders",
                pipeline: [
                    { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "user" } },
                    { $unwind: "$user" },
                    { $lookup: { from: "products", localField: "items.productId", foreignField: "_id", as: "products" } },
                    { $project: { orderNumber: 1, status: 1, totalAmount: 1, finalAmount: 1, createdAt: 1, "user.firstName": 1, "user.lastName": 1, "user.email": 1, "products.name": 1, "products.price": 1 } }
                ]
            },
            {
                name: "productDetails",
                viewOn: "products",
                pipeline: [
                    { $lookup: { from: "categories", localField: "categoryId", foreignField: "_id", as: "category" } },
                    { $unwind: "$category" },
                    { $lookup: { from: "reviews", localField: "_id", foreignField: "productId", as: "reviews" } },
                    { $project: { name: 1, sku: 1, brand: 1, price: 1, stock: 1, "category.name": 1, reviewsCount: { $size: "$reviews" }, avgRating: { $avg: "$reviews.rating" } } }
                ]
            },
            {
                name: "userActivity",
                viewOn: "users",
                pipeline: [
                    { $lookup: { from: "orders", localField: "_id", foreignField: "userId", as: "orders" } },
                    { $project: { firstName: 1, lastName: 1, email: 1, ordersCount: { $size: "$orders" } } }
                ]
            }
        ];

        for (const view of views) {
            const existing = await db.listCollections({ name: view.name }).toArray();
            if (existing.length === 0) {
                await db.createCollection(view.name, { viewOn: view.viewOn, pipeline: view.pipeline });
                console.log(`View '${view.name}' створено`);
            }
        }

        console.log('База даних electronicsStore успішно створена та налаштована!');
    } catch (error) {
        console.error('Помилка при створенні бази даних:', error);
    } finally {
        await client.close();
        console.log('З\'єднання з MongoDB закрите');
    }
}

async function measureQueryPerformance() {
    try {
        await client.connect();
        console.log('Підключено до MongoDB сервера');
        const db = client.db();

        // Виконання запитів без індексів та вимір часу
        console.log('Виконання запитів без індексів...');
        const usersCollection = db.collection('users');
        const productsCollection = db.collection('products');
        const ordersCollection = db.collection('orders');
        const reviewsCollection = db.collection('reviews');
        const categoriesCollection = db.collection('categories');
        const promotionsCollection = db.collection('promotions');
        const shippingCollection = db.collection('shipping');

        // Запит для колекції users
        const usersQueryWithoutIndex = { email: 'example@example.com' };
        const usersStartTime = process.hrtime();
        await usersCollection.findOne(usersQueryWithoutIndex);
        const usersEndTime = process.hrtime(usersStartTime);
        console.log(`Час виконання запиту для users без індексу: ${usersEndTime[0]}s ${usersEndTime[1] / 1000000}ms`);

        // Запит для колекції products
        const productsQueryWithoutIndex = { categoryId: 'someCategoryId' };
        const productsStartTime = process.hrtime();
        await productsCollection.findOne(productsQueryWithoutIndex);
        const productsEndTime = process.hrtime(productsStartTime);
        console.log(`Час виконання запиту для products без індексу: ${productsEndTime[0]}s ${productsEndTime[1] / 1000000}ms`);

        // Запит для колекції orders
        const ordersQueryWithoutIndex = { userId: 'someUserId', createdAt: { $gte: new Date('2023-01-01') } };
        const ordersStartTime = process.hrtime();
        await ordersCollection.findOne(ordersQueryWithoutIndex);
        const ordersEndTime = process.hrtime(ordersStartTime);
        console.log(`Час виконання запиту для orders без індексу: ${ordersEndTime[0]}s ${ordersEndTime[1] / 1000000}ms`);

        // Запит для колекції reviews
        const reviewsQueryWithoutIndex = { productId: 'someProductId', userId: 'someUserId' };
        const reviewsStartTime = process.hrtime();
        await reviewsCollection.findOne(reviewsQueryWithoutIndex);
        const reviewsEndTime = process.hrtime(reviewsStartTime);
        console.log(`Час виконання запиту для reviews без індексу: ${reviewsEndTime[0]}s ${reviewsEndTime[1] / 1000000}ms`);

        // Запит для колекції categories
        const categoriesQueryWithoutIndex = { slug: 'some-slug' };
        const categoriesStartTime = process.hrtime();
        await categoriesCollection.findOne(categoriesQueryWithoutIndex);
        const categoriesEndTime = process.hrtime(categoriesStartTime);
        console.log(`Час виконання запиту для categories без індексу: ${categoriesEndTime[0]}s ${categoriesEndTime[1] / 1000000}ms`);

        // Запит для колекції promotions
        const promotionsQueryWithoutIndex = { code: 'SOMECODE' };
        const promotionsStartTime = process.hrtime();
        await promotionsCollection.findOne(promotionsQueryWithoutIndex);
        const promotionsEndTime = process.hrtime(promotionsStartTime);
        console.log(`Час виконання запиту для promotions без індексу: ${promotionsEndTime[0]}s ${promotionsEndTime[1] / 1000000}ms`);

        // Запит для колекції shipping
        const shippingQueryWithoutIndex = { isActive: true };
        const shippingStartTime = process.hrtime();
        await shippingCollection.findOne(shippingQueryWithoutIndex);
        const shippingEndTime = process.hrtime(shippingStartTime);
        console.log(`Час виконання запиту для shipping без індексу: ${shippingEndTime[0]}s ${shippingEndTime[1] / 1000000}ms`);

        // Створення індексів
        console.log('Створення індексів...');
        await usersCollection.createIndex({ email: 1 }, { unique: true });
        await productsCollection.createIndexes([
            { key: { categoryId: 1 } },
            { key: { price: 1 } },
            { key: { name: "text", description: "text", brand: "text" } }
        ]);
        await ordersCollection.createIndex({ userId: 1, createdAt: -1 });
        await reviewsCollection.createIndex({ productId: 1, userId: 1 }, { unique: true });
        await categoriesCollection.createIndex({ slug: 1 });
        await promotionsCollection.createIndex({ code: 1 });
        await shippingCollection.createIndex({ isActive: 1 });
        console.log('Індекси створено');

        // Виконання запитів з індексами та вимір часу
        console.log('Виконання запитів з індексами...');

        // Запит для колекції users
        const usersQueryWithIndex = { email: 'example@example.com' };
        const usersStartTimeWithIndex = process.hrtime();
        await usersCollection.findOne(usersQueryWithIndex);
        const usersEndTimeWithIndex = process.hrtime(usersStartTimeWithIndex);
        console.log(`Час виконання запиту для users з індексом: ${usersEndTimeWithIndex[0]}s ${usersEndTimeWithIndex[1] / 1000000}ms`);

        // Запит для колекції products
        const productsQueryWithIndex = { categoryId: 'someCategoryId' };
        const productsStartTimeWithIndex = process.hrtime();
        await productsCollection.findOne(productsQueryWithIndex);
        const productsEndTimeWithIndex = process.hrtime(productsStartTimeWithIndex);
        console.log(`Час виконання запиту для products з індексом: ${productsEndTimeWithIndex[0]}s ${productsEndTimeWithIndex[1] / 1000000}ms`);

        // Запит для колекції orders
        const ordersQueryWithIndex = { userId: 'someUserId', createdAt: { $gte: new Date('2023-01-01') } };
        const ordersStartTimeWithIndex = process.hrtime();
        await ordersCollection.findOne(ordersQueryWithIndex);
        const ordersEndTimeWithIndex = process.hrtime(ordersStartTimeWithIndex);
        console.log(`Час виконання запиту для orders з індексом: ${ordersEndTimeWithIndex[0]}s ${ordersEndTimeWithIndex[1] / 1000000}ms`);

        // Запит для колекції reviews
        const reviewsQueryWithIndex = { productId: 'someProductId', userId: 'someUserId' };
        const reviewsStartTimeWithIndex = process.hrtime();
        await reviewsCollection.findOne(reviewsQueryWithIndex);
        const reviewsEndTimeWithIndex = process.hrtime(reviewsStartTimeWithIndex);
        console.log(`Час виконання запиту для reviews з індексом: ${reviewsEndTimeWithIndex[0]}s ${reviewsEndTimeWithIndex[1] / 1000000}ms`);

        // Запит для колекції categories
        const categoriesQueryWithIndex = { slug: 'some-slug' };
        const categoriesStartTimeWithIndex = process.hrtime();
        await categoriesCollection.findOne(categoriesQueryWithIndex);
        const categoriesEndTimeWithIndex = process.hrtime(categoriesStartTimeWithIndex);
        console.log(`Час виконання запиту для categories з індексом: ${categoriesEndTimeWithIndex[0]}s ${categoriesEndTimeWithIndex[1] / 1000000}ms`);

        // Запит для колекції promotions
        const promotionsQueryWithIndex = { code: 'SOMECODE' };
        const promotionsStartTimeWithIndex = process.hrtime();
        await promotionsCollection.findOne(promotionsQueryWithIndex);
        const promotionsEndTimeWithIndex = process.hrtime(promotionsStartTimeWithIndex);
        console.log(`Час виконання запиту для promotions з індексом: ${promotionsEndTimeWithIndex[0]}s ${promotionsEndTimeWithIndex[1] / 1000000}ms`);

        // Запит для колекції shipping
        const shippingQueryWithIndex = { isActive: true };
        const shippingStartTimeWithIndex = process.hrtime();
        await shippingCollection.findOne(shippingQueryWithIndex);
        const shippingEndTimeWithIndex = process.hrtime(shippingStartTimeWithIndex);
        console.log(`Час виконання запиту для shipping з індексом: ${shippingEndTimeWithIndex[0]}s ${shippingEndTimeWithIndex[1] / 1000000}ms`);

        console.log('Вимірювання часу виконання запитів завершено');
    } catch (error) {
        console.error('Помилка при виконанні лабораторної роботи:', error);
    } finally {
        await client.close();
        console.log('З\'єднання з MongoDB закрите');
    }
}

// Виклик функцій
async function main() {
    await createDatabase();
    await measureQueryPerformance();
}

main().catch(console.error);
