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
  IconButton,
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
  Delete as DeleteIcon,
  Add as AddIcon,
  People as PeopleIcon,
  MonetizationOn as MoneyIcon,
  Schedule as ScheduleIcon,
  Insights as InsightsIcon,
  ExpandMore as ExpandMoreIcon,
  Work as WorkIcon,
  Info as InfoIcon
} from '@mui/icons-material';

// Educational content for SEO and user guidance
const educationalContent = {
  introduction: `The Labor Cost Estimator helps farmers accurately budget and track labor expenses across different farming operations. This tool considers various tasks, wage rates, and time requirements to provide comprehensive labor cost projections.`,
  laborManagementTips: [
    {
      tip: 'Task Scheduling',
      description: 'Schedule labor-intensive tasks during optimal weather conditions and crop growth stages.'
    },
    {
      tip: 'Efficiency Planning',
      description: 'Group similar tasks together to minimize setup time and tool changes.'
    },
    {
      tip: 'Skills Management',
      description: 'Match worker skills to appropriate tasks for maximum efficiency.'
    }
  ],
  costConsiderations: [
    'Base wages and overtime rates',
    'Seasonal variations in labor needs',
    'Training and supervision time',
    'Equipment operation skills',
    'Worker benefits and insurance',
    'Compliance with labor laws'
  ],
  laborTypes: [
    {
      title: 'Seasonal Workers',
      description: 'Temporary workers for peak seasons',
      considerations: 'Housing, training, scheduling'
    },
    {
      title: 'Full-Time Staff',
      description: 'Year-round employees',
      considerations: 'Benefits, retention, skill development'
    },
    {
      title: 'Contract Workers',
      description: 'Task-specific laborers',
      considerations: 'Availability, rates, quality control'
    }
  ],
  costFactors: [
    'Base wages and overtime',
    'Payroll taxes and insurance',
    'Worker benefits and accommodations',
    'Training and supervision costs',
    'Seasonal variations in labor needs'
  ],
  efficiencyTips: [
    'Implement efficient work systems',
    'Provide proper tools and equipment',
    'Optimize crew sizes for tasks',
    'Use time-tracking systems',
    'Cross-train workers for flexibility'
  ],
  compliancePoints: [
    'Follow minimum wage requirements',
    'Maintain required worker documentation',
    'Provide required breaks and conditions',
    'Follow safety regulations',
    'Keep accurate time and wage records'
  ]
};

const taskTypes = {
  'Field Preparation': {
    description: 'Tasks related to preparing fields for planting',
    examples: 'Tilling, bed formation, mulching',
    typicalHours: '4-8 hours per acre'
  },
  'Planting': {
    description: 'Direct seeding or transplanting activities',
    examples: 'Seeding, transplanting, spacing',
    typicalHours: '6-12 hours per acre'
  },
  'Crop Maintenance': {
    description: 'Regular crop care activities',
    examples: 'Weeding, pruning, trellising',
    typicalHours: '2-4 hours per week per acre'
  },
  'Harvesting': {
    description: 'Crop collection and post-harvest handling',
    examples: 'Picking, washing, packing',
    typicalHours: '8-16 hours per harvest per acre'
  },
  'Equipment Operation': {
    description: 'Operating farm machinery and equipment',
    examples: 'Tractor work, irrigation setup',
    typicalHours: '2-6 hours per task'
  }
};

