import { Helper } from "../../../../common/helper";
import { ChartGenerator } from "../../../../modules/charts/chart.generator";
import { LineChartOptions, ChartColors, MultiLineChartOptions } from "../../../../modules/charts/chart.options";
import { DefaultChartOptions } from "../../../../modules/charts/default.chart.options";
import {
    addLabeledText,
    addLongRectangularChartImage,
    addRectangularChartImage,
    chartExists,
    RECTANGULAR_CHART_HEIGHT,
    RECTANGULAR_CHART_WIDTH } from "./report.helper";
import { addSectionTitle, addNoDataDisplay, addLegend } from "./stat.report.commons";

//////////////////////////////////////////////////////////////////////////////////

export const addBodyWeightStats = (model: any, document: PDFKit.PDFDocument, y: any) => {

    const chartImage = 'BodyWeight_Last6Months';
    var detailedTitle = 'Body Weight (Kg) Trend Over 6 Months';
    const titleColor = '#505050';
    const sectionTitle = 'Body Weight';

    const icon = Helper.getIconsPath('body-weight.png');
    y = addSectionTitle(document, y, sectionTitle, icon);

    var detailedTitle = 'Body Weight (lbs) Trend Over 6 Months';
    var startingWeight = model.Stats.Biometrics.Last6Months.BodyWeight.StartingBodyWeight * 2.20462;
    var currentWeight = model.Stats.Biometrics.Last6Months.BodyWeight.CurrentBodyWeight * 2.20462;
    var totalChange = model.Stats.Biometrics.Last6Months.BodyWeight.TotalChange * 2.20462;

    if (model.Stats.CountryCode === '+91'){
        detailedTitle = 'Body Weight (Kg) Trend Over 6 Months';
        startingWeight = model.Stats.Biometrics.Last6Months.BodyWeight.StartingBodyWeight;
        currentWeight = model.Stats.Biometrics.Last6Months.BodyWeight.CurrentBodyWeight;
        totalChange = model.Stats.Biometrics.Last6Months.BodyWeight.TotalChange;
    }
   
    if (!chartExists(model, chartImage)) {
        y = addNoDataDisplay(document, y);
    } else {
        y = y + 25;
        y = addRectangularChartImage(document, model, chartImage, y, detailedTitle, titleColor);
        y = y + 20;
    
        if (model.Stats.CountryCode === '+91') {
            let value = startingWeight.toFixed();
            y = addLabeledText(document, 'Starting Weight (Kg)', value, y);

            value = currentWeight.toFixed();
            y = addLabeledText(document, 'Current Body Weight (Kg)', value, y);

            value = totalChange.toFixed();
            y = addLabeledText(document, 'Total Change in Body Weight (Kg)', value, y);

            value = model.Stats.Biometrics.Last6Months.BodyWeight.LastMeasuredDate.toLocaleDateString();
            y = addLabeledText(document, 'Last Measured Date', value, y);
        } else {
            let value = startingWeight.toFixed();
            y = addLabeledText(document, 'Starting Weight (lbs)', value, y);

            value = currentWeight.toFixed();
            y = addLabeledText(document, 'Current Body Weight (lbs)', value, y);

            value = totalChange.toFixed();
            y = addLabeledText(document, 'Total Change in Body Weight (lbs)', value, y);

            value = model.Stats.Biometrics.Last6Months.BodyWeight.LastMeasuredDate.toLocaleDateString();
            y = addLabeledText(document, 'Last Measured Date', value, y);
        }
        
    }

    return y;
};

