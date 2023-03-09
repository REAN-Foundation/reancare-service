import { TimeHelper } from "../../../../common/time.helper";
import { Helper } from "../../../../common/helper";
import { ChartGenerator } from "../../../../modules/charts/chart.generator";
import { LineChartOptions, ChartColors, MultiLineChartOptions, MultiBarChartOptions, PieChartOptions } from "../../../../modules/charts/chart.options";
import { DefaultChartOptions } from "../../../../modules/charts/default.chart.options";
import { createFeelings_DonutChart, getFeelingsColors } from "./daily.assessments.stats";
import { createMedicationConsumption_DonutChart } from "./medication.stats";
import { getNutritionQuestionCategoryColors } from "./nutrition.stats";
import {
    addLabeledText,
    addLongRectangularChartImage,
    addRectangularChartImage,
    chartExists,
    constructDonutChartData,
    findKeyCounts,
    RECTANGULAR_CHART_HEIGHT,
    RECTANGULAR_CHART_WIDTH,
    SQUARE_CHART_HEIGHT,
    SQUARE_CHART_WIDTH} from "./report.helper";
import { addSectionTitle, addNoDataDisplay, addLegend } from "./stat.report.commons";

//////////////////////////////////////////////////////////////////////////////////

export const addSummaryPageAPart1 = (model: any, document: PDFKit.PDFDocument, y: any) => {

    const chartImage = 'BodyWeight_Last6Months';
    var detailedTitle = 'Body Weight (Kg) Trend Over 6 Months';
    const titleColor = '#505050';
    const sectionTitle = 'Body Weight';
    const icon = Helper.getIconsPath('body-weight.png');
    y = addSectionTitle(document, y, sectionTitle, icon);

    if (model.Stats.CountryCode === '+91'){
        var startingWeight = model.Stats.Biometrics.Last6Months.BodyWeight.StartingBodyWeight;
        var currentWeight = model.Stats.Biometrics.Last6Months.BodyWeight.CurrentBodyWeight;
        var totalChange = model.Stats.Biometrics.Last6Months.BodyWeight.TotalChange;
    } else {
        detailedTitle = 'Body Weight (lbs) Trend Over 6 Months';
        startingWeight = model.Stats.Biometrics.Last6Months.BodyWeight.StartingBodyWeight * 2.20462;
        currentWeight = model.Stats.Biometrics.Last6Months.BodyWeight.CurrentBodyWeight * 2.20462;
        totalChange = model.Stats.Biometrics.Last6Months.BodyWeight.TotalChange * 2.20462;
    }

    if (!chartExists(model, chartImage)) {
        y = addNoDataDisplay(document, y);
    } else {
        y = y + 25;
        y = addRectangularChartImage(document, model, chartImage, y, detailedTitle, titleColor);
        y = y + 20;

        let value = startingWeight.toFixed();
        y = addLabeledText(document, 'Starting Weight (Kg)', value, y);

        value = currentWeight.toFixed();
        y = addLabeledText(document, 'Current Body Weight (Kg)', value, y);

        value = totalChange.toFixed();
        y = addLabeledText(document, 'Total Change in Body Weight (Kg)', value, y);

        value = model.Stats.Biometrics.Last6Months.BodyWeight.LastMeasuredDate.toLocaleDateString();
        y = addLabeledText(document, 'Last Measured Date', value, y);
    }

    return y;
};

