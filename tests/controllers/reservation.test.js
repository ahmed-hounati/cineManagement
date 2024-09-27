const ReservationController = require('../../controllers/ReservationController');
const ReservationDAO = require('../../dao/reservationDAO');
const salleDAO = require('../../dao/salleDAO');
const seanceDAO = require('../../dao/seanceDAO');
const userDAO = require('../../dao/userDAO');
const jwt = require('jsonwebtoken');
const sendMail = require('../../email');

jest.mock('../../dao/reservationDAO');
jest.mock('../../dao/salleDAO');
jest.mock('../../dao/seanceDAO');
jest.mock('../../dao/userDAO');
jest.mock('jsonwebtoken');
jest.mock('../../email');

let req, res;

beforeEach(() => {
    req = { params: {}, body: {}, headers: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
});

describe('ReservationController', () => {
    // Get all Reservations
    describe('getReservations', () => {
        it('should return all reservations with a 200 status code', async () => {
            const reservations = [{ id: 1 }, { id: 2 }];
            ReservationDAO.findAll.mockResolvedValue(reservations);

            await ReservationController.getReservations(req, res);

            expect(ReservationDAO.findAll).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(reservations);
        });

        it('should return 500 if an error occurs', async () => {
            const errorMessage = 'Error fetching reservations';
            ReservationDAO.findAll.mockRejectedValue(new Error(errorMessage));

            await ReservationController.getReservations(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
        });
    });

    // Get Reservation by ID
    describe('getReservation', () => {
        it('should return a reservation by id with a 200 status code', async () => {
            const reservation = { id: 1 };
            req.params.id = 1;
            ReservationDAO.findById.mockResolvedValue(reservation);

            await ReservationController.getReservation(req, res);

            expect(ReservationDAO.findById).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(reservation);
        });

        it('should return 404 if the reservation is not found', async () => {
            req.params.id = 1;
            ReservationDAO.findById.mockResolvedValue(null);

            await ReservationController.getReservation(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Reservation not found' });
        });

        it('should return 500 if an error occurs', async () => {
            const errorMessage = 'Error fetching reservation';
            req.params.id = 1;
            ReservationDAO.findById.mockRejectedValue(new Error(errorMessage));

            await ReservationController.getReservation(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
        });
    });

    // Create a new Reservation
    describe('create', () => {
        it('should create a new reservation and send confirmation email', async () => {
            req.body = { seanceId: 1, places: ['A1', 'A2'] };
            req.headers['authorization'] = 'Bearer validToken';

            const decodedUser = { id: 1 };
            jwt.verify.mockReturnValue(decodedUser);
            const user = { id: 1, email: 'user@test.com' };
            userDAO.findById.mockResolvedValue(user);
            const seance = { id: 1, salle: { _id: 1 } };
            seanceDAO.findById.mockResolvedValue(seance);
            const salle = { id: 1, capacity: 10 };
            salleDAO.findById.mockResolvedValue(salle);
            ReservationDAO.findBySeanceAndPlace.mockResolvedValue([]);
            ReservationDAO.countReservationsBySeance.mockResolvedValue(0);

            await ReservationController.create(req, res);

            expect(jwt.verify).toHaveBeenCalledWith('validToken', process.env.JWT_SECRET);
            expect(ReservationDAO.create).toHaveBeenCalledWith({
                status: 'Confirmed',
                seance: 1,
                places: ['A1', 'A2'],
                user
            });
            expect(sendMail).toHaveBeenCalledWith(
                'user@test.com',
                'Reservation Confirmation',
                'Your reservation for the seance undefined has been confirmed for places A1, A2.'
            );
            expect(res.status).toHaveBeenCalledWith(201);
        });

        it('should return 401 if no token is provided', async () => {
            req.body = { seanceId: 1, places: ['A1', 'A2'] };

            await ReservationController.create(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Token not provided' });
        });

        it('should return 400 if a place is already reserved', async () => {
            req.body = { seanceId: 1, places: ['A1'] };
            req.headers['authorization'] = 'Bearer validToken';

            const decodedUser = { id: 1 };
            jwt.verify.mockReturnValue(decodedUser);
            const user = { id: 1 };
            userDAO.findById.mockResolvedValue(user);
            seanceDAO.findById.mockResolvedValue({ id: 1, salle: { _id: 1 } });
            salleDAO.findById.mockResolvedValue({ id: 1, capacity: 10 });
            ReservationDAO.findBySeanceAndPlace.mockResolvedValue([{ id: 1 }]);

            await ReservationController.create(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Place A1 is already reserved for this seance' });
        });

        it('should return 404 if user is not found', async () => {
            req.body = { seanceId: 1, places: ['A1'] };
            req.headers['authorization'] = 'Bearer validToken';

            const decodedUser = { id: 1 };
            jwt.verify.mockReturnValue(decodedUser);
            userDAO.findById.mockResolvedValue(null);

            await ReservationController.create(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
        });
    });


    // Delete a Reservation
    describe('deleteReservation', () => {
        it('should delete a reservation and return success message', async () => {
            req.params.id = 1;
            ReservationDAO.deleteById.mockResolvedValue(true);

            await ReservationController.deleteReservation(req, res);

            expect(ReservationDAO.deleteById).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Reservation deleted successfully' });
        });

        it('should return 404 if reservation is not found', async () => {
            req.params.id = 1;
            ReservationDAO.deleteById.mockResolvedValue(null);

            await ReservationController.deleteReservation(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Reservation not found' });
        });

        it('should return 500 if an error occurs during deletion', async () => {
            const errorMessage = 'Error deleting reservation';
            req.params.id = 1;
            ReservationDAO.deleteById.mockRejectedValue(new Error(errorMessage));

            await ReservationController.deleteReservation(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
        });
    });
});