export const addBloodPressureStats = (model: any, document: PDFKit.PDFDocument, y: any) => {

    const chartImage = 'BloodPressure_Last6Months';
    const detailedTitle = 'Blood Pressure Trend Over 6 Months';
    const titleColor = '#505050';
    const sectionTitle = 'Blood Pressure';
    const icon = Helper.getIconsPath('blood-pressure.png');

    y = addSectionTitle(document, y, sectionTitle, icon);

    if (!chartExists(model, chartImage)) {
        y = addNoDataDisplay(document, y);
    } else {
        y = y + 25;
        y = addRectangularChartImage(document, model, chartImage, y, detailedTitle, titleColor);
        y = y + 20;

        let value = model.Stats.Biometrics.Last6Months.BloodPressure.StartingSystolicBloodPressure.toString();
        y = addLabeledText(document, 'Starting Systolic BP (mmHg)', value, y);

        value = model.Stats.Biometrics.Last6Months.BloodPressure.StartingDiastolicBloodPressure.toString();
        y = addLabeledText(document, 'Starting Diastolic BP (mmHg)', value, y);

        value = model.Stats.Biometrics.Last6Months.BloodPressure.CurrentBloodPressureSystolic.toString();
        y = addLabeledText(document, 'Current Systolic BP (mmHg)', value, y);

        value = model.Stats.Biometrics.Last6Months.BloodPressure.CurrentBloodPressureDiastolic.toString();
        y = addLabeledText(document, 'Current Diastolic BP (mmHg)', value, y);

        value = model.Stats.Biometrics.Last6Months.BloodPressure.TotalChangeSystolic.toString();
        y = addLabeledText(document, 'Total Change in Systolic BP (mmHg)', value, y);

        value = model.Stats.Biometrics.Last6Months.BloodPressure.TotalChangeDiastolic.toString();
        y = addLabeledText(document, 'Total Change in Diastolic BP (mmHg)', value, y);

        value = model.Stats.Biometrics.Last6Months.BloodPressure.LastMeasuredDate.toLocaleDateString();
        y = addLabeledText(document, 'Last Measured Date', value, y);
    }

    return y;
};

export const addBloodGlucoseStats = (model: any, document: PDFKit.PDFDocument, y: any) => {

    const chartImage = 'BloodGlucose_Last6Months';
    const detailedTitle = 'Blood Glucose Trend Over 6 Months';
    const titleColor = '#505050';
    const sectionTitle = 'Blood Glucose';
    const icon = Helper.getIconsPath('blood-sugar.png');

    y = addSectionTitle(document, y, sectionTitle, icon);

    if (!chartExists(model, chartImage)) {
        y = addNoDataDisplay(document, y);
    } else {
        y = y + 25;
        y = addRectangularChartImage(document, model, chartImage, y, detailedTitle, titleColor);
        y = y + 20;

        let value = model.Stats.Biometrics.Last6Months.BloodGlucose.StartingBloodGlucose?.toString();
        y = addLabeledText(document, 'Starting Blood Glucose (mg/dL)', value, y);

        value = model.Stats.Biometrics.Last6Months.BloodGlucose.CurrentBloodGlucose?.toString();
        y = addLabeledText(document, 'Current Blood Glucose (mg/dL)', value, y);

        value = model.Stats.Biometrics.Last6Months.BloodGlucose.TotalChange.toString();
        y = addLabeledText(document, 'Total Change in Blood Glucose (mg/dL)', value, y);

        value = model.Stats.Biometrics.Last6Months.BloodGlucose.LastMeasuredDate?.toLocaleDateString();
        y = addLabeledText(document, 'Last Measured Date', value, y);
    }

    return y;
};

export const addLipidStats = (model: any, document: PDFKit.PDFDocument, y: any) => {

    const sectionTitle = 'Lab Values';
    const icon = Helper.getIconsPath('blood-lipids.png');

    //const lipidColors = getLipidColors();

    y = addSectionTitle(document, y, sectionTitle, icon);

    const exists = chartExists(model, 'HDL_Last6Months') ||
        chartExists(model, 'LDL_Last6Months') ||
        chartExists(model, 'TotalCholesterol_Last6Months');
        //chartExists(model, 'Triglyceride_Last6Months') ||
        //chartExists(model, 'A1C_Last6Months');

    if (!exists) {
        y = addNoDataDisplay(document, y);
    } else {
        y = y + 25;
        y = addLongRectangularChartImage(document, model, 'TotalCholesterol_Last6Months', y);
        y = y + 25;
        let value = model.Stats.Biometrics.Last6Months.Lipids.TotalCholesterol.StartingTotalCholesterol.toString();
        y = addLabeledText(document, 'Starting Total Cholesterol (mg/dL)', value, y);

        value = model.Stats.Biometrics.Last6Months.Lipids.TotalCholesterol.CurrentTotalCholesterol.toString();
        y = addLabeledText(document, 'Current Total Cholesterol (mg/dL)', value, y);

        value = model.Stats.Biometrics.Last6Months.Lipids.TotalCholesterol.TotalCholesterolChange.toString();
        y = addLabeledText(document, 'Total change in Total Cholesterol (mg/dL)', value, y);

        value = model.Stats.Biometrics.Last6Months.Lipids.TotalCholesterol.LastMeasuredChol?.toLocaleDateString();
        y = addLabeledText(document, 'Last Measured Date', value, y);

        y = y + 35;
        y = addLongRectangularChartImage(document, model, 'HDL_Last6Months', y);
        y = y + 25;
        value = model.Stats.Biometrics.Last6Months.Lipids.HDL.StartingHDL.toString();
        y = addLabeledText(document, 'Starting HDL (mg/dL)', value, y);

        value = model.Stats.Biometrics.Last6Months.Lipids.HDL.CurrentHDL.toString();
        y = addLabeledText(document, 'Current HDL (mg/dL)', value, y);

        value = model.Stats.Biometrics.Last6Months.Lipids.HDL.TotalHDLChange.toString();
        y = addLabeledText(document, 'Total change in HDL (mg/dL)', value, y);

        value = model.Stats.Biometrics.Last6Months.Lipids.HDL.LastMeasuredHDL?.toLocaleDateString();
        y = addLabeledText(document, 'Last Measured Date', value, y);

        y = y + 35;
        y = addLongRectangularChartImage(document, model, 'LDL_Last6Months', y);
        y = y + 25;
        value = model.Stats.Biometrics.Last6Months.Lipids.LDL.StartingLDL.toString();
        y = addLabeledText(document, 'Starting LDL (mg/dL)', value, y);

        value = model.Stats.Biometrics.Last6Months.Lipids.LDL.CurrentLDL.toString();
        y = addLabeledText(document, 'Current LDL (mg/dL)', value, y);

        value = model.Stats.Biometrics.Last6Months.Lipids.LDL.TotalLDLChange.toString();
        y = addLabeledText(document, 'Total change in LDL (mg/dL)', value, y);

        value = model.Stats.Biometrics.Last6Months.Lipids.LDL.LastMeasuredLDL?.toLocaleDateString();
        y = addLabeledText(document, 'Last Measured Date', value, y);

    }
    return y;
};

