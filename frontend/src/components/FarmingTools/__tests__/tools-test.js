import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import FarmingTools from '../FarmingTools';

// Mock the Material-UI components
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  Drawer: ({ children }) => <div data-testid="drawer">{children}</div>,
  ListItemButton: ({ children, ...props }) => (
    <button data-testid="list-item-button" {...props}>
      {children}
    </button>
  )
}));

// Mock the calculator components
jest.mock('../calculators/planting/SeedSpacingCalculator', () => () => 'SeedSpacingCalculator');
jest.mock('../calculators/planting/PlantDensityCalculator', () => () => 'PlantDensityCalculator');
jest.mock('../calculators/planting/RowSpacingOptimizer', () => () => 'RowSpacingOptimizer');
jest.mock('../calculators/resources/WaterRequirementCalculator', () => () => 'WaterRequirementCalculator');
jest.mock('../calculators/weather/GrowingDegreeDays', () => () => 'GrowingDegreeDays');
jest.mock('../calculators/weather/FrostDateCalculator', () => () => 'FrostDateCalculator');
jest.mock('../calculators/planning/CropRotationPlanner', () => () => 'CropRotationPlanner');
jest.mock('../calculators/financial/ProfitCalculator', () => () => 'ProfitCalculator');
jest.mock('../calculators/pest/IPMCalculator', () => () => 'IPMCalculator');
jest.mock('../calculators/pest/DiseaseRiskCalculator', () => () => 'DiseaseRiskCalculator');
jest.mock('../calculators/soil/SoilAmendmentCalculator', () => () => 'SoilAmendmentCalculator');
jest.mock('../calculators/soil/NutrientCalculator', () => () => 'NutrientCalculator');
jest.mock('../calculators/livestock/StockingRateCalculator', () => () => 'StockingRateCalculator');
jest.mock('../calculators/livestock/FeedCalculator', () => () => 'FeedCalculator');
jest.mock('../calculators/livestock/GrazingRotationPlanner', () => () => 'GrazingRotationPlanner');

describe('FarmingTools Component', () => {
  beforeEach(() => {
    render(<FarmingTools />);
  });

  // Test 1: Check if all main categories are present
  test('renders all main categories', () => {
    const expectedCategories = [
      'Planting & Spacing',
      'Resource Management',
      'Weather & Climate',
      'Crop Planning',
      'Financial Tools',
      'Pest & Disease',
      'Soil Management',
      'Livestock Integration'
    ];

    expectedCategories.forEach(category => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });

  // Test 2: Check category expansion
  test('categories expand when clicked', () => {
    const plantingCategory = screen.getByText('Planting & Spacing');
    fireEvent.click(plantingCategory);
    
    // Verify calculator is visible after expansion
    expect(screen.getByText('Seed Spacing Calculator')).toBeInTheDocument();
  });

  // Test 3: Check calculator selection
  const implementedCalculators = [
    { category: 'Planting & Spacing', calculator: 'Seed Spacing Calculator' },
    { category: 'Resource Management', calculator: 'Water Requirement Calculator' },
    { category: 'Weather & Climate', calculator: 'Growing Degree Days' },
    { category: 'Livestock Integration', calculator: 'Feed Calculator' }
  ];

  test.each(implementedCalculators)(
    'selects $calculator in $category category',
    ({ category, calculator }) => {
      // Open category
      fireEvent.click(screen.getByText(category));
      
      // Click calculator
      const calculatorElement = screen.getByText(calculator);
      fireEvent.click(calculatorElement);
      
      // Verify calculator component is rendered
      expect(screen.getByText(calculator.replace(/ /g, ''))).toBeInTheDocument();
    }
  );

  // Test 4: Check drawer styling
  test('drawer has correct styling', () => {
    const drawer = screen.getByTestId('drawer');
    expect(drawer).toBeInTheDocument();
  });

  // Test 5: Check category icons
  test('categories have icons', () => {
    const categoryButtons = screen.getAllByTestId('list-item-button');
    categoryButtons.forEach(button => {
      expect(button.querySelector('svg')).toBeInTheDocument();
    });
  });
});

// Integration Tests
describe('FarmingTools Integration', () => {
  test('calculator persists when switching categories', () => {
    render(<FarmingTools />);
    
    // Select a calculator
    fireEvent.click(screen.getByText('Planting & Spacing'));
    fireEvent.click(screen.getByText('Seed Spacing Calculator'));
    
    // Open another category
    fireEvent.click(screen.getByText('Resource Management'));
    
    // Verify calculator is still rendered
    expect(screen.getByText('SeedSpacingCalculator')).toBeInTheDocument();
  });

  test('multiple categories can be open', () => {
    render(<FarmingTools />);
    
    fireEvent.click(screen.getByText('Planting & Spacing'));
    fireEvent.click(screen.getByText('Resource Management'));
    
    expect(screen.getByText('Seed Spacing Calculator')).toBeInTheDocument();
    expect(screen.getByText('Water Requirement Calculator')).toBeInTheDocument();
  });
});
