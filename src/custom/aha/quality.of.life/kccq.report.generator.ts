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
        y = addHeader(document, reportTitle, y, ahaHeaderImagePath);
        y = addReportMetadata(document, reportModel, y);
        y = addChartImage(document, absoluteChartImagePath, y);
        PDFGenerator.addOrderPageNumber(document, 1, 1);

        return '';
    }
    catch (error) {
        throw new Error(`Unable to generate assessment report! ${error.message}`);
    }
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

const addReportMetadata = (document: PDFKit.PDFDocument, model: any, y: number) => {

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

const addChartImage = (document: PDFKit.PDFDocument, absoluteChartImagePath: string, y: number) => {

    return y;
};

// async function crea(author, title, model) {

//     return new Promise(async (resolve, reject) => {
//         try {
//             var { absFilepath, filename } = await PDFGenerator.getAbsoluteFilePath('Quality-of-Life-Report-');
//             var writeStream = fs.createWriteStream(absFilepath);

//             const document = PDFGenerator.createDocument(title, author, writeStream);

//             const NUM_ITEMS_PER_PAGE = 8;
//             var numPages = Math.ceil(model.Items.length / NUM_ITEMS_PER_PAGE);
//             var y = 17;

//             for (var i = 0; i < numPages; i++) {

//                 if (i > 0) {
//                     PDFGenerator.addNewPage(document);
//                 }
//                 var pageNumber = i + 1;
//                 y = 17;
//                 y = PDFGenerator.addOrderHeader(document, model, y);
//                 y = addOrderMiddleArea(document, model, y, pageNumber);
//                 PDFGenerator.addOrderPageNumber(document, pageNumber, numPages);
//                 y = PDFGenerator.addOrderFooter(document, model, y);
//             }
//             document.end();
//             // return { writeStream, absFilepath, filename };
//             resolve({ writeStream, absFilepath, filename });
//         }
//         catch (error) {
//             reject(error);
//         }
//     });

// }

// const exportOrderToPDF = async (drugOrderId, regenerate) => {

//     var uploaded = null;

//     try {

//         var order = await DrugOrder.findByPk(drugOrderId);
//         if (order == null) {
//             throw new Error('Drug order with id: ' + drugOrderId + ' cannot be found!');
//         }

//         if (order.PDFResourceId != null && !regenerate) {
//             var resource = await ResouceLocation.findByPk(order.PDFResourceId);
//             if (resource != null && resource.s3_key != null) {
//                 var tokens = resource.s3_key.split('/');
//                 var filename = tokens[tokens.length - 1];
//                 uploaded = {
//                     FileName: filename,
//                     ResourceId: order.PDFResourceId,
//                     Url: process.env.THIS_BASE_URL + '/resources/download/' + order.PDFResourceId,
//                     MimeType: resource.MimeType
//                 }
//                 return uploaded;
//             }
//         }

//         var patientUserId = order.PatientUserId;
//         var doctorUserId = order.DoctorUserId;
//         var visitId = order.VisitId;
//         var suggestedPharmacyId = order.SuggestedPharmacyId;

//         var patient = await PatientService.GetByUserId(patientUserId);
//         if (patient == null) {
//             throw new Error('Patient with id: ' + patientUserId + ' cannot be found!');
//         }
//         var doctor = await DoctorService.GetByUserId(doctorUserId);
//         if (doctor == null) {
//             throw new Error('Doctor with id: ' + doctorUserId + ' cannot be found!');
//         }
//         var visit = await DoctorVisit.findByPk(visitId);
//         if (visit == null) {
//             throw new Error('Visit with id: ' + visitId + ' cannot be found!');
//         }
//         var suggestedPharmacy = await PharmacyService.GetByUserId(suggestedPharmacyId);

//         var medications = await Medication.findAll({
//             where: {
//                 PatientUserId: patientUserId,
//                 DrugOrderId: drugOrderId,
//                 DoctorUserId: doctorUserId
//             }
//         });

//         var author = 'Dr. ' + doctor.FirstName + ' ' + doctor.LastName;
//         var title = 'Medication Prescription';

//         var model = CreateDrugOrderDataModel(title, doctor, patient, visit, order, medications, suggestedPharmacy);
//         Logger.Log('Created order model for pdf.');

//         var { writeStream, absFilepath, filename } = await CreateDrugOrderPDF(author, title, model);

//         Logger.Log('Saving pdf...');
//         var x = await PDFGenerator.SavePDFLocally(writeStream, absFilepath);
//         Logger.Log('Saved.');

//         var timestamp = new Date().getTime().toString();
//         var displayId = 'MDPRSC-' + timestamp;

//         var fileDetails = [];

//         var fileStats = fs.statSync(absFilepath);
//         fileDetails.push({
//             name: filename,
//             path: absFilepath,
//             mimetype: mime.getType(absFilepath),
//             original_name: filename,
//             size: fileStats.size
//         });

//         var keyword = DocumentTypes.PatientMedPrescription;
//         var referencingItemId = patient.DisplayId ? patient.DisplayId : patientUserId;
//         var documents = await PDFGenerator.SaveToS3(absFilepath, filename, referencingItemId, keyword);
//         if (documents.length == 0) {
//             return;
//         }
//         var doc = documents[0];
//         var prescription = {
//             DocumentType: DocumentTypes.PatientMedPrescription,
//             PatientUserId: patientUserId,
//             DoctorUserId: doctorUserId,
//             DoctorVisitId: visitId,
//             DrugOrderId: drugOrderId,
//             DisplayId: displayId,
//             AddedBy: doctorUserId,
//             FileName: doc.FileName,
//             ResourceId: doc.ResourceId,
//             Url_Auth: doc.Url_Auth,
//             MimeType: doc.MimeType,
//             Size: doc.Size,
//             ResourceId: doc.ResourceId,
//             DateCreated: Date.now()
//         };
//         var records = await PatientDocumentService.AddDocument(prescription);
//         order.PDFResourceId = doc.ResourceId;
//         await order.save();
//     }
//     catch (error) {
//         ErrorHandler.ThrowServiceError(error, 'An error occurred in getting the PDF for the order!');
//     }

//     return uploaded;
// };

// function CreateDrugOrderDataModel(title, doctor, patient, visit, order, medications, suggestedPharmacy) {

//     var model = {
//         DocumentTitle: title,
//         DoctorName: 'Dr. ' + doctor.FirstName + ' ' + doctor.LastName,
//         DoctorPhonenumber: doctor.PhoneNumber,
//         Specialization: doctor.Qualification,
//         ClinicName: doctor.EstablishmentName,
//         ClinicAddress: doctor.Address,
//         Locality: doctor.Locality,
//         PatientName: patient.Prefix + ' ' + patient.FirstName + ' ' + patient.LastName,
//         PatientDisplayId: patient.DisplayId,
//         VisitId: visit.id,
//         OrderDisplayId: order.DisplayId,
//         SuggestedPharmacy: suggestedPharmacy ? suggestedPharmacy.EstablishmentName : null,
//         SuggestedPharmacyAddress: suggestedPharmacy ? suggestedPharmacy.Address : null,
//         OrderDate: moment(order.updated_at).format("DD-MM-YYYY"),
//         Items: []
//     };

//     for (var i = 0; i < medications.length; i++) {
//         var medication = medications[i];
//         model.Items.push({
//             Drug: medication.Drug,
//             Dose: medication.Dose,
//             DosageUnit: medication.DosageUnit,
//             TimeSchedule: medication.TimeSchedule,
//             Frequency: medication.Frequency,
//             FrequencyUnit: medication.FrequencyUnit,
//             Route: medication.Route,
//             Duration: medication.Duration,
//             DurationUnit: medication.DurationUnit,
//             StartDate: medication.StartDate,
//             RefillNeeded: medication.RefillNeeded,
//             RefillCount: medication.RefillCount,
//             Instructions: medication.Instructions,
//         });
//     }
//     return model;
// }

// function AddOrderMiddleArea(document, model, y, pageNumber) {

//     y = PDFGenerator.addOrderMetadata(y, document, model);

//     y = y + 40;

//     var tableTop = y;

//     document
//         .fillColor("#444444")
//         .font('Helvetica')
//         .fontSize(11);

//     var from = (pageNumber - 1) * 10;
//     var to = (from + 10) > model.Items.length ? model.Items.length : (from + 10);
//     var count = 0;

//     const ITEM_HEIGHT = 70;

//     for (let i = from; i < to; i++) {

//         const medication = model.Items[i];
//         const position = tableTop + (count * ITEM_HEIGHT);
//         y = position;

//         GenerateMedicationTableRow(
//             document,
//             position,
//             (i + 1).toString(),
//             medication.Drug,
//             medication.Dose.toString(),
//             medication.DosageUnit,
//             medication.Frequency,
//             medication.FrequencyUnit,
//             medication.TimeSchedule,
//             medication.Route,
//             medication.Duration.toString(),
//             medication.DurationUnit,
//             medication.Instructions
//         );

//         count++;
//     }

//     return y;
// }

// function GenerateMedicationTableRow(
//     document,
//     y,
//     index,
//     drug,
//     dose,
//     dosageUnit,
//     frequency,
//     frequencyUnit,
//     timeSchedule,
//     route,
//     duration,
//     durationUnit,
//     instructions
// ) {
//     document
//         .fontSize(9)
//         .font('Helvetica')
//         .text(index, 50, y)
//         .text(drug, 75, y, { width: 250, align: "left" })
//         .text(dose + ' ' + dosageUnit, 330, y, { align: "right" })
//         .moveDown();

//     var schedule = (frequency ? frequency + ' ' : '') + frequencyUnit + ' - ' + timeSchedule;

//     document
//         .text(schedule, 75, y + 15, { align: "left" })
//         .text(route + ' | ' + duration + ' ' + durationUnit, 75, y + 30, { align: "left" })
//         .moveDown();

//     document
//         .text('Instructions : ' + instructions, 75, y + 45, { align: "left" })
//         .moveDown();
// }
