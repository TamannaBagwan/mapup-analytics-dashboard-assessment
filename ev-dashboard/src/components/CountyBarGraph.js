import React from "react";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Tooltip as MuiTooltip,
} from "@mui/material";

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

const CountyBarGraph = React.memo(({ filteredData }) => {
  const aggregatedCountyData = filteredData.reduce(
    (accumulator, currentEntry) => {
      const countyName = currentEntry.County;
      if (countyName) {
        const existingEntry = accumulator.find(
          (item) => item.county === countyName
        );
        if (existingEntry) {
          existingEntry.count += 1;
        } else {
          accumulator.push({ county: countyName, count: 1 });
        }
      }
      return accumulator;
    },
    []
  );

  const topCountyData = aggregatedCountyData
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
    const bgColors = [
      "#32CD32", 
      "#FFD700", 
      "#8A2BE2", 
      "#DC143C",
      "#FF6347", 
      "#1E90FF", 
    ];
  if (topCountyData.length === 0) {
    return (
      <Typography variant="body1" color="textSecondary" align="center">
        No data available for the selected criteria.
      </Typography>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{ p: 3, borderRadius: 3, backgroundColor: "#f4f6f8" }}
    >
      <Typography
        variant="h5"
        sx={{ mb: 3, textAlign: "center", fontWeight: 600 }}
      >
        Top Counties with Highest Electric Vehicle Numbers
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={topCountyData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
          <XAxis type="category" dataKey="county" />
          <YAxis type="number" />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count">
            {topCountyData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={bgColors[index % bgColors.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <Grid container spacing={2} justifyContent="center" sx={{ mt: 3 }}>
        {topCountyData.map((entry, index) => (
          <Grid
            item
            key={`legend-${index}`}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Box
              sx={{
                width: 13,
                height: 13,
                backgroundColor: bgColors[index % bgColors.length],
                mr: 1,
                borderRadius: "50%",
              }}
            />
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ fontWeight: 500 }}
            >
              {entry.county}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
});

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <MuiTooltip>
        <Paper sx={{ p: 2, bgcolor: "background.paper" }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            <strong>{label}</strong>: {payload[0].value}
          </Typography>
        </Paper>
      </MuiTooltip>
    );
  }
  return null;
};

CountyBarGraph.propTypes = {
  filteredData: PropTypes.arrayOf(
    PropTypes.shape({
      County: PropTypes.string,
    })
  ).isRequired,
};

export default CountyBarGraph;