export const addCholStats = (model: any, document: PDFKit.PDFDocument, y: any) => {

    //const sectionTitle = 'Lab Values';
    //const icon = Helper.getIconsPath('blood-lipids.png');

    const lipidColors = getLipidColors();

    //y = addSectionTitle(document, y, sectionTitle, icon);

    const exists =
        //chartExists(model, 'HDL_Last6Months') ||
        //chartExists(model, 'LDL_Last6Months') ||
        //chartExists(model, 'TotalCholesterol_Last6Months') ||
        chartExists(model, 'Triglyceride_Last6Months') ||
        chartExists(model, 'A1C_Last6Months');

    if (!exists) {
        y = addNoDataDisplay(document, y);
    } else {
        y = y + 25;
        y = addLongRectangularChartImage(document, model, 'Triglyceride_Last6Months', y);
        y = y + 25;
        let value = model.Stats.Biometrics.Last6Months.Lipids.TriglycerideLevel.StartingTriglycerideLevel.toString();
        y = addLabeledText(document, 'Starting Triglyceride Level (mg/dL)', value, y);

        value = model.Stats.Biometrics.Last6Months.Lipids.TriglycerideLevel.CurrentTriglycerideLevel.toString();
        y = addLabeledText(document, 'Current Triglyceride Level (mg/dL)', value, y);

        value = model.Stats.Biometrics.Last6Months.Lipids.TriglycerideLevel.TotalTriglycerideLevelChange.toString();
        y = addLabeledText(document, 'Total change in Triglyceride Level (mg/dL)', value, y);

        value = model.Stats.Biometrics.Last6Months.Lipids.TriglycerideLevel.LastMeasuredTrigly?.toLocaleDateString();
        y = addLabeledText(document, 'Last Measured Date', value, y);

        y = y + 55;
        y = addLongRectangularChartImage(document, model, 'A1C_Last6Months', y);
        y = y + 25;
        value = model.Stats.Biometrics.Last6Months.Lipids.A1CLevel.StartingA1CLevel.toString();
        y = addLabeledText(document, 'Starting A1C Level (%)', value, y);

        value = model.Stats.Biometrics.Last6Months.Lipids.A1CLevel.CurrentA1CLevel.toString();
        y = addLabeledText(document, 'Current A1C Level (%)', value, y);

        value = model.Stats.Biometrics.Last6Months.Lipids.A1CLevel.TotalA1CLevelChange.toString();
        y = addLabeledText(document, 'Total change in A1C Level (%)', value, y);

        value = model.Stats.Biometrics.Last6Months.Lipids.A1CLevel.LastMeasuredA1C?.toLocaleDateString();
        y = addLabeledText(document, 'Last Measured Date', value, y);

        y = y + 53;
        //y = addLegend(document, y, lipidColors, 175, 11, 100, 6, 10);
    }
    return y;
};

