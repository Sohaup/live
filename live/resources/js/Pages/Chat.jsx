import {ChatClientProvider , ChatRoomProvider} from '@ably/chat/react'
import * as Ably from 'ably'
import {LogLevel , RoomOptionsDefaults} from '@ably/chat'
import {ChatClient} from '@ably/chat'
import {useRoom} from '@ably/chat/react'
import { useEffect, useState } from 'react'
import {useMessages} from '@ably/chat/react'
import {useChatClient} from '@ably/chat/react'
import {usePresenceListener} from '@ably/chat/react'



export default function Room({user}) {
  const client = new Ably.Realtime({key:'S5zMbw.YY5GAg:JN8XBuUNnhePSOPBItLs2Hk05KQ9kKqKINTczhdq16U' , clientId:`${user.id}`})
  const roomClient = new ChatClient(client)
  const ablyChannel = client.channels.get('chat-room');
  const [newMessage , setNewMessage] = useState('');
  const [messages , setMessages] = useState([])
  
 
 
  return (
   <ChatClientProvider client={roomClient}>
    <ChatRoomProvider id='live-room' options={RoomOptionsDefaults}>
        <RoomMessage/>
    </ChatRoomProvider>
   </ChatClientProvider>
  )
}


function RoomMessage() {
    const [message , setMessage] = useState([])
    const [content , setContent] = useState('')
    const {presense , error} = usePresenceListener({
        listener:(data)=>{
            console.log(data)
        }
    })
   //const messeges = []
    const {send} = useMessages({
        listener:(message)=>{
            console.log(message);
             //messeges.push(message.message.text)
            setMessage((prevMessages)=> [...prevMessages , message.message.text])
        }
    })
    function sendMessage(e) {
        e.preventDefault()
        send({text:content})
    }
    
    return (
        <div>
           <form onSubmit={sendMessage}>
            <input type='text' value={content} onChange={(e)=>setContent(e.target.value)}/>
            <button type='submit'> Send Message </button>
           </form>

           <div>
            {message.map((message , index) => <p key={index}>{message}</p>)}
           </div>

          
        </div>
    )
}