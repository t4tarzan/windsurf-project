import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Collapse,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  IconButton,
  Paper,
  Container
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  Share as ShareIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Agriculture as AgricultureIcon,
  WaterDrop as WaterIcon,
  WbSunny as WeatherIcon,
  CalendarMonth as PlanningIcon,
  AttachMoney as FinanceIcon,
  BugReport as PestIcon,
  Terrain as SoilIcon,
  Pets as LivestockIcon,
  Calculate as CalculateIcon
} from '@mui/icons-material';

// Import calculator components
import SeedSpacingCalculator from './calculators/planting/SeedSpacingCalculator';
import WaterRequirementCalculator from './calculators/resources/WaterRequirementCalculator';
import PlantDensityCalculator from './calculators/planting/PlantDensityCalculator';
import RowSpacingOptimizer from './calculators/planting/RowSpacingOptimizer';
import GrowingDegreeDays from './calculators/weather/GrowingDegreeDays';
import FrostDateCalculator from './calculators/weather/FrostDateCalculator';
import CropRotationPlanner from './calculators/planning/CropRotationPlanner';
import ProfitCalculator from './calculators/financial/ProfitCalculator';
import IPMCalculator from './calculators/pest/IPMCalculator';
import DiseaseRiskCalculator from './calculators/pest/DiseaseRiskCalculator';
import SoilAmendmentCalculator from './calculators/soil/SoilAmendmentCalculator';
import NutrientCalculator from './calculators/soil/NutrientCalculator';
import StockingRateCalculator from './calculators/livestock/StockingRateCalculator';
import FeedCalculator from './calculators/livestock/FeedCalculator';
import GrazingRotationPlanner from './calculators/livestock/GrazingRotationPlanner';
import GreenhouseCalculator from './calculators/planting/GreenhouseCalculator';
import RaisedBedPlanner from './calculators/planting/RaisedBedPlanner';
import IrrigationScheduler from './calculators/resources/IrrigationScheduler';
import FertilizerCalculator from './calculators/resources/FertilizerCalculator';
import CompostCalculator from './calculators/resources/CompostCalculator';
import MulchCalculator from './calculators/resources/MulchCalculator';
import RainWaterHarvesting from './calculators/weather/RainWaterHarvesting';
import Evapotranspiration from './calculators/weather/Evapotranspiration';
import SunExposure from './calculators/weather/SunExposure';
import WindBreakEffectiveness from './calculators/weather/WindBreakEffectiveness';
import HarvestDateEstimator from './calculators/planning/HarvestDateEstimator';
import SuccessionPlanting from './calculators/planning/SuccessionPlanting';
import GerminationRate from './calculators/planning/GerminationRate';
import YieldEstimator from './calculators/planning/YieldEstimator';
import InputCostCalculator from './calculators/financial/InputCostCalculator';
import ROICalculator from './calculators/financial/ROICalculator';
import LaborCostEstimator from './calculators/financial/LaborCostEstimator';
import MarketPriceAnalyzer from './calculators/financial/MarketPriceAnalyzer';
import CompanionPlantingGuide from './calculators/planning/CompanionPlantingGuide';
import PestIdentification from './calculators/pest/PestIdentification';
import TreatmentGuide from './calculators/pest/TreatmentGuide';
import PestMonitoringLog from './calculators/pest/PestMonitoringLog';
import PHManagement from './calculators/soil/pHManagement';
import CompactionTest from './calculators/soil/CompactionTest';
import OrganicMatter from './calculators/soil/OrganicMatter';
import BreedingCalendar from './calculators/livestock/BreedingCalendar';
import HealthRecords from './calculators/livestock/HealthRecords';

