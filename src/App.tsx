import React from 'react';
import logo from './logo.svg';
import './App.css';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import GppGoodIcon from '@mui/icons-material/GppGood';
import PersonPinIcon from '@mui/icons-material/PersonPin';



function App() {

    const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src="http://svalinn.online/wp-content/uploads/2023/03/cropped-Svalinn_logo1-removebg-preview.png" className="App-logo" alt="logo" />
      </header>

      <Tabs value={value} onChange={handleChange} variant="fullWidth" aria-label="icon label tabs example">
        <Tab icon={<PhotoCameraIcon />} label="CAPTURE" />
        <Tab icon={<PersonPinIcon />} label="DEEPFAKE" />
        <Tab icon={<GppGoodIcon />} label="PROTECTION" />
      </Tabs>
    </div>
  );
}

export default App;
