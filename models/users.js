const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

//This is a rewrited method
UserSchema.methods.toJSON = function () {
    return _.pick(this.toObject(), ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function () {
    let access = 'auth';
    let token = jwt.sign({ _id: this._id.toHexString(), access }, 'abc123').toString();
    this.tokens = this.tokens.concat([{ access, token }]);
    return this.save().then(() => {
        return token;
    });
};

UserSchema.statics.findByToken = function (token) {
    let decoded;
    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (e) {
        /*return new Promise((resolve, reject) => {
            reject();
        });*/
        return Promise.reject();
    }
    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.pre('save', function(next) {
    if (this.isModified('password')){
        let user = this;
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else
        next();
});

const User = mongoose.model('User', UserSchema);

module.exports = { User };