import express from 'express'
import LeadsControllers from '../Controllers/leads.js'
import { debug } from "../helpers/logger.js"; // Import logger

const leadsRouter = express.Router()
const leadsControllers = new LeadsControllers()

leadsRouter.get('/', async (req, res) => {
    debug('GET /leads called');
    const { success, statusCode, body } = await leadsControllers.getLeads(req.params.id)
    res.status(statusCode).send({success, statusCode, body})
})

leadsRouter.post('/', async (req, res) => {
    debug('POST /leads called');
    const { success, statusCode, body } = await leadsControllers.createLead(req.body)
    res.status(statusCode).send({ success, statusCode, body })
})

leadsRouter.put('/:id/status', async (req, res) => {
    debug(`PUT /leads/${req.params.id}/status called`);
    const { success, statusCode, body } = await leadsControllers.updateLeadStatus(req.params.id, req.body.status)
    res.status(statusCode).send({ success, statusCode, body })
})

leadsRouter.delete('/cold-leads', async (req, res) => {
    debug('DELETE /leads/cold called');
    const { success, statusCode, body } = await leadsControllers.deleteColdLeads()
    res.status(statusCode).send({ success, statusCode, body })
})

export default leadsRouter