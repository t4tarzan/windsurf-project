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
  DialogActions,
  Chip
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns';

const recordTypes = [
  'Vaccination',
  'Treatment',
  'Medication',
  'Check-up',
  'Surgery',
  'Injury',
  'Disease',
  'Other'
];

const animalTypes = [
  'Cattle',
  'Sheep',
  'Goats',
  'Pigs',
  'Rabbits',
  'Chickens',
  'Ducks',
  'Other'
];

const HealthRecords = () => {
  const [records, setRecords] = useState(() => {
    const savedRecords = localStorage.getItem('healthRecords');
    return savedRecords ? JSON.parse(savedRecords) : [];
  });
  const [open, setOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [formData, setFormData] = useState({
    animalType: '',
    animalId: '',
    recordType: '',
    date: null,
    description: '',
    treatment: '',
    cost: '',
    veterinarian: '',
    followUpDate: null,
    notes: ''
  });

  useEffect(() => {
    localStorage.setItem('healthRecords', JSON.stringify(records));
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
      recordType: '',
      date: null,
      description: '',
      treatment: '',
      cost: '',
      veterinarian: '',
      followUpDate: null,
      notes: ''
    });
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setFormData({
      ...record,
      date: new Date(record.date),
      followUpDate: record.followUpDate ? new Date(record.followUpDate) : null
    });
    setOpen(true);
  };

  const handleDelete = (id) => {
    setRecords(records.filter(record => record.id !== id));
  };

  const handleSubmit = () => {
    if (!formData.animalType || !formData.animalId || !formData.recordType || !formData.date) {
      return;
    }

    const newRecord = {
      id: editingRecord ? editingRecord.id : Date.now(),
      ...formData,
      date: formData.date.toISOString(),
      followUpDate: formData.followUpDate ? formData.followUpDate.toISOString() : null
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

  const getStatusColor = (record) => {
    if (!record.followUpDate) return 'default';
    const followUp = new Date(record.followUpDate);
    const today = new Date();
    
    if (followUp < today) return 'error';
    if (Math.abs(followUp - today) / (1000 * 60 * 60 * 24) <= 7) return 'warning';
    return 'success';
  };

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Health Records
          </Typography>
        </Grid>
        
        <Grid item xs={12}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleClickOpen}
            sx={{ mb: 2 }}
          >
            Add Health Record
          </Button>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Animal Type</TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell>Record Type</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Follow-up</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{format(new Date(record.date), 'MM/dd/yyyy')}</TableCell>
                    <TableCell>{record.animalType}</TableCell>
                    <TableCell>{record.animalId}</TableCell>
                    <TableCell>
                      <Chip label={record.recordType} size="small" />
                    </TableCell>
                    <TableCell>{record.description}</TableCell>
                    <TableCell>
                      {record.followUpDate && (
                        <Chip
                          label={format(new Date(record.followUpDate), 'MM/dd/yyyy')}
                          size="small"
                          color={getStatusColor(record)}
                        />
                      )}
                    </TableCell>
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

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingRecord ? 'Edit Health Record' : 'Add Health Record'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Animal Type</InputLabel>
                <Select
                  value={formData.animalType}
                  label="Animal Type"
                  onChange={(e) => setFormData({ ...formData, animalType: e.target.value })}
                >
                  {animalTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Animal ID"
                value={formData.animalId}
                onChange={(e) => setFormData({ ...formData, animalId: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Record Type</InputLabel>
                <Select
                  value={formData.recordType}
                  label="Record Type"
                  onChange={(e) => setFormData({ ...formData, recordType: e.target.value })}
                >
                  {recordTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date"
                  value={formData.date}
                  onChange={(date) => setFormData({ ...formData, date: date })}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Treatment"
                value={formData.treatment}
                onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Cost"
                type="number"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                InputProps={{
                  startAdornment: '$'
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Veterinarian"
                value={formData.veterinarian}
                onChange={(e) => setFormData({ ...formData, veterinarian: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Follow-up Date"
                  value={formData.followUpDate}
                  onChange={(date) => setFormData({ ...formData, followUpDate: date })}
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

export default HealthRecords;
