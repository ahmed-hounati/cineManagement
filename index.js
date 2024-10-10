const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/UserModel');
const userRoutes = require('./routes/userRoutes');
const filmRoutes = require('./routes/filmRoutes');
const salleRoutes = require('./routes/salleRoutes');
const seanceRoutes = require('./routes/seanceRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
require('dotenv').config();


const app = express();
app.use(express.json());
app.use(cors());




mongoose.connect(process.env.MONGO_URI, {
}).then(() => {
    console.log('Connected to MongoDB');
    initializeAdmin();
})
    .catch((err) => console.error('Error connecting to MongoDB:', err));

app.use('/api', userRoutes);
app.use('/api/film', filmRoutes);
app.use('/api/salle', salleRoutes);
app.use('/api/seance', seanceRoutes);
app.use('/api/reservation', reservationRoutes);



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
        }
    } catch (error) {
        console.error('Error initializing admin:', error);
    }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});