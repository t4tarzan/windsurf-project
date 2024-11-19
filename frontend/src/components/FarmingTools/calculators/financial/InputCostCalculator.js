import React, { useState, useEffect } from 'react';
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
  IconButton,
  MenuItem,
  Box,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

const categories = {
  'Seeds & Plants': [
    'Seeds',
    'Seedlings',
    'Bulbs',
    'Rootstock',
  ],
  'Fertilizers': [
    'Organic Fertilizer',
    'Chemical Fertilizer',
    'Compost',
    'Manure',
  ],
  'Pest Control': [
    'Pesticides',
    'Herbicides',
    'Fungicides',
    'Traps',
    'Beneficial Insects',
  ],
  'Equipment': [
    'Tools',
    'Machinery',
    'Irrigation Equipment',
    'Protective Gear',
  ],
  'Growing Supplies': [
    'Soil',
    'Mulch',
    'Containers',
    'Growing Media',
    'Row Covers',
  ],
  'Infrastructure': [
    'Greenhouse Materials',
    'Fencing',
    'Storage',
    'Shade Structures',
  ],
};

const InputCostCalculator = () => {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [unitCost, setUnitCost] = useState('');
  const [totalCost, setTotalCost] = useState(0);
  const [categoryTotals, setCategoryTotals] = useState({});

  const addItem = () => {
    if (!category || !description || !quantity || !unitCost) return;

    const newItem = {
      id: Date.now(),
      category,
      subCategory,
      description,
      quantity: parseFloat(quantity),
      unit,
      unitCost: parseFloat(unitCost),
      total: parseFloat(quantity) * parseFloat(unitCost),
    };

    setItems([...items, newItem]);
    resetForm();
  };

  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const resetForm = () => {
    setSubCategory('');
    setDescription('');
    setQuantity('');
    setUnit('');
    setUnitCost('');
  };

  useEffect(() => {
    // Calculate total cost and category totals
    let total = 0;
    const catTotals = {};

    items.forEach(item => {
      total += item.total;
      catTotals[item.category] = (catTotals[item.category] || 0) + item.total;
    });

    setTotalCost(total);
    setCategoryTotals(catTotals);
  }, [items]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Input Cost Calculator
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          Track and calculate your farming input costs by category.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <TextField
              select
              fullWidth
              label="Category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setSubCategory('');
              }}
              margin="normal"
            >
              {Object.keys(categories).map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              select
              fullWidth
              label="Sub-Category"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              margin="normal"
              disabled={!category}
            >
              {category && categories[category].map((sub) => (
                <MenuItem key={sub} value={sub}>
                  {sub}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              margin="normal"
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              margin="normal"
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Unit (e.g., kg, pieces)"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              margin="normal"
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Unit Cost ($)"
              type="number"
              value={unitCost}
              onChange={(e) => setUnitCost(e.target.value)}
              margin="normal"
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <Box display="flex" alignItems="flex-end" height="100%">
              <Button
                variant="contained"
                color="primary"
                onClick={addItem}
                startIcon={<AddIcon />}
                disabled={!category || !description || !quantity || !unitCost}
                sx={{ mb: 1 }}
              >
                Add Item
              </Button>
            </Box>
          </Grid>

          {items.length > 0 && (
            <>
              <Grid item xs={12}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Category</TableCell>
                        <TableCell>Sub-Category</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell>Unit</TableCell>
                        <TableCell align="right">Unit Cost ($)</TableCell>
                        <TableCell align="right">Total ($)</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{item.subCategory}</TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell align="right">{item.quantity}</TableCell>
                          <TableCell>{item.unit}</TableCell>
                          <TableCell align="right">{item.unitCost.toFixed(2)}</TableCell>
                          <TableCell align="right">{item.total.toFixed(2)}</TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => deleteItem(item.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>

              <Grid item xs={12} md={6}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Category</TableCell>
                        <TableCell align="right">Total ($)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(categoryTotals).map(([cat, total]) => (
                        <TableRow key={cat}>
                          <TableCell>{cat}</TableCell>
                          <TableCell align="right">{total.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Total Cost</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                          ${totalCost.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default InputCostCalculator;
