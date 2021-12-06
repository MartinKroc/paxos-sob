import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../shared/api.service";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {

  constructor(public signalRService: ApiService, private http: HttpClient) { }

  ngOnInit(): void {
    this.signalRService.startConnection();
    this.signalRService.addTransferChartDataListener();
    //this.signalRService.addBroadcastChartDataListener();
    this.startHttpRequest();
  }

  private startHttpRequest = () => {
    this.http.get('https://localhost:5001/api/servers')
      .subscribe(res => {
        console.log(res);
      })
  }

  public buttonClicked = (event:any) => {
    console.log(event);
    this.signalRService.broadcastChartData();
  }
}
