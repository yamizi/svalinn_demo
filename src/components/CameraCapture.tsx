import React, { useState } from 'react'
import Webcam from 'react-webcam'
import Button from '@mui/material/Button';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';

import {handleUpload} from '../service/firebase'
import {genUniqueId, urltoFile, launchDeepFake} from "../service/utils";

import Grid from '@mui/material/Grid';
import PersonPinIcon from '@mui/icons-material/PersonPin';

import LoadingButton from '@mui/lab/LoadingButton';
//const WebcamComponent = () => <Webcam />
const videoConstraints = {
  width: 512,
  height: 512,
  facingMode: 'user',
}
// @ts-ignore
const CameraCapture = ({setCamera, deepfakeDone, goToTab}) => {
  const [picture, setPicture] = useState('');
  const [email, setEmail] = useState('');
  const [formAccept, setFormAccept] = useState(false)

  const webcamRef = React.useRef(null)

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormAccept(event.target.checked);
      };

  const capture = React.useCallback((name:string) => {
    // @ts-ignore
      const pictureSrc = webcamRef.current.getScreenshot()
      const pictureName = name+"_"+genUniqueId()+".png"
      //console.log(pictureSrc)

      urltoFile(pictureSrc, pictureName,'image/png')
    .then(function(file){ handleUpload(pictureName,file, setCamera);});

      //launchDeepFake(pictureName,onDeepFakeReady )
      setPicture(pictureSrc)
  }, []);

    const onDeepFakeReady = (data:any) => {
        console.log("deepfake ready", data)
    }

  return (
    <div>
      <h2 className="mb-5 text-center">
        Let's first capture your face!
      </h2>
      <div>
        {picture == '' ? (
          <Webcam
            audio={false}
            height={512}
            ref={webcamRef}
            //width={512}
            screenshotFormat="image/png"
            //videoConstraints={videoConstraints}
          />
        ) : (
          <img src={picture} />
        )}
      </div>
      <div>
        {picture != '' ? (
          <Grid container justifyContent="center" spacing={2}>
            <Grid item>
            <Button variant="contained" onClick={(e) => {
              e.preventDefault()
              setPicture('')
            }}
            className="btn btn-primary"
          >
            Retake
          </Button>
            </Grid>
            <Grid item>
            
          <LoadingButton
          color="secondary"
          // onClick={handleClick}
          loading={!deepfakeDone}
          loadingPosition="start"
          // loadingIndicator="Generating deepfakes"
          startIcon={<PersonPinIcon />}
          variant="contained"
          onClick={(e) => {
            e.preventDefault()
            goToTab(1)
          }}
        >
          <span>See deepfakes</span>
        </LoadingButton>
          </Grid>
          </Grid>
        ) : (

            <FormGroup>

<FormControlLabel required control={<Checkbox checked={formAccept} onChange={handleCheckboxChange} />} label={<label>I agree to <a href='https://svalinn.online/snt-partnership-day-data-processing-policy/'>Data Processing Policy</a></label>} />
                <TextField id="standard-basic" label="Email" value={email}
  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  }} variant="standard" />

                <Button variant="contained"
                    onClick={(e) => {
                      e.preventDefault()
                      capture(email)
                    }}
                    className="btn btn-danger"
                        // disabled={!formAccept || email.length<5}
                        disabled={!formAccept ||  !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))}
                  >
                    Capture
                  </Button>
            </FormGroup>


        )}
      </div>
    </div>
  )
}
export default CameraCapture