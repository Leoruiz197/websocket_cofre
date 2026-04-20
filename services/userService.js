const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

module.exports.createUser = async (data) => {
    const existingUser = await User.findOne({ email: data.email });

    if (existingUser) {
        throw new Error('Email já cadastrado');
    }

    const user = new User(data);

    return await user.save();
};

module.exports.loginUser = async (email) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Usuário não encontrado');
    }

    const token = jwt.sign(
        { id: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: '1d' }
    );

    return {
        token,
        user
    };
};