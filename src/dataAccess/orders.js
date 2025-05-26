import { ObjectId } from "mongodb";
import { Mongo } from "../database/mongo.js";
import { info, error } from '../helpers/logger.js';

const collectionName = "orders";

export default class OrdersDataAccess {
  // Método para obter todos os pedidos
  async getOrders() {
    try {
      const result = await Mongo.db
        .collection(collectionName)
        .aggregate([
          {
            $lookup: {
              from: "orderItems",
              localField: "_id",
              foreignField: "orderId",
              as: "orderItems",
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "userDetails",
            },
          },
          {
            $project: {
              "userDetails.password": 0,
              "userDetails.salt": 0,
            },
          },
          {
            $unwind: "$orderItems",
          },
          {
            $lookup: {
              from: "products",
              localField: "orderItems.productId",
              foreignField: "_id",
              as: "orderItems.itemDetails",
            },
          },
          {
            $group: {
              _id: "$_id",
              userDetails: { $first: "$userDetails" },
              orderItems: { $push: "$orderItems" },
              pickupStatus: { $first: "$pickupStatus" },
              pickupTime: { $first: "$pickupTime" },
              deliveryDate: { $first: "$deliveryDate" },
              createDate: { $first: "$createDate" } 
            },
          },
        ])
        .toArray();
      info('Fetched all orders');
      return result;
    } catch (err) {
      error(`Error fetching orders: ${err.message}`);
      throw err;
    }
  }

  // Método para obter os pedidos de um usuário pelo ID
  async getOrdersByUserId(userId) {
    try {
      const result = await Mongo.db
        .collection(collectionName)
        .aggregate([
          {
            $match: { userId: new ObjectId(userId) },
          },
          {
            $lookup: {
              from: "orderItems",
              localField: "_id",
              foreignField: "orderId",
              as: "orderItems",
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "userDetails",
            },
          },
          {
            $project: {
              "userDetails.password": 0,
              "userDetails.salt": 0,
            },
          },
          {
            $unwind: "$orderItems",
          },
          {
            $lookup: {
              from: "products",
              localField: "orderItems.productId",
              foreignField: "_id",
              as: "orderItems.itemDetails",
            },
          },
          {
            $group: {
              _id: "$_id",
              userDetails: { $first: "$userDetails" },
              orderItems: { $push: "$orderItems" },
              pickupStatus: { $first: "$pickupStatus" },
              pickupTime: { $first: "$pickupTime" },
              createDate: { $first: "$createDate" },
              deliveryDate: { $first: "$deliveryDate" } 
            },
          },
        ])
        .toArray();
      info(`Fetched orders for user ID: ${userId}`);
      return result;
    } catch (err) {
      error(`Error fetching orders by user ID: ${err.message}`);
      throw err;
    }
  }

  // Método para adicionar um novo pedido
  async addOrder(orderData) {
    try {
      const { items, ...orderDataRest } = orderData;
      orderDataRest.createdAt = new Date();
      orderDataRest.pickupStatus = "pending";
      orderDataRest.userId = new ObjectId(orderDataRest.userId);

      const newOrder = await Mongo.db
        .collection(collectionName)
        .insertOne(orderDataRest);

      if (!newOrder.insertedId) {
        throw new Error("order cannot be inserted");
      }

      items.map((item) => {
        item.productId = new ObjectId(item.productId);
        item.orderId = new ObjectId(newOrder.insertedId);
      });
      const result = await Mongo.db.collection("orderItems").insertMany(items); // Insere o produto na coleção
      info('Added new order');
      return result;
    } catch (err) {
      error(`Error adding order: ${err.message}`);
      throw err;
    }
  }

  // Método para excluir um pedido pelo ID
  async deleteOrder(orderId) {
    try {
      const itemsToDelete = await Mongo.db
        .collection("orderItems")
        .deleteMany({ orderId: new ObjectId(orderId) });

      const orderToDelete = await Mongo.db
        .collection(collectionName)
        .findOneAndDelete({ _id: new ObjectId(orderId) });

      const result = {
        itemsToDelete,
        orderToDelete,
      };
      info(`Deleted order with ID: ${orderId}`);
      return result;
    } catch (err) {
      error(`Error deleting order: ${err.message}`);
      throw err;
    }
  }

  // Método para atualizar um pedido pelo ID
  async updateOrder(orderId, orderData) {
    try {
      const result = await Mongo.db.collection(collectionName).findOneAndUpdate(
        { _id: new ObjectId(orderId) },
        { $set: orderData } // Atualiza os dados do pedido com as novas informações
      );
      info(`Updated order with ID: ${orderId}`);
      return result;
    } catch (err) {
      error(`Error updating order: ${err.message}`);
      throw err;
    }
  }

  // Método para adicionar um item a um pedido
  async addItemToOrder(orderId, itemData) {
    try {
      itemData.productId = new ObjectId(itemData.productId);
      itemData.orderId = new ObjectId(orderId);

      const result = await Mongo.db.collection("orderItems").insertOne(itemData); // Adiciona o item à coleção de items
      info(`Added item to order with ID: ${orderId}`);
      return result;
    } catch (err) {
      error(`Error adding item to order: ${err.message}`);
      throw err;
    }
  }

  async updateItemQuantity(orderId, itemId, quantity) {
    try {
      const result = await Mongo.db
        .collection("orderItems")
        .findOneAndUpdate(
          { orderId: new ObjectId(orderId), _id: new ObjectId(itemId) },
          { $set: { quantity: quantity } }, // Atualiza a quantidade do item no pedido
          { returnDocument: "after" } // Retorna o documento atualizado
        );
      info(`Updated item quantity for order ID: ${orderId}, item ID: ${itemId}`);
      return result.value; // Retorna o documento atualizado
    } catch (err) {
      error(`Error updating item quantity: ${err.message}`);
      throw err;
    }
  }
  
  // Método para remover um item de um pedido
  async removeItemFromOrder(orderId, itemId) {
    try {
      const result = await Mongo.db
        .collection("orderItems")
        .deleteOne({ orderId: new ObjectId(orderId), _id: new ObjectId(itemId) }); // Remove o item da coleção
      info(`Removed item from order with ID: ${orderId}, item ID: ${itemId}`);
      return result;
    } catch (err) {
      error(`Error removing item from order: ${err.message}`);
      throw err;
    }
  }
}