export const addSummaryPageAPart2 = (model: any, document: PDFKit.PDFDocument, y: any) => {

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

export const addSummaryPageBPart1 = (model: any, document: PDFKit.PDFDocument, y: any) => {

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

export const addSummaryPageBPart2 = (model: any, document: PDFKit.PDFDocument, y: any) => {

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
        let value = model.Stats.Biometrics.Last6Months.TotalCholesterol.StartingTotalCholesterol.toString();
        y = addLabeledText(document, 'Starting Total Cholesterol (mg/dL)', value, y);

        value = model.Stats.Biometrics.Last6Months.TotalCholesterol.CurrentTotalCholesterol.toString();
        y = addLabeledText(document, 'Current Total Cholesterol (mg/dL)', value, y);

        value = model.Stats.Biometrics.Last6Months.TotalCholesterol.TotalCholesterolChange.toString();
        y = addLabeledText(document, 'Total change in Total Cholesterol (mg/dL)', value, y);

        value = model.Stats.Biometrics.Last6Months.TotalCholesterol.LastMeasuredChol?.toLocaleDateString();
        y = addLabeledText(document, 'Last Measured Date', value, y);

        y = y + 35;
        y = addLongRectangularChartImage(document, model, 'HDL_Last6Months', y);
        y = y + 25;
        value = model.Stats.Biometrics.Last6Months.HDL.StartingHDL.toString();
        y = addLabeledText(document, 'Starting HDL (mg/dL)', value, y);

        value = model.Stats.Biometrics.Last6Months.HDL.CurrentHDL.toString();
        y = addLabeledText(document, 'Current HDL (mg/dL)', value, y);

        value = model.Stats.Biometrics.Last6Months.HDL.TotalHDLChange.toString();
        y = addLabeledText(document, 'Total change in HDL (mg/dL)', value, y);

        value = model.Stats.Biometrics.Last6Months.HDL.LastMeasuredHDL?.toLocaleDateString();
        y = addLabeledText(document, 'Last Measured Date', value, y);

        y = y + 35;
        y = addLongRectangularChartImage(document, model, 'LDL_Last6Months', y);
        y = y + 25;
        value = model.Stats.Biometrics.Last6Months.LDL.StartingLDL.toString();
        y = addLabeledText(document, 'Starting LDL (mg/dL)', value, y);

        value = model.Stats.Biometrics.Last6Months.LDL.CurrentLDL.toString();
        y = addLabeledText(document, 'Current LDL (mg/dL)', value, y);

        value = model.Stats.Biometrics.Last6Months.LDL.TotalLDLChange.toString();
        y = addLabeledText(document, 'Total change in LDL (mg/dL)', value, y);

        value = model.Stats.Biometrics.Last6Months.LDL.LastMeasuredLDL?.toLocaleDateString();
        y = addLabeledText(document, 'Last Measured Date', value, y);

    }
    return y;
};

export const createSummaryCharts = async (data) => {
    var locations = [];

    var loc = await createMedAdherenceSummaryChart(data.LastMonth.Medication.History);
    locations.push(...loc);
    loc = await createWeightSummaryChart(data.LastMonth.BodyWeight.History, data.LastMonth.BodyWeight.CountryCode);
    locations.push(...loc);
    loc = await createNutritionSummaryChart(data.LastMonth.Nutrition.History);
    locations.push(...loc);
    loc = await createSymptomsSummaryChart(data.LastMonth.Symptom);
    locations.push(...loc);
    loc = await createMoodsSummaryChart(data.LastMonth.Moods);
    locations.push(...loc);

    return locations;
};

const createMedAdherenceSummaryChart = async (data) => {
    var locations = [];
    var location = await createMedicationConsumption_DonutChart(data.LastMonth.Daily, 'MedicationsSummary_LastMonth');
    locations.push({
        key : 'MedicationsSummary_LastMonth',
        location
    });
    return locations;
};

const createWeightSummaryChart = async (data, countryCode) => {
    var locations = [];
    const location = await createBodyWeight_LineChart(data, 'BodyWeightSummary_LastMonth', countryCode);
    locations.push({
        key : 'BodyWeightSummary_LastMonth',
        location
    });
    return locations;
};

const createNutritionSummaryChart = async (data) => {
    var locations = [];
    const location = await createNutritionQuerySummary_BarChart(data, 'NutritionQuestionSummary_LastMonth');
    locations.push({
        key : 'NutritionQuestionSummary_LastMonth',
        location
    });
    return locations;
};

const createSymptomsSummaryChart = async (data) => {
    var locations = [];
    const location = await createFeelings_DonutChart(data, 'SymptomsSummary_LastMonth');
    locations.push({
        key : 'SymptomsSummary_LastMonth',
        location
    });
    return locations;
};

const createMoodsSummaryChart = async (data) => {
    var locations = [];
    const location = await createMoodsSummaryChart_HorizontalBarChart(data, 'MoodsSummary_LastMonth');
    locations.push({
        key : 'MoodsSummary_LastMonth',
        location
    });
    return locations;
};

const createBodyWeight_LineChart = async (stats: any, filename: string, countryCode: string) => {
    if (stats.length === 0) {
        return null;
    }
    var options: LineChartOptions = DefaultChartOptions.lineChart();
    if (countryCode === '+91') {
        var temp = stats.map(c => {
            return {
                x : new Date(c.DayStr),
                y : c.BodyWeight
            };
        });
        options.YLabel = 'Kg';

    } else {
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

const createNutritionQuerySummary_BarChart = async (stats: any, filename: string) => {
    if (stats.length === 0) {
        return null;
    }
    const temp = stats.map(c => {
        return {
            x : `"${TimeHelper.getWeekDay(new Date(c.DayStr), true)}"`,
            y : c.Response,
            z : c.Type,
        };
    });
    const categoryColors = getNutritionQuestionCategoryColors();
    const categories = categoryColors.map(x => x.Key);
    const colors = categoryColors.map(x => x.Color);

    const options: MultiBarChartOptions =  DefaultChartOptions.multiBarChart();
    options.Width           = RECTANGULAR_CHART_WIDTH;
    options.Height          = RECTANGULAR_CHART_HEIGHT;
    options.YLabel          = 'User Response';
    options.CategoriesCount = categories.length;
    options.Categories      = categories;
    options.Colors          = colors;
    options.FontSize        = '14px';
    options.ShowYAxis       = false;

    return await ChartGenerator.createGroupBarChart(temp, options, filename);
};

const createMoodsSummaryChart_HorizontalBarChart = async (stats: any, filename: string) => {
    if (stats.length === 0) {
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
