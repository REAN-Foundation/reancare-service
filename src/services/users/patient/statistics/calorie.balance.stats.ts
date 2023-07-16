import { DefaultChartOptions } from "../../../../modules/charts/default.chart.options";
import { Helper } from "../../../../common/helper";
import { TimeHelper } from "../../../../common/time.helper";
import { ChartGenerator } from "../../../../modules/charts/chart.generator";
import { ChartColors, MultiBarChartOptions } from "../../../../modules/charts/chart.options";
import {
    addRectangularChartImage,
    chartExists,
    RECTANGULAR_CHART_HEIGHT,
    RECTANGULAR_CHART_WIDTH } from "./report.helper";
import { addSectionTitle, addNoDataDisplay, addLegend } from "./stat.report.commons";

//////////////////////////////////////////////////////////////////////////////////

export const addCalorieBalanceStats = (document, model, y) => {

    const chartImage = 'CalorieBalance_LastMonth';
    const detailedTitle = 'Calorie Balance for Last Month';
    const titleColor = '#505050';
    const sectionTitle = 'Calorie Balance - Consumption and Burn';

    const icon = Helper.getIconsPath('calorie-balance.png');
    y = addSectionTitle(document, y, sectionTitle, icon);

    if (!chartExists(model, chartImage)) {
        y = addNoDataDisplay(document, y);
    } else {
        y = y + 25;
        y = addRectangularChartImage(document, model, chartImage, y, detailedTitle, titleColor);
        y = y + 27;
        const colors = getCalorieBalanceColors();
        const legend = colors.map(x => {
            return {
                Key   : x.Key,
                Color : x.Color,
            };
        });
        y = addLegend(document, y, legend, 150, 11, 35, 10, 15);
    }
    return y;
};

export const createCalorieBalanceChart = async (reportModel) => {
    const calorieBalanceStats = getCalorieBalanceStats(reportModel.Stats);
    var locations = [];
    const location = await createCalorieBalance_GroupedBarChart(calorieBalanceStats, 'CalorieBalance_LastMonth');
    locations.push({
        key : 'CalorieBalance_LastMonth',
        location
    });
    return locations;
};

const createCalorieBalance_GroupedBarChart = async (stats: any, filename: string) => {
    if (stats.length === 0) {
        return null;
    }
    const temp = stats.map(c => {
        return {
            x : `"${TimeHelper.getDayOfMonthFromISODateStr(c.DayStr)}"`,
            y : c.Calories,
            z : c.Type
        };
    });
    const categoryColors = getCalorieBalanceColors();
    const categories = categoryColors.map(x => x.Key);
    const colors = categoryColors.map(x => x.Color);

    const options: MultiBarChartOptions = DefaultChartOptions.multiBarChart();
    options.Width           = RECTANGULAR_CHART_WIDTH;
    options.Height          = RECTANGULAR_CHART_HEIGHT;
    options.YLabel          = 'Calories';
    options.CategoriesCount = categories.length;
    options.Categories      = categories;
    options.Colors          = colors;
    options.FontSize        = '9px';

    return await ChartGenerator.createGroupBarChart(temp, options, filename);
};

const getCalorieBalanceColors = () => {
    const items = [
        {
            Key   : 'Consumed',
            Color : ChartColors.MediumSeaGreen,
        },
        {
            Key   : 'Burned',
            Color : ChartColors.OrangeRed,
        },
    ];
    return items;
};

const getCalorieBalanceStats = (stats) => {
    const balance = [];
    const nutrition = stats.Nutrition?.LastMonth?.CalorieStats;
    const exercise = stats.PhysicalActivity?.LastMonth?.CalorieStats;
    if (!nutrition || nutrition.length === 0) {
        return [];
    }
    if (!exercise || exercise.length === 0) {
        return [];
    }
    for (var n of nutrition) {
        balance.push({
            DayStr   : n.DayStr,
            Calories : n.Calories,
            Type     : 'Consumed'
        });
    }
    for (var n of exercise) {
        balance.push({
            DayStr   : n.DayStr,
            Calories : n.Calories,
            Type     : 'Burned'
        });
    }
    return balance;
};
