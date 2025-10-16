const { MongoClient, ObjectId } = require('mongodb');
const uri = 'mongodb://127.0.0.1:27017/electronicsStore';

const productRepository = require('./productRepository');
const userRepository = require('./userRepository');
const orderRepository = require('./orderRepository');

// === ОСНОВНА ФУНКЦІЯ ТРАНЗАКЦІЇ ===
async function createOrderWithTransaction(userId, productId, quantity) {
  const client = new MongoClient(uri, {
    writeConcern: { w: "majority" },
    readConcern: { level: "snapshot" },
  });

  try {
    await client.connect();
    const db = client.db();
    const session = client.startSession();

    try {
      // === ПОЧАТОК ТРАНЗАКЦІЇ ===
      session.startTransaction();

      // === READ: Отримання продукту (всередині транзакції) ===
      const product = await db.collection('products').findOne(
        { _id: new ObjectId(productId) },
        { session }
      );

      if (!product || product.stock < quantity) {
        throw new Error('Недостатньо товару на складі');
      }

      const initialStock = product.stock; // зберігаємо початкову кількість

      // === READ: Отримання користувача (всередині транзакції) ===
      const user = await db.collection('users').findOne(
        { _id: new ObjectId(userId) },
        { session }
      );

      if (!user) {
        throw new Error('Користувача не знайдено');
      }

      // === CREATE: Створення замовлення (всередині транзакції) ===
      const orderResult = await orderRepository.createOrder(
        db,
        userId,
        product,
        quantity,
        session
      );

      // === UPDATE: Зменшення запасу товару (всередині транзакції) ===
      const updateResult = await db.collection('products').updateOne(
        { _id: new ObjectId(productId) },
        { $inc: { stock: -quantity } },
        { session }
      );

      if (updateResult.modifiedCount === 0) {
        throw new Error('Не вдалося оновити запас товару');
      }

      // === ПІДТВЕРДЖЕННЯ ТРАНЗАКЦІЇ ===
      await session.commitTransaction();
      console.log('Транзакція успішна. Замовлення створено:', orderResult.insertedId);

      // === READ: Перевірка оновленого запасу товару після транзакції ===
      const updatedProduct = await db.collection('products').findOne(
        { _id: new ObjectId(productId) }
      );

      const finalStock = updatedProduct.stock;

      // === Вивід порівняння запасу ===
      console.log(`Було на складі: ${initialStock}`);
      console.log(`Замовлено: ${quantity}`);
      console.log(`Залишилось після транзакції: ${finalStock}`);

      if (finalStock === initialStock - quantity) {
        console.log('Підтверджено: запас товару зменшено коректно.');
      } else {
        console.warn('Увага: запас товару не відповідає очікуваному значенню.');
      }

      return { success: true, orderId: orderResult.insertedId };
    } catch (error) {
      console.error('Помилка транзакції:', error.message);
      await session.abortTransaction();
      return { success: false, error: error.message };
    } finally {
      await session.endSession();
    }
  } finally {
    await client.close();
  }
}

// === ФУНКЦІЯ ДЕМОНСТРАЦІЇ З ТЕСТОВИМИ ДАНИМИ ===
async function demonstrateTransaction() {
  console.log('=== Демонстрація транзакції ===');

  const testUser = await userRepository.create({
    firstName: 'Тестовий',
    lastName: 'Користувач',
    email: 'test@example.com',
    password: 'password123',
    createdAt: new Date(),
    lastLogin: new Date()
  });

  const testProduct = await productRepository.create({
    name: 'Тестовий продукт',
    description: 'Опис тестового продукту',
    sku: 'TEST-PROD-001',
    categoryId: new ObjectId(),
    brand: 'Тестовий бренд',
    price: 1000,
    stock: 10,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  if (!testUser.success || !testProduct.success) {
    console.error('Помилка при створенні тестових даних');
    return;
  }

  const result = await createOrderWithTransaction(
    testUser.insertedId,
    testProduct.insertedId,
    2
  );

  if (result.success) {
    console.log('Замовлення створено з ID:', result.orderId);
  } else {
    console.error('Помилка при створенні замовлення:', result.error);
  }
}

// === ГОЛОВНА ФУНКЦІЯ ЗАПУСКУ ===
async function main() {
  try {
    await demonstrateTransaction();
    console.log('\n=== ДЕМОНСТРАЦІЯ ЗАВЕРШЕНА ===');
  } catch (error) {
    console.error('Помилка демонстрації:', error);
  }
}

module.exports = {
  createOrderWithTransaction,
  demonstrateTransaction,
  main
};

if (require.main === module) {
  main().catch(console.error);
}
