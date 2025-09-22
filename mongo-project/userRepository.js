const BaseRepository = require('./baseRepository');
const { ObjectId } = require('mongodb');

class UserRepository extends BaseRepository {
    constructor() {
        super('users');
    }

    async findByEmail(email) {
        const collection = await this.getCollection();
        return collection.findOne({ email });
    }

    async addToWishlist(userId, productId) {
        const collection = await this.getCollection();
        return collection.updateOne(
            { _id: new ObjectId(userId) },
            { $addToSet: { wishlist: new ObjectId(productId) } }
        );
    }

    async updateLastLogin(userId) {
        return this.update(userId, { lastLogin: new Date() });
    }
}

module.exports = new UserRepository();