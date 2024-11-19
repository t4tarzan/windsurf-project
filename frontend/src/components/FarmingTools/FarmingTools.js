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
// ... other calculator imports will go here

const farmingTools = {
  planting: {
    icon: <AgricultureIcon />,
    title: 'Planting & Spacing',
    tools: {
      seedSpacing: { name: 'Seed Spacing Calculator', component: SeedSpacingCalculator },
      plantDensity: { name: 'Plant Density Calculator', component: PlantDensityCalculator },
      rowSpacing: { name: 'Row Spacing Optimizer', component: RowSpacingOptimizer },
      greenhouse: { name: 'Greenhouse Space Calculator', component: null },
      raisedBed: { name: 'Raised Bed Planner', component: null }
    }
  },
  resources: {
    icon: <WaterIcon />,
    title: 'Resource Management',
    tools: {
      waterReq: { name: 'Water Requirement Calculator', component: WaterRequirementCalculator },
      irrigation: { name: 'Irrigation Scheduler', component: null },
      fertilizer: { name: 'Fertilizer Calculator', component: null },
      soilAmend: { name: 'Soil Amendment Calculator', component: SoilAmendmentCalculator },
      compost: { name: 'Compost Ratio Calculator', component: null },
      mulch: { name: 'Mulch Coverage Calculator', component: null }
    }
  },
  weather: {
    icon: <WeatherIcon />,
    title: 'Weather & Climate',
    tools: {
      gdd: { name: 'Growing Degree Days', component: GrowingDegreeDays },
      frost: { name: 'Frost Date Calculator', component: FrostDateCalculator },
      rainwater: { name: 'Rain Water Harvesting', component: null },
      evaporation: { name: 'Evapotranspiration', component: null },
      sunExposure: { name: 'Sun Exposure', component: null },
      windbreak: { name: 'Wind Break Effectiveness', component: null }
    }
  },
  planning: {
    icon: <PlanningIcon />,
    title: 'Crop Planning',
    tools: {
      rotation: { name: 'Crop Rotation Planner', component: CropRotationPlanner },
      companion: { name: 'Companion Planting Guide', component: null },
      harvest: { name: 'Harvest Date Estimator', component: null },
      succession: { name: 'Succession Planting', component: null },
      germination: { name: 'Germination Rate', component: null },
      yield: { name: 'Yield Estimator', component: null }
    }
  },
  financial: {
    icon: <FinanceIcon />,
    title: 'Financial Tools',
    tools: {
      profitability: { name: 'Profit Calculator', component: ProfitCalculator },
      inputCost: { name: 'Input Cost Calculator', component: null },
      roi: { name: 'ROI Calculator', component: null },
      labor: { name: 'Labor Cost Estimator', component: null },
      market: { name: 'Market Price Analyzer', component: null }
    }
  },
  pest: {
    icon: <PestIcon />,
    title: 'Pest & Disease',
    tools: {
      ipm: { name: 'IPM Decision Tool', component: IPMCalculator },
      disease: { name: 'Disease Risk Calculator', component: DiseaseRiskCalculator },
      identification: { name: 'Pest Identification', component: null },
      treatment: { name: 'Treatment Guide', component: null },
      monitoring: { name: 'Pest Monitoring Log', component: null }
    }
  },
  soil: {
    icon: <SoilIcon />,
    title: 'Soil Management',
    tools: {
      amendment: { name: 'Soil Amendment Calculator', component: SoilAmendmentCalculator },
      nutrient: { name: 'Nutrient Calculator', component: NutrientCalculator },
      ph: { name: 'pH Management', component: null },
      compaction: { name: 'Compaction Test', component: null },
      organic: { name: 'Organic Matter', component: null }
    }
  },
  livestock: {
    icon: <LivestockIcon />,
    title: 'Livestock Integration',
    tools: {
      stocking: { name: 'Stocking Rate Calculator', component: StockingRateCalculator },
      feed: { name: 'Feed Calculator', component: FeedCalculator },
      grazing: { name: 'Grazing Rotation Planner', component: GrazingRotationPlanner },
      breeding: { name: 'Breeding Calendar', component: null },
      health: { name: 'Health Records', component: null }
    }
  }
};

const drawerWidth = 280;

const FarmingTools = () => {
  const [openCategory, setOpenCategory] = useState('');
  const [selectedTool, setSelectedTool] = useState(null);

  const handleCategoryClick = (category) => {
    setOpenCategory(openCategory === category ? '' : category);
  };

  const handleToolClick = (category, toolKey) => {
    setSelectedTool({ category, tool: farmingTools[category].tools[toolKey] });
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
                    {Object.entries(tools).map(([toolKey, tool]) => (
                      <ListItemButton
                        key={toolKey}
                        sx={{ pl: 4 }}
                        onClick={() => handleToolClick(category, toolKey)}
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
        {selectedTool && selectedTool.tool.component && (
          <selectedTool.tool.component />
        )}
      </Box>
    </Box>
  );
};

export default FarmingTools;
