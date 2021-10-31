import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Device } from 'src/app/models/device';
import { ConfParam } from 'src/app/models/conf-param';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';

@Injectable({
  providedIn: 'root'
})
export class DeviceModelsService {

  public getAllModelsUrl = '/southbound/api/models';

  public getConfigUrl = '/southbound/api/model';

  public editConfigUrl = '/southbound/api/model/config';

  public subject: Subject<any> = new Subject<any>();
  public index = 1;
  public currentHandlingDeivce: Device;
  constructor(public httpClient: HttpClient) { }

  public setCurrentHandlingDevice(device: Device){
    this.currentHandlingDeivce = device;
  }

  public getCurrentHandlingDevice(): Device{
    return this.currentHandlingDeivce;
  }

  // 获取设备配置模型
  public getAllModels(confParam: ConfParam): Observable<any>{
    return this.httpClient.post(this.getAllModelsUrl, confParam);
  }

  // 获取指定设备配置模型的配置
  public getConfig(confParam: ConfParam): Observable<any>{
    return this.httpClient.post(this.getConfigUrl, confParam);
  }

   // 编辑指定设备配置模型的配置
   public editConfig(confParam: ConfParam): Observable<any>{
    return this.httpClient.post(this.editConfigUrl, confParam);
  }

  // 编辑指定设备配置模型的配置
  public delConfig(confParam: ConfParam): Observable<any>{
    const options = {
      heads: new HttpHeaders({
        'content-type': 'application/json'
      }),
      body: confParam
    };
    return this.httpClient.request('DELETE', this.editConfigUrl, options);
  }

  // 获取模型名称
  public getModelName(modelJsonData: any): string{
    // tslint:disable-next-line: forin
    for (const key in modelJsonData){
      return key;
    }
  }

  public resetIndex(){
    this.index = 1;
  }

  public generateTreeForObject(modelJsonData: any, parentModelJsonData: any,
                               treeNodeOptions: NzTreeNodeOptions[], idNodeMap: any, keyNodeMap: any ){
    // tslint:disable-next-line: forin
    for (const keyTmp in modelJsonData){
      let treeOption: NzTreeNodeOptions;
      const value = modelJsonData[keyTmp];
      let childTypeFlag = 1;
      if (typeof value === 'number' || typeof value === 'string') {
        childTypeFlag = 0;
      }else if ( Array.isArray(value)){
        childTypeFlag = 2;
      }
      if (!parentModelJsonData){
        treeOption =
          { key: keyTmp, id: this.index, parentid: 0, title: keyTmp};
        treeNodeOptions.push(treeOption);
        idNodeMap[treeOption.id] = treeOption;
        keyNodeMap[treeOption.key] = treeOption;
        this.index++;
      }
      try{

        switch (childTypeFlag){
          case 0:
            if(parentModelJsonData){
              treeOption =
                { key: keyTmp, id: this.index, parentid: parentModelJsonData.id, title: keyTmp, isLeaf: true};
            }else{
              treeOption.isLeaf=true;
            }
            treeNodeOptions.push(treeOption);
            idNodeMap[treeOption.id] = treeOption;
            keyNodeMap[treeOption.key] = treeOption;
            this.index++;
            break;
          case 1:
            if(parentModelJsonData){
              treeOption =
              { key: keyTmp, id: this.index, parentid: parentModelJsonData ? parentModelJsonData.id : (this.index - 1), title: keyTmp};
              this.index++;
              treeNodeOptions.push(treeOption);
              idNodeMap[treeOption.id] = treeOption;
              keyNodeMap[treeOption.key] = treeOption;
            }
            this.generateTreeForObject(value, treeOption, treeNodeOptions, idNodeMap, keyNodeMap);
            break;
          case 2:
            if(parentModelJsonData){
              treeOption =
              { key: keyTmp, id: this.index, parentid: parentModelJsonData ? parentModelJsonData.id : (this.index - 1), title: keyTmp};
              this.index++;
              treeNodeOptions.push(treeOption);
              idNodeMap[treeOption.id] = treeOption;
              keyNodeMap[treeOption.key] = treeOption;
            }
            this.generateTreeForObject(value, treeOption, treeNodeOptions, idNodeMap, keyNodeMap);
            break;
        }
      }
      catch(ex){
        console.error("key is "+keyTmp+", id is "+this.index +", parentModelJson is " + parentModelJsonData);
      }
    }
    
  }
}
