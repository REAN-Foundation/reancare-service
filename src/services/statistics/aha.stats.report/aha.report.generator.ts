import { PDFGenerator } from "../../../modules/reports/pdf.generator";
import { addFooter, addTop } from "../../users/patient/statistics/stat.report.commons";
import { TableRowProperties, addTableRow } from "../../users/patient/statistics/report.helper";
import fs from 'fs';
import { FooterLength, SpaceAfterSectionTitle, SpaceBeforeSectionTitle, SpaceBetweenRow } from "./aha.pdf.setting";

///////////////////////////////////////////////////////////////////////////////////////////////

const pdfModel: any = {};

export const exportAHAStatsReportToPDF = async (reportModel: any) => {
    try {
        var { absFilepath, filename } = await PDFGenerator.getAbsoluteFilePath('Heart & Stroke statistics');
        var writeStream = fs.createWriteStream(absFilepath);
        const reportTitle = `Heart & Stroke statistics`;
        const options: Intl.DateTimeFormatOptions = {
            day   : '2-digit',
            month : 'long',
            year  : 'numeric',
        };
        const reportDateStr = new Intl.DateTimeFormat('en-US', options).format(new Date());
        
        pdfModel.ReportTitle = reportTitle;
        pdfModel.Author = 'REAN Foundation';
        pdfModel.TotalPages = 1;
        pdfModel.HeaderImagePath = './assets/images/AHA_header_2.png';
        pdfModel.FooterImagePath = './assets/images/AHA_footer_1.png';
        pdfModel.ReportDateStr = reportDateStr;

        var document = PDFGenerator.createDocument(reportTitle, pdfModel.Author, writeStream);

        let y = addStatsPage(document, pdfModel, false);

        for (let i = 0; i < reportModel.CareplanStats.length; i++) {
            y = addCareplanStats(reportModel.CareplanStats[i], document, y);
        }
        y = addCareplanHealthSystemStats(reportModel, document, y);

        setPageNumbers(document);
        document.end();

        await PDFGenerator.savePDFLocally(writeStream, absFilepath);
        return {
            absFilepath,
            filename
        };
    } catch (error) {
        throw new Error(`Unable to generate AHA stats report! ${error.message}`);
    }
};

const setPageNumbers = (document: PDFKit.PDFDocument) => {
    const pageRange: {
        start: number,
        count: number
    } = document.bufferedPageRange();
    for (let i = pageRange.start ; i < pageRange.count; i++ ) {
        document.switchToPage(i);
        PDFGenerator.addOrderPageNumber(document, i + 1, pageRange.count);
    }
    document.flushPages();
};

const addStatsPage = (document: PDFKit.PDFDocument, pdfModel: any, addToNewPage: boolean) => {
    var y = addTop(document, pdfModel, null, addToNewPage);
    addFooter(document, "https://www.heart.org/", pdfModel.FooterImagePath);
    return y;
};

const addCareplanStats = (model: any, document: PDFKit.PDFDocument, y: any) => {
    y = addCareplanTable(model, document, y);
    return y;
};

const addCareplanHealthSystemStats = (model: any, document: PDFKit.PDFDocument, y: any) => {
    y = addHealthSystemTable(model, document, y);
    return y;
};

const addCareplanTable = (model: any, document: PDFKit.PDFDocument, y: any) => {
    const sectionTitle = `${model.Careplan}`;
    y = isPageEnd(y, document, 'SectionTitle');
    y = addCholesterolSectionTitle(document, y, sectionTitle);
    y = isPageEnd(y, document, 'Row');
    y = addCareplanSummary(model, document, y, 1, 'Careplan');
    return y;
};

const addHealthSystemTable = (model: any, document: PDFKit.PDFDocument, y: any) => {
    const sectionTitle = `Health System Statistics`;
    y = isPageEnd(y, document, 'SectionTitle');
    y = addCholesterolSectionTitle(document, y, sectionTitle);
    y = isPageEnd(y, document, 'Row');
    y = addHealthSystemSummary(model, document, y, 1, 'HealthSystem');
    return y;
};

