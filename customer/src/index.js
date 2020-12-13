const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
const app = require('./app');

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

start();
