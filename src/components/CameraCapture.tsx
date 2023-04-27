import React, { useState } from 'react'
import Webcam from 'react-webcam'
import Button from '@mui/material/Button';


import {handleUpload} from '../service/firebase'
import {genUniqueId, urltoFile} from "../service/utils";
//const WebcamComponent = () => <Webcam />
const videoConstraints = {
  width: 512,
  height: 512,
  facingMode: 'user',
}
// @ts-ignore
const CameraCapture = ({setCameraItem}) => {
  const [picture, setPicture] = useState('')
  const webcamRef = React.useRef(null)
  const capture = React.useCallback(() => {
    // @ts-ignore
      const pictureSrc = webcamRef.current.getScreenshot()
      const pictureName = genUniqueId()+".jpg"
      console.log(pictureSrc)

      urltoFile(pictureSrc, pictureName,'image/jpeg')
    .then(function(file){ handleUpload(pictureName,file, setCameraItem);});

      setPicture(pictureSrc)
  }, []);

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
            width={512}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
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
          <Button variant="contained"
            onClick={(e) => {
              e.preventDefault()
              capture()
            }}
            className="btn btn-danger"
          >
            Capture
          </Button>
        )}
      </div>
    </div>
  )
}
export default CameraCapture