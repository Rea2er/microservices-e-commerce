const request = require('supertest');
const app = require('../../app');
const Order = require('../../model/Order');
const mongoose = require('mongoose');

it('return 404 when order not exist', async () => {
  await request(app)
    .post('/api/payment')
    .set('Cookie', global.signin())
    .send({ token: 'asdasd', orderId: mongoose.Types.ObjectId().toHexString() })
    .expect(404);
});

it('return 401 when user not sign in', async () => {
  const order = new Order({
    _id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    price: 20,
    status: 'Created',
  });
  await order.save();

  await request(app)
    .post('/api/payment')
    .send({ token: 'asdasd', orderId: order._id })
    .expect(401);
});

it('return 400 when order is cancelled', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const order = new Order({
    _id: mongoose.Types.ObjectId().toHexString(),
    userId,
    price: 20,
    status: 'Cancelled',
  });
  await order.save();

  await request(app)
    .post('/api/payment')
    .set('Cookie', global.signin(userId))
    .send({ token: 'asdasd', orderId: order._id })
    .expect(400);
});
