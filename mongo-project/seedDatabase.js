const { MongoClient, ObjectId } = require('mongodb');

const uri = 'mongodb://127.0.0.1:27017/electronicsStore';
const client = new MongoClient(uri);

async function seedDatabase() {
    try {
        await client.connect();
        console.log('Підключено до MongoDB для заповнення даними');

        const db = client.db();

        // ---------- Categories ----------
        const categories = await db.collection('categories').insertMany([
            { name: 'Smartphones', slug: 'smartphones', description: 'Latest phones', isActive: true },
            { name: 'Laptops', slug: 'laptops', description: 'Portable computers', isActive: true },
            { name: 'Accessories', slug: 'accessories', description: 'Tech accessories', isActive: true }
        ]);
        console.log('✅ Categories заповнені');

        // ---------- Products ----------
        const products = await db.collection('products').insertMany([
            {
                name: 'iPhone 15',
                sku: 'APL-IP15-256',
                categoryId: categories.insertedIds['0'],
                brand: 'Apple',
                price: 1200,
                oldPrice: 1300,
                stock: 15,
                specifications: { memory: '256GB', color: 'Black' },
                images: ['iphone15.jpg'],
                tags: ['apple', 'smartphone'],
                rating: { average: 4.8, count: 250 },
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Dell XPS 13',
                sku: 'DLL-XPS13-16GB',
                categoryId: categories.insertedIds['1'],
                brand: 'Dell',
                price: 1500,
                stock: 7,
                specifications: { ram: '16GB', cpu: 'Intel i7' },
                images: ['xps13.jpg'],
                tags: ['laptop', 'dell'],
                rating: { average: 4.5, count: 180 },
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
        console.log('✅ Products заповнені');

        // ---------- Users ----------
        const users = await db.collection('users').insertOne({
            email: 'john.doe@example.com',
            password: 'hashed_password',
            firstName: 'John',
            lastName: 'Doe',
            phone: '+380971234567',
            addresses: [
                {
                    type: 'home',
                    street: 'Shevchenka 10',
                    city: 'Kyiv',
                    postalCode: '01001',
                    country: 'Ukraine'
                }
            ],
            wishlist: [products.insertedIds['0']],
            cart: [
                {
                    productId: products.insertedIds['1'],
                    quantity: 1,
                    addedAt: new Date()
                }
            ],
            createdAt: new Date(),
            lastLogin: new Date()
        });
        console.log('✅ Users заповнені');

        // ---------- Orders ----------
        await db.collection('orders').insertOne({
            userId: users.insertedId,
            orderNumber: 'ORD-1001',
            items: [
                {
                    productId: products.insertedIds['0'],
                    name: 'iPhone 15',
                    price: 1200,
                    quantity: 1
                }
            ],
            totalAmount: 1200,
            discountAmount: 100,
            finalAmount: 1100,
            status: 'processing',
            shippingAddress: {
                street: 'Shevchenka 10',
                city: 'Kyiv',
                postalCode: '01001',
                country: 'Ukraine'
            },
            paymentMethod: 'credit_card',
            paymentStatus: 'completed',
            promoCode: 'WELCOME10',
            trackingNumber: 'TRACK12345',
            createdAt: new Date(),
            updatedAt: new Date()
        });
        console.log('✅ Orders заповнені');

        // ---------- Reviews ----------
        await db.collection('reviews').insertOne({
            productId: products.insertedIds['0'],
            userId: users.insertedId,
            rating: 5,
            title: 'Amazing phone',
            comment: 'Works super fast and camera is top-notch!',
            advantages: 'Speed, camera',
            disadvantages: 'Price',
            isVerified: true,
            createdAt: new Date(),
            helpful: 12,
            status: 'approved'
        });
        console.log('✅ Reviews заповнені');

        // ---------- Promotions ----------
        await db.collection('promotions').insertOne({
            code: 'WELCOME10',
            description: '10% off for new customers',
            discountType: 'percentage',
            discountValue: 10,
            minOrderAmount: 500,
            maxDiscountAmount: 200,
            startDate: new Date('2025-01-01'),
            endDate: new Date('2025-12-31'),
            usageLimit: 1000,
            usedCount: 10,
            isActive: true,
            applicableCategories: [categories.insertedIds['0'], categories.insertedIds['1']],
            applicableProducts: [products.insertedIds['0']]
        });
        console.log('✅ Promotions заповнені');

        // ---------- Shipping ----------
        await db.collection('shipping').insertMany([
            {
                name: 'Standard Shipping',
                description: 'Delivery within 5-7 days',
                price: 5,
                freeShippingThreshold: 100,
                estimatedDays: '5-7',
                isActive: true,
                regions: ['Ukraine', 'Poland']
            },
            {
                name: 'Express Shipping',
                description: 'Delivery within 1-2 days',
                price: 20,
                freeShippingThreshold: 500,
                estimatedDays: '1-2',
                isActive: true,
                regions: ['Ukraine']
            }
        ]);
        console.log('✅ Shipping заповнені');

        console.log('🎉 Усі колекції заповнені тестовими даними!');
    } catch (err) {
        console.error('Помилка при заповненні:', err);
    } finally {
        await client.close();
        console.log('З\'єднання закрите');
    }
}

seedDatabase();
