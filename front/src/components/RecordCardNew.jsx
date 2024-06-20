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
  const [linkData, setLinkData] = useState({ id: "", field: "", value: "" });

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
    const fieldKey = getKeyByValue(currentLink, field);

    console.log({ currentLink });
    console.log({ field });
    console.log(fieldKey[0]);

    setLinkData({ id: currentLink.id, field: fieldKey[0], value: field });
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

  async function onFinish({ name, age, address, select }) {
    console.log("onFinish");
    console.log({ linkData });

    const raw = JSON.stringify({
      age,
      name,
      address,
      link: {
        recordId: linkData.id,
        field: linkData.field,
        value: linkData.value,
      },
      // selectValue: select,
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

  function onCell(record, rowIndex) {
    return {
      onClick: (e) => {
        console.log(e.target.innerText);
        setField(e.target.innerText);
      },
      onMouseEnter: (e) => {
        // console.log("onMouseEnter", typeof e.target);
        e.target.style.border = "1px solid blue";
      },
      onMouseLeave: (e) => {
        // console.log("onMouseEnter", typeof e.target);
        e.target.style.border = "none";
      },
    };
  }

  useEffect(() => {
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: "16px",
          }}
        >
          <Form.Item label={linkData.field}>
            <Input
              readOnly
              defaultValue={linkData.value}
              value={linkData.value}
            />
          </Form.Item>
          <Button type="primary" onClick={showModal}>
            edit link
          </Button>
        </div>
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
              onCell,
            },
            { title: "Country", dataIndex: "country", key: "country", onCell },
            {
              title: "Population",
              dataIndex: "population",
              key: "population",
              onCell,
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
