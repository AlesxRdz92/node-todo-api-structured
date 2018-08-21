const mongoose = require('./../db/mongoose');
const { Todo } = require('./../models/todo');
const _ = require('lodash');

const todosController = {
    all(req, res) {
        Todo.find({}).then(todos => {
            res.json(todos);
        }, e => res.status(400).send());
    },
    add(req, res) {
        new Todo({
            text: req.body.text
        }).save().then(doc => {
            res.json(doc);
        }, e => res.status(400).send());
    },
    one(req, res) {
        Todo.findById(req.params.id).then(todo => {
            if (!todo)
                return res.status(404).send('ID not found');
            res.json(todo);
        }, e => res.status(400).send());
    },
    delete(req, res) {
        Todo.findByIdAndRemove(req.params.id).then(todo => {
            if (!todo)
                return res.status(404).send('ID not found');
            res.json(todo);
        }, e => res.status(400).send());
    },
    update(req, res) {
        let id = req.params.id;
        let body = _.pick(req.body, ['text', 'completed']);
        if (_.isBoolean(body.completed) && body.completed)
            body.completedAt = new Date().getTime();
        else {
            body.completed = false;
            body.completedAt = null;
        }
        Todo.findByIdAndUpdate(id, { $set: body }, { new: true }).then(todo => {
            if (!todo)
                return res.status(404).send('ID not found');
            res.json(todo);
        }, e => res.status(400).send());
    }
};

module.exports = todosController;