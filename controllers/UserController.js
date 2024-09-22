const UserDAO = require('../dao/userDAO');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tokenBlacklist = require('../token/tokenBlacklist');



class UserController {
    // Get all Users
    async getUsers(req, res) {
        try {
            const Users = await UserDAO.findAll();
            res.status(200).json(Users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get an User by ID
    async getUser(req, res) {
        const { id } = req.params;
        try {
            const User = await UserDAO.findById(id);
            if (!User) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(User);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Create a new User
    async createAdmin(req, res) {
        const { status, password, email, name, role } = req.body;
        try {
            const hashedPassword = await bcrypt.hash(password, 8);
            const newUser = await UserDAO.create({ status, password: hashedPassword, email, name, role });
            res.status(201).json(newUser);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Update a User
    async updateUser(req, res) {
        const { id } = req.params;
        const { status, password, email, name } = req.body;
        try {
            const updatedUser = await UserDAO.updateById(id, { status, password, email, name });
            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Delete a User
    async deleteUser(req, res) {
        const { id } = req.params;
        try {
            const deletedUser = await UserDAO.deleteById(id);
            if (!deletedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async login(req, res) {
        const { email, password } = req.body;
        try {
            // Find User by email
            const User = await UserDAO.findByEmail(email);
            if (!User) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Check password
            const isMatch = await bcrypt.compare(password, User.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Generate JWT token
            const token = jwt.sign(
                { id: User._id, email: User.email, name: User.name, role: User.role },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.status(200).json({ token });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async register(req, res) {
        const { name, email, password, status, role } = req.body;

        // Check if email is already registered
        try {
            const existingUser = await UserDAO.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: 'Email already in use' });
            }

            const hashedPassword = await bcrypt.hash(password, 8);


            // Create a new user
            const newUser = await UserDAO.create({
                name,
                email,
                password: hashedPassword,
                status: status || 'active',
                role: role
            });

            // Generate JWT token
            const token = jwt.sign(
                { _id: newUser._id, role: newUser.role },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            // Respond with the token and newly created user details
            res.header('Authorization', `Bearer ${token}`).json({
                message: 'Registration successful',
                user: {
                    _id: newUser._id,
                    email: newUser.email,
                    status: newUser.status,
                    role: newUser.role
                },
                token
            });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    }


    async logout(req, res) {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        tokenBlacklist.add(token);
        res.status(200).json({ message: 'Logged out successfully' });
    }


}

module.exports = new UserController();