const LaborCostEstimator = () => {
  const [laborTasks, setLaborTasks] = useState([{
    taskType: '',
    description: '',
    workers: '',
    hoursPerWorker: '',
    hourlyRate: '',
    frequency: '',
    id: Date.now()
  }]);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);

  const addTask = () => {
    setLaborTasks([...laborTasks, {
      taskType: '',
      description: '',
      workers: '',
      hoursPerWorker: '',
      hourlyRate: '',
      frequency: '',
      id: Date.now()
    }]);
  };

  const removeTask = (id) => {
    if (laborTasks.length > 1) {
      setLaborTasks(laborTasks.filter(task => task.id !== id));
    }
  };

  const handleTaskChange = (id, field, value) => {
    setLaborTasks(laborTasks.map(task => 
      task.id === id ? { ...task, [field]: value } : task
    ));
  };

  const calculateCosts = () => {
    // Validate inputs
    for (const task of laborTasks) {
      if (!task.taskType || !task.workers || !task.hoursPerWorker || !task.hourlyRate || !task.frequency) {
        setError('Please fill in all required fields for each task');
        return;
      }
      if (parseFloat(task.workers) <= 0 || parseFloat(task.hoursPerWorker) <= 0 || 
          parseFloat(task.hourlyRate) <= 0 || parseFloat(task.frequency) <= 0) {
        setError('All numerical values must be greater than 0');
        return;
      }
    }

    // Calculate costs
    const taskResults = laborTasks.map(task => {
      const workers = parseFloat(task.workers);
      const hours = parseFloat(task.hoursPerWorker);
      const rate = parseFloat(task.hourlyRate);
      const frequency = parseFloat(task.frequency);

      const costPerSession = workers * hours * rate;
      const annualCost = costPerSession * frequency;

      return {
        ...task,
        costPerSession,
        annualCost
      };
    });

    const totalAnnualCost = taskResults.reduce((sum, task) => sum + task.annualCost, 0);
    const averageCostPerTask = totalAnnualCost / taskResults.length;
    const totalLaborHours = taskResults.reduce((sum, task) => 
      sum + (parseFloat(task.workers) * parseFloat(task.hoursPerWorker) * parseFloat(task.frequency)), 0
    );

    setResults({
      taskResults,
      totalAnnualCost,
      averageCostPerTask,
      totalLaborHours
    });
    setError('');
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Labor Cost Estimator
        </Typography>

        {/* Educational Content */}
        <Box mt={3} mb={3}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Understanding Farm Labor Costs</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>{educationalContent.introduction}</Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Types of Farm Labor</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {educationalContent.laborTypes.map((type, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <PeopleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={type.title}
                      secondary={
                        <>
                          <Typography variant="body2">{type.description}</Typography>
                          <Typography variant="body2">Key Considerations: {type.considerations}</Typography>
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
              <Typography variant="h6">Cost Factors to Consider</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {educationalContent.costFactors.map((factor, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <MoneyIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={factor} />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Labor Efficiency Tips</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {educationalContent.efficiencyTips.map((tip, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <InsightsIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={tip} />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Compliance Requirements</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {educationalContent.compliancePoints.map((point, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <ScheduleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={point} />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        </Box>

        {/* Calculator Content */}
        <Typography variant="body2" color="textSecondary" paragraph>
          Calculate and track labor costs for different farming tasks and operations.
        </Typography>

        {laborTasks.map((task, index) => (
          <Box key={task.id} sx={{ mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Task {index + 1}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Task Type"
                  value={task.taskType}
                  onChange={(e) => handleTaskChange(task.id, 'taskType', e.target.value)}
                  SelectProps={{
                    native: true
                  }}
                >
                  <option value="">Select a task type</option>
                  {Object.keys(taskTypes).map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Task Description"
                  value={task.description}
                  onChange={(e) => handleTaskChange(task.id, 'description', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Number of Workers"
                  type="number"
                  value={task.workers}
                  onChange={(e) => handleTaskChange(task.id, 'workers', e.target.value)}
                  inputProps={{ min: 1, step: 1 }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Hours per Worker"
                  type="number"
                  value={task.hoursPerWorker}
                  onChange={(e) => handleTaskChange(task.id, 'hoursPerWorker', e.target.value)}
                  inputProps={{ min: 0.5, step: 0.5 }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Hourly Rate ($)"
                  type="number"
                  value={task.hourlyRate}
                  onChange={(e) => handleTaskChange(task.id, 'hourlyRate', e.target.value)}
                  inputProps={{ min: 0, step: 0.5 }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Annual Frequency"
                  type="number"
                  value={task.frequency}
                  onChange={(e) => handleTaskChange(task.id, 'frequency', e.target.value)}
                  inputProps={{ min: 1, step: 1 }}
                  helperText="Times per year"
                />
              </Grid>
              <Grid item xs={12}>
                <IconButton 
                  onClick={() => removeTask(task.id)}
                  disabled={laborTasks.length === 1}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>

            {task.taskType && taskTypes[task.taskType] && (
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell><strong>Description:</strong></TableCell>
                      <TableCell>{taskTypes[task.taskType].description}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Examples:</strong></TableCell>
                      <TableCell>{taskTypes[task.taskType].examples}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Typical Hours:</strong></TableCell>
                      <TableCell>{taskTypes[task.taskType].typicalHours}</TableCell>
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
            onClick={addTask}
            variant="outlined"
            color="primary"
          >
            Add Task
          </Button>
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={calculateCosts}
          startIcon={<WorkIcon />}
          sx={{ mb: 2 }}
        >
          Calculate Costs
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
              Cost Analysis Results
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Task Type</TableCell>
                        <TableCell>Workers</TableCell>
                        <TableCell>Hours/Worker</TableCell>
                        <TableCell>Rate/Hour</TableCell>
                        <TableCell>Frequency</TableCell>
                        <TableCell>Cost/Session</TableCell>
                        <TableCell>Annual Cost</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {results.taskResults.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell>{task.taskType}</TableCell>
                          <TableCell>{task.workers}</TableCell>
                          <TableCell>{task.hoursPerWorker}</TableCell>
                          <TableCell>${task.hourlyRate}</TableCell>
                          <TableCell>{task.frequency}/year</TableCell>
                          <TableCell>${task.costPerSession.toFixed(2)}</TableCell>
                          <TableCell>${task.annualCost.toFixed(2)}</TableCell>
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
                        <TableCell><strong>Total Annual Labor Cost:</strong></TableCell>
                        <TableCell>${results.totalAnnualCost.toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Average Cost per Task:</strong></TableCell>
                        <TableCell>${results.averageCostPerTask.toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Total Annual Labor Hours:</strong></TableCell>
                        <TableCell>{results.totalLaborHours.toFixed(1)} hours</TableCell>
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

export default LaborCostEstimator;
