import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input, Form, Button } from "antd";

export default function RecordCard() {
  const [data, setData] = useState();
  const { recordId } = useParams();
  const navigate = useNavigate();

  function getRecord(recordId) {
    return fetch(`http://localhost:5174/api/table/record/${recordId}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((result) => setData(result))
      .catch((error) => console.error(error));
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
          <Form style={{ width: "600px" }}>
            <h2>Карточка элемента</h2>
            {data?.id && (
              <Form.Item label="id">
                <Input value={data?.id} readOnly />
              </Form.Item>
            )}
            {data?.age && (
              <Form.Item label="возраст">
                <Input value={data?.age} readOnly />
              </Form.Item>
            )}
            {data?.address && (
              <Form.Item label="адрес">
                <Input value={data?.address} readOnly />
              </Form.Item>
            )}
            {data?.name && (
              <Form.Item label="имя">
                <Input value={data?.name} readOnly />
              </Form.Item>
            )}
            {data?.country && (
              <Form.Item label="страна">
                <Input value={data?.country} readOnly />
              </Form.Item>
            )}
            {data?.population && (
              <Form.Item label="население">
                <Input value={data?.population} readOnly />
              </Form.Item>
            )}
            <Button
              style={{ alignSelf: "flex-start" }}
              onClick={() => navigate(-1)}
            >
              Назад
            </Button>
          </Form>
        </div>
      )}
    </>
  );
}
