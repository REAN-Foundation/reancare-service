/* eslint-disable @typescript-eslint/no-unused-vars */
import { AssessmentDto } from '../../../domain.types/clinical/assessment/assessment.dto';
import { PatientDetailsDto } from '../../../domain.types/users/patient/patient/patient.dto';
import { PDFGenerator } from '../../../modules/reports/pdf.generator';
import { htmlTextToPNG } from '../../../common/html.renderer';
import { TimeHelper } from '../../../common/time.helper';
import { Helper } from '../../../common/helper';
import { DateStringFormat, DurationType } from '../../../domain.types/miscellaneous/time.types';
import { kccqChartHtmlText } from './kccq.chart.html';
import { KccqScore } from './kccq.types';
import { FileResourceService } from '../../../services/general/file.resource.service';
import { Loader } from '../../../startup/loader';
import { DocumentDomainModel } from '../../../domain.types/users/patient/document/document.domain.model';
import { DocumentTypes } from '../../../domain.types/users/patient/document/document.types';
import { DocumentService } from '../../../services/users/patient/document.service';
import { Logger } from '../../../common/logger';
import * as fs from 'fs';
import * as path from 'path';

///////////////////////////////////////////////////////////////////////////////////////

export const generateReportPDF = async (
    patient: PatientDetailsDto,
    assessment: AssessmentDto,
    score: KccqScore): Promise<string> => {
    const reportModel = getReportModel(patient, assessment, score);
    const htmlText = await generateChartHtml(score);
    const chartImagePath = await htmlTextToPNG(htmlText, 370, 250);
    const reportUrl = await exportReportToPDF(reportModel, chartImagePath);
    return reportUrl;
};

const generateChartHtml = async (
    score: KccqScore): Promise<string> => {
    const overallScore = score.OverallSummaryScore.toFixed();
    var txt = kccqChartHtmlText;
    txt = txt.replace('{{GAUGE_VALUE}}', overallScore);
    txt = txt.replace('{{GAUGE_VALUE}}', overallScore);
    return txt;
};

const getReportModel = (
    patient: PatientDetailsDto,
    assessment: AssessmentDto,
    score: any) => {

    const timezone = patient.User?.DefaultTimeZone ?? '+05:30';
    const date = assessment.FinishedAt ?? new Date();
    const patientName = patient.User.Person.DisplayName;
    const patientAge = Helper.getAgeFromBirthDate(patient.User.Person.BirthDate);
    var offsetMinutes = TimeHelper.getTimezoneOffsets(timezone, DurationType.Minute);
    const assessmentDate = TimeHelper.addDuration(date, offsetMinutes, DurationType.Minute);
    const reportDateStr = assessmentDate.toISOString().split('T')[0];

    return {
        Name          : patientName,
        PatientUserId : patient.User.id,
        AssessmentId  : assessment.id,
        DisplayId     : patient.DisplayId,
        Age           : patientAge,
        ReportDate    : date,
        ReportDateStr : reportDateStr,
        ...score
    };
};

const exportReportToPDF = async (reportModel: any, absoluteChartImagePath: string): Promise<string> => {
    try {
        var { absFilepath, filename } = await PDFGenerator.getAbsoluteFilePath('Quality-of-Life-Questionnaire-Score');
        var writeStream = fs.createWriteStream(absFilepath);
        const reportTitle = `Quality of Life Questionnaire Score`;
        const author = 'REAN Foundation';
        var document = PDFGenerator.createDocument(reportTitle, author, writeStream);
        //PDFGenerator.addNewPage(document);
        var y = 17;
        const ahaHeaderImagePath = './assets/images/AHA_header_2.png';
        const ahaFooterImagePath = './assets/images/AHA_footer_1.png';
        y = addHeader(document, reportTitle, y, ahaHeaderImagePath);
        y = addReportMetadata(document, reportModel, y);
        y = addChartImage(document, absoluteChartImagePath, y);
        y = addScoreDetails(document, reportModel, y);
        PDFGenerator.addOrderPageNumber(document, 1, 1);
        addOrderFooter(document, "https://www.heart.org/HF", ahaFooterImagePath);
        document.end();
        const localFilePath = await PDFGenerator.savePDFLocally(writeStream, absFilepath);
        const { url, resourceId } = await uploadFile(localFilePath);

        const mimeType = Helper.getMimeType(filename);
        const documentModel: DocumentDomainModel = {
            DocumentType  : DocumentTypes.Assessment,
            PatientUserId : reportModel.PatientUserId,
            RecordDate    : reportModel.ReportDate,
            UploadedDate  : new Date(),
            FileMetaData  : {
                ResourceId       : resourceId,
                OriginalName     : filename,
                Url              : url,
                IsDefaultVersion : true,
                MimeType         : mimeType,
            }
        };
        const patientDocumentService = Loader.container.resolve(DocumentService);
        const documentDto = await patientDocumentService.upload(documentModel);
        Logger.instance().log(`Document Id: ${documentDto.id}`);

        return url;
    }
    catch (error) {
        throw new Error(`Unable to generate assessment report! ${error.message}`);
    }
};

