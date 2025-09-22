const productRepository = require('./productRepository');
const userRepository = require('./userRepository');
const { ObjectId } = require('mongodb');

async function demonstrateCRUD() {
    console.log('=== ДЕМОНСТРАЦІЯ CRUD ОПЕРАЦІЙ ===\n');

    // CREATE - Створення нового продукту
    console.log('1. CREATE - Створення нового продукту:');
    const newProduct = {
        name: 'Samsung Galaxy S22 Ultra',
        description: 'Флагманський смартфон з S-Pen',
        sku: 'SAMSUNG-GS22U',
        categoryId: new ObjectId(), // Використовуємо випадковий ID для прикладу
        brand: 'Samsung',
        price: 35999,
        stock: 8,
        isActive: true
    };

    const createResult = await productRepository.create(newProduct);
    console.log('Результат створення:', createResult);

    // READ - Читання продукту за ID
    console.log('\n2. READ - Читання продукту за ID:');
    if (createResult.success) {
        const readResult = await productRepository.findById(createResult.insertedId);
        console.log('Результат читання:', readResult);
    }

    // UPDATE - Оновлення продукту
    console.log('\n3. UPDATE - Оновлення ціни продукту:');
    if (createResult.success) {
        const updateResult = await productRepository.update(createResult.insertedId, {
            price: 33999,
            oldPrice: 35999
        });
        console.log('Результат оновлення:', updateResult);
    }

    // Демонстрація пагінації
    console.log('\n4. ПАГІНАЦІЯ - Отримання продуктів з сортуванням:');
    await demonstratePagination();

    // DELETE - Видалення продукту
    console.log('\n5. DELETE - Видалення продукту:');
    if (createResult.success) {
        const deleteResult = await productRepository.delete(createResult.insertedId);
        console.log('Результат видалення:', deleteResult);
    }
}

async function demonstratePagination() {
    console.log('\n=== ДЕМОНСТРАЦІЯ ПАГІНАЦІЇ ===');

    // Пагінація з сортуванням за ціною (спадання)
    console.log('\n1. Пагінація з сортуванням за ціною (спадання):');
    const page1 = await productRepository.paginate(
        { isActive: true }, // фільтр
        1,                  // сторінка
        3,                  // кількість на сторінці
        { price: -1 }       // сортування
    );

    if (page1.success) {
        console.log(`Сторінка ${page1.pagination.current} з ${page1.pagination.pages}`);
        console.log(`Всього продуктів: ${page1.pagination.total}`);
        console.log('Продукти:');
        page1.data.forEach((product, index) => {
            console.log(`${index + 1}. ${product.name} - ${product.price} грн`);
        });
    }

    // Пагінація з сортуванням за назвою (алфавітний порядок)
    console.log('\n2. Пагінація з сортуванням за назвою (алфавітний порядок):');
    const page2 = await productRepository.paginate(
        { isActive: true },
        1,
        2,
        { name: 1 }
    );

    if (page2.success) {
        console.log('Продукти в алфавітному порядку:');
        page2.data.forEach((product, index) => {
            console.log(`${index + 1}. ${product.name}`);
        });
    }

    // Демонстрація роботи з різними сторінками
    console.log('\n3. Навігація по сторінках:');
    const allProducts = await productRepository.paginate(
        { isActive: true },
        1,
        2 // 2 продукти на сторінці для демонстрації
    );

    if (allProducts.success && allProducts.pagination.pages > 1) {
        console.log(`Всього сторінок: ${allProducts.pagination.pages}`);
        
        for (let page = 1; page <= Math.min(allProducts.pagination.pages, 3); page++) {
            const pageResult = await productRepository.paginate(
                { isActive: true },
                page,
                2
            );
            
            if (pageResult.success) {
                console.log(`\nСторінка ${page}:`);
                pageResult.data.forEach((product, index) => {
                    console.log(`  ${index + 1}. ${product.name}`);
                });
            }
        }
    }

    // Спеціалізовані методи пагінації
    console.log('\n4. Спеціалізована пагінація (топ продукти):');
    const topProducts = await productRepository.getTopRatedProducts(1, 3);
    if (topProducts.success) {
        console.log('Топ продукти:');
        topProducts.data.forEach((product, index) => {
            console.log(`${index + 1}. ${product.name}`);
        });
    }
}

async function demonstrateAdvancedPagination() {
    console.log('\n=== РОЗШИРЕНА ДЕМОНСТРАЦІЯ ПАГІНАЦІЇ ===');

    // Використання методів .sort(), .skip(), .limit() напряму
    console.log('\n1. Використання .sort(), .skip(), .limit() напряму:');
    const directPagination = await productRepository.findAll(
        { isActive: true },
        {
            sort: { price: -1 },
            skip: 0,
            limit: 3
        }
    );

    if (directPagination.success) {
        console.log(`Знайдено ${directPagination.data.length} продуктів:`);
        directPagination.data.forEach((product, index) => {
            console.log(`${index + 1}. ${product.name} - ${product.price} грн`);
        });
    }

    // Пагінація з складним фільтром
    console.log('\n2. Пагінація з фільтром за ціною:');
    const priceFiltered = await productRepository.paginate(
        { 
            isActive: true,
            price: { $gte: 20000, $lte: 50000 }
        },
        1,
        5,
        { price: 1 }
    );

    if (priceFiltered.success) {
        console.log(`Продукти в діапазоні 20000-50000 грн: ${priceFiltered.pagination.total} знайдено`);
        priceFiltered.data.forEach((product, index) => {
            console.log(`${index + 1}. ${product.name} - ${product.price} грн`);
        });
    }
}

// Головна функція демонстрації
async function main() {
    try {
        await demonstrateCRUD();
        await demonstratePagination();
        await demonstrateAdvancedPagination();
        
        console.log('\n=== ДЕМОНСТРАЦІЯ ЗАВЕРШЕНА ===');
    } catch (error) {
        console.error('Помилка демонстрації:', error);
    }
}

// Експортуємо функції для використання в інших файлах
module.exports = {
    demonstrateCRUD,
    demonstratePagination,
    demonstrateAdvancedPagination,
    main
};

// Якщо файл запускається напряму
if (require.main === module) {
    main().catch(console.error);
}