const farmingTools = {
  planting: {
    icon: <AgricultureIcon />,
    title: 'Planting & Spacing',
    tools: [
      { name: 'Greenhouse Space Calculator', component: GreenhouseCalculator },
      { name: 'Raised Bed Planner', component: RaisedBedPlanner },
      { name: 'Seed Spacing Calculator', component: SeedSpacingCalculator },
      { name: 'Plant Density Calculator', component: PlantDensityCalculator },
      { name: 'Row Spacing Optimizer', component: RowSpacingOptimizer }
    ]
  },
  resources: {
    icon: <WaterIcon />,
    title: 'Resource Management',
    tools: [
      { name: 'Water Requirement Calculator', component: WaterRequirementCalculator },
      { name: 'Irrigation Scheduler', component: IrrigationScheduler },
      { name: 'Fertilizer Calculator', component: FertilizerCalculator },
      { name: 'Soil Amendment Calculator', component: SoilAmendmentCalculator },
      { name: 'Compost Ratio Calculator', component: CompostCalculator },
      { name: 'Mulch Coverage Calculator', component: MulchCalculator }
    ]
  },
  weather: {
    icon: <WeatherIcon />,
    title: 'Weather & Climate',
    tools: [
      { name: 'Growing Degree Days', component: GrowingDegreeDays },
      { name: 'Frost Date Calculator', component: FrostDateCalculator },
      { name: 'Rain Water Harvesting', component: RainWaterHarvesting },
      { name: 'Evapotranspiration', component: Evapotranspiration },
      { name: 'Sun Exposure', component: SunExposure },
      { name: 'Wind Break Effectiveness', component: WindBreakEffectiveness }
    ]
  },
  planning: {
    icon: <PlanningIcon />,
    title: 'Crop Planning',
    tools: [
      { name: 'Crop Rotation Planner', component: CropRotationPlanner },
      { name: 'Companion Planting Guide', component: CompanionPlantingGuide },
      { name: 'Harvest Date Estimator', component: HarvestDateEstimator },
      { name: 'Succession Planting', component: SuccessionPlanting },
      { name: 'Germination Rate', component: GerminationRate },
      { name: 'Yield Estimator', component: YieldEstimator }
    ]
  },
  financial: {
    icon: <FinanceIcon />,
    title: 'Financial Tools',
    tools: [
      { name: 'Profit Calculator', component: ProfitCalculator },
      { name: 'Input Cost Calculator', component: InputCostCalculator },
      { name: 'ROI Calculator', component: ROICalculator },
      { name: 'Labor Cost Estimator', component: LaborCostEstimator },
      { name: 'Market Price Analyzer', component: MarketPriceAnalyzer }
    ]
  },
  pest: {
    icon: <PestIcon />,
    title: 'Pest & Disease',
    tools: [
      { name: 'IPM Decision Tool', component: IPMCalculator },
      { name: 'Disease Risk Calculator', component: DiseaseRiskCalculator },
      { name: 'Pest Identification', component: PestIdentification },
      { name: 'Treatment Guide', component: TreatmentGuide },
      { name: 'Pest Monitoring Log', component: PestMonitoringLog }
    ]
  },
  soil: {
    icon: <SoilIcon />,
    title: 'Soil Management',
    tools: [
      { name: 'Soil Amendment Calculator', component: SoilAmendmentCalculator },
      { name: 'Nutrient Calculator', component: NutrientCalculator },
      { name: 'pH Management', component: PHManagement },
      { name: 'Compaction Test', component: CompactionTest },
      { name: 'Organic Matter', component: OrganicMatter }
    ]
  },
  livestock: {
    icon: <LivestockIcon />,
    title: 'Livestock Integration',
    tools: [
      { name: 'Stocking Rate Calculator', component: StockingRateCalculator },
      { name: 'Feed Calculator', component: FeedCalculator },
      { name: 'Grazing Rotation Planner', component: GrazingRotationPlanner },
      { name: 'Breeding Calendar', component: BreedingCalendar },
      { name: 'Health Records', component: HealthRecords }
    ]
  }
};

const toolsOverview = {
  planting: {
    description: 'Optimize your planting strategies with our comprehensive suite of spacing and planning calculators. From greenhouse space optimization to raised bed planning, these tools help you maximize your growing area and improve crop yields.',
    features: [
      'Precise seed spacing calculations',
      'Optimal plant density recommendations',
      'Greenhouse space optimization',
      'Raised bed layout planning',
      'Row spacing optimization for different crops'
    ]
  },
  resources: {
    description: 'Manage your farm resources efficiently with our resource management calculators. Track water usage, plan irrigation, and optimize fertilizer applications to reduce waste and improve crop health.',
    features: [
      'Water requirement calculations',
      'Irrigation scheduling',
      'Fertilizer application planning',
      'Compost ratio optimization',
      'Mulch coverage calculations'
    ]
  },
  weather: {
    description: 'Make informed decisions based on weather patterns and climate data. Our weather tools help you plan for frost dates, manage water resources, and optimize crop placement based on sun exposure.',
    features: [
      'Growing degree days tracking',
      'Frost date predictions',
      'Rainfall harvesting calculations',
      'Sun exposure analysis',
      'Wind protection planning'
    ]
  },
  planning: {
    description: 'Plan your farming operations with precision using our comprehensive planning tools. From crop rotation to succession planting, these calculators help you optimize your farm\'s productivity throughout the season.',
    features: [
      'Crop rotation planning',
      'Companion planting guidance',
      'Harvest date estimation',
      'Succession planting schedules',
      'Yield predictions'
    ]
  },
  financial: {
    description: 'Track and optimize your farm\'s financial performance with our suite of financial calculators. Analyze costs, estimate returns, and make data-driven decisions to improve profitability.',
    features: [
      'Profit calculations',
      'ROI analysis',
      'Labor cost estimation',
      'Input cost tracking',
      'Market price analysis'
    ]
  },
  pest: {
    description: 'Protect your crops with our integrated pest management tools. Identify pests, track infestations, and implement effective control measures while maintaining ecological balance.',
    features: [
      'Pest identification database',
      'Treatment recommendations',
      'Monitoring logs',
      'Disease risk assessment',
      'IPM strategy planning'
    ]
  },
  soil: {
    description: 'Maintain optimal soil health with our soil management calculators. Monitor key soil parameters, plan amendments, and ensure your soil provides the best growing conditions for your crops.',
    features: [
      'pH management',
      'Compaction testing',
      'Organic matter tracking',
      'Nutrient analysis',
      'Amendment planning'
    ]
  },
  livestock: {
    description: 'Efficiently manage your livestock operations with our comprehensive tracking and planning tools. From breeding schedules to health records, these tools help you maintain healthy and productive animals.',
    features: [
      'Breeding calendar management',
      'Health record tracking',
      'Stocking rate calculations',
      'Feed requirement planning',
      'Grazing rotation optimization'
    ]
  }
};

