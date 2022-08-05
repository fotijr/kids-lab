import * as signalR from '@microsoft/signalr';
import { DataUpdate } from '../models';
import { useEffect, useState } from 'react';
import { ApiBase } from '../utils/axios';
import Countdown, { CountdownRenderProps, zeroPad } from 'react-countdown';

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
  const [avgAge, setAvgAge] = useState('0');
  const [userCount, setUserCount] = useState(1);
  const [labAttendance, setLabAttendance] = useState(1);
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
    { id: 'groot', text: 'Dancing', color: 'green' },
    { id: 'that', text: 'That', color: 'orange' },
    { id: 'the other', text: 'The other', color: 'purple' }
  ];

  useEffect(() => {
    const conn = new signalR.HubConnectionBuilder()
      .withUrl(`${ApiBase}hubs/lab`)
      .withAutomaticReconnect()
      .build();

    setConnection(conn);

    conn.on('updateReceived', (data: DataUpdate) => {
      if (data.device == 'users') {
        setUserCount(+data.value);
      } else if (data.device == 'lab-users') {
        setLabAttendance(+data.value);
      } else if (data.device == 'age') {
        setAvgAge(data.value);
      }

      console.log('Update received', data);
      data.id = Math.floor(Math.random() * 50000);
      setLabData(d => [data, ...d.slice(0, 200)]); //slice limits the log to most recent 200 entries
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

  const sendDeviceInput = (group: string, value: string) => {
    connection.invoke('DeviceInputCommand', group, value);
  }

  const requestInputApproval = (groupId: string, value: string) => {
    connection.invoke('RequestInputApprovalControl', groupId, value);
  }

  const requestGroupControl = (locked: boolean, groupId: string) => {
    if (locked) {
      // only request control if currently locked
      connection.invoke('RequestGroupControl', groupId);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    for (const pair of formData.entries()) {
      requestInputApproval(pair[0], pair[1].toString());
    }
    console.log(form, formData, formData.entries(), formData.get('say'));

    form.reset();
  };

  const timeFormatter = ({ hours, minutes, seconds, completed }: CountdownRenderProps) => {
    if (completed) {
      return <em>Fin</em>;
    }
    return <span>{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}</span>;
  }

  return (
    <div>
      <h1>Lab</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 lab-grid">
        <div>
          <h3>Total users</h3>
          <div className='text-center text-6xl'>
            {userCount}
          </div>
        </div>
        <div>
          <h3>People in the lab</h3>
          <div className='text-center text-6xl'>
            {labAttendance}
          </div>
        </div>
        <div>
          <h3>Average age</h3>
          <div className='text-center'>
            <span className='text-6xl'>{avgAge}</span> years old
          </div>
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
          <h3>Log</h3>
          <div className='font-mono max-h-72 overflow-y-auto'>
            {labData.map((d) => (
              <div key={d.id}>{d.device}: {d.value}</div>
            ))}
          </div>
        </div>
        <div>
          <h3>Say it!</h3>
          <div>
            <form onSubmit={(e) => { handleSubmit(e) }}>
              <div className='mb-4'>
                <input
                  className="bg-gray-50 appearance-none border-2 border-gray-100 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                  name="say"
                  type="text"
                  placeholder='Hello, world!'
                  required
                />
              </div>
              <div className='text-center'>
                <input type="submit" value="Send" className="border px-16 py-3 my-2" />
              </div>
            </form>
          </div>
        </div>
        <div>
          <h3>Lab closes in</h3>
          <div className='text-center text-4xl'>
            <Countdown date={new Date(1659713400000)}
              renderer={timeFormatter} />
          </div>
        </div>
      </div>

      <div>

      </div>
    </div>
  )
};

export default Lab;
