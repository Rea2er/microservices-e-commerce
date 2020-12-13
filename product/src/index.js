const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
const app = require('./app');
const nats = require('node-nats-streaming');
const Good = require('./model/Good');

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Connecting to MongoDB');
  } catch (err) {
    console.log(err);
  }
  app.listen(port, () => console.log(`Server running on port ${port}!!!`));
};

const stan = nats.connect(
  'ecommence',
  new mongoose.Types.ObjectId().toHexString(),
  {
    url: 'http://nats-serv:4222',
  }
);

stan.on('connect', () => {
  console.log('Order Created Listener connected to NATS');
  const subscription = stan.subscribe('order:created');
  subscription.on('message', async (msg) => {
    const data = msg.getData();
    console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
    const good = await Good.findById(JSON.parse(data).product.id);
    if (!good) {
      throw new Error('Good not found');
    }
    good.set({
      orderId: JSON.parse(data).id,
    });
    await good.save();
  });
});

const stan2 = nats.connect(
  'ecommence',
  new mongoose.Types.ObjectId().toHexString(),
  {
    url: 'http://nats-serv:4222',
  }
);

stan2.on('connect', () => {
  console.log('Expiration Complete Listener connected to NATS');
  const subscription = stan.subscribe('expiration:complete');
  subscription.on('message', async (msg) => {
    const data = msg.getData();
    console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
    const good = await Good.findById(JSON.parse(data).productId);
    if (!good) {
      throw new Error('Good not found');
    }
    if (good.orderId != 'done') {
      good.set({
        orderId: undefined,
      });
      await good.save();
    }
  });
});

const stan3 = nats.connect(
  'ecommence',
  new mongoose.Types.ObjectId().toHexString(),
  {
    url: 'http://nats-serv:4222',
  }
);

stan3.on('connect', () => {
  console.log('Expiration Complete Listener connected to NATS');
  const subscription = stan.subscribe('payment:created');
  subscription.on('message', async (msg) => {
    const data = msg.getData();
    console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
    const good = await Good.findById(JSON.parse(data).productId);
    if (!good) {
      throw new Error('Good not found');
    }
    good.set({
      orderId: 'done',
    });
    await good.save();
  });
});

start();
