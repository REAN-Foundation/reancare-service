import * as path from 'path';
import { ChartColors } from '../../../../modules/charts/chart.options';
import { PDFGenerator } from "../../../../modules/reports/pdf.generator";

///////////////////////////////////////////////////////////////////////////////////////

export type Alignment = "left" | "right" | "center";
export const SECOND_COLUMN_START = 310;

///////////////////////////////////////////////////////////////////////////////////////

export function addBottom(document: any, pageNumber: any, model: any) {
    PDFGenerator.addOrderPageNumber(document, pageNumber, model.TotalPages);
    //addFooter(document, "https://www.heart.org/", model.FooterImagePath);
}
  
export function addTop(document: any, model: any, title: string = null, addToNewPage = true) {
    var y = 17;
    if (addToNewPage) {
        addNewPage(document);
    }
    const headerTitle = title ?? model.ReportTitle;
    y = addHeader(document, headerTitle, y, model.HeaderImagePath);
    y = addReportDate(y, document, model);
    return y;
}

export function addReportDate(y: number, document: PDFKit.PDFDocument, model: any) {
    y = y + 45;
    document
        .fillColor('#444444')
        .fontSize(10)
        .text('Date: ' + model.ReportDateStr, 200, y, { align: "right" })
        .moveDown();
    return y;
}

export const  addNewPage = (document) => {
    document.addPage({
        size    : 'A4',
        margins : {
            top    : 0,
            bottom : 0,
            left   : 0,
            right  : 50
        }
    });
};

export const addHeader = (document: PDFKit.PDFDocument, title: string, y: number, headerImagePath: string) => {

    var imageFile = path.join(process.cwd(), headerImagePath);

    y = y + 5;
    document
        .image(imageFile, 0, 0, { width: 595 })
        .fillColor("#c21422")
        .font('Helvetica-Bold')
        .fontSize(18)
        .text(title, 90, y, { align: 'center' });

    document
        .fontSize(7);

    y = y + 24;

    document.moveDown();

    return y;
};

export const addSectionTitle = (document: PDFKit.PDFDocument, y: number, pageTitle: string, icon: string = null): number => {
    y = y + 18;

    //DrawLine(document, y);
    document
        .roundedRect(50, y, 500, 40, 2)
        .lineWidth(0.1)
        .fillOpacity(0.8)
        .fill("#e8ecef");

    y = y + 11;

    if (icon) {
        document.image(icon, 70, y, { width: 20 });
    }

    y = y + 4;

    document
        .fillOpacity(1.0)
        .lineWidth(1)
        .fill("#444444");

    document
        .fillColor("#444444")
        .font('Helvetica')
        .fontSize(13);

    document
        .font('Helvetica-Bold')
        .text(pageTitle, 35, y, { align: "center" })
        .moveDown();

    y = y + 20;

    return y;
};

export const addNoDataDisplay = (document: PDFKit.PDFDocument, y: number): number => {
    y = y + 18;
    y = y + 55;

    document
        .roundedRect(150, y, 300, 35, 2)
        .lineWidth(0.1)
        .fillOpacity(0.8)
        .fill(ChartColors.Salmon);

    y = y + 13;

    document
        .fillOpacity(1.0)
        .fill("#444444");

    document
        .fillColor("#444444")
        .font('Helvetica')
        .fontSize(12);

    document
        .font('Helvetica-Bold')
        .text("Data not available!", 35, y, { align: "center" })
        .moveDown();

    y = y + 20;
    y = y + 100;

    return y;
};

export const addFooter = (document: PDFKit.PDFDocument, text, logoImagePath) => {

    //var imageFile = path.join(process.cwd(), "./assets/images/REANCare_Footer.png");
    var imageFile = path.join(process.cwd(), logoImagePath);

    document
        .image(imageFile, 0, 800, { width: 595 });

    document
        .fontSize(12)
        .fillColor('#ffffff');

    document
        .text(text, 100, 815, {
            align     : "right",
            link      : text,
            underline : false
        });
};

export const addText = (
    document: PDFKit.PDFDocument, text: string, textX: number, textY: number,
    fontSize: number, color: string, alignment: Alignment) => {
    document
        .fontSize(fontSize)
        .opacity(1.0)
        .font('Helvetica-Bold')
        .fillColor(color)
        .text(text, textX, textY, { align: alignment })
        .moveDown();
};

