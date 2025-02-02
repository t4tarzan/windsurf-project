import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Alert,
  MenuItem,
  Box,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Calculate as CalculateIcon,
  TrendingUp as TrendingUpIcon,
  Info as InfoIcon,
  AccountBalance as FinanceIcon,
  Warning as WarningIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';

// Educational content for SEO and user guidance
const educationalContent = {
  introduction: `The Return on Investment (ROI) Calculator helps farmers evaluate the financial viability of agricultural investments. This tool analyzes costs, returns, and payback periods to make informed investment decisions for farm improvements and expansions.`,
  
  roiComponents: [
    {
      component: 'Initial Investment',
      description: 'Total upfront costs required',
      examples: ['Purchase price', 'Installation costs', 'Training expenses', 'Setup fees']
    },
    {
      component: 'Operating Costs',
      description: 'Ongoing expenses related to the investment',
      examples: ['Maintenance', 'Labor', 'Fuel/Energy', 'Insurance']
    },
    {
      component: 'Revenue Generation',
      description: 'Income produced by the investment',
      examples: ['Increased yield', 'Premium pricing', 'Labor savings', 'Resource efficiency']
    }
  ],

  evaluationMetrics: {
    paybackPeriod: {
      description: 'Time required to recover the initial investment',
      considerations: ['Cash flow timing', 'Seasonal variations', 'Market conditions']
    },
    netPresentValue: {
      description: 'Current value of future cash flows',
      considerations: ['Discount rate', 'Investment horizon', 'Risk factors']
    },
    benefitCostRatio: {
      description: 'Ratio of benefits to costs over time',
      considerations: ['Direct benefits', 'Indirect benefits', 'Hidden costs']
    }
  },

  investmentConsiderations: [
    'Alignment with farm goals and strategy',
    'Impact on operational efficiency',
    'Environmental sustainability',
    'Market demand and trends',
    'Regulatory compliance',
    'Available financing options'
  ]
};

const investmentTypes = {
  'Equipment & Machinery': {
    description: 'Long-term investments in farm equipment',
    examples: 'Tractors, irrigation systems, processing equipment',
    typicalLifespan: '5-10 years',
    considerations: 'Maintenance costs, fuel efficiency, resale value'
  },
  'Infrastructure': {
    description: 'Permanent or semi-permanent structures',
    examples: 'Greenhouses, storage facilities, fencing',
    typicalLifespan: '10-20 years',
    considerations: 'Building permits, weather resistance, expandability'
  },
  'Land Improvements': {
    description: 'Enhancements to farming land',
    examples: 'Soil amendments, drainage systems, terracing',
    typicalLifespan: '5-15 years',
    considerations: 'Soil type, climate impact, environmental regulations'
  },
  'Technology': {
    description: 'Digital and automated systems',
    examples: 'Farm management software, sensors, automation',
    typicalLifespan: '3-5 years',
    considerations: 'Training requirements, compatibility, upgrades'
  },
  'Livestock': {
    description: 'Animal-related investments',
    examples: 'Breeding stock, housing, handling equipment',
    typicalLifespan: '5-10 years',
    considerations: 'Animal welfare, feed costs, veterinary care'
  }
};

const additionalEducationalContent = {
  introduction: `Return on Investment (ROI) in agriculture measures the profitability of your farming investments by comparing the gains from an investment relative to its cost. Understanding ROI helps farmers make informed decisions about farm improvements, equipment purchases, and crop selection.`,
  
  importance: [
    {
      title: 'Investment Decision Making',
      description: 'Evaluate potential farm investments',
      impact: 'Make data-driven financial decisions'
    },
    {
      title: 'Resource Allocation',
      description: 'Optimize distribution of limited resources',
      impact: 'Maximize farm profitability'
    },
    {
      title: 'Risk Assessment',
      description: 'Compare different investment opportunities',
      impact: 'Minimize financial risks'
    }
  ],

  considerations: [
    'Time value of money and inflation',
    'Market volatility and price fluctuations',
    'Weather and environmental risks',
    'Labor and operational costs',
    'Equipment depreciation'
  ],

  tips: [
    'Include all direct and indirect costs',
    'Consider long-term maintenance costs',
    'Account for seasonal variations',
    'Factor in potential risks and uncertainties',
    'Review historical data when available'
  ]
};

