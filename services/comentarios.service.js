const MongoLib = require('../lib/mongo');
const { comentariosCollectionName } = require('../config/config')

module.exports = class ComentariosService {

    constructor() {
        this.collection = comentariosCollectionName;
        this.mongoDB = new MongoLib();
    }

    async getAll({ tags }) {
        const query = tags && { $in: { tags } }
        const data = await this.mongoDB.getAll(this.collection, query)
        return data || ["not found"]
    }

    async getOne(productId) {
        const product = await this.mongoDB.get(this.collection, productId);

        return product || "not found";
    }

    async getByPostId(postId) {

        const comments = await this.mongoDB.getManyComments(this.collection, postId);

        return comments;

    }

    async createOne(data) {
        const createComentarioId = await this.mongoDB.create(this.collection, data);

        return createComentarioId;
    }

    async createMany(data) {
        const createComentarioId = await this.mongoDB.createMany(this.collection, data);

        return createComentarioId;
    }

    async updateOne(docId, data) {
        const updateComentarioId = await this.mongoDB.update(this.collection,
            docId,
            data
        );

        return updateComentarioId;
    }

    async deleteOne(docId) {
        const deletedId = await this.mongoDB.delete(
            this.collection,
            docId
        );
        return deletedId;
    }

}

