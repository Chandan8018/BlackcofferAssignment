import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
  {
    field: "id",
    headerName: "ID",
    type: "String",
    width: 190,
  },
  {
    field: "end_year",
    headerName: "End Year",
    width: 150,
    valueGetter: (value, row) => `${row.end_year || ""} ${row.lastName || ""}`,
  },
  {
    field: "intensity",
    headerName: "Intensity",
    width: 100,
    type: "number",
  },
  {
    field: "sector",
    headerName: "Sector",
    type: "String",
    width: 110,
  },
  {
    field: "topic",
    headerName: "Topic",
    type: "String",
    // sortable: false,
    width: 160,
  },
  {
    field: "insight",
    headerName: "Insight",
    type: "String",
    width: 110,
  },
  {
    field: "region",
    headerName: "Region",
    type: "String",
    width: 110,
  },
  {
    field: "start_year",
    headerName: "Start Year",
    type: "String",
    width: 110,
  },
  {
    field: "impact",
    headerName: "Impact",
    type: "String",
    width: 110,
  },
  {
    field: "added",
    headerName: "Added",
    type: "String",
    width: 110,
  },
  {
    field: "published",
    headerName: "Published",
    type: "String",
    width: 110,
  },
  {
    field: "relevance",
    headerName: "Relevance",
    type: "Number",
    width: 110,
  },
  {
    field: "pestle",
    headerName: "Pestle",
    type: "String",
    width: 110,
  },
  {
    field: "source",
    headerName: "Source",
    type: "String",
    width: 110,
  },
  {
    field: "title",
    headerName: "Title",
    type: "String",
    width: 110,
  },
  {
    field: "likelihood",
    headerName: "Likelihood",
    type: "number",
    width: 110,
  },
];

export default function TableChart() {
  const [data, setData] = React.useState([]);
  React.useEffect(() => {
    const fetchJsonData = async () => {
      try {
        const res = await fetch(`/api/data/getdata`);
        const newData = await res.json();
        if (res.ok) {
          const modifiedData = newData.map((item) => ({
            ...item,
            id: item._id,
          }));
          setData(modifiedData);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchJsonData();
  }, []);
  return (
    <Box sx={{ height: 400, width: "100%" }} marginBlock={5}>
      <DataGrid
        rows={data}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        className='text-black dark:bg-gray-500'
        he
      />
    </Box>
  );
}
