import React, { useState, useEffect, useMemo, Suspense } from "react";
import {
  AppBar,
  Box,
  Button,
  Grid,
  Toolbar,
  Typography,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import { parseCSV } from "../utils/csvParse";
import mapUp_logo from "../assets/images/mapup-logo.png";

const CountyBarGraph = React.lazy(() => import("./CountyBarGraph"));
const EVTypePieChart = React.lazy(() => import("./EVTypePieChart"));
const TopEVBarChart = React.lazy(() => import("./TopEVBarChart"));
const YearDistributionChart = React.lazy(() =>
  import("./YearDistributionChart")
);
const CAFVPieChart = React.lazy(() => import("./CAFVEligibilityPieChart"));

const Dashboard = () => {
  const [evData, setEVData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("charts");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        let parsedData = await parseCSV(
          "/Electric_Vehicle_Population_Data.csv"
        );
        setEVData(parsedData);
        setFilteredData(parsedData);
      } catch (error) {
        console.error("Error fetching and parsing CSV:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const summaryData = useMemo(() => {
    if (!evData?.length)
      return {
        totalVehicles: 0,
        uniqueMakes: 0,
        uniqueModels: 0,
        uniqueCounties: 0,
      };

    return {
      totalVehicles: evData.length,
      uniqueMakes: new Set(evData.map((item) => item.Make)).size,
      uniqueModels: new Set(evData.map((item) => item.Model)).size,
      uniqueCounties: new Set(evData.map((item) => item.County)).size,
    };
  }, [evData]);

  const columns = [
    {
      title: "VIN",
      dataIndex: "VIN (1-10)",
      key: "VIN",
    },
    {
      title: "Make",
      dataIndex: "Make",
      key: "Make",
      filters: evData
        ? [...new Set(evData.map((item) => item.Make))].map((make) => ({
            text: make,
            value: make,
          }))
        : [],
      onFilter: (value, record) => record.Make === value,
    },
    {
      title: "Model",
      dataIndex: "Model",
      key: "Model",
      filters: evData
        ? [...new Set(evData.map((item) => item.Model))].map((model) => ({
            text: model,
            value: model,
          }))
        : [],
      onFilter: (value, record) => record.Model === value,
    },
    {
      title: "Model Year",
      dataIndex: "Model Year",
      key: "Model Year",
      filters: evData
        ? [...new Set(evData.map((item) => item["Model Year"]))].map(
            (year) => ({ text: year, value: year })
          )
        : [],
      onFilter: (value, record) => record["Model Year"] === value,
    },
    {
      title: "Electric Vehicle Type",
      dataIndex: "Electric Vehicle Type",
      key: "EVType",
      filters: evData
        ? [...new Set(evData.map((item) => item["Electric Vehicle Type"]))].map(
            (type) => ({ text: type, value: type })
          )
        : [],
      onFilter: (value, record) => record["Electric Vehicle Type"] === value,
    },
    {
      title: "CAFV Eligibility",
      dataIndex: "Clean Alternative Fuel Vehicle (CAFV) Eligibility",
      key: "CAFVEligibility",
      filters: evData
        ? [
            ...new Set(
              evData.map(
                (item) =>
                  item["Clean Alternative Fuel Vehicle (CAFV) Eligibility"]
              )
            ),
          ].map((status) => ({ text: status, value: status }))
        : [],
      onFilter: (value, record) =>
        record["Clean Alternative Fuel Vehicle (CAFV) Eligibility"] === value,
    },
    {
      title: "Electric Range",
      dataIndex: "Electric Range",
      key: "Range",
    },
    {
      title: "Base MSRP",
      dataIndex: "Base MSRP",
      key: "MSRP",
    },
    {
      title: "County",
      dataIndex: "County",
      key: "County",
      filters: evData
        ? [...new Set(evData.map((item) => item.County))].map((county) => ({
            text: county,
            value: county,
          }))
        : [],
      onFilter: (value, record) => record.County === value,
    },
    {
      title: "City",
      dataIndex: "City",
      key: "City",
      filters: evData
        ? [...new Set(evData.map((item) => item.City))].map((city) => ({
            text: city,
            value: city,
          }))
        : [],
      onFilter: (value, record) => record.City === value,
    },
  ];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="sticky"
          sx={{ backgroundColor: "#1a344d", p: 1, width: "100%" }}
        >
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <img
                src={mapUp_logo}
                alt="MapUp Dashboard Logo"
                style={{
                  width: "100%",
                  maxWidth: "96px",
                  height: "auto",
                  objectFit: "contain",
                }}
              />
            </Box>

            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "#fff",
                fontSize: { xs: "17px", sm: "20px", md: "22px" },
                letterSpacing: ".5px",
                textTransform: "uppercase",
                margin: { xs: "5px 14px", md: "15px 10px" },
              }}
            >
              Electric Vehicle Dashboard
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                onClick={() => setViewMode("charts")}
                sx={{
                  color: viewMode === "charts" ? "#fff" : "#007bff",
                  fontSize: { xs: "12px", sm: "18px", md: "18px" },
                }}
              >
                Charts
              </Button>
              <Button
                onClick={() => setViewMode("table")}
                sx={{
                  color: viewMode === "table" ? "#fff" : "#007bff",
                  fontSize: { xs: "12px", sm: "18px", md: "18px" },
                }}
              >
                Table
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        <Box
          sx={{
            padding: 2,
            mt: 4,
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          {loading ? (
            <LinearProgress
              sx={{
                width: "100%",
                margin: "20px auto",
                display: "block",
                backgroundColor: "#e0e0e0",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#135675",
                },
              }}
            />
          ) : (
            <Box>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: 3,
                  padding: 3,
                }}
              >
                {Object.entries(summaryData).map(([key, value]) => (
                  <Box
                    key={key}
                    sx={{
                      flex: "1 0 30%",
                      padding: 3,
                      backgroundColor: "#fff",
                      borderRadius: 2,
                      boxShadow: 3,
                      maxWidth: "300px",
                      minWidth: "250px",
                      margin: "10px auto",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: 5,
                        cursor: "pointer",
                      },
                    }}
                  >
                    <Typography
                      variant="h6"
                      color="#000"
                      sx={{
                        textAlign: "center",
                        marginBottom: 1,
                        fontWeight: 600,
                        fontSize: { xs: "18px", md: "24px" },
                      }}
                    >
                      {key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 700,
                        textAlign: "center",
                        color: "#333",
                        fontSize: { xs: "18px", sm: "20px", md: "22px" },
                      }}
                    >
                      {value}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {viewMode === "charts" ? (
                <Suspense
                  fallback={
                    <CircularProgress
                      size={50}
                      sx={{ margin: "auto", display: "block" }}
                    />
                  }
                >
                  <Grid container spacing={2} sx={{ mt: 3 }}>
                    <Grid item xs={12} sm={12}>
                      <CountyBarGraph filteredData={filteredData || []} />
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{ mt: 3 }}>
                      <EVTypePieChart data={filteredData || []} />
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{ mt: 3 }}>
                      <CAFVPieChart data={filteredData || []} />
                    </Grid>
                    <Grid item xs={12} sm={12} sx={{ mt: 3 }}>
                      <YearDistributionChart data={filteredData || []} />
                    </Grid>
                    <Grid item xs={12} sm={12} sx={{ mt: 3 }}>
                      <TopEVBarChart data={filteredData || []} />
                    </Grid>
                  </Grid>
                </Suspense>
              ) : (
                <Box sx={{ mt: 5 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      marginBottom: 2,
                      fontWeight: 700,
                      textAlign: "center",
                      fontSize: { xs: "18px", md: "30px" },
                    }}
                  >
                    Electric Vehicle Data
                  </Typography>
                  {filteredData && filteredData.length > 0 ? (
                    <>
                      <Table
                        sx={{
                          minWidth: 700,
                          border: "1px solid #ddd",
                          backgroundColor: "#f9f9f9",
                        }}
                      >
                        <TableHead>
                          <TableRow sx={{ backgroundColor: "#469bf0" }}>
                            {columns.map((col) => (
                              <TableCell
                                key={col.dataIndex}
                                sx={{
                                  color: "white",
                                  fontWeight: "bold",
                                  textAlign: "center",
                                }}
                              >
                                {col.title}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredData
                            .slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                            .map((row, index) => (
                              <TableRow
                                key={index}
                                sx={{
                                  "&:nth-of-type(odd)": {
                                    backgroundColor: "#f1f1f1",
                                  },
                                  "&:hover": {
                                    backgroundColor: "#e3f2fd",
                                    cursor: "pointer",
                                  },
                                }}
                              >
                                {columns.map((col) => (
                                  <TableCell
                                    key={col.dataIndex}
                                    sx={{
                                      textAlign: "center",
                                      padding: "10px 15px",
                                      fontSize: { xs: "16px", md: "13px" },
                                    }}
                                  >
                                    {row[col.dataIndex] || "N/A"}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>

                      <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filteredData.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        sx={{
                          marginTop: 2,
                          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-input":
                            {
                              fontSize: "0.875rem",
                            },
                        }}
                      />
                    </>
                  ) : (
                    <Typography
                      variant="body1"
                      sx={{ textAlign: "center", color: "gray" }}
                    >
                      No data available
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
