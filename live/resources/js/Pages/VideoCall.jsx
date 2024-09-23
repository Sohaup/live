import React, { useRef, useEffect, useState } from 'react';
import Peer from 'peerjs';
import { sendSignal, receiveSignal } from './Ably';

const VideoChat = () => {
  const [peerId, setPeerId] = useState('');
  const [remotePeerId, setRemotePeerId] = useState('');
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerInstance = useRef(null);

  async function listVideoDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    
    videoDevices.forEach(device => {
        console.log(`${device.label} (ID: ${device.deviceId})`);
    });
}

async function startCamera(deviceId) {
    const constraints = {
        video: { deviceId: { exact: deviceId } },
        audio: true
    };

    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoElement.srcObject = stream; // Assuming you have a <video> element in your HTML
    } catch (error) {
        console.error('Error accessing the camera:', error);
    }
}
  return (
    <div>
      <h3>Your Peer ID: {peerId}</h3>
      <button onClick={async () => await listVideoDevices()}>Start Call</button><br/>
      <button onClick={async () => await startCamera('4e7260467ea147095c0c60e0fe9cc2499761bfedafbba4ba81f30907dc8aa6b5')}>test Camera</button>
      <div>
        <video ref={localVideoRef} autoPlay muted playsInline width="300"></video>
        <video ref={remoteVideoRef} autoPlay playsInline width="300"></video>
      </div>
    </div>
  );
};

export default VideoChat;
