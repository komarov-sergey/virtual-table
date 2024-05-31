const Koa = require("koa");
const cors = require("@koa/cors");

const sequelize = require("./db");
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
