import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
import { useSelector } from "react-redux";
import { MdArrowRightAlt } from "react-icons/md";
import { FaArrowUpLong } from "react-icons/fa6";

ChartJS.register(...registerables);

const Graph = () => {
  const { theme } = useSelector((state) => state.theme);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/data/getdata`);
        const data = await res.json();
        if (res.ok) {
          const modifiedData = data.map((item) => ({
            date:
              item.published === ""
                ? new Date(item.added).toISOString().split("T")[0]
                : new Date(item.published).toISOString().split("T")[0],
            name: item.sector,
            value: item.intensity,
            category: item.region,
          }));
          setData(modifiedData);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchData();
  }, []);

  function jsonToCsv(jsonData) {
    // Check if the data is an array
    if (!Array.isArray(jsonData) || jsonData.length === 0) {
      throw new Error("Input data should be a non-empty array of objects");
    }

    // Extract headers (keys from the first object)
    const headers = Object.keys(jsonData[0]);

    // Create the CSV string
    let csv = headers.join(",") + "\n";

    // Add the rows
    jsonData.forEach((item) => {
      let row = headers.map((header) => item[header]).join(",");
      csv += row + "\n";
    });

    return csv;
  }

  const handleDownloadCsv = () => {
    try {
      const csv = jsonToCsv(data);
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.setAttribute("hidden", "");
      a.setAttribute("href", url);
      a.setAttribute("download", "data1.csv");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.log(error.message);
    }
  };

  const parseData = () => {
    const timestamps = data.map((item) => item.category);
    const sourcePorts = data.map((item) => item.value);
    return { timestamps, sourcePorts };
  };

  const { timestamps, sourcePorts } =
    data.length > 0 ? parseData() : { timestamps: [], sourcePorts: [] };

  const lineData = {
    labels: timestamps,
    datasets: [
      {
        label: "# Alerts Over Time between Source Ports on (2019-01-02)",
        data: sourcePorts,
        backgroundColor: "rgba(255, 206, 86, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 2,
      },
    ],
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: theme === "light" ? "black" : "white",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: theme === "light" ? "black" : "white",
        },
        grid: {
          color:
            theme === "light"
              ? "rgba(0, 0, 0, 0.2)"
              : "rgba(255, 255, 255, 0.2)",
        },
      },
      y: {
        ticks: {
          color: theme === "light" ? "black" : "white",
        },
        grid: {
          color:
            theme === "light"
              ? "rgba(0, 0, 0, 0.2)"
              : "rgba(255, 255, 255, 0.2)",
        },
      },
    },
  };

  return (
    <>
      <div className='flex justify-center items-center'>
        <div className='flex flex-col-reverse items-center ml-10 text-blue-600 text-xl font-bold'>
          <span>S</span>
          <span>O</span>
          <span>U</span>
          <span>R</span>
          <span>R</span>
          <span>C</span>
          <span>E</span>
          <span>&nbsp;</span>
          <span>P</span>
          <span>O</span>
          <span>R</span>
          <span>T</span>
          <span>S</span>
          <span>&nbsp;</span>
          <FaArrowUpLong className='h-7 w-7' />
        </div>
        <div className='min-h-screen mx-10 mt-10 w-full'>
          {data.length > 0 && <Line data={lineData} options={commonOptions} />}
        </div>
      </div>
      <div className='flex justify-center items-center text-xl font-bold text-center'>
        <h3 className='text-blue-600 tracking-widest'>TIME STAMP</h3>
        <MdArrowRightAlt className='h-10 w-10 mt-1 text-blue-600' />
      </div>
      <div className='flex justify-center items-center mt-5'>
        <button
          onClick={handleDownloadCsv}
          className='bg-blue-500 text-white px-4 py-2 rounded'
        >
          Download CSV
        </button>
      </div>
    </>
  );
};

export default Graph;
