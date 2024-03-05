import { PDFGenerator } from "../../../modules/reports/pdf.generator";
import { addFooter, addNoDataDisplay, addTop } from "../../users/patient/statistics/stat.report.commons";
import { TableRowProperties, addRectangularChartImage, addSquareChartImageWithLegend, addTableRow, chartExists } from "../../users/patient/statistics/report.helper";
import fs from 'fs';
import { FooterLength, SpaceAfterSectionTitle, SpaceBeforeSectionTitle, SpaceBetweenRow } from "./pdf.setting";
import { ChartColors } from "../../../modules/charts/chart.options";

///////////////////////////////////////////////////////////////////////////////////////////////

const pdfModel: any = {};

export const exportStatsChartReportToPDF = async (reportModel: any, chartImagePaths) => {
    try {
        var { absFilepath, filename } = await PDFGenerator.getAbsoluteFilePath('Summary Report');
        var writeStream = fs.createWriteStream(absFilepath);
        const reportTitle = `Summary Report`;
        reportModel.ChartImagePaths = chartImagePaths;
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

        addTenantStatsPage(document, reportModel, pdfModel, 1);
        document.end();

        await PDFGenerator.savePDFLocally(writeStream, absFilepath);
        return {
            absFilepath,
            filename
        };
    } catch (error) {
        throw new Error(`Unable to generate dashboard stats report! ${error.message}`);
    }
};

const addTenantStatsPage = (document, model, pdfModel, pageNumber) => {
    const y = addTop(document, pdfModel, null, false);
    addFooter(document, "https://www.heart.org/", pdfModel.FooterImagePath);
    addTenantStats(document, model, y);
    pageNumber += 1;
    return pageNumber;
};

export const addTenantStats = (document, model, y) => {

    let chartImage = 'UserAge';
    let titleColor = '#505050';
    const sectionTitle = 'Users Statistics';
    y = addSectionTitle(document, y, sectionTitle);

    if (!chartExists(model, chartImage)) {
        y = addNoDataDisplay(document, y);
    } else {
        y = y + 25;
        const legend = [
            {
                Key   : 'Below 35',
                Color : ChartColors.MediumSeaGreen,
            },
            {
                Key   : '36 to 70',
                Color : ChartColors.OrangeRed,
            },
            {
                Key   : 'Above 71',
                Color : ChartColors.SlateGray,
            },
            {
                Key   : 'Not Specified',
                Color : ChartColors.BlueViolet,
            }
        ];
        chartImage = 'UserAge';
        const title = 'Users Age Distribution';
        y = addSquareChartImageWithLegend(document, model, chartImage, y, title, titleColor, legend, 40, 150);
    }

    chartImage = 'UserGender';
    titleColor = '#505050';
 
    if (!chartExists(model, chartImage)) {
        y = addNoDataDisplay(document, y);
    } else {
        y = y + 25;
        const legend = [
            {
                Key   : 'Male',
                Color : ChartColors.MediumSeaGreen,
            },
            {
                Key   : 'Female',
                Color : ChartColors.OrangeRed,
            },
            {
                Key   : 'Intersex',
                Color : ChartColors.SlateGray,
            },
            {
                Key   : 'Not Specified',
                Color : ChartColors.BlueViolet,
            }
        ];
        chartImage = 'UserGender';
        const title = 'Users Gender Wise Distribution';
        y = addSquareChartImageWithLegend(document, model, chartImage, y, title, titleColor, legend, 40, 150);
    }

    chartImage = 'Users_OverYear';
    titleColor = '#505050';

    y = y + 7;

    chartImage = 'Users_OverYear';
    const detailedTitle = 'User Over Years';

    if (!chartExists(model, chartImage)) {
        y = addNoDataDisplay(document, y);
    } else {
        y = y + 25;
        y = addRectangularChartImage(document, model, chartImage, y, detailedTitle, titleColor);
        y = y + 20;
    }

    return y;
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

const addUserStats = (model: any, document: PDFKit.PDFDocument, y: any) => {
    y = addUserStatsTable(model, document, y);
    return y;
};

const addUserStatsTable = (model: any, document: PDFKit.PDFDocument, y: any) => {
    const sectionTitle = `User Statistics`;
    y = isPageEnd(y, document, 'SectionTitle');
    y = addSectionTitle(document, y, sectionTitle);
    y = isPageEnd(y, document, 'Row');
    // y = addSummary(model, document, y, 1);
    y = addSummaryChart(model, document, y, 1);
    return y;
};

const addSectionTitle = (document: PDFKit.PDFDocument, y: any, pageTitle: string) => {
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

const addSummary = (model, document, y, pageNumber) => {
    let vals = [];
    const RowData = composeRowsData(model, pageNumber);
    vals = [[true, 'Sr.No', 'Title', 'Count'], ...RowData];
    for (var r of vals) {
        const row: TableRowProperties = {
            IsHeaderRow : r[0],
            FontSize    : 14,
            RowOffset   : SpaceBetweenRow,
            Columns     : [
                {
                    XOffset : 50,
                    Text    : r[1]
                },
                {
                    XOffset : 110,
                    Text    : r[2]
                },
                {
                    XOffset : 504,
                    Text    : r[3]
                },
            ]
        };
        y = isPageEnd(y, document, 'Row');
        y = addTableRow(document, y, row);
 
    }
    return y;
};

const addSummaryChart = (model, document, y, pageNumber) => {
    y = addRectangularChartImage(document, {
        ChartImagePath : [
            {
                key      : "chartImage",
                location : 200
            }
        ]
    }, "chartImage", y, "detailedTitle", '#505050');
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
const composeRowsData = (model, pageNumber: number) => {
    const rows = [];
    const pdfData: any[] = generatePDFData(model);
    let sequence = 1;

    pdfData.forEach(row => {
        rows.push([false, sequence, `${row.Title}`, row.Count]);
        sequence += 1;
    });
    return rows;
};

const generatePDFData = (model) => {
    const rows = [];
    rows.push({
        Title : "Total Users",
        Count : model.UsersCountStats.TotalUsers.Count
    });
    rows.push({
        Title : "Total Not Deleted Users",
        Count : model.UsersCountStats.NotDeletedUsers.Count
    });
    rows.push({
        Title : "Users With Active Sessions",
        Count : model.UsersCountStats.UsersWithActiveSession.Count
    });
    rows.push({
        Title : "Total Deleted Users",
        Count : model.UsersCountStats.DeletedUsers.Count
    });
    rows.push({
        Title : "Total Enrolled Users",
        Count : model.UsersCountStats.EnrolledUsers.Count
    });
    model.DeviceDetailWiseUsers.forEach(user => {
        rows.push({
            Title : `${user.OSType} Users`,
            Count : user.Count
        });
    });

    model.AgeWiseUsers.forEach(user => {
        rows.push({
            Title : `Users With Age - ${user.Status}`,
            Count : user.Count
        });
    });

    model.GenderWiseUsers.forEach(user => {
        rows.push({
            Title : `Users With Gender - ${user.Gender}`,
            Count : user.Count
        });
    });

    model.MaritalStatusWiseUsers.forEach(user => {
        rows.push({
            Title : `Users With Marital Status - ${user.MaritalStatus}`,
            Count : user.Count
        });
    });

    model.MajorAilmentDistribution.forEach(user => {
        rows.push({
            Title : `Users With Major Ailment - ${user.MajorAilment}`,
            Count : user.Count
        });
    });

    model.AddictionDistribution.forEach(user => {
        rows.push({
            Title : `${user.Status} - Users`,
            Count : user.Count
        });
    });

    return rows;
};
