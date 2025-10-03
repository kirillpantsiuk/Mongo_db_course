// PopulateDatabase.js
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

        // Створення категорій
        const categories = await db.collection('categories').insertMany([
            {
                name: 'Смартфони',
                slug: 'smartphones',
                description: 'Сучасні смартфони від провідних виробників',
                isActive: true
            },
            {
                name: 'Ноутбуки',
                slug: 'laptops',
                description: 'Ноутбуки для роботи та ігор',
                isActive: true
            },
            {
                name: 'Телевізори',
                slug: 'tvs',
                description: 'Телевізори з LED та OLED екранами',
                isActive: true
            },
            {
                name: 'Аксесуари',
                slug: 'accessories',
                description: 'Аксесуари для електроніки',
                isActive: true
            },
            {
                name: 'Планшети',
                slug: 'tablets',
                description: 'Планшети для роботи та розваг',
                isActive: true
            },
            {
                name: 'Аудіотехніка',
                slug: 'audio',
                description: 'Навушники, колонки та інша аудіотехніка',
                isActive: true
            }
        ]);

        // Створення продуктів
        const products = await db.collection('products').insertMany([
            // Смартфони
            {
                name: 'iPhone 13 Pro',
                description: 'Флагманський смартфон від Apple з A15 Bionic чіпом',
                sku: 'IPH13PRO',
                categoryId: categories.insertedIds[0],
                brand: 'Apple',
                price: 32999,
                oldPrice: 34999,
                stock: 15,
                tags: ['premium', 'smartphone', 'ios'],
                isActive: true,
                createdAt: new Date('2023-01-10'),
                updatedAt: new Date('2023-01-15')
            },
            {
                name: 'iPhone 13',
                description: 'Смартфон від Apple з A15 Bionic чіпом',
                sku: 'IPH13',
                categoryId: categories.insertedIds[0],
                brand: 'Apple',
                price: 24999,
                oldPrice: 26999,
                stock: 25,
                tags: ['smartphone', 'ios'],
                isActive: true,
                createdAt: new Date('2023-01-10'),
                updatedAt: new Date('2023-01-15')
            },
            {
                name: 'Samsung Galaxy S22 Ultra',
                description: 'Флагманський смартфон від Samsung з S Pen',
                sku: 'SAMS22U',
                categoryId: categories.insertedIds[0],
                brand: 'Samsung',
                price: 34999,
                oldPrice: 36999,
                stock: 10,
                tags: ['android', 'smartphone', 'premium'],
                isActive: true,
                createdAt: new Date('2023-01-12'),
                updatedAt: new Date('2023-01-18')
            },
            {
                name: 'Samsung Galaxy S22',
                description: 'Потужний смартфон від Samsung',
                sku: 'SAMS22',
                categoryId: categories.insertedIds[0],
                brand: 'Samsung',
                price: 24999,
                oldPrice: 26999,
                stock: 20,
                tags: ['android', 'smartphone'],
                isActive: true,
                createdAt: new Date('2023-01-12'),
                updatedAt: new Date('2023-01-18')
            },
            {
                name: 'Xiaomi Redmi Note 11',
                description: 'Бюджетний смартфон з хорошими характеристиками',
                sku: 'XIAOMI11',
                categoryId: categories.insertedIds[0],
                brand: 'Xiaomi',
                price: 6999,
                oldPrice: 7499,
                stock: 30,
                tags: ['android', 'smartphone', 'budget'],
                isActive: true,
                createdAt: new Date('2023-01-14'),
                updatedAt: new Date('2023-01-20')
            },

            // Ноутбуки
            {
                name: 'MacBook Pro 14',
                description: 'Потужний ноутбук від Apple з M1 Pro чіпом',
                sku: 'MBP14',
                categoryId: categories.insertedIds[1],
                brand: 'Apple',
                price: 49999,
                oldPrice: 52999,
                stock: 8,
                tags: ['laptop', 'premium'],
                isActive: true,
                createdAt: new Date('2023-01-05'),
                updatedAt: new Date('2023-01-10')
            },
            {
                name: 'MacBook Air M1',
                description: 'Легкий ноутбук від Apple з M1 чіпом',
                sku: 'MBAIRM1',
                categoryId: categories.insertedIds[1],
                brand: 'Apple',
                price: 29999,
                oldPrice: 31999,
                stock: 12,
                tags: ['laptop', 'ultrabook'],
                isActive: true,
                createdAt: new Date('2023-01-05'),
                updatedAt: new Date('2023-01-10')
            },
            {
                name: 'Dell XPS 15',
                description: 'Потужний ноутбук для роботи та ігор',
                sku: 'DELLXPS15',
                categoryId: categories.insertedIds[1],
                brand: 'Dell',
                price: 39999,
                oldPrice: 42999,
                stock: 5,
                tags: ['laptop', 'gaming'],
                isActive: true,
                createdAt: new Date('2023-01-08'),
                updatedAt: new Date('2023-01-12')
            },

            // Телевізори
            {
                name: 'Samsung QLED TV 55"',
                description: 'Телевізор з QLED екраном та 4K роздільною здатністю',
                sku: 'SAMQLED55',
                categoryId: categories.insertedIds[2],
                brand: 'Samsung',
                price: 24999,
                oldPrice: 26999,
                stock: 6,
                tags: ['tv', 'qled', '4k'],
                isActive: true,
                createdAt: new Date('2023-01-03'),
                updatedAt: new Date('2023-01-08')
            },
            {
                name: 'LG OLED TV 55"',
                description: 'Телевізор з OLED екраном та 4K роздільною здатністю',
                sku: 'LGOLED55',
                categoryId: categories.insertedIds[2],
                brand: 'LG',
                price: 29999,
                oldPrice: 31999,
                stock: 4,
                tags: ['tv', 'oled', '4k'],
                isActive: true,
                createdAt: new Date('2023-01-03'),
                updatedAt: new Date('2023-01-08')
            },

            // Аксесуари
            {
                name: 'AirPods Pro',
                description: 'Бездротові навушники від Apple з шумозаглушенням',
                sku: 'AIRPODSPRO',
                categoryId: categories.insertedIds[3],
                brand: 'Apple',
                price: 7999,
                oldPrice: 8499,
                stock: 15,
                tags: ['headphones', 'wireless'],
                isActive: true,
                createdAt: new Date('2023-01-10'),
                updatedAt: new Date('2023-01-15')
            },
            {
                name: 'Samsung Galaxy Watch 4',
                description: 'Розумний годинник від Samsung',
                sku: 'GALAXYW4',
                categoryId: categories.insertedIds[3],
                brand: 'Samsung',
                price: 4999,
                oldPrice: 5499,
                stock: 10,
                tags: ['smartwatch', 'wearables'],
                isActive: true,
                createdAt: new Date('2023-01-12'),
                updatedAt: new Date('2023-01-18')
            }
        ]);

        // Створення користувачів
        const users = await db.collection('users').insertMany([
            {
                email: 'user1@example.com',
                password: 'password1',
                firstName: 'Іван',
                lastName: 'Петренко',
                phone: '0971234567',
                addresses: [
                    {
                        type: 'home',
                        street: 'вул. Шевченка, 1',
                        city: 'Київ',
                        postalCode: '01001',
                        country: 'Україна'
                    },
                    {
                        type: 'work',
                        street: 'вул. Хрещатик, 10',
                        city: 'Київ',
                        postalCode: '01001',
                        country: 'Україна'
                    }
                ],
                wishlist: [products.insertedIds[0], products.insertedIds[4]],
                cart: [
                    {
                        productId: products.insertedIds[1],
                        quantity: 1,
                        addedAt: new Date('2023-02-01')
                    }
                ],
                createdAt: new Date('2022-12-01'),
                lastLogin: new Date('2023-02-15')
            },
            {
                email: 'user2@example.com',
                password: 'password2',
                firstName: 'Марія',
                lastName: 'Сидоренко',
                phone: '0987654321',
                addresses: [
                    {
                        type: 'home',
                        street: 'вул. Лесі Українки, 10',
                        city: 'Львів',
                        postalCode: '79000',
                        country: 'Україна'
                    }
                ],
                wishlist: [products.insertedIds[2], products.insertedIds[5]],
                createdAt: new Date('2022-11-15'),
                lastLogin: new Date('2023-02-10')
            },
            {
                email: 'user3@example.com',
                password: 'password3',
                firstName: 'Олег',
                lastName: 'Коваленко',
                phone: '0961234567',
                addresses: [
                    {
                        type: 'home',
                        street: 'вул. Соборна, 5',
                        city: 'Дніпро',
                        postalCode: '49000',
                        country: 'Україна'
                    }
                ],
                createdAt: new Date('2023-01-05'),
                lastLogin: new Date('2023-02-12')
            },
            {
                email: 'user4@example.com',
                password: 'password4',
                firstName: 'Анна',
                lastName: 'Іваненко',
                phone: '0957654321',
                addresses: [
                    {
                        type: 'home',
                        street: 'вул. Незалежності, 20',
                        city: 'Харків',
                        postalCode: '61000',
                        country: 'Україна'
                    }
                ],
                createdAt: new Date('2023-01-10'),
                lastLogin: new Date('2023-02-14')
            },
            {
                email: 'user5@example.com',
                password: 'password5',
                firstName: 'Андрій',
                lastName: 'Мороз',
                phone: '0991234567',
                addresses: [
                    {
                        type: 'home',
                        street: 'вул. Франка, 15',
                        city: 'Одеса',
                        postalCode: '65000',
                        country: 'Україна'
                    }
                ],
                createdAt: new Date('2023-01-15'),
                lastLogin: new Date('2023-02-13')
            }
        ]);

        // Створення замовлень
        const orders = await db.collection('orders').insertMany([
            // Замовлення для user1
            {
                userId: users.insertedIds[0],
                orderNumber: 'ORD001',
                items: [
                    {
                        productId: products.insertedIds[0],
                        name: 'iPhone 13 Pro',
                        price: 32999,
                        quantity: 1
                    }
                ],
                totalAmount: 32999,
                discountAmount: 0,
                finalAmount: 32999,
                status: 'delivered',
                shippingAddress: {
                    street: 'вул. Шевченка, 1',
                    city: 'Київ',
                    postalCode: '01001',
                    country: 'Україна'
                },
                paymentMethod: 'credit_card',
                paymentStatus: 'completed',
                createdAt: new Date('2023-01-20'),
                updatedAt: new Date('2023-01-25')
            },
            {
                userId: users.insertedIds[0],
                orderNumber: 'ORD005',
                items: [
                    {
                        productId: products.insertedIds[9],
                        name: 'AirPods Pro',
                        price: 7999,
                        quantity: 1
                    }
                ],
                totalAmount: 7999,
                discountAmount: 0,
                finalAmount: 7999,
                status: 'delivered',
                shippingAddress: {
                    street: 'вул. Шевченка, 1',
                    city: 'Київ',
                    postalCode: '01001',
                    country: 'Україна'
                },
                paymentMethod: 'credit_card',
                paymentStatus: 'completed',
                createdAt: new Date('2023-02-01'),
                updatedAt: new Date('2023-02-05')
            },

            // Замовлення для user2
            {
                userId: users.insertedIds[1],
                orderNumber: 'ORD002',
                items: [
                    {
                        productId: products.insertedIds[1],
                        name: 'iPhone 13',
                        price: 24999,
                        quantity: 1
                    },
                    {
                        productId: products.insertedIds[2],
                        name: 'Samsung Galaxy S22 Ultra',
                        price: 34999,
                        quantity: 1
                    }
                ],
                totalAmount: 59998,
                discountAmount: 2000,
                finalAmount: 57998,
                status: 'shipped',
                shippingAddress: {
                    street: 'вул. Лесі Українки, 10',
                    city: 'Львів',
                    postalCode: '79000',
                    country: 'Україна'
                },
                paymentMethod: 'paypal',
                paymentStatus: 'completed',
                promoCode: 'SAVE2000',
                createdAt: new Date('2023-01-18'),
                updatedAt: new Date('2023-01-22')
            },

            // Замовлення для user3
            {
                userId: users.insertedIds[2],
                orderNumber: 'ORD003',
                items: [
                    {
                        productId: products.insertedIds[3],
                        name: 'Xiaomi Redmi Note 11',
                        price: 6999,
                        quantity: 2
                    },
                    {
                        productId: products.insertedIds[8],
                        name: 'Samsung Galaxy Watch 4',
                        price: 4999,
                        quantity: 1
                    }
                ],
                totalAmount: 18997,
                discountAmount: 0,
                finalAmount: 18997,
                status: 'processing',
                shippingAddress: {
                    street: 'вул. Соборна, 5',
                    city: 'Дніпро',
                    postalCode: '49000',
                    country: 'Україна'
                },
                paymentMethod: 'cash_on_delivery',
                paymentStatus: 'pending',
                createdAt: new Date('2023-01-22'),
                updatedAt: new Date('2023-01-23')
            },

            // Замовлення для user4
            {
                userId: users.insertedIds[3],
                orderNumber: 'ORD004',
                items: [
                    {
                        productId: products.insertedIds[5],
                        name: 'MacBook Air M1',
                        price: 29999,
                        quantity: 1
                    }
                ],
                totalAmount: 29999,
                discountAmount: 1000,
                finalAmount: 28999,
                status: 'delivered',
                shippingAddress: {
                    street: 'вул. Незалежності, 20',
                    city: 'Харків',
                    postalCode: '61000',
                    country: 'Україна'
                },
                paymentMethod: 'credit_card',
                paymentStatus: 'completed',
                promoCode: 'WELCOME1000',
                createdAt: new Date('2023-01-25'),
                updatedAt: new Date('2023-01-30')
            },

            // Замовлення для user5
            {
                userId: users.insertedIds[4],
                orderNumber: 'ORD006',
                items: [
                    {
                        productId: products.insertedIds[4],
                        name: 'MacBook Pro 14',
                        price: 49999,
                        quantity: 1
                    },
                    {
                        productId: products.insertedIds[7],
                        name: 'LG OLED TV 55"',
                        price: 29999,
                        quantity: 1
                    }
                ],
                totalAmount: 79998,
                discountAmount: 3000,
                finalAmount: 76998,
                status: 'pending',
                shippingAddress: {
                    street: 'вул. Франка, 15',
                    city: 'Одеса',
                    postalCode: '65000',
                    country: 'Україна'
                },
                paymentMethod: 'paypal',
                paymentStatus: 'pending',
                promoCode: 'BIGSALE',
                createdAt: new Date('2023-02-10'),
                updatedAt: new Date('2023-02-10')
            }
        ]);

        // Створення відгуків
        await db.collection('reviews').insertMany([
            // Відгуки для iPhone 13 Pro
            {
                productId: products.insertedIds[0],
                userId: users.insertedIds[0],
                rating: 5,
                title: 'Чудовий телефон',
                comment: 'Дуже задоволений покупкою. Висока продуктивність і якісний екран.',
                advantages: 'Швидкий, якісний екран, хороша камера',
                disadvantages: 'Висока ціна',
                isVerified: true,
                createdAt: new Date('2023-01-28'),
                helpful: 15,
                status: 'approved'
            },
            {
                productId: products.insertedIds[0],
                userId: users.insertedIds[3],
                rating: 4,
                title: 'Відмінний телефон',
                comment: 'Дуже хороший телефон, але батерея могла б бути краще.',
                advantages: 'Потужний процесор, якісний екран',
                disadvantages: 'Середній час роботи від батареї',
                isVerified: true,
                createdAt: new Date('2023-02-05'),
                helpful: 8,
                status: 'approved'
            },

            // Відгуки для Samsung Galaxy S22
            {
                productId: products.insertedIds[1],
                userId: users.insertedIds[1],
                rating: 4,
                title: 'Хороший телефон',
                comment: 'Загалом задоволена, але батерея могла б бути краще.',
                advantages: 'Хороша камера, швидкий',
                disadvantages: 'Середній час роботи від батареї',
                isVerified: true,
                createdAt: new Date('2023-01-25'),
                helpful: 12,
                status: 'approved'
            },

            // Відгуки для MacBook Pro 14
            {
                productId: products.insertedIds[4],
                userId: users.insertedIds[4],
                rating: 5,
                title: 'Неймовірний ноутбук',
                comment: 'Неймовірна продуктивність і якісний екран.',
                advantages: 'Потужний, легкий, хороший екран',
                disadvantages: 'Дорогий',
                isVerified: true,
                createdAt: new Date('2023-02-12'),
                helpful: 20,
                status: 'approved'
            },

            // Відгуки для Samsung Galaxy S22 Ultra
            {
                productId: products.insertedIds[2],
                userId: users.insertedIds[2],
                rating: 5,
                title: 'Фантастичний телефон',
                comment: 'Найкращий телефон, який я коли-небудь мав.',
                advantages: 'Відмінна камера, S Pen, потужний',
                disadvantages: 'Дорогий',
                isVerified: true,
                createdAt: new Date('2023-02-01'),
                helpful: 18,
                status: 'approved'
            }
        ]);

        // Створення промокодів
        await db.collection('promotions').insertMany([
            {
                code: 'SAVE2000',
                description: 'Знижка 2000 гривень на замовлення від 50000 гривень',
                discountType: 'fixed',
                discountValue: 2000,
                minOrderAmount: 50000,
                startDate: new Date('2023-01-01'),
                endDate: new Date('2023-03-31'),
                usageLimit: 100,
                usedCount: 2,
                isActive: true
            },
            {
                code: 'WELCOME1000',
                description: 'Знижка 1000 гривень для нових клієнтів',
                discountType: 'fixed',
                discountValue: 1000,
                minOrderAmount: 10000,
                startDate: new Date('2023-01-01'),
                endDate: new Date('2023-02-28'),
                usageLimit: 50,
                usedCount: 1,
                isActive: true
            },
            {
                code: 'BIGSALE',
                description: 'Знижка 3000 гривень на замовлення від 70000 гривень',
                discountType: 'fixed',
                discountValue: 3000,
                minOrderAmount: 70000,
                startDate: new Date('2023-02-01'),
                endDate: new Date('2023-02-28'),
                usageLimit: 20,
                usedCount: 1,
                isActive: true
            }
        ]);

        // Створення методів доставки
        await db.collection('shipping').insertMany([
            {
                name: 'Стандартна доставка',
                description: 'Доставка протягом 3-5 днів',
                price: 100,
                freeShippingThreshold: 10000,
                estimatedDays: '3-5 днів',
                isActive: true,
                regions: ['Україна']
            },
            {
                name: 'Експрес доставка',
                description: 'Доставка протягом 1-2 днів',
                price: 250,
                freeShippingThreshold: 0,
                estimatedDays: '1-2 дні',
                isActive: true,
                regions: ['Україна']
            },
            {
                name: 'Самовивіз',
                description: 'Самовивіз з магазину',
                price: 0,
                freeShippingThreshold: 0,
                estimatedDays: '1 день',
                isActive: true,
                regions: ['Київ', 'Львів', 'Дніпро', 'Харків', 'Одеса']
            }
        ]);

        console.log('База даних успішно заповнена тестовими даними!');
    } catch (error) {
        console.error('Помилка при заповненні бази даних:', error);
    } finally {
        await client.close();
        console.log('З\'єднання з MongoDB закрите');
    }
}

populateDatabase().catch(console.error);
