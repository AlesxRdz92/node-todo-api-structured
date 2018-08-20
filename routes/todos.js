var express = require('express');
var router = express.Router();
const todosController = require('./../controllers/todos');

router.get('/', todosController.all);
router.post('/', todosController.add);
router.get('/:id', todosController.one);
router.delete('/:id', todosController.delete);
router.patch('/:id', todosController.update);

module.exports = router;
