const sequelize = require("../db");
const { v4: uuidv4 } = require("uuid");

async function getTableMeta({ tableId }) {
  try {
    const [meta] = await sequelize.query(
      `select * from table_meta where table_id=${tableId}::text`
      // { logging: console.log }
    );

    return meta.length > 0 ? meta[0].meta : [];
  } catch (e) {
    return {
      errors: [e.toString()],
    };
  }
}

async function getTableData({ tableId }) {
  console.log({ tableId });
  try {
    const [data] = await sequelize.query(
      `select * from table_data where table_id='${tableId}' order by createdat desc`
    );

    let [meta] = await sequelize.query(
      `select * from table_meta where table_id=${tableId}::text`
    );

    meta = meta[0].meta;

    const link = meta.filter((el) => el.title === "Link");
    const select = meta.filter((el) => el.title === "Select");

    if (link.length > 0) {
      data.forEach((el) => (el.data = { ...el.data, link: link[0]?.tableId }));
    }

    if (select.length > 0) {
      const tableId = select[0]?.tableId;
      const dataIndex = select[0].dataIndex;

      // console.log({ dataIndex });

      const [selectData] = await sequelize.query(
        `select * from table_data where table_id='${tableId}'`
      );

      // selectData.forEach((el) => console.log(el.data));

      const getFieldsData = selectData.reduce((acc, curr) => {
        // console.log(curr);
        acc.push(curr.data[dataIndex]);
        return acc;
      }, []);

      // console.log({ getFieldsData });

      data.forEach((el) => (el.data = { ...el.data, select: getFieldsData }));
    }

    return data.map((el) => ({ id: el.id, ...el.data }));
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
