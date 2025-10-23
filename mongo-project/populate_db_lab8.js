const { MongoClient, ObjectId } = require('mongodb');
const uri = 'mongodb://127.0.0.1:27017/electronicsStore';
const client = new MongoClient(uri);

async function populateDatabase() {
    try {
        await client.connect();
        console.log('Підключено до MongoDB сервера');
        const db = client.db();

        // Очистка колекцій перед заповненням
        await db.collection('users').deleteMany({});
        await db.collection('products').deleteMany({});
        await db.collection('categories').deleteMany({});
        await db.collection('orders').deleteMany({});
        await db.collection('reviews').deleteMany({});
        await db.collection('promotions').deleteMany({});
        await db.collection('shipping').deleteMany({});
        console.log('Колекції очищені');

        // 1. Заповнення колекції categories (5 записів)
        const categories = await db.collection('categories').insertMany([
            {
                _id: new ObjectId(),
                name: 'Смартфони',
                slug: 'smartphones',
                description: 'Сучасні смартфони з різними функціями та характеристиками',
                specifications: [
                    { name: 'Оперативна пам\'ять', type: 'number', required: true },
                    { name: 'Вбудована пам\'ять', type: 'number', required: true },
                    { name: 'Кількість SIM-карт', type: 'number', required: true }
                ],
                isActive: true
            },
            {
                _id: new ObjectId(),
                name: 'Ноутбуки',
                slug: 'laptops',
                description: 'Потужні ноутбуки для роботи, навчання та ігор',
                specifications: [
                    { name: 'Процесор', type: 'string', required: true },
                    { name: 'Оперативна пам\'ять', type: 'number', required: true },
                    { name: 'Діагональ екрану', type: 'number', required: true }
                ],
                isActive: true
            },
            {
                _id: new ObjectId(),
                name: 'Планшети',
                slug: 'tablets',
                description: 'Сучасні планшетні комп\'ютери з різними можливостями',
                specifications: [
                    { name: 'Процесор', type: 'string', required: true },
                    { name: 'Діагональ екрану', type: 'number', required: true }
                ],
                isActive: true
            },
            {
                _id: new ObjectId(),
                name: 'Телевізори',
                slug: 'tvs',
                description: 'Сучасні телевізори з різними технологіями',
                specifications: [
                    { name: 'Діагональ', type: 'number', required: true },
                    { name: 'Роздільна здатність', type: 'string', required: true }
                ],
                isActive: true
            },
            {
                _id: new ObjectId(),
                name: 'Аксесуари',
                slug: 'accessories',
                description: 'Аксесуари для електроніки',
                specifications: [],
                isActive: true
            }
        ]);
        console.log('Колекція categories заповнена');

        // 2. Заповнення колекції products (5 записів)
        const products = await db.collection('products').insertMany([
            {
                _id: new ObjectId(),
                name: 'iPhone 15 Pro',
                description: 'Флагманський смартфон від Apple з потужним процесором A17 Pro та відмінною камерою. Підтримує високопродуктивні завдання та має тривалий час роботи від аккумулятора.',
                sku: 'IPHONE15PRO',
                categoryId: categories.insertedIds[0],
                brand: 'Apple',
                price: 45000,
                oldPrice: 48000,
                stock: 15,
                tags: ['premium', 'new', 'apple', 'smartphone', 'high performance'],
                rating: { average: 4.9, count: 125 },
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                _id: new ObjectId(),
                name: 'Samsung Galaxy S23 Ultra',
                description: 'Потужний смартфон з камерою 200 МП та стилусом S Pen. Має високопродуктивний процесор та підтримує швидке заряджання.',
                sku: 'SAMSUNGS23ULTRA',
                categoryId: categories.insertedIds[0],
                brand: 'Samsung',
                price: 38000,
                oldPrice: 42000,
                stock: 20,
                tags: ['android', 'new', 'samsung', 'smartphone', 'high performance'],
                rating: { average: 4.8, count: 98 },
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                _id: new ObjectId(),
                name: 'MacBook Pro M3',
                description: 'Професійний ноутбук з чіпом M3 для розробників та креативних професіоналів. Має високопродуктивний процесор та відмінний дисплей.',
                sku: 'MACBOOKPRO',
                categoryId: categories.insertedIds[1],
                brand: 'Apple',
                price: 75000,
                oldPrice: 80000,
                stock: 8,
                tags: ['laptop', 'pro', 'apple', 'notebook', 'high performance'],
                rating: { average: 4.9, count: 75 },
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                _id: new ObjectId(),
                name: 'iPad Pro 12.9',
                description: 'Потужний планшет з чіпом M2 та високопродуктивним процесором. Ідеальний для роботи та розваг з великим дисплеєм.',
                sku: 'IPADPRO129',
                categoryId: categories.insertedIds[2],
                brand: 'Apple',
                price: 35000,
                oldPrice: 38000,
                stock: 12,
                tags: ['tablet', 'premium', 'apple', 'ipad', 'high performance'],
                rating: { average: 4.7, count: 65 },
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                _id: new ObjectId(),
                name: 'Samsung QLED QN90C',
                description: 'Телевізор з неймовірною якістю зображення та високою продуктивністю. Підтримує 4K роздільну здатність.',
                sku: 'QN90C',
                categoryId: categories.insertedIds[3],
                brand: 'Samsung',
                price: 45000,
                oldPrice: 50000,
                stock: 5,
                tags: ['tv', 'qled', 'samsung', '4k', 'high performance'],
                rating: { average: 4.8, count: 42 },
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
        console.log('Колекція products заповнена');

        // 3. Заповнення колекції users (5 записів)
        const users = await db.collection('users').insertMany([
            {
                _id: new ObjectId(),
                email: 'user1@example.com',
                password: 'hashed_password1',
                firstName: 'Іван',
                lastName: 'Петренко',
                phone: '0981234567',
                addresses: [
                    {
                        type: 'home',
                        street: 'вул. Шевченка, 1',
                        city: 'Київ',
                        postalCode: '01001',
                        country: 'Україна'
                    }
                ],
                wishlist: [products.insertedIds[0], products.insertedIds[2]],
                cart: [
                    {
                        productId: products.insertedIds[1],
                        quantity: 1,
                        addedAt: new Date()
                    }
                ],
                createdAt: new Date(),
                lastLogin: new Date()
            },
            {
                _id: new ObjectId(),
                email: 'user2@example.com',
                password: 'hashed_password2',
                firstName: 'Марія',
                lastName: 'Сидоренко',
                phone: '0972345678',
                addresses: [
                    {
                        type: 'work',
                        street: 'вул. Хрещатик, 10',
                        city: 'Київ',
                        postalCode: '01001',
                        country: 'Україна'
                    }
                ],
                wishlist: [products.insertedIds[3]],
                cart: [],
                createdAt: new Date(),
                lastLogin: new Date()
            },
            {
                _id: new ObjectId(),
                email: 'user3@example.com',
                password: 'hashed_password3',
                firstName: 'Олег',
                lastName: 'Коваленко',
                phone: '0963456789',
                addresses: [
                    {
                        type: 'home',
                        street: 'вул. Лисенка, 5',
                        city: 'Львів',
                        postalCode: '79000',
                        country: 'Україна'
                    }
                ],
                wishlist: [products.insertedIds[2], products.insertedIds[4]],
                cart: [
                    {
                        productId: products.insertedIds[0],
                        quantity: 2,
                        addedAt: new Date()
                    }
                ],
                createdAt: new Date(),
                lastLogin: new Date()
            },
            {
                _id: new ObjectId(),
                email: 'user4@example.com',
                password: 'hashed_password4',
                firstName: 'Анна',
                lastName: 'Іваненко',
                phone: '0954567890',
                addresses: [
                    {
                        type: 'home',
                        street: 'вул. Свободи, 15',
                        city: 'Харків',
                        postalCode: '61000',
                        country: 'Україна'
                    }
                ],
                wishlist: [products.insertedIds[1]],
                cart: [],
                createdAt: new Date(),
                lastLogin: new Date()
            },
            {
                _id: new ObjectId(),
                email: 'user5@example.com',
                password: 'hashed_password5',
                firstName: 'Петро',
                lastName: 'Гриценко',
                phone: '0935678901',
                addresses: [
                    {
                        type: 'home',
                        street: 'вул. Незалежності, 20',
                        city: 'Одеса',
                        postalCode: '65000',
                        country: 'Україна'
                    }
                ],
                wishlist: [products.insertedIds[3], products.insertedIds[4]],
                cart: [
                    {
                        productId: products.insertedIds[3],
                        quantity: 1,
                        addedAt: new Date()
                    }
                ],
                createdAt: new Date(),
                lastLogin: new Date()
            }
        ]);
        console.log('Колекція users заповнена');

        // 4. Заповнення колекції reviews (5 записів)
        await db.collection('reviews').insertMany([
            {
                _id: new ObjectId(),
                productId: products.insertedIds[0],
                userId: users.insertedIds[0],
                rating: 5,
                title: 'Чудовий смартфон з відмінною камерою',
                comment: 'Великі враження від роботи пристрою. Камера просто супер! Батарея тримає цілий день. Дякую за якісний продукт.',
                advantages: 'Камера, продуктивність, дизайн, тривалість роботи',
                disadvantages: 'Ціна',
                isVerified: true,
                createdAt: new Date(),
                helpful: 45,
                status: 'approved'
            },
            {
                _id: new ObjectId(),
                productId: products.insertedIds[1],
                userId: users.insertedIds[1],
                rating: 4,
                title: 'Відмінний андроід з хорошою батареєю',
                comment: 'Дуже задоволений покупкою. Батарея тримає довго. Екран просто чудовий. Рекомендую всім.',
                advantages: 'Батарея, екран, швидкість, продуктивність',
                disadvantages: 'Вага',
                isVerified: true,
                createdAt: new Date(),
                helpful: 32,
                status: 'approved'
            },
            {
                _id: new ObjectId(),
                productId: products.insertedIds[2],
                userId: users.insertedIds[2],
                rating: 5,
                title: 'Найкращий ноутбук для роботи',
                comment: 'Неймовірна продуктивність та тривалий час роботи. Ідеальний для програмістів та креативних професіоналів.',
                advantages: 'Продуктивність, екран, клавіатура, швидкість',
                disadvantages: 'Вага',
                isVerified: true,
                createdAt: new Date(),
                helpful: 68,
                status: 'approved'
            },
            {
                _id: new ObjectId(),
                productId: products.insertedIds[3],
                userId: users.insertedIds[3],
                rating: 4,
                title: 'Вражаючий дисплей та продуктивність',
                comment: 'Дуже якісний екран та швидка робота. Ідеальний для перегляду фільмів та роботи з графікою.',
                advantages: 'Екран, продуктивність, дизайн',
                disadvantages: 'Ціна',
                isVerified: true,
                createdAt: new Date(),
                helpful: 27,
                status: 'approved'
            },
            {
                _id: new ObjectId(),
                productId: products.insertedIds[4],
                userId: users.insertedIds[4],
                rating: 5,
                title: 'Неймовірна якість зображення та звуку',
                comment: 'Кольори просто вражають. Звук також на висоті. Дуже задоволений покупкою. Рекомендую всім.',
                advantages: 'Кольори, контраст, дизайн, звук',
                disadvantages: 'Ціна',
                isVerified: true,
                createdAt: new Date(),
                helpful: 55,
                status: 'approved'
            }
        ]);
        console.log('Колекція reviews заповнена');

        // 5. Заповнення колекції orders (5 записів)
        await db.collection('orders').insertMany([
            {
                _id: new ObjectId(),
                userId: users.insertedIds[0],
                orderNumber: 'ORD-1001',
                items: [
                    {
                        productId: products.insertedIds[0],
                        name: 'iPhone 15 Pro',
                        price: 45000,
                        quantity: 1
                    }
                ],
                totalAmount: 45000,
                discountAmount: 0,
                finalAmount: 45000,
                status: 'delivered',
                shippingAddress: {
                    street: 'вул. Шевченка, 1',
                    city: 'Київ',
                    postalCode: '01001',
                    country: 'Україна'
                },
                paymentMethod: 'credit_card',
                paymentStatus: 'completed',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                _id: new ObjectId(),
                userId: users.insertedIds[1],
                orderNumber: 'ORD-1002',
                items: [
                    {
                        productId: products.insertedIds[1],
                        name: 'Samsung Galaxy S23 Ultra',
                        price: 38000,
                        quantity: 1
                    }
                ],
                totalAmount: 38000,
                discountAmount: 0,
                finalAmount: 38000,
                status: 'shipped',
                shippingAddress: {
                    street: 'вул. Хрещатик, 10',
                    city: 'Київ',
                    postalCode: '01001',
                    country: 'Україна'
                },
                paymentMethod: 'paypal',
                paymentStatus: 'completed',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                _id: new ObjectId(),
                userId: users.insertedIds[2],
                orderNumber: 'ORD-1003',
                items: [
                    {
                        productId: products.insertedIds[2],
                        name: 'MacBook Pro M3',
                        price: 75000,
                        quantity: 1
                    }
                ],
                totalAmount: 75000,
                discountAmount: 5000,
                finalAmount: 70000,
                status: 'processing',
                shippingAddress: {
                    street: 'вул. Лисенка, 5',
                    city: 'Львів',
                    postalCode: '79000',
                    country: 'Україна'
                },
                paymentMethod: 'cash_on_delivery',
                paymentStatus: 'pending',
                promoCode: 'DISCOUNT10',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                _id: new ObjectId(),
                userId: users.insertedIds[3],
                orderNumber: 'ORD-1004',
                items: [
                    {
                        productId: products.insertedIds[3],
                        name: 'iPad Pro 12.9',
                        price: 35000,
                        quantity: 1
                    }
                ],
                totalAmount: 35000,
                discountAmount: 0,
                finalAmount: 35000,
                status: 'pending',
                shippingAddress: {
                    street: 'вул. Свободи, 15',
                    city: 'Харків',
                    postalCode: '61000',
                    country: 'Україна'
                },
                paymentMethod: 'credit_card',
                paymentStatus: 'completed',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                _id: new ObjectId(),
                userId: users.insertedIds[4],
                orderNumber: 'ORD-1005',
                items: [
                    {
                        productId: products.insertedIds[4],
                        name: 'Samsung QLED QN90C',
                        price: 45000,
                        quantity: 1
                    }
                ],
                totalAmount: 45000,
                discountAmount: 0,
                finalAmount: 45000,
                status: 'cancelled',
                shippingAddress: {
                    street: 'вул. Незалежності, 20',
                    city: 'Одеса',
                    postalCode: '65000',
                    country: 'Україна'
                },
                paymentMethod: 'paypal',
                paymentStatus: 'completed',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
        console.log('Колекція orders заповнена');

        // 6. Заповнення колекції promotions (5 записів)
        await db.collection('promotions').insertMany([
            {
                _id: new ObjectId(),
                code: 'DISCOUNT10',
                description: 'Знижка 10% на всі товари',
                discountType: 'percentage',
                discountValue: 10,
                startDate: new Date(),
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                usageLimit: 100,
                usedCount: 1,
                isActive: true
            },
            {
                _id: new ObjectId(),
                code: 'FREESHIP',
                description: 'Безкоштовна доставка',
                discountType: 'fixed',
                discountValue: 0,
                minOrderAmount: 1000,
                startDate: new Date(),
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                usageLimit: 200,
                usedCount: 5,
                isActive: true
            },
            {
                _id: new ObjectId(),
                code: 'SMARTPHONE20',
                description: 'Знижка 20% на смартфони',
                discountType: 'percentage',
                discountValue: 20,
                applicableCategories: [categories.insertedIds[0]],
                startDate: new Date(),
                endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
                usageLimit: 50,
                usedCount: 2,
                isActive: true
            },
            {
                _id: new ObjectId(),
                code: 'APPLE15',
                description: 'Знижка 15% на товари Apple',
                discountType: 'percentage',
                discountValue: 15,
                applicableCategories: [categories.insertedIds[0], categories.insertedIds[1], categories.insertedIds[2]],
                startDate: new Date(),
                endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                usageLimit: 30,
                usedCount: 1,
                isActive: true
            },
            {
                _id: new ObjectId(),
                code: 'NEWYEAR',
                description: 'Новорічна знижка',
                discountType: 'fixed',
                discountValue: 1000,
                minOrderAmount: 5000,
                startDate: new Date(),
                endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                usageLimit: 50,
                usedCount: 3,
                isActive: true
            }
        ]);
        console.log('Колекція promotions заповнена');

        // 7. Заповнення колекції shipping (5 записів)
        await db.collection('shipping').insertMany([
            {
                _id: new ObjectId(),
                name: 'Стандартна доставка',
                description: 'Доставка 3-5 днів',
                price: 100,
                freeShippingThreshold: 1000,
                estimatedDays: '3-5 днів',
                isActive: true,
                regions: ['Україна']
            },
            {
                _id: new ObjectId(),
                name: 'Експрес доставка',
                description: 'Доставка 1-2 дні',
                price: 300,
                freeShippingThreshold: 5000,
                estimatedDays: '1-2 дні',
                isActive: true,
                regions: ['Україна']
            },
            {
                _id: new ObjectId(),
                name: 'Кур\'єрська доставка',
                description: 'Доставка кур\'єром',
                price: 200,
                freeShippingThreshold: 3000,
                estimatedDays: '1-2 дні',
                isActive: true,
                regions: ['Київ', 'Львів', 'Харків']
            },
            {
                _id: new ObjectId(),
                name: 'Самовивіз',
                description: 'Самовивіз з магазину',
                price: 0,
                estimatedDays: '1 день',
                isActive: true,
                regions: ['Київ']
            },
            {
                _id: new ObjectId(),
                name: 'Міжнародна доставка',
                description: 'Доставка за кордон',
                price: 1000,
                estimatedDays: '7-14 днів',
                isActive: true,
                regions: ['США', 'Європа']
            }
        ]);
        console.log('Колекція shipping заповнена');

        console.log('\nБаза даних успішно заповнена тестовими даними!');
        console.log('Кількість записів в кожній колекції:');
        console.log('- categories: 5');
        console.log('- products: 5');
        console.log('- users: 5');
        console.log('- reviews: 5');
        console.log('- orders: 5');
        console.log('- promotions: 5');
        console.log('- shipping: 5');
    } catch (error) {
        console.error('Помилка при заповненні бази даних:', error);
    } finally {
        await client.close();
        console.log('З\'єднання з MongoDB закрите');
    }
}

// Виклик функції
populateDatabase().catch(console.error);
