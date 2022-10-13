/* eslint-disable @typescript-eslint/no-unused-vars */
import { AssessmentDto } from '../../../domain.types/clinical/assessment/assessment.dto';
import { PatientDetailsDto } from '../../../domain.types/users/patient/patient/patient.dto';
import { PDFGenerator } from '../../../modules/reports/pdf.generator';
import { htmlTextToPNG } from '../../../common/html.renderer';
import { TimeHelper } from '../../../common/time.helper';
import { Helper } from '../../../common/helper';
import { DateStringFormat } from '../../../domain.types/miscellaneous/time.types';
import { kccqChartHtmlText } from './kccq.chart.html';
import { KccqScore } from './kccq.types';
import * as fs from 'fs';
import * as path from 'path';
import { FileResourceService } from '../../../services/general/file.resource.service';
import { Loader } from '../../../startup/loader';

///////////////////////////////////////////////////////////////////////////////////////

export const generateReportPDF = async (
    patient: PatientDetailsDto,
    assessment: AssessmentDto,
    score: KccqScore): Promise<string> => {
    const reportModel = getReportModel(patient, assessment, score);
    const htmlText = await generateChartHtml(score);
    const chartImagePath = await htmlTextToPNG(htmlText, 400, 300);
    const absoluteChartImagePath = path.join(process.cwd(), chartImagePath);
    const reportUrl = await exportReportToPDF(reportModel, absoluteChartImagePath);
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
    
    const patientName = patient.User.Person.DisplayName;
    const patientAge = Helper.getAgeFromBirthDate(patient.User.Person.BirthDate);
    const assessmentDate = assessment.FinishedAt ?? new Date();
    const assessmentDateStr = assessmentDate.toISOString().split('T')[0];
    const reportDate = TimeHelper.getDateWithTimezone(assessmentDateStr, patient.User.DefaultTimeZone);
    const reportDateStr = TimeHelper.getDateString(reportDate, DateStringFormat.YYYY_MM_DD);

    return {
        Name       : patientName,
        DisplayId  : patient.DisplayId,
        Age        : patientAge,
        ReportDate : reportDateStr,
        ...score
    };
};

const exportReportToPDF = async (reportModel: any, absoluteChartImagePath: string): Promise<string> => {
    try {
        var { absFilepath, filename } = await PDFGenerator.getAbsoluteFilePath('Quality-of-Life-Report-');
        var writeStream = fs.createWriteStream(absFilepath);
        const reportTitle = `Quality of Life Score`;
        const author = 'REAN Foundation';
        var document = PDFGenerator.createDocument(reportTitle, author, writeStream);
        PDFGenerator.addNewPage(document);
        var y = 25;
        const ahaHeaderImagePath = './assets/images/AHA_header_2.png';
        const ahaFooterImagePath = './assets/images/AHA_footer_1.png';
        y = addHeader(document, reportTitle, y, ahaHeaderImagePath);
        y = addReportMetadata(document, reportModel, y);
        y = addChartImage(document, absoluteChartImagePath, y);
        y = addScoreDetails(document, reportModel, y);
        PDFGenerator.addOrderPageNumber(document, 1, 1);
        addOrderFooter(document, "https://www.heart.org/", ahaFooterImagePath);
        document.end();
        const localFilePath = await PDFGenerator.savePDFLocally(writeStream, absFilepath);
        const url = await uploadFile(localFilePath);
        return url;
    }
    catch (error) {
        throw new Error(`Unable to generate assessment report! ${error.message}`);
    }
};

const uploadFile = async (sourceLocation: string): Promise<string> => {
    const filename = path.basename(sourceLocation);
    const dateFolder = TimeHelper.getDateString(new Date(), DateStringFormat.YYYY_MM_DD);
    const storageKey = `resources/${dateFolder}/${filename}`;
    const fileResourceService = Loader.container.resolve(FileResourceService);
    const dto = await fileResourceService.uploadLocal(sourceLocation, storageKey, false);
    return dto.DefaultVersion.Url;
};

const addHeader = (document: PDFKit.PDFDocument, title: string, y: number, headerImagePath: string) => {
        
    var imageFile = path.join(process.cwd(), headerImagePath);

    document
        .image(imageFile, 0, 0, { width: 595 })
        .fillColor("#c21422")
        .font('Helvetica')
        .fontSize(16)
        .text(title, 100, y, { align: 'center' });

    document
        .fontSize(7);

    y = y + 24;
        
    document.moveDown();

    return y;
};

