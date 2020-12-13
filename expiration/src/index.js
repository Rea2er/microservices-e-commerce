const nats = require('node-nats-streaming');
const Queue = require('bull');
const mongoose = require('mongoose');

const stan = nats.connect(
  'ecommence',
  new mongoose.Types.ObjectId().toHexString(),
  {
    url: 'http://nats-serv:4222',
  }
);

const expirationQueue = new Queue('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  await stan.publish(
    'expiration:complete',
    JSON.stringify({
      orderId: job.data.orderId,
      productId: job.data.productId,
    }),
    () => {
      console.log('Event published to expiration:complete');
    }
  );
});

stan.on('connect', () => {
  console.log('Order Created Listener connected to NATS');
  const subscription = stan.subscribe('order:created');
  subscription.on('message', async (msg) => {
    const data = msg.getData();
    console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
    const delay =
      new Date(JSON.parse(data).expiresAt).getTime() - new Date().getTime();
    console.log(`Waiting ${delay} to process the job`);
    await expirationQueue.add(
      {
        orderId: JSON.parse(data).id,
        productId: JSON.parse(data).product.id,
      },
      {
        delay,
      }
    );
  });
});
