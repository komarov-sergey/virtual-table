const sequelize = require("../db");

async function getTableMeta() {
  try {
    const [result] = await sequelize.query("select * from table_meta");

    return result[0].meta;
  } catch (e) {
    return {
      errors: [e.toString()],
    };
  }
}

async function getTableData() {
  try {
    const [result] = await sequelize.query("select * from table_data");

    return result[0].data;
  } catch (e) {
    return {
      errors: [e.toString()],
    };
  }
}

module.exports = { getTableMeta, getTableData };
