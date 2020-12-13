const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
const app = require('./app');
const nats = require('node-nats-streaming');
const Order = require('./model/Order');

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

stan.on('connect', () => {
  console.log('Order Created Listener connected to NATS');
  const subscription = stan.subscribe('order:created');
  subscription.on('message', async (msg) => {
    const data = msg.getData();
    console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
    const order = new Order({
      _id: JSON.parse(data).id,
      status: JSON.parse(data).status,
      price: JSON.parse(data).product.price,
      userId: JSON.parse(data).userId,
      productId: JSON.parse(data).product.id,
    });
    await order.save();
  });
});

stan2.on('connect', () => {
  console.log('Order Cancelled Listener connected to NATS');
  const subscription = stan.subscribe('order:cancelled');
  subscription.on('message', async (msg) => {
    const data = msg.getData();
    console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
    const order = await Order.findOne({
      _id: JSON.parse(data).id,
    });
    if (!order) {
      throw new Error('Order not found');
    }
    order.set({
      status: 'Canclled',
    });
    await order.save();
  });
});

start();
