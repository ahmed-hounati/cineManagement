const minio = require('../minio');
const Film = require('../models/FilmModel');

class FilmDAO {
    async findAll() {
        try {
            return await Film.find();
        } catch (error) {
            throw new Error('Error fetching Films');
        }
    }

    async findById(id) {
        try {
            return await Film.findById(id);
        } catch (error) {
            throw new Error('Error finding Film');
        }
    }


    async create(FilmData, files) {
        const { name, duration, description, status } = FilmData;

        if (!files.poster) {
            throw new Error("File is required");
        }

        const posterUrl = await this.uploadMoviePoster(files.poster, 'posters');

        const movie = new Film({
            name,
            description,
            image: posterUrl,
            duration,
            status
        });

        return await movie.save();
    }

    async updateById(id, updateData) {
        try {
            return await Film.findByIdAndUpdate(id, updateData, { new: true });
        } catch (error) {
            throw new Error('Error updating Film');
        }
    }

    async deleteById(id) {
        try {
            return await Film.findByIdAndDelete(id);
        } catch (error) {
            throw new Error('Error deleting Film');
        }
    }

    async uploadMoviePoster(file, folder) {
        const bucketName = 'cinemanager';
        const fileName = `${folder}/${file.originalname}`;

        const exists = await minio.bucketExists(bucketName);
        if (!exists) {
            await minio.makeBucket(bucketName, 'us-east-1');
        }


        await minio.fPutObject(bucketName, fileName, file.path);
        return `http://127.0.0.1:9000/${bucketName}/${fileName}`;
    }
}

module.exports = new FilmDAO();