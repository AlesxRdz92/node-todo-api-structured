var express = require('express');
var router = express.Router();
const usersController = require('./../controllers/users');
const { authenticate } = require('./../middleware/authenticate');

router.post('/', usersController.add);
router.get('/me', authenticate, usersController.getOne);
router.post('/login', usersController.logIn);
router.delete('/logout', authenticate, usersController.logOut);

module.exports = router;