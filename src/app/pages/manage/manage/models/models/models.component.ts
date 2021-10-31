import { Component, OnInit, TemplateRef } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { DeviceModelsService } from '../device-models.service';
import { ConfParam } from 'src/app/models/conf-param';
import { Device, DeviceModel } from 'src/app/models/device';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ViewModelComponent } from './view/view-model/view-model.component';

@Component({
  selector: 'app-models',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.less']
})
export class ModelsComponent implements OnInit {

  confparam: ConfParam;
  device: Device;
  modelDataArray: DeviceModel[] = [];
  number:{}=1;

  listOfColumn =[
    // {
    //   title: 'No',
    //   compare: null,
    //   priority: false
    // },
    {
      title: 'Name',
      compare: (a: DeviceModel, b: DeviceModel) => a.name.localeCompare(b.name),
      priority: 3
    },
    {
      title: 'Action',
      compare: null,
      priority: false
    }
  ]

  constructor(public route: ActivatedRoute, public deviceModelService: DeviceModelsService, private modalSrv: NzModalService) {
    this.route.queryParams.subscribe(res => {
      console.log(res);
      this.device = {
        id: 1,
        name: 'NJ-PE(ChinaUnicom)',
        manageIp: '172.171.15.11',
        manageUsername: 'fnii2019',
        managePwd: 'Admin@123',
        vendor: 'huawei',
        version: 'V8R11',
        model: 'NE40E'
      };
      this.confparam = {
        confModel: '',
        filter: '',
        data: '',
        pe: this.device
      };
      this.deviceModelService.getAllModels(this.confparam).subscribe(resModel => {
        if (resModel.result){
          const modelDataArrayTmp: DeviceModel[] = [];
          // tslint:disable-next-line: prefer-for-of
          for (let i = 0; i < resModel.result.length; i++){
              const model = JSON.parse(resModel.result[i]);
              // tslint:disable-next-line: forin
              for (const _key in model){
                const value = model[_key];
                const deviceModelTableData: DeviceModel = {
                  confModel: _key,
                  index: i,
                  name: this.deviceModelService.getModelName(model[_key]),
                  schema: value[this.deviceModelService.getModelName(model[_key])]
                };
                modelDataArrayTmp.push(deviceModelTableData);
              }
          }
          this.modelDataArray = modelDataArrayTmp;
        }
        console.log(resModel);
      });
    });
   }

  ngOnInit(): void {
  }

  // public viewModelData(index: number, tpl: TemplateRef<{}>){
  //   console.log("get model index " + index);
  //   this.modalSrv.create(
  //     {
  //       nzTitle: '新建规则',
  //       nzContent: tpl,
  //       nzOnOk: () => {
  //        console.log(this.modelDataArray[index]);
  //       },
  //     }
  //   );
  //   console.log("get model schema data: "+this.modelDataArray[index].schema);
  // }


  public viewModelData(index: number){
    console.log("get model index " + index);
    this.deviceModelService.setCurrentHandlingDevice(this.device);
    this.modalSrv.create(
      {
        nzTitle: this.modelDataArray[index].name,
        nzContent: ViewModelComponent,
        nzComponentParams: {
          modelScheam: this.modelDataArray[index].schema,
          confModel: this.modelDataArray[index].confModel,
          name: this.modelDataArray[index].name
        },
        nzWidth: 950,
        nzOnOk: () => {
         console.log(this.modelDataArray[index]);
        },
      }
    );
    console.log("get model schema data: " + this.modelDataArray[index].schema);
  }

  public editModelData(index: number){
    console.log("get model index " + index);
    console.log("get model schema data: " + this.modelDataArray[index].schema);
  }

  public deletewModelData(index: number){
    console.log("get model index " + index);
    console.log("get model schema data: " + this.modelDataArray[index].schema);
  }

}
