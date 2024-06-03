import { useEffect, useState } from "react";
import { Table, Checkbox } from "antd";
import moment from "moment";

const VirtualTable = ({ id }) => {
  const [isLoading, setIsLading] = useState();
  const [table1Data, setTable1Data] = useState([]);
  const [table1Meta, setTable1Meta] = useState([]);

  useEffect(() => {
    setIsLading(true);

    Promise.all([getData(id), getMeta(id)])
      .then((result) => {
        setTable1Data(result[0]);
        setTable1Meta(prepareColumns(result[1]));
      })
      .finally(() => {
        setIsLading(false);
      });
  }, []);

  const getData = () =>
    fetch(`http://localhost:5174/api/table/data/${id}`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((result) => result)
      .catch((error) => console.error(error));

  const getMeta = () =>
    fetch(`http://localhost:5174/api/table/meta/${id}`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((result) => result)
      .catch((error) => console.error(error));

  const prepareColumns = (meta) => {
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

      return el;
    });

    return meta;
  };

  return (
    <Table columns={table1Meta} dataSource={table1Data} loading={isLoading} />
  );
};

export default VirtualTable;
