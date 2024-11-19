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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
  MonetizationOn as ProfitIcon,
  Assessment as AnalysisIcon,
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  Lightbulb as LightbulbIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';

// Educational content for SEO and user guidance
const educationalContent = {
  introduction: `The Farm Profit Calculator helps farmers analyze their financial performance by calculating gross margins, net profits, and return on investment. Understanding profitability is crucial for making informed decisions about crop selection, resource allocation, and business growth.`,
  
  profitComponents: [
    {
      title: 'Revenue Streams',
      description: 'Direct sales, wholesale, value-added products',
      impact: 'Primary source of income'
    },
    {
      title: 'Variable Costs',
      description: 'Inputs, labor, fuel, packaging',
      impact: 'Changes with production volume'
    },
    {
      title: 'Fixed Costs',
      description: 'Land, equipment, insurance',
      impact: 'Constant regardless of production'
    },
    {
      title: 'Profit Margins',
      description: 'Net income after all expenses',
      impact: 'Indicates business sustainability'
    }
  ],

  profitabilityFactors: [
    'Crop selection and diversity',
    'Market channel selection',
    'Production efficiency',
    'Cost management',
    'Price optimization'
  ],

  commonChallenges: [
    'Weather-related risks',
    'Market price fluctuations',
    'Labor availability and costs',
    'Equipment maintenance expenses',
    'Regulatory compliance costs'
  ],

  improvementStrategies: [
    'Diversify income streams',
    'Implement cost-saving technologies',
    'Optimize production systems',
    'Build strong market relationships',
    'Monitor and adjust pricing strategies'
  ]
};

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

      <Box mt={3} mb={3}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Understanding Farm Profitability</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography paragraph>{educationalContent.introduction}</Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Components of Farm Profit</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {educationalContent.profitComponents.map((component, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <AccountBalanceIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={component.title}
                    secondary={
                      <>
                        <Typography variant="body2">{component.description}</Typography>
                        <Typography variant="body2">Impact: {component.impact}</Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Key Profitability Factors</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {educationalContent.profitabilityFactors.map((factor, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <TrendingUpIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={factor} />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Common Challenges</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {educationalContent.commonChallenges.map((challenge, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <WarningIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={challenge} />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Strategies for Improvement</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {educationalContent.improvementStrategies.map((strategy, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <LightbulbIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={strategy} />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      </Box>

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
