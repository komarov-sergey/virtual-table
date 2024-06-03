const sequelize = require("../db");

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
      `select * from table_data  where table_id=${tableId}::text`
    );

    return result.map((el) => el.data);
  } catch (e) {
    return {
      errors: [e.toString()],
    };
  }
}

module.exports = { getTableMeta, getTableData };
