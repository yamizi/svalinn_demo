import * as React from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

// @ts-ignore
export default function DeepFakeCarousel({cameraItem}) {

  const steps = [
    {
      label: 'This is the original image',
      description:
        cameraItem,
    },
    {
      label: 'You are drug trafficking!',
      description: cameraItem.replace(".png","_drug.png"),
    },
    {
      label: 'You have been arrested!',
      description: cameraItem.replace(".png","_arrest.png"),
    },
      {
      label: 'You have been sent to prison!',
      description:
        cameraItem.replace(".png","_gambling.png"),
    },
   /*{
      label: 'You have been seen at the Red District in Amsterdam!',
      description:
        'https://firebasestorage.googleapis.com/v0/b/svalinn-partnership-demo.appspot.com/o/photo_adv_seed13.png?alt=media&token=c986c877-c6f1-4a0f-8976-b1b413a29416',
    },*/
  ];

  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = steps.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box sx={{ maxWidth: "512px", flexGrow: 1 }}>
      <Paper
        square
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
            textAlign:'center',
          height: 50,
          pl: 2,
          bgcolor: 'background.default',
        }}
      >
        <Typography>{steps[activeStep].label}</Typography>
      </Paper>
      <Box sx={{ height: 512, maxWidth: 512, width: '100%', p: 2 }}>
          <img src={steps[activeStep].description}/>

      </Box>
      <MobileStepper
        variant="text"
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
          >
            Next
            {theme.direction === 'rtl' ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === 'rtl' ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
            Back
          </Button>
        }
      />
    </Box>
  );
}