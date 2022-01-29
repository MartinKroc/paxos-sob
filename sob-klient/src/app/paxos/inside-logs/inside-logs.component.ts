import { Component, OnInit } from '@angular/core';
import {LogsService} from "../../shared/logs.service";

@Component({
  selector: 'app-inside-logs',
  templateUrl: './inside-logs.component.html',
  styleUrls: ['./inside-logs.component.css']
})
export class InsideLogsComponent implements OnInit {

  logs: Array<string> = [];

  constructor(private logService: LogsService) { }

  ngOnInit(): void {
    this.logs = this.logService.getLogs();
  }

  resetLogs() {
    this.logService.removeLogs();
    this.logs = [];
  }
}
