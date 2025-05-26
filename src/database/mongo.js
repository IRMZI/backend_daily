import { MongoClient } from "mongodb";
import { debug, info, error } from "../helpers/logger.js"; // Import logger

export const Mongo = {
  db: null,
  async connect({ mongoConnectionString, mongoDbName }) {
    try {
      debug("Connecting to MongoDB");
      const client = new MongoClient(mongoConnectionString);

      await client.connect();
      info("Connected to MongoDB");
      const db = client.db(mongoDbName);

      this.client = client;
      this.db = db;

      return "connected to mongo";
    } catch (err) {
      error(`Error connecting to MongoDB: ${err.message}`);
      return {
        text: "Error during mongo connection - Erro durante conexão com o mongo",
        error: err,
      };
    }
  },
  async storeRefreshToken(userId, refreshToken) {
    try {
      await this.db
        .collection("refreshTokens")
        .insertOne({ userId, refreshToken, createdAt: new Date() });
      info("Refresh token stored");
    } catch (err) {
      error(`Error storing refresh token: ${err.message}`);
    }
  },
  async findRefreshToken(refreshToken) {
    try {
      return await this.db
        .collection("refreshTokens")
        .findOne({ refreshToken });
    } catch (err) {
      error(`Error finding refresh token: ${err.message}`);
      return null;
    }
  },
  async deleteRefreshToken(refreshToken) {
    try {
      await this.db.collection("refreshTokens").deleteOne({ refreshToken });
      info("Refresh token deleted");
    } catch (err) {
      error(`Error deleting refresh token: ${err.message}`);
    }
  },
};
