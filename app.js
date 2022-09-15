require('dotenv').config();
require('express-async-errors');

const express = require('express');
const connectDB = require('./db/connect');
const usersRouter = require('./routes/users');
const jobsRouter = require('./routes/jobs');
const notFound = require('./middleware/not-found');
const errorHandlerMW = require('./middleware/error-handler');
const authenticateUser = require('./middleware/auth');
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

// Create the app
const app = express();

app.set('trust proxy', 1);
const limiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);
// App Middleware
app.use(express.static('./public'));
app.use(express.json());

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(xss());

// Routes
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/jobs', authenticateUser, jobsRouter);

// Error-handling Middleware
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
