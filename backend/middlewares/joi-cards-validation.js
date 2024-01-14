const { celebrate, Joi } = require('celebrate');

const linkRegEx = /(https?:\/\/)(www\.)?[\w-]+\.[a-z]{2,6}[\w\-._~:/?#[\]@!$&'()*+,;=]*/;

module.exports.validateJoiCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().uri().required().pattern(linkRegEx),
  }),
});

module.exports.validateJoiCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
});
