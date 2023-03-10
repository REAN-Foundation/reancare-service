import { addLegend, addText } from "./stat.report.commons";

//////////////////////////////////////////////////////////////////////////////////

export const RECTANGULAR_CHART_WIDTH = 600;
export const RECTANGULAR_CHART_HEIGHT = 225;
export const SQUARE_CHART_WIDTH = 400;
export const SQUARE_CHART_HEIGHT = 400;

//////////////////////////////////////////////////////////////////////////////////

export const addLabeledText = (
    document: PDFKit.PDFDocument, label: string, value: string, y: any, fontSize = 11, rowYOffset = 23) => {

    const labelX = 135;
    const valueX = 360;

    document
        .fontSize(fontSize)
        .fillColor("#444444");

    y = y + rowYOffset;

    document
        .font('Helvetica-Bold')
        .text(label, labelX, y, { align: "left" })
        .font('Helvetica')
        .text(value, valueX, y, { align: "left" })
        .moveDown();

    return y;
};

export interface TableColumnProperties {
    XOffset: number;
    Text   : string;
}

export interface TableRowProperties {
    IsHeaderRow: boolean;
    FontSize   : number;                   //11
    RowOffset  : number;                   //23
    Columns    : TableColumnProperties[];
}

export const addTableRow = (
    document: PDFKit.PDFDocument, y: any, tableProperties: TableRowProperties) => {

    // const labelX = 135;
    // const valueX = 360;

    document
        .fontSize(tableProperties.FontSize)
        .fillColor("#444444");

    y = y + tableProperties.RowOffset;

    if (tableProperties.IsHeaderRow) {
        document
            .font('Helvetica-Bold');
    }
    else {
        document.font('Helvetica');
    }

    for (var c of tableProperties.Columns) {
        document.text(c.Text, c.XOffset, y, { align: "left" });
    }
    document
        .moveDown();

    return y;
};

export const addRectangularChartImage = (
    document: PDFKit.PDFDocument, model: any,
    chartImage: string, y: any, title: string,
    titleColor: string) => {
    const imageWidth = 325;
    const chart = model.ChartImagePaths.find(x => x.key === chartImage);
    document.image(chart.location, 125, y, { width: imageWidth, align: 'center' });
    document.moveDown();
    y = y + 135;
    addText(document, title, 80, y, 10, titleColor, 'center');
    return y;
};

export const addLongRectangularChartImage = (document: PDFKit.PDFDocument, model: any, chartImage: string, y: any) => {
    const imageWidth = 350;
    const chart = model.ChartImagePaths.find(x => x.key === chartImage);
    document.image(chart.location, 125, y, { width: imageWidth, align: 'center' });
    document.fontSize(7);
    document.moveDown();
    y = y + 65;
    return y;
};

export const addSquareChartImage = (
    document: PDFKit.PDFDocument, model: any,
    chartImage: string, y: any, title: string,
    titleColor: string,
    imageWidth = 175,
    startX = 75) => {
    const chart = model.ChartImagePaths.find(x => x.key === chartImage);
    document.image(chart.location, startX, y, { width: imageWidth, align: 'center' });
    document.fontSize(7);
    document.moveDown();
    y = y + imageWidth + 10;
    addText(document, title, 80, y, 12, titleColor, 'center');
    return y;
};

export const addSquareChartImageWithLegend = (
    document: PDFKit.PDFDocument,
    model: any,
    chartImage: string,
    y: any,
    title: string,
    titleColor: string,
    legendItems,
    legendY = 50,
    imageWidth = 160,
    startX = 125) => {

    const chart = model.ChartImagePaths.find(x => x.key === chartImage);
    document.image(chart.location, startX, y, { width: imageWidth, align: 'center' });
    document.fontSize(7);
    document.moveDown();

    const yFrozen = y;
    y = yFrozen + imageWidth + 20;
    addText(document, title, 80, y, 12, titleColor, 'center');

    y = yFrozen + legendY;
    const legendStartX = startX + 200;
    y = addLegend(document, y, legendItems, legendStartX, 11, 60, 8, 5);
    y = yFrozen + imageWidth + 30; //Image height
    return y;
};

export const chartExists = (model, chartImage) => {
    const chart = model.ChartImagePaths.find(x => x.key === chartImage);
    if (!chart) {
        return false;
    }
    if (!chart.location) {
        return false;
    }
    return true;
};

export const constructDonutChartData = (x_) => {
    const data = [];
    const keys = Object.keys(x_);
    for (var key of keys) {
        data.push({
            name  : key,
            value : x_[key]
        });
    }
    return data;
};

export const findKeyCounts = (x_) =>{
    const counts = {};
    for (const element of x_) {
        if (counts[element]) {
            counts[element] += 1;
        } else {
            counts[element] = 1;
        }
    }
    return counts;
};
