# Clinical Decision Support System - Frontend

A modern React TypeScript frontend for the Clinical Decision Support System (CDSS) that provides AI-powered disease prediction, ICD-10 code mapping, and clinical recommendations.

## 🎯 Features

- **Health Monitoring**: Real-time backend health checks and system status
- **Disease Prediction**: Comprehensive form for patient data input with ML predictions
- **Clinical Results**: Professional display of ICD-10 codes, recommended tests, and medications
- **Medical-Grade UI**: Clean, professional interface designed for healthcare professionals
- **Error Handling**: Robust error handling with user-friendly feedback
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🛠️ Technology Stack

- **React 18** with TypeScript
- **Material-UI (MUI)** for component library
- **Vite** for fast development and building
- **Axios** for API communication
- **React Router** for navigation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (current: 16.20.2 - may have compatibility warnings)
- Backend server running on http://127.0.0.1:8000

### Installation & Running

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://127.0.0.1:8000
```

## 📋 Application Workflow

### 1. Health Check
- Tests backend connectivity
- Verifies database status
- Checks ML model availability
- Must pass before proceeding

### 2. Disease Prediction
- Patient demographics (age, sex)
- Vital signs (temperature, heart rate, blood pressure)
- Symptoms and medical history
- Current medications and allergies
- Clinical notes

### 3. Results Display
- Disease predictions with confidence scores
- ICD-10 codes and descriptions
- Recommended diagnostic tests
- Medication suggestions
- Clinical rationale and risk factors

## 🔗 API Integration

The frontend integrates with the FastAPI backend through these endpoints:

- `GET /health` - Basic health check
- `GET /api/v1/health/` - Detailed system health
- `GET /api/v1/health/database` - Database connectivity
- `POST /api/v1/predict/` - Disease prediction submission

## 🎨 UI Components

- **HealthCheck**: System monitoring and backend verification
- **PredictionForm**: Comprehensive patient data input form
- **PredictionResults**: Professional medical results display
- **App**: Main application with stepper navigation

## ⚠️ Important Notes

- **Educational Use Only**: This system provides preliminary predictions for educational and clinical decision support purposes
- **Medical Disclaimer**: Always consult with healthcare professionals for final clinical decisions
- **Backend Dependency**: Requires the FastAPI backend server to be running

## 🔧 Development

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## 📁 Project Structure

```
src/
├── components/
│   ├── HealthCheck.tsx        # Backend health monitoring
│   ├── PredictionForm.tsx     # Patient data input form
│   └── PredictionResults.tsx  # Medical results display
├── services/
│   └── api.ts                 # API client and endpoints
├── types/
│   └── api.ts                 # TypeScript interfaces
├── App.tsx                    # Main application
├── main.tsx                   # Application entry point
└── theme.ts                   # Material-UI theme configuration
```

## 🚀 Ready for Testing!

1. Ensure the FastAPI backend is running on http://127.0.0.1:8000
2. Start the frontend with `npm run dev`
3. Navigate to http://localhost:3000
4. Follow the application workflow: Health Check → Prediction → Results