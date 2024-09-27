const SalleController = require('../../controllers/SalleController');
const SalleDAO = require('../../dao/salleDAO');

jest.mock('../../dao/salleDAO');

let req, res;

beforeEach(() => {
    req = { params: {}, body: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
});

describe('SalleController', () => {
    // Get all Salles
    describe('getSalles', () => {
        it('should return all salles with a 200 status code', async () => {
            const salles = [{ name: 'Salle 1' }, { name: 'Salle 2' }];
            SalleDAO.findAll.mockResolvedValue(salles);

            await SalleController.getSalles(req, res);

            expect(SalleDAO.findAll).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(salles);
        });

        it('should return 500 if an error occurs', async () => {
            const errorMessage = 'Error fetching salles';
            SalleDAO.findAll.mockRejectedValue(new Error(errorMessage));

            await SalleController.getSalles(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
        });
    });

    // Get Salle by ID
    describe('getSalle', () => {
        it('should return a salle by id with a 200 status code', async () => {
            const salle = { id: 1, name: 'Salle 1' };
            req.params.id = 1;
            SalleDAO.findById.mockResolvedValue(salle);

            await SalleController.getSalle(req, res);

            expect(SalleDAO.findById).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(salle);
        });

        it('should return 404 if the salle is not found', async () => {
            req.params.id = 1;
            SalleDAO.findById.mockResolvedValue(null);

            await SalleController.getSalle(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Salle not found' });
        });

        it('should return 500 if an error occurs', async () => {
            const errorMessage = 'Error fetching salle';
            req.params.id = 1;
            SalleDAO.findById.mockRejectedValue(new Error(errorMessage));

            await SalleController.getSalle(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
        });
    });

    // Create a new Salle
    describe('create', () => {
        it('should create a new salle and return it with a 201 status code', async () => {
            const newSalle = { name: 'New Salle', capacity: 100 };
            req.body = newSalle;
            SalleDAO.create.mockResolvedValue(newSalle);

            await SalleController.create(req, res);

            expect(SalleDAO.create).toHaveBeenCalledWith(newSalle);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(newSalle);
        });

        it('should return 400 if an error occurs during creation', async () => {
            const errorMessage = 'Error creating salle';
            req.body = { name: 'Salle' };
            SalleDAO.create.mockRejectedValue(new Error(errorMessage));

            await SalleController.create(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
        });
    });

    // Update a Salle
    describe('updateSalle', () => {

        it('should return 404 if the salle to update is not found', async () => {
            req.params.id = 1;
            req.body = { name: 'Nonexistent Salle' };
            SalleDAO.updateById.mockResolvedValue(null);

            await SalleController.updateSalle(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Salle not found' });
        });

        it('should return 400 if an error occurs during update', async () => {
            const errorMessage = 'Error updating salle';
            req.params.id = 1;
            req.body = { name: 'Salle' };
            SalleDAO.updateById.mockRejectedValue(new Error(errorMessage));

            await SalleController.updateSalle(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
        });
    });

    // Delete a Salle
    describe('deleteSalle', () => {
        it('should delete a salle and return a success message with a 200 status code', async () => {
            req.params.id = 1;
            SalleDAO.deleteById.mockResolvedValue(true);

            await SalleController.deleteSalle(req, res);

            expect(SalleDAO.deleteById).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Salle deleted successfully' });
        });

        it('should return 404 if the salle to delete is not found', async () => {
            req.params.id = 1;
            SalleDAO.deleteById.mockResolvedValue(false);

            await SalleController.deleteSalle(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Salle not found' });
        });

        it('should return 500 if an error occurs during deletion', async () => {
            const errorMessage = 'Error deleting salle';
            req.params.id = 1;
            SalleDAO.deleteById.mockRejectedValue(new Error(errorMessage));

            await SalleController.deleteSalle(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
        });
    });
});
