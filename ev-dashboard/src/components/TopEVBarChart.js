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
import { Box, Typography, Grid, Paper } from "@mui/material";

const TopEVBarChart = ({ data }) => {
  const manufacturerCountsMap = new Map();

  data.forEach((entry) => {
    if (entry["Make"]) {
      manufacturerCountsMap.set(
        entry["Make"],
        (manufacturerCountsMap.get(entry["Make"]) || 0) + 1
      );
    }
  });

  const manufacturerCounts = Array.from(manufacturerCountsMap).reduce(
    (acc, [key, value]) => {
      acc[key] = value;
      return acc;
    },
    {}
  );

  const sortedChartData = Object.entries(manufacturerCounts)
    .map(([manufacturer, count]) => ({ manufacturer, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const colorPalette = ["#f2470f", "#bcd119", "#bb7dfa", "#f22eb4", "#42f56c"];

  return (
    <Paper
      elevation={3}
      sx={{ p: 3, borderRadius: 2, backgroundColor: "#f5f5f5" }}
    >
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", color: "#333", mb: 3, textAlign: "center" }}
      >
        Leading Electric Vehicle Manufacturers
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={sortedChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="manufacturer" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count">
            {sortedChartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colorPalette[index % colorPalette.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <Grid container spacing={1} justifyContent="center" sx={{ mt: 2 }}>
        {sortedChartData.map((entry, index) => (
          <Grid
            item
            key={`legend-${index}`}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Box
              sx={{
                width: 13,
                height: 13,
                backgroundColor: colorPalette[index % colorPalette.length],
                marginRight: 1,
                borderRadius: "50%",
              }}
            />
            <Typography variant="body2">{entry.manufacturer}</Typography>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default TopEVBarChart;
