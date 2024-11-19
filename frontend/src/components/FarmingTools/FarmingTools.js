import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Collapse,
  Typography,
  Paper,
  Container,
  Divider
} from '@mui/material';
import {
  Agriculture as AgricultureIcon,
  WaterDrop as WaterIcon,
  WbSunny as WeatherIcon,
  CalendarMonth as PlanningIcon,
  AttachMoney as FinanceIcon,
  BugReport as PestIcon,
  Terrain as SoilIcon,
  Pets as LivestockIcon,
  ExpandLess,
  ExpandMore,
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
// ... other calculator imports will go here

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

const drawerWidth = 280;

const FarmingTools = () => {
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
    if (!selectedTool) return null;
    const Component = selectedTool.tool.component;
    return Component ? <Component /> : (
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
            mt: '64px',
            height: 'calc(100% - 64px)',
            backgroundColor: 'background.default',
            borderRight: '1px solid',
            borderColor: 'divider'
          },
        }}
      >
        <Box sx={{ overflow: 'auto' }}>
          <Typography variant="h6" sx={{ p: 2, textAlign: 'center' }}>
            Farming Tools
          </Typography>
          <Divider />
          <List>
            {Object.entries(farmingTools).map(([category, { icon, title, tools }]) => (
              <React.Fragment key={category}>
                <ListItemButton onClick={() => handleCategoryClick(category)}>
                  <ListItemIcon sx={{ color: 'primary.main' }}>
                    {icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={title} 
                    sx={{ 
                      '& .MuiTypography-root': { 
                        fontWeight: 'bold',
                        color: 'primary.main' 
                      } 
                    }} 
                  />
                  {openCategory === category ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openCategory === category} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {tools.map((tool, index) => (
                      <ListItemButton
                        key={index}
                        sx={{ pl: 4 }}
                        onClick={() => handleToolClick(category, index)}
                        selected={selectedTool?.category === category && selectedTool?.tool.name === tool.name}
                      >
                        <ListItemIcon sx={{ color: 'text.secondary' }}>
                          <CalculateIcon />
                        </ListItemIcon>
                        <ListItemText 
                          primary={tool.name}
                          sx={{ 
                            '& .MuiTypography-root': { 
                              fontSize: '0.95rem',
                              color: 'text.primary' 
                            } 
                          }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: `calc(100% - ${drawerWidth}px)` }}>
        {renderSelectedTool()}
      </Box>
    </Box>
  );
};

export default FarmingTools;
