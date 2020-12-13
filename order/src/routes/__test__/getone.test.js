const request = require('supertest');
const app = require('../../app');
const Good = require('../../model/Good');
const Order = require('../../model/Order');

const buildGood = async () => {
  const good = new Good({
    title: '3DS',
    price: 100,
  });
  await good.save();
  return good;
};

it('get the order', async () => {
  const good = await buildGood();
  const user = global.signin();
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({
      productId: good.id,
    })
    .expect(201);

  // await request(app)
  //   .get(`/api/orders/${order._id}`)
  //   .set('Cookie', user)
  //   .send()
  //   .expect(200);
});
