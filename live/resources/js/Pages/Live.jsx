import * as Ably from 'ably'
import {AblyProvider , ChannelProvider , useChannel , useConnectionStateListener} from 'ably/react'
import { useState } from 'react'
const client = new Ably.Realtime({key:'S5zMbw.YY5GAg:JN8XBuUNnhePSOPBItLs2Hk05KQ9kKqKINTczhdq16U'})

function LiveDisplay() {
    const [message , setMessage] = useState([])
    useConnectionStateListener('connected' , ()=>{
        console.log('Connected To Ably Successfuly');
    })
    const channel = useChannel('connect' , (message)=>{
        setMessage(previosMessage => [...previosMessage , message]);
        console.log(message)
        
    })
    return (
        <div>
        <button onClick={() => { channel.publish('first', 'Here is my first message!') }}>
          Publish
        </button>
        {
          message.map(message => {
            return <p key={message.id}>{message.data}</p>
          })
        }
      </div>
    )
}
export default function Live() {
return (
    <AblyProvider client={client}>
        <ChannelProvider channelName='connect'>
            <LiveDisplay/>
        </ChannelProvider>
    </AblyProvider>
)
}