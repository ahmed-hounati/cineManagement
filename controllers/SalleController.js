const SalleDAO = require('../dao/salleDAO');


class SalleController {
    // Get all Salles
    async getSalles(req, res) {
        try {
            const Salles = await SalleDAO.findAll();
            res.status(200).json(Salles);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get an Salle by ID
    async getSalle(req, res) {
        const { id } = req.params;
        try {
            const Salle = await SalleDAO.findById(id);
            if (!Salle) {
                return res.status(404).json({ message: 'Salle not found' });
            }
            res.status(200).json(Salle);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Create a new Salle
    async create(req, res) {
        const { status, capacity, name } = req.body;
        try {
            const newSalle = await SalleDAO.create({ status, capacity, name });
            res.status(201).json(newSalle);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Update a Salle
    async updateSalle(req, res) {
        const { id } = req.params;
        const { status, capacity, name } = req.body;
        try {
            const updatedSalle = await SalleDAO.updateById(id, { status, capacity, name });
            if (!updatedSalle) {
                return res.status(404).json({ message: 'Salle not found' });
            }
            res.status(200).json(updatedSalle);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Delete a Salle
    async deleteSalle(req, res) {
        const { id } = req.params;
        try {
            const deletedSalle = await SalleDAO.deleteById(id);
            if (!deletedSalle) {
                return res.status(404).json({ message: 'Salle not found' });
            }
            res.status(200).json({ message: 'Salle deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }


}

module.exports = new SalleController();