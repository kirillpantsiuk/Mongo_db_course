const dbConnection = require('./dbConnection');
const { demonstrateCRUD, demonstratePagination, main } = require('./demoCrudAndPagination');

async function runDemo() {
    try {
        // Підключення до БД
        await dbConnection.connect();
        
        // Перевірка стану з'єднання
        const isHealthy = await dbConnection.healthCheck();
        console.log('Статус БД:', isHealthy ? 'Здорова' : 'Проблеми');
        console.log('=========================================\n');

        // Запуск демонстрації
        await main();

    } catch (error) {
        console.error('Помилка:', error);
    } finally {
        // Закриття з'єднання
        await dbConnection.disconnect();
        console.log('\nЗ\'єднання з MongoDB закрите');
    }
}

// Обробка невідловлених помилок
process.on('unhandledRejection', (err) => {
    console.error('Необроблена помилка:', err);
    process.exit(1);
});

// Запуск додатка
runDemo().catch(console.error);