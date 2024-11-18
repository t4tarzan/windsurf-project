# Plant Health Meter

A comprehensive web platform for plant health diagnostics, farming tools, and community engagement. This application helps farmers and gardening enthusiasts monitor plant health, access farming calculators, and track their progress through an interactive, gamified experience.

## Features

1. **Plant Health Analysis**
   - Upload or capture plant images
   - AI-powered health diagnostics
   - Detailed care recommendations
   - Visual health metrics

2. **Farming Tools**
   - Irrigation calculator
   - Harvest planner
   - Fertilizer recommendations
   - Profit estimator

3. **Progress Tracking**
   - Gamified achievements
   - Personal statistics
   - Leaderboard
   - Activity history

4. **Community & Blog**
   - Searchable articles
   - Social interactions
   - Tag-based content
   - Knowledge sharing

## Tech Stack

- **Frontend**
  - React
  - Material-UI
  - React Router
  - Recharts
  - Axios

- **Backend**
  - FastAPI
  - TensorFlow
  - Python Image Processing
  - MongoDB

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd plant-health-meter
   ```

2. Run the setup script:
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

3. Start the backend server:
   ```bash
   source venv/bin/activate
   cd backend
   uvicorn main:app --reload
   ```

4. Start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
plant-health-meter/
├── backend/
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PlantAnalyzer.js
│   │   │   ├── FarmingTools.js
│   │   │   ├── GamificationDashboard.js
│   │   │   ├── Blog.js
│   │   │   └── ...
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## API Endpoints

- `POST /analyze-plant`: Upload and analyze plant images
- `GET /farming-tools`: List available farming calculators
- `POST /update-progress`: Update user progress and achievements
- `GET /leaderboard`: Retrieve community leaderboard

## API Keys and Services Checklist

### Required APIs

#### 1. Pl@ntNet API (Plant Identification)
- [ ] Sign up at https://my.plantnet.org/
- [ ] Free tier includes:
  - 500 requests/day
  - Non-commercial use
  - 8,000+ species coverage
- [ ] Pricing: 
  - Free tier (recommended for development and non-commercial use)
  - Custom pricing for commercial use
- [ ] Add key to `.env`: `REACT_APP_PLANTNET_API_KEY`
- [ ] Security checklist:
  - [ ] Key stored only in `.env`
  - [ ] `.env` added to `.gitignore`
  - [ ] Rate limiting implemented
  - [ ] Error handling in place

#### 2. Trefle.io API (Plant Database)
- [ ] Sign up at https://trefle.io/users/sign_up
- [ ] Free tier: 120 requests/minute
- [ ] Pricing: 
  - Free tier (sufficient for most uses)
  - No paid tiers currently
- [ ] Add key to `.env`: `REACT_APP_TREFLE_API_KEY`
- [ ] Security checklist:
  - [ ] Key stored only in `.env`
  - [ ] `.env` added to `.gitignore`
  - [ ] Rate limiting implemented
  - [ ] Error handling in place

#### 3. TensorFlow.js (Local ML)
- [ ] No API key required
- [ ] Using pre-trained MobileNet model
- [ ] Runs locally in browser
- [ ] Free to use
- [ ] Security checklist:
  - [ ] Model loaded securely via HTTPS
  - [ ] Local processing only
  - [ ] No data sent to external servers

### Cost-Effective Setup Recommendations

1. Development Phase:
   - Use Pl@ntNet API free tier (500 requests/day)
   - Use Trefle.io free tier (120 requests/minute)
   - Use local TensorFlow.js processing
   - Implement mock data fallback

2. Production Phase:
   - Start with Pl@ntNet API free tier
   - Monitor usage and upgrade only when needed
   - Continue with Trefle.io free tier
   - Implement caching for repeated queries

### Security Best Practices

1. API Key Storage:
   ```bash
   # .env
   REACT_APP_PLANTNET_API_KEY=your_key
   REACT_APP_TREFLE_API_KEY=your_key
   ```

2. Environment Protection:
   ```bash
   # .gitignore
   .env
   .env.local
   .env.development.local
   .env.test.local
   .env.production.local
   ```

3. Rate Limiting Implementation:
   - Use request queuing
   - Implement exponential backoff
   - Cache frequent queries

4. Error Handling:
   - Graceful fallback to mock data
   - User-friendly error messages
   - Logging for debugging

5. Data Protection:
   - Process images locally when possible
   - Minimize data sent to external APIs
   - Clear sensitive data after processing

### Development Workflow

1. Start with mock data:
   - Use provided mock responses
   - Test all features locally
   - No API keys needed

2. Integration testing:
   - Use free tier API keys
   - Test with real data
   - Monitor rate limits

3. Production deployment:
   - Use separate production API keys
   - Implement all security measures
   - Monitor usage and costs

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Plant Health Analyzer - Development Journey

### Project Overview
A React-based web application that allows users to analyze plant health using their camera or uploaded images. The app uses machine learning to assess plant health and provide recommendations.

### Key Features
- Real-time camera capture using react-webcam
- Image upload functionality
- Plant health analysis using ML service
- Responsive Material-UI interface
- Error handling and loading states

### Technical Stack
- Frontend: React, Material-UI
- Testing: Jest, React Testing Library
- Camera: react-webcam
- State Management: React Hooks
- Image Processing: HTML5 Canvas
- ML Integration: Custom ML service

### Development Journey

#### Phase 1: Initial Setup and Basic UI
1. Created basic React component structure
2. Implemented Material-UI components
3. Set up basic file upload functionality
4. Added initial error handling

#### Phase 2: Camera Integration
1. Integrated react-webcam for camera capture
2. Implemented webcam controls (capture, switch camera)
3. Added image preview functionality
4. Handled camera permissions and errors

#### Phase 3: ML Service Integration
1. Created ML service interface
2. Implemented image analysis logic
3. Added loading states and error handling
4. Created response visualization

#### Phase 4: Testing Implementation
Key challenges and solutions:

1. Webcam Mocking Challenge
   - Initial Issue: Difficulty mocking react-webcam component
   - Solution: Created custom mock using React.forwardRef and useImperativeHandle
   - Code Example:
   ```javascript
   const mockGetScreenshot = jest.fn();
   jest.mock('react-webcam', () => ({
     default: React.forwardRef((props, ref) => {
       React.useImperativeHandle(ref, () => ({
         getScreenshot: mockGetScreenshot
       }));
       return <div data-testid="mock-webcam" />;
     })
   }));
   ```

2. Async Testing Challenges
   - Issue: Race conditions in async operations
   - Solution: Proper use of act() and waitFor()
   - Implementation: Structured tests to handle async state updates

3. File Upload Testing
   - Challenge: Mocking File API and FileReader
   - Solution: Custom File mock and FileReader simulation
   - Added comprehensive upload scenarios

4. Image Processing Testing
   - Issue: Canvas operations in JSDOM
   - Solution: Mocked Canvas API and implemented test-specific image processing

### Key Learnings and Best Practices

#### Testing Best Practices
1. Mock Implementation
   - Use React.forwardRef for component mocks
   - Implement useImperativeHandle for ref methods
   - Clear mocks between tests

2. Async Testing
   - Always wrap state updates in act()
   - Use waitFor for async assertions
   - Handle multiple async operations properly

3. Component Structure
   - Separate concerns (UI, logic, services)
   - Use custom hooks for complex logic
   - Implement proper error boundaries

#### Error Handling Patterns
1. Camera Errors
   - Permission denied
   - Device not found
   - Stream errors

2. Upload Errors
   - File size/type validation
   - Read errors
   - Processing errors

3. Analysis Errors
   - Service unavailable
   - Invalid response
   - Timeout handling

### Future Improvements
1. Performance Optimization
   - Image compression
   - Lazy loading components
   - Service worker implementation

2. Feature Enhancements
   - Multiple plant analysis
   - History tracking
   - Detailed health reports
   - Offline support

3. Testing Improvements
   - E2E tests with Cypress
   - Visual regression tests
   - Performance testing
   - More edge cases

### Common Issues and Solutions

#### Testing Issues
1. Ref Handling
   ```javascript
   // Problem: Direct ref access
   const ref = { current: mockMethods };
   
   // Solution: Use useImperativeHandle
   React.useImperativeHandle(ref, () => ({
     methodName: mockMethod
   }));
   ```

2. Async State Updates
   ```javascript
   // Problem: State update outside act()
   await userEvent.click(button);
   
   // Solution: Wrap in act()
   await act(async () => {
     await userEvent.click(button);
   });
   ```

3. Component Initialization
   ```javascript
   // Problem: Missing cleanup
   beforeEach(() => {
     render(<Component />);
   });
   
   // Solution: Add cleanup
   beforeEach(() => {
     jest.clearAllMocks();
     render(<Component />);
   });
   ```

### Lessons Learned
1. Always implement proper ref forwarding in component mocks
2. Handle all async operations carefully in tests
3. Clear mocks between tests to prevent state leakage
4. Use proper error boundaries and error handling
5. Implement comprehensive loading states
6. Structure components for easy testing
7. Use proper type checking and validation

This documentation will be valuable for future reference and improvements to the application.
