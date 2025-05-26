import { ObjectId } from "mongodb";
import { Mongo } from "../database/mongo.js";
import { info, error } from '../helpers/logger.js';

const collectionName = 'products';

export default class productsDataAccess {
    // Método para obter todos os produtos
    async getProducts() {
        try {
            const result = await Mongo.db
                .collection(collectionName)
                .find({})
                .toArray();
            info('Fetched all products');
            return result;
        } catch (err) {
            error(`Error fetching products: ${err.message}`);
            throw err;
        }
    }

    // Método para obter apenas os produtos disponíveis
    async getAvailableProducts() {
        try {
            const result = await Mongo.db
                .collection(collectionName)
                .find({ available: true })
                .toArray();
            info('Fetched available products');
            return result;
        } catch (err) {
            error(`Error fetching available products: ${err.message}`);
            throw err;
        }
    }
    
    // Método para adicionar um novo produto
    async addProduct(productData) {
        try {
            const result = await Mongo.db
                .collection(collectionName)
                .insertOne(productData); // Insere o produto na coleção
            info('Added new product');
            return result;
        } catch (err) {
            error(`Error adding product: ${err.message}`);
            throw err;
        }
    }
       
    // Método para excluir um produto pelo ID
    async deleteProduct(productId) {
        try {
            const result = await Mongo.db
                .collection(collectionName)
                .findOneAndDelete({ _id: new ObjectId(productId) }); // Exclui o produto pelo ID
            info(`Deleted product with ID: ${productId}`);
            return result;
        } catch (err) {
            error(`Error deleting product: ${err.message}`);
            throw err;
        }
    }

    // Método para atualizar um produto pelo ID
    async updateProduct(productId, productData) {
        try {
            const result = await Mongo.db
                .collection(collectionName)
                .findOneAndUpdate(
                    { _id: new ObjectId(productId) },
                    { $set: productData } // Atualiza os dados do produto com as novas informações
                );
            info(`Updated product with ID: ${productId}`);
            return result;
        } catch (err) {
            error(`Error updating product: ${err.message}`);
            throw err;
        }
    }
}