const SocialShare = () => (
  <Box sx={{ mt: 2 }}>
    <Divider sx={{ my: 2 }} />
    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
      Share this tool:
    </Typography>
    <IconButton 
      color="primary" 
      onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank')}
    >
      <FacebookIcon />
    </IconButton>
    <IconButton 
      color="primary" 
      onClick={() => window.open(`https://twitter.com/intent/tweet?url=${window.location.href}`, '_blank')}
    >
      <TwitterIcon />
    </IconButton>
    <IconButton 
      color="primary" 
      onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`, '_blank')}
    >
      <LinkedInIcon />
    </IconButton>
  </Box>
);

const drawerWidth = 280;

function FarmingTools() {
  const [openCategory, setOpenCategory] = useState('');
  const [selectedTool, setSelectedTool] = useState(null);

  const handleCategoryClick = (category) => {
    setOpenCategory(openCategory === category ? '' : category);
  };

  const handleToolClick = (category, toolIndex) => {
    setSelectedTool({
      category,
      tool: farmingTools[category].tools[toolIndex]
    });
  };

  const renderSelectedTool = () => {
    if (!selectedTool) {
      return (
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Welcome to Farming Tools
          </Typography>
          <Typography variant="body1" paragraph>
            Our comprehensive suite of farming calculators and planning tools is designed to help you optimize your agricultural operations. 
            Select a category from the menu to explore our tools.
          </Typography>
          <Grid container spacing={3}>
            {Object.entries(toolsOverview).map(([category, info]) => (
              <Grid item xs={12} md={6} key={category}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {farmingTools[category].title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {info.description}
                    </Typography>
                    <Typography variant="subtitle2" gutterBottom>
                      Key Features:
                    </Typography>
                    <List dense>
                      {info.features.map((feature, index) => (
                        <ListItemButton key={index} dense>
                          <ListItemText primary={feature} />
                        </ListItemButton>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      );
    }

    const Component = selectedTool.tool.component;
    return Component ? (
      <Box sx={{ p: 3 }}>
        <Component />
        <SocialShare />
      </Box>
    ) : (
      <Typography variant="body1" color="text.secondary" sx={{ p: 3 }}>
        This calculator is currently under development.
      </Typography>
    );
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', pt: '64px' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            top: '64px',
            height: 'calc(100% - 64px)',
          },
        }}
      >
        <List>
          {Object.entries(farmingTools).map(([category, { icon, title, tools }]) => (
            <React.Fragment key={category}>
              <ListItemButton onClick={() => handleCategoryClick(category)}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={title} />
                {openCategory === category ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openCategory === category} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {tools.map((tool, index) => (
                    <ListItemButton
                      key={tool.name}
                      sx={{ pl: 4 }}
                      onClick={() => handleToolClick(category, index)}
                      selected={selectedTool?.tool.name === tool.name}
                    >
                      <ListItemIcon sx={{ color: 'text.secondary' }}>
                        <CalculateIcon />
                      </ListItemIcon>
                      <ListItemText primary={tool.name} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          overflow: 'auto',
          height: 'calc(100vh - 64px)',
        }}
      >
        {renderSelectedTool()}
      </Box>
    </Box>
  );
}

export default FarmingTools;
