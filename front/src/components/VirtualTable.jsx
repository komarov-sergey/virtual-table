import { useEffect, useState } from "react";
import { Space, Table, Tag } from "antd";

const VirtualTable = ({ id }) => {
  const [isLoading, setIsLading] = useState();
  const [table1Data, setTable1Data] = useState([]);
  const [table1Meta, setTable1Meta] = useState([]);

  useEffect(() => {
    setIsLading(true);

    Promise.all([getData(id), getMeta(id)])
      .then((result) => {
        setTable1Data(result[0]);
        setTable1Meta(result[1]);
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

  return (
    <Table columns={table1Meta} dataSource={table1Data} loading={isLoading} />
  );
};

export default VirtualTable;
