import { TimeHelper } from "../../../../common/time.helper";
import { Helper } from "../../../../common/helper";
import { ChartGenerator } from "../../../../modules/charts/chart.generator";
import { BarChartOptions, ChartColors, LineChartOptions, MultiBarChartOptions } from "../../../../modules/charts/chart.options";
import { DefaultChartOptions } from "../../../../modules/charts/default.chart.options";
import { createFeelings_DonutChart, getFeelingsColors } from "./daily.assessments.stats";
import { createMedicationConsumption_DonutChart, getMedicationStatusCategoryColors } from "./medication.stats";
import { getNutritionQuestionCategoryColors } from "./nutrition.stats";
import {
    addTableRow,
    chartExists,
    findKeyCounts,
    RECTANGULAR_CHART_HEIGHT,
    RECTANGULAR_CHART_WIDTH,
    TableRowProperties } from "./report.helper";
import {
    addSectionTitle,
    addLegend,
    SECOND_COLUMN_START,
    addFirstColumnSectionTitle,
    addNoDataDisplayFirstColumn,
    addNoDataDisplaySecondColumn,
    addSecondColumnSectionTitle
} from "./stat.report.commons";

//////////////////////////////////////////////////////////////////////////////////

export const addLabValuesTable = (model: any, document: PDFKit.PDFDocument, y: any) => {

    const sectionTitle = 'Changes in Lab Values and Body Weight';
    const icon = Helper.getIconsPath('blood-lipids.png');
    y = addSectionTitle(document, y, sectionTitle, icon);

    var useBodyWeightKg = false;
    var startingWeight = model.Stats.Biometrics.LastMonth.BodyWeight.StartingBodyWeight;
    var currentWeight = model.Stats.Biometrics.LastMonth.BodyWeight.CurrentBodyWeight;
    var totalChange = model.Stats.Biometrics.LastMonth.BodyWeight.TotalChange;
    if (model.Stats.CountryCode !== '+91'){
        useBodyWeightKg = true;
        startingWeight = model.Stats.Biometrics.LastMonth.BodyWeight.StartingBodyWeight * 2.20462;
        currentWeight = model.Stats.Biometrics.LastMonth.BodyWeight.CurrentBodyWeight * 2.20462;
        totalChange = model.Stats.Biometrics.LastMonth.BodyWeight.TotalChange * 2.20462;
    }

    const labValues = model.Stats.Biometrics.LastMonth;

    const vals = [];
    vals.push([true, 'Value', 'Starting', 'Current', 'Change']);
    vals.push([false, 'Blood Glucose (mg/dL)', labValues.BloodGlucose.StartingBloodGlucose, labValues.BloodGlucose.CurrentBloodGlucose, labValues.BloodGlucose.TotalChange]);
    vals.push([false, 'BP (mmHg) - Systolic', labValues.BloodPressure.StartingSystolicBloodPressure, labValues.BloodPressure.CurrentBloodPressureSystolic, labValues.BloodPressure.TotalChangeSystolic]);
    vals.push([false, 'BP (mmHg) - Diastolic', labValues.BloodPressure.StartingDiastolicBloodPressure, labValues.BloodPressure.CurrentBloodPressureDiastolic, labValues.BloodPressure.TotalChangeDiastolic]);
    vals.push([false, 'Total Cholesterol (mg/dL)', labValues.Lipids.TotalCholesterol.StartingTotalCholesterol, labValues.Lipids.TotalCholesterol.CurrentTotalCholesterol, labValues.Lipids.TotalCholesterol.TotalCholesterolChange]);
    vals.push([false, 'HDL (mg/dL)', labValues.Lipids.HDL.StartingHDL, labValues.Lipids.HDL.CurrentHDL, labValues.Lipids.HDL.TotalHDLChange]);
    vals.push([false, 'LDL (mg/dL)', labValues.Lipids.LDL.StartingLDL, labValues.Lipids.LDL.CurrentLDL, labValues.Lipids.LDL.TotalLDLChange]);
    vals.push([false, 'Triglyceride (mg/dL)', labValues.Lipids.TriglycerideLevel.StartingTriglycerideLevel, labValues.Lipids.TriglycerideLevel.CurrentTriglycerideLevel, labValues.Lipids.TriglycerideLevel.TotalTriglycerideLevelChange]);
    vals.push([false, 'A1C level (%)', labValues.Lipids.A1CLevel.StartingA1CLevel, labValues.Lipids.A1CLevel.CurrentA1CLevel, labValues.Lipids.A1CLevel.TotalA1CLevelChange]);
    vals.push([false, useBodyWeightKg ? 'Body weight (Kg)' : 'Body weight (lbs)', startingWeight?.toFixed(1), currentWeight?.toFixed(1), totalChange?.toFixed(1)]);

    for (var r of vals) {
        const row: TableRowProperties = {
            IsHeaderRow : r[0],
            FontSize    : 9,
            RowOffset   : 16,
            Columns     : [
                {
                    XOffset : 120,
                    Text    : r[1]
                },
                {
                    XOffset : 280,
                    Text    : r[2]
                },
                {
                    XOffset : 360,
                    Text    : r[3]
                },
                {
                    XOffset : 440,
                    Text    : r[4]
                }
            ]
        };
        y = addTableRow(document, y, row);
    }
    return y;
};

