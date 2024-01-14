const Card = require('../models/card');

const NotFoundError = require('../errors/not-found-error');
const ValidationError = require('../errors/validation-error');
const RightsError = require('../errors/rights-error');

module.exports.getCardsList = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((error) => next(error));
};

module.exports.createCard = (req, res, next) => {
  const { name, link, owner = req.user._id } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card }))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return next(new ValidationError('При создании карточки переданы невалидные данные.'));
      }

      return next(error);
    });
};

module.exports.deleteCard = (req, res, next) => {
  const currentUserId = req.user._id;

  // ищем карточку, возвращаем _id владельца и сравниваем с id пользователя
  Card.findById({ _id: req.params.cardId }, { owner: 1 })
    .orFail()
    .then((card) => {
      // если _id не совпадают, то отправляем ошибку
      if (currentUserId.toString() !== card.owner.toString()) {
        return next(new RightsError('Отсутствуют права для удаления карточки.'));
      }
      // если совпадают, то удаляем карточку
      return Card.deleteOne(card)
        .then(() => res.send({ data: card }))
        .catch((error) => next(error));
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new ValidationError('Передан некорректный _id карточки для удаления.'));
      }

      if (error.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Карточка с таким _id не найдена.'));
      }

      return next(error);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => {
      res.send({ data: card });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new ValidationError('Передан некорректный _id карточки.'));
      }

      if (error.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Карточка с таким _id не найдена.'));
      }

      return next(error);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new ValidationError('Передан некорректный _id карточки.'));
      }

      if (error.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Карточка с таким _id не найдена.'));
      }

      return next(error);
    });
};
