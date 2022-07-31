import * as signalR from '@microsoft/signalr';
import axios from '../utils/axios';
import { DataUpdate } from '../models';
import { useEffect } from 'react';

function Lab() {
  axios.get('weatherforecast').then(d => console.log('weather data', d));

  useEffect(() => {
    // Update the document title using the browser API
    const connection = new signalR.HubConnectionBuilder()
      // TODO: get base URL from env file
      .withUrl("http://localhost:5036/lab")
      .build();

    connection.on("updateReceived", (update: DataUpdate) => {
      console.log('Update received', update)
    });

    connection.start().catch((err) => console.error(err));

    return function disconnectFromHub() {
      connection.stop();
    }
  });


  return (


    <div>
      <h1 className='text-2xl text-center'>Lab</h1>
    </div>
  )
};

export default Lab;
