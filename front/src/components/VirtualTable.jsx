import React, { useEffect, useState, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import { Table, Checkbox, Button, Input, Form, Select } from "antd";
import moment from "moment";
import { useParams } from "react-router-dom";

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();

  // console.log({ index, props });

  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  children,
  editable,
  handleSave,
  record,
  title,
  dataIndex,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    if (record)
      childNode = editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0, maxWidth: "250px", height: "28px" }}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} height={10} />
        </Form.Item>
      ) : (
        <div onClick={toggleEdit} style={{ height: "28px" }}>
          {children}
        </div>
      );
  }

  return (
    <td {...restProps} width="300" height="50">
      {childNode}
    </td>
  );
};

const VirtualTable = () => {
  const [isLoading, setIsLading] = useState();
  const [tableData, settableData] = useState([]);
  const [tableMeta, settableMeta] = useState([]);
  let { tableId } = useParams();

  if (!tableId) {
    tableId = "1";
  }

  console.log({ tableId });

  useEffect(() => {
    setIsLading(true);

    Promise.all([getData(), getMeta()])
      .then((result) => {
        settableData(prepareData(result[0]));
        settableMeta(prepareMetaColumns(result[1]));
      })
      .finally(() => {
        setIsLading(false);
      });
  }, []);

  const getData = () =>
    fetch(`http://localhost:5174/api/table/data/${tableId}`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((result) => result)
      .catch((error) => console.error(error));

  const getMeta = () =>
    fetch(`http://localhost:5174/api/table/meta/${tableId}`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((result) => result)
      .catch((error) => console.error(error));

  const prepareMetaColumns = (meta) => {
    meta.map((el) => {
      if (el?.type && el?.type === "boolean") {
        return (el.render = (checked) => {
          return <Checkbox checked={checked} disabled />;
        });
      }

      if (el?.type && el?.type === "date") {
        return (el.render = (date) => {
          return moment(date).format("DD-MM-YYYY");
        });
      }

      console.log(el);

      if (el?.title === "Link") {
        return (el.render = (_, record) => {
          return <a href={`/${record.link}`}>go to linked table</a>;
        });
      }

      if (el?.title === "Select") {
        return (el.render = (_, record) => {
          console.log(record.select);

          const prepareValues = record.select.map((el) => ({
            value: el,
            label: el,
          }));

          return <Select options={prepareValues} style={{ width: 120 }} />;
        });
      }

      return el;
    });

    const operation = {
      title: "operation",
      dataIndex: "operation",
      render: (_, record) => {
        return <a href={`record/${record?.id}`}>go to card</a>;
      },
    };

    meta = meta.map((col) => {
      if (!col.editable) return col;

      return {
        ...col,
        onCell: (record) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave,
        }),
      };
    });

    return [operation, ...meta];
  };

  const prepareData = (data) =>
    data.map((el, i) => {
      el.key = i;
      return el;
    });

  const handleAdd = () => {
    const newData = {
      key: tableData.length,
      name: `Edward King ${tableData.length} new`,
      age: "32",
      address: `London, Park Lane no. ${tableData.length}`,
    };

    settableData(prepareData([newData, ...tableData]));

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify(newData);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    fetch("http://localhost:5174/api/table/record/1", requestOptions)
      .then(() => {})
      .catch((error) => console.error(error));
  };

  const handleSave = async ({ id, name, age, address }) => {
    const raw = JSON.stringify({
      age,
      name,
      address,
    });

    await fetch(`http://localhost:5174/api/table/record/${tableId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: raw,
    })
      .then((response) => response.json())
      .then(() => getData())
      .then((result) => settableData(prepareData(result)))
      .catch((error) => console.error(error));
  };

  return (
    <>
      <Button
        onClick={handleAdd}
        type="primary"
        style={{
          marginBottom: 16,
          width: "100px",
        }}
      >
        Add a row
      </Button>
      <Table
        components={{
          body: {
            cell: EditableCell,
            row: EditableRow,
          },
        }}
        columns={tableMeta}
        dataSource={tableData}
        loading={isLoading}
        bordered
      />
    </>
  );
};

export default VirtualTable;
