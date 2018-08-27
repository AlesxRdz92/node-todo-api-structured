const mongoose = require('./../db/mongoose');
const { Todo } = require('./../models/todo');
const _ = require('lodash');

const todosController = {
    all(req, res) {
        Todo.find({
            _creator: req.user._id
        }).then(todos => {
            res.json(todos);
        }, e => res.status(400).send());
    },
    add(req, res) {
        new Todo({
            text: req.body.text,
            _creator: req.user._id
        }).save().then(doc => {
            res.json(doc);
        }, e => res.status(400).send());
    },
    one(req, res) {
        Todo.findOne({
            _id: req.params.id,
            _creator: req.user._id
        }).then(todo => {
            if (!todo)
                return res.status(404).send('ID not found');
            res.json(todo);
        }, e => res.status(400).send());
    },
    delete(req, res) {
        Todo.findOneAndRemove({
            _id: req.params.id,
            _creator: req.user._id
        }).then(todo => {
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
        Todo.findOneAndUpdate({ _id: id, _creator: req.user._id }, { $set: body }, { new: true }).then(todo => {
            if (!todo)
                return res.status(404).send('ID not found');
            res.json(todo);
        }, e => res.status(400).send());
    }
};

module.exports = todosController;