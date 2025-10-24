import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Slider,
  Chip,
  Grid,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { ExpandMore, Send, CheckCircle } from '@mui/icons-material';
import { ClinicalFeedbackRequest, ClinicalOutcomeRequest } from '../types/api';
import { feedbackApi } from '../services/api';

interface ClinicalFeedbackProps {
  predictionId: number;
  onFeedbackSubmitted: (feedback: any) => void;
}

const ClinicalFeedback: React.FC<ClinicalFeedbackProps> = ({
  predictionId,
  onFeedbackSubmitted,
}) => {
  const [feedback, setFeedback] = useState<Partial<ClinicalFeedbackRequest>>({
    prediction_id: predictionId,
    doctor_id: '',
    doctor_name: '',
    hospital_unit: '',
    prediction_accurate: true,
    confidence_in_feedback: 0.8,
    ordered_tests: [],
    prescribed_medications: [],
    clinical_notes: '',
    outcome_notes: '',
  });

  // Outcome Form State
  const [outcome, setOutcome] = useState<Partial<ClinicalOutcomeRequest>>({
    prediction_id: predictionId,
    patient_outcome: 'improved',
    final_diagnosis_id: 1, // Default to a valid diagnosis ID
    final_condition_name: 'Confirmed diagnosis', // Default value
    treatment_effective: true,
    side_effects: [],
    diagnosis_confirmation_days: 1,
    treatment_duration_days: 7,
    readmission_required: false,
    complications: [],
    reported_by: 'DR001', // Default doctor ID - will be updated from form
    outcome_date: new Date().toISOString(),
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleFeedbackSubmit = async () => {
    if (!feedback.doctor_id) {
      setSubmitStatus({
        type: 'error',
        message: 'Doctor ID is required',
      });
      return;
    }

    setSubmitting(true);
    try {
      const response = await feedbackApi.submitFeedback(feedback as ClinicalFeedbackRequest);
      setSubmitStatus({
        type: 'success',
        message: `Feedback submitted successfully! ID: ${response.feedback_id}`,
      });
      onFeedbackSubmitted(response);
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: `Failed to submit feedback: ${error}`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleOutcomeSubmit = async () => {
    setSubmitting(true);
    try {
      // Validate required fields
      if (!outcome.final_diagnosis_id || !outcome.final_condition_name || !outcome.reported_by) {
        throw new Error('Final diagnosis ID, condition name, and reporter ID are required');
      }

      // Ensure all fields are properly formatted for the backend
      const outcomeData: ClinicalOutcomeRequest = {
        prediction_id: predictionId,
        patient_outcome: outcome.patient_outcome || 'improved',
        final_diagnosis_id: Number(outcome.final_diagnosis_id),
        final_condition_name: outcome.final_condition_name,
        treatment_effective: outcome.treatment_effective ?? true,
        side_effects: outcome.side_effects || [],
        diagnosis_confirmation_days: outcome.diagnosis_confirmation_days || 1,
        treatment_duration_days: outcome.treatment_duration_days || 7,
        readmission_required: outcome.readmission_required ?? false,
        complications: outcome.complications || [],
        reported_by: outcome.reported_by,
        outcome_date: new Date().toISOString().split('.')[0] + 'Z',
      };

      await feedbackApi.submitOutcome(outcomeData);
      setSubmitStatus({
        type: 'success',
        message: 'Clinical outcome recorded successfully!',
      });
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: `Failed to record outcome: ${error}`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const addTest = (test: string) => {
    if (test && !feedback.ordered_tests?.includes(test)) {
      setFeedback({
        ...feedback,
        ordered_tests: [...(feedback.ordered_tests || []), test],
      });
    }
  };

  const removeTest = (test: string) => {
    setFeedback({
      ...feedback,
      ordered_tests: feedback.ordered_tests?.filter(t => t !== test),
    });
  };

  const addMedication = (medication: string) => {
    if (medication && !feedback.prescribed_medications?.includes(medication)) {
      setFeedback({
        ...feedback,
        prescribed_medications: [...(feedback.prescribed_medications || []), medication],
      });
    }
  };

  const removeMedication = (medication: string) => {
    setFeedback({
      ...feedback,
      prescribed_medications: feedback.prescribed_medications?.filter(m => m !== medication),
    });
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Clinical Feedback & Outcomes
        </Typography>
        
        {submitStatus.type && (
          <Alert 
            severity={submitStatus.type} 
            onClose={() => setSubmitStatus({ type: null, message: '' })}
            sx={{ mb: 2 }}
          >
            {submitStatus.message}
          </Alert>
        )}

        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">Doctor Feedback on Prediction</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {/* Doctor Information */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Doctor ID *"
                  value={feedback.doctor_id}
                  onChange={(e) => setFeedback({ ...feedback, doctor_id: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Doctor Name"
                  value={feedback.doctor_name}
                  onChange={(e) => setFeedback({ ...feedback, doctor_name: e.target.value })}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Hospital Unit/Department"
                  value={feedback.hospital_unit}
                  onChange={(e) => setFeedback({ ...feedback, hospital_unit: e.target.value })}
                />
              </Grid>

              {/* Prediction Assessment */}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={feedback.prediction_accurate}
                      onChange={(e) => setFeedback({ ...feedback, prediction_accurate: e.target.checked })}
                      color="primary"
                    />
                  }
                  label={feedback.prediction_accurate ? "Prediction was accurate" : "Prediction was inaccurate"}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography gutterBottom>
                  Confidence in Feedback: {(feedback.confidence_in_feedback! * 100).toFixed(0)}%
                </Typography>
                <Slider
                  value={feedback.confidence_in_feedback! * 100}
                  onChange={(_, value) => setFeedback({ 
                    ...feedback, 
                    confidence_in_feedback: (value as number) / 100 
                  })}
                  min={0}
                  max={100}
                  step={5}
                  marks={[
                    { value: 0, label: '0%' },
                    { value: 50, label: '50%' },
                    { value: 100, label: '100%' }
                  ]}
                />
              </Grid>

              {/* Corrective Information (if prediction inaccurate) */}
              {!feedback.prediction_accurate && (
                <>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Actual Disease ID"
                      type="number"
                      value={feedback.actual_disease_id || ''}
                      onChange={(e) => setFeedback({ 
                        ...feedback, 
                        actual_disease_id: e.target.value ? parseInt(e.target.value) : undefined 
                      })}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Actual Condition Name"
                      value={feedback.actual_condition_name}
                      onChange={(e) => setFeedback({ ...feedback, actual_condition_name: e.target.value })}
                    />
                  </Grid>
                </>
              )}

              {/* Tests Ordered */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Tests Ordered
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                  {feedback.ordered_tests?.map((test) => (
                    <Chip
                      key={test}
                      label={test}
                      onDelete={() => removeTest(test)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
                <TextField
                  fullWidth
                  size="small"
                  label="Add test"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addTest((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
              </Grid>

              {/* Medications Prescribed */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Medications Prescribed
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                  {feedback.prescribed_medications?.map((med) => (
                    <Chip
                      key={med}
                      label={med}
                      onDelete={() => removeMedication(med)}
                      color="secondary"
                      variant="outlined"
                    />
                  ))}
                </Box>
                <TextField
                  fullWidth
                  size="small"
                  label="Add medication"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addMedication((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
              </Grid>

              {/* Clinical Notes */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Clinical Notes"
                  value={feedback.clinical_notes}
                  onChange={(e) => setFeedback({ ...feedback, clinical_notes: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Outcome Notes"
                  value={feedback.outcome_notes}
                  onChange={(e) => setFeedback({ ...feedback, outcome_notes: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  startIcon={<Send />}
                  onClick={handleFeedbackSubmit}
                  disabled={submitting || !feedback.doctor_id}
                  fullWidth
                >
                  Submit Doctor Feedback
                </Button>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">Patient Outcome Recording</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Patient Outcome</InputLabel>
                  <Select
                    value={outcome.patient_outcome}
                    label="Patient Outcome"
                    onChange={(e) => setOutcome({ 
                      ...outcome, 
                      patient_outcome: e.target.value as any 
                    })}
                  >
                    <MenuItem value="excellent_recovery">Excellent Recovery</MenuItem>
                    <MenuItem value="improved">Improved</MenuItem>
                    <MenuItem value="no_change">No Change</MenuItem>
                    <MenuItem value="worsened">Worsened</MenuItem>
                    <MenuItem value="complications">Complications</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Required: Final Diagnosis ID */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Final Diagnosis ID *"
                  type="number"
                  value={outcome.final_diagnosis_id || ''}
                  onChange={(e) => setOutcome({ 
                    ...outcome, 
                    final_diagnosis_id: Number(e.target.value) 
                  })}
                  required
                  helperText="Required: Confirmed diagnosis ID"
                />
              </Grid>

              {/* Required: Final Condition Name */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Final Condition Name *"
                  value={outcome.final_condition_name || ''}
                  onChange={(e) => setOutcome({ 
                    ...outcome, 
                    final_condition_name: e.target.value 
                  })}
                  required
                  helperText="Required: Confirmed diagnosis/condition name"
                />
              </Grid>

              {/* Required: Reported By */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Reported By (Doctor ID) *"
                  value={outcome.reported_by || ''}
                  onChange={(e) => setOutcome({ 
                    ...outcome, 
                    reported_by: e.target.value 
                  })}
                  required
                  helperText="Required: Doctor ID (e.g., DR001)"
                  placeholder="DR001"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={outcome.treatment_effective}
                      onChange={(e) => setOutcome({ 
                        ...outcome, 
                        treatment_effective: e.target.checked 
                      })}
                    />
                  }
                  label="Treatment was effective"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Diagnosis Confirmation (days)"
                  type="number"
                  value={outcome.diagnosis_confirmation_days || ''}
                  onChange={(e) => setOutcome({ 
                    ...outcome, 
                    diagnosis_confirmation_days: e.target.value ? parseInt(e.target.value) : undefined 
                  })}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Treatment Duration (days)"
                  type="number"
                  value={outcome.treatment_duration_days || ''}
                  onChange={(e) => setOutcome({ 
                    ...outcome, 
                    treatment_duration_days: e.target.value ? parseInt(e.target.value) : undefined 
                  })}
                />
              </Grid>



              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<CheckCircle />}
                  onClick={handleOutcomeSubmit}
                  disabled={submitting}
                  fullWidth
                >
                  Record Patient Outcome
                </Button>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default ClinicalFeedback;