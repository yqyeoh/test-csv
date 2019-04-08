const mongoose = require('mongoose');
const app = require('./app');

mongoose.connect('mongodb://localhost:27017/introspect', {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true
});

const db = mongoose.connection;

db.on('error', error => {
  console.error('unable to connect to database', error);
});

db.on('connected', error => {
  console.log('Successfully connected to the database');
});

db.once('connected', () => {
  app.listen(3000, async () => {
    console.log(`server is running on port 3000`);
  });
});
