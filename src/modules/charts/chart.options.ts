
export interface ChartOptions {
    Width    ?: number;
    Height   ?: number;
    FontSize ?: string;
    Color    ?: string;
}

export enum ChartColors {
    Red          = "#E74C3C",
    Orange       = "#F4511E",
    OrangeLight  = "#FFCC80",
    OrangeYellow = "#F7DC6F",
    Creame       = "#FFF9C4",
    GreenYellow  = "#E6EE9C",
    GreenLight   = "#A5D6A7",
    Green        = "#48C9B0",
    Blue         = "#5DADE2",
    GrayMedium   = "#7F8C8D",
    GrayDarker   = "#34495E",
    BrownLight   = "#EDBB99",
    Brown        = "#E59866",
    Purple       = "#8E44AD",
    PurpleLght   = "#BB8FCE",
}

export interface LineChartOptions extends ChartOptions {
    XFrom           ?: any; // null;
    XTo             ?: any; // new Date("2007-06-09T00:00:00.000Z");
    YFrom           ?: any; // 70;
    YTo             ?: any; // null;
    XAxisTimeScaled ?: boolean; // true;
    YLabel          ?: string; // 'Day Close $'
    AxisStrokeWidth ?: number; // 3.5;
    AxisColor       ?: string; // "#2E4053";
}

export interface MultiLineChartOptions extends ChartOptions {
    Colors          ?: string[];
    Categories      ?: string[];
    XAxisTimeScaled ?: boolean; // true;
}

export interface BarChartOptions extends ChartOptions {
    YLabel ?: string;
}

export interface MultiBarChartOptions extends ChartOptions {
    YLabel          ?: string;
    CategoriesCount ?: number;
    Colors          ?: string[];
    Categories      ?: string[];
}

export interface PieChartOptions extends ChartOptions {
    Colors ?: string[];
}

export interface CalendarChartOptions extends ChartOptions {
    Colors ?: string[];
}

export interface CircledNumberChartOptions extends ChartOptions {
    InnerRadius: number;
    GradientColor1: string;
    GradientColor2: string;
    PathColor: string;
    TextColor: string;
}

export interface CircularProgressChartOptions extends ChartOptions {
    SymbolFontSize: string;
    InnerRadius: number;
    GradientColor1: string;
    GradientColor2: string;
    PathColor: string;
    TextColor: string;
}

export interface LinearProgressChartOptions extends ChartOptions {
    GradientColor1: string;
    GradientColor2: string;
    PathColor: string;
    TextColor: string;
}

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
            InnerRadius    : 135,
            FontSize       : "165px",
            GradientColor1 : '#f2503f',
            GradientColor2 : '#ea0859',
            PathColor      : '#404F70',
            TextColor      : 'slategray',
            SymbolFontSize : "50px",
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
