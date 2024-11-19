import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  IconButton,
  Box,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const marketTypes = {
  'Farmers Market': {
    description: 'Direct-to-consumer sales at local markets',
    markup: 1.5,
    considerations: 'Higher prices but requires staffing and transportation'
  },
  'Wholesale': {
    description: 'Bulk sales to distributors or retailers',
    markup: 0.8,
    considerations: 'Lower prices but consistent volume and simpler logistics'
  },
  'Restaurant': {
    description: 'Direct sales to restaurants and food service',
    markup: 1.3,
    considerations: 'Premium prices for quality, requires relationship building'
  },
  'CSA': {
    description: 'Community Supported Agriculture subscriptions',
    markup: 1.4,
    considerations: 'Guaranteed income, requires diverse crop planning'
  },
  'Food Hub': {
    description: 'Aggregation and distribution centers',
    markup: 1.1,
    considerations: 'Medium prices, helps with logistics and marketing'
  }
};

const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];

const MarketPriceAnalyzer = () => {
  const [products, setProducts] = useState([{
    name: '',
    unit: '',
    productionCost: '',
    marketType: '',
    season: '',
    competitorPrice: '',
    id: Date.now()
  }]);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);

  const addProduct = () => {
    setProducts([...products, {
      name: '',
      unit: '',
      productionCost: '',
      marketType: '',
      season: '',
      competitorPrice: '',
      id: Date.now()
    }]);
  };

  const removeProduct = (id) => {
    if (products.length > 1) {
      setProducts(products.filter(product => product.id !== id));
    }
  };

  const handleProductChange = (id, field, value) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, [field]: value } : product
    ));
  };

  const calculatePrices = () => {
    // Validate inputs
    for (const product of products) {
      if (!product.name || !product.unit || !product.productionCost || 
          !product.marketType || !product.season || !product.competitorPrice) {
        setError('Please fill in all required fields for each product');
        return;
      }
      if (parseFloat(product.productionCost) <= 0 || parseFloat(product.competitorPrice) <= 0) {
        setError('Production cost and competitor price must be greater than 0');
        return;
      }
    }

    // Calculate prices and analysis
    const productResults = products.map(product => {
      const productionCost = parseFloat(product.productionCost);
      const competitorPrice = parseFloat(product.competitorPrice);
      const markup = marketTypes[product.marketType].markup;

      const suggestedPrice = productionCost * markup;
      const priceCompetitiveness = ((competitorPrice - suggestedPrice) / competitorPrice) * 100;
      const profitMargin = ((suggestedPrice - productionCost) / suggestedPrice) * 100;

      return {
        ...product,
        suggestedPrice,
        priceCompetitiveness,
        profitMargin
      };
    });

    const averageProfitMargin = productResults.reduce((sum, p) => sum + p.profitMargin, 0) / productResults.length;
    const mostProfitable = [...productResults].sort((a, b) => b.profitMargin - a.profitMargin)[0];
    const leastProfitable = [...productResults].sort((a, b) => a.profitMargin - b.profitMargin)[0];

    setResults({
      productResults,
      averageProfitMargin,
      mostProfitable,
      leastProfitable
    });
    setError('');
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Market Price Analyzer
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Analyze market prices and determine optimal pricing strategies for your farm products.
        </Typography>

        {products.map((product, index) => (
          <Box key={product.id} sx={{ mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Product {index + 1}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Product Name"
                  value={product.name}
                  onChange={(e) => handleProductChange(product.id, 'name', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Unit (e.g., lb, bunch, dozen)"
                  value={product.unit}
                  onChange={(e) => handleProductChange(product.id, 'unit', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Production Cost per Unit ($)"
                  type="number"
                  value={product.productionCost}
                  onChange={(e) => handleProductChange(product.id, 'productionCost', e.target.value)}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Market Type</InputLabel>
                  <Select
                    value={product.marketType}
                    label="Market Type"
                    onChange={(e) => handleProductChange(product.id, 'marketType', e.target.value)}
                  >
                    {Object.keys(marketTypes).map((type) => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Season</InputLabel>
                  <Select
                    value={product.season}
                    label="Season"
                    onChange={(e) => handleProductChange(product.id, 'season', e.target.value)}
                  >
                    {seasons.map((season) => (
                      <MenuItem key={season} value={season}>{season}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Competitor Price ($)"
                  type="number"
                  value={product.competitorPrice}
                  onChange={(e) => handleProductChange(product.id, 'competitorPrice', e.target.value)}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12}>
                <IconButton 
                  onClick={() => removeProduct(product.id)}
                  disabled={products.length === 1}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>

            {product.marketType && marketTypes[product.marketType] && (
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell><strong>Description:</strong></TableCell>
                      <TableCell>{marketTypes[product.marketType].description}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Typical Markup:</strong></TableCell>
                      <TableCell>{(marketTypes[product.marketType].markup * 100 - 100).toFixed(0)}% above cost</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Key Considerations:</strong></TableCell>
                      <TableCell>{marketTypes[product.marketType].considerations}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        ))}

        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<AddIcon />}
            onClick={addProduct}
            variant="outlined"
            color="primary"
          >
            Add Product
          </Button>
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={calculatePrices}
          sx={{ mb: 2 }}
        >
          Analyze Prices
        </Button>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {results && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" gutterBottom>
              Price Analysis Results
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell>Market</TableCell>
                        <TableCell>Season</TableCell>
                        <TableCell>Production Cost</TableCell>
                        <TableCell>Suggested Price</TableCell>
                        <TableCell>Competitor Price</TableCell>
                        <TableCell>Competitiveness</TableCell>
                        <TableCell>Profit Margin</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {results.productResults.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>{product.name} (per {product.unit})</TableCell>
                          <TableCell>{product.marketType}</TableCell>
                          <TableCell>{product.season}</TableCell>
                          <TableCell>${product.productionCost}</TableCell>
                          <TableCell>${product.suggestedPrice.toFixed(2)}</TableCell>
                          <TableCell>${product.competitorPrice}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {product.priceCompetitiveness > 0 ? (
                                <TrendingDownIcon color="success" />
                              ) : (
                                <TrendingUpIcon color="error" />
                              )}
                              {Math.abs(product.priceCompetitiveness).toFixed(1)}%
                            </Box>
                          </TableCell>
                          <TableCell>{product.profitMargin.toFixed(1)}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid item xs={12}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell><strong>Average Profit Margin:</strong></TableCell>
                        <TableCell>{results.averageProfitMargin.toFixed(1)}%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Most Profitable Product:</strong></TableCell>
                        <TableCell>
                          {results.mostProfitable.name} ({results.mostProfitable.profitMargin.toFixed(1)}% margin)
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Least Profitable Product:</strong></TableCell>
                        <TableCell>
                          {results.leastProfitable.name} ({results.leastProfitable.profitMargin.toFixed(1)}% margin)
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MarketPriceAnalyzer;
