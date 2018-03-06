import { DataBean }  from "./data-bean";
import { Timestamp }  from "./timestamp";

export class EventBean {

    public ID:number;
    public name:string;
    public timestamp:Timestamp;
    public state:number;
    public type:number;
    public CIName:string;
    public CIExternalID:string;	
    public data:any[]; 
    public datetime:Date;
    public nodeDisplayName:string;
    public dataBean:DataBean[];

}
