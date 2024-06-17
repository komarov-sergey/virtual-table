import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Input } from "antd";

export default function RecordCard() {
  const [data, setData] = useState();
  const { recordId } = useParams();

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
        <div>
          <Input value={data?.id} readOnly />
          {data?.age && <Input value={data?.age} />}
          {data?.address && <Input value={data?.address} />}
          {data?.name && <Input value={data?.name} />}
          {data?.country && <Input value={data?.country} />}
          {data?.population && <Input value={data?.population} />}
        </div>
      )}
    </>
  );
}
