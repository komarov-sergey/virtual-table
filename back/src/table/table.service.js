async function getTableMeta() {
  try {
    return [
      { title: "Name", dataIndex: "name", key: "name" },
      {
        title: "Age",
        dataIndex: "age",
        key: "age",
      },
      {
        title: "Address",
        dataIndex: "address",
        key: "address",
      },
    ];
  } catch (e) {
    return {
      errors: [e.toString()],
    };
  }
}

async function getTableData() {
  try {
    return [
      {
        key: "1",
        name: "John Brown",
        age: 32,
        address: "New York No. 1 Lake Park",
        tags: ["nice", "developer"],
      },
      {
        key: "2",
        name: "Jim Green",
        age: 42,
        address: "London No. 1 Lake Park",
        tags: ["loser"],
      },
      {
        key: "3",
        name: "Joe Black",
        age: 32,
        address: "Sydney No. 1 Lake Park",
        tags: ["cool", "teacher"],
      },
    ];
  } catch (e) {
    return {
      errors: [e.toString()],
    };
  }
}

module.exports = { getTableMeta, getTableData };
