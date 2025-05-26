import LeadsDataAccess from "../DataAccess/leads.js";
import { ok, serverError } from "../helpers/httpResponse.js";
import { ESTADOS_BRASIL } from "../helpers/constants.js";
import { sendEmail } from "../services/mailservice.js";
import { debug, info, error } from "../helpers/logger.js"; // Import logger

export default class LeadsController {
  constructor() {
    this.dataAccess = new LeadsDataAccess();
  }

  // Método para criar um lead
  async createLead(leadData) {
    try {
      debug(`createLead called with data: ${JSON.stringify(leadData)}`);
      const { name, email, state } = leadData;

      // Validação dos campos obrigatórios
      if (!name || !email || !state) {
        error("Nome, email e estado são obrigatórios");
        return serverError("Nome, email e estado são obrigatórios");
      }

      // Validação do estado
      if (!ESTADOS_BRASIL.includes(state)) {
        error("Estado inválido");
        return serverError("Estado inválido");
      }

      // Caminho do arquivo PDF
      const pdfPath = "./src/Data/ebook.pdf";
      // Enviar o e-mail
      const emailContent = `
      <h1>🎉 Obrigado por se cadastrar, ${name}! 🎉</h1>
      <p>Estamos empolgados em ter você conosco na comunidade dos apaixonados por cogumelos!</p>
      <p>Como prometido, enviamos para você um presente especial: o nosso exclusivo <strong>E-book de Receitas com Cogumelos</strong>. Confira o anexo deste e-mail para acessar o material.</p>
      <p>Nele, você encontrará receitas incríveis que vão transformar seus pratos e surpreender a todos!</p>
      <p><strong>Explore, experimente e aproveite!</strong></p>
      <p>Se precisar de qualquer ajuda ou tiver dúvidas, estamos aqui para ajudar. Boas receitas! 🍄</p>
      `;
      await sendEmail(email, "Seu E-book Exclusivo!", emailContent, pdfPath);

      const result = await this.dataAccess.createLead({ name, email, state });
      info(`Created new lead: ${email}`);
      return ok(result);
    } catch (err) {
      error(`Error creating lead: ${err.message}`);
      return serverError(err);
    }
  }

  // Método para obter todos os leads
  async getLeads() {
    try {
      debug('getLeads called');
      const leads = await this.dataAccess.getLeads();
      info('Fetched all leads');
      return ok(leads);
    } catch (err) {
      error(`Error fetching leads: ${err.message}`);
      return serverError(err);
    }
  }

  // Método para atualizar o status do lead
  async updateLeadStatus(leadId, status) {
    try {
      debug(`updateLeadStatus called with leadId: ${leadId}, status: ${status}`);
      const result = await this.dataAccess.updateLeadStatus(leadId, status);
      info(`Updated lead status for ID: ${leadId}`);
      return ok(result);
    } catch (err) {
      error(`Error updating lead status: ${err.message}`);
      return serverError(err);
    }
  }

  // Método para deletar leads frios
  async deleteColdLeads() {
    try {
      debug('deleteColdLeads called');
      const result = await this.dataAccess.deleteColdLeads();
      info('Deleted cold leads');
      return ok(result);
    } catch (err) {
      error(`Error deleting cold leads: ${err.message}`);
      return serverError(err);
    }
  }
}
