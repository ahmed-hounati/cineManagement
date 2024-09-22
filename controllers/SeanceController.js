const filmDAO = require('../dao/filmDAO');
const salleDao = require('../dao/salleDAO');
const SeanceDAO = require('../dao/seanceDAO');



class SeanceController {
    // Get all Seances
    async getSeances(req, res) {
        try {
            const Seances = await SeanceDAO.findAll();
            res.status(200).json(Seances);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get an Seance by ID
    async getSeance(req, res) {
        const { id } = req.params;
        try {
            const Seance = await SeanceDAO.findById(id);
            if (!Seance) {
                return res.status(404).json({ message: 'Seance not found' });
            }
            res.status(200).json(Seance);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Create a new Seance
    async create(req, res) {
        const { status, durationTime, filmId, salleId, description, showTime } = req.body;
        try {
            const film = await filmDAO.findById(filmId);
            const salle = await salleDao.findById(salleId);
            if (!film) {
                return res.status(404).json({ message: 'Film not found' });
            }
            if (!salle) {
                return res.status(404).json({ message: 'salle not found' });
            }
            const newSeance = await SeanceDAO.create({ status, durationTime, film, salle, description, showTime });
            res.status(201).json(newSeance);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Update a Seance
    async updateSeance(req, res) {
        const { id } = req.params;
        const { status, durationTime, filmId, salleId, description, showTime } = req.body;
        try {
            const film = await filmDAO.findById(filmId);
            const salle = await salleDao.findById(salleId);
            if (!film) {
                return res.status(404).json({ message: 'Film not found' });
            }
            if (!salle) {
                return res.status(404).json({ message: 'salle not found' });
            }
            const updatedSeance = await SeanceDAO.updateById(id, { status, durationTime, film, salle, description, showTime });
            if (!updatedSeance) {
                return res.status(404).json({ message: 'Seance not found' });
            }
            res.status(200).json(updatedSeance);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Delete a Seance
    async deleteSeance(req, res) {
        const { id } = req.params;
        try {
            const deletedSeance = await SeanceDAO.deleteById(id);
            if (!deletedSeance) {
                return res.status(404).json({ message: 'Seance not found' });
            }
            res.status(200).json({ message: 'Seance deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }


}

module.exports = new SeanceController();
