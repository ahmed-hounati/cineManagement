const filmDAO = require('../dao/filmDAO');
const reservationDAO = require('../dao/reservationDAO');
const salleDAO = require('../dao/salleDAO');
const SeanceDAO = require('../dao/seanceDAO');



class SeanceController {
    // Get all Seances
    async getSeances(req, res) {
        try {
            const seances = await SeanceDAO.findAll();

            const populatedSeances = await Promise.all(
                seances.map(async (seance) => {
                    const [film, salle] = await Promise.all([
                        filmDAO.findById(seance.film),
                        salleDAO.findById(seance.salle)
                    ]);
                    seance.film = film;
                    seance.salle = salle;

                    return {
                        ...seance.toObject(),
                        film,
                        salle
                    }
                })
            );

            res.status(200).json(populatedSeances);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }


    // Get an Seance by ID
    async getSeance(req, res) {
        const { id } = req.params;
        try {
            const seance = await SeanceDAO.findById(id);
            if (!seance) {
                return res.status(404).json({ message: 'Seance not found' });
            }

            const [film, salle] = await Promise.all([
                filmDAO.findById(seance.film),
                salleDAO.findById(seance.salle),
            ]);

            if (!film) {
                return res.status(404).json({ message: 'Film not found' });
            }

            if (!salle) {
                return res.status(404).json({ message: 'Salle not found' });
            }

            seance.film = film;
            seance.salle = salle;

            res.status(200).json(seance);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }


    // Create a new Seance
    async create(req, res) {
        const { status, durationTime, filmId, salleId, description, showTime } = req.body;
        try {
            const film = await filmDAO.findById(filmId);
            const salle = await salleDAO.findById(salleId);
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
            const salle = await salleDAO.findById(salleId);
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

    async getPlaces(req, res) {
        const { id } = req.params;
        try {
            const seance = await SeanceDAO.findById(id);
            if (!seance) {
                return res.status(404).json({ message: 'Seance not found' });
            }

            const salleId = seance.salle._id;
            const salle = await salleDAO.findById(salleId);
            if (!salle) {
                return res.status(404).json({ message: 'Salle not found' });
            }

            const capacity = parseInt(salle.capacity);

            const allPlaces = Array.from({ length: capacity }, (_, index) => `${index + 1}`);

            const availablePlaces = [];


            for (let place of allPlaces) {
                const existingReservations = await reservationDAO.findBySeanceAndPlace(id, place);
                if (existingReservations.length === 0) {
                    availablePlaces.push(place);
                }
            }
            return res.status(200).json(availablePlaces);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }



}

module.exports = new SeanceController();
