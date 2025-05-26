import productsDataAccess from "../DataAccess/products.js";
import { ok, serverError } from '../helpers/httpResponse.js';
import { info, error } from '../helpers/logger.js'; // Import logger

export default class ProductsControllers {
    constructor() {
        this.dataAccess = new productsDataAccess(); // Instancia a classe de acesso aos dados de produtos
    }

    // Método para obter todos os produtos
    async getProducts() {
        try {
            const products = await this.dataAccess.getProducts(); // Obtém todos os produtos
            info('Fetched all products');
            return ok(products); 
        } catch (err) {
            error(`Error fetching products: ${err.message}`);
            return serverError(err); 
        }
    }

    // Método para obter todos os produtos disponíveis
    async getAvailableProducts() {
        try {
            const products = await this.dataAccess.getAvailableProducts(); // Obtém produtos disponíveis
            info('Fetched available products');
            return ok(products); 
        } catch (err) {
            error(`Error fetching available products: ${err.message}`);
            return serverError(err); 
        }
    }

    // Método para excluir um produto pelo ID
    async deleteProduct(productId) {
        try {
            const result = await this.dataAccess.deleteProduct(productId); // Exclui o produto pelo ID
            info(`Deleted product with ID: ${productId}`);
            return ok(result); 
        } catch (err) {
            error(`Error deleting product: ${err.message}`);
            return serverError(err); 
        }
    }

    // Método para adicionar um novo produto
    async addProducts(productData) {
        try {
            const result = await this.dataAccess.addProduct(productData); // Adiciona um novo produto
            info('Added new product');
            return ok(result); 
        } catch (err) {
            error(`Error adding product: ${err.message}`);
            return serverError(err); 
        }
    }

    // Método para atualizar as informações de um produto pelo ID
    async updateProduct(productId, productData) {
        try {
            const result = await this.dataAccess.updateProduct(productId, productData); // Atualiza o produto pelo ID
            info(`Updated product with ID: ${productId}`);
            return ok(result); 
        } catch (err) {
            error(`Error updating product: ${err.message}`);
            return serverError(err); 
        }
    }
}
