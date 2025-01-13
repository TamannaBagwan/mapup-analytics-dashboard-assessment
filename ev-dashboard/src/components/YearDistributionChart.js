import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Box, Typography, Paper } from "@mui/material";

const YearDistributionChart = ({ data }) => {
  const yearCounts = data.reduce((acc, curr) => {
    if (curr["Model Year"]) {
      acc[curr["Model Year"]] = (acc[curr["Model Year"]] || 0) + 1;
    }
    return acc;
  }, {});

  const chartData = Object.entries(yearCounts).map(([year, count]) => ({
    year: parseInt(year),
    count,
  }));

  const barColors = [
    "#FF6347",
    "#1E90FF",
    "#32CD32",
    "#FFD700",
    "#8A2BE2",
    "#FF1493",
    "#8B0000",
    "#00CED1",
    "#0ceb43",
    "#d4eb0c",
  ];

  return (
    <Paper elevation={4} sx={{ p: 4, width: "94%", borderRadius: 2 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333" }}>
          Distribution by Model Year
        </Typography>
      </Box>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="5 5" stroke="#ccc" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip contentStyle={{ backgroundColor: "#333", color: "#fff" }} />
          <Bar dataKey="count">
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={barColors[index % barColors.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default YearDistributionChart;
