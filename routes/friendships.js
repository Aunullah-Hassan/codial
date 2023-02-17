const express = require('express');
const router = express.Router();
const friendshipController = require('../controllers/friendship_controller');

router.get('/add/',friendshipController.addFriend);
router.get('/remove/',friendshipController.removeFriend);


module.exports = router;