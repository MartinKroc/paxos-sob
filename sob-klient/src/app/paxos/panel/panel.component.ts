import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ApiService} from "../../shared/api.service";
import {HttpClient} from "@angular/common/http";
import {Role} from "../../models/role";
import {ServerLog} from "../../models/ServerLog";
import {Vote, VotesList} from "../../models/Votes";
import {LogsService} from "../../shared/logs.service";
import {Server} from "../../models/Server";

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {

  connectionStarted: boolean = false;
  logs: ServerLog[] = [];
  votes: Vote[] = [];
  votableServers: Server[] = [];
  serverToVote: number = 0;
  votingResult: string;
  serverAdded: boolean = false;
  voteToAdd: Vote = {
    serverId: this.signalRService.currentClientId,
    value: this.signalRService.getBestProposer()
  };
  @ViewChild('cont') cont: ElementRef;

  constructor(
    public signalRService: ApiService,
    public logsService: LogsService,
    private http: HttpClient) {
    this.signalRService.invokeEvent.subscribe(value => this.popupComponent(value.some));
    // setTimeout(()=>{
    //   this.signalRService.callComponent(1);
    // },1000);
  }


  @HostListener('window:beforeunload', [ '$event' ])
  unloadHandler(event:any) {
    if(this.signalRService.currentClientRole === 0) {
      event.returnValue = `You have unsaved changes, leave anyway?`;
      sessionStorage.removeItem('id')
      sessionStorage.setItem('id', '1')
      this.http.post('https://localhost:5001/api/servers/destroy-current-leader', {})
        .subscribe(res => {

        }, error => {
        });
    }
  }

  popupComponent(text: string) {
    const notif = document.createElement('div');
    notif.style.padding='2em';
    notif.style.background='#801515';
    notif.style.color='whitesmoke';
    notif.style.borderRadius='5px';
    notif.style.margin='1rem';
    notif.style.fontSize='1.5rem'
    this.cont.nativeElement.appendChild(notif)
    notif.innerText = text;
    setTimeout(()=> {
      notif.remove();
    }, 4000);
  }

  ngOnInit(): void {
    this.signalRService.startConnection();
    this.serverToVote = this.signalRService.getBestProposer();
    this.getVotes();
    this.getVotableServers();
    this.getLeader();
    this.checkIfConnectionStarted();
    this.signalRService.addTransferChartDataListener();
    this.signalRService.addBroadcastChartDataListener();
    this.signalRService.addWinnerMessageListener();
    this.signalRService.addVoteAddedListener();
    this.signalRService.addNewProposeListener();
    this.signalRService.addLeaderResigned();
    this.signalRService.addNewVoting()
    this.signalRService.newVotingListener();
    this.signalRService.addLeaderDestroyedListener();
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
      this.logsService.addLog(res);
    }, error => {
      this.logsService.addLog('Voting is not finished yet!');
      this.popupComponent('Voting is not finished yet!');
    });
  }

  acceptProposal() {
    let val = {serverId: this.signalRService.currentClientId, value: Number(this.serverToVote)};
    this.signalRService.refreshRole();
    this.signalRService.addVote(val).subscribe(res => {
      this.logsService.addLog('Vote saved!');
    }, error => {
      if(error.error.text) {
        console.log(error.error.text)
        this.logsService.addLog(error.error.text);
        this.popupComponent(error.error.text);
      }
      else {
        console.log(error.error)
        this.logsService.addLog(error.error);
        this.popupComponent(error.error);
      }
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
    this.serverAdded = true;
    this.signalRService.refreshRole();
    this.http.post('https://localhost:5001/api/servs/add', {})
      .subscribe(res => {
        console.log(res);
        // get id from api
        // @ts-ignore
        this.signalRService.setClientId(res.serverId);
        // @ts-ignore
        this.signalRService.currentClientRole = res.role;
        // @ts-ignore
        sessionStorage.setItem('role', res.role);
      })
  }

  addProposition() {
    this.signalRService.refreshRole();
    this.http.post('https://localhost:5001/api/role/leader-wannabe/' + this.signalRService.currentClientId, {})
      .subscribe(res => {
        console.log(res);
        // @ts-ignore
        if(res !== 'No server with such id!') {
          this.signalRService.currentClientRole = 2;
          sessionStorage.setItem('role', '2');
        }
      }, error => {
        alert('[add proposition] Nie istnieje w bazie klient o takim ID');
        this.logsService.addLog('[add proposition] Nie istnieje w bazie klient o takim ID');
        this.popupComponent('[add proposition] Nie istnieje w bazie klient o takim ID');
      });
  }

  hasRole(role:Role) {
    if(role === Role.Proposer) return false;
    else return true;
  }

  private checkIfConnectionStarted() {
    if(sessionStorage.getItem('id')) {
      this.connectionStarted = true;
    }
  }

  leaderRandom() {
    this.http.post('https://localhost:5001/api/role/random-leader', {})
      .subscribe(res => {
        console.log(res);
        // @ts-ignore
        if(res !== 'Leader already exists!') {
          // @ts-ignore
          this.logsService.addLog('Wybrano losowego lidera o ID: ' + res.serverId);
          // @ts-ignore
          this.popupComponent('Wybrano losowego lidera o ID: ' + res.serverId);
        }
      }, error => {
        alert('Lider ju?? istnieje');
        this.logsService.addLog('Leader already exists!');
        this.popupComponent('Leader already exists!');
      });
  }

  private getVotableServers() {
    this.http.get('https://localhost:5001/api/servers/leaders-to-be', {})
      .subscribe(res => {
        console.log(res);
        // @ts-ignore
        this.votableServers = res;
      });
  }

  dontWantToBeLeader() {
    this.http.post('https://localhost:5001/api/role/dont-want-to-be-leader/' + this.signalRService.currentClientId, {})
      .subscribe(res => {
        console.log(res);
        if(this.signalRService.currentClientRole === 0) {
          this.signalRService.currentClientRole = 1;
        }
        // @ts-ignore
        this.votableServers = res;
      });
  }

  leaderError() {
    this.http.post('https://localhost:5001/api/servers/destroy-current-leader', {})
      .subscribe(res => {
        console.log(res);
        if(this.signalRService.currentClientRole === 0) {
          this.signalRService.currentClientRole = 1;
        }
        // // @ts-ignore
        // this.votableServers = res;
      });
  }
}
