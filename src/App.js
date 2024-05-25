import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  FormControlLabel,
  Checkbox,
  Box,
  Button,
  createTheme,
  ThemeProvider,
  CssBaseline,
  TextField,
} from '@mui/material';
import { styled } from '@mui/system';
import StoppageForm from './components/StoppageForm';
import MapComponent from './components/MapComponent';
import { identifyStoppages } from './utils/stoppageUtils';
import 'leaflet/dist/leaflet.css';
import { readExcelFile } from './utils/excelReader';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
  },
});

const UploadButton = styled(Button)({
  margin: '10px',
  backgroundColor: '#90caf9',
  '&:hover': {
    backgroundColor: '#64b5f6',
  },
});

const App = () => {
  const [gpsData, setGpsData] = useState([]);
  const [stoppages, setStoppages] = useState([]);
  const [threshold, setThreshold] = useState(5); // Default threshold in minutes
  const [fetchFromAPI, setFetchFromAPI] = useState(false);
  const [apiLink, setApiLink] = useState('');
  const [pendingLink, setPendingLink] = useState('');

  useEffect(() => {
    if (gpsData.length) {
      const identifiedStoppages = identifyStoppages(gpsData, threshold);
      setStoppages(identifiedStoppages);
    }
  }, [gpsData, threshold]);

  useEffect(() => {
    let interval;
    if (fetchFromAPI) {
      const fetchData = async () => {
        try {
          const response = await fetch(apiLink);
          const data = await response.json();
          setGpsData(data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData(); // Fetch data immediately on start
      interval = setInterval(fetchData, 60000); // Fetch data every 60 seconds

      return () => clearInterval(interval); // Cleanup interval on unmount
    }
  }, [fetchFromAPI, apiLink]);

  const handleFileUpload = async (file) => {
    const data = await readExcelFile(file);
    setGpsData(data);
  };

  const handleApiLinkUpdate = () => {
    setApiLink(pendingLink);
    setPendingLink('');
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h3" gutterBottom>
          Vehicle Stoppage Identification and Visualization
        </Typography>
        <Box bgcolor="primary.dark" p={2} borderRadius={4} mb={2}>
          <FormControlLabel
            control={<Checkbox checked={fetchFromAPI} onChange={() => setFetchFromAPI(!fetchFromAPI)} />}
            label="For Real-time data, check this box (Fetch data from API every minute and update)"
          />
          {fetchFromAPI && (
            <>
              <TextField
                id="api-link"
                label="API Link"
                value={pendingLink}
                onChange={(e) => setPendingLink(e.target.value)}
                fullWidth
              />
              <Button variant="contained" onClick={handleApiLinkUpdate}>OK</Button>
            </>
          )}
        </Box>
        <Typography variant="h5" gutterBottom>
          For already available data, upload files here (format: .xls, .xlsx)
        </Typography>
        {!fetchFromAPI && (
          <Box>
            <UploadButton variant="contained" component="label">
              Upload File
              <input type="file" hidden onChange={(e) => handleFileUpload(e.target.files[0])} />
            </UploadButton>
          </Box>
        )}
        <br />
        <StoppageForm threshold={threshold} setThreshold={setThreshold} />
        <br />
        <MapComponent gpsData={gpsData} stoppages={stoppages} />
      </Container>
    </ThemeProvider>
  );
};

export default App;


