const Router = require("koa-router");

const table = require("./table/table.route");

module.exports = new Router({ prefix: "/api" })
  .use("/table", table.routes())
  .get("/healthcheck", (ctx) => {
    ctx.response.status = 200;
  });
