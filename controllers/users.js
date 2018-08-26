const mongoose = require('./../db/mongoose');
const { User } = require('./../models/user');
const _ = require('lodash');

const usersController = {
    add(req, res) {
        let body = _.pick(req.body, ['email', 'password']);
        let user = new User(body);
        user.save().then(() => {
            return user.generateAuthToken();
        }).then(token => {
            res.header('x-auth', token).send(user);
        }).catch(e => res.status(400).send());
    },
    getOne(req, res) {
        res.send(req.user);
    },
    logIn(req, res) {
        let body = _.pick(req.body, ['email', 'password']);
        return User.findByCredentials(body.email, body.password).then(user => {
            user.generateAuthToken().then(token => res.header('x-auth', token).send(user));
        }).catch(e => {
            res.status(400).send();
        });
    },
    logOut(req, res) {
        req.user.removeToken(req.token).then(() => {
            res.status(200).send('Logout succesful');
        }, () => {
            res.status(400);
        });
    }
};

module.exports = usersController;