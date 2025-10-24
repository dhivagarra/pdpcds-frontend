import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  Divider,
  Alert,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  MedicalServices as MedicalServicesIcon,
  LocalPharmacy as LocalPharmacyIcon,
  Assignment as AssignmentIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material';
import { PredictionResponse, DiseasePrediction } from '../types/api';

interface PredictionResultsProps {
  result: PredictionResponse;
}

const PredictionResults: React.FC<PredictionResultsProps> = ({ result }) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'success';
    if (confidence >= 0.6) return 'warning';
    return 'error';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
  };

  const formatConfidence = (confidence: number) => {
    return `${(confidence * 100).toFixed(1)}%`;
  };

  const PredictionCard: React.FC<{ prediction: DiseasePrediction; index: number }> = ({ prediction, index }) => (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography variant="h6" component="h3">
              {prediction.diagnosis}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ICD-10: {prediction.icd10_code}
            </Typography>
          </Box>
          <Box textAlign="right">
            <Chip
              label={`${getConfidenceLabel(prediction.confidence)} Confidence`}
              color={getConfidenceColor(prediction.confidence)}
              size="small"
              sx={{ mb: 1 }}
            />
            <Typography variant="h6" color={getConfidenceColor(prediction.confidence)}>
              {formatConfidence(prediction.confidence)}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={prediction.confidence * 100}
              color={getConfidenceColor(prediction.confidence)}
              sx={{ mt: 1, width: 100 }}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Assessment Plan */}
        <Box mb={3}>
          <Typography variant="subtitle1" gutterBottom>
            <AssignmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Assessment & Plan
          </Typography>
          <Typography variant="body2" sx={{ backgroundColor: 'grey.50', p: 2, borderRadius: 1 }}>
            {prediction.assessment_plan}
          </Typography>
        </Box>

        {/* Recommended Tests */}
        {prediction.recommended_tests.length > 0 && (
          <Accordion defaultExpanded={index === 0}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">
                <MedicalServicesIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Recommended Tests ({prediction.recommended_tests.length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Test</TableCell>
                      <TableCell>Confidence</TableCell>
                      <TableCell>Urgency</TableCell>
                      <TableCell>Rationale</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {prediction.recommended_tests.map((test, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {test.test}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={formatConfidence(test.confidence)}
                            color={getConfidenceColor(test.confidence)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={test.urgency}
                            color={test.urgency === 'urgent' ? 'error' : test.urgency === 'routine' ? 'primary' : 'default'}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {test.rationale}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Recommended Medications */}
        {prediction.recommended_medications.length > 0 && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">
                <LocalPharmacyIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Recommended Medications ({prediction.recommended_medications.length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Medication</TableCell>
                      <TableCell>Dosage</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Confidence</TableCell>
                      <TableCell>Safety Check</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {prediction.recommended_medications.map((med, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {med.medication}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {med.dose_suggestion}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {med.duration}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={formatConfidence(med.confidence)}
                            color={getConfidenceColor(med.confidence)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={med.contraindication_check ? "Checked" : "Not Checked"}
                            color={med.contraindication_check ? "success" : "warning"}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Clinical Rationale */}
        {prediction.rationale.length > 0 && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">
                <PsychologyIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Clinical Rationale
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List dense>
                {prediction.rationale.map((item, idx) => (
                  <ListItem key={idx}>
                    <ListItemIcon>
                      <InfoIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Risk Factors and Differential Diagnoses */}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {prediction.risk_factors.length > 0 && (
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Risk Factors
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {prediction.risk_factors.map((factor, idx) => (
                  <Chip
                    key={idx}
                    label={factor}
                    color="warning"
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Grid>
          )}

          {prediction.differential_diagnoses.length > 0 && (
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Differential Diagnoses
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {prediction.differential_diagnoses.map((dx, idx) => (
                  <Chip
                    key={idx}
                    label={dx}
                    color="primary"
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            🎯 Clinical Decision Support Results
          </Typography>
          
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Model Version
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {result.model_version}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Processing Time
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {result.processing_time_ms.toFixed(1)}ms
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Confidence Threshold
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {formatConfidence(result.confidence_threshold)}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Generated At
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {new Date(result.generated_at).toLocaleTimeString()}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Clinical Warnings */}
      {result.clinical_warnings.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body2" fontWeight="medium" gutterBottom>
            <WarningIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Clinical Warnings
          </Typography>
          <List dense>
            {result.clinical_warnings.map((warning, idx) => (
              <ListItem key={idx} sx={{ py: 0 }}>
                <ListItemText primary={warning} />
              </ListItem>
            ))}
          </List>
        </Alert>
      )}

      {/* Predictions */}
      <Typography variant="h6" gutterBottom>
        Disease Predictions ({result.predictions.length})
      </Typography>

      {result.predictions.map((prediction, index) => (
        <PredictionCard key={index} prediction={prediction} index={index} />
      ))}

      {/* Medical Disclaimer */}
      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>Medical Disclaimer:</strong> {result.disclaimer}
        </Typography>
      </Alert>
    </Box>
  );
};

export default PredictionResults;