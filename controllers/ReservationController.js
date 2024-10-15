const reservationDAO = require('../dao/reservationDAO');
const ReservationDAO = require('../dao/reservationDAO');
const salleDAO = require('../dao/salleDAO');
const seanceDAO = require('../dao/seanceDAO');
const jwt = require('jsonwebtoken');
const userDAO = require('../dao/userDAO');
const sendMail = require('../email');



class ReservationController {
    // Get all Reservations
    async getAllReservations(req, res) {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token not provided' });
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;

            const user = await userDAO.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const Reservations = await ReservationDAO.countByUserId(userId);
            res.status(200).json(Reservations);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get an Reservation by ID
    async getReservation(req, res) {
        const { id } = req.params;
        try {
            const Reservation = await ReservationDAO.findById(id);
            if (!Reservation) {
                return res.status(404).json({ message: 'Reservation not found' });
            }
            res.status(200).json(Reservation);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Create a new Reservation
    async create(req, res) {
        const { seanceId, places } = req.body;

        try {
            const token = req.headers['authorization']?.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'Token not provided' });
            }

            // Decode the token to get the user information
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;

            const user = await userDAO.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Find the seance
            const seance = await seanceDAO.findById(seanceId);
            if (!seance) {
                return res.status(404).json({ message: 'Seance not found' });
            }

            // Find the salle associated with the seance
            const salleId = seance.salle._id;
            const salle = await salleDAO.findById(salleId);
            if (!salle) {
                return res.status(404).json({ message: 'Salle not found' });
            }
            const capacity = parseInt(salle.capacity);

            // Check if any of the places are already reserved
            for (let place of places) {
                const existingReservations = await ReservationDAO.findBySeanceAndPlace(seanceId, place);
                if (existingReservations.length > 0) {
                    return res.status(400).json({ message: `Place ${place} is already reserved for this seance` });
                }
            }

            // Check the total number of reservations for the seance
            const reservationCount = await ReservationDAO.countReservationsBySeance(seanceId);
            if (reservationCount + places.length > capacity) {
                return res.status(400).json({ message: 'The salle does not have enough available places for this seance' });
            }
            // Send confirmation email
            try {
                await sendMail(
                    user.email,
                    "Reservation Confirmation",
                    `Your reservation for the seance ${seance.description} has been confirmed for places ${places.join(', ')}.`
                );
            } catch (emailError) {
                console.error("Error sending email:", emailError.message);
            }
            let status = "waiting";
            if (sendMail) {
                let status = "Confirmed";
                const newReservation = await ReservationDAO.create({
                    status: status,
                    seance: seanceId,
                    places: places,
                    user: user
                });
                res.status(201).json(newReservation);
            } else {
                const newReservation = await ReservationDAO.create({
                    status: status,
                    seance: seanceId,
                    places: places,
                    user: user
                });
                res.status(201).json(newReservation);
            }

        } catch (error) {
            console.error("Error creating Reservation:", error.message);
            res.status(500).json({ message: error.message });
        }
    }


    // Update a Reservation
    async updateReservation(req, res) {
        const { id } = req.params;
        const { seanceId, places } = req.body;
        try {
            const token = req.headers['authorization']?.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'Token not provided' });
            }

            // Decode the token to get the user information
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userIDe = decoded.id;

            // Find the reservation by ID
            const reservation = await reservationDAO.findById(id);
            if (!reservation) {
                return res.status(404).json({ message: 'Reservation not found' });
            }

            // Check if the user owns the reservation
            const userId = reservation.user.toString();
            const user = await userDAO.findById(userId);
            if (userIDe !== userId) {
                return res.status(401).json({ message: 'You don t have permission to update this reservation' });
            }

            // Find the seance
            const seance = await seanceDAO.findById(seanceId);
            if (!seance) {
                return res.status(404).json({ message: 'Seance not found' });
            }

            // Find the salle
            const salleId = seance.salle._id;
            const salle = await salleDAO.findById(salleId);
            const capacity = parseInt(salle.capacity);

            // Check if any of the places are already reserved
            for (let place of places) {
                const existingReservations = await ReservationDAO.findBySeanceAndPlace(seanceId, place);
                if (existingReservations.length > 0) {
                    return res.status(400).json({ message: `Place ${place} is already reserved for this seance` });
                }
            }


            // Check if the salle is fully booked
            const reservationCount = await ReservationDAO.countReservationsBySeance(seanceId);
            if (reservationCount >= capacity) {
                return res.status(400).json({ message: 'The salle is fully booked for this seance' });
            }



            // Send confirmation email
            try {
                await sendMail(
                    user.email,
                    "Update in Your Reservation",
                    `Your reservation is updated to the seance ${seance.description} with this places ${places.join(', ')}.`
                );
            } catch (emailError) {
                console.error("Error sending email:", emailError.message);
            }
            let status = "waiting";
            if (sendMail) {
                let status = "Confirmed";
                // Update the reservation
                const updatedReservation = await ReservationDAO.updateById(id, {
                    seance: seanceId,
                    places: places,
                    status
                });
                if (!updatedReservation) {
                    return res.status(404).json({ message: 'Error updating Reservation' });
                }
                res.status(200).json(updatedReservation);
            } else {
                const updatedReservation = await ReservationDAO.updateById(id, {
                    seance: seanceId,
                    places: places,
                    status
                });
                if (!updatedReservation) {
                    return res.status(404).json({ message: 'Error updating Reservation' });
                }
                res.status(200).json(updatedReservation);
            }
        } catch (error) {
            console.error("Error updating reservation:", error);
            res.status(500).json({ message: error.message });
        }
    }

    // Delete a Reservation
    async deleteReservation(req, res) {
        const { id } = req.params;
        try {
            const deletedReservation = await ReservationDAO.deleteById(id);
            if (!deletedReservation) {
                return res.status(404).json({ message: 'Reservation not found' });
            }
            res.status(200).json({ message: 'Reservation deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }



    async getReservationsWithWaiting(req, res) {
        try {
            const waitingReservations = await ReservationDAO.find({ status: 'waiting' });
            res.status(200).json(waitingReservations);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }



}

module.exports = new ReservationController();