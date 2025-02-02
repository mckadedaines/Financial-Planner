"use client";

import DashboardLayout from "../components/layout/DashboardLayout";
import Card from "../components/common/Card";
import GridLayout, {
  HalfWidthGrid,
  FullWidthGrid,
} from "../components/common/GridLayout";
import { Typography, Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { BarChart, LineChart, PieChart } from "@mui/x-charts";

// Sample data - replace with real data from your backend
const monthlyData = [
  { month: "Jan", income: 4500, expenses: 3200 },
  { month: "Feb", income: 4800, expenses: 3100 },
  { month: "Mar", income: 4600, expenses: 3300 },
  { month: "Apr", income: 5000, expenses: 3400 },
  { month: "May", income: 4900, expenses: 3200 },
  { month: "Jun", income: 5200, expenses: 3600 },
];

const categoryData = [
  { id: 0, value: 35, label: "Housing" },
  { id: 1, value: 25, label: "Food" },
  { id: 2, value: 15, label: "Transport" },
  { id: 3, value: 10, label: "Entertainment" },
  { id: 4, value: 15, label: "Others" },
];

const savingsData = [
  { month: "Jan", amount: 1300 },
  { month: "Feb", amount: 1700 },
  { month: "Mar", amount: 1300 },
  { month: "Apr", amount: 1600 },
  { month: "May", amount: 1700 },
  { month: "Jun", amount: 1600 },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState(0);

  const handleTimeRangeChange = (event, newValue) => {
    setTimeRange(newValue);
  };

  return (
    <DashboardLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Financial Analytics
        </Typography>
        <Tabs
          value={timeRange}
          onChange={handleTimeRangeChange}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="Last 6 Months" />
          <Tab label="Year to Date" />
          <Tab label="Last Year" />
        </Tabs>
      </Box>

      <GridLayout>
        {/* Income vs Expenses Chart */}
        <FullWidthGrid>
          <Card
            title="Income vs Expenses"
            subtitle="Monthly comparison of income and expenses"
          >
            <Box sx={{ height: 400, width: "100%" }}>
              <BarChart
                xAxis={[
                  {
                    data: monthlyData.map((d) => d.month),
                    scaleType: "band",
                  },
                ]}
                series={[
                  {
                    data: monthlyData.map((d) => d.income),
                    label: "Income",
                    color: "#10b981",
                  },
                  {
                    data: monthlyData.map((d) => d.expenses),
                    label: "Expenses",
                    color: "#ef4444",
                  },
                ]}
                height={350}
              />
            </Box>
          </Card>
        </FullWidthGrid>

        {/* Expense Categories */}
        <HalfWidthGrid>
          <Card
            title="Expense Categories"
            subtitle="Distribution of expenses by category"
          >
            <Box sx={{ height: 400, width: "100%" }}>
              <PieChart
                series={[
                  {
                    data: categoryData,
                    highlightScope: { faded: "global", highlighted: "item" },
                    faded: { innerRadius: 30, additionalRadius: -30 },
                  },
                ]}
                height={350}
              />
            </Box>
          </Card>
        </HalfWidthGrid>

        {/* Savings Trend */}
        <HalfWidthGrid>
          <Card title="Savings Trend" subtitle="Monthly savings analysis">
            <Box sx={{ height: 400, width: "100%" }}>
              <LineChart
                xAxis={[
                  {
                    data: savingsData.map((d) => d.month),
                    scaleType: "band",
                  },
                ]}
                series={[
                  {
                    data: savingsData.map((d) => d.amount),
                    label: "Savings",
                    color: "#3b82f6",
                    area: true,
                  },
                ]}
                height={350}
              />
            </Box>
          </Card>
        </HalfWidthGrid>

        {/* Financial Insights */}
        <FullWidthGrid>
          <Card
            title="Financial Insights"
            subtitle="Key metrics and recommendations"
          >
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom color="primary">
                Monthly Overview
              </Typography>
              <Typography paragraph>
                Your average monthly savings rate is 25%, which is excellent!
                You're consistently saving more than the recommended 20% of your
                income.
              </Typography>

              <Typography
                variant="h6"
                gutterBottom
                color="primary"
                sx={{ mt: 3 }}
              >
                Spending Patterns
              </Typography>
              <Typography paragraph>
                Housing costs represent 35% of your expenses, which is within
                the recommended range of 25-35%. Consider reviewing your food
                expenses (25%) as they're slightly above the recommended 15-20%.
              </Typography>

              <Typography
                variant="h6"
                gutterBottom
                color="primary"
                sx={{ mt: 3 }}
              >
                Recommendations
              </Typography>
              <Typography paragraph>
                1. Consider increasing your emergency fund contributions
                <br />
                2. Look for opportunities to reduce food expenses
                <br />
                3. Review your entertainment subscriptions for potential savings
              </Typography>
            </Box>
          </Card>
        </FullWidthGrid>
      </GridLayout>
    </DashboardLayout>
  );
}
