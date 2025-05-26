import { ObjectId } from "mongodb";
import { Mongo } from "../database/mongo.js";
import { debug, info, error } from "../helpers/logger.js"; // Import logger

const collectionName = 'leads';

export default class LeadsDataAccess {
    async createLead(leadData) {
        try {
            debug(`createLead called with data: ${JSON.stringify(leadData)}`);
            // Classificação do lead baseado no estado
            const leadType = leadData.state === 'RS' ? 'hot-lead' : 'cold-lead';
            
            const result = await Mongo.db
                .collection(collectionName)
                .insertOne({
                    ...leadData,
                    leadType,
                    createdAt: new Date(),
                    status: 'new'
                });
            info(`Lead created with email: ${leadData.email}`);
            return { success: true, statusCode: 201, body: { data: result } };
        } catch (error) {
            error(`Error creating lead: ${error.message}`);
            return { success: false, statusCode: 500, body: { error: error.message } };
        }
    }

    async getLeads() {
        try {
            debug('getLeads called');
            const result = await Mongo.db
                .collection(collectionName)
                .find({})
                .toArray();
            info('Fetched all leads');
            return { success: true, statusCode: 200, body: { data: result } };
        } catch (error) {
            error(`Error fetching leads: ${error.message}`);
            return { success: false, statusCode: 500, body: { error: error.message } };
        }
    }

    async updateLeadStatus(leadId, status) {
        try {
            debug(`updateLeadStatus called with leadId: ${leadId}, status: ${status}`);
            const result = await Mongo.db
                .collection(collectionName)
                .findOneAndUpdate(
                    { _id: new ObjectId(leadId) },
                    { $set: { status, updatedAt: new Date() } },
                    { returnDocument: 'after' }
                );
            info(`Lead status updated for ID: ${leadId}`);
            return { success: true, statusCode: 200, body: { data: result.value } };
        } catch (error) {
            error(`Error updating lead status: ${error.message}`);
            return { success: false, statusCode: 500, body: { error: error.message } };
        }
    }

    async deleteColdLeads() {
        try {
            debug('deleteColdLeads called');
            const result = await Mongo.db
                .collection(collectionName)
                .deleteMany({ leadType: 'cold-lead' });
            info('Deleted cold leads');
            return { success: true, statusCode: 200, body: { data: result } };
        } catch (error) {
            error(`Error deleting cold leads: ${error.message}`);
            return { success: false, statusCode: 500, body: { error: error.message } };
        }
    }
}
