export class UserVO {



    public callerID: string;
    public key: string;
    public userName: string;
    public GMToffset: number;
    public sessionTTL: number;
    public config: string;
    public installDate: Number;
    public installDateTime: Date;
    public userType: number;
    public users: any[];
    public eventBean: any;
    public errorBean: any;
    public moduleCode: string;
    public timeFrequency: number;
    public timeFrequencyMS: number = 0;
}
