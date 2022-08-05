import * as signalR from '@microsoft/signalr';
import { DataUpdate } from '../models';
import { useEffect, useState } from 'react';
import { ApiBase } from '../utils/axios';
import Countdown, { zeroPad, calcTimeDelta, formatTimeDelta } from 'react-countdown';

interface ControlRequest {
  id: number;
  time: string;
  group: string;
  /** SignalR connection ID of the requestor */
  connection: string;
  user: string;
  /** User's name. Not always known. */
  name?: string;
}

interface InputRequest extends ControlRequest {
  value: string;
}

function ControlPanel() {
  const [controlRequests, setControlRequests] = useState<ControlRequest[]>([]);
  const [inputRequests, setInputRequests] = useState<InputRequest[]>([]);
  const [connection, setConnection] = useState<signalR.HubConnection>(null!);

  useEffect(() => {
    const conn = new signalR.HubConnectionBuilder()
      .withUrl(`${ApiBase}hubs/lab`)
      .withAutomaticReconnect()
      .build();

    setConnection(conn);

    conn.on('inputApprovalRequested', (group: string, value: string, user: string, connectionId: string, name: string) => {
      const id = Math.floor(Math.random() * 10000);
      setInputRequests(r => [{
        id,
        group,
        name,
        user,
        value,
        connection: connectionId,
        time: new Date().toLocaleTimeString()
      }, ...r]);
    });

    conn.on('groupControlRequested', (group: string, user: string, connectionId: string, name: string) => {
      const id = Math.floor(Math.random() * 10000);
      setControlRequests(r => [{
        id,
        group,
        name,
        user,
        connection: connectionId,
        time: new Date().toLocaleTimeString()
      }, ...r]);
    });

    conn.start().catch((err) => console.error(err));

    return function disconnectFromHub() {
      conn.stop();
    }
  }, []);

  const grantGroupControl = (groupId: string, userId: string, connectionId: string) => {
    connection.invoke('GrantGroupControl', groupId, connectionId, userId);
  }

  const approveInput = (groupId: string, value: string) => {
    connection.invoke('DeviceInputCommand', groupId, value);
  }
  
  return (
    <div>
      <h1>Control Panel</h1>
      <div className="grid grid-cols-2">
        <div>
          <h2>Control Requests</h2>
          <div className='max-h-72 overflow-y-auto'>
            {controlRequests.map((r) => (
              <div key={r.id} className='mb-2'>
                {r.time}: {r.name || r.user} requested {r.group}.
                <button className='border p-2 ml-4 bg-blue-100' onClick={() => { grantGroupControl(r.group, r.user, r.connection) }}>Give control</button>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2>Input Requests</h2>
          <div className='max-h-72 overflow-y-auto'>
            {inputRequests.map((r) => (
              <div key={r.id} className='mb-2'>
                {r.time}: {r.name || r.user} requested {r.group}: {r.value}.
                <button className='border p-2 ml-4 bg-blue-100' onClick={() => { approveInput(r.group, r.value) }}>Approve</button>
              </div>
            ))}
          </div></div>
      </div>

    </div>
  )
};

export default ControlPanel;
