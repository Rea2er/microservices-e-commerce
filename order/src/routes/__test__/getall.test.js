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

it('get all orders for particular user', async () => {
  const goodOne = await buildGood();
  const goodTwo = await buildGood();
  const goodThree = await buildGood();

  const userOne = global.signin();
  const userTwo = global.signin();

  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ productId: goodOne.id })
    .expect(201);

  await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ productId: goodTwo.id })
    .expect(201);
  await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ productId: goodThree.id })
    .expect(201);

  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200);

  expect(response.body.length).toEqual(2);
});
