import * as signalR from '@microsoft/signalr';
import axios from '../utils/axios';
import { DataUpdate } from '../models';
import { useEffect, useState } from 'react';

function Lab() {
  // const [ connection, setConnection ] = useState<signalR.HubConnection>(null!);
  const [labData, setLabData] = useState<DataUpdate[]>([]);

  useEffect(() => {
    function updateData(data: DataUpdate) {
      console.log('Update received', data);
      setLabData([data, ...labData]);
    }

    // Update the document title using the browser API
    const connection = new signalR.HubConnectionBuilder()
      // TODO: get base URL from env file
      .withUrl("http://localhost:5036/lab")
      .build();

    connection.on('updateReceived', updateData);

    connection.start().catch((err) => console.error(err));

    return function disconnectFromHub() {
      connection.stop();
    }
  });

  return (


    <div>
      <h1 className='text-2xl text-center'>Lab</h1>
      <div>
        {labData.map((d) => (
          <div>{d.device}: {d.value}</div>
        ))}
      </div>
    </div>
  )
};

export default Lab;
