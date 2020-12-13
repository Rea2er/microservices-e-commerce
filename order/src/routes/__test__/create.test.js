const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const Good = require('../../model/Good');
const Order = require('../../model/Order');

it('return an error if the good does not exist', async () => {
  const productId = mongoose.Types.ObjectId();
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({
      productId,
    })
    .expect(404);
});

it('return an error if the order already reserved', async () => {
  const good = new Good({
    title: 'switch',
    price: 399,
  });
  await good.save();
  const order = new Order({
    product: good,
    userId: '123456',
    status: 'Created',
    expiresAt: new Date(),
  });
  await order.save();
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ productId: good.id })
    .expect(400);
});

it('reserves a good', async () => {
  const good = new Good({
    title: 'switch',
    price: 399,
  });
  await good.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ productId: good.id })
    .expect(201);
});
