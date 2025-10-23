const { MongoClient } = require('mongodb');
const uri = 'mongodb://127.0.0.1:27017/electronicsStore';
const client = new MongoClient(uri);

async function main() {
    try {
        await client.connect();
        const db = client.db();

        // Створення текстових індексів
        await createTextIndexes(db);

        // Виконання повнотекстових запитів
        await performTextSearches(db);

        // Аналіз ефективності запитів
        await analyzeQueryPerformance(db);

    } catch (error) {
        console.error('Помилка:', error);
    } finally {
        await client.close();
    }
}

// Створення текстових індексів
async function createTextIndexes(db) {
    try {
        // Текстовий індекс для колекції products
        await db.collection('products').createIndex(
            {
                name: 'text',
                description: 'text',
                brand: 'text',
                tags: 'text'
            },
            {
                weights: {
                    name: 10,
                    description: 5,
                    brand: 3,
                    tags: 1
                },
                name: 'products_text_index',
                default_language: 'english'
            }
        );

        // Текстовий індекс для колекції reviews
        await db.collection('reviews').createIndex(
            {
                title: 'text',
                comment: 'text',
                advantages: 'text',
                disadvantages: 'text'
            },
            {
                weights: {
                    title: 5,
                    comment: 3,
                    advantages: 2,
                    disadvantages: 2
                },
                name: 'reviews_text_index',
                default_language: 'english'
            }
        );
    } catch (error) {
        console.error('Помилка при створенні текстових індексів:', error);
        throw error;
    }
}

// Виконання повнотекстових запитів
async function performTextSearches(db) {
    // 1. Пошук за одним словом
    const smartphoneSearch = await db.collection('products').find(
        { $text: { $search: 'smartphone' } }
    ).toArray();
    console.log('Пошук за словом "smartphone":');
    console.log(`Знайдено ${smartphoneSearch.length} результатів`);

    // 2. Пошук за фразою
    const phraseSearch = await db.collection('products').find(
        { $text: { $search: '"high performance"' } }
    ).toArray();
    console.log('\nПошук за фразою "high performance":');
    console.log(`Знайдено ${phraseSearch.length} результатів`);

    // 3. Пошук з виключенням слів
    const excludeSearch = await db.collection('products').find(
        { $text: { $search: 'phone -cheap' } }
    ).toArray();
    console.log('\nПошук "phone" з виключенням "cheap":');
    console.log(`Знайдено ${excludeSearch.length} результатів`);

    // 4. Пошук за декількома термінами
    const brandSearch = await db.collection('products').find(
        { $text: { $search: 'apple samsung' } }
    ).toArray();
    console.log('\nПошук за словами "apple" або "samsung":');
    console.log(`Знайдено ${brandSearch.length} результатів`);

    // 5. Пошук у відгуках за "battery"
    const reviewsSearch = await db.collection('reviews').find(
        { $text: { $search: 'battery' } }
    ).toArray();
    console.log('\nПошук у відгуках за "battery":');
    console.log(`Знайдено ${reviewsSearch.length} результатів`);

    // 6. Пошук за тегами
    const tagSearch = await db.collection('products').find(
        { $text: { $search: 'premium' } }
    ).toArray();
    console.log('\nПошук за тегом "premium":');
    console.log(`Знайдено ${tagSearch.length} результатів`);
}

// Аналіз ефективності запитів
async function analyzeQueryPerformance(db) {
    // 1. Аналіз текстового пошуку
    const textSearchExplain = await db.collection('products')
        .find({ $text: { $search: 'apple' } })
        .explain('executionStats');

    console.log('\nАналіз текстового пошуку:');
    console.log(`Використаний індекс: ${textSearchExplain.queryPlanner.winningPlan.inputStage.indexName || 'немає'}`);
    console.log(`Тип сканування: ${textSearchExplain.queryPlanner.winningPlan.inputStage.stage}`);
    console.log(`Кількість переглянутих документів: ${textSearchExplain.executionStats.totalDocsExamined}`);
    console.log(`Кількість повернутих документів: ${textSearchExplain.executionStats.nReturned}`);
    console.log(`Час виконання (мс): ${textSearchExplain.executionStats.executionTimeMillis}`);

    // 2. Порівняння з неіндексовим пошуком
    const noIndexExplain = await db.collection('products')
        .find({ $or: [
            { name: /apple/i },
            { description: /apple/i }
        ] })
        .explain('executionStats');

    console.log('\nПорівняння з неіндексовим пошуком:');
    console.log(`Тип сканування: ${noIndexExplain.queryPlanner.winningPlan.inputStage.stage}`);
    console.log(`Кількість переглянутих документів: ${noIndexExplain.executionStats.totalDocsExamined}`);
    console.log(`Час виконання (мс): ${noIndexExplain.executionStats.executionTimeMillis}`);
}

// Виклик головної функції
main().catch(console.error);
