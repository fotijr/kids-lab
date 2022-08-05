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
}

function ControlPanel() {
  const [requests, setRequests] = useState<ControlRequest[]>([]);
  const [connection, setConnection] = useState<signalR.HubConnection>(null!);

  useEffect(() => {
    // Update the document title using the browser API
    const conn = new signalR.HubConnectionBuilder()
      // TODO: get base URL from env file
      .withUrl(`${ApiBase}hubs/lab`)
      .build();

    setConnection(conn);

    conn.on('groupControlRequested', (group: string, user: string, connectionId: string) => {
      const id = Math.floor(Math.random() * 10000);
      setRequests(r => [{
        id,
        group,
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

  return (
    <div>
      <h1>Control Panel</h1>
      <h2>Requests</h2>
      <div className='max-h-72 overflow-y-auto'>
        {requests.map((r) => (
          <div key={r.id} className='mb-2'>
            {r.time}: {r.user} requested {r.group}.
            <button className='border p-2' onClick={() => { grantGroupControl(r.group, r.user, r.connection) }}>Give control</button>
          </div>
        ))}
      </div>
    </div>
  )
};

export default ControlPanel;
