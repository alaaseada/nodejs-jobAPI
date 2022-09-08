require('dotenv').config();
require('express-async-errors');

const express = require('express');
const connectDB = require('./db/connect');
const usersRouter = require('./routes/users');
const notFound = require('./middleware/not-found');
const errorHandlerMW = require('./middleware/error-handler');

const app = express();

app.use(express.static('./public'));
app.use(express.json());
app.use('/api/v1/users', usersRouter);
app.use(errorHandlerMW);
app.use(notFound);

const start = async () => {
  const port = process.env.PORT || 3000;
  await connectDB(process.env.MONGO_URI);
  app.listen(port, () => {
    console.log('Server is listening on port 3000...');
  });
};

start();
