import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  Stack,
  Autocomplete,
} from '@mui/material';
import {
  Send as SendIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { predictionApi, handleApiError } from '../services/api';
import { PredictionRequest, PredictionResponse } from '../types/api';

interface PredictionFormProps {
  onPredictionResult: (result: PredictionResponse) => void;
}

// Common medical symptoms for autocomplete
const COMMON_SYMPTOMS = [
  'fever', 'cough', 'shortness of breath', 'fatigue', 'headache', 'nausea', 'vomiting',
  'chest pain', 'abdominal pain', 'back pain', 'muscle aches', 'sore throat',
  'diarrhea', 'constipation', 'dizziness', 'loss of appetite', 'weight loss',
  'night sweats', 'chills', 'joint pain', 'difficulty swallowing', 'heartburn',
  'runny nose', 'congestion', 'ear pain', 'blurred vision', 'skin rash'
];

// Common medical history conditions
const COMMON_PMH = [
  'hypertension', 'diabetes type 2', 'diabetes type 1', 'coronary artery disease',
  'heart failure', 'atrial fibrillation', 'asthma', 'COPD', 'cancer history',
  'stroke', 'kidney disease', 'liver disease', 'thyroid disease', 'depression',
  'anxiety', 'arthritis', 'osteoporosis', 'peptic ulcer disease'
];

// Common medications
const COMMON_MEDICATIONS = [
  'lisinopril', 'metformin', 'atorvastatin', 'amlodipine', 'metoprolol',
  'omeprazole', 'simvastatin', 'levothyroxine', 'azithromycin', 'amoxicillin',
  'ibuprofen', 'acetaminophen', 'aspirin', 'furosemide', 'prednisone'
];

// Common allergies
const COMMON_ALLERGIES = [
  'penicillin', 'sulfonamides', 'codeine', 'latex', 'peanuts', 'shellfish',
  'iodine', 'morphine', 'aspirin', 'NSAIDs', 'eggs', 'milk', 'soy'
];

const PredictionForm: React.FC<PredictionFormProps> = ({ onPredictionResult }) => {
  const [formData, setFormData] = useState<PredictionRequest>({
    age: 0,
    sex: 'male',
    symptom_list: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (field: keyof PredictionRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear previous messages
    setError(null);
    setSuccess(null);
  };

  const handleArrayChange = (field: 'symptom_list' | 'pmh_list' | 'current_medications' | 'allergies', values: string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: values,
    }));
  };

  const validateForm = (): string | null => {
    if (formData.age <= 0 || formData.age > 120) {
      return 'Please enter a valid age (1-120)';
    }
    if (formData.symptom_list.length === 0) {
      return 'Please enter at least one symptom';
    }
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      console.log('🔍 Submitting prediction request:', formData);
      const result = await predictionApi.submitPrediction(formData);
      
      setSuccess(`Prediction completed in ${result.processing_time_ms.toFixed(1)}ms`);
      onPredictionResult(result);
      
      console.log('✅ Prediction successful:', result);
    } catch (error: any) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      console.error('❌ Prediction failed:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      age: 0,
      sex: 'male',
      symptom_list: [],
    });
    setError(null);
    setSuccess(null);
  };

  const handleQuickFill = () => {
    setFormData({
      age: 45,
      sex: 'female',
      vital_temperature_c: 38.5,
      vital_heart_rate: 95,
      vital_blood_pressure_systolic: 140,
      vital_blood_pressure_diastolic: 90,
      symptom_list: ['fever', 'cough', 'shortness of breath', 'fatigue'],
      pmh_list: ['hypertension', 'diabetes type 2'],
      current_medications: ['lisinopril', 'metformin'],
      allergies: ['penicillin'],
      chief_complaint: 'Cough and fever for 4 days',
      free_text_notes: 'Patient reports productive cough with yellow sputum, worsening over past 4 days. No recent travel.',
    });
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" component="h2">
            🩺 Disease Prediction Request
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              onClick={handleQuickFill}
              size="small"
            >
              Quick Fill Example
            </Button>
            <Button
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={handleClear}
              size="small"
            >
              Clear
            </Button>
          </Stack>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Demographics */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Patient Demographics
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Age *"
              type="number"
              value={formData.age || ''}
              onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
              inputProps={{ min: 1, max: 120 }}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Sex *</InputLabel>
              <Select
                value={formData.sex}
                label="Sex *"
                onChange={(e) => handleInputChange('sex', e.target.value)}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Vital Signs */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Vital Signs (Optional)
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Temperature (°C)"
              type="number"
              value={formData.vital_temperature_c || ''}
              onChange={(e) => handleInputChange('vital_temperature_c', parseFloat(e.target.value) || undefined)}
              inputProps={{ min: 30, max: 45, step: 0.1 }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Heart Rate (BPM)"
              type="number"
              value={formData.vital_heart_rate || ''}
              onChange={(e) => handleInputChange('vital_heart_rate', parseInt(e.target.value) || undefined)}
              inputProps={{ min: 30, max: 200 }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Systolic BP"
              type="number"
              value={formData.vital_blood_pressure_systolic || ''}
              onChange={(e) => handleInputChange('vital_blood_pressure_systolic', parseInt(e.target.value) || undefined)}
              inputProps={{ min: 70, max: 250 }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Diastolic BP"
              type="number"
              value={formData.vital_blood_pressure_diastolic || ''}
              onChange={(e) => handleInputChange('vital_blood_pressure_diastolic', parseInt(e.target.value) || undefined)}
              inputProps={{ min: 40, max: 150 }}
            />
          </Grid>

          {/* Clinical Information */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Clinical Information
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              multiple
              options={COMMON_SYMPTOMS}
              freeSolo
              value={formData.symptom_list || []}
              onChange={(_, values) => handleArrayChange('symptom_list', values)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Symptoms *"
                  placeholder="Type symptoms..."
                  required={formData.symptom_list.length === 0}
                  helperText="Required: Enter at least one symptom"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Autocomplete
              multiple
              options={COMMON_PMH}
              freeSolo
              value={formData.pmh_list || []}
              onChange={(_, values) => handleArrayChange('pmh_list', values)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Past Medical History"
                  placeholder="Type conditions..."
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Autocomplete
              multiple
              options={COMMON_MEDICATIONS}
              freeSolo
              value={formData.current_medications || []}
              onChange={(_, values) => handleArrayChange('current_medications', values)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Current Medications"
                  placeholder="Type medications..."
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              multiple
              options={COMMON_ALLERGIES}
              freeSolo
              value={formData.allergies || []}
              onChange={(_, values) => handleArrayChange('allergies', values)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Allergies"
                  placeholder="Type allergies..."
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Chief Complaint"
              value={formData.chief_complaint || ''}
              onChange={(e) => handleInputChange('chief_complaint', e.target.value)}
              placeholder="Primary reason for visit..."
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Clinical Notes"
              value={formData.free_text_notes || ''}
              onChange={(e) => handleInputChange('free_text_notes', e.target.value)}
              placeholder="Additional clinical information, history of present illness, etc..."
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center" mt={2}>
              <Button
                variant="contained"
                size="large"
                startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
                onClick={handleSubmit}
                disabled={loading}
                sx={{ minWidth: 200 }}
              >
                {loading ? 'Processing...' : 'Get Prediction'}
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* API Information */}
        <Box mt={4} p={2} bgcolor="grey.50" borderRadius={1}>
          <Typography variant="body2" color="text.secondary">
            <strong>API Endpoint:</strong> POST /api/v1/predict/
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This form submits data to the Clinical Decision Support System for AI-powered disease prediction.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PredictionForm;