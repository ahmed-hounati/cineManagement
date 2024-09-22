const Seance = require('../models/SeanceModel');

class SeanceDAO {
    async findAll() {
        try {
            return await Seance.find();
        } catch (error) {
            throw new Error('Error fetching Seances');
        }
    }

    async findById(id) {
        try {
            return await Seance.findById(id);
        } catch (error) {
            throw new Error('Error finding Seance');
        }
    }


    async create(SeanceData) {
        try {
            const newSeance = new Seance(SeanceData);
            return await newSeance.save();
        } catch (error) {
            throw new Error('Error creating Seance');
        }
    }

    async updateById(id, updateData) {
        try {
            return await Seance.findByIdAndUpdate(id, updateData, { new: true });
        } catch (error) {
            throw new Error('Error updating Seance');
        }
    }

    async deleteById(id) {
        try {
            return await Seance.findByIdAndDelete(id);
        } catch (error) {
            throw new Error('Error deleting Seance');
        }
    }
}

module.exports = new SeanceDAO();