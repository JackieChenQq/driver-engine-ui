import { Component, OnInit } from '@angular/core';
import { Device } from 'src/app/models/device';


@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.less']
})
export class ManageComponent implements OnInit {

  listOfData: Device[] = [
    {
      id: 1,
      name: 'NJ-PE(ChinaUnicom)',
      manageIp: '172.171.15.11',
      manageUsername: 'fnii2019',
      managePwd: 'Admin@123',
      vendor: 'huawei',
      version: 'V8R11',
      model: 'NE40E',
      hardwareVersion: 'X3A',
      softwareVersion: 'V8R11',
      type: 'Router'
    },
    {
      id: 2,
      name: 'NJ-PE',
      manageIp: '172.171.15.14',
      manageUsername: 'pml2020',
      managePwd: 'Admin@123',
      vendor: 'huawei',
      version: 'V8R11',
      model: 'NE40E',
      hardwareVersion: 'X8A',
      softwareVersion: 'V8R11',
      type: 'Router',
    },
    {
      id: 3,
      name: 'LY-P',
      manageIp: '172.171.15.15',
      manageUsername: 'cqq',
      managePwd: 'Admin@123',
      vendor: 'huawei',
      version: 'V8R11',
      model: 'NE40E',
      hardwareVersion: 'X3A',
      softwareVersion: 'V8R11',
      type: 'Router',
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
