const request = require('supertest');
const app = require('../../app');

it('return detail about current user', async () => {
  const cookie = await global.signup();

  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send({})
    .expect(200);
  expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('return null if not sign in', async () => {
  const response = await request(app)
    .get('/api/users/currentuser')
    .send({})
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
});
