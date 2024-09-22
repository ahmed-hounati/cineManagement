const Salle = require('../models/SalleModel');

class SalleDAO {
    async findAll() {
        try {
            return await Salle.find();
        } catch (error) {
            throw new Error('Error fetching Salles');
        }
    }

    async findById(id) {
        try {
            return await Salle.findById(id);
        } catch (error) {
            throw new Error('Error finding Salle');
        }
    }


    async create(SalleData) {
        try {
            const newSalle = new Salle(SalleData);
            return await newSalle.save();
        } catch (error) {
            throw new Error('Error creating Salle');
        }
    }

    async updateById(id, updateData) {
        try {
            return await Salle.findByIdAndUpdate(id, updateData, { new: true });
        } catch (error) {
            throw new Error('Error updating Salle');
        }
    }

    async deleteById(id) {
        try {
            return await Salle.findByIdAndDelete(id);
        } catch (error) {
            throw new Error('Error deleting Salle');
        }
    }
}

module.exports = new SalleDAO();