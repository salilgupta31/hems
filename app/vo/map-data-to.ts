import {CoordinateData } from './coordinate-data';

export class MapDataTO {

    public id:number = -1;
    public displayName:string ;
    public path:string ;
    public width:number
    public height:number
    public coordinates:CoordinateData[];
    public nodeName:string;
    public lastUpdated:number;
}
