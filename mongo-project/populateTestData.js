const { MongoClient, ObjectId } = require('mongodb');
const uri = 'mongodb://127.0.0.1:27017/electronicsStore';
const client = new MongoClient(uri);

async function populateTestData() {
    try {
        await client.connect();
        const db = client.db();
        
        console.log('Заповнення бази даних тестовими даними...');
        
        // Очищаємо колекції перед заповненням
        await db.collection('users').deleteMany({});
        await db.collection('categories').deleteMany({});
        await db.collection('products').deleteMany({});
        await db.collection('reviews').deleteMany({});
        await db.collection('orders').deleteMany({});
        await db.collection('promotions').deleteMany({});
        await db.collection('shipping').deleteMany({});
        
        // Додаємо категорії
        const categories = await db.collection('categories').insertMany([
            { 
                _id: new ObjectId(), 
                name: 'Смартфони', 
                slug: 'smartphones', 
                isActive: true 
            },
            { 
                _id: new ObjectId(), 
                name: 'Ноутбуки', 
                slug: 'laptops', 
                isActive: true 
            }
        ]);
        
        // Додаємо користувачів
        const users = await db.collection('users').insertMany([
            {
                email: 'user1@example.com',
                password: 'hashed_password_1',
                firstName: 'Іван',
                lastName: 'Петренко',
                addresses: [{
                    type: 'home',
                    street: 'вул. Примерна, 123',
                    city: 'Київ',
                    postalCode: '01001',
                    country: 'Україна'
                }],
                wishlist: [],
                cart: [],
                createdAt: new Date(),
                lastLogin: new Date()
            },
            {
                email: 'user2@example.com',
                password: 'hashed_password_2',
                firstName: 'Марія',
                lastName: 'Іваненко',
                addresses: [{
                    type: 'work',
                    street: 'вул. Робоча, 456',
                    city: 'Львів',
                    postalCode: '79000',
                    country: 'Україна'
                }],
                wishlist: [],
                cart: [],
                createdAt: new Date(),
                lastLogin: new Date()
            }
        ]);
        
        const userIds = Object.values(users.insertedIds);
        const categoryIds = Object.values(categories.insertedIds);
        
        // Додаємо продукти
        const products = await db.collection('products').insertMany([
            {
                name: 'iPhone 13',
                description: 'Флагманський смартфон від Apple',
                sku: 'APPLE-IP13',
                categoryId: categoryIds[0],
                brand: 'Apple',
                price: 29999,
                stock: 10,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Samsung Galaxy S21',
                description: 'Потужний Android-смартфон',
                sku: 'SAMSUNG-GS21',
                categoryId: categoryIds[0],
                brand: 'Samsung',
                price: 24999,
                stock: 15,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'MacBook Pro 16"',
                description: 'Потужний ноутбук для професіоналів',
                sku: 'APPLE-MBP16',
                categoryId: categoryIds[1],
                brand: 'Apple',
                price: 89999,
                stock: 5,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
        
        const productIds = Object.values(products.insertedIds);
        
        // Додаємо відгуки
        await db.collection('reviews').insertMany([
            {
                productId: productIds[0],
                userId: userIds[0],
                rating: 5,
                title: 'Чудовий телефон',
                comment: 'Дуже задоволений покупкою',
                isVerified: true,
                createdAt: new Date(),
                status: 'approved',
                helpful: 12
            },
            {
                productId: productIds[0],
                userId: userIds[1],
                rating: 4,
                title: 'Добре, але дорого',
                comment: 'Якість відмінна, але ціна завищена',
                isVerified: true,
                createdAt: new Date(),
                status: 'approved',
                helpful: 5
            }
        ]);
        
        // Додаємо замовлення
        await db.collection('orders').insertMany([
            {
                userId: userIds[0],
                orderNumber: 'ORD001',
                items: [
                    {
                        productId: productIds[0],
                        name: 'iPhone 13',
                        price: 29999,
                        quantity: 1
                    }
                ],
                totalAmount: 29999,
                discountAmount: 0,
                finalAmount: 29999,
                status: 'delivered',
                shippingAddress: {
                    street: 'вул. Примерна, 123',
                    city: 'Київ',
                    postalCode: '01001',
                    country: 'Україна'
                },
                paymentMethod: 'credit_card',
                paymentStatus: 'completed',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
        
        // Додаємо акції
        await db.collection('promotions').insertMany([
            {
                code: 'SUMMER2024',
                description: 'Літня знижка',
                discountType: 'percentage',
                discountValue: 15,
                minOrderAmount: 1000,
                maxDiscountAmount: 5000,
                startDate: new Date('2024-06-01'),
                endDate: new Date('2024-08-31'),
                usageLimit: 100,
                usedCount: 25,
                isActive: true,
                applicableCategories: [],
                applicableProducts: []
            }
        ]);
        
        // Додаємо варіанти доставки
        await db.collection('shipping').insertMany([
            {
                name: 'Стандартна доставка',
                description: 'Доставка через 3-5 робочих днів',
                price: 150,
                freeShippingThreshold: 2000,
                estimatedDays: '3-5',
                isActive: true,
                regions: ['Україна']
            }
        ]);
        
        console.log('Тестові дані успішно додані!');
        
    } catch (error) {
        console.error('Помилка заповнення тестовими даними:', error);
    } finally {
        await client.close();
    }
}

// Виклик функції заповнення даних
populateTestData().catch(console.error);