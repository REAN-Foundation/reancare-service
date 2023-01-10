import { Helper } from "../../../../common/helper";
import { TimeHelper } from "../../../../common/time.helper";
import { ChartGenerator } from "../../../../modules/charts/chart.generator";
import { ChartColors, MultiBarChartOptions, PieChartOptions, CircularProgressChartOptions } from "../../../../modules/charts/chart.options";
import { DefaultChartOptions } from "../../../../modules/charts/default.chart.options";
import {
    addLabeledText,
    addRectangularChartImage,
    addSquareChartImage,
    chartExists,
    RECTANGULAR_CHART_HEIGHT,
    RECTANGULAR_CHART_WIDTH,
    SQUARE_CHART_HEIGHT,
    SQUARE_CHART_WIDTH } from "./report.helper";
import { addSectionTitle, addNoDataDisplay } from "./stat.report.commons";

//////////////////////////////////////////////////////////////////////////////////

export const addUserTasksStats = (document, model, y) => {

    let chartImage = 'UserTasks_LastMonth';
    let detailedTitle = 'User Tasks Status for Last Month';
    const titleColor = '#505050';
    let sectionTitle = 'User Tasks Status History';
    let icon = Helper.getIconsPath('user-tasks.png');

    y = addSectionTitle(document, y, sectionTitle, icon);

    if (!chartExists(model, chartImage)) {
        y = addNoDataDisplay(document, y);
    } else {
        y = y + 25;
        y = addRectangularChartImage(document, model, chartImage, y, detailedTitle, titleColor);
        y = y + 23;
    }

    sectionTitle = 'User Engagement';
    icon = Helper.getIconsPath('user-activity.png');
    y = addSectionTitle(document, y, sectionTitle, icon);

    chartImage = 'UserEngagementRatio_Last6Months';
    detailedTitle = 'User Engagement Ratio for Last 6 Months';

    if (!chartExists(model, chartImage)) {
        y = addNoDataDisplay(document, y);
    } else {
        y = y + 23;
        y = addSquareChartImage(document, model, chartImage, y, detailedTitle, titleColor, 165, 225);
        y = y + 23;
        let value = model.Stats.UserEngagement.Last6Months.Finished.toFixed();
        y = addLabeledText(document, 'Completed Tasks', value, y);
        value = model.Stats.UserEngagement.Last6Months.Unfinished.toFixed();
        y = addLabeledText(document, 'Unfinished Tasks', value, y);
    }

    y = y + 50;

    const text = `User Engagement Ratio = (Completed Tasks/(Completed Tasks + Unfinished Tasks)) * 100`;
    document
        .font('Helvetica')
        .fontSize(10)
        .text(text, 100, y, { align: "left" })
        .moveDown();

    return y;
};

export const createUserTaskCharts = async (data) => {
    var locations = [];

    let location = await createUserTasks_StackedBarChart(data.LastMonth.TaskStats, 'UserTasks_LastMonth');
    locations.push({
        key : 'UserTasks_LastMonth',
        location
    });
    location = await createUserEngagement_DonutChart(data.Last6Months, 'UserEngagement_Last6Months');
    locations.push({
        key : 'UserEngagement_Last6Months',
        location
    });
    location = await createUserEngagement_CircularProgress(data.Last6Months, 'UserEngagementRatio_Last6Months');
    locations.push({
        key : 'UserEngagementRatio_Last6Months',
        location
    });
    return locations;
};

const createUserEngagement_DonutChart = async (stats: any, filename: string) => {
    if (stats == null) {
        return null;
    }
    const options: PieChartOptions = {
        Width  : SQUARE_CHART_WIDTH,
        Height : SQUARE_CHART_HEIGHT,
        Colors : [
            ChartColors.MediumSeaGreen,
            ChartColors.Coral,
        ],
    };
    const data = [
        {
            name  : "Finished",
            value : stats.Finished,
        },
        {
            name  : "Unfinished",
            value : stats.Unfinished,
        }
    ];
    return await ChartGenerator.createDonutChart(data, options, filename);
};

const createUserEngagement_CircularProgress = async (stats: any, filename: string) => {
    const total = stats.Finished + stats.Unfinished;
    if (total === 0) {
        return null;
    }
    const percentage = (stats.Finished / total) * 100;
    const options: CircularProgressChartOptions = DefaultChartOptions.circularProgress();
    options.Width  = SQUARE_CHART_WIDTH;
    options.Height = SQUARE_CHART_HEIGHT;
    options.GradientColor1 = ChartColors.MediumSeaGreen;
    options.GradientColor2 = ChartColors.DodgerBlue;
    options.PathColor      = '#404F70';
    return await ChartGenerator.createCircularProgressChart(percentage, options, filename);
};

const createUserTasks_StackedBarChart = async (stats: any, filename: string) => {
    if (stats.length === 0) {
        return null;
    }
    const temp = [];
    for (var c of stats) {
        temp.push({
            x : `"${TimeHelper.getDayOfMonthFromISODateStr(c.DayStr)}"`,
            y : c.Finished,
            z : 'Finished'
        });
        temp.push({
            x : `"${TimeHelper.getDayOfMonthFromISODateStr(c.DayStr)}"`,
            y : c.Unfinished,
            z : 'Unfinished'
        });
    }
    const categoryColors = getUserTaskStatusColors();
    const categories = categoryColors.map(x => x.Key);
    const colors = categoryColors.map(x => x.Color);

    const options: MultiBarChartOptions =  DefaultChartOptions.multiBarChart();
    options.Width           = RECTANGULAR_CHART_WIDTH;
    options.Height          = RECTANGULAR_CHART_HEIGHT;
    options.YLabel          = 'User Response';
    options.CategoriesCount = 2;
    options.Categories      = categories;
    options.Colors          = colors;
    options.FontSize        = '9px';

    return await ChartGenerator.createStackedBarChart(temp, options, filename);
};

const getUserTaskStatusColors = () => {
    const items = [
        {
            Key   : 'Finished',
            Color : ChartColors.MediumSeaGreen,
        },
        {
            Key   : 'Unfinished',
            Color : ChartColors.Coral,
        },
    ];
    return items;
};
