const { ObjectId } = require('mongodb');

async function createOrder(db, userId, product, quantity, session) {
  const order = {
    userId: new ObjectId(userId),
    items: [
      {
        productId: new ObjectId(product._id),
        name: product.name,
        price: product.price,
        quantity: quantity,
      },
    ],
    totalAmount: product.price * quantity,
    finalAmount: product.price * quantity,
    status: 'processing',
    createdAt: new Date(),
    updatedAt: new Date(),
    paymentStatus: 'pending',
    paymentMethod: 'cash_on_delivery',
    shippingAddress: {
      street: 'вул. Прикладна, 1',
      city: 'Кременчук',
      postalCode: '39600',
      country: 'Україна'
    }
  };

  const result = await db.collection('orders').insertOne(order, { session });
  return result;
}

module.exports = {
  createOrder
};
