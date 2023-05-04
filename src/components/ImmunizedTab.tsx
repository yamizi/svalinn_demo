import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
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

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

// @ts-ignore
export default function ImmunizedTab({cameraItem}) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 224 }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 2, borderColor: 'divider' }}
      >
        <Tab label="You are addicted to gambling!" {...a11yProps(0)} />
        <Tab label="You have been arrested!" {...a11yProps(1)} />
        <Tab label="You are drug trafficking!" {...a11yProps(2)} />

      </Tabs>
      <TabPanel value={value} index={0}>
       <Stack direction="row" spacing={2}>
          <Item><img src={cameraItem}/></Item>
          <Item><img src={cameraItem.replace(".png","_gambling.png")}/></Item>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Item><img src={cameraItem.replace(".png","_imm.png")}/></Item>
          <Item><img src={cameraItem.replace(".png","_imm_gambling.png")}/></Item>
        </Stack>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Stack direction="row" spacing={2}>
          <Item><img src={cameraItem}/></Item>
          <Item><img src={cameraItem.replace(".png","_arrest.png")}/></Item>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Item><img src={cameraItem.replace(".png","_imm.png")}/></Item>
          <Item><img src={cameraItem.replace(".png","_imm_arrest.png")}/></Item>
        </Stack>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Stack direction="row" spacing={2}>
          <Item><img src={cameraItem}/></Item>
          <Item><img src={cameraItem.replace(".png","_drug.png")}/></Item>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Item><img src={cameraItem.replace(".png","_imm.png")}/></Item>
          <Item><img src={cameraItem.replace(".png","_imm_drug.png")}/></Item>
        </Stack>
      </TabPanel>

    </Box>
  );
}