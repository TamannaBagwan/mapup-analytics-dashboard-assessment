import React from "react";
import PropTypes from "prop-types";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Box, Typography, Grid, Paper } from "@mui/material";

const EVTypePieChart = ({ data }) => {
  const vehicleTypeCounts = {};

  data.forEach((entry) => {
    if (entry["Electric Vehicle Type"]) {
      vehicleTypeCounts[entry["Electric Vehicle Type"]] =
        (vehicleTypeCounts[entry["Electric Vehicle Type"]] || 0) + 1;
    }
  });

  const chartValues = Object.keys(vehicleTypeCounts).map((vehicleType) => ({
    name: vehicleType,
    value: vehicleTypeCounts[vehicleType],
  }));

  const chartColors = ["#23945e", "#58afed"];

  return (
    <Paper
      elevation={3}
      sx={{ p: 3, borderRadius: 2, boxShadow: 5, backgroundColor: "#f4f6f8" }}
    >
      <Typography
        variant="h5"
        sx={{ mb: 3, textAlign: "center", fontWeight: 600 }}
      >
        Distribution Across Vehicle Categories
      </Typography>
      <ResponsiveContainer width="100%" height={312}>
        <PieChart>
          <Pie
            data={chartValues}
            dataKey="value"
            nameKey="name"
            outerRadius={120}
            label={({ value }) => `${value}`}
            labelLine
          >
            {chartValues.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={chartColors[index % chartColors.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <Grid container spacing={2} justifyContent="center" sx={{ mt: 3 }}>
        {chartValues.map((entry, index) => (
          <Grid
            item
            key={`legend-${index}`}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                backgroundColor: chartColors[index % chartColors.length],
                mr: 2,
                borderRadius: "50%",
              }}
            />
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ fontWeight: 500, fontSize: "15px" }}
            >
              {entry.name}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

EVTypePieChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      "Electric Vehicle Type": PropTypes.string,
    })
  ).isRequired,
};

export default EVTypePieChart;
