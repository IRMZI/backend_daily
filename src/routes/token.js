import express from "express";
import jwt from "jsonwebtoken";
import { Mongo } from "../database/mongo.js";

const tokenRouter = express.Router();

tokenRouter.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).send({
      success: false,
      statusCode: 401,
      body: {
        text: "Refresh token não fornecido",
      },
    });
  }

  const storedToken = await Mongo.findRefreshToken(refreshToken);
  if (!storedToken) {
    return res.status(403).send({
      success: false,
      statusCode: 403,
      body: {
        text: "Refresh token inválido",
      },
    });
  }

  jwt.verify(refreshToken, "refresh_secret", (err, user) => {
    if (err) {
      return res.status(403).send({
        success: false,
        statusCode: 403,
        body: {
          text: "Refresh token expirado ou inválido",
        },
      });
    }

    const accessToken = jwt.sign(
      { _id: user._id, email: user.email },
      "access_secret",
      { expiresIn: "60m" }
    );
    return res.status(200).send({
      success: true,
      statusCode: 200,
      body: {
        accessToken,
      },
    });
  });
});

export default tokenRouter;
