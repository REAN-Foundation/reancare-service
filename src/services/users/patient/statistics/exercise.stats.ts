import { DefaultChartOptions } from "../../../../modules/charts/default.chart.options";
import { Helper } from "../../../../common/helper";
import { TimeHelper } from "../../../../common/time.helper";
import { ChartGenerator } from "../../../../modules/charts/chart.generator";
import { BarChartOptions, ChartColors, PieChartOptions } from "../../../../modules/charts/chart.options";
import {
    addRectangularChartImage,
    addSquareChartImage,
    chartExists,
    RECTANGULAR_CHART_HEIGHT,
    RECTANGULAR_CHART_WIDTH,
    SQUARE_CHART_HEIGHT,
    SQUARE_CHART_WIDTH } from "./report.helper";
import { addSectionTitle, addNoDataDisplay } from "./stat.report.commons";

//////////////////////////////////////////////////////////////////////////////////

export const addExerciseStats = (document, model, y) => {

    // let chartImage = 'Exercise_CaloriesBurned_LastMonth';
    // let detailedTitle = 'Calories Burned for Last Month';
    // const titleColor = '#505050';
    // const sectionTitle = 'Exercise and Physical Activity';
    // const icon = Helper.getIconsPath('exercise.png');

    // y = addSectionTitle(document, y, sectionTitle, icon);

    // if (!chartExists(model, chartImage)) {
    //     y = addNoDataDisplay(document, y);
    // } else {
    //     y = y + 25;
    //     y = addRectangularChartImage(document, model, chartImage, y, detailedTitle, titleColor);
    //     y = y + 23;
    // }

    let chartImage = 'Exercise_MoveMinutes_LastMonth';
    const detailedTitle = 'Move Minutes for Last Month';
    const titleColor = '#505050';
    const sectionTitle = 'Exercise and Physical Activity';
    const icon = Helper.getIconsPath('exercise.png');

    y = addSectionTitle(document, y, sectionTitle, icon);

    if (!chartExists(model, chartImage)) {
        y = addNoDataDisplay(document, y);
    } else {
        y = y + 25;
        y = addRectangularChartImage(document, model, chartImage, y, detailedTitle, titleColor);
        y = y + 23;
    }

    /*chartImage = 'Exercise_Questionnaire_LastMonth';
    detailedTitle = 'Daily Movements Questionnaire for Last Month';
    if (!chartExists(model, chartImage)) {
        y = addNoDataDisplay(document, y);
    } else {
        y = y + 23;
        y = addRectangularChartImage(document, model, chartImage, y, detailedTitle, titleColor);
        y = y + 32;
    } */

    y = y + 100;
    chartImage = 'Exercise_Questionnaire_Overall_LastMonth';

    if (!chartExists(model, chartImage)) {
        y = addNoDataDisplay(document, y);
    } else {
        y = addSquareChartImage(document, model, chartImage, y, 'Daily Movements', titleColor, 165, 225);
    }
    return y;
};

export const createPhysicalActivityCharts = async (data) => {
    var locations = [];
    let location = '';

    location = await createExerciseCalorieForMonth_BarChart(data.LastMonth.CalorieStats, 'Exercise_CaloriesBurned_LastMonth');
    locations.push({
        key : 'Exercise_CaloriesBurned_LastMonth',
        location
    });

    location = await createExerciseMoveMinutesForMonth_BarChart(data.LastMonth.CalorieStats, 'Exercise_CaloriesBurned_LastMonth');
    locations.push({
        key : 'Exercise_MoveMinutes_LastMonth',
        location
    });

    location = await createExerciseQuestionForMonth_BarChart(data.LastMonth.QuestionnaireStats.Stats, 'Exercise_Questionnaire_LastMonth');
    locations.push({
        key : 'Exercise_Questionnaire_LastMonth',
        location
    });

    location = await createExerciseQuestions_DonutChart(data.LastMonth.QuestionnaireStats.Stats, 'Exercise_Questionnaire_Overall_LastMonth');
    locations.push({
        key : 'Exercise_Questionnaire_Overall_LastMonth',
        location
    });

    return locations;
};

const createExerciseCalorieForMonth_BarChart = async (stats: any, filename: string) => {
    if (stats.length === 0) {
        return null;
    }
    const calorieStats = stats.map(c => {
        return {
            x : `"${TimeHelper.getDayOfMonthFromISODateStr(c.DayStr)}"`,
            y : c.Calories
        };
    });
    const options: BarChartOptions = DefaultChartOptions.barChart();
    options.Width  = RECTANGULAR_CHART_WIDTH;
    options.Height = RECTANGULAR_CHART_HEIGHT;
    options.YLabel = 'Calories Burned';
    options.Color  = ChartColors.OrangeRed;

    return await ChartGenerator.createBarChart(calorieStats, options, filename);
};

const createExerciseMoveMinutesForMonth_BarChart = async (stats: any, filename: string) => {
    if (stats.length === 0) {
        return null;
    }
    const calorieStats = stats.map(c => {
        return {
            x : new Date(c.DayStr),
            y : c.MoveMinutes
        };
    });
    const options: BarChartOptions = DefaultChartOptions.barChart();
    options.Width  = RECTANGULAR_CHART_WIDTH;
    options.Height = RECTANGULAR_CHART_HEIGHT;
    options.YLabel = 'Minutes/day';
    options.Color  = ChartColors.OrangeRed;
    options.FontSize = '12px';
    options.XAxisTimeScaled  = true;

    return await ChartGenerator.createBarChart(calorieStats, options, filename);
};

const createExerciseQuestionForMonth_BarChart = async (stats: any, filename: string) => {
    if (stats.length === 0) {
        return null;
    }
    const calorieStats = stats.map(c => {
        return {
            x : `"${TimeHelper.getDayOfMonthFromISODateStr(c.DayStr)}"`,
            y : c.Response
        };
    });
    const options: BarChartOptions = DefaultChartOptions.barChart();
    options.Width  = RECTANGULAR_CHART_WIDTH;
    options.Height = RECTANGULAR_CHART_HEIGHT;
    options.YLabel = 'User Response';
    options.Color  = ChartColors.MediumSeaGreen;
    options.ShowYAxis = false;

    return await ChartGenerator.createBarChart(calorieStats, options, filename);
};

const createExerciseQuestions_DonutChart = async (stats: any, filename: string) => {
    if (stats.length === 0) {
        return null;
    }
    const yesCount = stats.filter(c => c.Response === 1).length;
    const noCount = stats.filter(c => c.Response === 0).length;
    const options: PieChartOptions = {
        Width  : SQUARE_CHART_WIDTH,
        Height : SQUARE_CHART_HEIGHT,
        Colors : [
            ChartColors.MediumSeaGreen,
            ChartColors.OrangeRed,
            ChartColors.DodgerBlue,
        ],
    };
    const data = [
        {
            name  : "Yes",
            value : yesCount,
        },
        {
            name  : "No",
            value : noCount,
        }
    ];
    return await ChartGenerator.createDonutChart(data, options, filename);
};
