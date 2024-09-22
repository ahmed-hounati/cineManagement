const User = require('../models/UserModel');

class UserDAO {
    async findAll() {
        try {
            return await User.find();
        } catch (error) {
            throw new Error('Error fetching Users');
        }
    }

    async findById(id) {
        try {
            return await User.findById(id);
        } catch (error) {
            throw new Error('Error finding User');
        }
    }

    async findByEmail(email) {
        try {
            return await User.findOne({ email });
        } catch (error) {
            throw new Error('Error finding User by email');
        }
    }

    async create(UserData) {
        try {
            const newUser = new User(UserData);
            return await newUser.save();
        } catch (error) {
            throw new Error('Error creating User');
        }
    }

    async updateById(id, updateData) {
        try {
            return await User.findByIdAndUpdate(id, updateData, { new: true });
        } catch (error) {
            throw new Error('Error updating User');
        }
    }

    async deleteById(id) {
        try {
            return await User.findByIdAndDelete(id);
        } catch (error) {
            throw new Error('Error deleting User');
        }
    }
}

module.exports = new UserDAO();