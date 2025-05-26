import express from "express";
import UsersControllers from "../Controllers/users.js";
import { debug } from "../helpers/logger.js"; // Import logger

const usersRouter = express.Router();
const usersControllers = new UsersControllers();

usersRouter.get("/", async (req, res) => {
  debug("GET /users called");
  const { success, statusCode, body } = await usersControllers.getUsers();
  res.status(statusCode).send({ success, statusCode, body });
});

usersRouter.get("/:id", async (req, res) => {
  debug(`GET /users/${req.params.id} called`);
  const { success, statusCode, body } = await usersControllers.getUserById(
    req.params.id
  );
  res.status(statusCode).send({ success, statusCode, body });
});

usersRouter.get("/check-email/:email", async (req, res) => {
  debug(`GET /users/check-email/${req.params.email} called`);
  const { success, statusCode, body } = await usersControllers.checkEmailExists(
    req.params.email
  );
  res.status(statusCode).send({ success, statusCode, body });
});

usersRouter.delete("/:id", async (req, res) => {
  debug(`DELETE /users/${req.params.id} called`);
  const { success, statusCode, body } = await usersControllers.deleteUser(
    req.params.id
  );
  res.status(statusCode).send({ success, statusCode, body });
});

usersRouter.put("/:id", async (req, res) => {
  debug(`PUT /users/${req.params.id} called`);
  const { success, statusCode, body } = await usersControllers.updateUser(
    req.params.id,
    req.body
  );
  res.status(statusCode).send({ success, statusCode, body });
});

usersRouter.put("/:id/address", async (req, res) => {
  debug(`PUT /users/${req.params.id}/address called`);
  const { success, statusCode, body } =
    await usersControllers.updateUserAddress(req.params.id, req.body);
  res.status(statusCode).send({ success, statusCode, body });
});

usersRouter.put("/:id/password", async (req, res) => {
  debug(`PUT /users/${req.params.id}/password called`);
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).send({
      success: false,
      statusCode: 400,
      body: { error: "Senhas não fornecidas." },
    });
  }
  const { success, statusCode, body } = await usersControllers.updateUserPass(
    req.params.id,
    req.body
  );
  res.status(statusCode).send({ success, statusCode, body });
});

export default usersRouter;
