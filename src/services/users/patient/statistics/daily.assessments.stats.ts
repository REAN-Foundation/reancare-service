import { Helper } from "../../../../common/helper";
import { ChartGenerator } from "../../../../modules/charts/chart.generator";
import { ChartColors, PieChartOptions } from "../../../../modules/charts/chart.options";
import {
    addSquareChartImage,
    addSquareChartImageWithLegend,
    chartExists,
    constructDonutChartData,
    findKeyCounts,
    SQUARE_CHART_HEIGHT,
    SQUARE_CHART_WIDTH } from "./report.helper";
import { addSectionTitle, addNoDataDisplay, addText, addLegend } from "./stat.report.commons";

//////////////////////////////////////////////////////////////////////////////////

export const addDailyAssessmentsStats = (document, model, y) => {

    let chartImage = 'DailyAssessments_Feelings_Last6Months';
    const titleColor = '#505050';
    const sectionTitle = 'Moods and Symptoms';
    const icon = Helper.getIconsPath('feelings.png');

    y = addSectionTitle(document, y, sectionTitle, icon);

    if (!chartExists(model, chartImage)) {
        y = addNoDataDisplay(document, y);
    } else {
        y = y + 25;
        const legend = getFeelingsColors();
        chartImage = 'DailyAssessments_Feelings_Last6Months';
        const title = 'Feelings Over Last 6 Months';
        y = addSquareChartImageWithLegend(document, model, chartImage, y, title, titleColor, legend, 40, 150);
    }

    y = addMoodsStats(document, model, y, titleColor);

    if (!chartExists(model, chartImage)) {
        y = addNoDataDisplay(document, y);
    } else {
        y = y + 17;
        chartImage = 'DailyAssessments_EnergyLevels_Last6Months';
        const title = 'Energy Levels Over Last 6 Months';
        y = addSquareChartImage(document, model, chartImage, y, title, titleColor, 195, 205);
    }
    return y;
};

const addMoodsStats = (
    document: PDFKit.PDFDocument,
    model: any,
    y: any,
    titleColor: string
) => {

    y = y + 35;

    const chartImage = 'DailyAssessments_Moods_Last6Months';
    const startX = 125;
    const imageWidth = 140;
    const title = 'Moods Over Last 6 Months';
    const legend = getMoodsColors();
    const yFrozen = y;

    if (!chartExists(model, chartImage)) {
        y = addNoDataDisplay(document, y);
    } else {
        const chart = model.ChartImagePaths.find(x => x.key === chartImage);
        document.image(chart.location, startX, y, { width: imageWidth, align: 'center' });
        document.fontSize(7);
        document.moveDown();

        y = yFrozen + imageWidth + 20;
        addText(document, title, 80, y, 12, titleColor, 'center');

        y = y + 53;
        const legendStartX = startX + 200;
        y = addLegend(document, yFrozen, legend, legendStartX, 11, 45, 5, 5, 12);
        y = yFrozen + imageWidth + 20; //Image height
    }
    return y;
};

export const createDailyAssessentCharts = async (data) => {
    var locations = [];

    let location = await createFeelings_DonutChart(data.Last6Months, 'DailyAssessments_Feelings_Last6Months');
    locations.push({
        key : 'DailyAssessments_Feelings_Last6Months',
        location
    });
    location = await createMoods_DonutChart(data.Last6Months, 'DailyAssessments_Moods_Last6Months');
    locations.push({
        key : 'DailyAssessments_Moods_Last6Months',
        location
    });
    location = await createEnergyLevels_BubbleChart(data.Last6Months, 'DailyAssessments_EnergyLevels_Last6Months');
    locations.push({
        key : 'DailyAssessments_EnergyLevels_Last6Months',
        location
    });

    return locations;
};

