const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

// Static signup method, i.e. this method will be available on "User" mongoose model
// Always use normal function when using "this" keyword
userSchema.statics.signup = async function (email, password) {
    // validation
    if(!email || !password) {
        throw Error('All fields must be filled');
    } 
    if(!validator.isEmail(email)) {
        throw Error('Email is not valid');
    }
    if(!validator.isStrongPassword(password)) {
        throw Error('Password not strong enough');
    }

    const exists = await this.findOne({ email });

    if (exists) {
        throw Error('Email already in use');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // "this" refers to "User" mongoose model
    const user = await this.create({ email, password: hash });

    return user;
};

// static login method
userSchema.statics.login = async function(email, password) {
    if (!email || !password) {
        throw Error('All fields must be filled');
    }

    const user = await this.findOne({ email });
    if (!user) {
        throw Error('Incorrect email');
    }

    // When you use the bcrypt.compare() method to verify a password during login, the library automatically extracts the salt from the stored hashed password and uses it to hash the login password before comparing the two. This means that you don't need to worry about handling the salt yourself in your code.
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw Error('Incorrect password');
    }

    return user;
}

module.exports = mongoose.model('User', userSchema);
