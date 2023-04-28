import React, { useState } from 'react'
import Webcam from 'react-webcam'
import Button from '@mui/material/Button';

import {handleConnect} from "../service/utils";

import {handleUpload} from '../service/firebase'
import {genUniqueId, urltoFile} from "../service/utils";
//const WebcamComponent = () => <Webcam />
const videoConstraints = {
  width: 512,
  height: 512,
  facingMode: 'user',
}
// @ts-ignore
const CameraCapture = ({setCamera}) => {
  const [picture, setPicture] = useState('')


  const webcamRef = React.useRef(null)

  const capture = React.useCallback(() => {
    // @ts-ignore
      const pictureSrc = webcamRef.current.getScreenshot()
      const pictureName = genUniqueId()+".png"
      //console.log(pictureSrc)

      urltoFile(pictureSrc, pictureName,'image/png')
    .then(function(file){ handleUpload(pictureName,file, setCamera);});

    const scale = 7.5
    const num_steps = 10
    const seed = 20
    const prompt = "A man playing football"
    const immunize = false
    /*fetch("https://sghamizi-photoguard.hf.space/run/submit", {
	method: "POST",
	headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            data: [
                pictureSrc,
                prompt,
                seed,
                scale,
                seed,
                immunize,
            ]
        })
    }).then(function(response){console.log(response); })
*/

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
            screenshotFormat="image/png"
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