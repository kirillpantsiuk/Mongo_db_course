const { MongoClient } = require('mongodb');

class DatabaseConnection {
    constructor() {
        this.uri = 'mongodb://127.0.0.1:27017/electronicsStore';
        this.client = null;
        this.db = null;
        this.isConnected = false;
    }

    async connect() {
        if (this.isConnected) return this.db;
        
        this.client = new MongoClient(this.uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10,
            minPoolSize: 2,
            maxIdleTimeMS: 30000
        });

        try {
            await this.client.connect();
            this.db = this.client.db();
            this.isConnected = true;
            console.log('Підключено до MongoDB сервера');
            return this.db;
        } catch (error) {
            console.error('Помилка підключення до MongoDB:', error);
            throw error;
        }
    }

    async disconnect() {
        if (this.client && this.isConnected) {
            await this.client.close();
            this.isConnected = false;
            console.log('З\'єднання з MongoDB закрите');
        }
    }

    getDatabase() {
        if (!this.isConnected) throw new Error('База даних не підключена');
        return this.db;
    }

    // Метод для перевірки стану з'єднання
    async healthCheck() {
        try {
            await this.db.command({ ping: 1 });
            return true;
        } catch (error) {
            return false;
        }
    }
}

// Експортуємо екземпляр класу (Singleton)
module.exports = new DatabaseConnection();