import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input, Form, Button, Select, Modal, Table } from "antd";

import { getKeyByValue } from "../helpers/index";

export default function RecordCard() {
  const [data, setData] = useState();
  const [modalData, setModalData] = useState();
  const { recordId } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const formRef = useRef(null);
  const [field, setField] = useState("");
  const [linkData, setLinkData] = useState({ id: "", field: "", value: "" });
  const [linkData2, setLinkData2] = useState({ id: "", field: "", value: "" });

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

    // console.log({ currentLink });
    // console.log({ field });

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

  function getRecord(recordId) {
    return fetch(`http://localhost:5174/api/table/record/${recordId}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((result) => {
        setData(result);
        console.log({ result });
        // getModalData(result.link.tableId);
        getModalData(2);

        setLinkData(result.link);
        setLinkData2(result.link2);
      })
      .catch((error) => console.error(error));
  }

  async function onFinish({ id, name, age, address, select }) {
    const raw = JSON.stringify({
      age,
      name,
      address,
      link: {
        recordId: linkData.id,
        field: linkData.field,
        value: linkData.value,
      },
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
              // link: data?.link?.value,
              // select: data?.selectValue,
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
              {linkData && (
                <Form.Item label={linkData.field}>
                  <Input
                    readOnly
                    defaultValue={linkData.value}
                    value={linkData.value}
                  />
                </Form.Item>
              )}
              <Button type="primary" onClick={showModal}>
                edit link
              </Button>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "16px",
              }}
            >
              {linkData2 && (
                <Form.Item label={linkData2.field}>
                  <Input
                    readOnly
                    defaultValue={linkData2.value}
                    value={linkData2.value}
                  />
                </Form.Item>
              )}
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
                {
                  title: "Country",
                  dataIndex: "country",
                  key: "country",
                  onCell,
                },
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
      )}
    </>
  );
}
