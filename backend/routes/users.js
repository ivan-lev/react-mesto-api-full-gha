const router = require('express').Router();

const {
  validateJoiGetUserById,
  validateJoiUpdateUserInfo,
  validateJoiUpdateUserAvatar,
} = require('../middlewares/joi-users-validation');

const {
  getUserList,
  getUserById,
  updateUserInfo,
  updateUserAvatar,
  getUserInfo,
} = require('../controllers/users');

router.get('/', getUserList);
router.get('/me', getUserInfo);
router.get('/:userId', validateJoiGetUserById, getUserById);
router.patch('/me', validateJoiUpdateUserInfo, updateUserInfo);
router.patch('/me/avatar', validateJoiUpdateUserAvatar, updateUserAvatar);

module.exports = router;
