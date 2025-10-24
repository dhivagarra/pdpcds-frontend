// API Response Types
export interface HealthResponse {
  status: string;
  service?: string;
  version?: string;
  timestamp?: string;
  database?: string; // Backend actually returns this field name
  ml_model?: string;
  uptime_seconds?: number;
  database_status?: string; // Keep this for compatibility
  database_type?: string;
  tables_count?: number;
  last_query_time_ms?: number;
  test_query?: string; // Backend also returns this
}

// Disease Prediction Types
export interface PredictionRequest {
  age: number;
  sex: 'male' | 'female' | 'other';
  vital_temperature_c?: number;
  vital_heart_rate?: number;
  vital_blood_pressure_systolic?: number;
  vital_blood_pressure_diastolic?: number;
  symptom_list: string[];
  pmh_list?: string[];
  current_medications?: string[];
  allergies?: string[];
  chief_complaint?: string;
  free_text_notes?: string;
}

export interface RecommendedTest {
  test: string;
  confidence: number;
  urgency: 'routine' | 'urgent' | 'stat';
  rationale?: string;
}

export interface RecommendedMedication {
  medication: string;
  confidence: number;
  dose_suggestion?: string;
  duration?: string;
  contraindication_check: boolean;
}

export interface DiseasePrediction {
  icd10_code: string;
  diagnosis: string;
  confidence: number;
  recommended_tests: RecommendedTest[];
  recommended_medications: RecommendedMedication[];
  assessment_plan: string;
  rationale: string[];
  risk_factors: string[];
  differential_diagnoses: string[];
}

export interface PredictionResponse {
  predictions: DiseasePrediction[];
  model_version: string;
  processing_time_ms: number;
  confidence_threshold: number;
  generated_at: string;
  clinical_warnings: string[];
  disclaimer: string;
}

// Clinical Feedback Types
export interface ClinicalFeedbackRequest {
  prediction_id: number;
  doctor_id: string;
  doctor_name?: string;
  hospital_unit?: string;
  prediction_accurate: boolean;
  confidence_in_feedback: number;
  actual_disease_id?: number;
  actual_condition_name?: string;
  ordered_tests?: string[];
  prescribed_medications?: string[];
  clinical_notes?: string;
  outcome_notes?: string;
}

export interface ClinicalFeedbackResponse {
  message: string;
  feedback_id: number;
  training_data_added: boolean;
  training_record_id?: number;
  total_feedback_for_prediction: number;
  prediction_accuracy_rate: number;
}

// Error Response Type
export interface ApiError {
  detail: string | { loc: string[]; msg: string; type: string }[];
}

// Clinical Outcome Types
export interface ClinicalOutcomeRequest {
  prediction_id: number;
  patient_outcome: 'improved' | 'no_change' | 'worsened' | 'excellent_recovery' | 'complications';
  final_diagnosis_id: number; // REQUIRED - confirmed diagnosis ID
  final_condition_name: string; // REQUIRED - confirmed condition name
  treatment_effective: boolean;
  side_effects?: string[];
  diagnosis_confirmation_days?: number;
  treatment_duration_days?: number;
  readmission_required: boolean;
  complications?: string[];
  reported_by: string; // REQUIRED - doctor/reporter ID (e.g., "DR001")
  outcome_date: string; // ISO date
}

// Training Data Types
export interface TrainingDataRequest {
  age: number;
  sex: 'male' | 'female' | 'other';
  vital_temperature_c?: number;
  vital_heart_rate?: number;
  symptom_list: string[];
  target_disease: number;
  target_tests: number[];
  target_medications: number[];
  condition_name: string;
  chief_complaint?: string;
  quality_score: number; // 0.0 to 1.0
  created_by: string;
}

// Feedback Statistics Types
export interface FeedbackStatistics {
  total_feedback_submissions: number;
  overall_accuracy_rate: number;
  high_confidence_feedback_count: number;
  training_data_generated: number;
  average_doctor_confidence: number;
  most_accurate_predictions: Array<{
    condition: string;
    accuracy: number;
  }>;
}

export interface FeedbackSummary {
  prediction_id: number;
  total_feedback_count: number;
  accuracy_rate: number;
  consensus_reached: boolean;
  average_confidence: number;
  most_common_actual_diagnosis?: string;
}

// Validation Error Type
export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}