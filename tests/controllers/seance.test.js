const SeanceController = require('../../controllers/SeanceController');
const SeanceDAO = require('../../dao/seanceDAO');
const filmDAO = require('../../dao/filmDAO');
const salleDAO = require('../../dao/salleDAO');
const reservationDAO = require('../../dao/reservationDAO');

jest.mock('../../dao/seanceDAO');
jest.mock('../../dao/filmDAO');
jest.mock('../../dao/salleDAO');
jest.mock('../../dao/reservationDAO');

let req, res;

beforeEach(() => {
    req = { params: {}, body: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
});

describe('SeanceController', () => {
    // Get all Seances
    describe('getSeances', () => {
        it('should return all seances with a 200 status code', async () => {
            const seances = [{ name: 'Seance 1' }, { name: 'Seance 2' }];
            SeanceDAO.findAll.mockResolvedValue(seances);

            await SeanceController.getSeances(req, res);

            expect(SeanceDAO.findAll).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(seances);
        });

        it('should return 500 if an error occurs', async () => {
            const errorMessage = 'Error fetching seances';
            SeanceDAO.findAll.mockRejectedValue(new Error(errorMessage));

            await SeanceController.getSeances(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
        });
    });

    // Get Seance by ID
    describe('getSeance', () => {
        it('should return a seance by id with a 200 status code', async () => {
            const seance = { id: 1, name: 'Seance 1' };
            req.params.id = 1;
            SeanceDAO.findById.mockResolvedValue(seance);

            await SeanceController.getSeance(req, res);

            expect(SeanceDAO.findById).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(seance);
        });

        it('should return 404 if the seance is not found', async () => {
            req.params.id = 1;
            SeanceDAO.findById.mockResolvedValue(null);

            await SeanceController.getSeance(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Seance not found' });
        });

        it('should return 500 if an error occurs', async () => {
            const errorMessage = 'Error fetching seance';
            req.params.id = 1;
            SeanceDAO.findById.mockRejectedValue(new Error(errorMessage));

            await SeanceController.getSeance(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
        });
    });

    // Delete a Seance
    describe('deleteSeance', () => {
        it('should delete a seance and return a success message with a 200 status code', async () => {
            req.params.id = 1;
            SeanceDAO.deleteById.mockResolvedValue(true);

            await SeanceController.deleteSeance(req, res);

            expect(SeanceDAO.deleteById).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Seance deleted successfully' });
        });

        it('should return 404 if the seance to delete is not found', async () => {
            req.params.id = 1;
            SeanceDAO.deleteById.mockResolvedValue(false);

            await SeanceController.deleteSeance(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Seance not found' });
        });

        it('should return 500 if an error occurs during deletion', async () => {
            const errorMessage = 'Error deleting seance';
            req.params.id = 1;
            SeanceDAO.deleteById.mockRejectedValue(new Error(errorMessage));

            await SeanceController.deleteSeance(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
        });
    });

    // Get available places for a Seance
    describe('getPlaces', () => {

        it('should return 404 if seance or salle is not found', async () => {
            req.params.id = 1;

            SeanceDAO.findById.mockResolvedValue(null);

            await SeanceController.getPlaces(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Seance not found' });
        });

        it('should return 500 if an error occurs', async () => {
            const errorMessage = 'Error fetching places';
            req.params.id = 1;

            SeanceDAO.findById.mockRejectedValue(new Error(errorMessage));

            await SeanceController.getPlaces(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
        });
    });
});