export const createFeelings_DonutChart = async (stats: any, filename: string) => {
    if (!stats || stats.length === 0) {
        return null;
    }
    const feelings_ = stats.map(x => x.Feeling);

    const tempFeelings = findKeyCounts(feelings_);
    tempFeelings['Better'] = ((tempFeelings['Better'] / feelings_.length) * 100).toFixed(2);
    tempFeelings['Same'] = ((tempFeelings['Same'] / feelings_.length) * 100).toFixed(2);
    tempFeelings['Unspecified'] = ((tempFeelings['Unspecified'] / feelings_.length) * 100).toFixed(2);
    tempFeelings['Worse'] = ((tempFeelings['Worse'] / feelings_.length) * 100).toFixed(2);
    const feelings = Helper.sortObjectKeysAlphabetically(tempFeelings);
    const feelingsColors = getFeelingsColors();
    const colors = feelingsColors.map(x => x.Color);
    const options: PieChartOptions = {
        Width  : SQUARE_CHART_WIDTH,
        Height : SQUARE_CHART_HEIGHT,
        Colors : colors,
    };
    const data = constructDonutChartData(feelings);
    return await ChartGenerator.createDonutChart(data, options, filename);
};

const createMoods_DonutChart = async (stats: any, filename: string) => {
    if (stats.length === 0) {
        return null;
    }
    const moods_ = stats.map(x => x.Mood);
    const tempMoods = findKeyCounts(moods_);
    const moods = Helper.sortObjectKeysAlphabetically(tempMoods);
    const moodsColors = getMoodsColors();
    const colors = moodsColors.map(x => x.Color);
    const options: PieChartOptions = {
        Width  : SQUARE_CHART_WIDTH,
        Height : SQUARE_CHART_HEIGHT,
        Colors : colors,
    };
    const data = constructDonutChartData(moods);
    return await ChartGenerator.createDonutChart(data, options, filename);
};

const createEnergyLevels_BubbleChart = async (stats: any, filename: string) => {
    if (stats.length === 0) {
        return null;
    }
    const energyLevels_ = stats.map(x => x.EnergyLevels);
    const e_ = [];
    for (var x of energyLevels_) {
        e_.push(...x);
    }
    const tempEnergyLevels = findKeyCounts(e_);
    const energyLevels = Helper.sortObjectKeysAlphabetically(tempEnergyLevels);
    const options: PieChartOptions = {
        Width  : SQUARE_CHART_WIDTH,
        Height : SQUARE_CHART_HEIGHT,
    };
    const data = constructDonutChartData(energyLevels);
    return await ChartGenerator.createBubbleChart(data, options, filename);
};

export const getFeelingsColors = () => {
    const items = [
        {
            Key   : 'Better',
            Color : ChartColors.MediumSeaGreen,
        },
        {
            Key   : 'Same',
            Color : ChartColors.DodgerBlue,
        },
        {
            Key   : 'Unspecified',
            Color : ChartColors.Charcoal,
        },
        {
            Key   : 'Worse',
            Color : ChartColors.OrangeRed,
        }
    ];
    return items;
};

export const getMoodsColors = () => {
    const items = [
        {
            Key   : 'Angry',
            Color : ChartColors.OrangeRed,
        },
        {
            Key   : 'Anxious',
            Color : ChartColors.DarkSlateBlue,
        },
        {
            Key   : 'Calm',
            Color : ChartColors.DodgerBlue,
        },
        {
            Key   : 'Fearful',
            Color : ChartColors.DarkTurquoise,
        },
        {
            Key   : 'Happy',
            Color : ChartColors.MediumSeaGreen,
        },
        {
            Key   : 'Hopeful',
            Color : ChartColors.OrangeRed,
        },
        {
            Key   : 'Lonely',
            Color : ChartColors.Charcoal,
        },
        {
            Key   : 'Sad',
            Color : ChartColors.SteelBlue,
        },
        {
            Key   : 'Status Quo',
            Color : ChartColors.Brown,
        },
        {
            Key   : 'Stressed',
            Color : ChartColors.Violet,
        },
        {
            Key   : 'Unspecified',
            Color : ChartColors.SlateGray,
        },
    ];
    return items;
};
