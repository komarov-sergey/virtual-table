import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input, Form, Button, Select, Modal, Table } from "antd";

export default function RecordCard() {
  const [data, setData] = useState();
  const [modalData, setModalData] = useState();
  const { recordId } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formRef = useRef(null);

  // modal -->
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      // console.log(
      //   `selectedRowKeys: ${selectedRowKeys}`,
      //   "selectedRows: ",
      //   selectedRows
      // );
      formRef.current?.setFieldsValue({
        link: selectedRows[0].id,
      });
    },
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  function getModalData(tableId) {
    fetch(`http://localhost:5174/api/table/data/${tableId}`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((result) =>
        setModalData(result.map((el, i) => ({ key: i, ...el })))
      )
      .catch((error) => console.error(error));
  }
  // modal <--

  function getRecord(recordId) {
    return fetch(`http://localhost:5174/api/table/record/${recordId}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((result) => {
        setData(result);
        // getModalData(result.link.tableId);
        getModalData(2);
      })
      .catch((error) => console.error(error));
  }

  async function onFinish({ id, name, age, address, link, select }) {
    const raw = JSON.stringify({
      age,
      name,
      address,
      link: { tableId: 2, recordId: link },
      selectValue: select,
    });

    await fetch(`http://localhost:5174/api/table/record/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: raw,
    })
      .then(() => {})
      .catch((error) => console.error(error));

    navigate("/");
  }

  function handleClick(props) {
    console.log("handleClick", data);
  }

  useEffect(() => {
    getRecord(recordId);
  }, []);

  return (
    <>
      {data && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Form
            ref={formRef}
            initialValues={{
              id: data?.id,
              age: data?.age,
              address: data?.address,
              name: data?.name,
              link: data?.link?.recordId,
              select: data?.selectValue,
            }}
            onFinish={onFinish}
            autoComplete="off"
            style={{ width: "600px" }}
          >
            <h2>Редактирование элемента</h2>
            <Form.Item label="id" name="id">
              <Input placeholder="id" readOnly />
            </Form.Item>
            <Form.Item label="возраст" name="age">
              <Input placeholder="age" />
            </Form.Item>
            <Form.Item label="адрес" name="address">
              <Input placeholder="address" />
            </Form.Item>
            <Form.Item label="имя" name="name">
              <Input placeholder="name" />
            </Form.Item>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "16px",
              }}
            >
              <Form.Item label="" name="link">
                <Input placeholder="link" readOnly />
              </Form.Item>
              <Button type="primary" onClick={showModal}>
                edit link
              </Button>
            </div>
            <Form.Item label="выбор" name="select">
              <Select options={data.select} />
            </Form.Item>
            <div style={{ display: "flex", gap: "16px" }}>
              <Button
                style={{ alignSelf: "flex-start" }}
                onClick={() => navigate(-1)}
              >
                Назад
              </Button>
              <Button type="primary" htmlType="submit">
                сохранить
              </Button>
            </div>
          </Form>
          <Modal
            title="Basic Modal"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <Table
              columns={[
                {
                  title: "id",
                  dataIndex: "id",
                  key: "id",
                },
                { title: "Country", dataIndex: "country", key: "country" },
                {
                  title: "Population",
                  dataIndex: "population",
                  key: "population",
                },
              ]}
              dataSource={modalData}
              rowSelection={{
                type: "radio",
                ...rowSelection,
              }}
            />
          </Modal>
        </div>
      )}
    </>
  );
}
