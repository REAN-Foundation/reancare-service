/* eslint-disable no-console */
import { DefaultChartOptions } from "../../../../modules/charts/default.chart.options";
import { Helper } from "../../../../common/helper";
import { ChartGenerator } from "../../../../modules/charts/chart.generator";
import { ChartColors, MultiBarChartOptions, PieChartOptions } from "../../../../modules/charts/chart.options";
import {
    addRectangularChartImage,
    addSquareChartImageWithLegend,
    chartExists,
    RECTANGULAR_CHART_HEIGHT,
    RECTANGULAR_CHART_WIDTH,
    SQUARE_CHART_HEIGHT,
    SQUARE_CHART_WIDTH } from "./report.helper";
import { addSectionTitle, addNoDataDisplay } from "./stat.report.commons";

//////////////////////////////////////////////////////////////////////////////////

export const addMedicationStats = (document, model, y) => {

    const titleColor = '#505050';
    const legend = getMedicationStatusCategoryColors();
    let chartImage = 'MedicationsOverall_LastMonth';
    const title = 'Medication Adherence for Last Month';
    if (!chartExists(model, chartImage)) {
        y = addNoDataDisplay(document, y);
    } else {
        y = addSquareChartImageWithLegend(document, model, chartImage, y, title, titleColor, legend);
    }

    y = y + 7;

    chartImage = 'MedicationsHistory_LastMonth';
    const detailedTitle = 'Medication History for Last Month';
    const sectionTitle = 'Medication History';
    const icon = Helper.getIconsPath('medications.png');

    y = addSectionTitle(document, y, sectionTitle, icon);

    if (!chartExists(model, chartImage)) {
        y = addNoDataDisplay(document, y);
    } else {
        y = y + 25;
        y = addRectangularChartImage(document, model, chartImage, y, detailedTitle, titleColor);
        y = y + 20;
    }

    return y;
};

export const addCurrentMedications = (document, medications, y) => {
    const icon = Helper.getIconsPath('current-medications.png');
    y = addSectionTitle(document, y, "Current Medications", icon);

    if (medications.length === 0) {
        y = addNoDataDisplay(document, y);
        return y;
    }

    const tableTop = y + 21;
    const ITEM_HEIGHT = 26;
    let medicationsCount = medications.length;

    if (medicationsCount > 5) {
        medicationsCount = 5;
    }

    for (let i = 0; i < medicationsCount; i++) {

        const medication = medications[i];
        const position = tableTop + (i * ITEM_HEIGHT);
        y = position;

        const schedule = medication.TimeSchedules ? medication.TimeSchedules.join(', ') : '';

        generateMedicationTableRow(
            document,
            position,
            (i + 1).toString(),
            medication.DrugName,
            medication.Dose.toString(),
            medication.DosageUnit,
            medication.Frequency,
            medication.FrequencyUnit,
            schedule,
            medication.Route,
            medication.Duration.toString(),
            medication.DurationUnit
        );
    }

    y = y + ITEM_HEIGHT + 10;
    return y;
};

export const createMedicationTrendCharts = async (data) => {
    var locations = [];

    if (data.LastMonth.length === 0) {
        return locations;
    }

    let location = await createMedication_BarChart(data.LastMonth.Daily, 'MedicationsHistory_LastMonth');
    locations.push({
        key : 'MedicationsHistory_LastMonth',
        location
    });
    location = await createMedicationConsumption_DonutChart(data.LastMonth.Daily, 'MedicationsOverall_LastMonth');
    locations.push({
        key : 'MedicationsOverall_LastMonth',
        location
    });
    return locations;
};

export const createMedicationConsumption_DonutChart = async (stats: any, filename: string) => {
    //console.log(JSON.stringify(stats, null, 2));
    if (!stats || stats.length === 0) {
        return null;
    }
    const missedCount = stats.reduce((acc, x) => acc + x.MissedCount, 0);
    const takenCount = stats.reduce((acc, x) => acc + x.TakenCount, 0);
    const total = stats.length;
    const unmarked = total - (missedCount + takenCount);
    const categoryColors = getMedicationStatusCategoryColors();
    const colors = categoryColors.map(x => x.Color);
    const options: PieChartOptions = {
        Width  : SQUARE_CHART_WIDTH,
        Height : SQUARE_CHART_HEIGHT,
        Colors : colors,
    };
    const data = [
        {
            name  : "Taken",
            value : takenCount,
        },
        {
            name  : "Missed",
            value : missedCount,
        },
        {
            name  : "Unmarked",
            value : unmarked,
        }
    ];
    return await ChartGenerator.createDonutChart(data, options, filename);
};

const createMedication_BarChart = async (stats: any, filename: string) => {
    if (stats.length === 0) {
        return null;
    }
    const temp = [];
    stats.forEach(x => {
        temp.push({
            x : new Date(x.DayStr),
            y : x.MissedCount,
            z : 'Missed',
        });
        temp.push({
            x : new Date(x.DayStr),
            y : x.TakenCount,
            z : 'Taken',
        });
    });
    const options: MultiBarChartOptions =  DefaultChartOptions.multiBarChart();
    options.Width           = RECTANGULAR_CHART_WIDTH;
    options.Height          = RECTANGULAR_CHART_HEIGHT;
    options.YLabel          = 'Medication History';
    options.CategoriesCount = 2;
    options.Categories      = [ "Missed", "Taken" ];
    options.Colors          = [ ChartColors.OrangeRed, ChartColors.MediumSeaGreen ];
    options.FontSize        = '12px';
    options.XAxisTimeScaled = true;

    return await ChartGenerator.createStackedBarChart(temp, options, filename);
};

export const getMedicationStatusCategoryColors = () => {
    const items = [
        {
            Key   : 'Taken',
            Color : ChartColors.MediumSeaGreen,
        },
        {
            Key   : 'Missed',
            Color : ChartColors.OrangeRed,
        },
        {
            Key   : 'Unmarked',
            Color : ChartColors.SlateGray,
        },
    ];
    return items;
};

const generateMedicationTableRow = (
    document: PDFKit.PDFDocument,
    y,
    index,
    drug,
    dose,
    dosageUnit,
    frequency,
    frequencyUnit,
    timeSchedule,
    route,
    duration,
    durationUnit,
) => {
    var schedule = (frequency ? frequency + ' ' : '') + frequencyUnit + ' - ' + timeSchedule;
    const d = schedule + ', ' + route + ' | ' + duration + ' ' + durationUnit;
    const medication = drug + ', ' + d;
    document
        .fontSize(11)
        .font('Helvetica')
        .text(index, 50, y)
        .text(medication, 75, y, { align: "left" })
        .text(dose + ' ' + dosageUnit, 330, y, { align: "right" })
        .moveDown();
};
