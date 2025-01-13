import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Box, Typography, Grid } from "@mui/material";

const CAFVEligibilityPieChart = ({ data }) => {
  const eligibilityCounts = data.reduce((accumulatedCounts, currentRecord) => {
    const eligibilityStatus =
      currentRecord["Clean Alternative Fuel Vehicle (CAFV) Eligibility"];
    if (eligibilityStatus) {
      accumulatedCounts[eligibilityStatus] =
        (accumulatedCounts[eligibilityStatus] || 0) + 1;
    }
    return accumulatedCounts;
  }, {});

  const chartData = Object.keys(eligibilityCounts).map((status) => ({
    name: status,
    value: eligibilityCounts[status],
  }));

  const chartColors = ["#e534eb", "#f5790c", "#6e070d"];

  return (
    <Box
      sx={{ p: 3, boxShadow: 5, borderRadius: 3, backgroundColor: "#f9f9f9" }}
    >
      <Typography
        variant="h5"
        align="center"
        sx={{ mb: 3, fontWeight: "bold", color: "#333" }}
      >
        Eligibility Distribution for CAFV
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            outerRadius={120}
            label={({ value }) => `${value}`}
            labelLine={false}
          >
            {chartData.map((dataEntry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={chartColors[index % chartColors.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <Grid container spacing={1} justifyContent="center" sx={{ mt: 3 }}>
        {chartData.map((dataEntry, index) => (
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
                marginRight: 1.5,
                borderRadius: "50%",
              }}
            />

            <Typography
              variant="body1"
              sx={{ fontWeight: "400", color: "#555", fontSize: "14px" }}
            >
              {dataEntry.name}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CAFVEligibilityPieChart;
