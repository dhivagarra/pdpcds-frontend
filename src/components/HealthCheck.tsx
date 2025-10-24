import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
  Grid,
  Chip,
  Divider,
  Stack,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  PlayArrow as PlayArrowIcon,
} from '@mui/icons-material';
import { healthApi, handleApiError } from '../services/api';
import { HealthResponse } from '../types/api';

interface HealthCheckProps {
  onHealthOk: () => void;
}

interface HealthStatus {
  basic: HealthResponse | null;
  detailed: HealthResponse | null;
  database: HealthResponse | null;
  loading: boolean;
  error: string | null;
  allHealthy: boolean;
}

const HealthCheck: React.FC<HealthCheckProps> = ({ onHealthOk }) => {
  const [status, setStatus] = useState<HealthStatus>({
    basic: null,
    detailed: null,
    database: null,
    loading: false,
    error: null,
    allHealthy: false,
  });

  const checkAllHealth = async () => {
    setStatus(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('🔍 Starting health checks...');
      
      // Run all health checks in parallel
      const [basicHealth, detailedHealth, databaseHealth] = await Promise.all([
        healthApi.checkBasicHealth(),
        healthApi.checkDetailedHealth(),
        healthApi.checkDatabaseHealth(),
      ]);

      const allHealthy = 
        basicHealth.status === 'healthy' &&
        detailedHealth.status === 'healthy' &&
        (databaseHealth.database_status === 'connected' || databaseHealth.database === 'connected');

      setStatus({
        basic: basicHealth,
        detailed: detailedHealth,
        database: databaseHealth,
        loading: false,
        error: null,
        allHealthy,
      });

      console.log('✅ All health checks completed:', { allHealthy });

    } catch (error: any) {
      const errorMessage = handleApiError(error);
      setStatus(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        allHealthy: false,
      }));
      console.error('❌ Health check failed:', errorMessage);
    }
  };

  useEffect(() => {
    // Auto-run health checks on component mount
    checkAllHealth();
  }, []);

  const getStatusIcon = (healthy: boolean) => {
    return healthy ? (
      <CheckCircleIcon color="success" sx={{ fontSize: 20 }} />
    ) : (
      <ErrorIcon color="error" sx={{ fontSize: 20 }} />
    );
  };

  const getStatusColor = (healthy: boolean) => {
    return healthy ? 'success' : 'error';
  };

  const formatUptime = (seconds?: number) => {
    if (!seconds) return 'Unknown';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" component="h2">
            🏥 System Health Monitor
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={checkAllHealth}
              disabled={status.loading}
            >
              Refresh
            </Button>
            {status.allHealthy && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<PlayArrowIcon />}
                onClick={onHealthOk}
              >
                Proceed to Prediction
              </Button>
            )}
          </Stack>
        </Box>

        {status.loading && (
          <Box display="flex" justifyContent="center" my={3}>
            <CircularProgress />
            <Typography variant="body2" sx={{ ml: 2, alignSelf: 'center' }}>
              Checking system health...
            </Typography>
          </Box>
        )}

        {status.error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Connection Failed:</strong> {status.error}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Please ensure the backend server is running on http://127.0.0.1:8000
            </Typography>
          </Alert>
        )}

        {!status.loading && !status.error && (
          <>
            <Grid container spacing={3}>
              {/* Basic Health Check */}
              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      {getStatusIcon(status.basic?.status === 'healthy')}
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        Basic Health
                      </Typography>
                    </Box>
                    <Chip
                      label={status.basic?.status || 'Unknown'}
                      color={getStatusColor(status.basic?.status === 'healthy')}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    {status.basic?.service && (
                      <Typography variant="body2" color="text.secondary">
                        Service: {status.basic.service}
                      </Typography>
                    )}
                    {status.basic?.version && (
                      <Typography variant="body2" color="text.secondary">
                        Version: {status.basic.version}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Detailed Health Check */}
              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      {getStatusIcon(status.detailed?.status === 'healthy')}
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        Detailed Health
                      </Typography>
                    </Box>
                    <Chip
                      label={status.detailed?.status || 'Unknown'}
                      color={getStatusColor(status.detailed?.status === 'healthy')}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    {status.detailed?.ml_model && (
                      <Typography variant="body2" color="text.secondary">
                        ML Model: {status.detailed.ml_model}
                      </Typography>
                    )}
                    {status.detailed?.uptime_seconds && (
                      <Typography variant="body2" color="text.secondary">
                        Uptime: {formatUptime(status.detailed.uptime_seconds)}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Database Health Check */}
              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      {getStatusIcon(status.database?.database_status === 'connected' || status.database?.database === 'connected')}
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        Database Health
                      </Typography>
                    </Box>
                    <Chip
                      label={status.database?.database_status || status.database?.database || 'Unknown'}
                      color={getStatusColor(status.database?.database_status === 'connected' || status.database?.database === 'connected')}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    {status.database?.database_type && (
                      <Typography variant="body2" color="text.secondary">
                        Type: {status.database.database_type}
                      </Typography>
                    )}
                    {status.database?.tables_count && (
                      <Typography variant="body2" color="text.secondary">
                        Tables: {status.database.tables_count}
                      </Typography>
                    )}
                    {status.database?.last_query_time_ms && (
                      <Typography variant="body2" color="text.secondary">
                        Query Time: {status.database.last_query_time_ms}ms
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Overall Status */}
            <Box textAlign="center">
              {status.allHealthy ? (
                <Alert severity="success">
                  <Typography variant="body1">
                    <strong>✅ All Systems Operational</strong>
                  </Typography>
                  <Typography variant="body2">
                    The Clinical Decision Support System is ready for use.
                    Click "Proceed to Prediction" to continue.
                  </Typography>
                </Alert>
              ) : (
                <Alert severity="warning">
                  <Typography variant="body1">
                    <strong>⚠️ System Issues Detected</strong>
                  </Typography>
                  <Typography variant="body2">
                    Some system components are not responding correctly.
                    Please check the server logs and try refreshing.
                  </Typography>
                </Alert>
              )}
            </Box>
          </>
        )}

        {/* Debug Information */}
        {import.meta.env.DEV && status.basic && (
          <Box mt={3}>
            <Typography variant="body2" color="text.secondary">
              <strong>Debug Info:</strong> Backend URL: http://127.0.0.1:8000
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default HealthCheck;