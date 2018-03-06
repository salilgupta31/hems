export class EnergyMonth {
    private _min : number ;
    private _averageValue : number ;
    private _value : number ;

    public get min() : number {
        return this._min ;
    }
    
    public get value() : number {
        return this._value ;
    }

    public get averageValue():number {
        return this._averageValue ;
    }

    public set min(min : number){
        this._min = min ;
    }
    public set averageValue(averageValue : number){
        this._averageValue = averageValue ;
    }

    public set value(value : number){
        this._value = value ;
    }
    

}
