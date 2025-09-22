const { ObjectId } = require('mongodb');
const dbConnection = require('./dbConnection');

class BaseRepository {
    constructor(collectionName) {
        this.collectionName = collectionName;
    }

    async getCollection() {
        const db = await dbConnection.connect();
        return db.collection(this.collectionName);
    }

    // CREATE - Створення нового документу
    async create(document) {
        try {
            const collection = await this.getCollection();
            // Додаємо timestamp, якщо його немає
            const documentWithTimestamps = {
                ...document,
                createdAt: document.createdAt || new Date(),
                updatedAt: new Date()
            };
            const result = await collection.insertOne(documentWithTimestamps);
            return {
                success: true,
                insertedId: result.insertedId,
                message: 'Документ успішно створено'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: 'Помилка при створенні документу'
            };
        }
    }

    // READ - Отримання документа за ID
    async findById(id) {
        try {
            const collection = await this.getCollection();
            if (!ObjectId.isValid(id)) {
                return {
                    success: false,
                    error: 'Невірний формат ID',
                    data: null
                };
            }
            const document = await collection.findOne({ _id: new ObjectId(id) });
            return {
                success: true,
                data: document,
                message: document ? 'Документ знайдено' : 'Документ не знайдено'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                data: null
            };
        }
    }

    // READ - Отримання всіх документів з фільтрацією
    async findAll(filter = {}, options = {}) {
        try {
            const collection = await this.getCollection();
            const { 
                skip = 0, 
                limit = 0, 
                sort = {}, 
                projection = {} 
            } = options;

            const cursor = collection.find(filter, { projection });
            
            if (Object.keys(sort).length > 0) {
                cursor.sort(sort);
            }
            
            if (skip > 0) {
                cursor.skip(skip);
            }
            
            if (limit > 0) {
                cursor.limit(limit);
            }

            const data = await cursor.toArray();
            const total = await collection.countDocuments(filter);

            return {
                success: true,
                data,
                total,
                skip,
                limit: limit > 0 ? limit : total,
                message: `Знайдено ${data.length} документів`
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                data: [],
                total: 0
            };
        }
    }

    // UPDATE - Оновлення документа
    async update(id, updateData) {
        try {
            const collection = await this.getCollection();
            if (!ObjectId.isValid(id)) {
                return {
                    success: false,
                    error: 'Невірний формат ID',
                    modifiedCount: 0
                };
            }

            // Додаємо updatedAt
            const updateWithTimestamp = {
                ...updateData,
                updatedAt: new Date()
            };

            const result = await collection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updateWithTimestamp }
            );

            return {
                success: true,
                modifiedCount: result.modifiedCount,
                message: result.modifiedCount > 0 ? 'Документ успішно оновлено' : 'Документ не знайдено для оновлення'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                modifiedCount: 0
            };
        }
    }

    // DELETE - Видалення документа
    async delete(id) {
        try {
            const collection = await this.getCollection();
            if (!ObjectId.isValid(id)) {
                return {
                    success: false,
                    error: 'Невірний формат ID',
                    deletedCount: 0
                };
            }

            const result = await collection.deleteOne({ _id: new ObjectId(id) });

            return {
                success: true,
                deletedCount: result.deletedCount,
                message: result.deletedCount > 0 ? 'Документ успішно видалено' : 'Документ не знайдено для видалення'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                deletedCount: 0
            };
        }
    }

    // Підрахунок документів
    async count(filter = {}) {
        try {
            const collection = await this.getCollection();
            const count = await collection.countDocuments(filter);
            return {
                success: true,
                count,
                message: `Кількість документів: ${count}`
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                count: 0
            };
        }
    }

    // Пагінація з сортуванням - основна функція для завдання
    async paginate(filter = {}, page = 1, limit = 10, sort = { createdAt: -1 }) {
        try {
            const collection = await this.getCollection();
            const skip = (page - 1) * limit;
            const total = await collection.countDocuments(filter);
            
            // Використання .sort(), .skip() та .limit() як вимагається в завданні
            const data = await collection
                .find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .toArray();

            return {
                success: true,
                data,
                pagination: {
                    current: page,
                    pages: Math.ceil(total / limit),
                    total,
                    limit,
                    hasNext: page < Math.ceil(total / limit),
                    hasPrev: page > 1
                },
                message: `Сторінка ${page} з ${Math.ceil(total / limit)}`
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                data: [],
                pagination: {
                    current: page,
                    pages: 0,
                    total: 0,
                    limit,
                    hasNext: false,
                    hasPrev: false
                }
            };
        }
    }
}

module.exports = BaseRepository;