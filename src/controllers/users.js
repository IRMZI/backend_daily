import usersDataAccess from "../DataAccess/users.js";
import { ok, serverError } from "../helpers/httpResponse.js";
import { info, error } from "../helpers/logger.js"; // Import logger

export default class UsersControllers {
  constructor() {
    this.dataAccess = new usersDataAccess(); // Instancia a classe de acesso aos dados
  }

  // Método para obter todos os usuários
  async getUsers() {
    try {
      const users = await this.dataAccess.getUsers(); // Obtém os usuários
      info("Fetched all users");
      return ok(users);
    } catch (err) {
      error(`Error fetching users: ${err.message}`);
      return serverError(err);
    }
  }

  // Método para obter um usuário pelo ID
  async getUserById(userId) {
    try {
      const user = await this.dataAccess.getUserById(userId); // Obtém o usuário pelo ID
      info(`Fetched user with ID: ${userId}`);
      return ok(user);
    } catch (err) {
      error(`Error fetching user by ID: ${err.message}`);
      return serverError(err);
    }
  }

  // Método para excluir um usuário
  async deleteUser(userId) {
    try {
      const result = await this.dataAccess.deleteUser(userId); // Exclui o usuário pelo ID
      info(`Deleted user with ID: ${userId}`);
      return ok(result);
    } catch (err) {
      error(`Error deleting user: ${err.message}`);
      return serverError(err);
    }
  }

  // Método para atualizar as informações de um usuário
  async updateUser(userId, userData) {
    try {
      const result = await this.dataAccess.updateUser(userId, userData); // Atualiza os dados
      info(`Updated user with ID: ${userId}`);
      return ok(result);
    } catch (err) {
      error(`Error updating user: ${err.message}`);
      return serverError(err);
    }
  }

  // Método para verificar se um email já existe
  async checkEmailExists(email) {
    try {
      const exists = await this.dataAccess.checkEmailExists(email);
      info(`Checked if email exists: ${email}`);
      return ok({ exists: exists });
    } catch (err) {
      error(`Error checking email: ${err.message}`);
      return serverError(err);
    }
  }

  // Método para atualizar o endereço de um usuário
  async updateUserAddress(userId, addressData) {
    try {
      // Validação do endereço (você pode personalizar conforme necessário)
      if (
        !addressData ||
        !addressData.street ||
        !addressData.city ||
        !addressData.number
      ) {
        return {
          success: false,
          statusCode: 400,
          body: { error: "Endereço inválido, endereço obtido:", addressData },
        };
      }

      // Atualiza apenas o endereço do usuário
      const result = await this.dataAccess.updateUserAddress(
        userId,
        addressData
      );
      if (!result) {
        return {
          success: false,
          statusCode: 404,
          body: { error: "Usuário não encontrado." },
        };
      }

      info(`Updated address for user with ID: ${userId}`);
      return {
        success: true,
        statusCode: 200,
        body: { message: "Endereço atualizado com sucesso." },
      };
    } catch (err) {
      error(`Error updating user address: ${err.message}`);
      return { success: false, statusCode: 500, body: { error: err.message } };
    }
  }

  // Método para atualizar a senha de um usuário
  async updateUserPass(userId, { currentPassword, newPassword }) {
    try {
      if (!currentPassword || !newPassword) {
        throw new Error("Senhas não fornecidas.");
      }

      const result = await this.dataAccess.updateUserPass(
        userId,
        currentPassword,
        newPassword
      );
      if (result.success) {
        info(`Updated password for user with ID: ${userId}`);
        return {
          success: true,
          statusCode: 200,
          body: { message: "Senha atualizada com sucesso." },
        };
      } else {
        return {
          success: false,
          statusCode: 500,
          body: { error: result.message },
        };
      }
    } catch (err) {
      error(`Error updating user password: ${err.message}`);
      return { success: false, statusCode: 500, body: { error: err.message } };
    }
  }
}
