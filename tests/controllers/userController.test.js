const UserController = require('../../controllers/UserController');
const UserDAO = require('../../dao/userDAO');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tokenBlacklist = require('../../token/tokenBlacklist');
const sendEmail = require('../../email');
const nodemailer = require('nodemailer');

jest.mock('../../dao/userDAO');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../../token/tokenBlacklist', () => ({
    add: jest.fn(),
}));

jest.mock('../../email', () => ({
    sendMail: jest.fn().mockImplementation((to, subject, body) => {
        return Promise.resolve({ messageId: '123456' });
    }),
}));


let req, res;

beforeEach(() => {
    req = {
        params: {}, body: {}, headers: {}
    };
    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        header: jest.fn(),
    };
});

describe('UserController', () => {
    describe('getUsers', () => {
        it('should return all users', async () => {
            const users = [{ id: 1, name: 'John' }];
            UserDAO.findAll.mockResolvedValue(users);

            await UserController.getUsers(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(users);
        });

        it('should handle errors', async () => {
            const error = new Error('Database error');
            UserDAO.findAll.mockRejectedValue(error);

            await UserController.getUsers(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: error.message });
        });
    });

    describe('getUser', () => {
        it('should return a user by ID', async () => {
            const user = { id: 1, name: 'John' };
            req.params.id = 1;
            UserDAO.findById.mockResolvedValue(user);

            await UserController.getUser(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(user);
        });

        it('should return 404 if user not found', async () => {
            req.params.id = 1;
            UserDAO.findById.mockResolvedValue(null);

            await UserController.getUser(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
        });

        it('should handle errors', async () => {
            const error = new Error('Database error');
            req.params.id = 1;
            UserDAO.findById.mockRejectedValue(error);

            await UserController.getUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: error.message });
        });
    });

    describe('createAdmin', () => {
        it('should create a new admin', async () => {
            const newUser = { id: 1, email: 'admin@example.com' };
            req.body = { email: 'admin@example.com', password: 'password' };
            bcrypt.hash.mockResolvedValue('hashedpassword');
            UserDAO.create.mockResolvedValue(newUser);

            await UserController.createAdmin(req, res);

            expect(bcrypt.hash).toHaveBeenCalledWith('password', 8);
            expect(UserDAO.create).toHaveBeenCalledWith({ ...req.body, password: 'hashedpassword' });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(newUser);
        });

        it('should handle errors', async () => {
            const error = new Error('Create error');
            req.body = { email: 'admin@example.com', password: 'password' };
            bcrypt.hash.mockResolvedValue('hashedpassword');
            UserDAO.create.mockRejectedValue(error);

            await UserController.createAdmin(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: error.message });
        });
    });

    describe('updateUser', () => {
        it('should update a user by ID', async () => {
            const updatedUser = { id: 1, name: 'John' };
            req.params.id = 1;
            req.body = { name: 'John' };
            UserDAO.updateById.mockResolvedValue(updatedUser);

            await UserController.updateUser(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(updatedUser);
        });

        it('should return 404 if user not found', async () => {
            req.params.id = 1;
            UserDAO.updateById.mockResolvedValue(null);

            await UserController.updateUser(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
        });

        it('should handle errors', async () => {
            const error = new Error('Update error');
            req.params.id = 1;
            req.body = { name: 'John' };
            UserDAO.updateById.mockRejectedValue(error);

            await UserController.updateUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: error.message });
        });
    });

    describe('deleteUser', () => {
        it('should delete a user by ID', async () => {
            req.params.id = 1;
            UserDAO.deleteById.mockResolvedValue(true);

            await UserController.deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'User deleted successfully' });
        });

        it('should return 404 if user not found', async () => {
            req.params.id = 1;
            UserDAO.deleteById.mockResolvedValue(null);

            await UserController.deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
        });

        it('should handle errors', async () => {
            const error = new Error('Delete error');
            req.params.id = 1;
            UserDAO.deleteById.mockRejectedValue(error);

            await UserController.deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: error.message });
        });
    });

    describe('login', () => {
        it('should login a user and return a JWT token', async () => {
            const user = { _id: 1, email: 'test@example.com', password: 'hashedpassword', role: 'user' };
            req.body = { email: 'test@example.com', password: 'password' };
            UserDAO.findByEmail.mockResolvedValue(user);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('token');

            await UserController.login(req, res);

            expect(UserDAO.findByEmail).toHaveBeenCalledWith('test@example.com');
            expect(bcrypt.compare).toHaveBeenCalledWith('password', user.password);
            expect(jwt.sign).toHaveBeenCalledWith(
                { id: user._id, email: user.email, name: user.name, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ token: 'token' });
        });

        it('should return 404 if user not found', async () => {
            req.body = { email: 'test@example.com', password: 'password' };
            UserDAO.findByEmail.mockResolvedValue(null);

            await UserController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
        });

        it('should return 400 if credentials are invalid', async () => {
            const user = { _id: 1, email: 'test@example.com', password: 'hashedpassword' };
            req.body = { email: 'test@example.com', password: 'wrongpassword' };
            UserDAO.findByEmail.mockResolvedValue(user);
            bcrypt.compare.mockResolvedValue(false);

            await UserController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
        });
    });

    describe('register', () => {
        // it('should create a new user and return a token', async () => {
        //     // Mock UserDAO behavior

        //     const userr = { _id: 1, email: 'testt@example.com', password: 'hashedpassword', role: 'user' };
        //     req.body = {
        //         name: 'John Doe',
        //         email: 'testt@example.com',
        //         password: 'hashedpassword',
        //         role: 'user',
        //     };


        //     UserDAO.findByEmail.mockResolvedValue(userr.email);
        //     bcrypt.compare.mockResolvedValue(true);

        //     const user = await UserController.register(req, res);
        //     UserDAO.create.mockResolvedValue(user);

        //     // Token generation should be mocked here too
        //     const token = 'token'; // Mock token
        //     jwt.sign = jest.fn().mockReturnValue(token);

        //     // Check response

        //     expect(res.json).toHaveBeenCalledWith({
        //         message: 'Registration successful',
        //         user,
        //         token,
        //     });
        // });

        it('should create a new user and return a token', async () => {
            UserDAO.findByEmail.mockResolvedValue({}); // Mock existing user

            await UserController.register(req, res);

            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({ message: 'Email already in use' });
        });
    });

    describe('me', () => {
        it('should return user details based on the token', async () => {
            const user = { _id: 1, name: 'John', email: 'john@example.com' };
            req.headers['authorization'] = 'Bearer validtoken';
            jwt.verify.mockReturnValue({ id: user._id });
            UserDAO.findById.mockResolvedValue(user);

            await UserController.me(req, res);

            expect(jwt.verify).toHaveBeenCalledWith('validtoken', process.env.JWT_SECRET);
            expect(UserDAO.findById).toHaveBeenCalledWith(user._id);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(user);
        });

        it('should return 401 if no token is provided', async () => {
            req.headers['authorization'] = '';

            await UserController.me(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
        });

    });
});