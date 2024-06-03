const Router = require("koa-router");

const { getTableMeta, getTableData } = require("./table.service");

module.exports = new Router()
  .post("/meta/:tableId", async (ctx) => {
    const {
      request: { params: tableId },
    } = ctx;

    const metaOrError = await getTableMeta(tableId);

    if (!Object.keys(metaOrError).includes("errors")) {
      ctx.response.status = 200;
      ctx.body = metaOrError;
    } else {
      ctx.response.status = 422;
      ctx.body = metaOrError;
    }
  })
  .post("/data/:tableId", async (ctx) => {
    const {
      request: { params: tableId },
    } = ctx;

    const dataOrError = await getTableData(tableId);

    if (!Object.keys(dataOrError).includes("errors")) {
      ctx.response.status = 200;
      ctx.body = dataOrError;
    } else {
      ctx.response.status = 422;
      ctx.body = dataOrError;
    }
  });
