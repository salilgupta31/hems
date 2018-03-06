import { BinEnum } from './../bin-enum';
/**
 * 
 */
export class TimeRangeUtil {
    static readonly monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    static readonly MS_IN_MIN = 60 * 1000;
    static readonly MS_IN_HOUR = 60 * 60 * 1000;
    static readonly MS_IN_DAY = 24 * 60 * 60 * 1000;

    public static getEndDate(binEnum: number, noOfRecords: number = 1) {

        const stDate = new Date();
        switch (binEnum) {
            case BinEnum.HOUR:
                stDate.setHours(stDate.getHours() - noOfRecords);
                break;
            case BinEnum.DAY:
                stDate.setDate(stDate.getDate() - noOfRecords);
                break;
            case BinEnum.WEEK:
                stDate.setDate(stDate.getDate() - (noOfRecords * 7));
                break;
            case BinEnum.MONTH:
                stDate.setMonth(stDate.getMonth() - noOfRecords);
                break;
            case BinEnum.YEAR:
                stDate.setFullYear(stDate.getFullYear() - noOfRecords);
                break;
        }
        return stDate;

    }

    public static getTimeRangeObject(bin: any) {

        let startDate = new Date();
        let endDate = new Date();
        let barChartLabels: string[] = [];
        let firstlabel = 0;
        let tempDate: Date = new Date();

        switch (bin) {
            case BinEnum.HOUR:
                debugger
                startDate.setHours(0);
                endDate.setHours(endDate.getHours());
                firstlabel = startDate.getHours();
                for (let index = 0; index <= endDate.getHours(); index++) {
                    let element: number = (firstlabel + index);
                    if (element > 24) {
                        element = element - 24;
                    }
                    let elementString: string = element.toString() + ':00';
                    barChartLabels.push(elementString);
                }
                break;

            case BinEnum.DAY:
                startDate.setDate(startDate.getDate() - 12);
                startDate.setHours(0, 0, 0, 0);
                endDate.setHours(0, 0, 0, 0);
                tempDate.setHours(tempDate.getHours() - 11 * 24);

                for (let index = 0; index < 12; index++) {
                    if (index > 0) {
                        tempDate.setHours(tempDate.getHours() + 24);
                    }
                    let element: number = tempDate.getDate();
                    let elementString: string = this.monthNames[tempDate.getMonth()] + ' ' + element.toString();
                    barChartLabels.push(elementString);
                }
                break;

            case BinEnum.MONTH:

                startDate.setMonth(startDate.getMonth());
                console.log("start date :" + startDate);
                startDate.setHours(0, 0, 0, 0);
                endDate.setHours(0, 0, 0, 0);
                tempDate.setMonth(0);

                for (let index = 0; index <= endDate.getMonth(); index++) {
                    if (index > 0) {
                        tempDate.setMonth(tempDate.getMonth() + 1);
                    }
                    let element: number = tempDate.getDate();
                    let elementString: string = this.monthNames[tempDate.getMonth()] + ' ' + tempDate.getFullYear();
                    barChartLabels.push(elementString);
                }
                break;
        }
        return {
            labels: barChartLabels,
            startDate: startDate,
            endDate: endDate
        };
    }

    public static getStartDateByTime(time: number, dataPoints: number = 12): Date {
        let date: Date;
        const sDate: Date = new Date();

        switch (time) {
            case BinEnum.HOUR:
                sDate.setTime(sDate.getTime() - (dataPoints * TimeRangeUtil.MS_IN_HOUR));

                date = TimeRangeUtil.getHour_AbsStart(sDate); //DateUtils.getLastOneDay();
                break;

            case BinEnum.DAY:
                sDate.setTime(sDate.getTime() - (dataPoints * TimeRangeUtil.MS_IN_DAY));
                // sDate.date -= dataPoints;
                date = TimeRangeUtil.getDate_AbsStart(sDate); //DateUtils.getLastOneMonth();
                break;

            case BinEnum.WEEK:
                // sDate.date -= dataPoints * 7//dataPoints *7;
                sDate.setTime(sDate.getTime() - (7 * dataPoints * TimeRangeUtil.MS_IN_DAY));
                date = TimeRangeUtil.getDate_AbsStart(sDate); //DateUtils.getLastOneMonth();
                break;

            case BinEnum.MONTH:
                // sDate.month -= dataPoints//dataPoints;
                sDate.setMonth(sDate.getMonth() - dataPoints);
                date = TimeRangeUtil.getMonth_AbsStart(sDate); //DateUtils.getLastOneYear_AbsStart();
                break;

            case BinEnum.YEAR:
                // sDate.fullYear -= 3//dataPoints;
                sDate.setFullYear(sDate.getFullYear() - 3);
                date = TimeRangeUtil.getYear_AbsStart(sDate); //DateUtils.getLastThreeYears_AbsStart();
                break;

            default:
                break;
        }
        return date;
    }


