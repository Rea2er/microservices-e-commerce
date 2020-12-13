const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');

it('return 404 if good not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).post(`/api/goods/${id}`).send({}).expect(404);
});

it('return good if good found', async () => {
  const title = 'milk';
  const price = 10;
  const response = await request(app)
    .post('/api/goods')
    .set('Cookie', global.signin())
    .send({
      title,
      price,
    })
    .expect(201);

  // const goodResponse = await request(app)
  //   .get(`/api/goods/${response.body.id}`)
  //   .send({})
  //   .expect(200);

  // expect(goodResponse.body.title).toEqual(title);
  // expect(goodResponse.body.price).toEqual(price);
});
