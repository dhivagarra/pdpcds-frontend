import React, { useState } from 'react';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  Alert,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import HealthCheck from './components/HealthCheck';
import PredictionForm from './components/PredictionForm';
import PredictionResults from './components/PredictionResults';
import ClinicalFeedback from './components/ClinicalFeedback';
import { PredictionResponse } from './types/api';

type AppStep = 'health' | 'prediction' | 'results' | 'feedback';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>('health');
  const [predictionResult, setPredictionResult] = useState<PredictionResponse | null>(null);
  const [predictionId, setPredictionId] = useState<number | null>(null);

  const steps = [
    { key: 'health', label: 'Health Check' },
    { key: 'prediction', label: 'Disease Prediction' },
    { key: 'results', label: 'Results' },
    { key: 'feedback', label: 'Clinical Feedback' },
  ];

  const getActiveStep = () => {
    return steps.findIndex(step => step.key === currentStep);
  };

  const handleHealthOk = () => {
    console.log('✅ Health check passed, proceeding to prediction form');
    setCurrentStep('prediction');
  };

  const handlePredictionResult = (result: PredictionResponse) => {
    console.log('✅ Prediction completed, showing results');
    setPredictionResult(result);
    // Generate a mock prediction ID for feedback (in real app, this would come from backend)
    setPredictionId(Math.floor(Math.random() * 10000));
    setCurrentStep('results');
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'prediction':
        setCurrentStep('health');
        break;
      case 'results':
        setCurrentStep('prediction');
        break;
      case 'feedback':
        setCurrentStep('results');
        break;
      default:
        setCurrentStep('health');
    }
  };

  const handleHome = () => {
    setCurrentStep('health');
    setPredictionResult(null);
    setPredictionId(null);
  };

  const handleProceedToFeedback = () => {
    setCurrentStep('feedback');
  };

  const handleFeedbackSubmitted = (feedback: any) => {
    console.log('✅ Feedback submitted:', feedback);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'health':
        return <HealthCheck onHealthOk={handleHealthOk} />;
      case 'prediction':
        return <PredictionForm onPredictionResult={handlePredictionResult} />;
      case 'results':
        return predictionResult ? (
          <Box>
            <PredictionResults result={predictionResult} />
            <Box mt={3} textAlign="center">
              <Button
                variant="contained"
                color="primary"
                onClick={handleProceedToFeedback}
                size="large"
              >
                Provide Clinical Feedback
              </Button>
            </Box>
          </Box>
        ) : (
          <Alert severity="error">No prediction results available</Alert>
        );
      case 'feedback':
        return predictionResult && predictionId ? (
          <ClinicalFeedback
            predictionId={predictionId}
            onFeedbackSubmitted={handleFeedbackSubmitted}
          />
        ) : (
          <Alert severity="error">No prediction data available for feedback</Alert>
        );
      default:
        return <HealthCheck onHealthOk={handleHealthOk} />;
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* App Bar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            🏥 Clinical Decision Support System
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            Preliminary Disease Prediction & ICD-10 Mapping
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Stepper */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Stepper activeStep={getActiveStep()} alternativeLabel>
            {steps.map((step) => (
              <Step key={step.key}>
                <StepLabel>{step.label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Navigation Buttons */}
          {currentStep !== 'health' && (
            <Box display="flex" justifyContent="space-between" mt={3}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={handleBack}
                variant="outlined"
              >
                Back
              </Button>
              <Button
                startIcon={<HomeIcon />}
                onClick={handleHome}
                variant="outlined"
                color="secondary"
              >
                Start Over
              </Button>
            </Box>
          )}
        </Paper>

        {/* Step Content */}
        <Box>
          {renderCurrentStep()}
        </Box>

        {/* Footer */}
        <Box mt={6} py={3} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            Clinical Decision Support System v1.0 | FastAPI Backend | React Frontend
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ⚠️ For educational and clinical decision support purposes only. 
            Always consult with healthcare professionals for final clinical decisions.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default App;