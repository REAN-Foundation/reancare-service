import { LineChartOptions, MultiLineChartOptions, ChartColors, BarChartOptions, MultiBarChartOptions, CircledNumberChartOptions, CircularProgressChartOptions, LinearProgressChartOptions, PieChartOptions, CalendarChartOptions } from "./chart.options";

export class DefaultChartOptions {

    static lineChart = (): LineChartOptions => {
        const opts: LineChartOptions = {
            Width           : 650,
            Height          : 450,
            FontSize        : "14px",
            Color           : "steelblue",
            XFrom           : null,
            XTo             : null,
            YFrom           : null,
            YTo             : null,
            XAxisTimeScaled : true,
            YLabel          : '',
            AxisStrokeWidth : 3.5,
            AxisColor       : "#2E4053",
            StrokeWidth     : 3,
            ShowXAxis       : true,
            ShowYAxis       : true,
        };
        return opts;
    };

    static multiLineChart = (): MultiLineChartOptions => {
        const opts: MultiLineChartOptions = {
            Width           : 650,
            Height          : 450,
            FontSize        : "14px",
            Color           : "steelblue",
            XAxisTimeScaled : true,
            Colors          : [ChartColors.OrangeRed, ChartColors.Green],
            Categories      : ['Y1', 'Y2'],
            StrokeWidth     : 3,
            ShowXAxis       : true,
            ShowYAxis       : true,
        };
        return opts;
    };

    static barChart = (): BarChartOptions => {
        const opts: BarChartOptions = {
            Width           : 650,
            Height          : 450,
            FontSize        : "14px",
            Color           : "steelblue",
            YLabel          : '',
            XAxisTimeScaled : false,
            ShowXAxis       : true,
            ShowYAxis       : true,
        };
        return opts;
    };

    static multiBarChart = (): MultiBarChartOptions => {
        const opts: MultiBarChartOptions = {
            Width           : 650,
            Height          : 450,
            FontSize        : "14px",
            Color           : "steelblue",
            YLabel          : '',
            XAxisTimeScaled : false,
            ShowXAxis       : true,
            ShowYAxis       : true,
            CategoriesCount : 0,
            Colors          : [],
            Categories      : [],
        };
        return opts;
    };

    static pieChart = (): PieChartOptions => {
        const opts: PieChartOptions = {
            Width    : 450,
            Height   : 450,
            FontSize : "11px",
            Colors   : [],
        };
        return opts;
    };

    static donutChart = (): PieChartOptions => {
        const opts: PieChartOptions = {
            Width    : 450,
            Height   : 450,
            FontSize : "11px",
            Colors   : [],
        };
        return opts;
    };

    static calenderChart = (): CalendarChartOptions => {
        const opts: CalendarChartOptions = {
            Width    : 450,
            Height   : 450,
            FontSize : "11px",
            Colors   : [],
        };
        return opts;
    };

    static circledNumber = (): CircledNumberChartOptions => {
        const opts: CircledNumberChartOptions = {
            Width          : 350,
            Height         : 350,
            InnerRadius    : 135,
            FontSize       : "165px",
            GradientColor1 : '#f2503f',
            GradientColor2 : '#ea0859',
            PathColor      : '#404F70',
            TextColor      : 'slategray',
        };
        return opts;
    };

    static circularProgress = (): CircularProgressChartOptions => {
        const opts: CircularProgressChartOptions = {
            Width          : 350,
            Height         : 350,
            InnerRadius    : 110,
            FontSize       : "90px",
            GradientColor1 : '#f2503f',
            GradientColor2 : '#ea0859',
            PathColor      : '#404F70',
            TextColor      : 'slategray',
            SymbolFontSize : "40px",
        };
        return opts;
    };

    static linearProgress = (): LinearProgressChartOptions => {
        const opts: LinearProgressChartOptions = {
            Width          : 650,
            Height         : 40,
            FontSize       : "24px",
            GradientColor1 : '#f2503f',
            GradientColor2 : '#ea0859',
            PathColor      : '#404F70',
            TextColor      : 'slategray',
        };
        return opts;
    };

}
