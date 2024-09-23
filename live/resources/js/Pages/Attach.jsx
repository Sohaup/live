
import { useRoom } from '@ably/chat/react';


const MyComponent = () => {
  const { attach } = useRoom();
  return (
    <div>
      <button onClick={attach}>Attach Me!</button>
    </div>
  );
};

export default MyComponent;