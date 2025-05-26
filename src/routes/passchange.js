import express from "express";
import { changePassword } from "../Controllers/passwordController.js";
import { debug } from "../helpers/logger.js"; // Import logger

const passChangeRouter = express.Router();

passChangeRouter.post("/", async (req, res) => {
  const { email, fullname, newPassword, confirmNewPassword } = req.body;

  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ message: "As senhas não coincidem." });
  }

  try {
    debug(`POST /api/passchange called for email: ${email}`);
    await changePassword(email, fullname, newPassword);
    res.status(200).json({ message: "Senha alterada com sucesso." });
  } catch (error) {
    res.status(500).json({ message: "Erro ao solicitar mudança de senha." });
  }
});

export default passChangeRouter;
