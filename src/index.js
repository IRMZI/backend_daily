import express from "express";
import cors from "cors";
import { Mongo } from "./database/mongo.js";
import { config } from "dotenv";
import authRouter from "./auth/auth.js";
import usersRouter from "./routes/users.js";
import productsRouter from "./routes/products.js";
import ordersRouter from "./routes/orders.js";
import leadsRouter from "./routes/leads.js";
import tokenRouter from "./routes/token.js"; // Import token router
import passChangeRouter from "./routes/passchange.js"; // Import passChange router
import { info, error, debug } from "./helpers/logger.js"; // Import logger

config();

// função de inicialização da aplicação
async function Main() {
  const hostname = "localhost";
  const port = process.env.PORT || 3000; // Use environment variable for port
  // define o app para uma instancia do express
  const app = express();
  // Cria conexão com o banco de dados utilizando variáveis de ambiente
  try {
    const mongoConnection = await Mongo.connect({
      mongoConnectionString: process.env.MONGO_CS,
      mongoDbName: process.env.MONGO_DB_NAME,
    });
    info("MongoDB connected"); // Log successful connection
  } catch (err) {
    error(`MongoDB connection error: ${err.message}`);
    process.exit(1); // Exit process on connection error
  }
  // parse pra json da resposta do servidor
  app.use(express.json());
  app.use(cors());
  app.get("/", (req, res) => {
    res.send({
      success: true,
      statusCode: 200,
      body: "Welcome to Cogumelos campestre",
    });
  });
  // Utiliza a rota "/auth"
  app.use("/auth", authRouter);
  // Utiliza a rota "/Users"
  app.use("/users", usersRouter);
  // Utiliza a rota "/Users"
  app.use("/products", productsRouter);
  // Utiliza a rota "/Orders"
  app.use("/orders", ordersRouter);
  // Utiliza a rota "/Leads"
  app.use("/leads", leadsRouter);
  // Utiliza a rota "/token"
  app.use("/token", tokenRouter);
  // Utiliza a rota "/api/passchange"
  app.use("/api/passchange", passChangeRouter);
  app
    .listen(port, () => {
      debug(`Server is running on port ${port}`);
    })
    .on("error", (err) => {
      error(`Server failed to start: ${err.message}`);
    });
}

Main();
