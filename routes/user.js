const express = require('express');
const userController = require('../controllers/user');
const router = express.Router();
const { verify } = require('../auth');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/details', verify, userController.getProfile);
router.get('/details/:id', userController.getProfileById);

module.exports = router;