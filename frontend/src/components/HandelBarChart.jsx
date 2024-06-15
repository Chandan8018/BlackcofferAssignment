// src/App.js
import React, { useEffect, useState } from "react";
import BarChart from "./BarChart";

const initialData = [
  {
    _id: "666aa79eabf6a6cbbd479766",
    intensity: 6,
    sector: "Energy",
    topic: "gas",
    likelihood: 3,
    relevance: 2,
  },
  {
    _id: "666aa79eabf6a6cbbd479767",
    intensity: 6,
    sector: "Energy",
    topic: "oil",
    likelihood: 3,
    relevance: 2,
  },
  {
    _id: "666aa79eabf6a6cbbd479768",
    intensity: 6,
    sector: "Energy",
    topic: "consumption",
    likelihood: 3,
    relevance: 2,
  },
  {
    _id: "666aa79eabf6a6cbbd479769",
    intensity: 6,
    sector: "Environment",
    topic: "oil",
    likelihood: 2,
    relevance: 3,
  },
  {
    _id: "666aa79eabf6a6cbbd47976a",
    intensity: 6,
    sector: "",
    topic: "market",
    likelihood: 3,
    relevance: 2,
  },
];

const HandelBarChart = () => {
  const [data, setData] = useState(initialData);
  const [dataKey, setDataKey] = useState([]);
  useEffect(() => {
    const fetchJsonData = async () => {
      try {
        const res = await fetch(`/api/data/getdata`);
        const newData = await res.json();
        if (res.ok) {
          const modifiedData = newData.map((item) => ({
            _id: item._id,
            intensity: item.intensity,
            sector: item.sector,
            topic: item.topic,
            likelihood: item.likelihood,
            relevance: item.relevance,
          }));
          setData(modifiedData);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchJsonData();
  }, []);

  const updateData = () => {
    setData(
      data.map((d) => ({
        ...d,
        [dataKey]: Math.floor(Math.random() * 10),
      }))
    );
  };

  return (
    <div>
      <BarChart data={data} dataKey={dataKey} />
      <button onClick={updateData}>Update Data</button>
      <div>
        <label>Select Metric: </label>
        <select onChange={(e) => setDataKey(e.target.value)} value={dataKey}>
          <option value='intensity'>Intensity</option>
          <option value='likelihood'>Likelihood</option>
          <option value='relevance'>Relevance</option>
        </select>
      </div>
    </div>
  );
};

export default HandelBarChart;
