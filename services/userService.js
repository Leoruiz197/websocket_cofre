const User = require('../models/User');

module.exports.createUser = async (data) => {
    const existingUser = await User.findOne({ email: data.email });

    if (existingUser) {
        throw new Error('Email já cadastrado');
    }

    const user = new User(data);

    return await user.save();
};