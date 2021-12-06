import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../shared/api.service";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {

  // get client id from api
  currentServerId: number = 1;
  connectionStarted: boolean = false;

  constructor(public signalRService: ApiService, private http: HttpClient) { }

  ngOnInit(): void {
    this.signalRService.startConnection();
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
    this.http.get('https://localhost:5001/api/servs')
      .subscribe(res => {
        console.log(res);
      })
  }

  public buttonClicked = (event:any) => {
    this.signalRService.broadcastChartData();
    this.connectionStarted = true;
  }
}
