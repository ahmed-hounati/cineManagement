const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/UserModel');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();


const app = express();
app.use(express.json());




mongoose.connect(process.env.MONGO_URI, {
}).then(() => {
    console.log('Connected to MongoDB');
    initializeAdmin();
})
    .catch((err) => console.error('Error connecting to MongoDB:', err));

app.use('/api', userRoutes);


async function initializeAdmin() {
    try {
        const admin = await Admin.findOne({ email: 'admin@gmail.com' });
        if (!admin) {
            const hashedPassword = await bcrypt.hash('123456789', 8);

            const newAdmin = new Admin({
                name: 'admin',
                email: 'admin@gmail.com',
                password: hashedPassword,
                status: 'active',
                role: 'admin'
            });
            await newAdmin.save();
            console.log('Admin user created with email: admin@gmail.com');
        } else {
            console.log('SuperAdmin exists');
        }
    } catch (error) {
        console.error('Error initializing admin:', error);
    }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});