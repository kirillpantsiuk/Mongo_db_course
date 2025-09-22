const dbConnection = require('./dbConnection');
const productRepository = require('./productRepository');
const userRepository = require('./userRepository');
const { ObjectId } = require('mongodb');

async function main() {
    try {
        // Підключення до БД
        await dbConnection.connect();
        
        // Перевірка стану з'єднання
        const isHealthy = await dbConnection.healthCheck();
        console.log('Статус БД:', isHealthy ? 'Здорова' : 'Проблеми');

        // Приклад використання CRUD
        const newProductId = await productRepository.create({
            name: "Новий продукт",
            sku: "SKU12345",
            categoryId: new ObjectId("507f1f77bcf86cd799439011"),
            price: 299.99,
            stock: 50,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        console.log('Створено продукт з ID:', newProductId);

        // Приклад пагінації
        const firstPage = await productRepository.paginate(
            { isActive: true },
            1,
            10,
            { price: -1 }
        );

        console.log('Перша сторінка продуктів:');
        console.log('Кількість продуктів:', firstPage.pagination.total);
        console.log('Поточна сторінка:', firstPage.pagination.current);
        console.log('Всього сторінок:', firstPage.pagination.pages);
        console.log('Дані:', firstPage.data);

        // Приклад пошуку продуктів
        const searchResults = await productRepository.searchProducts('apple', 1, 5);
        console.log('\nРезультати пошуку "apple":');
        console.log('Знайдено продуктів:', searchResults.pagination.total);
        console.log('Дані:', searchResults.data);

        // Приклад роботи з користувачами
        const user = await userRepository.findByEmail('user1@example.com');
        if (user) {
            console.log('\nЗнайдено користувача:');
            console.log('Ім\'я:', user.firstName);
            console.log('Email:', user.email);
            
            // Оновлення останнього входу
            await userRepository.updateLastLogin(user._id);
            console.log('Останній вхід оновлено');
        }

    } catch (error) {
        console.error('Помилка:', error);
    } finally {
        // Закриття з'єднання
        await dbConnection.disconnect();
    }
}

// Обробка невідловлених помилок
process.on('unhandledRejection', (err) => {
    console.error('Необроблена помилка:', err);
    process.exit(1);
});

// Запуск додатка
main();