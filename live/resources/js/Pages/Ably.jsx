// Ably.js
import * as Ably from 'ably';

const ably = new Ably.Realtime({ key: 'S5zMbw.YY5GAg:JN8XBuUNnhePSOPBItLs2Hk05KQ9kKqKINTczhdq16U'});

export const ablyChannel = ably.channels.get('chat-room');

export default ably;


export const sendSignal = (message) => {
  ablyChannel.publish('signal', message);
};

export const receiveSignal = (callback) => {
  ablyChannel.subscribe('signal', (msg) => {
    callback(msg.data);
  });
};




// ChatRoom.js
/*import React, { useState, useEffect } from 'react';
import { ablyChannel } from './Ably';

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Listen for new messages
  useEffect(() => {
    const messageHandler = (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg.data]);
    };

    ablyChannel.subscribe('message', messageHandler);
    
    // Clean up subscription on component unmount
    return () => {
      ablyChannel.unsubscribe('message', messageHandler);
    };
  }, []);

  // Send a message
  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() !== '') {
      ablyChannel.publish('message', { text: newMessage });
      setNewMessage('');  // Clear input after sending
    }
  };

  return (
    <div>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index}>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatRoom;*/

// App.js
/*import React from 'react';
import './App.css';
import ChatRoom from './ChatRoom';

function App() {
  return (
    <div className="App">
      <h1>Ably Chat Room</h1>
      <ChatRoom />
    </div>
  );
}

export default App;
*/


/*

// VideoChat.js
import React, { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import { ablyChannel } from './Ably';

const VideoChat = () => {
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
*/