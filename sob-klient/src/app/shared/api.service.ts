import { Injectable } from '@angular/core';
import {Demo} from "../models/Demo";
import * as signalR from '@aspnet/signalr';
import {Role} from "../models/role";
import {Propose, ProposeList} from "../models/Propose";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Vote, VotesList} from "../models/Votes";
import {LogsService} from "./logs.service";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, private logsService: LogsService) {
    if(sessionStorage.getItem('role')) this.currentClientRole = Number(sessionStorage.getItem('role'));
    this.currentClientId = Number(sessionStorage.getItem('id'));
  }

  public data: Demo = {servers: []};
  public bradcastedData: Demo = {servers: []};

  // tutaj proposale
  public proposals: ProposeList = {proposes: []};
  public bradcastedProposals: ProposeList = {proposes: []};

  // id które zwraca backend
  public currentClientId: number;
  //public currentClientRole: Role = Role.Client;
  public currentClientRole: number;
  public currentClientAccidentFlag: boolean = false;

  //analogicznie dla logów, albo doda się button aby odświeżyć

  private hubConnection: signalR.HubConnection
  private hubConnectionProposes: signalR.HubConnection

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5001/servers')
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err))
  }

  // jak będą odbierane i wysyłane propozycje

  // public startConnectionForProposes = () => {
  //   this.hubConnectionProposes = new signalR.HubConnectionBuilder()
  //     .withUrl('https://localhost:5001/proposes')
  //     .build();
  //
  //   this.hubConnectionProposes
  //     .start()
  //     .then(() => console.log('Connection started for proposes'))
  //     .catch(err => console.log('Error while starting connection: ' + err))
  // }

  public addTransferChartDataListener = () => {
    this.hubConnection.on('transferserversdata', (data) => {
      this.data = data;
      console.log(data);
    });
  }

  // public addTransferChartDataListenerProposals = () => {
  //   this.hubConnectionProposes.on('transferproposalsdata', (data) => {
  //     this.proposals = data;
  //     console.log(data);
  //   });
  // }

  public broadcastChartData = () => {
    this.hubConnection.invoke('broadcastserversdata', this.data)
      .catch(err => console.error(err));
  }

  public addBroadcastChartDataListener = () => {
    this.hubConnection.on('broadcastserversdata', (data) => {
      this.bradcastedData = data;
    })
  }

  public addWinnerMessageListener = () => {
    this.hubConnection.on('broadcastwinnermessage', (data) => {
      alert(data + 'serverid ' + data.substr(12,2));
      let winnerId = Number(data.substr(12,2));
      this.logsService.addLog('Wybrano nowego lidera o id' + winnerId);
      if(winnerId === this.currentClientId) {
        this.currentClientRole = 0;
        sessionStorage.setItem('role', '0');
      }
    })
  }

  // public broadcastProposalsData = () => {
  //   this.hubConnectionProposes.invoke('broadcastproposalsdata', this.data)
  //     .catch(err => console.error(err));
  // }

  // public addBroadcastProposalDataListener = () => {
  //   this.hubConnectionProposes.on('broadcastproposalsdata', (data) => {
  //     this.bradcastedProposals = data;
  //   })
  // }

  setClientId(id: number) {
    this.currentClientId = id;
    sessionStorage.setItem('id', String(id));
  }

  addVote(vote: Vote) {
    return this.http.post('https://localhost:5001/api/servs/vote', vote);
  }

  getVotes():Observable<VotesList> {
    return this.http.get<VotesList>('https://localhost:5001/api/servs/votes');
  }

  getVotingResult():Observable<string> {
    return this.http.get<string>('https://localhost:5001/api/servs/voting-result');
  }

  getBestProposer(): number {
    let bestServer = -1;
    this.data.servers.forEach(server => {
      if(server.serverId > bestServer) bestServer = server.serverId;
    });
    return bestServer;
  }

  addLeaderDestroyedListener() {
    this.hubConnection.on('broadcastleaderdestroyedmessage', (data) => {
      alert(data);
      this.logsService.addLog('Bieżący lider usunięty!');
    })
  }
}
