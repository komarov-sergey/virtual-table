import { useEffect, useState } from "react";
import { Space, Table, Tag } from "antd";

const table1MetaMock = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text) => <a>{text}</a>,
  },
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
  {
    title: "Tags",
    key: "tags",
    dataIndex: "tags",
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? "geekblue" : "green";
          if (tag === "loser") {
            color = "volcano";
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
  },
];

const table1DataMock = [
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

const App = () => {
  const [isLoading, setIsLading] = useState();
  const [table1Data, setTable1Data] = useState([]);
  const [table1Meta, setTable1Meta] = useState([]);

  useEffect(() => {
    setIsLading(true);

    Promise.all([getData(), getMeta()])
      .then((result) => {
        setTable1Data(result[0]);
        setTable1Meta(result[1]);
      })
      .finally(() => {
        setIsLading(false);
      });
  }, []);

  const getData = () => {
    return Promise.resolve(table1DataMock);
  };

  const getMeta = () => {
    return Promise.resolve(table1MetaMock);
  };

  return (
    <Table columns={table1Meta} dataSource={table1Data} loading={isLoading} />
  );
};

export default App;
