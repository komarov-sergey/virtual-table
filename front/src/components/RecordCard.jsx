import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

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
          <div>{data.id}</div>
          <div>{data.age}</div>
          <div>{data.address}</div>
          <div>{data.name}</div>
        </div>
      )}
    </>
  );
}