export const addLegend = (
    document: PDFKit.PDFDocument, y: number,
    legendItems: any, startX: number, fontSize: number,
    colorStripWidth = 150,
    colorStripHeight = 6,
    margin = 10,
    rowYOffset = 17) => {

    y = y + margin;

    document
        .fontSize(fontSize)
        .fillColor("#444444");

    for (var l of legendItems) {

        const text = l.Key;
        const color = l.Color;

        document
            .roundedRect(startX, y, colorStripWidth, colorStripHeight, 3)
            .lineWidth(0.1)
            .fillOpacity(0.8)
            .fill(color);

        document
            .font('Helvetica')
            .fillOpacity(1.0)
            .text(text, startX + colorStripWidth + 15, y, { align: "left" })
            .moveDown();

        y = y + rowYOffset;
    }

    return y;
};

export const addLabeledEntry = (
    document, label: string, text: string,
    labelX: number, labelY: number,
    textX: number, textY: number,
    fontSize: number, color: string, alignment: Alignment) => {
    document
        .font('Helvetica-Bold')
        .fontSize(fontSize)
        .text(label, labelX, labelY, { align: alignment })
        .fillColor(color)
        .font('Helvetica-Bold')
        .text(text, textX, textY, { align: "left" })
        .moveDown();
};

export const addFirstColumnSectionTitle = (
    document: PDFKit.PDFDocument, y: number, pageTitle: string, icon: string = null): number => {
    y = y + 14;

    document
        .roundedRect(50, y, 230, 35, 2)
        .lineWidth(0.1)
        .fillOpacity(0.8)
        .fill("#e8ecef");

    y = y + 10;

    if (icon) {
        document.image(icon, 65, y, { width: 16 });
    }

    y = y + 4;

    document
        .fillOpacity(1.0)
        .lineWidth(1)
        .fill("#444444");

    document
        .fillColor("#444444")
        .font('Helvetica')
        .fontSize(12);

    document
        .font('Helvetica-Bold')
        .text(pageTitle, 92, y, { align: "left" })
        .moveDown();

    y = y + 17;

    return y;
};

export const addSecondColumnSectionTitle = (
    document: PDFKit.PDFDocument, y: number, pageTitle: string, icon: string = null): number => {
    y = y + 14;

    //DrawLine(document, y);
    document
        .roundedRect(SECOND_COLUMN_START, y, 230, 35, 2)
        .lineWidth(0.1)
        .fillOpacity(0.8)
        .fill("#e8ecef");

    y = y + 10;

    if (icon) {
        document.image(icon, SECOND_COLUMN_START + 16, y, { width: 16 });
    }

    y = y + 4;

    document
        .fillOpacity(1.0)
        .lineWidth(1)
        .fill("#444444");

    document
        .fillColor("#444444")
        .font('Helvetica')
        .fontSize(12);

    document
        .font('Helvetica-Bold')
        .text(pageTitle, SECOND_COLUMN_START + 40, y, { align: "left" })
        .moveDown();

    y = y + 17;

    return y;
};

export const addNoDataDisplayFirstColumn = (document: PDFKit.PDFDocument, y: number): number => {
    y = y + 60;

    document
        .roundedRect(60, y, 200, 35, 2)
        .lineWidth(0.1)
        .fillOpacity(0.8)
        .fill(ChartColors.Salmon);

    y = y + 13;

    document
        .fillOpacity(1.0)
        .fill("#444444");

    document
        .fillColor("#444444")
        .font('Helvetica')
        .fontSize(10);

    document
        .font('Helvetica-Bold')
        .text("Data not available!", 65, y, { align: "left" })
        .moveDown();

    y = y + 120;

    return y;
};

export const addNoDataDisplaySecondColumn = (document: PDFKit.PDFDocument, y: number): number => {
    y = y + 60;

    document
        .roundedRect(SECOND_COLUMN_START, y, 200, 35, 2)
        .lineWidth(0.1)
        .fillOpacity(0.8)
        .fill(ChartColors.Salmon);

    y = y + 13;

    document
        .fillOpacity(1.0)
        .fill("#444444");

    document
        .fillColor("#444444")
        .font('Helvetica')
        .fontSize(10);

    document
        .font('Helvetica-Bold')
        .text("Data not available!", SECOND_COLUMN_START + 10, y, { align: "left" })
        .moveDown();

    y = y + 120;

    return y;
};
