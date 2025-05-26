import { ObjectId } from "mongodb";
import { Mongo } from "../database/mongo.js";
import crypto from "crypto";
import { info, error } from "../helpers/logger.js";

const collectionName = "users";

export default class usersDataAccess {
  // Método para obter todos os usuários
  async getUsers() {
    try {
      const result = await Mongo.db
        .collection(collectionName)
        .find({})
        .toArray();
      info("Fetched all users");
      return result;
    } catch (err) {
      error(`Error fetching users: ${err.message}`);
      throw err;
    }
  }

  // Método para obter um usuário pelo ID
  async getUserById(userId) {
    try {
      const result = await Mongo.db
        .collection(collectionName)
        .findOne({ _id: new ObjectId(userId) });
      info(`Fetched user with ID: ${userId}`);
      return result;
    } catch (err) {
      error(`Error fetching user by ID: ${err.message}`);
      throw err;
    }
  }

  // Método para obter um usuário pelo email
  async getUserByEmail(email) {
    try {
      const result = await Mongo.db
        .collection(collectionName)
        .findOne({ email: email });
      info(`Fetched user with email: ${email}`);
      return result;
    } catch (err) {
      error(`Error fetching user by email: ${err.message}`);
      throw err;
    }
  }

  // Método para excluir um usuário pelo ID
  async deleteUser(userId) {
    try {
      const result = await Mongo.db
        .collection(collectionName)
        .findOneAndDelete({ _id: new ObjectId(userId) });
      info(`Deleted user with ID: ${userId}`);
      return result;
    } catch (err) {
      error(`Error deleting user: ${err.message}`);
      throw err;
    }
  }

  // Método para atualizar um usuário pelo ID
  async updateUser(userId, userData) {
    try {
      if (userData.password) {
        // Gera um salt aleatório para proteger a nova senha do usuário
        const salt = crypto.randomBytes(16);

        // Gera o hash da senha com o salt criado
        crypto.pbkdf2(
          userData.password,
          salt,
          310000,
          16,
          "sha256",
          async (error, hashedPassword) => {
            if (error) {
              throw new Error("Erro ao gerar hash da senha");
            }
            // Atualiza os dados do usuário com a senha criptografada e o salt
            userData = { ...userData, password: hashedPassword, salt };

            const result = await Mongo.db
              .collection(collectionName)
              .findOneAndUpdate(
                { _id: new ObjectId(userId) },
                { $set: userData }
              );
            info(`Updated user with ID: ${userId}`);
            return result;
          }
        );
      } else {
        // Atualiza os dados do usuário sem alterar a senha
        const result = await Mongo.db
          .collection(collectionName)
          .findOneAndUpdate({ _id: new ObjectId(userId) }, { $set: userData });
        info(`Updated user with ID: ${userId}`);
        return result;
      }
    } catch (err) {
      error(`Error updating user: ${err.message}`);
      throw err;
    }
  }

  // Método para verificar se um email já existe
  async checkEmailExists(email) {
    try {
      const result = await Mongo.db
        .collection(collectionName)
        .findOne({ email: email });
      info(`Checked if email exists: ${email}`);
      return result !== null;
    } catch (err) {
      error(`Error checking email: ${err.message}`);
      throw err;
    }
  }

  // Método para atualizar o endereço de um usuário
  async updateUserAddress(userId, addressData) {
    try {
      // Validação do endereço (pode ser personalizada conforme necessário)
      if (
        !addressData ||
        !addressData.street ||
        !addressData.city ||
        !addressData.number
      ) {
        return {
          success: false,
          statusCode: 400,
          body: { error: "Endereço inválido." },
        };
      }

      // Tenta atualizar o endereço do usuário
      const result = await Mongo.db.collection(collectionName).findOneAndUpdate(
        { _id: new ObjectId(userId) }, // Filtro para encontrar o usuário
        { $set: { address: addressData } }, // Atualiza apenas o campo de endereço
        { returnDocument: "after" } // Retorna o documento atualizado
      );

      // Se o usuário não for encontrado, retorna erro 404
      if (!result.value) {
        return {
          success: false,
          statusCode: 404,
          body: { error: "Usuário não encontrado." },
        };
      }

      info(`Updated address for user with ID: ${userId}`);
      // Retorna o sucesso com o documento atualizado
      return {
        success: true,
        statusCode: 200,
        body: {
          message: "Endereço atualizado com sucesso.",
          data: result.value,
        },
      };
    } catch (err) {
      error(`Error updating user address: ${err.message}`);
      return { success: false, statusCode: 500, body: { error: err.message } };
    }
  }

  // Método para atualizar a senha de um usuário
  async updateUserPass(userId, currentPassword, newPassword) {
    try {
      const user = await this.getUserById(userId);
      if (!user) {
        throw new Error("Usuário não encontrado.");
      }

      if (!currentPassword || !newPassword) {
        throw new Error("Senhas não fornecidas.");
      }

      const saltBuffer = Buffer.from(user.salt.buffer);
      const currentHashedPassword = await new Promise((resolve, reject) => {
        crypto.pbkdf2(
          currentPassword,
          saltBuffer,
          310000,
          16,
          "sha256",
          (err, derivedKey) => {
            if (err) reject(err);
            resolve(derivedKey);
          }
        );
      });

      const userPasswordBuffer = Buffer.from(user.password.buffer);
      if (!crypto.timingSafeEqual(userPasswordBuffer, currentHashedPassword)) {
        throw new Error("Senha atual incorreta.");
      }

      const newSalt = crypto.randomBytes(16);
      const newHashedPassword = await new Promise((resolve, reject) => {
        crypto.pbkdf2(
          newPassword,
          newSalt,
          310000,
          16,
          "sha256",
          (err, derivedKey) => {
            if (err) reject(err);
            resolve(derivedKey);
          }
        );
      });

      const updatedUser = {
        ...user,
        password: newHashedPassword,
        salt: newSalt,
      };
      delete updatedUser._id;

      await this.deleteUser(userId);
      const result = await Mongo.db
        .collection(collectionName)
        .insertOne(updatedUser);

      info(`Updated password for user with ID: ${userId}`);
      return { success: true, message: "Senha atualizada com sucesso." };
    } catch (err) {
      error(`Error updating user password: ${err.message}`);
      return { success: false, message: err.message };
    }
  }

  async storePasswordChange(userId, newPassword) {
    try {
      await Mongo.db.collection("passwordChanges").insertOne({
        userId: new ObjectId(userId),
        newPassword,
        createdAt: new Date(),
      });
      info(`Stored password change request for user ID: ${userId}`);
    } catch (err) {
      error(`Error storing password change request: ${err.message}`);
      throw err;
    }
  }
}
