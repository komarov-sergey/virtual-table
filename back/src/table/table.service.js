const sequelize = require("../db");
const { v4: uuidv4 } = require("uuid");

async function getTableMeta({ tableId }) {
  try {
    const [result] = await sequelize.query(
      `select * from table_meta where table_id=${tableId}::text`,
      { logging: console.log }
    );

    return result.length > 0 ? result[0].meta : [];
  } catch (e) {
    return {
      errors: [e.toString()],
    };
  }
}

async function getTableData({ tableId }) {
  try {
    const [result] = await sequelize.query(
      `select * from table_data where table_id='${tableId}' order by createdat desc`
    );

    return result.map((el) => ({ id: el.id, ...el.data }));
  } catch (e) {
    return {
      errors: [e.toString()],
    };
  }
}

// work with record -->
async function updateTableRecord({ recordId }, reqBody) {
  try {
    const [result] = await sequelize.query(
      `select * from table_data where id='${recordId}'`
    );

    if (result.length > 0) {
      // update record
      await sequelize.query(
        `update table_data set data = '${JSON.stringify(
          reqBody
        )}' where id='${recordId}'`
      );

      return { id: result[0].id, ...result[0].data };
    } else {
      return {
        errors: ["Запись не найденна"],
      };
    }
  } catch (e) {
    return {
      errors: [e.toString()],
    };
  }
}

async function getTableRecord({ recordId }) {
  try {
    const [result] = await sequelize.query(
      `select * from table_data where id='${recordId}'`
    );

    return { id: result[0].id, ...result[0].data };
  } catch (e) {
    return {
      errors: [e.toString()],
    };
  }
}

async function addTableRecord({ tableId }, reqBody) {
  try {
    // add record
    const [result] = await sequelize.query(
      `INSERT INTO public.table_data
      (id, createdat, updatedat, createdby, "data", table_id)
      VALUES('${uuidv4()}', now(), now(), 'admin', '${JSON.stringify(
        reqBody
      )}', ${tableId})`
    );

    return { result };
  } catch (e) {
    return {
      errors: [e.toString()],
    };
  }
}

// work with record <--

module.exports = {
  getTableMeta,
  getTableData,
  updateTableRecord,
  getTableRecord,
  addTableRecord,
};
