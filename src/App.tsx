import React from 'react';
//import logo from './logo.svg';
import './App.css';
import { useTheme } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import GppGoodIcon from '@mui/icons-material/GppGood';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import CameraCapture from './components/CameraCapture'
import DeepFakeCarousel from "./components/DeepFakeCarousel";
import {Socket} from "socket.io-client";
import {handleConnect, handleBackEndOperation} from "./service/utils";
import {DefaultEventsMap} from "@socket.io/component-emitter";
import ImmunizedTab from "./components/ImmunizedTab";

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}


function App() {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [cameraItem, setCameraItem] = React.useState('');
  const [connected, setConnected] = React.useState<boolean>(false);
  const [serverMessage, setServerMessage ] = React.useState<string>('');
  const [socket,setSocket] = React.useState<Socket<DefaultEventsMap, DefaultEventsMap>>();
  const [deepfake, setDeepfake] = React.useState([]); // TODO: Not sure what this does. Is used for callback on handleOperationBackend. What is callback?
  const [immunized, setImmunized] = React.useState([]); // TODO: Smae here 
  const [immunizationDone, setImmunizationDone] = React.useState(false);
  const [deepfakeDone, setDeepfakeDone] = React.useState(false);

  if (!connected){
      handleConnect(setServerMessage, setConnected, setSocket);
  }

  const setCamera = (event: React.SyntheticEvent, urlValue: string, filename: string) => {
    setCameraItem("https://firebasestorage.googleapis.com/v0/b/svalinn-partnership-demo.appspot.com/o/"+urlValue+"?alt=media");
    const operation ="deepfake";
    const params = {"attack_name":"stable_diffusion_inpainting","file_id":urlValue};
    // @ts-ignore
      handleBackEndOperation(operation, params, urlValue, socket, setDeepfake, setDeepfakeDone, setImmunizationDone)
  };

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

        <TabPanel value={value} index={0} dir={theme.direction}>
          <CameraCapture setCamera={setCamera}/>
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
            <div
      style={{
        display: "flex",
        alignItems: "center",
          justifyContent: "center",
        height: "100%",
          width:"100%"
      }}
    ><DeepFakeCarousel cameraItem={cameraItem}/>
            </div>

        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
<ImmunizedTab cameraItem={cameraItem} socket={socket} setImmunized={setImmunized} immunizationDone = {immunizationDone} setImmunizationDone={setImmunizationDone} setDeepfakeDone={setDeepfakeDone}/>
        </TabPanel>
    </div>
  );
}

export default App;
