const request = require('supertest');
const app = require('../../app');
const Good = require('../../model/Good');

it('has route for post a new good', async () => {
  const response = await request(app).post('/api/goods').send({});
  expect(response.status).not.toEqual(404);
});

it('need user sign in', async () => {
  await request(app).post('/api/goods').send({}).expect(401);
});

it('sign in user with no 401', async () => {
  const response = await request(app)
    .post('/api/goods')
    .set('Cookie', global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it('return error if invalid title', async () => {
  await request(app)
    .post('/api/goods')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 10,
    })
    .expect(400);

  await request(app)
    .post('/api/goods')
    .set('Cookie', global.signin())
    .send({
      price: 10,
    })
    .expect(400);
});

it('return error if invalid price', async () => {
  await request(app)
    .post('/api/goods')
    .set('Cookie', global.signin())
    .send({
      title: 'milk',
      price: -10,
    })
    .expect(400);

  await request(app)
    .post('/api/goods')
    .set('Cookie', global.signin())
    .send({
      title: 'milk',
    })
    .expect(400);
});

it('create product with valid input', async () => {
  let goods = await Good.find({});
  expect(goods.length).toEqual(0);

  const title = 'milk';
  await request(app)
    .post('/api/goods')
    .set('Cookie', global.signin())
    .send({
      title: title,
      price: 10,
    })
    .expect(201);

  goods = await Good.find({});
  expect(goods.length).toEqual(1);
  expect(goods[0].title).toEqual(title);
  expect(goods[0].price).toEqual(10);
});
