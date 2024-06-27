import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input, Form, Button, Select, Modal, Table } from "antd";

import { getKeyByValue } from "../helpers/index";

export default function RecordCardNew() {
  const [modalData, setModalData] = useState();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formRef = useRef(null);
  const [field, setField] = useState("");
  const [linkData1, setLinkData1] = useState({ id: "", value: "" });
  const [linkData2, setLinkData2] = useState({ id: "", value: "" });
  const [activeModal, setActiveModal] = useState();
  const [tableMeta, setTableMeta] = useState([]);

  // modal -->
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      formRef.current?.setFieldsValue({
        link: selectedRows[0],
      });
    },
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    const currentLink = formRef.current.getFieldValue("link");
    const metaColumns = tableMeta.filter((el) =>
      Object.keys(el).includes("tableId")
    );
    const currentMetaColumn = metaColumns[activeModal - 1].dataIndex;

    activeModal === 1
      ? setLinkData1({
          id: currentLink.id,
          value: currentLink[currentMetaColumn],
        })
      : setLinkData2({
          id: currentLink.id,
          value: currentLink[currentMetaColumn],
        });
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

  const tableId = 1;

  const getMeta = () =>
    fetch(`http://localhost:5174/api/table/meta/${tableId}`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((result) => setTableMeta(result))
      .catch((error) => console.error(error));

  async function onFinish({ name, age, address }) {
    console.log("onFinish");

    const raw = JSON.stringify({
      age,
      name,
      address,
      link: {
        recordId: linkData1.id,
        value: linkData1.value,
      },
      link2: {
        recordId: linkData2.id,
        value: linkData2.value,
      },
    });

    await fetch(`http://localhost:5174/api/table/record/1`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: raw,
    })
      .then(() => {})
      .catch((error) => console.error(error));

    navigate("/");
  }

  useEffect(() => {
    getMeta();
    getModalData(2);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Form
        ref={formRef}
        onFinish={onFinish}
        autoComplete="off"
        style={{ width: "600px" }}
      >
        <h2>Создание элемента</h2>
        <Form.Item label="возраст" name="age">
          <Input placeholder="age" />
        </Form.Item>
        <Form.Item label="адрес" name="address">
          <Input placeholder="address" />
        </Form.Item>
        <Form.Item label="имя" name="name">
          <Input placeholder="name" />
        </Form.Item>

        {tableMeta
          .filter((el) => Object.keys(el).includes("tableId"))
          .map((el, i) => (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "16px",
              }}
            >
              <Form.Item label={el.dataIndex}>
                <Input
                  readOnly
                  value={i === 0 ? linkData1.value : linkData2.value}
                />
              </Form.Item>
              <Button
                type="primary"
                onClick={() => {
                  setActiveModal(i + 1);
                  showModal(true);
                }}
              >
                edit link
              </Button>
            </div>
          ))}

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
  );
}
