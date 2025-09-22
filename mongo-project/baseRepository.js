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

    async create(document) {
        const collection = await this.getCollection();
        const result = await collection.insertOne(document);
        return result.insertedId;
    }

    async findById(id) {
        const collection = await this.getCollection();
        return collection.findOne({ _id: new ObjectId(id) });
    }

    async find(filter = {}, options = {}) {
        const collection = await this.getCollection();
        const { 
            skip = 0, 
            limit = 10, 
            sort = {}, 
            projection = {} 
        } = options;

        return collection
            .find(filter, { projection })
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .toArray();
    }

    async update(id, updateData, options = {}) {
        const collection = await this.getCollection();
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData },
            options
        );
        return result.modifiedCount;
    }

    async delete(id) {
        const collection = await this.getCollection();
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount;
    }

    async count(filter = {}) {
        const collection = await this.getCollection();
        return collection.countDocuments(filter);
    }

    async paginate(filter = {}, page = 1, limit = 10, sort = { createdAt: -1 }) {
        const collection = await this.getCollection();
        const skip = (page - 1) * limit;
        const total = await this.count(filter);
        
        const data = await collection
            .find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .toArray();

        return {
            data,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total,
                limit
            }
        };
    }
}

module.exports = BaseRepository;