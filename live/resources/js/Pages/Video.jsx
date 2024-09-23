import React, { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import { ablyChannel } from './Ably';

const VideoChat = ({user}) => {
  const [peerId, setPeerId] = useState('');
  const [remotePeerId, setRemotePeerId] = useState('');
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerInstance = useRef(null);

  useEffect(() => {
    // Create a PeerJS peer instance
    const peer = new Peer();

    // Store the peer instance in a ref
    peerInstance.current = peer;

    // When the peer connects to the PeerJS signaling server
    peer.on('open', (id) => {
      console.log('My peer ID is: ' + id);
      setPeerId(id);

      // Listen for real-time signaling from Ably
      ablyChannel.subscribe('signal', (msg) => {
        const { signal, from } = msg.data;
        if (from !== id) {
          // Handle incoming signal
          peer.signal(signal);
        }
      });
    });

    // Handle incoming call
    peer.on('call', (call) => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play();

        // Answer the call and send your video stream
        call.answer(stream);

        // Receive remote stream and display it
        call.on('stream', (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play();
        });
      });
    });

    return () => {
      peer.destroy();
    };
  }, []);

  // Function to initiate a call
  const callPeer = () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      localVideoRef.current.srcObject = stream;
      localVideoRef.current.play();

      // Call the remote peer
      const call = peerInstance.current.call(remotePeerId, stream);

      // Receive remote stream and display it
      call.on('stream', (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play();
      });

      // Send signaling information via Ably
      ablyChannel.publish('signal', { signal: call.peerConnection.localDescription, from: peerId });
    });
  };

  return (
    <div>
      <div>
        <h3>Your Peer ID: {peerId}</h3>
        <h4>user name is : {user.name}</h4>
        <input
          type="text"
          placeholder="Remote Peer ID"
          value={remotePeerId}
          onChange={(e) => setRemotePeerId(e.target.value)}
        />
        <button onClick={callPeer}>Call</button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <video ref={localVideoRef} style={{ width: '45%' }} />
        <video ref={remoteVideoRef} style={{ width: '45%' }} />
      </div>
    </div>
  );
};

export default VideoChat;
