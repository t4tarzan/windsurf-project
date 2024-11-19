import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  Rating,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  BugReport as PestIcon,
  CalendarMonth as DateIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns';

// Severity levels for pest infestations
const severityLevels = [
  { value: 1, label: 'Low', color: 'success' },
  { value: 2, label: 'Moderate', color: 'warning' },
  { value: 3, label: 'High', color: 'error' },
];

// Common pest types for quick selection
const commonPests = [
  'Aphids',
  'Spider Mites',
  'Whiteflies',
  'Caterpillars',
  'Beetles',
  'Thrips',
  'Scale Insects',
  'Mealybugs',
  'Other',
];

// Location areas for monitoring
const locationAreas = [
  'Field A',
  'Field B',
  'Greenhouse 1',
  'Greenhouse 2',
  'Orchard',
  'Garden Beds',
  'Other',
];

const PestMonitoringLog = () => {
  const [logs, setLogs] = useState(() => {
    const savedLogs = localStorage.getItem('pestMonitoringLogs');
    return savedLogs ? JSON.parse(savedLogs) : [];
  });
  const [open, setOpen] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [formData, setFormData] = useState({
    date: new Date(),
    location: '',
    pestType: '',
    severity: 1,
    affectedCrops: '',
    symptoms: '',
    controlMeasures: '',
    notes: '',
  });

  // Save logs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('pestMonitoringLogs', JSON.stringify(logs));
  }, [logs]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingLog(null);
    setFormData({
      date: new Date(),
      location: '',
      pestType: '',
      severity: 1,
      affectedCrops: '',
      symptoms: '',
      controlMeasures: '',
      notes: '',
    });
  };

  const handleEdit = (log) => {
    setEditingLog(log);
    setFormData({
      ...log,
      date: new Date(log.date),
    });
    setOpen(true);
  };

  const handleDelete = (index) => {
    const newLogs = logs.filter((_, i) => i !== index);
    setLogs(newLogs);
  };

  const handleSubmit = () => {
    if (editingLog) {
      const updatedLogs = logs.map((log) =>
        log === editingLog ? { ...formData, date: formData.date.toISOString() } : log
      );
      setLogs(updatedLogs);
    } else {
      setLogs([...logs, { ...formData, date: formData.date.toISOString() }]);
    }
    handleClose();
  };

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const getSeverityChip = (severity) => {
    const level = severityLevels.find((l) => l.value === severity);
    return (
      <Chip
        label={level.label}
        color={level.color}
        size="small"
        sx={{ minWidth: 80 }}
      />
    );
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="div">
            Pest Monitoring Log
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleClickOpen}
          >
            Add New Entry
          </Button>
        </Box>

        {logs.length === 0 ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            No monitoring logs yet. Click "Add New Entry" to start tracking pest observations.
          </Alert>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Pest Type</TableCell>
                  <TableCell>Severity</TableCell>
                  <TableCell>Affected Crops</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.map((log, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <DateIcon sx={{ mr: 1, color: 'primary.main' }} />
                        {format(new Date(log.date), 'MMM d, yyyy')}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationIcon sx={{ mr: 1, color: 'primary.main' }} />
                        {log.location}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PestIcon sx={{ mr: 1, color: 'primary.main' }} />
                        {log.pestType}
                      </Box>
                    </TableCell>
                    <TableCell>{getSeverityChip(log.severity)}</TableCell>
                    <TableCell>{log.affectedCrops}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(log)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(index)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingLog ? 'Edit Monitoring Log' : 'New Monitoring Log'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Observation Date"
                    value={formData.date}
                    onChange={(newDate) =>
                      setFormData({ ...formData, date: newDate })
                    }
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Location</InputLabel>
                  <Select
                    value={formData.location}
                    label="Location"
                    onChange={handleChange('location')}
                  >
                    {locationAreas.map((area) => (
                      <MenuItem key={area} value={area}>
                        {area}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Pest Type</InputLabel>
                  <Select
                    value={formData.pestType}
                    label="Pest Type"
                    onChange={handleChange('pestType')}
                  >
                    {commonPests.map((pest) => (
                      <MenuItem key={pest} value={pest}>
                        {pest}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Severity</InputLabel>
                  <Select
                    value={formData.severity}
                    label="Severity"
                    onChange={handleChange('severity')}
                  >
                    {severityLevels.map((level) => (
                      <MenuItem key={level.value} value={level.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {level.label}
                          <Rating
                            value={level.value}
                            max={3}
                            readOnly
                            size="small"
                            sx={{ ml: 1 }}
                          />
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Affected Crops"
                  value={formData.affectedCrops}
                  onChange={handleChange('affectedCrops')}
                  placeholder="List affected crops (comma separated)"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Symptoms"
                  value={formData.symptoms}
                  onChange={handleChange('symptoms')}
                  multiline
                  rows={2}
                  placeholder="Describe observed symptoms"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Control Measures"
                  value={formData.controlMeasures}
                  onChange={handleChange('controlMeasures')}
                  multiline
                  rows={2}
                  placeholder="List applied or planned control measures"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Additional Notes"
                  value={formData.notes}
                  onChange={handleChange('notes')}
                  multiline
                  rows={2}
                  placeholder="Any additional observations or notes"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={!formData.location || !formData.pestType}
            >
              {editingLog ? 'Update' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default PestMonitoringLog;
