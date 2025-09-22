const BaseRepository = require('./baseRepository');
const { ObjectId } = require('mongodb');

class ProductRepository extends BaseRepository {
    constructor() {
        super('products');
    }

    async findByCategory(categoryId, page = 1, limit = 10) {
        return this.paginate(
            { categoryId: new ObjectId(categoryId), isActive: true },
            page,
            limit,
            { name: 1 }
        );
    }

    async searchProducts(searchTerm, page = 1, limit = 10) {
        const filter = {
            $and: [
                { isActive: true },
                {
                    $or: [
                        { name: { $regex: searchTerm, $options: 'i' } },
                        { description: { $regex: searchTerm, $options: 'i' } },
                        { brand: { $regex: searchTerm, $options: 'i' } },
                        { tags: { $in: [new RegExp(searchTerm, 'i')] } }
                    ]
                }
            ]
        };

        return this.paginate(filter, page, limit, { score: { $meta: "textScore" } });
    }

    async updateStock(productId, quantity) {
        const collection = await this.getCollection();
        return collection.updateOne(
            { _id: new ObjectId(productId) },
            { $inc: { stock: quantity } }
        );
    }
}

module.exports = new ProductRepository();