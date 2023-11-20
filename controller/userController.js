const User = require('../entity/user');
const bcrypt = require('bcryptjs')


const createUser = async (userData) => {
    try {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        userData.password = hashedPassword;
        const user = await User.create(userData);
        return user;
    } catch (error) {
        throw new Error('Failed to create user');
    }
};
const getUsers = async () => {
    try {
        const users = await User.findAll();
        return users;
    } catch (error) {
        throw new Error('Failed to get users');
    }
};
const getUserByUsername = async (username) => {
    try {
        const user = await User.findOne(username);
        return user;
    } catch (error) {
        throw new Error('Failed to get user');
    }
}
const getUserById = async (userId) => {
    try {
        const user = await User.findByPk(userId);
        return user;
    } catch (error) {
        throw new Error('Failed to get user');
    }
};
const updateUser = async (userId, userData) => {
    try {
        const user = await User.findByPk(userId);
        if (user) {
            await user.update(userData);
            return user;
        }
        throw new Error('User not found');
    } catch (error) {
        throw new Error('Failed to update user');
    }
};
module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    getUserByUsername
};