export const createBiometricsCharts = async (data) => {
    var locations = [];

    const bodyWeightLocations =
        await createBodyWeightCharts(data.Last6Months.BodyWeight.History, data.Last6Months.BodyWeight.CountryCode);
    locations.push(...bodyWeightLocations);
    const bloddPressureLocations = await createBloodPressureCharts(data.Last6Months.BloodPressure.History);
    locations.push(...bloddPressureLocations);
    const bloodGlucoseLocations = await createBloodGlucoseCharts(data.Last6Months.BloodGlucose.History);
    locations.push(...bloodGlucoseLocations);
    const cholesterolLocations = await createCholesterolCharts(data.Last6Months.Lipids);
    locations.push(...cholesterolLocations);

    return locations;
};

const createBodyWeightCharts = async (data, countryCode) => {
    var locations = [];
    const location = await createBodyWeight_LineChart(data, 'BodyWeight_Last6Months', countryCode);
    locations.push({
        key : 'BodyWeight_Last6Months',
        location
    });
    return locations;
};

const createBloodPressureCharts = async (data) => {
    var locations = [];
    const location = await createBloodPressure_MultiLineChart(data, 'BloodPressure_Last6Months');
    locations.push({
        key : 'BloodPressure_Last6Months',
        location
    });
    return locations;
};

const createBloodGlucoseCharts = async (data) => {
    var locations = [];
    const location = await createBloodGlucose_LineChart(data, 'BloodGlucose_Last6Months');
    locations.push({
        key : 'BloodGlucose_Last6Months',
        location
    });
    return locations;
};

const createCholesterolCharts = async (data) => {
    var locations = [];
    let location = await createTotalCholesterolChart_LineChart(data, 'TotalCholesterol_Last6Months');
    locations.push({
        key : 'TotalCholesterol_Last6Months',
        location
    });
    location = await createHDLChart_LineChart(data, 'HDL_Last6Months');
    locations.push({
        key : 'HDL_Last6Months',
        location
    });
    location = await createLDLChart_LineChart(data, 'LDL_Last6Months');
    locations.push({
        key : 'LDL_Last6Months',
        location
    });
    location = await createA1CChart_LineChart(data, 'A1C_Last6Months');
    locations.push({
        key : 'A1C_Last6Months',
        location
    });
    location = await createTriglycerideChart_LineChart(data, 'Triglyceride_Last6Months');
    locations.push({
        key : 'Triglyceride_Last6Months',
        location
    });
    return locations;
};

const createLipidChart = async (
    stats: any[], filename: string, key: string, yLabelValue: string, showXAxis = true, chartHeight = 150
) => {
    const getRecords = (c) => {
        return {
            x : new Date(c.DayStr),
            y : c.PrimaryValue,
        };
    };

    const records = stats.map(getRecords);
    if (records.length === 0) {
        return null;
    }

    const categoryColors = getLipidColors();
    const options: LineChartOptions = DefaultChartOptions.lineChart();
    options.Width = RECTANGULAR_CHART_WIDTH;
    options.Height = chartHeight;
    options.XAxisTimeScaled = true;
    options.YLabel = yLabelValue;
    options.StrokeWidth = 1.5;
    const clr = categoryColors.find(x => x.Key === key);
    options.Color = clr.Color;
    options.ShowXAxis = showXAxis;

    return await ChartGenerator.createLineChart(records, options, filename);
};

const createTotalCholesterolChart_LineChart = async (stats: any, filename: string) => {
    return await createLipidChart(stats.History.TotalCholesterol, filename, 'Total Cholesterol', 'mg/dL');
};

const createHDLChart_LineChart = async (stats: any, filename: string) => {
    return await createLipidChart(stats.History.HDL, filename, 'HDL', 'mg/dL');
};

const createLDLChart_LineChart = async (stats: any, filename: string) => {
    return await createLipidChart(stats.History.LDL, filename, 'LDL', 'mg/dL');
};

const createTriglycerideChart_LineChart = async (stats: any, filename: string) => {
    return await createLipidChart(stats.History.TriglycerideLevel, filename, 'Triglyceride Level', 'mg/dL',true);
};

const createA1CChart_LineChart = async (stats: any, filename: string) => {
    return await createLipidChart(stats.History.A1CLevel, filename, 'A1C Level', '%', true);
};

