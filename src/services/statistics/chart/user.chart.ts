import { RECTANGULAR_CHART_WIDTH, SQUARE_CHART_HEIGHT, SQUARE_CHART_WIDTH } from "../../../services/users/patient/statistics/report.helper";
import { BarChartOptions, ChartColors, PieChartOptions } from "../../../modules/charts/chart.options";
import { DefaultChartOptions } from "../../../modules/charts/default.chart.options";
import { RECTANGULAR_CHART_HEIGHT } from "../../../services/users/patient/statistics/report.helper";
import { ChartGenerator } from "../../../modules/charts/chart.generator";

export const createYearWiseUserTrendCharts = async (data) => {
    var locations = [];
    const location = await createYearWiseUserTrend_BarChart(data, 'Users_OverYear');
    locations.push({
        key : 'Users_OverYear',
        location
    });
    return locations;
};

const createYearWiseUserTrend_BarChart = async (stats: any, filename: string) => {
    if (stats.length === 0) {
        return null;
    }
    const userStats = stats.map(c => {
        return {
            x : c.year,
            y : c.totalUsers
        };
    });

    const options: BarChartOptions = DefaultChartOptions.barChart();
    options.Width  = RECTANGULAR_CHART_WIDTH;
    options.Height = RECTANGULAR_CHART_HEIGHT;
    options.YLabel = 'Users Count';
    options.Color  = ChartColors.GrayDarker;
    options.XAxisTimeScaled  = false;

    return await ChartGenerator.createBarChart(userStats, options, filename);
};

export const createUsersAgeTrendCharts = async (data) => {
    var locations = [];

    if (data.length === 0) {
        return locations;
    }

    const location = await createUsersAgeTrend_PieChart(data, 'UserAge');
    locations.push({
        key : 'UserAge',
        location
    });
    return locations;
};

export const createUsersGenderTrendCharts = async (data) => {
    var locations = [];

    if (data.length === 0) {
        return locations;
    }

    const location = await createUsersGenderTrend_PieChart(data, 'UserGender');
    locations.push({
        key : 'UserGender',
        location
    });
    return locations;
};

export const createUsersGenderTrend_PieChart = async (stats: any, filename: string) => {
    if (!stats || stats.length === 0) {
        return null;
    }
    const categoryColors = getUserGenderCategoryColors();
    const colors = categoryColors.map(x => x.Color);
    const options: PieChartOptions = {
        Width  : SQUARE_CHART_WIDTH,
        Height : SQUARE_CHART_HEIGHT,
        Colors : colors,
    };
    const data = stats.filter(x => x.Count !== 0).
        map(x => ({
            name  : x.Gender,
            value : x.Count
        }));
    return await ChartGenerator.createPieChart(data, options, filename);
};

export const createUsersAgeTrend_PieChart = async (stats: any, filename: string) => {
    if (!stats || stats.length === 0) {
        return null;
    }
    const categoryColors = getUserAgeCategoryColors();
    const colors = categoryColors.map(x => x.Color);
    const options: PieChartOptions = {
        Width  : SQUARE_CHART_WIDTH,
        Height : SQUARE_CHART_HEIGHT,
        Colors : colors,
    };

    const data = stats.filter(x =>{
        if (x.Count !== 0) {
            return x;
        }
        
    }).map(x =>
        ({
            name  : x.Status,
            value : x.Count
        })
    );
    return await ChartGenerator.createPieChart(data, options, filename);
};

export const getUserGenderCategoryColors = () => {
    const items = [
        {
            Key   : 'Male',
            Color : ChartColors.MediumSeaGreen,
        },
        {
            Key   : 'Female',
            Color : ChartColors.OrangeRed,
        },
        {
            Key   : 'Intersex',
            Color : ChartColors.SlateGray,
        },
        {
            Key   : 'Not Specified',
            Color : ChartColors.BlueViolet,
        }
    ];
    return items;
};

export const getUserAgeCategoryColors = () => {
    const items = [
        {
            Key   : 'Below 35',
            Color : ChartColors.MediumSeaGreen,
        },
        {
            Key   : '36 to 70',
            Color : ChartColors.OrangeRed,
        },
        {
            Key   : 'Above 71',
            Color : ChartColors.SlateGray,
        },
        {
            Key   : 'Not Specified',
            Color : ChartColors.BlueViolet,
        }
    ];
    return items;
};