const addScoreDetails = (document: PDFKit.PDFDocument, model: any, y: number): number => {

    y = y + 35;
    
    document
        .fillColor('#444444')
        .fontSize(10)
        .text('Date: ' + model.ReportDate, 200, y, { align: "right" })
        .moveDown();
   
    y = y + 40;
    
    //DrawLine(document, y);
    document
        .roundedRect(50, y, 500, 40, 1)
        .lineWidth(0.1)
        .fillOpacity(0.8)
    //.fillAndStroke("#EBE0FF", "#6541A5");
        .fill("#e8ecef");
    
    y = y + 10;
    
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
        .text('Overall Score', 75, y, { align: "left" })
        .font('Helvetica')
        .text(overallScore, 175, y, { align: "left" })
        .moveDown();
    
    y = y + 35;

    const physicalLimitationScore = model.PhysicalLimitation_KCCQ_PL_score.toFixed();
    const symptomFrequencyScore = model.SymptomFrequency_KCCQ_SF_score.toFixed();
    const qualityOfLifeScore = model.QualityOfLife_KCCQ_QL_score.toFixed();
    const socialLimitationScore = model.SocialLimitation_KCCQ_SL_score.toFixed();
    const clinicalSummaryScore = model.ClinicalSummaryScore.toFixed();

    document
        .font('Helvetica-Bold')
        .text('Physical limitation', 75, y, { align: "left" })
        .font('Helvetica')
        .text(physicalLimitationScore, 175, y, { align: "left" })
        .moveDown();
    y = y + 18;

    document
        .font('Helvetica-Bold')
        .text('Physical limitation', 75, y, { align: "left" })
        .font('Helvetica')
        .text(symptomFrequencyScore, 175, y, { align: "left" })
        .moveDown();
    y = y + 18;

    document
        .font('Helvetica-Bold')
        .text('Physical limitation', 75, y, { align: "left" })
        .font('Helvetica')
        .text(qualityOfLifeScore, 175, y, { align: "left" })
        .moveDown();
    y = y + 18;

    document
        .font('Helvetica-Bold')
        .text('Physical limitation', 75, y, { align: "left" })
        .font('Helvetica')
        .text(socialLimitationScore, 175, y, { align: "left" })
        .moveDown();
    y = y + 18;
    
    document
        .font('Helvetica-Bold')
        .text('Physical limitation', 75, y, { align: "left" })
        .font('Helvetica')
        .text(clinicalSummaryScore, 175, y, { align: "left" })
        .moveDown();
    y = y + 18;

    return y;
};

const addChartImage = (document: PDFKit.PDFDocument, absoluteChartImagePath: string, y: number): number => {

    document
        .image(absoluteChartImagePath, 0, 0, { width: 350, align: 'center' });

    document
        .fontSize(7);

    y = y + 350;
        
    document.moveDown();

    return y;
};

const addReportMetadata = (document: PDFKit.PDFDocument, model: any, y: number): number => {
    y = y + 35;
       
    //DrawLine(document, y);
    document
        .roundedRect(50, y, 500, 40, 1)
        .lineWidth(0.1)
        .fillOpacity(0.8)
    //.fillAndStroke("#EBE0FF", "#6541A5");
        .fill("#e8ecef");
    
    y = y + 10;
    
    document
        .fillOpacity(1.0)
        .lineWidth(1)
        .fill("#444444");
    
    document
        .fillColor("#444444")
        .font('Helvetica')
        .fontSize(10);
    
    document
        .font('Helvetica-Bold')
        .text('Patient', 75, y, { align: "left" })
        .font('Helvetica')
        .text(model.Name, 175, y, { align: "left" })
        .moveDown();
    
    y = y + 15;
    document
        .font('Helvetica-Bold')
        .text('Patient ID', 75, y, { align: "left" })
        .font('Helvetica')
        .text(model.DisplayId, 175, y, { align: "left" })
        .moveDown();

    return y;
};

const addOrderFooter = (document, text, logoImagePath) => {
    
    //var imageFile = path.join(process.cwd(), "./assets/images/REANCare_Footer.png");
    var imageFile = path.join(process.cwd(), logoImagePath);

    document
        .image(imageFile, 0, 800, { width: 595 });

    document
        .fontSize(8)
        .fillColor('#ffffff');

    document
        .text(text, 100, 810, { align: "right" });
};
