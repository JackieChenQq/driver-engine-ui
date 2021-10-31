import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.less']
})
export class MonitorComponent implements OnInit {

  deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30;
  constructor() { }

  ngOnInit(): void {
  }

}
