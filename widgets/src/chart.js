import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Box,
  Typography,
  Container,
  Paper,
  CssBaseline,
} from "@mui/material";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function ChartExample() {
  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Sales",
        data: [1200, 1900, 800, 1500, 2100, 3000],
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Sales Data",
      },
    },
  };

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          marginTop: 4,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Sales Overview
        </Typography>
        <Box sx={{ height: "400px" }}>
          <Bar data={data} options={options} />
        </Box>
      </Paper>
    </Container>
  );
}
