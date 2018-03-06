import { MeasureValue } from './measure-value';
export class CoordinateData {
    public id: number;
    public x: number;
    public y: number;
    public displayName:string;
    public nodeName:string;
    public status:number;
    public defaultMeasureName:string;
    public defaultMeasure:MeasureValue;
   // public List<MeasureValue> defaultMeasures;
    public measureList:MeasureValue[];
    public mesuresCount: number;
    public lastUpdated:number;
    public parentName:string;
    public timeFrequency:number;
    public iconType:string;

    public longitude:string;
    public latitude:string;
    public relayStatus: number;
    public analogOutput: number;
    public controlScheduleId: number;
    public controlScheduleName:string;
    public lampFailure: number;
    public deviceType: number;
    public deviceId: number;
}
