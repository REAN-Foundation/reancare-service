
export interface ChartOptions {
    Width    ?: number;
    Height   ?: number;
    FontSize ?: string;
    color    ?: string;
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
