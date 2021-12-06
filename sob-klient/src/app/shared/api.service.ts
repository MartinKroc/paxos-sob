import { Injectable } from '@angular/core';
import {Demo} from "../models/Demo";
import * as signalR from '@aspnet/signalr';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public data: Demo[];
  public bradcastedData: Demo[];

  private hubConnection: signalR.HubConnection

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5001/servers')
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err))
  }

  public addTransferChartDataListener = () => {
    this.hubConnection.on('transferserversdata', (data) => {
      //this.data = data;
      console.log(data);
    });
  }

  public broadcastChartData = () => {
    const data = this.data.map(m => {
      const temp = {
        servers: m.servers
      }
      return temp;
    });

    this.hubConnection.invoke('broadcastserversdata', data)
      .catch(err => console.error(err));
  }

  public addBroadcastChartDataListener = () => {
    this.hubConnection.on('broadcastserversdata', (data) => {
      this.bradcastedData = data;
    })
  }
}
