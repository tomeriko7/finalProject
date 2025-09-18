// components/common/DataClearingNotification.jsx
import React, { useState, useEffect } from 'react';
import { 
  Snackbar, 
  Alert, 
  AlertTitle, 
  LinearProgress, 
  Box, 
  Typography 
} from '@mui/material';

const DataClearingNotification = ({ open, onClose }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  const steps = [
    'מנקה Redux state...',
    'מנקה localStorage...',
    'מנקה sessionStorage...',
    'מנקה cache...',
    'סיים בהצלחה!'
  ];

  useEffect(() => {
    if (!open) return;

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setCurrentStep(steps[stepIndex]);
        setProgress((stepIndex + 1) * 20);
        stepIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onClose();
          setProgress(0);
          setCurrentStep('');
        }, 1000);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [open, onClose]);

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{ mt: 8 }}
    >
      <Alert severity="info" sx={{ width: '100%', minWidth: 300 }}>
        <AlertTitle>מנקה נתונים...</AlertTitle>
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {currentStep}
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ mt: 1 }}
          />
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default DataClearingNotification;
