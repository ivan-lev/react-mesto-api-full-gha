const router = require('express').Router();

const NotFoundError = require('../errors/not-found-error');

router.patch('/', (req, res, next) => next(new NotFoundError('Страница не найдена')));

module.exports = router;
