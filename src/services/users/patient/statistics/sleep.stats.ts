import { Helper } from "../../../../common/helper";
import { TimeHelper } from "../../../../common/time.helper";
import { ChartGenerator } from "../../../../modules/charts/chart.generator";
import { BarChartOptions, ChartColors } from "../../../../modules/charts/chart.options";
import {
    addLabeledText,
    addRectangularChartImage,
    chartExists,
    RECTANGULAR_CHART_HEIGHT,
    RECTANGULAR_CHART_WIDTH } from "./report.helper";
import { addNoDataDisplay, addSectionTitle } from "./stat.report.commons";
import { DefaultChartOptions } from "../../../../modules/charts/default.chart.options";

//////////////////////////////////////////////////////////////////////////////////

export const addSleepStats = (model, document, y) => {

    const chartImage = 'SleepHours_LastMonth';
    const detailedTitle = 'Sleep in Hours for Last Month';
    const titleColor = '#505050';
    const sectionTitle = 'Sleep History';
    const icon = Helper.getIconsPath('sleep.png');

    y = addSectionTitle(document, y, sectionTitle, icon);

    if (!chartExists(model, chartImage)) {
        y = addNoDataDisplay(document, y);
    } else {
        y = y + 25;
        y = addRectangularChartImage(document, model, chartImage, y, detailedTitle, titleColor);
        y = y + 23;
        const value = model.Stats.Sleep.AverageForLastMonth?.toString();
        y = addLabeledText(document, 'Average Sleep (Hours)', value, y);
    }
    return y;
};

export const createSleepTrendCharts = async (data) => {
    var locations = [];
    const location = await createSleepTrend_BarChart(data.LastMonth, 'SleepHours_LastMonth');
    locations.push({
        key : 'SleepHours_LastMonth',
        location
    });
    return locations;
};

const createSleepTrend_BarChart = async (stats: any, filename: string) => {
    if (stats.length === 0) {
        return null;
    }
    const sleepStats = stats.map(c => {
        return {
            x : `"${TimeHelper.getDayOfMonthFromISODateStr(c.DayStr)}"`,
            y : c.SleepDuration
        };
    });
    const options: BarChartOptions = DefaultChartOptions.barChart();
    options.Width  = RECTANGULAR_CHART_WIDTH;
    options.Height = RECTANGULAR_CHART_HEIGHT;
    options.YLabel = 'Sleep in Hours';
    options.Color  = ChartColors.GrayDarker;

    return await ChartGenerator.createBarChart(sleepStats, options, filename);
};
