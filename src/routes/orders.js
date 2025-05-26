import express from 'express'
import OrdersControllers from '../Controllers/orders.js'
import { debug } from "../helpers/logger.js"; // Import logger

const ordersRouter = express.Router()
const ordersControllers = new OrdersControllers()

ordersRouter.get('/', async (req, res) => {
    debug('GET /orders called');
    const { success, statusCode, body } = await ordersControllers.getOrders(req.params.id)
    res.status(statusCode).send({success, statusCode, body})
})
ordersRouter.get('/userorders/:id', async (req, res) => {
    debug(`GET /orders/userorders/${req.params.id} called`);
    const { success, statusCode, body } = await ordersControllers.getOrdersByUserId(req.params.id)
    res.status(statusCode).send({success, statusCode, body})
})

ordersRouter.post('/', async (req, res) => {
    debug('POST /orders called');
    const { success, statusCode, body } = await ordersControllers.addOrders(req.body)
    res.status(statusCode).send({ success, statusCode, body })
})

ordersRouter.delete('/:id', async (req, res) => {
    debug(`DELETE /orders/${req.params.id} called`);
    const { success, statusCode, body } = await ordersControllers.deleteOrder(req.params.id)
    res.status(statusCode).send({ success, statusCode, body })
})

ordersRouter.put('/:id', async (req, res) => {
    debug(`PUT /orders/${req.params.id} called`);
    const { success, statusCode, body } = await ordersControllers.updateOrder(req.params.id, req.body)
    res.status(statusCode).send({ success, statusCode, body })
})

ordersRouter.post('/:orderId/items', async (req, res) => {
    debug(`POST /orders/${req.params.orderId}/items called`);
    const { success, statusCode, body } = await ordersControllers.addItemToOrder(req.params.orderId, req.body);
    res.status(statusCode).send({ success, statusCode, body });
});

ordersRouter.patch('/:orderId/items/:itemId', async (req, res) => {
    debug(`PATCH /orders/${req.params.orderId}/items/${req.params.itemId} called`);
    const { orderId, itemId } = req.params;
    const { quantity } = req.body;

    try {
        const updatedItem = await ordersControllers.updateItemQuantity(orderId, itemId, quantity);
        if (updatedItem) {
            return res.status(200).json({ success: true, data: updatedItem });
        } else {
            return res.status(404).json({ success: false, message: 'Item não encontrado.' });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});

ordersRouter.delete('/:orderId/items/:itemId', async (req, res) => {
    debug(`DELETE /orders/${req.params.orderId}/items/${req.params.itemId} called`);
    const { success, statusCode, body } = await ordersControllers.removeItemFromOrder(req.params.orderId, req.params.itemId);
    res.status(statusCode).send({ success, statusCode, body });
});
export default ordersRouter