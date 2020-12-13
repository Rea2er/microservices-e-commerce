const request = require('supertest');
const app = require('../../app');

it('get all goods', async () => {
  await request(app)
    .post('/api/goods')
    .set('Cookie', global.signin())
    .send({
      title: 'milk',
      price: 10,
    })
    .expect(201);

  await request(app)
    .post('/api/goods')
    .set('Cookie', global.signin())
    .send({
      title: 'egg',
      price: 5,
    })
    .expect(201);

  const response = await request(app).get('/api/goods').send().expect(200);

  expect(response.body.length).toEqual(2);
});
