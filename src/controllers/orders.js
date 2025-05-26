import OrdersDataAccess from '../DataAccess/orders.js';
import { ok, serverError } from '../helpers/httpResponse.js';
import { info, error } from '../helpers/logger.js'; // Import logger

export default class OrdersControllers {
    constructor() {
        this.dataAccess = new OrdersDataAccess(); // Instancia a classe de acesso aos dados de pedidos
    }

    // Método para obter todos os pedidos
    async getOrders() {
        try {
            const orders = await this.dataAccess.getOrders(); // Obtém todos os pedidos
            info('Fetched all orders');
            return ok(orders); 
        } catch (err) {
            error(`Error fetching orders: ${err.message}`);
            return serverError(err); 
        }
    }

    // Método para obter pedidos de um usuário pelo ID
    async getOrdersByUserId(userId) {
        try {
            const orders = await this.dataAccess.getOrdersByUserId(userId); // Obtém todos os pedidos do usuário
            info(`Fetched orders for user ID: ${userId}`);
            return ok(orders); 
        } catch (err) {
            error(`Error fetching orders by user ID: ${err.message}`);
            return serverError(err); 
        }
    }

    // Método para excluir um pedido pelo ID
    async deleteOrder(orderId) {
        try {
            const result = await this.dataAccess.deleteOrder(orderId); // Exclui o pedido pelo ID
            info(`Deleted order with ID: ${orderId}`);
            return ok(result); 
        } catch (err) {
            error(`Error deleting order: ${err.message}`);
            return serverError(err); 
        }
    }

    // Método para adicionar um novo pedido
    async addOrders(orderData) {
        try {
            const result = await this.dataAccess.addOrder(orderData); // Adiciona um novo pedido
            info('Added new order');
            return ok(result); 
        } catch (err) {
            error(`Error adding order: ${err.message}`);
            return serverError(err); 
        }
    }

    // Método para atualizar as informações de um pedido pelo ID
    async updateOrder(orderId, orderData) {
        try {
            const result = await this.dataAccess.updateOrder(orderId, orderData); // Atualiza o pedido pelo ID
            info(`Updated order with ID: ${orderId}`);
            return ok(result); 
        } catch (err) {
            error(`Error updating order: ${err.message}`);
            return serverError(err); 
        }
    }

    // Método para adicionar um item a um pedido
    async addItemToOrder(orderId, itemData) {
        try {
            const result = await this.dataAccess.addItemToOrder(orderId, itemData); // Adiciona o item ao pedido
            info(`Added item to order with ID: ${orderId}`);
            return ok(result);
        } catch (err) {
            error(`Error adding item to order: ${err.message}`);
            return serverError(err);
        }
    }

    // Método para atualizar a quantidade de um item em um pedido
    async updateItemQuantity(orderId, itemId, quantity) {
        try {
            const result = await this.dataAccess.updateItemQuantity(orderId, itemId, quantity); // Atualiza a quantidade do item
            info(`Updated item quantity for order ID: ${orderId}, item ID: ${itemId}`);
            return ok(result);
        } catch (err) {
            error(`Error updating item quantity: ${err.message}`);
            return serverError(err);
        }
    }

    // Método para remover um item de um pedido
    async removeItemFromOrder(orderId, itemId) {
        try {
            const result = await this.dataAccess.removeItemFromOrder(orderId, itemId); // Remove o item do pedido
            info(`Removed item from order ID: ${orderId}, item ID: ${itemId}`);
            return ok(result);
        } catch (err) {
            error(`Error removing item from order: ${err.message}`);
            return serverError(err);
        }
    }
}
