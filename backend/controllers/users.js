const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/not-found-error');
const ValidationError = require('../errors/validation-error');
const ConflictError = require('../errors/conflict-error');

module.exports.getUserList = (req, res, next) => {
  // найти всех пользователей и вернуть определённые поля
  User.find({}, {
    _id: 1, name: 1, about: 1, avatar: 1, email: 1,
  })
    .then((users) => res.send(users))
    .catch((error) => next(error));
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId, {
    _id: 1, name: 1, about: 1, avatar: 1,
  })
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new ValidationError('Пользователь с таким _id не найден.'));
      }

      if (error.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Передан некорректный _id пользователя.'));
      }

      return next(error);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => {
        const userId = user._id.toString();
        res.status(201).send({
          data: {
            name, about, avatar, _id: userId,
          },
        });
      })
      .catch((error) => {
        if (error.name === 'ValidationError') {
          return next(new ValidationError('При создании пользователя переданы невалидные данные.'));
        }

        if (error.code === 11000) {
          return next(new ConflictError('Такой пользователь уже существует.'));
        }

        return next(error);
      }));
};

module.exports.updateUserInfo = (req, res, next) => {
  const owner = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    owner,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new ValidationError('При обновлении профиля переданы невалидные данные.'));
      }

      if (error.name === 'CastError') {
        return next(new NotFoundError('Пользователь с таким _id не найден.'));
      }

      return next(error);
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      select: { avatar },
    },
  )
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new ValidationError('При обновлении аватара переданы невалидные данные.'));
      }

      if (error.name === 'CastError') {
        return next(new NotFoundError('Пользователь с таким _id не найден.'));
      }

      return next(error);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'secret-key',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((error) => next(error));
};

module.exports.getUserInfo = (req, res, next) => {
  const currentUserId = req.user._id;

  User.findById(currentUserId, {
    _id: 1, name: 1, about: 1, avatar: 1, email: 1,
  })
    .orFail()
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new ValidationError('Передан некорректный _id пользователя.'));
      }

      if (error.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Пользователь с таким _id не найден.'));
      }

      return next(error);
    });
};
