import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, addDays } from 'date-fns';

const animalGestationPeriods = {
  'Cattle': 283,
  'Sheep': 150,
  'Goats': 150,
  'Pigs': 114,
  'Rabbits': 31
};

const BreedingCalendar = () => {
  const [records, setRecords] = useState(() => {
    const savedRecords = localStorage.getItem('breedingRecords');
    return savedRecords ? JSON.parse(savedRecords) : [];
  });
  const [open, setOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [formData, setFormData] = useState({
    animalType: '',
    animalId: '',
    breedingDate: null,
    notes: ''
  });

  useEffect(() => {
    localStorage.setItem('breedingRecords', JSON.stringify(records));
  }, [records]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingRecord(null);
    setFormData({
      animalType: '',
      animalId: '',
      breedingDate: null,
      notes: ''
    });
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setFormData({
      animalType: record.animalType,
      animalId: record.animalId,
      breedingDate: new Date(record.breedingDate),
      notes: record.notes
    });
    setOpen(true);
  };

  const handleDelete = (id) => {
    setRecords(records.filter(record => record.id !== id));
  };

  const handleSubmit = () => {
    if (!formData.animalType || !formData.animalId || !formData.breedingDate) {
      return;
    }

    const gestationPeriod = animalGestationPeriods[formData.animalType];
    const dueDate = addDays(new Date(formData.breedingDate), gestationPeriod);

    const newRecord = {
      id: editingRecord ? editingRecord.id : Date.now(),
      ...formData,
      breedingDate: formData.breedingDate.toISOString(),
      dueDate: dueDate.toISOString()
    };

    if (editingRecord) {
      setRecords(records.map(record => 
        record.id === editingRecord.id ? newRecord : record
      ));
    } else {
      setRecords([...records, newRecord]);
    }

    handleClose();
  };

  const calculateStatus = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const daysUntilDue = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    if (daysUntilDue < 0) return 'Past Due';
    if (daysUntilDue <= 14) return 'Due Soon';
    return 'In Progress';
  };

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Breeding Calendar
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleClickOpen}
            sx={{ mb: 2 }}
          >
            Add Breeding Record
          </Button>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Animal Type</TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell>Breeding Date</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.animalType}</TableCell>
                    <TableCell>{record.animalId}</TableCell>
                    <TableCell>{format(new Date(record.breedingDate), 'MM/dd/yyyy')}</TableCell>
                    <TableCell>{format(new Date(record.dueDate), 'MM/dd/yyyy')}</TableCell>
                    <TableCell>{calculateStatus(record.dueDate)}</TableCell>
                    <TableCell>{record.notes}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(record)} size="small">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(record.id)} size="small">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editingRecord ? 'Edit Breeding Record' : 'Add Breeding Record'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Animal Type</InputLabel>
                <Select
                  value={formData.animalType}
                  label="Animal Type"
                  onChange={(e) => setFormData({ ...formData, animalType: e.target.value })}
                >
                  {Object.keys(animalGestationPeriods).map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Animal ID"
                value={formData.animalId}
                onChange={(e) => setFormData({ ...formData, animalId: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Breeding Date"
                  value={formData.breedingDate}
                  onChange={(date) => setFormData({ ...formData, breedingDate: date })}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingRecord ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default BreedingCalendar;