const createBodyWeight_LineChart = async (stats: any, filename: string, countryCode: string) => {
    if (stats.length === 0) {
        return null;
    }
    var options: LineChartOptions = DefaultChartOptions.lineChart();
    var temp = stats.map(c => {
        return {
            x : new Date(c.DayStr),
            y : c.BodyWeight
        };
    });
    options.YLabel = 'Kg';

    if (countryCode !== '+91') {
        options.YLabel = 'lbs';
        temp = stats.map(c => {
            return {
                x : new Date(c.DayStr),
                y : c.BodyWeight * 2.20462
            };
        });
    }

    options.Width = RECTANGULAR_CHART_WIDTH;
    options.Height = RECTANGULAR_CHART_HEIGHT;
    options.XAxisTimeScaled = true;

    return await ChartGenerator.createLineChart(temp, options, filename);
};

const createBloodGlucose_LineChart = async (stats: any, filename: string) => {
    if (stats.length === 0) {
        return null;
    }
    const temp = stats.map(c => {
        return {
            x : new Date(c.DayStr),
            y : c.BloodGlucose
        };
    });
    const options: LineChartOptions = DefaultChartOptions.lineChart();
    options.Width = RECTANGULAR_CHART_WIDTH;
    options.Height = RECTANGULAR_CHART_HEIGHT;
    options.Color = ChartColors.BlueViolet;
    options.XAxisTimeScaled = true;
    options.YLabel = 'mg/dL';
    return await ChartGenerator.createLineChart(temp, options, filename);
};

const createBloodPressure_MultiLineChart = async (stats: any, filename: string) => {
    if (stats.length === 0) {
        return null;
    }
    const temp = [];
    for (var c of stats) {
        temp.push({
            x : new Date(c.DayStr),
            y : c.Diastolic,
            z : 'Diastolic'
        });
        temp.push({
            x : new Date(c.DayStr),
            y : c.Systolic,
            z : 'Systolic'
        });
    }
    const options: MultiLineChartOptions = DefaultChartOptions.multiLineChart();
    options.Width = RECTANGULAR_CHART_WIDTH;
    options.Height = RECTANGULAR_CHART_HEIGHT;
    options.XAxisTimeScaled = true;
    const categoryColors = getBloodPressureTypeColors();
    const categories = categoryColors.map(x => x.Key);
    const colors = categoryColors.map(x => x.Color);
    options.Categories = categories;
    options.Colors = colors;
    options.YLabel = 'mmHg';

    return await ChartGenerator.createMultiLineChart(temp, options, filename);
};

const getLipidColors = () => {
    const items = [
        {
            Key   : 'Total Cholesterol',
            Color : ChartColors.DodgerBlue,
        },
        {
            Key   : 'HDL',
            Color : ChartColors.MediumSeaGreen,
        },
        {
            Key   : 'LDL',
            Color : ChartColors.OrangeRed,
        },
        {
            Key   : 'Triglyceride Level',
            Color : ChartColors.DarkSlateGray,
        },
        {
            Key   : 'A1C Level',
            Color : ChartColors.DodgerBlue,
        },
    ];
    return items;
};

const getBloodPressureTypeColors = () => {
    const items = [
        {
            Key   : 'Diastolic',
            Color : ChartColors.MediumSeaGreen,
        },
        {
            Key   : 'Systolic',
            Color : ChartColors.DodgerBlue,
        },
    ];
    return items;
};

// const createCholesterolCharts_MultiLineChart = async (stats: any, filename: string) => {

//     const getRecords = (c) => {
//         return {
//             x : new Date(c.DayStr),
//             y : c.PrimaryValue,
//             z : c.DisplayName,
//         };
//     };

//     const temp = [];
//     let records = [];

//     records = stats.TotalCholesterol.map(getRecords);
//     temp.push(...records);
//     records = stats.HDL.map(getRecords);
//     temp.push(...records);
//     records = stats.LDL.map(getRecords);
//     temp.push(...records);
//     records = stats.TriglycerideLevel.map(getRecords);
//     temp.push(...records);
//     records = stats.A1CLevel.map(getRecords);
//     temp.push(...records);

//     if (temp.length === 0) {
//         return null;
//     }

//     const categoryColors = getLipidColors();
//     const categories = categoryColors.map(x => x.Key);
//     const colors = categoryColors.map(x => x.Color);
//     const options: MultiLineChartOptions = DefaultChartOptions.multiLineChart();
//     options.Width = RECTANGULAR_CHART_WIDTH;
//     options.Height = RECTANGULAR_CHART_HEIGHT;
//     options.XAxisTimeScaled = true;
//     options.YLabel = '';
//     options.StrokeWidth = 1.5;
//     options.Colors = colors;
//     options.Categories = categories;

//     return await ChartGenerator.createMultiLineChart(temp, options, filename);
// };
