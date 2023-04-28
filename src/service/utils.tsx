import { DefaultEventsMap } from '@socket.io/component-emitter';
import io, {Socket} from 'socket.io-client';
import {RequestType} from "../types/request.type";

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

    const serverUrl= "http://localhost:5000"
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


export function handleBackEndOperation (operation:string,params:Record<string, string>, imgId:string, socket: Socket<DefaultEventsMap, DefaultEventsMap>, setCallback: (arg0: any[]) => void){
    const newRequest:RequestType = {} as RequestType

    newRequest.operation_parameters = params
    newRequest.operation= operation
    // these are never used in the backend, there we only use file_id which is in the parameters
    newRequest.image_id=imgId   //Need this so that different requests are different from each other, otherwise useless

    socket?.emit("request/new",JSON.stringify(newRequest),(response: string | { [x: string]: any; }[], result: any) => {
        if (typeof response === "string") {
            response = JSON.parse(response);
            console.log(`Front: Request ${JSON.stringify(newRequest)} ${result}`)
              // @ts-ignore
            if (response["operation"] == "deepfake") {
                alert("Your Deepfakes are ready ! Use the Slidebar to go back to previous page and insepct them!");
                (async () => {
                  // Not sure why but I need this loop. Otherwise the code breaks
                  for (let i = 0; i < 4; i++) {
                    // We generate 4 deepfakes to display them in the frontend
                    // @ts-ignore
                      let response_download = await handleDownload(response[i]["image_id"]);
                    setCallback([response_download?.data]);
                  }
                })();
              };
        }

    })
    // console.log(JSON.stringify(newRequest))
    // console.log(`Operation definition : ops[${operation}] with parameters ${JSON.stringify(params)}`)
  }