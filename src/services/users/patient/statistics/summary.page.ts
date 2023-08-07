import { TimeHelper } from "../../../../common/time.helper";
import { Helper } from "../../../../common/helper";
import { ChartGenerator } from "../../../../modules/charts/chart.generator";
import { BarChartOptions, ChartColors, LineChartOptions, MultiBarChartOptions } from "../../../../modules/charts/chart.options";
import { DefaultChartOptions } from "../../../../modules/charts/default.chart.options";
import { createFeelings_DonutChart, getFeelingsColors } from "./daily.assessments.stats";
import { createMedicationConsumption_DonutChart } from "./medication.stats";
import { getNutritionQuestionCategoryColors } from "./nutrition.stats";
import {
    addTableRow,
    chartExists,
    findKeyCounts,
    RECTANGULAR_CHART_HEIGHT,
    RECTANGULAR_CHART_WIDTH,
    TableRowProperties } from "./report.helper";
import {
    addLegend,
    SECOND_COLUMN_START,
    addFirstColumnSectionTitle,
    addNoDataDisplayFirstColumn,
    addNoDataDisplaySecondColumn,
    addSecondColumnSectionTitle,
    addText
} from "./stat.report.commons";

//////////////////////////////////////////////////////////////////////////////////

export const addLabValuesTable = (model: any, document: PDFKit.PDFDocument, y: any) => {

    const sectionTitle = 'Lab Values and Body Weight';
    const icon = Helper.getIconsPath('blood-lipids.png');
    y = addFirstColumnSectionTitle(document, y, sectionTitle, icon);

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

    var useLpaUnit = false;
    if (labValues.Lipids.Lpa.Unit !== 'mg/dL') {
        useLpaUnit = true;
    }

    const vals = [];
    vals.push([true, 'Value', 'Starting', 'Current', 'Change']);
    vals.push([false, 'Blood Glucose (mg/dL)', labValues.BloodGlucose.StartingBloodGlucose, labValues.BloodGlucose.CurrentBloodGlucose, labValues.BloodGlucose.TotalChange]);
    vals.push([false, 'BP (mmHg) - Systolic', labValues.BloodPressure.StartingSystolicBloodPressure, labValues.BloodPressure.CurrentBloodPressureSystolic, labValues.BloodPressure.TotalChangeSystolic]);
    vals.push([false, 'BP (mmHg) - Diastolic', labValues.BloodPressure.StartingDiastolicBloodPressure, labValues.BloodPressure.CurrentBloodPressureDiastolic, labValues.BloodPressure.TotalChangeDiastolic]);
    vals.push([false, 'Total Cholesterol (mg/dL)', labValues.Lipids.TotalCholesterol.StartingTotalCholesterol, labValues.Lipids.TotalCholesterol.CurrentTotalCholesterol, labValues.Lipids.TotalCholesterol.TotalCholesterolChange]);
    vals.push([false, 'HDL (mg/dL)', labValues.Lipids.HDL.StartingHDL, labValues.Lipids.HDL.CurrentHDL, labValues.Lipids.HDL.TotalHDLChange]);
    vals.push([false, 'LDL (mg/dL)', labValues.Lipids.LDL.StartingLDL, labValues.Lipids.LDL.CurrentLDL, labValues.Lipids.LDL.TotalLDLChange]);
    vals.push([false, 'Triglyceride (mg/dL)', labValues.Lipids.TriglycerideLevel.StartingTriglycerideLevel, labValues.Lipids.TriglycerideLevel.CurrentTriglycerideLevel, labValues.Lipids.TriglycerideLevel.TotalTriglycerideLevelChange]);
    vals.push([false, 'A1C level (%)', labValues.Lipids.A1CLevel.StartingA1CLevel.toFixed(1), labValues.Lipids.A1CLevel.CurrentA1CLevel.toFixed(1), labValues.Lipids.A1CLevel.TotalA1CLevelChange.toFixed(1)]);
    vals.push([false, useBodyWeightKg ? 'Body weight (lbs)' : 'Body weight (Kg)', startingWeight?.toFixed(1), currentWeight?.toFixed(1), totalChange?.toFixed(1)]);
    vals.push([false, useLpaUnit ? 'Lipoprotein (nmo/L)' : 'Lipoprotein (mg/dL)', labValues.Lipids.Lpa.StartingLpa.toFixed(1), labValues.Lipids.Lpa.CurrentLpa.toFixed(1), labValues.Lipids.Lpa.TotalLpaChange.toFixed(1)]);


    for (var r of vals) {
        const row: TableRowProperties = {
            IsHeaderRow : r[0],
            FontSize    : 9,
            RowOffset   : 16,
            Columns     : [
                {
                    XOffset : 50,
                    Text    : r[1]
                },
                {
                    XOffset : 170,
                    Text    : r[2]
                },
                {
                    XOffset : 210,
                    Text    : r[3]
                },
                {
                    XOffset : 250,
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
    y = addLabValuesTable(model, document, y);
    var yOfLabValues = y + 20;
    y = yFrozen;
    y = addSleepSummary(y, document, model);
    yFrozen = yOfLabValues;
    y = yFrozen;
    y = addMedicationSummary(y, document, model);
    y = yFrozen;
    // y = addCurrentMedications(document, model.Stats.Medication.CurrentMedications, y);
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

    location = await createSleep_BarChart(data?.Sleep?.LastMonth, 'SleepSummary_LastMonth');
    if (location) {
        locations.push({
            key : 'SleepSummary_LastMonth',
            location
        });
    }

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

const createSleep_BarChart = async (stats: any, filename: string) => {
    if (stats.length === 0) {
        return null;
    }
    const sleepStats = stats.map(c => {
        return {
            x : new Date(c.DayStr),
            y : c.SleepDuration
        };
    });
    const options: BarChartOptions = DefaultChartOptions.barChart();
    options.Width  = RECTANGULAR_CHART_WIDTH;
    options.Height = RECTANGULAR_CHART_HEIGHT;
    options.YLabel = 'Per 24-hour period';
    options.Color  = ChartColors.GrayDarker;
    options.XAxisTimeScaled  = true;

    return await ChartGenerator.createBarChart(sleepStats, options, filename);
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
            x : new Date(c.DayStr),
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
    options.FontSize        = '10px';
    options.ShowYAxis       = false;
    options.XAxisTimeScaled = true;


    return await ChartGenerator.createStackedBarChart(temp, options, filename);
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

function addSleepSummary(y: any, document: PDFKit.PDFDocument, model: any) {
    const chartImage = 'SleepSummary_LastMonth';
    const sectionTitle = 'Sleep';
    const title = 'Over 30 days';
    const titleColor = '#505050';
    const icon = Helper.getIconsPath('sleep.png');
    y = addSecondColumnSectionTitle(document, y, sectionTitle, icon);

    if (!chartExists(model, chartImage)) {
        y = addNoDataDisplaySecondColumn(document, y);
    } else {
        y = y + 20;
        const imageWidth = 200;
        const chart = model.ChartImagePaths.find(x => x.key === chartImage);
        document.image(chart.location, SECOND_COLUMN_START + 5, y, { width: imageWidth, align: 'center' });
        document.moveDown();
        addText(document, title, 300, y + 80, 6, titleColor, 'center');
        y = y + 135;
    }
    return y;
}

function addMedicationSummary(y: any, document: PDFKit.PDFDocument, model: any) {
    const chartImage = 'MedicationsSummary_LastMonth';
    const sectionTitle = 'Medication Adherence';
    const icon = Helper.getIconsPath('medications.png');
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
        //const legendY = 10;
        //y = yFrozen + legendY;
        //const legendFontSize = 9;
        //const legendStartX = startX + 135;
        //const colorStripWidth = 20;
        //const legendRowOffset = 10;
        // y = addLegend(document, y, legend, legendStartX, legendFontSize, colorStripWidth, 6, 5, legendRowOffset);
        y = addCurrentMedications(document, model.Stats.Medication.CurrentMedications, y);
        y = yFrozen + imageWidth + 25;

        y = y + 2;
    }
    return y;
}

function addCurrentMedications(document, medications, y) {
    //const icon = Helper.getIconsPath('current-medications.png');
    //y = addSectionTitle(document, y, "Current Medications", icon);

    if (medications.length === 0) {
        return null;
    }

    const tableTop = y + 21;
    const ITEM_HEIGHT = 15;
    let medicationsCount = medications.length;

    if (medicationsCount > 5) {
        medicationsCount = 5;
    }

    for (let i = 0; i < medicationsCount; i++) {

        const medication = medications[i];
        const position = tableTop + (i * ITEM_HEIGHT);
        y = position;

        generateMedicationTableRow(
            document,
            position,
            (i + 1).toString(),
            medication.DrugName,
            medication.Frequency,
            medication.FrequencyUnit
        );
    }

    y = y + ITEM_HEIGHT + 5;
    return y;
}

const generateMedicationTableRow = (
    document: PDFKit.PDFDocument,
    y,
    index,
    drug,
    frequency,
    frequencyUnit
) => {
    var schedule = (frequency ? frequency + ' ' : '') + frequencyUnit;
    const d = schedule;
    const medication = drug.slice(0,15) + ', ' + d;
    document
        .fontSize(9)
        .font('Helvetica')
        .text(index, 160, y)
        .text(medication, 175, y, { align: "left" })
        //.text(dose + ' ' + dosageUnit, 330, y, { align: "right" })
        .moveDown();
};

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
    const sectionTitle = 'Daily Nutrition Intake';
    const icon = Helper.getIconsPath('nutrition.png');
    const title = 'Over 30 days';
    const titleColor = '#505050';

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
        addText(document, title, startX - 350, y + 82, 6, titleColor, 'center');

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
    const sectionTitle = 'Daily Movement';
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
                Color : ChartColors.OrangeRed,
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
