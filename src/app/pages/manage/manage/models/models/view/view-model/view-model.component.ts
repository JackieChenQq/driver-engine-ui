import { Component, OnInit, Input } from '@angular/core';
import { ChangeDetectionStrategy,  ViewChild } from '@angular/core';
import { NzTreeNode, NzTreeNodeOptions } from 'ng-zorro-antd/core/tree';
import { TransferChange } from 'ng-zorro-antd/transfer';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { DeviceModelsService } from '../../../device-models.service';


@Component({
  selector: 'app-view-model',
  templateUrl: './view-model.component.html',
  styleUrls: ['./view-model.component.less']
})
export class ViewModelComponent implements OnInit {

  list: NzTreeNodeOptions[] = [];

  treeData: NzTreeNodeOptions[];

  checkedNodeList: NzTreeNode[] = [];

  treeSelectedData: NzTreeNodeOptions[] = [];

  // 每次输入值更新此值，点击右键清空该值
  selectedKeyValue: any = {};

  modelSchemaData: any = {};

  modelSchemaDataStr?: string;

  @Input() modelScheam: JSON;

  @Input() confModel: string;

  @Input() name: string;

  modelScheamStr: string;

  searchValue: any;

  // 树形节点模型的id对应的值，用来查找父节点
  idNodeMap: any = {};

  keyNodeMap: any = {};

  queryResultStr?: string;

  operationValue = '0';

  // 每次输入值更新此值，点击右键清空该值
  selectedFilterKeyValue: any = {};

  filterDeleteJson: any = {};

  // tslint:disable-next-line: member-ordering
  @ViewChild('tree', { static: true }) tree!: NzTreeComponent;

  ngOnInit(): void {
  }


  constructor(public deviceModelService: DeviceModelsService) {
    setTimeout(() => {
      console.log('get model schema is ' + this.modelScheam);
      this.modelScheamStr = JSON.stringify(this.modelScheam);
      const listTmp: NzTreeNodeOptions[] = [];
      const idNodeTmp: any = {};
      const keyNodeMapTmp: any = {};
      deviceModelService.resetIndex();
      deviceModelService.generateTreeForObject(this.modelScheam, undefined, listTmp, idNodeTmp, keyNodeMapTmp);
      this.list = listTmp;
      this.idNodeMap = idNodeTmp;
      this.keyNodeMap = keyNodeMapTmp;
      this.treeData = this.generateTree(this.list);
    }, 50);
  }


  private generateTree(arr: NzTreeNodeOptions[]): NzTreeNodeOptions[] {
    const tree: NzTreeNodeOptions[] = [];
    // tslint:disable-next-line:no-any
    const mappedArr: any = {};
    let arrElem: NzTreeNodeOptions;
    let mappedElem: NzTreeNodeOptions;

    for (let i = 0, len = arr.length; i < len; i++) {
      arrElem = arr[i];
      mappedArr[arrElem.id] = { ...arrElem };
      mappedArr[arrElem.id].children = [];
    }

    for (const id in mappedArr) {
      if (mappedArr.hasOwnProperty(id)) {
        mappedElem = mappedArr[id];
        if (mappedElem.parentid) {
          mappedArr[mappedElem.parentid].children.push(mappedElem);
        } else {
          tree.push(mappedElem);
        }
      }
    }
    return tree;
  }

  checkBoxChange(node: NzTreeNode, onItemSelect: (item: NzTreeNodeOptions) => void): void {
    if (node.isDisabled || this.operationValue !== '2') {
      return;
    }
    node.isChecked = !node.isChecked;
    if (node.isChecked) {
      this.checkedNodeList.push(node);
      this.selectedFilterKeyValue[node.key] = this.selectedKeyValue[node.key] ? this.selectedKeyValue[node.key] : '';
    } else {
      const idx = this.checkedNodeList.indexOf(node);
      if (idx !== -1) {
        this.checkedNodeList.splice(idx, 1);
        delete this.selectedFilterKeyValue[node.key];
      }
    }
    const item = this.list.find(w => w.id === node.origin.id);
    onItemSelect(item!);
  }

  // 出现变化时比如点击往左或者往右操作
  change(ret: TransferChange): void {
    const isDisabled = ret.to === 'right';
    // this.checkedNodeList.forEach(node => {
    //   node.isDisabled = isDisabled;
    //   node.isChecked = isDisabled;
    // });

  }

