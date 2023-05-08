import { DefaultEventsMap } from '@socket.io/component-emitter';
import io, {Socket} from 'socket.io-client';
import {RequestType} from "../types/request.type";
import axios from "axios";

const backend:string = " http://localhost:5001/"//"http://10.186.114.36:5001/"

export function genUniqueId(): string {
    const dateStr = Date
        .now()
        .toString(36); // convert num to base 36 and stringify

    const randomStr = Math
        .random()
        .toString(36)
        .substring(2, 8); // start at index 2 to skip decimal point

    return `${dateStr}-${randomStr}`;
}

export function urltoFile(url: string, filename: string, mimeType: string) {
    return (fetch(url)
            .then(function (res) {
                return res.arrayBuffer();
            })
            .then(function (buf) {
                return new File([buf], filename, {type: mimeType});
            })
    );
}

export function handleConnect (setServerMessage: (arg0: string) => void, setConnected: (arg0: boolean) => void, setSocket: (arg0: Socket<DefaultEventsMap, DefaultEventsMap>) => void)  {
    /*
    Establishes connection with the Backend & contains client endpoints
    */

    const serverUrl= "http://10.186.114.36:5005"
    const _socket = io(serverUrl);

    _socket.on("connect_error", (err) => {
      console.log(`CONNECTION ERROR to ${serverUrl} reason : ${err}`);
      _socket.close();
      setServerMessage(err.message);
      setConnected(false);
    })

    _socket.on("connect", () => {
        console.log(_socket.id); // x8WIv7-mJelg7on_ALbx
        setConnected(true);
        setSocket(_socket);
        setServerMessage("Front: Server connected");
    });

    _socket.on("error", (err) => {
      console.log(err);
      setServerMessage(err);
    });

    _socket.on("requestReceived", () => {
      console.log("Front: Request received");
      setServerMessage("Front: Request received");
    });

    _socket.on("error_request", (err) => {
      console.log(err.data);
      setServerMessage(err.data);
    });

    _socket.on("result", (res) => {
      setServerMessage(res.data);
      console.log(res.data);
    });

  };

export function handleDisconnect (socket: Socket<DefaultEventsMap, DefaultEventsMap>, setConnected: (arg0: boolean) => void) {
    socket?.disconnect()
    setConnected(false)
};

async function file_check(file_name: string, setFunction: any){
    /*
    Function checks a file for existence in the Google Cloud Storage bucket.
    Returns a tuple of (code: int, token: str), where code is the HTTP status code returned by the GET request, and token is the download token of the file if it exists in the bucket.
    If the file does not exist in the bucket, the token will be an empty string.
    :param file_name: The name of the file to be checked
    :return: tuple of int and string
    */
    const bucket_name = "svalinn-partnership-demo.appspot.com"
    const gs_url = `https://firebasestorage.googleapis.com/v0/b/${bucket_name}/o`
    const url =  `${gs_url}/${file_name}`;
    console.log(url)
    let messagelist: string[] = [];

    const file_extension = file_name.split(".")[0].split("_")[2]
    if (file_extension=="imm"){
      messagelist.push("The immunization is done ! Use the Slidebar to go back to the last page and inspect it's outcome!")
      messagelist.push("Error while immunizaing immage!")
    } else {
      messagelist.push("Your Deepfakes are ready ! Use the Slidebar to go back to previous page and inspect them!")
      messagelist.push("Error while generating deepfake!" )
    }

    axios.get(url).then((response) => {
      console.log(`Response stauts ${response.status}`)
      if (response.status == 200){
        alert(messagelist[0]);
        setFunction(true)
      } else {
        alert(messagelist[1])
        setFunction(false)
      }
    }).catch(err => console.log("Axios err: ", err))
};

export function handleBackEndOperation (
                                          operation:string,params:Record<string, string>,
                                          imgId:string, socket: Socket<DefaultEventsMap, DefaultEventsMap>,
                                          setCallback: (arg0: any[]) => void,
                                          setDeepfakeDone: any,
                                          setImmunizationDone: any,
                                        ){

    const newRequest:RequestType = {} as RequestType

    newRequest.operation_parameters = params
    newRequest.operation= operation
    // these are never used in the backend, there we only use file_id which is in the parameters
    newRequest.image_id=imgId   //Need this so that different requests are different from each other, otherwise useless

    socket?.emit("request/new",JSON.stringify(newRequest),(response: string | { [x: string]: any; }[], result: any) => {
      if (typeof response === "string") {
        const response_JSON = JSON.parse(response);
        //console.log(`Front: Request ${JSON.stringify(newRequest)} ${result}`)
        if (response_JSON.operation == "deepfake") {

          //check if deepfake generation succesful
          file_check(response_JSON["image_id"].split(".")[0] + "_drug.png", setDeepfakeDone)

          // TODO: Immediately start immunization
          if (false) {
            const operation ="immunization";
            const params = {"attack_name":"diffusionAttack","file_id":response_JSON["image_id"]};
            handleBackEndOperation(operation, params, response_JSON["image_id"], socket, setCallback, setDeepfakeDone, setImmunizationDone)

            // check if immunization succesful
            file_check(response_JSON["image_id"].split(".")[0] + "_imm.png", setImmunizationDone)
          };
        };

        // this is here to manually start the immunization with the button in the immunization tab
        if (response_JSON["operation"] == "immunization"){
          file_check(response_JSON["image_id"].split(".")[0] + "_imm.png", setImmunizationDone)
        };
        //setCallback([response_download?.data]);

      }
    })
    // console.log(JSON.stringify(newRequest))
    // console.log(`Operation definition : ops[${operation}] with parameters ${JSON.stringify(params)}`)
  }


  function postBackEnd(operation:string, params:Record<string, string>, setCallback: (arg0: Promise<any>) => void){
    fetch(backend+"/request/new", {
	method: "POST",
	headers: { "Content-Type": "application/json" },
        body: JSON.stringify({"operation":operation, "operation_parameters":params})
    }).then(function(response){
        console.log(response);
        setCallback(response.json());
    })
  }

  export async function launchDeepFake(file_id:string, setCallback: (arg0: Promise<any>) => void){
    postBackEnd("deepfake", {"file_id":file_id,"attack_name":"gambling"}, setCallback)
    await new Promise(r => setTimeout(r, 150*1000));
    postBackEnd("deepfake", {"file_id":file_id,"attack_name":"arrest"}, setCallback)
    await new Promise(r => setTimeout(r, 150*1000));
    postBackEnd("deepfake", {"file_id":file_id,"attack_name":"drug"}, setCallback)
  }