const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
}

// login a user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);

        const token = createToken(user._id);

        res.status(200).json({ email, token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// signup a user
// DONT USE ARROW FUNCTION BECAUSE "this" keyword won't work
const signupUser = async function (req, res) {
    const { email, password } = req.body;

    try {
        const user = await User.signup(email, password);

        const token = createToken(user._id);

        res.status(200).json({ email, token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = { signupUser, loginUser };
