import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../shared/api.service";
import {HttpClient} from "@angular/common/http";
import {Role} from "../../models/role";
import {ServerLog} from "../../models/ServerLog";
import {Vote, VotesList} from "../../models/Votes";

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {

  // get client id from api

  connectionStarted: boolean = false;
  logs: ServerLog[] = [];
  votes: Vote[] = [];
  votingResult: string;
  voteToAdd: Vote = {
    serverId: this.signalRService.currentClientId,
    value: this.signalRService.getBestProposer()
  };

  constructor(public signalRService: ApiService, private http: HttpClient) { }

  ngOnInit(): void {
    this.signalRService.startConnection();
    //this.getLogs();
    this.getVotes();
    this.getLeader();
    this.signalRService.addTransferChartDataListener();
    this.signalRService.addBroadcastChartDataListener();
    this.signalRService.addWinnerMessageListener();
    this.startHttpRequest();
  }

  getVotes() {
    this.signalRService.getVotes().subscribe(res => {
      // @ts-ignore
      this.votes = res;
      console.log(res);
    });
  }

  getLeader() {
    this.signalRService.getVotingResult().subscribe(res => {
      this.votingResult = res;
      this.logs.push({message: res});
      console.log(res);
    })
  }

  acceptProposal() {
    let val = {serverId: this.signalRService.currentClientId, value: this.signalRService.getBestProposer()};
    console.log(val);
    this.signalRService.addVote(val).subscribe(res => {
      console.log('ok')
    });
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
        // @ts-ignore
        localStorage.setItem('role', res.role);
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
          localStorage.setItem('role', '0');
        }
      }, error => {
        alert('Istnieje już inny lider!');
      });
    //this.signalRService.currentClientRole = Role.Proposer;
    //this.signalRService.proposals.proposes.push({serverId: 66}); //example
    // this.http.post('https://localhost:5001/api/servs', {serverId: this.signalRService.currentClientId})
    //   .subscribe(res => {
    //     console.log(res);
    //     // nothing special to get in response
    //   });
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
