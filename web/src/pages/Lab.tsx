import * as signalR from '@microsoft/signalr';
import { DataUpdate } from '../models';
import { useEffect, useState } from 'react';
import { ApiBase } from '../utils/axios';
import Countdown, { zeroPad, calcTimeDelta, formatTimeDelta } from 'react-countdown';

interface InputItem {
  id: string;
  text: string;
  color: string;
}

interface ControlGroup {
  id: string;
  // text: string;
  locked: boolean;
}

interface ControlGroups {
  [k: string]: ControlGroup;
}

function Lab() {
  const [labData, setLabData] = useState<DataUpdate[]>([]);
  const [connection, setConnection] = useState<signalR.HubConnection>(null!);
  const [groups, setGroups] = useState<ControlGroups>({
    gifs: { id: 'gifs', locked: true },
    sounds: { id: 'sounds', locked: true }
  });

  const sounds: InputItem[] = [
    { id: 'thank-you', text: 'Thank you', color: 'yellow' },
    { id: 'oh-boy', text: 'Oh boy', color: 'red' },
    { id: 'giggle', text: 'Laughing', color: 'purple' },
    { id: 'all-day', text: "I won't give up.", color: 'green' },
    { id: 'roger-roger', text: 'Roger roger', color: 'orange' },
    { id: 'singing', text: 'Singing', color: 'pink' }
  ];

  const gifs: InputItem[] = [
    { id: 'happy', text: 'Happy 😃', color: 'red' },
    { id: 'fireworks', text: 'Fireworks 🎆', color: 'pink' },
    { id: 'friends', text: 'Friends 🤗', color: 'yellow' },
    { id: 'this', text: 'This', color: 'green' },
    { id: 'that', text: 'That', color: 'orange' },
    { id: 'the other', text: 'The other', color: 'purple' }
  ];

  useEffect(() => {
    // Update the document title using the browser API
    const conn = new signalR.HubConnectionBuilder()
      // TODO: get base URL from env file
      .withUrl(`${ApiBase}hubs/lab`)
      .build();

    setConnection(conn);

    conn.on('updateReceived', (data: DataUpdate) => {
      console.log('Update received', data);
      setLabData(d => [data, ...d]);
    });

    conn.on('groupControlGranted', (groupId: string) => {
      const group = { ...groups[groupId] };
      group.locked = false;
      setGroups(g => {
        return {
          ...g,
          [groupId]: group
        }
      });
    });

    conn.on('groupControlRescinded', (groupId: string) => {
      const group = { ...groups[groupId] };
      group.locked = true;
      setGroups(g => {
        return {
          ...g,
          [groupId]: group
        }
      });
    });
    
    conn.start().catch((err) => console.error(err));

    return function disconnectFromHub() {
      conn.stop();
    }
  }, []);

  const sendDeviceInput = (device: string, value: string) => {
    console.log('device', device, 'value', value);
  }

  const requestGroupControl = (locked: boolean, groupId: string) => {
    if (locked) {
      // only request control if currently locked
      connection.invoke('RequestGroupControl', groupId);
    }
  }

  return (
    <div>
      <h1>Lab</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 lab-grid">
        <div className='max-h-72 overflow-y-auto'>
          {labData.map((d) => (
            <div key={d.value}>{d.device}: {d.value}</div>
          ))}
        </div>
        <div onClick={() => requestGroupControl(groups.sounds.locked, 'sounds')} className={`px-2${groups.sounds.locked ? ' locked' : ''}`}>
          <h3>Sound board</h3>
          {sounds.map((s) => (
            <button key={s.id} onClick={() => sendDeviceInput('sounds', s.id)}
              className='block py-4 mb-1 w-full' style={{ backgroundColor: s.color }}>{s.text}</button>
          ))}
        </div>
        <div onClick={() => requestGroupControl(groups.gifs.locked, 'gifs')} className={`px-2${groups.gifs.locked ? ' locked' : ''}`}>
          <h3>GIF board</h3>
          <div className='text-white'>
            {gifs.map((g) => (
              <button key={g.id} onClick={() => sendDeviceInput('gifs', g.id)}
                className='block py-4 mb-1 w-full' style={{ backgroundColor: g.color }}>{g.text}</button>
            ))}
          </div>
        </div>
        <div>
          TODO: 10DoF sensor values
        </div>
        <div>
          {/* 1659713400000   */}
          <Countdown date={new Date(1659648600000)}
            renderer={({ hours, minutes, seconds, completed }) => {
              if (completed) {
                return <em>Fin</em>;
              }
              return <span>{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}</span>;
            }} />
        </div>
      </div>

      <div>

      </div>
    </div>
  )
};

export default Lab;
