var express = require('express');
var router = express.Router();
const todosController = require('./../controllers/todos');
const { authenticate } = require('./../middleware/authenticate');

router.get('/', authenticate, todosController.all);
router.post('/', authenticate, todosController.add);
router.get('/:id', authenticate, todosController.one);
router.delete('/:id', authenticate, todosController.delete);
router.patch('/:id', authenticate, todosController.update);

module.exports = router;