const addCholesterolSectionTitle = (document: PDFKit.PDFDocument, y: any, pageTitle: string) => {
    y = y + SpaceBeforeSectionTitle - 14;

    document
        .roundedRect(50, y, 500, 35, 2)
        .lineWidth(0.1)
        .fillOpacity(0.8)
        .fill("#e8ecef");

    y = y + 14;

    document
        .fillOpacity(1.0)
        .lineWidth(1)
        .fill("#444444");

    document
        .fillColor("#444444")
        .font('Helvetica')
        .fontSize(14);

    document
        .font('Helvetica-Bold')
        .text(pageTitle, 50, y, { align: "center" })
        .moveDown();

    y = y + SpaceAfterSectionTitle;

    return y;
};

const addCareplanSummary = (model, document, y, pageNumber, sectionTitle) => {
    let vals = [];
    const RowData = composeRowsData(model, pageNumber, sectionTitle);
    vals = [[true, 'Sr.No', 'Title', 'Count'], ...RowData];
    for (var r of vals) {
        const row: TableRowProperties = {
            IsHeaderRow : r[0],
            FontSize    : 14,
            RowOffset   : SpaceBetweenRow,
            Columns     : [
                {
                    XOffset : 50,
                    Text    : r[1],
                    Width   : 50
                },
                {
                    XOffset : 110,
                    Text    : r[2],
                    Width   : 384
                },
                {
                    XOffset : 504,
                    Text    : r[3],
                    Width   : 100
                },
            ]
        };
        y = isPageEnd(y, document, 'Row');
        y = addTableRow(document, y, row);
 
    }
    return y;
};

const addHealthSystemSummary = (model, document, y, pageNumber, sectionTitle) => {
    let vals = [];
    const RowData = composeRowsData(model, pageNumber, sectionTitle);
    vals = [[true, 'Sr.No', 'Careplan', 'Health System', 'Registration Count'], ...RowData];
    for (var r of vals) {
        const row: TableRowProperties = {
            IsHeaderRow : r[0],
            FontSize    : 14,
            RowOffset   : SpaceBetweenRow,
            Columns     : [
                {
                    XOffset : 50,
                    Text    : r[1],
                    Width   : 50
                },
                {
                    XOffset : 110,
                    Text    : r[2],
                    Width   : 150
                },
                {
                    XOffset : 250,
                    Text    : r[3],
                    Width   : 190
                },
                {
                    XOffset : 450,
                    Text    : r[4],
                    Width   : 100
                },
            ]
        };
        y = isPageEnd(y, document, 'Row');
        y = addTableRow(document, y, row);
 
    }
    return y;
};

const isPageEnd = (y: number, document: PDFKit.PDFDocument, head: string) => {
    if (head === 'Row') {
        if (y + SpaceBetweenRow > document.page.maxY() - FooterLength) {
            y = addStatsPage(document, pdfModel, true);
            return y;
        }
    }
    
    if (head === 'SectionTitle') {
        if (y + SpaceBeforeSectionTitle + SpaceAfterSectionTitle + SpaceBetweenRow * 3
            > document.page.maxY() - FooterLength) {
            y = addStatsPage(document, pdfModel, true);
            return y;
        }
    }
    return y;
};
const composeRowsData = (model, pageNumber: number, sectionTitle: string) => {
    const rows = [];
    let sequence = 1;
    if (sectionTitle === 'Careplan') {
        rows.push([false, sequence, `Total enrollments - ${model.Careplan}`, model.Enrollments]);
        sequence += 1;
        rows.push([false, sequence, `Total enrollments - ${model.Careplan} - real active`, model.ActiveEnrollments]);
        sequence += 1;
        rows.push([false, sequence, `Total enrollments - ${model.Careplan} - real deleted`, model.DeletedEnrollments]);
    }

    if (sectionTitle === 'HealthSystem') {
        for (let i = 0; i < model.CareplanHealthSystemStats.length; i++) {
            if (model.CareplanHealthSystemStats[i].Enrollments) {
                rows.push([false, sequence, `${model.CareplanHealthSystemStats[i].Careplan}`, `${model.CareplanHealthSystemStats[i].HealthSystem}`, `${model.CareplanHealthSystemStats[i].Enrollments}`]);
                sequence += 1;
            }
        }
    }
    return rows;
};
