import React, { useEffect, useState } from "react";

export default function ApiData() {
  const [newApiData, setNewApiData] = useState([]);
  useEffect(() => {
    const fetchJsonData = async () => {
      try {
        const res = await fetch(`/api/data/getdata`);
        const newData = await res.json();
        if (res.ok) {
          setNewApiData(newData);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchJsonData();
  }, []);
  return newApiData;
}
