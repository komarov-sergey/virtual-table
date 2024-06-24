const sequelize = require("../db");
const { v4: uuidv4 } = require("uuid");

async function getTableMeta({ tableId }) {
  try {
    const [meta] = await sequelize.query(
      `select * from table_meta where table_id=${tableId}::text`
    );

    return meta.length > 0 ? meta[0].meta : [];
  } catch (e) {
    return {
      errors: [e.toString()],
    };
  }
}

async function getTableData({ tableId }) {
  try {
    const [data] = await sequelize.query(
      `select * from table_data where table_id='${tableId}' order by createdat desc`
    );

    let [meta] = await sequelize.query(
      `select * from table_meta where table_id=${tableId}::text`
    );

    meta = meta[0].meta;

    // const link = meta.filter((el) => el.title === "Link");
    // if (link.length > 0) {
    //   data.forEach((el) => (el.data = { ...el.data, link: link[0]?.tableId }));
    // }

    const select = meta.filter((el) => el.title === "Select");

    if (select.length > 0) {
      const tableId = select[0]?.tableId;
      const dataIndex = select[0].dataIndex;

      const [selectData] = await sequelize.query(
        `select * from table_data where table_id='${tableId}'`
      );

      const getFieldsData = selectData.reduce((acc, curr) => {
        acc.push({ value: curr.id, label: curr.data[dataIndex] });
        return acc;
      }, []);

      data.forEach(
        (el) =>
          (el.data = {
            ...el.data,
            selectValue: getFieldsData.filter(
              (el2) => el2.value === el.data.selectValue
            )[0]?.label,
          })
      );
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
    const [data] = await sequelize.query(
      `select * from table_data where id='${recordId}'`
    );

    // let [meta] = await sequelize.query(
    //   `select * from table_meta where table_id=${data[0].table_id}::text`
    // );

    // meta = meta[0].meta;

    // const select = meta.filter((el) => el.title === "Select");

    // if (select.length > 0) {
    //   const tableId = select[0]?.tableId;
    //   const dataIndex = select[0].dataIndex;

    //   const [selectData] = await sequelize.query(
    //     `select * from table_data where table_id='${tableId}'`
    //   );

    //   const getFieldsData = selectData.reduce((acc, curr) => {
    //     acc.push({ value: curr.id, label: curr.data[dataIndex] });
    //     return acc;
    //   }, []);

    //   data.forEach((el) => (el.data = { ...el.data, select: getFieldsData }));
    // }

    return { id: data[0].id, tableId: data[0].table_id, ...data[0].data };
  } catch (e) {
    return {
      errors: [e.toString()],
    };
  }
}

async function addTableRecord({ tableId }, reqBody) {
  console.log("addTableRecord");
  try {
    // add record
    const [result] = await sequelize.query(
      `INSERT INTO public.table_data
      (id, createdat, updatedat, createdby, "data", table_id)
      VALUES('${uuidv4()}', now(), now(), 'admin', '${JSON.stringify(
        reqBody
      )}', ${tableId})`,
      { logging: console.log }
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
