import React, { useState } from 'react'
import Webcam from 'react-webcam'
import Button from '@mui/material/Button';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';

import {handleUpload} from '../service/firebase'
import {genUniqueId, urltoFile, launchDeepFake} from "../service/utils";
//const WebcamComponent = () => <Webcam />
const videoConstraints = {
  width: 512,
  height: 512,
  facingMode: 'user',
}
// @ts-ignore
const CameraCapture = ({setCamera}) => {
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

      launchDeepFake(pictureName,onDeepFakeReady )
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
            <Button variant="contained" onClick={(e) => {
              e.preventDefault()
              setPicture('')
            }}
            className="btn btn-primary"
          >
            Retake
          </Button>
        ) : (

            <FormGroup>

              <FormControlLabel required control={<Checkbox checked={formAccept} onChange={handleCheckboxChange} />} label="I agree to the Data Processing Policy" />
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
                        disabled={!formAccept || email.length<5}
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