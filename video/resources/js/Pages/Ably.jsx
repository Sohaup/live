import * as Ably from 'ably';

const ably = new Ably.Realtime({ key: 'l-agwA.v4aTzQ:oxk4w59_mEClLAtgPjBO-9ZrsTbw0dYYY0jorYn7x9U'});

export const ablyChannel = ably.channels.get('chat-room');

export default ably;
