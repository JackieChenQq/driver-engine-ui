import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-alarm',
  templateUrl: './alarm.component.html',
  styleUrls: ['./alarm.component.less']
})
export class AlarmComponent implements OnInit {

  ws: WebSocket;

  listOfData: any = [
    {
      id: 1,
      level: '紧急',
      source: 'PE1(172.171.15.11)',
      module: '设备',
      category: '接口',
      name: '接口Down',
      code: '0x110',
      content: '设备PE1 (GigabitEthernet 3/0/0) 与PE2 (GigabitEthernet 3/0/0)的链路断开',
      reason: '对端接口PE2 (GigabitEthernet 3/0/0) down',
      confirmStatus: '已确认',
      clearStatus: '未清除',
      createTime: '2020-08-14 23:45:55',
      updateTime: '2020-09-14 23:45:55'
    },
    {
      id: 2,
      level: '紧急',
      source: 'PE2(172.171.15.12)',
      module: '系统',
      category: '设备',
      name: '不可达',
      code: '0x111',
      content: '设备PE1管理通道不可达',
      reason: '管理用户名密码错误',
      confirmStatus: '已确认',
      clearStatus: '未清除',
      createTime: '2020-08-14 23:45:55',
      updateTime: '2020-09-14 23:45:55'
    },
    {
      id: 3,
      level: '紧急',
      source: 'System',
      module: '专线',
      category: 'L3VPN业务',
      name: '创建失败',
      code: '0x112',
      content: 'VPN(工业互联网)创建失败，设备PE1上分配RD(300:1)冲突',
      reason: 'RD(300:1)已被VPN(test)占用',
      confirmStatus: '已确认',
      clearStatus: '未清除',
      createTime: '2020-08-14 23:45:55',
      updateTime: '2020-09-14 23:45:55'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    this.connectWs();
  }

  connectWs(){
    if (this.ws != null){
      this.ws.close();
    }
    this.ws = new WebSocket('ws://localhost:9091/bbc/alarm');
    const that = this;
    this.ws.onopen = (event) => {
      that.ws.send('hello');
      console.log('got open message: ' + event);
    };
    this.ws.onmessage = (event) => {
      console.log('got message info: ' + JSON.stringify(event));
    };
    this.ws.onerror = (event) => {
      console.log('got error message: ' + JSON.stringify(event));
    };
    this.ws.onclose = (event) => {
      console.log('got close message: ' + JSON.stringify(event));
    };
  }

}
