const router = require('express').Router();
const {
  createCard, getCards, deleteCard, likeCard, removeLikeFromCard,
} = require('../controllers/cards');

router.post('/cards', createCard);
router.get('/cards', getCards);
router.delete('/cards/:cardId', deleteCard);
router.put('/cards/:cardId/likes', likeCard);
router.delete('/cards/:cardId/likes', removeLikeFromCard);
router.use((req, res) => {
  res.status(404).send({ message: 'Такой страницы не существует' });
});

module.exports = router;
