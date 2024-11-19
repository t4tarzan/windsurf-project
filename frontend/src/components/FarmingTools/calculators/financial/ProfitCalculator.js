import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

const defaultExpenses = [
  { category: 'Seeds/Plants', amount: '', description: '' },
  { category: 'Fertilizer', amount: '', description: '' },
  { category: 'Water', amount: '', description: '' },
  { category: 'Tools', amount: '', description: '' },
  { category: 'Labor', amount: '', description: '' },
];

const ProfitCalculator = () => {
  const [inputs, setInputs] = useState({
    cropName: '',
    area: '',
    expectedYield: '',
    marketPrice: '',
    currency: 'USD',
  });

  const [expenses, setExpenses] = useState(defaultExpenses);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleExpenseChange = (index, field, value) => {
    const newExpenses = [...expenses];
    newExpenses[index] = {
      ...newExpenses[index],
      [field]: value
    };
    setExpenses(newExpenses);
  };

  const addExpense = () => {
    setExpenses([...expenses, { category: '', amount: '', description: '' }]);
  };

  const removeExpense = (index) => {
    const newExpenses = expenses.filter((_, i) => i !== index);
    setExpenses(newExpenses);
  };

  const calculateProfit = () => {
    const { cropName, area, expectedYield, marketPrice } = inputs;
    
    if (!cropName || !area || !expectedYield || !marketPrice) {
      setError('Please fill in all required fields');
      return;
    }

    const values = [area, expectedYield, marketPrice].map(Number);
    if (values.some(isNaN)) {
      setError('All numeric inputs must be valid numbers');
      return;
    }

    // Calculate total revenue
    const totalRevenue = values[1] * values[2]; // yield * price

    // Calculate total expenses
    const totalExpenses = expenses.reduce((sum, expense) => {
      const amount = Number(expense.amount) || 0;
      return sum + amount;
    }, 0);

    // Calculate metrics
    const grossProfit = totalRevenue - totalExpenses;
    const profitMargin = (grossProfit / totalRevenue) * 100;
    const revenuePerArea = totalRevenue / values[0];
    const expensesPerArea = totalExpenses / values[0];
    const profitPerArea = grossProfit / values[0];
    const roi = (grossProfit / totalExpenses) * 100;

    setResults({
      totalRevenue,
      totalExpenses,
      grossProfit,
      profitMargin,
      revenuePerArea,
      expensesPerArea,
      profitPerArea,
      roi
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 1000, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Crop Profit Calculator
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Calculate potential profits based on crop yield, market prices, and expenses.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Crop Name"
            name="cropName"
            value={inputs.cropName}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Growing Area (m²)"
            name="area"
            type="number"
            value={inputs.area}
            onChange={handleInputChange}
            inputProps={{ min: 0, step: "0.1" }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Expected Yield (kg)"
            name="expectedYield"
            type="number"
            value={inputs.expectedYield}
            onChange={handleInputChange}
            inputProps={{ min: 0, step: "0.1" }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Market Price per kg"
            name="marketPrice"
            type="number"
            value={inputs.marketPrice}
            onChange={handleInputChange}
            inputProps={{ min: 0, step: "0.01" }}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Expenses
          <Tooltip title="Add all expenses related to growing this crop">
            <IconButton size="small" sx={{ ml: 1 }}>
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Description</TableCell>
                <TableCell width="50">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.map((expense, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <TextField
                      fullWidth
                      value={expense.category}
                      onChange={(e) => handleExpenseChange(index, 'category', e.target.value)}
                      placeholder="Expense category"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={expense.amount}
                      onChange={(e) => handleExpenseChange(index, 'amount', e.target.value)}
                      inputProps={{ min: 0, step: "0.01" }}
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      value={expense.description}
                      onChange={(e) => handleExpenseChange(index, 'description', e.target.value)}
                      placeholder="Optional description"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => removeExpense(index)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button
          startIcon={<AddIcon />}
          onClick={addExpense}
          sx={{ mt: 2 }}
        >
          Add Expense
        </Button>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={calculateProfit}
          fullWidth
        >
          Calculate Profit
        </Button>
      </Box>

      {error && (
        <Box mt={2}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {results && (
        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            Financial Analysis
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Revenue & Expenses
                  </Typography>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Total Revenue</TableCell>
                        <TableCell align="right">
                          ${results.totalRevenue.toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Total Expenses</TableCell>
                        <TableCell align="right">
                          ${results.totalExpenses.toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Gross Profit</TableCell>
                        <TableCell align="right">
                          ${results.grossProfit.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Key Metrics
                  </Typography>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Profit Margin</TableCell>
                        <TableCell align="right">
                          {results.profitMargin.toFixed(1)}%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Return on Investment</TableCell>
                        <TableCell align="right">
                          {results.roi.toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Per Area Metrics
                  </Typography>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Revenue per m²</TableCell>
                        <TableCell align="right">
                          ${results.revenuePerArea.toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Expenses per m²</TableCell>
                        <TableCell align="right">
                          ${results.expensesPerArea.toFixed(2)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Profit per m²</TableCell>
                        <TableCell align="right">
                          ${results.profitPerArea.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </Paper>
  );
};

export default ProfitCalculator;
