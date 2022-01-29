import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogsService {

  logs: Array<string> = [];

  constructor() {
    if(sessionStorage.getItem('logs')) this.logs = JSON.parse(<string>sessionStorage.getItem('logs'));
    else this.logs = [];
  }

  addLog(message: string) {
    this.logs.push(message);
    sessionStorage.removeItem('logs');
    sessionStorage.setItem('logs', JSON.stringify(this.logs));
  }

  getLogs(): Array<string> {
    return this.logs;
  }

  removeLogs() {
    this.logs = [];
    sessionStorage.removeItem('logs');
    sessionStorage.setItem('logs', JSON.stringify(this.logs));
  }
}