  setFiledValue(originData: any, event: any): void{
    console.log(originData + '=====' + event.currentTarget.value);
    const value = event.currentTarget.value;
    if (value !== ''){
      this.selectedKeyValue[originData.key] = event.currentTarget.value;
    }else{
      delete this.selectedKeyValue[originData.key];
    }
    if(this.selectedFilterKeyValue[originData.key]){
      this.selectedFilterKeyValue[originData.key] = this.selectedKeyValue[originData.key];
    }
  }


  generateCommand($event: any){
    this.generateSelectedDataToJson();
    if(this.operationValue === '2'){
      this.generateSelectedDeleteNodeToJson();
    }
  }

  generateSelectedDataToJson(){
    // 先做相同父节点配置分组
    const data = {};
    this.wrapModelDataByParentGroup(data, this.selectedKeyValue);
    console.log('merge data is ' + JSON.stringify(data));
    this.modelSchemaDataStr = JSON.stringify(data);
  }

  generateSelectedDeleteNodeToJson(){
    // 先做相同父节点配置分组
    const data = {};
    this.wrapModelDataByParentGroup(data, this.selectedFilterKeyValue);
    this.filterDeleteJson = data;
    console.log('merge filter data is ' + JSON.stringify(data));
  }


  wrapModelDataByParentGroup(mergeFinishedData: any, waitMergeData: any){
    // 先做相同父节点配置分组
    const sameParentGroup = {};
    let loopCount = 0;
    // tslint:disable-next-line: forin
    for (const key in waitMergeData){
      const node = this.keyNodeMap[key];
      if (node.parentid === 0){
        mergeFinishedData[key] = waitMergeData[key];
        continue;
      }
      loopCount++;
      let parentNode = this.idNodeMap[node.parentid];
      if (parentNode.key === '0'){
        parentNode = this.idNodeMap[parentNode.parentid];
      }
      let parentNodeData = sameParentGroup[parentNode.key];
      if (!parentNodeData){
        parentNodeData = {};
        sameParentGroup[parentNode.key] = parentNodeData;
      }
      parentNodeData[node.key] = waitMergeData[key];
    }
    if (loopCount > 0){
      this.wrapModelDataByParentGroup(mergeFinishedData, sameParentGroup);
    }
  }

  addNewNode(node: any){
    console.log("node info is "+  JSON.stringify(node));
  }

  sendCommand($event: any){
    let confparam;
    const jsonConfigData = {};
    jsonConfigData[this.name] = JSON.parse(this.modelSchemaDataStr);
    const jsonDataStr = JSON.stringify(jsonConfigData);
    console.log('request data is ' + jsonDataStr);
    switch(this.operationValue){
      case '0':
        confparam = {
          confModel: this.confModel,
          filter: '',
          data: jsonDataStr,
          pe: this.deviceModelService.getCurrentHandlingDevice()
        };
        this.deviceModelService.getConfig(confparam).subscribe(res => {
          console.log('res====' + JSON.stringify(res));
          if (res.exception){
            this.queryResultStr = JSON.stringify(res);
          }else{
            this.queryResultStr = JSON.stringify(JSON.parse(res.result)[this.name]);
          }
        });
        break;
      case '1':
        console.log('handing edit');
        confparam = {
          confModel: this.confModel,
          filter: '',
          data: jsonDataStr,
          pe: this.deviceModelService.getCurrentHandlingDevice()
        };
        this.deviceModelService.editConfig(confparam).subscribe(res => {
          console.log('res====' + JSON.stringify(res));
          if (res.exception){
            this.queryResultStr = JSON.stringify(res);
          }else{
            this.queryResultStr = 'config success';
          }
        });
        break;
      case '2':
        console.log('handing delete');
        const jsonFilterData = {};
        jsonFilterData[this.name] = this.filterDeleteJson;
        const filterDataStr = JSON.stringify(jsonFilterData);
        console.log('request filter data is ' + filterDataStr);
        confparam = {
          confModel: this.confModel,
          filter: filterDataStr,
          data: jsonDataStr,
          pe: this.deviceModelService.getCurrentHandlingDevice()
        };
        this.deviceModelService.delConfig(confparam).subscribe(res => {
          console.log('res====' + JSON.stringify(res));
          if (res.exception){
            this.queryResultStr = JSON.stringify(res);
          }else{
            this.queryResultStr = 'config success';
          }
        });
        break;
    }
  }

}
