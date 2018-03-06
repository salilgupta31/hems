/**
 * Service to read the Tree type hierarchy nodes dynamically.
 * It iterates the tree elements
 * and
 * store the child nodes at different levels, in an array. 
 */
import { Injectable } from '@angular/core';
import { BasePage } from './../app/common/base-page';
import { NodeTreeDatas } from './node-tree-datas';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DataServiceService } from './../app/data-service.service';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { Observable } from 'rxjs/Rx';
import { GkCommonServiceService } from './../app/gk-common-service.service';

@Injectable()
export class HierarchyService extends BasePage {

  private _fullNode: NodeTreeDatas = new NodeTreeDatas();

  private _allLeafNode: NodeTreeDatas[] = Array<NodeTreeDatas>();

  private _allData$: BehaviorSubject<NodeTreeDatas>;


  set fullNode(_fullNode : NodeTreeDatas){
    this._fullNode = _fullNode ;
  }

  get fullNode(){
    return this._fullNode ;
  }

  set allLeafNode(_allLeafNode : NodeTreeDatas[]){
    this._allLeafNode = _allLeafNode
  }

  get allLeafNode(){
    return this._allLeafNode;
  }

  set allData$(_allData$){
    this._allData$ = _allData$;
  }

  get allData$(){
    return this._allData$ ;
  }

  constructor(
    private _dataService: DataServiceService,
    private router: Router,
    private tTranslate: TranslateService,
    private route: ActivatedRoute,
    private _httpService: GkCommonServiceService
  ) {
    super(_dataService, router, tTranslate);
    this.validateSession();

    this._allData$ = new BehaviorSubject<NodeTreeDatas>(null);

    this.getFullNodesData(0);

    this._allData$.asObservable().map(
      response => {
        return response ;
        // if(response instanceof Array && response.length == 0){
        //   return ;
        // }
        // this._fullNode = response;
        // this.getDeviceLeaf(response);
        // return this._allLeafNode;
      }
    );
  }

  ngOnInit() {

  }

  getFullNodesData(id) {
    return this.getOneNodeData(id)
      .expand(response => {
        if (response && response.nodeTreeDatas) {
          let nodeTreeDatas: NodeTreeDatas = response.nodeTreeDatas;
          for (let item of nodeTreeDatas.nodes) {
            if (item.hasChild != 0) {
              this.getFullNodesData(item.hasChild);
            }
            else {
              //return Observable.empty();
            }
          }
        }
        return Observable.empty();
      }).subscribe(data => {
        data as NodeTreeDatas;
        this._allData$.next(data);
      });
  }

  getOneNodeData(id: number): Observable<any> {
    return this._httpService.getNodesDataByNodeId(id);
  }

  getDeviceLeaf(fullNode) {
    if (fullNode.length == 0)
      return;
    let nodeTreeDatas: NodeTreeDatas = fullNode.nodeTreeDatas;
    let nodes: NodeTreeDatas[] = nodeTreeDatas.nodes;
    for (let node of nodes) {

      if (node.hasChild == 0) {
        this._allLeafNode.push(node);
      }

    }
  }

}
