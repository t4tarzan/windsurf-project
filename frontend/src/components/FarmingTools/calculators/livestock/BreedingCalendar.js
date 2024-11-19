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
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Tooltip,
  Box,
  Alert
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  Edit as EditIcon,
  Info as InfoIcon,
  Pets as PetsIcon,
  CalendarToday as CalendarIcon,
  Timer as TimerIcon
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, addDays } from 'date-fns';

// Educational content for SEO and user guidance
const educationalContent = {
  introduction: `A breeding calendar is an essential tool for livestock management, helping farmers track breeding dates, predict due dates, and manage animal reproduction efficiently. Proper breeding management is crucial for maintaining herd health and optimizing farm productivity.`,
  
  animalInfo: {
    'Cattle': {
      gestationPeriod: 283,
      breedingTips: [
        'Check for heat signs every 18-24 days',
        'Optimal breeding window: 12-18 hours after heat onset',
        'Maintain body condition score of 5-6',
        'Consider seasonal breeding for calving schedule'
      ],
      signs: [
        'Mounting other animals',
        'Standing to be mounted',
        'Restlessness and bellowing',
        'Clear mucus discharge'
      ]
    },
    'Sheep': {
      gestationPeriod: 150,
      breedingTips: [
        'Breed during natural season (fall)',
        'Ram to ewe ratio: 1:30-50',
        'Flush ewes 2-3 weeks before breeding',
        'Check ram fertility before breeding season'
      ],
      signs: [
        'Seeking ram attention',
        'Tail wagging',
        'Reduced appetite',
        'Swollen vulva'
      ]
    },
    'Goats': {
      gestationPeriod: 150,
      breedingTips: [
        'Breed during natural season (fall)',
        'Buck to doe ratio: 1:20-30',
        'Provide proper nutrition before breeding',
        'Monitor doe health and vaccination status'
      ],
      signs: [
        'Frequent urination',
        'Tail wagging',
        'Vocalization',
        'Decreased milk production'
      ]
    },
    'Pigs': {
      gestationPeriod: 114,
      breedingTips: [
        'Monitor for standing heat',
        'Breed 12-36 hours after heat onset',
        'Maintain comfortable temperature',
        'Ensure proper body condition'
      ],
      signs: [
        'Standing reflex',
        'Red swollen vulva',
        'Decreased appetite',
        'Mounting behavior'
      ]
    },
    'Rabbits': {
      gestationPeriod: 31,
      breedingTips: [
        'Check doe receptivity',
        'Bring doe to buck\'s cage',
        'Monitor for successful mating',
        'Provide nest box 28 days after breeding'
      ],
      signs: [
        'Chin rubbing',
        'Restlessness',
        'Lordosis posture',
        'Nest building behavior'
      ]
    }
  },

  bestPractices: [
    {
      title: 'Record Keeping',
      points: [
        'Document all breeding dates accurately',
        'Track heat cycles and breeding history',
        'Maintain individual animal records',
        'Record birth outcomes and complications'
      ]
    },
    {
      title: 'Health Management',
      points: [
        'Regular veterinary check-ups',
        'Maintain vaccination schedules',
        'Monitor body condition scores',
        'Provide proper nutrition'
      ]
    },
    {
      title: 'Facility Preparation',
      points: [
        'Clean and sanitize breeding areas',
        'Ensure adequate space',
        'Maintain proper ventilation',
        'Prepare birthing facilities in advance'
      ]
    }
  ]
};

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
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Breeding Calendar
        <Tooltip title="Track and manage livestock breeding">
          <IconButton size="small" sx={{ ml: 1 }}>
            <InfoIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              About Breeding Management
            </Typography>
            <Typography paragraph>
              {educationalContent.introduction}
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Animal-Specific Guidelines
            </Typography>
            <Grid container spacing={3}>
              {Object.entries(educationalContent.animalInfo).map(([animal, info]) => (
                <Grid item xs={12} md={4} key={animal}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" color="primary" gutterBottom>
                        {animal}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        Gestation: {info.gestationPeriod} days
                      </Typography>
                      <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>
                        Breeding Tips:
                      </Typography>
                      <List dense>
                        {info.breedingTips.map((tip, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={tip} />
                          </ListItem>
                        ))}
                      </List>
                      <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>
                        Heat Signs:
                      </Typography>
                      <List dense>
                        {info.signs.map((sign, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={sign} />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Best Management Practices
            </Typography>
            <Grid container spacing={3}>
              {educationalContent.bestPractices.map((practice) => (
                <Grid item xs={12} md={4} key={practice.title}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" color="primary" gutterBottom>
                        {practice.title}
                      </Typography>
                      <List dense>
                        {practice.points.map((point, index) => (
                          <ListItem key={index}>
                            <ListItemText primary={point} />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" gutterBottom>
        Manage Breeding Records
      </Typography>

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
    </Box>
  );
};

export default BreedingCalendar;