export const addSummaryGraphs = (model: any, document: PDFKit.PDFDocument, y: any) => {
    const rowShift = 143;
    var yFrozen = y;
    y = addMedicationSummary(y, document, model);
    y = yFrozen;
    y = addBodyWeightSummary(y, document, model);
    yFrozen += rowShift;
    y = yFrozen;
    y = addNutritionQuestionSummary(y, document, model);
    y = yFrozen;
    y = addDailyMovementQuestionSummary(y, document, model);
    yFrozen += rowShift;
    y = yFrozen;
    y = addSymptomSummary(y, document, model);
    y = yFrozen;
    y = addMoodsSummary(y, document, model);
    yFrozen += rowShift;
    y = yFrozen;
    return y;
};

export const createSummaryCharts = async (data) => {
    var locations = [];

    var location = await createMedicationConsumption_DonutChart(data?.Medication?.LastMonth?.Daily, 'MedicationsSummary_LastMonth');
    if (location) {
        locations.push({
            key : 'MedicationsSummary_LastMonth',
            location
        });
    }

    location = await createBodyWeight_LineChart(data?.Biometrics?.LastMonth?.BodyWeight?.History, 'BodyWeightSummary_LastMonth', data.Biometrics.LastMonth.BodyWeight.CountryCode);
    if (location) {
        locations.push({
            key : 'BodyWeightSummary_LastMonth',
            location
        });
    }

    location = await createNutritionQueryForMonth_GroupedBarChart(data?.Nutrition?.LastMonth?.QuestionnaireStats, 'NutritionQuestionSummary_LastMonth');
    if (location) {
        locations.push({
            key : 'NutritionQuestionSummary_LastMonth',
            location
        });
    }

    location = await createFeelings_DonutChart(data?.DailyAssessent?.LastMonth, 'SymptomsSummary_LastMonth');
    if (location) {
        locations.push({
            key : 'SymptomsSummary_LastMonth',
            location
        });
    }

    location = await createMoodsSummaryChart_HorizontalBarChart(
        data?.DailyAssessent?.LastMonth, 'MoodsSummary_LastMonth');
    if (location) {
        locations.push({
            key : 'MoodsSummary_LastMonth',
            location
        });
    }

    return locations;
};

