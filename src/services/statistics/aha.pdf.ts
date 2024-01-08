import { PDFGenerator } from "../../modules/reports/pdf.generator";
import { addBottom, addFooter, addTop } from "../users/patient/statistics/stat.report.commons";
import { TableRowProperties, addTableRow } from "../users/patient/statistics/report.helper";
import fs from 'fs';

///////////////////////////////////////////////////////////////////////////////////////////////

export const generateAhaStatsReport = async (reportModel: any) => {
    return await exportAhaStatsReportToPDF(reportModel);
};

const exportAhaStatsReportToPDF = async (reportModel: any) => {
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
        const pdfModel: any = {};
        pdfModel.ReportTitle = reportTitle;
        pdfModel.Author = 'REAN Foundation';
        pdfModel.TotalPages = 1;
        pdfModel.HeaderImagePath = './assets/images/AHA_header_2.png';
        pdfModel.FooterImagePath = './assets/images/AHA_footer_1.png';
        pdfModel.ReportDateStr = reportDateStr;

        var document = PDFGenerator.createDocument(reportTitle, pdfModel.Author, writeStream);
        let pageNumber = 1;
        pdfModel.TotalPages = 8;

        pageNumber = addCareplanPage(document, { ...reportModel, ...pdfModel }, pageNumber);

        if ('CholesterolWellstarHealthSystem' in reportModel){
            pageNumber = addHealthSystemPage(
                document,
                { ...reportModel.CholesterolWellstarHealthSystem, ...pdfModel },
                pageNumber,
            );
        }

        if ('UserEnrollmentForUCSanDiegoHealth' in reportModel){
            pageNumber = addHealthSystemPage(
                document,
                { ...reportModel.UserEnrollmentForUCSanDiegoHealth, ...pdfModel },
                pageNumber
            );
        }

        if ('UserEnrollmentForAtriumHealth' in reportModel){
            pageNumber = addHealthSystemPage(
                document,
                { ...reportModel.UserEnrollmentForAtriumHealth, ...pdfModel },
                pageNumber
            );
        }
        
        if ('UserEnrollmentForMHealthFairview' in reportModel){
            pageNumber = addHealthSystemPage(
                document,
                { ...reportModel.UserEnrollmentForMHealthFairview, ...pdfModel },
                pageNumber
            );
        }

        if ('UserEnrollmentForKaiserPermanente' in reportModel){
            pageNumber = addHealthSystemPage(
                document,
                { ...reportModel.UserEnrollmentForKaiserPermanente, ...pdfModel },
                pageNumber
            );
        }

        if ('UserEnrollmentForNebraskaHealthSystem' in reportModel){
            pageNumber = addHealthSystemPage(
                document,
                { ...reportModel.UserEnrollmentForNebraskaHealthSystem, ...pdfModel },
                pageNumber
            );
        }

        if ('UserEnrollmentForHCAHealthcare' in reportModel){
            addHealthSystemPage(
                document,
                { ...reportModel.UserEnrollmentForHCAHealthcare, ...pdfModel },
                pageNumber
            );
        }

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

const addCareplanPage = (document, model, pageNumber) => {
    var y = addTop(document, model, null, false);
    y = addCholesterolStats(model, document, y);
    y = addStrokeStats(model, document, y);
    addHFMotivatorStats(model, document, y);
    addBottom(document, pageNumber, model);
    addFooter(document, "https://www.heart.org/", model.FooterImagePath);
    pageNumber += 1;
    return pageNumber;
};

const addCholesterolStats = (model: any, document: PDFKit.PDFDocument, y: any) => {
    y = addCholesterolTable(model, document, y);
    return y;
};

const addStrokeStats = (model: any, document: PDFKit.PDFDocument, y: any) => {
    y = addStrokeTable(model, document, y);
    return y;
};

const addHFMotivatorStats = (model: any, document: PDFKit.PDFDocument, y: any) => {
    y = addHFMotivatorTable(model, document, y);
    return y;
};

const addCholesterolTable = (model: any, document: PDFKit.PDFDocument, y: any) => {
    const sectionTitle = 'Cholesterol Careplan Statistics';
    y = addCholesterolSectionTitle(document, y, sectionTitle);
    y = addSummary(model, document, y, 1, 'Cholesterol');
    return y;
};

const addHFMotivatorTable = (model: any, document: PDFKit.PDFDocument, y: any) => {
    const sectionTitle = 'HF Motivator Careplan Statistics';
    y = addCholesterolSectionTitle(document, y, sectionTitle);
    y = addSummary(model, document, y, 1, 'HF Motivator');
    return y;
};

const addStrokeTable = (model: any, document: PDFKit.PDFDocument, y: any) => {
    const sectionTitle = 'Stroke Careplan Statistics';
    y = addCholesterolSectionTitle(document, y, sectionTitle);
    y = addSummary(model, document, y, 1, 'Stroke');
    return y;
};

const addCholesterolSectionTitle = (document: PDFKit.PDFDocument, y: any, pageTitle: string) => {
    y = y + 50;

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

    y = y + 17;

    return y;
};

const addHealthSystemPage = (document, model, pageNumber) => {
    var y = addTop(document, model, null, true);
    addHealthSystemStats(model, document, y);
    addBottom(document, pageNumber, model);
    addFooter(document, "https://www.heart.org/", model.FooterImagePath);
    pageNumber += 1;
    return pageNumber;
};

const addHealthSystemStats = (model: any, document: PDFKit.PDFDocument, y: any) => {
    y = addHealthSystemTable(model, document, y);
    return y;
};

const addHealthSystemTable = (model: any, document: PDFKit.PDFDocument, y: any) => {
    const sectionTitle = `${model.CareplanCode} - ${model.HealthSystem} Statistics`;
    y = addCholesterolSectionTitle(document, y, sectionTitle);
    const lastSerialNumber = addSummary(model, document, y, 1, sectionTitle);
    return lastSerialNumber.Y;
};

const addSummary = (model, document, y, pageNumber, sectionTitle) => {
    let vals = [];
    const RowData = composeRowsData(model, pageNumber, sectionTitle);
    vals = [[true, 'Sr.No', 'Title', 'Count'], ...RowData];
    for (var r of vals) {
        const row: TableRowProperties = {
            IsHeaderRow : r[0],
            FontSize    : 14,
            RowOffset   : 30,
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
        y = addTableRow(document, y, row);
    }
    return y;
};

const composeRowsData = (model, pageNumber: number, sectionTitle: string) => {
    const rows = [];
    let sequence = 1;
    if (sectionTitle === 'Cholesterol') {
        if ('TotalCholesterolEnrollments' in model) {
            rows.push([false, sequence, 'Total enrollments - Cholesterol', model.TotalCholesterolEnrollments]);
            sequence += 1;
        }
        if ('TotalActiveCholesterolEnrollments' in model) {
            rows.push([false, sequence, 'Total enrollments - Cholesterol - real active', model.TotalActiveCholesterolEnrollments]);
            sequence += 1;
        }
        if ('TotalDeletedCholesterolEnrollments' in model) {
            rows.push([false, sequence, 'Total enrollments - Cholesterol - real deleted', model.TotalDeletedCholesterolEnrollments]);
            sequence += 1;
        }
    }
    if (sectionTitle === 'Stroke') {
        if ('TotalStrokeEnrollments' in model) {
            rows.push([false, sequence, 'Total enrollments - Stroke', model.TotalStrokeEnrollments]);
            sequence += 1;
        }
        if ('TotalActiveStrokeEnrollments' in model) {
            rows.push([false, sequence, 'Total enrollments - Stroke - real active', model.TotalActiveStrokeEnrollments]);
            sequence += 1;
        }
        if ('TotalDeletedStrokeEnrollments' in model) {
            rows.push([false, sequence, 'Total enrollments - Stroke - real deleted', model.TotalDeletedStrokeEnrollments]);
            sequence += 1;
        }
    }

    if (sectionTitle === 'HF Motivator') {
        if ('TotalHeartFailureEnrollments' in model) {
            rows.push([false, sequence, 'Total enrollments - HeartFailure', model.TotalHeartFailureEnrollments]);
            sequence += 1;
        }
        if ('TotalActiveHeartFailureEnrollments' in model) {
            rows.push([false, sequence, 'Total enrollments - HeartFailure - real active', model.TotalActiveHeartFailureEnrollments]);
            sequence += 1;
        }
        if ('TotalDeletedHeartFailureEnrollments' in model) {
            rows.push([false, sequence, 'Total enrollments - HeartFailure - real deleted', model.TotalDeletedHeartFailureEnrollments]);
            sequence += 1;
        }
    }

    if (sectionTitle === `${model.CareplanCode} - ${model.HealthSystem} Statistics`) {
        if ('CareplanCode' in model) {
            rows.push([false, sequence, `${model.CareplanCode}-${model.HealthSystem} registration count`, model.CareplanEnrollmentCount]);
            sequence += 1;
        }
        const patientCountForHospital = model.PatientCountForHospital;
        patientCountForHospital.forEach(element => {
            rows.push([false, sequence, `${element.HospitalName}`, element.PatientCount]);
            sequence += 1;
        });
    }
    return rows;
};
