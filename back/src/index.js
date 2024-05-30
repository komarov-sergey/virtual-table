const Koa = require("koa");
const { Sequelize } = require("sequelize");
const cors = require("@koa/cors");

const sequelize = new Sequelize(
  "postgres://postgres:postgres@localhost:5432/VirtualTable"
);

const api = require("./routes");

const app = new Koa();

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    app.use(cors()).use(api.routes()).listen(5174);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();
