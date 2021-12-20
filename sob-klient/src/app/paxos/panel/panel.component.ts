import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../shared/api.service";
import {HttpClient} from "@angular/common/http";
import {Role} from "../../models/role";
import {ServerLog} from "../../models/ServerLog";

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {

  // get client id from api

  connectionStarted: boolean = false;
  logs: ServerLog[] = [];

  constructor(public signalRService: ApiService, private http: HttpClient) { }

  ngOnInit(): void {
    this.signalRService.startConnection();
    //this.getLogs();
    this.signalRService.addTransferChartDataListener();
    this.signalRService.addBroadcastChartDataListener();
    this.startHttpRequest();
  }

  private startHttpRequest = () => {
    this.http.get('https://localhost:5001/api/servers')
      .subscribe(res => {
        console.log(res);
      })
  }

  public addServer = () => {
    this.signalRService.broadcastChartData();
    this.connectionStarted = true;
    this.http.post('https://localhost:5001/api/servs/add', {})
      .subscribe(res => {
        console.log(res);
        // get id from api
        // @ts-ignore
        this.signalRService.setClientId(res.serverId);
        // @ts-ignore
        this.signalRService.currentClientRole = res.role;
      })
  }

  addProposition() {
    // after response
    this.http.patch('https://localhost:5001/random-leader', {})
      .subscribe(res => {
        this.signalRService.proposals.proposes.push({serverId: 66}); //example
        console.log(res);
        // @ts-ignore
        if(res !== 'Leader already exists!') {
          this.signalRService.currentClientRole = 0;
        }
      })
    //this.signalRService.currentClientRole = Role.Proposer;
    //this.signalRService.proposals.proposes.push({serverId: 66}); //example
    // this.http.post('https://localhost:5001/api/servs', {serverId: this.signalRService.currentClientId})
    //   .subscribe(res => {
    //     console.log(res);
    //     // nothing special to get in response
    //   });
  }

  acceptProposal() {

  }

  hasRole(role:Role) {
    if(role === Role.Proposer) return false;
    else return true;
  }

  simulateAccident() {
    // symuluje awarie
    this.signalRService.currentClientAccidentFlag = true;
    // żądanie na serwer aby zmienił lidera
  }

  // gdybyśmy zostali przy pobieraniu logów bez singnalR
  // private getLogs() {
  //   this.http.get('https://localhost:5001/api/logs')
  //     .subscribe(res => {
  //       console.log(res);
  //       this.logs = res;
  //     })
  // }
}