const createBodyWeight_LineChart = async (stats: any, filename: string, countryCode: string) => {
    if (!stats || stats.length === 0) {
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

const createNutritionQueryForMonth_GroupedBarChart = async (stats: any, filename: string) => {

    if (!stats) {
        return;
    }
    const qstats = [
        ...(stats.HealthyFoodChoices.Stats),
        ...(stats.HealthyProteinConsumptions.Stats),
        ...(stats.LowSaltFoods.Stats),
    ];
    if (qstats.length === 0) {
        return null;
    }
    const temp = qstats.map(c => {
        return {
            x : `"${TimeHelper.getDayOfMonthFromISODateStr(c.DayStr)}"`,
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
    options.FontSize        = '9px';
    options.ShowYAxis       = false;

    return await ChartGenerator.createGroupBarChart(temp, options, filename);
};

const createMoodsSummaryChart_HorizontalBarChart = async (stats: any, filename: string) => {

    if (!stats || stats.length === 0) {
        return null;
    }
    const moods_ = stats.map(x => x.Mood);
    const tempMoods = findKeyCounts(moods_);
    const moods = Helper.sortObjectKeysAlphabetically(tempMoods);
    const options: BarChartOptions = DefaultChartOptions.barChart();
    options.ShowXAxis = false;
    options.Width  = 650;
    options.Height = 200;
    var data = [];
    for (var k of Object.keys(moods)) {
        var m = {
            x : k,
            y : moods[k]
        };
        data.push(m);
    }
    return await ChartGenerator.createHorizontalBarChart(data, options, filename);
};

//#region Add to PDF

function addMedicationSummary(y: any, document: PDFKit.PDFDocument, model: any) {
    const chartImage = 'MedicationsSummary_LastMonth';
    const sectionTitle = 'Medication Adherence';
    const icon = Helper.getIconsPath('medications.png');
    const legend = getMedicationStatusCategoryColors();
    y = addFirstColumnSectionTitle(document, y, sectionTitle, icon);

    if (!chartExists(model, chartImage)) {
        y = addNoDataDisplayFirstColumn(document, y);
    } else {
        y = y + 9;

        const imageWidth = 90;
        const startX = 55;
        const chart = model.ChartImagePaths.find(x => x.key === chartImage);
        document.image(chart.location, startX, y, { width: imageWidth, align: 'center' });
        document.fontSize(7);
        document.moveDown();

        const yFrozen = y;
        const legendY = 30;
        y = yFrozen + legendY;
        const legendFontSize = 9;
        const legendStartX = startX + 135;
        const colorStripWidth = 20;
        const legendRowOffset = 10;
        y = addLegend(document, y, legend, legendStartX, legendFontSize, colorStripWidth, 6, 5, legendRowOffset);
        y = yFrozen + imageWidth + 25;

        y = y + 2;
    }
    return y;
}

function addBodyWeightSummary(y: any, document: PDFKit.PDFDocument, model: any) {
    const chartImage = 'BodyWeightSummary_LastMonth';
    const sectionTitle = 'Body weight';
    const icon = Helper.getIconsPath('body-weight.png');
    y = addSecondColumnSectionTitle(document, y, sectionTitle, icon);

    if (!chartExists(model, chartImage)) {
        y = addNoDataDisplaySecondColumn(document, y);
    } else {
        y = y + 20;
        const imageWidth = 200;
        const chart = model.ChartImagePaths.find(x => x.key === chartImage);
        document.image(chart.location, SECOND_COLUMN_START + 5, y, { width: imageWidth, align: 'center' });
        document.moveDown();
        y = y + 135;
    }
    return y;
}

function addNutritionQuestionSummary(y: any, document: PDFKit.PDFDocument, model: any) {
    const chartImage = 'NutritionQuestionSummary_LastMonth';
    const sectionTitle = 'Nutrition Questions';
    const icon = Helper.getIconsPath('nutrition.png');

    y = addFirstColumnSectionTitle(document, y, sectionTitle, icon);

    if (!chartExists(model, chartImage)) {
        y = addNoDataDisplayFirstColumn(document, y);
    } else {
        y = y + 15;
        const yFrozen = y;
        const imageWidth = 140;
        const startX = 50;
        const chart = model.ChartImagePaths.find(x => x.key === chartImage);
        document.image(chart.location, startX, y, { width: imageWidth, align: 'center', height: 80 });
        document.fontSize(7);
        document.moveDown();

        const legendY = 25;
        y = yFrozen + legendY;
        const legendFontSize = 8;
        const legendStartX = startX + 155;
        const colorStripWidth = 20;
        const legendRowOffset = 10;
        const colors = getNutritionQuestionCategoryColors();
        const legend = colors.map(x => {
            return {
                Key   : x.Key,// + ': ' + x.Question,
                Color : x.Color,
            };
        });
        y = addLegend(document, y, legend, legendStartX, legendFontSize, colorStripWidth, 6, 5, legendRowOffset);
    }
    return y;
}

function addDailyMovementQuestionSummary(y: any, document: PDFKit.PDFDocument, model: any) {
    const chartImage = 'Exercise_Questionnaire_Overall_LastMonth';
    const sectionTitle = 'Daily Movement Questions';
    const icon = Helper.getIconsPath('exercise.png');

    y = addSecondColumnSectionTitle(document, y, sectionTitle, icon);

    if (!chartExists(model, chartImage)) {
        y = addNoDataDisplaySecondColumn(document, y);
    } else {
        y = y + 9;

        const imageWidth = 90;
        const startX = SECOND_COLUMN_START + 5;
        const chart = model.ChartImagePaths.find(x => x.key === chartImage);
        document.image(chart.location, startX, y, { width: imageWidth, align: 'center' });
        document.fontSize(7);
        document.moveDown();

        const yFrozen = y;
        const legendY = 30;
        y = yFrozen + legendY;
        const legendFontSize = 10;
        const legendStartX = startX + 135;

        const legend = [
            {
                Key   : 'Yes',
                Color : ChartColors.MediumSeaGreen,
            },
            {
                Key   : 'No',
                Color : ChartColors.Coral,
            }
        ];
        y = addLegend(document, y, legend, legendStartX, legendFontSize, 25, 8, 5);
        y = yFrozen + imageWidth + 25; //Image height

        y = y + 2;
    }
    return y;
}

function addSymptomSummary(y: any, document: PDFKit.PDFDocument, model: any) {
    const chartImage = 'SymptomsSummary_LastMonth';
    const sectionTitle = 'Relative Symptoms';
    const icon = Helper.getIconsPath('feelings.png');
    const legend = getFeelingsColors();
    y = addFirstColumnSectionTitle(document, y, sectionTitle, icon);

    if (!chartExists(model, chartImage)) {
        y = addNoDataDisplayFirstColumn(document, y);
    } else {
        y = y + 9;

        const imageWidth = 90;
        const startX = 55;
        const chart = model.ChartImagePaths.find(x => x.key === chartImage);
        document.image(chart.location, startX, y, { width: imageWidth, align: 'center' });
        document.fontSize(7);
        document.moveDown();

        const yFrozen = y;
        const legendY = 30;
        y = yFrozen + legendY;
        const legendFontSize = 9;
        const legendStartX = startX + 135;
        const colorStripWidth = 20;
        const legendRowOffset = 10;
        y = addLegend(document, y, legend, legendStartX, legendFontSize, colorStripWidth, 6, 5, legendRowOffset);
        y = yFrozen + imageWidth + 25; //Image height

        y = y + 2;
        //y = addSquareChartImageWithLegend(document, model, chartImage, y, detailedTitle, titleColor, legend, 40, 150);
    }
    return y;
}

function addMoodsSummary(y: any, document: PDFKit.PDFDocument, model: any) {
    const chartImage = 'MoodsSummary_LastMonth';
    const sectionTitle = 'Moods';
    const icon = Helper.getIconsPath('moods.png');
    y = addSecondColumnSectionTitle(document, y, sectionTitle, icon);

    if (!chartExists(model, chartImage)) {
        y = addNoDataDisplaySecondColumn(document, y);
    } else {
        y = y + 20;
        const imageWidth = 240;
        const chart = model.ChartImagePaths.find(x => x.key === chartImage);
        document.image(chart.location, SECOND_COLUMN_START + 5, y, { width: imageWidth, align: 'center' });
        document.moveDown();
        y = y + 135;
    }
    return y;
}

//#endregion
