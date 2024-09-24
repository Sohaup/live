import React, { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import { ablyChannel } from './Ably';

const VideoChat = ({ user }) => {
  const [peerId, setPeerId] = useState('');
  const [remotePeerId, setRemotePeerId] = useState('');
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerInstance = useRef(null);
  const localStreamRef = useRef(null);

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
        localStreamRef.current = stream; // Save local stream reference
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
      localStreamRef.current = stream; // Save local stream reference
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

  // Function to start screen sharing
  const shareScreen = () => {
    navigator.mediaDevices.getDisplayMedia({ video: true }).then((screenStream) => {
      setIsSharingScreen(true);
      const videoTrack = screenStream.getVideoTracks()[0];

      // Replace the video track in the current stream with the screen sharing track
      const sender = peerInstance.current.connections[remotePeerId][0].peerConnection.getSenders().find(s => s.track.kind === 'video');
      sender.replaceTrack(videoTrack);

      // Show the screen in the local video element
      localVideoRef.current.srcObject = screenStream;

      // Handle stopping screen share
      videoTrack.onended = () => {
        stopScreenShare();
      };
    });
  };

  // Function to stop screen sharing and switch back to the webcam
  const stopScreenShare = () => {
    if (localStreamRef.current) {
      setIsSharingScreen(false);

      // Replace the screen sharing track with the original webcam track
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      const sender = peerInstance.current.connections[remotePeerId][0].peerConnection.getSenders().find(s => s.track.kind === 'video');
      sender.replaceTrack(videoTrack);

      // Switch the video element back to the webcam stream
      localVideoRef.current.srcObject = localStreamRef.current;
    }
  };

  // Function to toggle audio on/off
  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  return (
    <div>
      <div>
        <h3>Your Peer ID: {peerId}</h3>
        <h4>User name: {user.name}</h4>
        <input
          type="text"
          placeholder="Remote Peer ID"
          value={remotePeerId}
          onChange={(e) => setRemotePeerId(e.target.value)}
        />
        <button onClick={callPeer}>Call</button>
        <button onClick={isSharingScreen ? stopScreenShare : shareScreen}>
          {isSharingScreen ? 'Stop Sharing Screen' : 'Share Screen'}
        </button>
        <button onClick={toggleAudio}>
          {isAudioEnabled ? 'Mute' : 'Unmute'} Audio
        </button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <video ref={localVideoRef} style={{ width: '45%' }} />
        <video ref={remoteVideoRef} style={{ width: '45%' }} />
      </div>
    </div>
  );
};

export default VideoChat;