const uploadFile = async (sourceLocation: string) => {
    const filename = path.basename(sourceLocation);
    const dateFolder = TimeHelper.getDateString(new Date(), DateStringFormat.YYYY_MM_DD);
    const storageKey = `resources/${dateFolder}/${filename}`;
    const fileResourceService = Loader.container.resolve(FileResourceService);
    const dto = await fileResourceService.uploadLocal(sourceLocation, storageKey, false);
    const url = dto.DefaultVersion.Url;
    const resourceId = dto.id;
    return { url, resourceId };
};

const addHeader = (document: PDFKit.PDFDocument, title: string, y: number, headerImagePath: string) => {

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

const addScoreDetails = (document: PDFKit.PDFDocument, model: any, y: number): number => {

    y = y + 230;

    //DrawLine(document, y);
    document
        .roundedRect(150, y, 300, 38, 1)
        .lineWidth(0.1)
        .fillOpacity(0.8)
    //.fillAndStroke("#EBE0FF", "#6541A5");
        .fill("#e8ecef");

    y = y + 13;

    document
        .fillOpacity(1.0)
        .lineWidth(1)
        .fill("#444444");

    document
        .fillColor("#444444")
        .font('Helvetica')
        .fontSize(10);

    const overallScore = model.OverallSummaryScore.toFixed();

    document
        .font('Helvetica-Bold')
        .fontSize(16)
        .text('Overall Score', 215, y, { align: "left" })
        .fillColor("#c21422")
        .font('Helvetica-Bold')
        .text(overallScore, 365, y, { align: "left" })
        .moveDown();

    y = y + 65;

    const physicalLimitationScore = model.PhysicalLimitation_KCCQ_PL_score.toFixed();
    const symptomFrequencyScore = model.SymptomFrequency_KCCQ_SF_score.toFixed();
    const qualityOfLifeScore = model.QualityOfLife_KCCQ_QL_score.toFixed();
    const socialLimitationScore = model.SocialLimitation_KCCQ_SL_score.toFixed();
    const clinicalSummaryScore = model.ClinicalSummaryScore.toFixed();

    const labelX = 180;
    const valueX = 400;
    const rowYOffset = 25;

    document
        .fontSize(12)
        .fillColor("#444444");

    document
        .font('Helvetica-Bold')
        .text('Physical Limitation Score', labelX, y, { align: "left" })
        .font('Helvetica')
        .text(physicalLimitationScore, valueX, y, { align: "left" })
        .moveDown();
    y = y + rowYOffset;

    document
        .font('Helvetica-Bold')
        .text('Symptom Frequency Score', labelX, y, { align: "left" })
        .font('Helvetica')
        .text(symptomFrequencyScore, valueX, y, { align: "left" })
        .moveDown();
    y = y + rowYOffset;

    document
        .font('Helvetica-Bold')
        .text('Quality of Life Score', labelX, y, { align: "left" })
        .font('Helvetica')
        .text(qualityOfLifeScore, valueX, y, { align: "left" })
        .moveDown();
    y = y + rowYOffset;

    document
        .font('Helvetica-Bold')
        .text('Social Limitation Score', labelX, y, { align: "left" })
        .font('Helvetica')
        .text(socialLimitationScore, valueX, y, { align: "left" })
        .moveDown();
    y = y + rowYOffset;

    document
        .font('Helvetica-Bold')
        .text('Clinical Summary Score', labelX, y, { align: "left" })
        .font('Helvetica')
        .text(clinicalSummaryScore, valueX, y, { align: "left" })
        .moveDown();
    y = y + rowYOffset;

    return y;
};

const addChartImage = (document: PDFKit.PDFDocument, absoluteChartImagePath: string, y: number): number => {

    y = y + 35;

    document
        .image(absoluteChartImagePath, 125, y, { width: 350, align: 'center' });

    document
        .fontSize(7);

    y = y + 25;

    document.moveDown();

    return y;
};

const addReportMetadata = (document: PDFKit.PDFDocument, model: any, y: number): number => {

    y = y + 45;

    document
        .fillColor('#444444')
        .fontSize(10)
        .text('Date: ' + model.ReportDateStr, 200, y, { align: "right" })
        .moveDown();

    y = y + 20;

    //DrawLine(document, y);
    document
        .roundedRect(50, y, 500, 65, 1)
        .lineWidth(0.1)
        .fillOpacity(0.8)
    //.fillAndStroke("#EBE0FF", "#6541A5");
        .fill("#e8ecef");

    y = y + 20;

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
        .text('Patient', 90, y, { align: "left" })
        .font('Helvetica')
        .text(model.Name, 190, y, { align: "left" })
        .moveDown();

    y = y + 23;

    document
        .font('Helvetica-Bold')
        .text('Patient ID', 90, y, { align: "left" })
        .font('Helvetica')
        .text(model.DisplayId, 190, y, { align: "left" })
        .moveDown();

    return y;
};

const addOrderFooter = (document, text, logoImagePath) => {

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