const ROICalculator = () => {
  const [investmentType, setInvestmentType] = useState('');
  const [initialInvestment, setInitialInvestment] = useState('');
  const [annualRevenue, setAnnualRevenue] = useState('');
  const [annualCosts, setAnnualCosts] = useState('');
  const [projectLifespan, setProjectLifespan] = useState('');
  const [salvageValue, setSalvageValue] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const calculateROI = () => {
    if (!initialInvestment || !annualRevenue || !annualCosts || !projectLifespan) {
      setError('Please fill in all required fields');
      return;
    }

    const investment = parseFloat(initialInvestment);
    const revenue = parseFloat(annualRevenue);
    const costs = parseFloat(annualCosts);
    const lifespan = parseFloat(projectLifespan);
    const salvage = parseFloat(salvageValue) || 0;

    if (investment <= 0 || revenue <= 0 || costs <= 0 || lifespan <= 0) {
      setError('All values must be greater than 0');
      return;
    }

    // Calculate annual net profit
    const annualNetProfit = revenue - costs;

    // Calculate total profit over lifespan
    const totalProfit = (annualNetProfit * lifespan) + salvage - investment;

    // Calculate ROI percentage
    const roi = (totalProfit / investment) * 100;

    // Calculate Payback Period
    const paybackPeriod = investment / annualNetProfit;

    // Calculate Net Present Value (NPV) with 5% discount rate
    const discountRate = 0.05;
    let npv = -investment;
    for (let year = 1; year <= lifespan; year++) {
      npv += annualNetProfit / Math.pow(1 + discountRate, year);
    }
    npv += salvage / Math.pow(1 + discountRate, lifespan);

    // Calculate annual ROI
    const annualROI = (annualNetProfit / investment) * 100;

    setResults({
      totalProfit: totalProfit.toFixed(2),
      roi: roi.toFixed(2),
      paybackPeriod: paybackPeriod.toFixed(1),
      npv: npv.toFixed(2),
      annualROI: annualROI.toFixed(2),
      annualNetProfit: annualNetProfit.toFixed(2)
    });
    setError('');
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Agricultural ROI Calculator
        </Typography>

        {/* Educational Content */}
        <Box mt={3} mb={3}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Understanding Agricultural ROI</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>{educationalContent.introduction}</Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Why ROI Matters in Farming</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {additionalEducationalContent.importance.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <TrendingUpIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.title}
                      secondary={`${item.description} - ${item.impact}`}
                    />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Key Considerations</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {additionalEducationalContent.considerations.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <InfoIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Tips for Accurate ROI Calculation</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {additionalEducationalContent.tips.map((tip, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CalculateIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={tip} />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        </Box>

        {/* Calculator Content */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Investment Type"
              value={investmentType}
              onChange={(e) => setInvestmentType(e.target.value)}
              margin="normal"
            >
              {Object.keys(investmentTypes).map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Initial Investment ($)"
              type="number"
              value={initialInvestment}
              onChange={(e) => setInitialInvestment(e.target.value)}
              margin="normal"
              inputProps={{ min: 0, step: 100 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Expected Annual Revenue ($)"
              type="number"
              value={annualRevenue}
              onChange={(e) => setAnnualRevenue(e.target.value)}
              margin="normal"
              inputProps={{ min: 0, step: 100 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Annual Operating Costs ($)"
              type="number"
              value={annualCosts}
              onChange={(e) => setAnnualCosts(e.target.value)}
              margin="normal"
              inputProps={{ min: 0, step: 100 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Project Lifespan (years)"
              type="number"
              value={projectLifespan}
              onChange={(e) => setProjectLifespan(e.target.value)}
              margin="normal"
              inputProps={{ min: 1, step: 1 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Estimated Salvage Value ($)"
              type="number"
              value={salvageValue}
              onChange={(e) => setSalvageValue(e.target.value)}
              margin="normal"
              inputProps={{ min: 0, step: 100 }}
              helperText="Expected value at the end of lifespan"
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={calculateROI}
              disabled={!initialInvestment || !annualRevenue || !annualCosts || !projectLifespan}
            >
              Calculate ROI
            </Button>
          </Grid>

          {error && (
            <Grid item xs={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}

          {investmentType && (
            <Grid item xs={12}>
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Description</TableCell>
                      <TableCell>Examples</TableCell>
                      <TableCell>Typical Lifespan</TableCell>
                      <TableCell>Key Considerations</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{investmentTypes[investmentType].description}</TableCell>
                      <TableCell>{investmentTypes[investmentType].examples}</TableCell>
                      <TableCell>{investmentTypes[investmentType].typicalLifespan}</TableCell>
                      <TableCell>{investmentTypes[investmentType].considerations}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          )}

          {results && (
            <Grid item xs={12}>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" gutterBottom>
                Investment Analysis Results
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell>Total Return on Investment (ROI)</TableCell>
                          <TableCell align="right">{results.roi}%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Annual ROI</TableCell>
                          <TableCell align="right">{results.annualROI}%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Payback Period</TableCell>
                          <TableCell align="right">{results.paybackPeriod} years</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell>Annual Net Profit</TableCell>
                          <TableCell align="right">${results.annualNetProfit}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Total Profit (over lifespan)</TableCell>
                          <TableCell align="right">${results.totalProfit}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Net Present Value (NPV)</TableCell>
                          <TableCell align="right">${results.npv}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ROICalculator;
