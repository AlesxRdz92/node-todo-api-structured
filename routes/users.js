var express = require('express');
var router = express.Router();
const usersController = require('./../controllers/users');
const {authenticate} = require('./../middleware/authenticate');

router.post('/', usersController.add);
router.get('/me', authenticate, usersController.getOne);

module.exports = router;