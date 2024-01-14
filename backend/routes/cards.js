const router = require('express').Router();

const {
  validateJoiCreateCard,
  validateJoiCardId,
} = require('../middlewares/joi-cards-validation');

const {
  getCardsList,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCardsList);
router.post('/', validateJoiCreateCard, createCard);
router.delete('/:cardId', validateJoiCardId, deleteCard);
router.put('/:cardId/likes', validateJoiCardId, likeCard);
router.delete('/:cardId/likes', validateJoiCardId, dislikeCard);

module.exports = router;
