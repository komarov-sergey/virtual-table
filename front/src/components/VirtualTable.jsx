import React, { useEffect, useState, useRef, useContext } from "react";
import { Table, Checkbox, Button, Input, Form } from "antd";
import moment from "moment";
import { useParams } from "react-router-dom";

const VirtualTable = () => {
  const [isLoading, setIsLading] = useState();
  const [tableData, settableData] = useState([]);
  const [tableMeta, settableMeta] = useState([]);
  let { tableId } = useParams();

  if (!tableId) {
    tableId = "1";
  }

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

      if (el?.title === "Link") {
        return (el.render = (_, record) => {
          return (
            <a href={`record/${record.link.recordId}`}>
              {record.link.recordId}
            </a>
          );
        });
      }

      if (el?.title === "Select") {
        return (el.render = (_, record) => {
          return record.selectValue;
        });
      }

      return el;
    });

    const card = {
      title: "operation",
      dataIndex: "operation",
      render: (_, record) => {
        return (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <a href={`record/${record?.id}`}>go to card</a>
            <a href={`record/edit/${record?.id}`}>edit</a>
          </div>
        );
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
        }),
      };
    });

    return [card, ...meta];
  };

  const prepareData = (data) => {
    return data?.map((el, i) => {
      el.key = i;
      return el;
    });
  };

  return (
    <Table
      columns={tableMeta}
      dataSource={tableData}
      loading={isLoading}
      bordered
    />
  );
};

export default VirtualTable;
