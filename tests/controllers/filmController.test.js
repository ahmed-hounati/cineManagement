const FilmController = require('../../controllers/FilmController');
const FilmDAO = require('../../dao/filmDAO');

jest.mock('../../dao/filmDAO');

let req, res;

beforeEach(() => {
    req = { params: {}, body: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
});

describe('FilmController', () => {
    // Get all Films
    describe('getFilms', () => {
        it('should return all films with a 200 status code', async () => {
            const films = [{ name: 'Film 1' }, { name: 'Film 2' }];
            FilmDAO.findAll.mockResolvedValue(films);

            await FilmController.getFilms(req, res);

            expect(FilmDAO.findAll).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(films);
        });

        it('should return 500 if an error occurs', async () => {
            const errorMessage = 'Error fetching films';
            FilmDAO.findAll.mockRejectedValue(new Error(errorMessage));

            await FilmController.getFilms(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
        });
    });

    // Get Film by ID
    describe('getFilm', () => {
        it('should return a film by id with a 200 status code', async () => {
            const film = { id: 1, name: 'Film 1' };
            req.params.id = 1;
            FilmDAO.findById.mockResolvedValue(film);

            await FilmController.getFilm(req, res);

            expect(FilmDAO.findById).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(film);
        });

        it('should return 404 if the film is not found', async () => {
            req.params.id = 1;
            FilmDAO.findById.mockResolvedValue(null);

            await FilmController.getFilm(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Film not found' });
        });

        it('should return 500 if an error occurs', async () => {
            const errorMessage = 'Error fetching film';
            req.params.id = 1;
            FilmDAO.findById.mockRejectedValue(new Error(errorMessage));

            await FilmController.getFilm(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
        });
    });

    // Create a new Film
    describe('create', () => {
        it('should create a new film and return it with a 201 status code', async () => {
            const newFilm = { name: 'New Film', duration: 120 };
            req.body = newFilm;
            FilmDAO.create.mockResolvedValue(newFilm);

            await FilmController.create(req, res);

            expect(FilmDAO.create).toHaveBeenCalledWith(newFilm);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(newFilm);
        });

        it('should return 400 if an error occurs during creation', async () => {
            const errorMessage = 'Error creating film';
            req.body = { name: 'Film' };
            FilmDAO.create.mockRejectedValue(new Error(errorMessage));

            await FilmController.create(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
        });
    });

    // Update a Film
    describe('updateFilm', () => {

        it('should return 404 if the film to update is not found', async () => {
            req.params.id = 1;
            req.body = { name: 'Nonexistent Film' };
            FilmDAO.updateById.mockResolvedValue(null);

            await FilmController.updateFilm(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Film not found' });
        });

        it('should return 400 if an error occurs during update', async () => {
            const errorMessage = 'Error updating film';
            req.params.id = 1;
            req.body = { name: 'Film' };
            FilmDAO.updateById.mockRejectedValue(new Error(errorMessage));

            await FilmController.updateFilm(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
        });
    });

    // Delete a Film
    describe('deleteFilm', () => {
        it('should delete a film and return a success message with a 200 status code', async () => {
            req.params.id = 1;
            FilmDAO.deleteById.mockResolvedValue(true);

            await FilmController.deleteFilm(req, res);

            expect(FilmDAO.deleteById).toHaveBeenCalledWith(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Film deleted successfully' });
        });

        it('should return 404 if the film to delete is not found', async () => {
            req.params.id = 1;
            FilmDAO.deleteById.mockResolvedValue(false);

            await FilmController.deleteFilm(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Film not found' });
        });

        it('should return 500 if an error occurs during deletion', async () => {
            const errorMessage = 'Error deleting film';
            req.params.id = 1;
            FilmDAO.deleteById.mockRejectedValue(new Error(errorMessage));

            await FilmController.deleteFilm(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
        });
    });
});
