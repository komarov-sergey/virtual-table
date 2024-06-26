const Router = require("koa-router");

const {
  getTableMeta,
  getTableData,
  updateTableRecord,
  getTableRecord,
  addTableRecord,
  deleteRecord,
} = require("./table.service");

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
  })
  .put("/record/:recordId", async (ctx) => {
    const {
      request: { params: recordId },
    } = ctx;
    const reqBody = ctx.request.body;

    const dataOrError = await updateTableRecord(recordId, reqBody);

    if (!Object.keys(dataOrError).includes("errors")) {
      ctx.response.status = 200;
      ctx.body = dataOrError;
    } else {
      ctx.response.status = 422;
      ctx.body = dataOrError;
    }
  })
  .get("/record/:recordId", async (ctx) => {
    const {
      request: { params: recordId },
    } = ctx;

    const dataOrError = await getTableRecord(recordId);

    if (!Object.keys(dataOrError).includes("errors")) {
      ctx.response.status = 200;
      ctx.body = dataOrError;
    } else {
      ctx.response.status = 422;
      ctx.body = dataOrError;
    }
  })
  .post("/record/:tableId", async (ctx) => {
    const {
      request: { params: tableId },
    } = ctx;
    const reqBody = ctx.request.body;

    const dataOrError = await addTableRecord(tableId, reqBody);

    if (!Object.keys(dataOrError).includes("errors")) {
      ctx.response.status = 200;
      ctx.body = dataOrError;
    } else {
      ctx.response.status = 422;
      ctx.body = dataOrError;
    }
  })
  .delete("/record/:recordId", async (ctx) => {
    const {
      request: { params: recordId },
    } = ctx;

    const dataOrError = await deleteRecord(recordId);

    if (!Object.keys(dataOrError).includes("errors")) {
      ctx.response.status = 200;
      ctx.body = dataOrError;
    } else {
      ctx.response.status = 422;
      ctx.body = dataOrError;
    }
  });
