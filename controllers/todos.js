const { Todo } = require('./../models/todo');

const todosController = {
    all(req, res) {
        Todo.find({}).then(todos => {
            res.json(todos);
        }, e => res.status(404).send());
    }
};

module.exports = todosController;