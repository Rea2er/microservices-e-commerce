const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
const app = require('./app');
const nats = require('node-nats-streaming');
const Order = require('./model/Order');
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

const stan2 = nats.connect(
  'ecommence',
  new mongoose.Types.ObjectId().toHexString(),
  {
    url: 'http://nats-serv:4222',
  }
);

const stan3 = nats.connect(
  'ecommence',
  new mongoose.Types.ObjectId().toHexString(),
  {
    url: 'http://nats-serv:4222',
  }
);

stan.on('connect', () => {
  console.log('Good Created Listener connected to NATS');
  const subscription = stan.subscribe('good:created');
  subscription.on('message', async (msg) => {
    const data = msg.getData();
    console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
    const good = new Good({
      _id: JSON.parse(data).id,
      title: JSON.parse(data).title,
      price: JSON.parse(data).price,
      userId: JSON.parse(data).userId,
    });
    await good.save();
  });
});

stan2.on('connect', () => {
  console.log('Expiration Complete Listener connected to NATS');
  const subscription = stan.subscribe('expiration:complete');
  subscription.on('message', async (msg) => {
    const data = msg.getData();
    console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
    const order = await Order.findById(JSON.parse(data).orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status != 'Complete') {
      order.set({
        status: 'Cancelled',
      });
      await order.save();
    }
  });
});

stan3.on('connect', () => {
  console.log('Payment Created Listener connected to NATS');
  const subscription = stan.subscribe('payment:created');
  subscription.on('message', async (msg) => {
    const data = msg.getData();
    console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
    const order = await Order.findById(JSON.parse(data).orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    order.set({
      status: 'Complete',
    });
    await order.save();
  });
});

start();
