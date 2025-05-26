import usersDataAccess from "../DataAccess/users.js";
import { info, error } from "../helpers/logger.js";

const usersDAO = new usersDataAccess();

export async function changePassword(email, fullname, newPassword) {
  try {
    const user = await usersDAO.getUserByEmail(email);
    if (!user || user.fullname !== fullname) {
      throw new Error("Usuário não encontrado ou nome incorreto.");
    }

    const userId = user._id.toString();
    await usersDAO.storePasswordChange(userId, newPassword);
    info(`Password change request stored for user with email: ${email}`);
  } catch (err) {
    error(`Error storing password change request: ${err.message}`);
    throw err;
  }
}
