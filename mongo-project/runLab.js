const { MongoClient, ObjectId } = require('mongodb');

// !!! ВАЖЛИВО !!!
// Цей URI ПОВИНЕН вказувати на ваш набір реплік (Replica Set).
// Ви підтвердили, що ваше ім'я репліки 'rs0', тому цей рядок коректний.
const uri = 'mongodb://127.0.0.1:27017/electronicsStore?replicaSet=rs0';
const client = new MongoClient(uri);

/**
 * Функція для налаштування та запуску прослуховувача потоку змін.
 * @param {Db} db - Об'єкт бази даних MongoDB.
 * @returns {ChangeStream} - Повертає екземпляр потоку змін
 */
async function setupChangeStream(db) {
    console.log("Налаштування потоку змін для колекції 'products'...");
    
    // Обираємо колекцію
    const collection = db.collection('products');
    
    // Ми також додамо 'fullDocument: "updateLookup"'
    // щоб бачити повний документ *після* оновлення.
    const changeStream = collection.watch([], { fullDocument: "updateLookup" });

    // Обробляємо подію 'change'
    changeStream.on('change', (change) => {
        console.log('\n--- Зфіксовано Зміну! ---');
        
        // Аналізуємо тип операції
        switch (change.operationType) {
            case 'insert':
                console.log('Тип операції: insert');
                console.log('Вставлений документ:', change.fullDocument);
                break;
            case 'update':
                console.log('Тип операції: update');
                console.log('ID документа:', change.documentKey._id);
                console.log('Оновлені поля:', change.updateDescription.updatedFields);
                console.log('Повний документ ПІСЛЯ оновлення:', change.fullDocument);
                break;
            case 'delete':
                console.log('Тип операції: delete');
                console.log('ID видаленого документа:', change.documentKey._id);
                break;
            default:
                console.log(`Інша операція: ${change.operationType}`);
        }
        console.log('------------------------------');
    });

    changeStream.on('error', (error) => {
        // Ми перевіримо, чи це "очікувана" помилка при закритті
        if (error.codeName !== 'Interrupted' && error.constructor.name !== 'MongoClientClosedError') {
            console.error('Помилка в потоці змін:', error);
        }
    });

    console.log("Потік змін активний. Очікування операцій...");
    
    // === ЗМІНА 1: Повертаємо потік ===
    return changeStream; 
}

/**
 * Функція, що виконує операції CUD (Create, Update, Delete)
 * @param {Db} db - Об'єкт бази даних MongoDB.
 */
async function performOperations(db) {
    const collection = db.collection('products');
    let insertedId;

    try {
        // Затримка, щоб слухач встиг ініціалізуватися
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log("\n--- Виконання операцій ---");

        // Відстежити подію insert
        console.log("\n1. Виконання INSERT...");
        // Використовуємо ObjectId з вашого коду для сумісності
        const mockCategoryId = new ObjectId(); 
        
        const insertResult = await collection.insertOne({
            name: "Magic Mouse",
            sku: "MM-001",
            categoryId: mockCategoryId, 
            price: 79.99,
            stock: 150,
            brand: "Apple",
            isActive: true,
            createdAt: new Date()
        });
        insertedId = insertResult.insertedId;
        console.log(`Документ вставлено з ID: ${insertedId}`);
        await new Promise(resolve => setTimeout(resolve, 1500)); // Пауза для наочності

        // Відстежити подію update
        console.log("\n2. Виконання UPDATE...");
        await collection.updateOne(
            { _id: insertedId },
            { 
                $set: { price: 74.99, stock: 149 },
                $currentDate: { updatedAt: true }
            }
        );
        console.log("Документ оновлено.");
        await new Promise(resolve => setTimeout(resolve, 1500)); // Пауза для наочності

        // Відстежити подію delete
        console.log("\n3. Виконання DELETE...");
        await collection.deleteOne({ _id: insertedId });
        console.log("Документ видалено.");

    } catch (error) {
        // Перевірка на помилку валідації
        if (error.code === 121) {
            console.error(
                '\n--- ПОМИЛКА ВАЛІДАЦІЇ ---' +
                '\nНе вдалося вставити документ. Переконайтеся, що у вашому ' +
                'тестовому документі (Magic Mouse) є всі *required* поля,' +
                '\nвизначені у валідаторі колекції `products`.' +
                '\nПоточна помилка:', error.errInfo.details
            );
        } else {
            console.error("Помилка під час виконання операцій:", error);
        }
    }
}

/**
 * Головна функція
 */
async function main() {
    // === ЗМІНА 2: Оголошуємо змінну для потоку ===
    let changeStreamInstance = null; 

    try {
        await client.connect();
        console.log('Підключено до MongoDB (Replica Set: rs0)');
        const db = client.db('electronicsStore'); // Явно вказуємо БД

        // === ЗМІНА 3: Зберігаємо екземпляр потоку ===
        // Запускаємо прослуховувач
        changeStreamInstance = await setupChangeStream(db);

        // Виконуємо операції
        await performOperations(db);
        
        // Дамо час потоку обробити останню подію перед закриттям
        console.log("\nЗавершення... Очікуємо 3 секунди і закриваємо з'єднання.");
        await new Promise(resolve => setTimeout(resolve, 3000));

    } catch (error) {
        if (error.codeName === 'FailedToSatisfyReadPreference') {
            console.error(
                '\n--- ПОМИЛКА: Не вдалося підключитися. ---' +
                '\nПереконайтеся, що ваш MongoDB запущено як НАБІР РЕПЛІК (Replica Set)' +
                '\nі що ваш URI містить `?replicaSet=rs0`'
            );
        } else {
            console.error('Виникла непередбачувана помилка:', error);
        }
    } finally {
        // === ЗМІНА 4: "Граціозне" закриття ===
        console.log("\nЗакриття ресурсів...");
        if (changeStreamInstance) {
            await changeStreamInstance.close();
            console.log('Потік змін успішно закрито.');
        }
        await client.close();
        console.log('З\'єднання з MongoDB закрито.');
    }
}

// Запуск
main().catch(console.error);