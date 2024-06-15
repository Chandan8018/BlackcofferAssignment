import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import BarChartRace from "../BarChartRace";
import TableChart from "../TableChart";
import { Avatar } from "@mui/material";
import Badge from "@mui/material/Badge";
import { BarChart } from "@mui/x-charts/BarChart";
import { red } from "@mui/material/colors";

export default function DashboardComp() {
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [topRelevance, setTopRelevance] = React.useState([]);
  const [topLikelihood, setTopLikelihood] = React.useState([]);

  React.useEffect(() => {
    const fetchJsonData = async () => {
      try {
        const res = await fetch(`/api/data/getdata`);
        const newData = await res.json();
        if (res.ok) {
          let sortedData = [...newData].sort(
            (a, b) => b.relevance - a.relevance
          );
          let topTenObjects = sortedData.slice(0, 10);
          setTopRelevance(topTenObjects);

          let sortedDataLikelihood = [...newData].sort(
            (a, b) => b.likelihood - a.likelihood
          );
          let topTenLikelihoodObjects = sortedData.slice(0, 10);
          setTopLikelihood(topTenLikelihoodObjects);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchJsonData();
  }, []);

  const Item = styled(Paper)(() => ({
    backgroundColor: theme === "dark" ? "#1A2027" : "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: theme === "dark" ? "white" : "black",
  }));

  const StyledBadge = styled(Badge)(() => ({
    "& .MuiBadge-badge": {
      backgroundColor: "#44b700",
      color: "#44b700",
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      boxShadow: `0 0 0 2px ${theme}`,
      "&::after": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        animation: "ripple 1.2s infinite ease-in-out",
        border: "1px solid currentColor",
        content: '""',
      },
    },
    "@keyframes ripple": {
      "0%": {
        transform: "scale(.8)",
        opacity: 1,
      },
      "100%": {
        transform: "scale(2.4)",
        opacity: 0,
      },
    },
  }));
  return (
    <Box sx={{ width: "96%", marginTop: "20px" }}>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12} sm={12} md={4} width={400} height={250}>
          <Item>
            <div className='flex flex-col justify-center items-center gap-3 my-7'>
              <StyledBadge
                overlap='circular'
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant='dot'
              >
                <Avatar
                  alt={currentUser.username}
                  src={currentUser.profilePicture}
                  sx={{ width: 115, height: 115 }}
                />
              </StyledBadge>
              <h1 className='text-xl font-bold text-blue-500'>
                Welcome {currentUser.username}
              </h1>
              <h3>
                <MarkEmailReadIcon />
                {currentUser.email}
              </h3>
            </div>
          </Item>
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <Item className=''>
            <LineChart
              width={400}
              height={250}
              series={[
                {
                  data: topRelevance.map((d) => d.relevance),
                  label: "Relevance",
                },
                // { data: uData, label: "uv" },
              ]}
              xAxis={[
                { scaleType: "point", data: topRelevance.map((d) => d.topic) },
              ]}
            />
          </Item>
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <Item>
            <BarChart
              width={400}
              height={250}
              series={[
                {
                  data: topLikelihood.map((d) => d.likelihood),
                  label: "Likelihood",
                  id: "pvId",
                  stack: "total",
                },
                // { data: uData, label: "uv", id: "uvId", stack: "total" },
              ]}
              xAxis={[
                { data: topLikelihood.map((d) => d.topic), scaleType: "band" },
              ]}
            />
          </Item>
        </Grid>
      </Grid>
      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        marginTop={3}
        padding={1}
      >
        <Grid item xs={12} sm={12} md={12}>
          <Item>
            <BarChartRace />
          </Item>
        </Grid>
      </Grid>
      <Grid
        container
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        marginTop={3}
        padding={1}
      >
        <Grid item xs={12} sm={12} md={12}>
          <Item>
            <h1 className='text-xl text-blue-600 font-bold mt-2'>Table Data</h1>
            <TableChart />
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}
