const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const { validateJoiSignup, validateJoiSignin } = require('./middlewares/joi-users-validation');
const { cors } = require('./middlewares/cors');

const { createUser, login } = require('./controllers/users');

const auth = require('./middlewares/auth');
const userRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const pageNotFound = require('./routes/page-not-found');

const { errorHandler } = require('./middlewares/error-handler');

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(requestLogger);

app.use(cors);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());
app.use(limiter);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signup', validateJoiSignup, createUser);
app.post('/signin', validateJoiSignin, login);

app.use(auth);
app.use('/users', userRouter);
app.use('/cards', cardsRouter);

app.use('*', pageNotFound);

app.use(errorLogger);

// миддлвэр для обработки ошибок celebrate
app.use(errors());

// хэндлер всех ошибок
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});