    public static getStartDateForScatterChart(time: number): Date {
        let date: Date;
        let sDate: Date = new Date();

        switch (time) {
            case BinEnum.HOUR:
                sDate.setTime(sDate.getTime() - (30 * TimeRangeUtil.MS_IN_DAY));
                date = TimeRangeUtil.getHour_AbsStart(sDate);
                break;

            case BinEnum.DAY:
                sDate.setFullYear(sDate.getFullYear() - 1);
                date = TimeRangeUtil.getDate_AbsStart(sDate);
                break;

            case BinEnum.WEEK:

                sDate.setFullYear(sDate.getFullYear() - 1);
                date = TimeRangeUtil.getDate_AbsStart(sDate);
                break;

            case BinEnum.MONTH:

                sDate.setFullYear(sDate.getFullYear() - 1);
                date = TimeRangeUtil.getMonth_AbsStart(sDate);
                break;

            case BinEnum.YEAR:

                sDate.setFullYear(sDate.getFullYear() - 1);
                date = TimeRangeUtil.getYear_AbsStart(sDate);;
                break;

            default:
                break;
        }

        return date;
    }

    public static getEndDateByTime(time: number): Date {
        var date: Date;
        var eDate: Date = new Date();

        switch (time) {
            case BinEnum.HOUR:
                date = TimeRangeUtil.getHour_AbsEnd(eDate); //DateUtils.getCurrentDate();
                break;

            case BinEnum.DAY:
                date = TimeRangeUtil.getDate_AbsEnd(eDate); //DateUtils.getCurrentDate();
                break;
            case BinEnum.WEEK:
                date = TimeRangeUtil.getDate_AbsEnd(eDate); //DateUtils.getCurrentDate();
                break;

            case BinEnum.MONTH:
                date = TimeRangeUtil.getMonth_AbsEnd(eDate); //DateUtils.getCurrentYearEnd();
                break;

            case BinEnum.YEAR:
                date = TimeRangeUtil.getYear_AbsEnd(eDate); //DateUtils.getCurrentYearEnd();
                break;

            default:
                break;
        }

        return date;
    }

    /*Hour start*/
    public static getHour_AbsStart(date: Date): Date {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), 0, 0, 0);
    }

    /*Date start*/
    public static getDate_AbsStart(date: Date): Date {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
    }

    /*Month start*/
    public static getMonth_AbsStart(date: Date): Date {
        return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
    }

    /*Year start*/
    public static getYear_AbsStart(date: Date): Date {
        return new Date(date.getFullYear(), 0, 1, 0, 0, 0, 0);
    }

    /*Hour end*/
    public static getHour_AbsEnd(date: Date): Date {
        var newDate: Date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), 59, 59, 999);
        newDate.setMilliseconds(newDate.getMilliseconds() + 1); //absolute end
        return newDate;
    }

    /*Date end*/
    public static getDate_AbsEnd(date: Date): Date {
        var newDate: Date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
        newDate.setMilliseconds(newDate.getMilliseconds() + 1); //absolute end
        return newDate;
    }

    /*Month end*/
    public static getMonth_AbsEnd(date: Date): Date {
        var nextMoDate: Date = new Date();
        nextMoDate.setMonth(date.getMonth() + 1);
        nextMoDate.setDate(0);

        var newDate: Date = new Date(date.getFullYear(), date.getMonth(), nextMoDate.getDate(), 23, 59, 59, 999);
        newDate.setMilliseconds(newDate.getMilliseconds() + 1); //absolute end
        return newDate;
    }

    /*Year end*/
    public static getYear_AbsEnd(date: Date): Date {
        var newDate: Date = new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999);
        newDate.setMilliseconds(newDate.getMilliseconds() + 1); //absolute end
        return newDate;
    }
}