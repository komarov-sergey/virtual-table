import React, { useEffect, useState, useRef, useContext } from "react";
import { Table, Checkbox, Button, Input, Form } from "antd";
import moment from "moment";
import { useParams } from "react-router-dom";

const VirtualTable = () => {
  const [isLoading, setIsLading] = useState();
  const [tableData, settableData] = useState([]);
  const [tableMeta, settableMeta] = useState([]);
  let { tableId } = useParams();

  console.log(tableMeta);

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
    meta = meta.filter((el) => el.title !== "Select");

    meta.map((el) => {
      // filter example
      if (el.title === "Address") {
        el.onFilter = (value, record) => record.address.indexOf(value) === 0;
      }

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

      // link example
      if (el?.title === "Country") {
        return (el.render = (_, record) => {
          console.log({ record });
          console.log({ el });
          return (
            <a href={`record/${record.link?.recordId}`}>{record.link?.value}</a>
          );
        });
      }
      if (el?.title === "Population") {
        return (el.render = (_, record) => {
          console.log({ record });
          console.log({ el });
          return (
            <a href={`record/${record.link2?.recordId}`}>
              {record.link2?.value}
            </a>
          );
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
    <>
      <Button type="primary" style={{ width: "150px" }}>
        <a href={"record/new"}>Add</a>
      </Button>
      <Table
        columns={tableMeta}
        dataSource={tableData}
        loading={isLoading}
        bordered
      />
    </>
  );
};

export default VirtualTable;
