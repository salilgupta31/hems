/**
 * name
 */
export class HighChartUtil {

    static getTopLegend(Highcharts: any) {

        return {
            align: 'right',
            x: -5,
            verticalAlign: 'top',
            y: 0,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
            borderColor: '#CCC',
            borderWidth: 0,
            shadow: false
        }
    }

    static getTooltip(chartType: string, isStacked: boolean) {

        if (chartType === 'column' && isStacked === true) {
            return {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
            };
        } else {
            return {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormat: '{series.name}: {point.y}'
            }
        }

    }


    static getYAxis(title: string, min = 0) {
        return {
            min: min,
            title: { text: title, },
        }
    }
}