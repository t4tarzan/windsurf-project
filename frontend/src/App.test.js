import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('renders app header', () => {
  render(<App />);
  const headerElement = screen.getByRole('link', { name: /Plant Health Meter/i });
  expect(headerElement).toBeInTheDocument();
});

test('renders navigation links', () => {
  render(<App />);
  const homeLink = screen.getByRole('link', { name: /^Home$/i });
  const analyzerLink = screen.getByRole('link', { name: /^Plant Analyzer$/i });
  const toolsLink = screen.getByRole('link', { name: /^Farming Tools$/i });
  
  expect(homeLink).toBeInTheDocument();
  expect(analyzerLink).toBeInTheDocument();
  expect(toolsLink).toBeInTheDocument();
});
