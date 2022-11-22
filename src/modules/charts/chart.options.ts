
export interface ChartOptions {
    Width    ?: number;
    Height   ?: number;
    FontSize ?: string;
    color    ?: string;
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

export const defaultLineChartOptions = () => {
    const x: LineChartOptions = {
        Width           : 650,
        Height          : 450,
        FontSize        : "14px",
        color           : "steelblue",
        XFrom           : null,
        XTo             : null,
        YFrom           : null,
        YTo             : null,
        XAxisTimeScaled : true,
        YLabel          : '',
        AxisStrokeWidth : 3.5,
        AxisColor       : "#2E4053",
    };
    return x;
};

export interface BarChartOptions extends ChartOptions {
    YLabel ?: string;
}

export interface GroupBarChartOptions extends ChartOptions {
    YLabel          ?: string;
    CategoriesCount ?: number;
    Colors          ?: string[];
    Categories      ?: string[];
}
