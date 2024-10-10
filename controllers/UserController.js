const UserDAO = require('../dao/userDAO');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tokenBlacklist = require('../token/tokenBlacklist');
const sendMail = require('../email');



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

            res.status(200).json({ token, User });
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
                return res.status(409).json({ message: 'Email already in use' });
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
            res.status(500).json({ message: 'Failed to register user' });
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


    async forget(req, res) {
        const { email } = req.body;
        const user = await UserDAO.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Email not found' });
        }

        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

        try {
            await sendMail(
                user.email,
                "Reset Password",
                `Click on the following link to reset your password: ${resetLink}`
            );
            res.status(200).json({ message: 'email sent to reset your password' });
        } catch (emailError) {
            console.error("Error sending email:", emailError.message);
            res.status(500).json({ message: 'Failed to send reset email' });
        }
    }


    async resetPassword(req, res) {
        const { token } = req.params;
        const { newPassword } = req.body;

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await UserDAO.findById(decoded.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }


            const hashedPassword = await bcrypt.hash(newPassword, 8);
            user.password = hashedPassword;
            await user.save();

            res.status(200).json({ message: 'Password reset successful' });
        } catch (error) {
            res.status(400).json({ message: 'Invalid or expired token' });
        }
    }


    async me(req, res) {
        try {
            const token = req.headers['authorization']?.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'No token provided' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userIDe = decoded.id;
            const user = await UserDAO.findById(userIDe);

            if (!user) {
                return res.status(401).json({ message: 'try again later ...' });
            }
            res.status(200).json(user);
        } catch (error) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
    }


}

module.exports = new UserController();
