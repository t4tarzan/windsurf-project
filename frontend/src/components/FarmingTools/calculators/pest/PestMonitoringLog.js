import React, { useState } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Rating,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  BugReport as PestIcon,
  CalendarMonth as DateIcon,
  LocationOn as LocationIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns';
import MonitoringDataCard from '../../components/pest/MonitoringDataCard';

// Educational content for SEO and user guidance
const educationalContent = {
  introduction: `Regular pest monitoring is crucial for effective pest management in agriculture. This monitoring log helps farmers track pest populations, damage levels, and treatment effectiveness over time, enabling data-driven pest management decisions.`,
  
  monitoringBenefits: [
    {
      benefit: 'Early Detection',
      description: 'Identify pest problems before they become severe, allowing for timely intervention.'
    },
    {
      benefit: 'Treatment Evaluation',
      description: 'Track the effectiveness of pest control measures and adjust strategies as needed.'
    },
    {
      benefit: 'Historical Records',
      description: 'Build a database of pest patterns to predict and prevent future outbreaks.'
    },
    {
      benefit: 'Economic Savings',
      description: 'Optimize treatment timing and reduce unnecessary pesticide applications.'
    }
  ],
  
  bestPractices: [
    {
      practice: 'Regular Scouting',
      tips: [
        'Check crops at least weekly during growing season',
        'Inspect both upper and lower leaf surfaces',
        'Monitor for natural enemies as well as pests',
        'Use consistent sampling patterns'
      ]
    },
    {
      practice: 'Record Keeping',
      tips: [
        'Note weather conditions during observations',
        'Document pest numbers and damage levels',
        'Track treatment dates and results',
        'Include photos when possible'
      ]
    },
    {
      practice: 'Data Analysis',
      tips: [
        'Review records regularly to identify patterns',
        'Compare data across seasons',
        'Share information with pest management advisors',
        'Use data to refine treatment thresholds'
      ]
    }
  ]
};

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
  'Thrips',
  'Caterpillars',
  'Beetles',
  'Scale Insects',
  'Mealybugs'
];

const PestMonitoringLog = () => {
  const [logs, setLogs] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [currentLog, setCurrentLog] = useState({
    date: new Date(),
    location: '',
    pestType: '',
    severity: 1,
    notes: '',
    treatments: [],
    recommendations: ''
  });

  const handleInputChange = (field) => (event) => {
    setCurrentLog({
      ...currentLog,
      [field]: event.target.value
    });
  };

  const handleDateChange = (date) => {
    setCurrentLog({
      ...currentLog,
      date
    });
  };

  const handleAddLog = () => {
    if (editingLog !== null) {
      setLogs(logs.map((log, index) => 
        index === editingLog ? { ...currentLog } : log
      ));
      setEditingLog(null);
    } else {
      setLogs([...logs, { ...currentLog }]);
    }
    setOpenDialog(false);
    setCurrentLog({
      date: new Date(),
      location: '',
      pestType: '',
      severity: 1,
      notes: '',
      treatments: [],
      recommendations: ''
    });
  };

  const handleEditLog = (index) => {
    setEditingLog(index);
    setCurrentLog(logs[index]);
    setOpenDialog(true);
  };

  const handleDeleteLog = (index) => {
    setLogs(logs.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Pest Monitoring Log
        </Typography>

        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">About Pest Monitoring</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography paragraph>{educationalContent.introduction}</Typography>
            <Grid container spacing={2}>
              {educationalContent.monitoringBenefits.map((benefit) => (
                <Grid item xs={12} md={3} key={benefit.benefit}>
                  <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      {benefit.benefit}
                    </Typography>
                    <Typography variant="body2">
                      {benefit.description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>Best Practices</Typography>
              <Grid container spacing={2}>
                {educationalContent.bestPractices.map((practice) => (
                  <Grid item xs={12} md={4} key={practice.practice}>
                    <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        {practice.practice}
                      </Typography>
                      <ul>
                        {practice.tips.map((tip, index) => (
                          <li key={index}>
                            <Typography variant="body2">{tip}</Typography>
                          </li>
                        ))}
                      </ul>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </AccordionDetails>
        </Accordion>

        <Box sx={{ mt: 3, mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingLog(null);
              setCurrentLog({
                date: new Date(),
                location: '',
                pestType: '',
                severity: 1,
                notes: '',
                treatments: [],
                recommendations: ''
              });
              setOpenDialog(true);
            }}
          >
            Add Monitoring Log
          </Button>
        </Box>

        {logs.length === 0 ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            No monitoring logs recorded yet. Click the button above to add your first log.
          </Alert>
        ) : (
          <Box sx={{ mt: 2 }}>
            {logs.map((log, index) => (
              <Box key={index} sx={{ position: 'relative', mb: 2 }}>
                <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleEditLog(index)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteLog(index)}
                  >
                    Delete
                  </Button>
                </Box>
                <MonitoringDataCard data={log} />
              </Box>
            ))}
          </Box>
        )}

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingLog !== null ? 'Edit Monitoring Log' : 'Add New Monitoring Log'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Date"
                    value={currentLog.date}
                    onChange={handleDateChange}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Location"
                  value={currentLog.location}
                  onChange={handleInputChange('location')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Pest Type</InputLabel>
                  <Select
                    value={currentLog.pestType}
                    onChange={handleInputChange('pestType')}
                    label="Pest Type"
                  >
                    {commonPests.map((pest) => (
                      <MenuItem key={pest} value={pest}>
                        {pest}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Severity</InputLabel>
                  <Select
                    value={currentLog.severity}
                    onChange={handleInputChange('severity')}
                    label="Severity"
                  >
                    {severityLevels.map((level) => (
                      <MenuItem key={level.value} value={level.value}>
                        {level.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Observations"
                  value={currentLog.notes}
                  onChange={handleInputChange('notes')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Applied Treatments"
                  value={currentLog.treatments.join(', ')}
                  onChange={(e) => setCurrentLog({
                    ...currentLog,
                    treatments: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                  })}
                  helperText="Enter treatments separated by commas"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Recommendations"
                  value={currentLog.recommendations}
                  onChange={handleInputChange('recommendations')}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleAddLog}
              disabled={!currentLog.location || !currentLog.pestType}
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
