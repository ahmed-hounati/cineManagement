const Reservation = require('../models/ReservationModel');

class ReservationDAO {
    async findAll() {
        try {
            return await Reservation.find();
        } catch (error) {
            throw new Error('Error fetching Reservations');
        }
    }

    async findById(id) {
        try {
            return await Reservation.findById(id);
        } catch (error) {
            throw new Error('Error finding Reservation');
        }
    }

    async findBySeanceAndPlace(seanceId, place) {
        return await Reservation.find({ seance: seanceId, place });
    }

    async countReservationsBySeance(seanceId) {
        return await Reservation.countDocuments({ seance: seanceId });
    }


    async create(ReservationData) {
        try {
            const newReservation = new Reservation(ReservationData);
            return await newReservation.save();
        } catch (error) {
            throw new Error('Error creating Reservation');
        }
    }

    async updateById(id, updateData) {
        try {
            return await Reservation.findByIdAndUpdate(id, updateData, { new: true });
        } catch (error) {
            throw new Error('Error updating Reservation');
        }
    }

    async deleteById(id) {
        try {
            return await Reservation.findByIdAndDelete(id);
        } catch (error) {
            throw new Error('Error deleting Reservation');
        }
    }

    async find(query) {
        try {
            return await Reservation.find(query);
        } catch (error) {
            throw new Error('Error fetching reservations: ' + error.message);
        }
    }
}

module.exports = new ReservationDAO();