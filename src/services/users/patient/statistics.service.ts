
import { inject, injectable } from "tsyringe";
import { IMedicationConsumptionRepo } from "../../../database/repository.interfaces/clinical/medication/medication.consumption.repo.interface";
import { IMedicationRepo } from "../../../database/repository.interfaces/clinical/medication/medication.repo.interface";
import { IPersonRepo } from "../../../database/repository.interfaces/person/person.repo.interface";
import { IPatientRepo } from "../../../database/repository.interfaces/users/patient/patient.repo.interface";
import { IUserRepo } from "../../../database/repository.interfaces/users/user/user.repo.interface";
import { IFoodConsumptionRepo } from "../../../database/repository.interfaces/wellness/nutrition/food.consumption.repo.interface";
import { IDocumentRepo } from "../../../database/repository.interfaces/users/patient/document.repo.interface";
import { IPhysicalActivityRepo } from "../../../database/repository.interfaces/wellness/exercise/physical.activity.repo.interface";
import { IBodyWeightRepo } from "../../../database/repository.interfaces/clinical/biometrics/body.weight.repo.interface";
import { ILabRecordRepo } from "../../../database/repository.interfaces/clinical/lab.record/lab.record.interface";
import { IAssessmentRepo } from "../../../database/repository.interfaces/clinical/assessment/assessment.repo.interface";
import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { DocumentRepo } from "../../../database/sql/sequelize/repositories/users/patient/document.repo";
import { Loader } from "../../../startup/loader";
import { LabRecordRepo } from "../../../database/sql/sequelize/repositories/clinical/lab.record/lab.record.repo";
import { AssessmentRepo } from "../../../database/sql/sequelize/repositories/clinical/assessment/assessment.repo";
import { BodyWeightRepo } from "../../../database/sql/sequelize/repositories/clinical/biometrics/body.weight.repo";
import { MedicationConsumptionRepo } from "../../../database/sql/sequelize/repositories/clinical/medication/medication.consumption.repo";
import { MedicationRepo } from "../../../database/sql/sequelize/repositories/clinical/medication/medication.repo";
import { PersonRepo } from "../../../database/sql/sequelize/repositories/person/person.repo";
import { PatientRepo } from "../../../database/sql/sequelize/repositories/users/patient/patient.repo";
import { UserRepo } from "../../../database/sql/sequelize/repositories/users/user/user.repo";
import { PhysicalActivityRepo } from "../../../database/sql/sequelize/repositories/wellness/exercise/physical.activity.repo";
import { FoodConsumptionRepo } from "../../../database/sql/sequelize/repositories/wellness/nutrition/food.consumption.repo";
import { ISleepRepo } from "../../../database/repository.interfaces/wellness/daily.records/sleep.repo.interface";
import { SleepRepo } from "../../../database/sql/sequelize/repositories/wellness/daily.records/sleep.repo";
import { PatientDetailsDto } from "../../../domain.types/users/patient/patient/patient.dto";
import { Helper } from "../../../common/helper";
import { TimeHelper } from "../../../common/time.helper";
import { PDFGenerator } from "../../../modules/reports/pdf.generator";
import { ChartGenerator } from "../../../modules/charts/chart.generator";
import * as fs from 'fs';
import * as path from 'path';
import { BarChartOptions, ChartColors, DefaultChartOptions, MultiBarChartOptions, LineChartOptions, PieChartOptions } from "../../../modules/charts/chart.options";
import { IBloodPressureRepo } from "../../../database/repository.interfaces/clinical/biometrics/blood.pressure.repo.interface";
import { IBloodGlucoseRepo } from "../../../database/repository.interfaces/clinical/biometrics/blood.glucose.repo.interface";
import { IDailyAssessmentRepo } from "../../../database/repository.interfaces/clinical/daily.assessment/daily.assessment.repo.interface";
import { ISymptomRepo } from "../../../database/repository.interfaces/clinical/symptom/symptom.repo.interface";
import { IHowDoYouFeelRepo } from "../../../database/repository.interfaces/clinical/symptom/how.do.you.feel.repo.interface";
import { BloodGlucoseRepo } from "../../../database/sql/sequelize/repositories/clinical/biometrics/blood.glucose.repo";
import { BloodPressureRepo } from "../../../database/sql/sequelize/repositories/clinical/biometrics/blood.pressure.repo";
import { DailyAssessmentRepo } from "../../../database/sql/sequelize/repositories/clinical/daily.assessment/daily.assessment.repo";
import { HowDoYouFeelRepo } from "../../../database/sql/sequelize/repositories/clinical/symptom/how.do.you.feel.repo";
import { SymptomRepo } from "../../../database/sql/sequelize/repositories/clinical/symptom/symptom.repo";
import { UserTaskRepo } from "../../../database/sql/sequelize/repositories/users/user/user.task.repo";
import { IUserTaskRepo } from "../../../database/repository.interfaces/users/user/user.task.repo.interface";
import { CareplanRepo } from "../../../database/sql/sequelize/repositories/clinical/careplan/careplan.repo";
import { ICareplanRepo } from "../../../database/repository.interfaces/clinical/careplan.repo.interface";

////////////////////////////////////////////////////////////////////////////////////////////////////////

type Alignment = "left" | "right" | "center";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class StatisticsService {

    constructor(
        @inject('IDocumentRepo') private _documentRepo: IDocumentRepo,
        @inject('IPatientRepo') private _patientRepo: IPatientRepo,
        @inject('IUserRepo') private _userRepo: IUserRepo,
        @inject('IPersonRepo') private _personRepo: IPersonRepo,
        @inject('IFoodConsumptionRepo') private _foodConsumptionRepo: IFoodConsumptionRepo,
        @inject('IMedicationConsumptionRepo') private _medicationConsumptionRepo: IMedicationConsumptionRepo,
        @inject('IMedicationRepo') private _medicationRepo: IMedicationRepo,
        @inject('IPhysicalActivityRepo') private _physicalActivityRepo: IPhysicalActivityRepo,
        @inject('IBodyWeightRepo') private _bodyWeightRepo: IBodyWeightRepo,
        @inject('ILabRecordRepo') private _labRecordsRepo: ILabRecordRepo,
        @inject('ISleepRepo') private _sleepRepo: ISleepRepo,
        @inject('IBloodPressureRepo') private _bloodPressureRepo: IBloodPressureRepo,
        @inject('IBloodGlucoseRepo') private _bloodGlucoseRepo: IBloodGlucoseRepo,
        @inject('IAssessmentRepo') private _assessmentRepo: IAssessmentRepo,
        @inject('IDailyAssessmentRepo') private _dailyAssessmentRepo: IDailyAssessmentRepo,
        @inject('ISymptomRepo') private _symptomRepoRepo: ISymptomRepo,
        @inject('IHowDoYouFeelRepo') private _howDoYouFeelRepo: IHowDoYouFeelRepo,
        @inject('IUserTaskRepo') private _userTaskRepo: IUserTaskRepo,
        @inject('ICareplanRepo') private _careplanRepo: ICareplanRepo,
    ) {
        this._documentRepo = Loader.container.resolve(DocumentRepo);
        this._patientRepo = Loader.container.resolve(PatientRepo);
        this._userRepo = Loader.container.resolve(UserRepo);
        this._personRepo = Loader.container.resolve(PersonRepo);
        this._foodConsumptionRepo = Loader.container.resolve(FoodConsumptionRepo);
        this._medicationConsumptionRepo = Loader.container.resolve(MedicationConsumptionRepo);
        this._medicationRepo = Loader.container.resolve(MedicationRepo);
        this._physicalActivityRepo = Loader.container.resolve(PhysicalActivityRepo);
        this._bodyWeightRepo = Loader.container.resolve(BodyWeightRepo);
        this._labRecordsRepo = Loader.container.resolve(LabRecordRepo);
        this._sleepRepo = Loader.container.resolve(SleepRepo);
        this._assessmentRepo = Loader.container.resolve(AssessmentRepo);
        this._bloodPressureRepo = Loader.container.resolve(BloodPressureRepo);
        this._bloodGlucoseRepo = Loader.container.resolve(BloodGlucoseRepo);
        this._dailyAssessmentRepo = Loader.container.resolve(DailyAssessmentRepo);
        this._symptomRepoRepo = Loader.container.resolve(SymptomRepo);
        this._howDoYouFeelRepo = Loader.container.resolve(HowDoYouFeelRepo);
        this._userTaskRepo = Loader.container.resolve(UserTaskRepo);
        this._careplanRepo = Loader.container.resolve(CareplanRepo);
    }

    public getPatientStats = async (patientUserId: uuid) => {

        //Nutrition
        const nutritionLastMonth = await this._foodConsumptionRepo.getStats(patientUserId, 1);
        const nutrition = {
            LastMonth : nutritionLastMonth,
        };

        //Physical activity
        const exerciseLastMonth = await this._physicalActivityRepo.getStats(patientUserId, 1);
        const physicalActivityTrend = {
            LastMonth : exerciseLastMonth,
        };

        //Body weight
        const bodyWeightLast6Months = await this._bodyWeightRepo.getStats(patientUserId, 6);
        const bodyWeightTrend = {
            Last6Months : bodyWeightLast6Months,
        };

        //Lab values
        const cholesterolStats = await this._labRecordsRepo.getStats(patientUserId, 6);
        const bloodPressureStats = await this._bloodPressureRepo.getStats(patientUserId, 6);
        const bloodGlucoseStats = await this._bloodGlucoseRepo.getStats(patientUserId, 6);
        const labRecords = {
            Last6Months : {
                BloodPressure : bloodPressureStats,
                BloodGlucose  : bloodGlucoseStats,
                Cholesterol   : cholesterolStats,
            }
        };

        //Daily assessments
        const dailyAssessments = await this._dailyAssessmentRepo.getStats(patientUserId, 6);
        const dailyAssessmentTrend = {
            Last6Months : dailyAssessments
        };

        //Sleep trend
        const SleepTrendLastMonth = await this._sleepRepo.getStats(patientUserId, 1);
        const sleepTrend = {
            LastMonth : SleepTrendLastMonth,
        };

        //Medication trends
        const medsLastMonth = await this._medicationConsumptionRepo.getStats(patientUserId, 1);
        const currentMedications = await this._medicationRepo.getCurrentMedications(patientUserId);
        const medicationTrend = {
            LastMonth          : medsLastMonth,
            CurrentMedications : currentMedications,
        };

        //User engagement
        const userTasks = await this._userTaskRepo.getStats(patientUserId, 1);
        const userTasksTrend = {
            LastMonth : userTasks,
        };

        //Health journey / Careplan stats
        const activeEnrollments = await this._careplanRepo.getPatientEnrollments(patientUserId, true);
        const careplanEnrollment = activeEnrollments.length > 0 ? activeEnrollments[0] : null;
        const careplanStats = {
            Enrollment : careplanEnrollment,
        };

        const stats = {
            Nutrition        : nutrition,
            PhysicalActivity : physicalActivityTrend,
            BodyWeight       : bodyWeightTrend,
            LabRecords       : labRecords,
            Sleep            : sleepTrend,
            Medication       : medicationTrend,
            DailyAssessent   : dailyAssessmentTrend,
            UserEngagement   : userTasksTrend,
            Careplan         : careplanStats,
        };

        return stats;
    }

    public generateReport = async (reportModel: any) => {
        return await this.generateReportPDF(reportModel);
    }

    public getReportModel = (
        patient: PatientDetailsDto,
        stats: any) => {

        const timezone = patient.User?.DefaultTimeZone ?? '+05:30';
        const date = new Date();
        const patientName = patient.User.Person.DisplayName;
        const patientAge = Helper.getAgeFromBirthDate(patient.User.Person.BirthDate);
        const assessmentDate = TimeHelper.getDateWithTimezone(date.toISOString(), timezone);
        const reportDateStr = assessmentDate.toLocaleDateString();

        return {
            Name              : patientName,
            PatientUserId     : patient.User.id,
            DisplayId         : patient.DisplayId,
            Age               : patientAge,
            Gender            : patient.User.Person.Gender,
            ImageResourceId   : patient.User.Person.ImageResourceId,
            ProfileImagePath  : null,
            ReportDate        : date,
            ReportDateStr     : reportDateStr,
            CurrentBodyWeight : '130 lbs',
            CurrentHeight     : '5 feet, 9 inches',
            BodyMassIndex     : '19.2',
            Stats             : stats
        };
    };

    //#endregion

    //#region Report

    private generateReportPDF = async (reportModel: any) => {
        const chartImagePaths = await this.generateChartImages(reportModel);
        return await this.exportReportToPDF(reportModel, chartImagePaths);
    };

    private exportReportToPDF = async (reportModel: any, chartImagePaths: any) => {
        try {
            var { absFilepath, filename } = await PDFGenerator.getAbsoluteFilePath('Health-history');
            var writeStream = fs.createWriteStream(absFilepath);
            const reportTitle = `Health History`;
            reportModel.ReportTitle = reportTitle;
            reportModel.ChartImagePaths = chartImagePaths;
            reportModel.Author = 'REAN Foundation';
            reportModel.TotalPages = 7;
            reportModel.HeaderImagePath = './assets/images/AHA_header_2.png';
            reportModel.FooterImagePath = './assets/images/AHA_footer_1.png';

            var document = PDFGenerator.createDocument(reportTitle, reportModel.Author, writeStream);

            this.addMainPage(document, reportModel, 1);
            this.addBiometricsPage(document, reportModel, 2);
            this.addMedicationPage(document, reportModel, 3);
            this.addNutritionPage(document, reportModel, 4);
            this.addExercisePage(document, reportModel, 5);
            this.addSleepPage(document, reportModel, 6);
            this.addPatientEngagementPage(document, reportModel, 7);

            document.end();

            const localFilePath = await PDFGenerator.savePDFLocally(writeStream, absFilepath);
            return { filename, localFilePath };
        }
        catch (error) {
            throw new Error(`Unable to generate assessment report! ${error.message}`);
        }
    };

    private addMainPage = (document, model, pageNumber) => {
        var y = this.addTop(document, model, false);
        y = this.addReportMetadata(document, model, y);
        y = this.addReportSummary(document, model, y);
        this.addBottom(document, pageNumber, model);
    };

    private addBiometricsPage = (document, model, pageNumber) => {
        var y = this.addTop(document, model);
        y = this.addPageSectionTitle(document, model, y, 'Biometrics and Vitals');
        y = this.addBiometricStats(document, model, y);
        this.addBottom(document, pageNumber, model);
    };

    private addMedicationPage = (document, model, pageNumber) => {
        var y = this.addTop(document, model);
        y = this.addPageSectionTitle(document, model, y, 'Medication History');
        y = this.addMedicationStats(document, model, y);
        this.addBottom(document, pageNumber, model);
    };

    private addNutritionPage = (document, model, pageNumber) => {
        var y = this.addTop(document, model);
        y = this.addPageSectionTitle(document, model, y, 'Food and Nutrition');
        y = this.addNutritionStats(document, model, y);
        this.addBottom(document, pageNumber, model);
    };

    private addExercisePage = (document, model, pageNumber) => {
        var y = this.addTop(document, model);
        y = this.addPageSectionTitle(document, model, y, 'Exercise and Physical Activity');
        y = this.addExerciseStats(document, model, y);
        this.addBottom(document, pageNumber, model);
    };

    private addSleepPage = (document, model, pageNumber) => {
        var y = this.addTop(document, model);
        y = this.addPageSectionTitle(document, model, y, 'Sleep Hours History');
        y = this.addSleepStats(document, model, y);
        this.addBottom(document, pageNumber, model);
    };

    private addPatientEngagementPage = (document, model, pageNumber) => {
        var y = this.addTop(document, model);
        y = this.addPageSectionTitle(document, model, y, 'Summary');
        y = this.addSummaryStats(document, model, y);
        this.addBottom(document, pageNumber, model);
    };

    private addBiometricStats = (document, model, y) => {
        y = y + 45;

        const bodyWeightTrendsChart = model.ChartImagePaths.find(x => x.key === 'BodyWeight_Last6Months');
        document
            .image(bodyWeightTrendsChart.location, 125, y, { width: 350, align: 'center' });
        document
            .fontSize(7);
        document.moveDown();
        y = y + 195;
        this.addText(document, 'Body Weight Trend Over 6 Months', 80, y, 14, '#505050', 'center');

        return y;
    };

    private addMedicationStats = (document, model, y) => {
        y = y + 45;

        var c = model.ChartImagePaths.find(x => x.key === 'MedicationsHistory_LastMonth');
        document.image(c.location, 125, y, { width: 350, align: 'center' });
        document.fontSize(7);
        document.moveDown();
        y = y + 190;
        this.addText(document, 'Medication History', 75, y, 14, '#505050', 'center');

        y = y + 80;
        c = model.ChartImagePaths.find(x => x.key === 'MedicationsOverall_LastMonth');
        document.image(c.location, 125, y, { width: 350, align: 'center' });
        document.fontSize(7);
        document.moveDown();
        y = y + 190;
        this.addText(document, 'Medication Adherence', 75, y, 14, '#505050', 'center');

        return y;
    };

    private addNutritionStats = (document, model, y) => {
        y = y + 27;

        var c = model.ChartImagePaths.find(x => x.key === 'Nutrition_CaloriesConsumed_LastMonth');
        document.image(c.location, 120, y, { width: 350, align: 'center' });
        document.fontSize(7);
        document.moveDown();
        y = y + 180;
        this.addText(document, 'Calorie Consumption', 100, y, 13, '#505050', 'center');

        y = y + 20;
        c = model.ChartImagePaths.find(x => x.key === 'Nutrition_QuestionnaireResponses_LastMonth');
        document.image(c.location, 125, y, { width: 350, align: 'center' });
        document.fontSize(7);
        document.moveDown();
        y = y + 180;
        this.addText(document, 'Nutrition Questionnaire Response', 100, y, 13, '#505050', 'center');

        y = y + 20;

        c = model.ChartImagePaths.find(x => x.key === 'Nutrition_Servings_LastMonth');
        document.image(c.location, 125, y, { width: 350, align: 'center' });
        document.fontSize(7);
        document.moveDown();
        y = y + 180;
        this.addText(document, 'Servings History', 100, y, 13, '#505050', 'center');

        return y;
    };

    private addExerciseStats = (document, model, y) => {
        y = y + 30;

        var c = model.ChartImagePaths.find(x => x.key === 'Exercise_CaloriesBurned_LastMonth');
        document.image(c.location, 125, y, { width: 350, align: 'center' });
        document.fontSize(7);
        document.moveDown();
        y = y + 180;
        this.addText(document, 'Calories Burned', 70, y, 14, '#505050', 'center');

        y = y + 20;
        c = model.ChartImagePaths.find(x => x.key === 'Exercise_Questionnaire_LastMonth');
        document.image(c.location, 125, y, { width: 350, align: 'center' });
        document.fontSize(7);
        document.moveDown();
        y = y + 180;
        this.addText(document, 'Physical Activity Questionnaire', 70, y, 14, '#505050', 'center');

        y = y + 20;
        c = model.ChartImagePaths.find(x => x.key === 'Exercise_Questionnaire_Overall_LastMonth');
        document.image(c.location, 125, y, { width: 350, align: 'center' });
        document.fontSize(7);
        document.moveDown();
        y = y + 180;
        this.addText(document, 'Daily Movements', 70, y, 14, '#505050', 'center');

        return y;
    };

    private addSleepStats = (document, model, y) => {
        y = y + 45;

        const c = model.ChartImagePaths.find(x => x.key === 'SleepHours_LastMonth');
        document
            .image(c.location, 125, y, { width: 350, align: 'center' });
        document
            .fontSize(7);
        document.moveDown();
        y = y + 185;
        this.addText(document, 'Sleep in Hours', 90, y, 14, '#505050', 'center');

        return y;
    };

    private addSummaryStats = (document, model, y) => {
        y = y + 30;

        var c = model.ChartImagePaths.find(x => x.key === 'Nutrition_Servings_LastWeek');
        document.image(c.location, 125, y, { width: 350, align: 'center' });
        document.fontSize(7);
        document.moveDown();
        y = y + 180;
        this.addText(document, 'Servings for Last Week', 80, y, 14, '#505050', 'center');

        y = y + 20;
        c = model.ChartImagePaths.find(x => x.key === 'Nutrition_CaloriesConsumed_LastWeek');
        document.image(c.location, 125, y, { width: 350, align: 'center' });
        document.fontSize(7);
        document.moveDown();
        y = y + 180;
        this.addText(document, 'Calories Consumed Last Week', 100, y, 14, '#505050', 'center');

        y = y + 20;
        c = model.ChartImagePaths.find(x => x.key === 'Nutrition_QuestionnaireResponses_LastWeek');
        document.image(c.location, 125, y, { width: 350, align: 'center' });
        document.fontSize(7);
        document.moveDown();
        y = y + 180;
        this.addText(document, 'Nutrition Responses Last Week', 100, y, 14, '#505050', 'center');

        return y;
    };

    //#endregion

    //#region Commons

    private addBottom(document: any, pageNumber: any, model: any) {
        PDFGenerator.addOrderPageNumber(document, pageNumber, model.TotalPages);
        this.addFooter(document, "https://www.heart.org/", model.FooterImagePath);
    }

    private addTop(document: any, model: any, addToNewPage = true) {
        var y = 17;
        if (addToNewPage) {
            this.addNewPage(document);
        }
        y = this.addHeader(document, model.ReportTitle, y, model.HeaderImagePath);
        y = this.addReportDate(y, document, model);
        return y;
    }

    private addReportDate(y: number, document: PDFKit.PDFDocument, model: any) {
        y = y + 45;
        document
            .fillColor('#444444')
            .fontSize(10)
            .text('Date: ' + model.ReportDateStr, 200, y, { align: "right" })
            .moveDown();
        return y;
    }

    private  addNewPage = (document) => {
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

    private addHeader = (document: PDFKit.PDFDocument, title: string, y: number, headerImagePath: string) => {

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

    private addReportSummary = (document: PDFKit.PDFDocument, model: any, y: number): number => {

        y = y + 120;

        //DrawLine(document, y);
        // document
        //     .roundedRect(150, y, 300, 38, 1)
        //     .lineWidth(0.1)
        //     .fillOpacity(0.8)
        // //.fillAndStroke("#EBE0FF", "#6541A5");
        //     .fill("#e8ecef");

        // y = y + 13;

        // document
        //     .fillOpacity(1.0)
        //     .lineWidth(1)
        //     .fill("#444444");

        // document
        //     .fillColor("#444444")
        //     .font('Helvetica')
        //     .fontSize(10);

        // const overallScore = model.OverallSummaryScore.toFixed();

        // document
        //     .font('Helvetica-Bold')
        //     .fontSize(16)
        //     .text('Current Body Weight', 55, y, { align: "left" })
        //     .fillColor("#c21422")
        //     .font('Helvetica-Bold')
        //     .text(model.CurrentBodyWeight, 365, y, { align: "left" })
        //     .moveDown();

        // y = y + 65;

        const labelX = 110;
        const valueX = 300;
        const rowYOffset = 25;

        document
            .fontSize(12)
            .fillColor("#444444");

        document
            .font('Helvetica-Bold')
            .text('Age', labelX, y, { align: "left" })
            .font('Helvetica')
            .text(model.Age, valueX, y, { align: "left" })
            .moveDown();
        y = y + rowYOffset;

        document
            .font('Helvetica-Bold')
            .text('Gender', labelX, y, { align: "left" })
            .font('Helvetica')
            .text(model.Gender, valueX, y, { align: "left" })
            .moveDown();
        y = y + rowYOffset;

        document
            .font('Helvetica-Bold')
            .text('Current Weight', labelX, y, { align: "left" })
            .font('Helvetica')
            .text(model.CurrentBodyWeight, valueX, y, { align: "left" })
            .moveDown();
        y = y + rowYOffset;

        document
            .font('Helvetica-Bold')
            .text('Current Height', labelX, y, { align: "left" })
            .font('Helvetica')
            .text(model.CurrentHeight, valueX, y, { align: "left" })
            .moveDown();
        y = y + rowYOffset;

        document
            .font('Helvetica-Bold')
            .text('Body Mass Index (BMI)', labelX, y, { align: "left" })
            .font('Helvetica')
            .text(model.BodyMassIndex, valueX, y, { align: "left" })
            .moveDown();
        y = y + rowYOffset;

        return y;
    };

    private addChartImage = (document: PDFKit.PDFDocument, absoluteChartImagePath: string, y: number): number => {

        y = y + 35;
        document
            .image(absoluteChartImagePath, 125, y, { width: 350, align: 'center' });
        document
            .fontSize(7);
        y = y + 25;
        document.moveDown();

        return y;
    };

    private addPageSectionTitle = (document: PDFKit.PDFDocument, model: any, y: number, pageTitle: string): number => {
        y = y + 20;

        //DrawLine(document, y);
        document
            .roundedRect(50, y, 500, 55, 1)
            .lineWidth(0.1)
            .fillOpacity(0.8)
            .fill("#e8ecef");

        y = y + 22;

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

        y = y + 23;

        return y;
    }

    private addReportMetadata = (document: PDFKit.PDFDocument, model: any, y: number): number => {

        y = y + 20;

        //DrawLine(document, y);
        document
            .roundedRect(50, y, 500, 65, 1)
            .lineWidth(0.1)
            .fillOpacity(0.8)
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

    private addFooter = (document, text, logoImagePath) => {

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

    private addText = (
        document, text: string, textX: number, textY: number,
        fontSize: number, color: string, alignment: Alignment) => {
        document
            .fontSize(fontSize)
            .fillColor(color)
            .text(text, textX, textY, { align: alignment })
            .moveDown();
    }

    private addLabeledText = (
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
    }

    //#endregion

    //#region Chart image generation

    private generateChartImages = async (
        reportModel: any): Promise<any> => {

        const chartImagePaths = [];

        let imageLocations = await this.createNutritionCharts(reportModel.Stats.Nutrition);
        chartImagePaths.push(...imageLocations);
        imageLocations = await this.createPhysicalActivityCharts(reportModel.Stats.PhysicalActivity);
        chartImagePaths.push(...imageLocations);
        imageLocations = await this.createBodyWeightCharts(reportModel.Stats.BodyWeight);
        chartImagePaths.push(...imageLocations);
        imageLocations = await this.createLabRecordsCharts(reportModel.Stats.LabRecords);
        chartImagePaths.push(...imageLocations);
        imageLocations = await this.createSleepTrendCharts(reportModel.Stats.SleepTrend);
        chartImagePaths.push(...imageLocations);
        imageLocations = await this.createMedicationTrendCharts(reportModel.Stats.MedicationTrend);
        chartImagePaths.push(...imageLocations);

        return chartImagePaths;
    };

    private createNutritionCharts = async (data) => {
        var locations = [];

        //Calories
        let location = await this.createNutritionCalorieLineChart(data.LastMonth.CalorieStats, 'Nutrition_CaloriesConsumed_LastMonth');
        locations.push({
            key : 'Nutrition_CaloriesConsumed_LastMonth',
            location
        });
        location = await this.createNutritionCalorieBarChart(data.LastMonth.CalorieStats, 'Nutrition_CaloriesConsumed_LastWeek');
        locations.push({
            key : 'Nutrition_CaloriesConsumed_LastWeek',
            location
        });

        //Questionnaire
        const qstats = [
            ...(data.LastMonth.QuestionnaireStats.HealthyFoodChoices.Stats),
            ...(data.LastMonth.QuestionnaireStats.HealthyProteinConsumptions.Stats),
            ...(data.LastMonth.QuestionnaireStats.LowSaltFoods.Stats),
        ];
        location = await this.createNutritionQueryBarChartForWeek(qstats, 'Nutrition_QuestionnaireResponses_LastWeek');
        locations.push({
            key : 'Nutrition_QuestionnaireResponses_LastWeek',
            location
        });
        location = await this.createNutritionQueryBarChartForMonth(qstats, 'Nutrition_QuestionnaireResponses_LastMonth');
        locations.push({
            key : 'Nutrition_QuestionnaireResponses_LastMonth',
            location
        });

        //Servings
        const servingsStats = [
            ...(data.LastMonth.QuestionnaireStats.VegetableServings.Stats),
            ...(data.LastMonth.QuestionnaireStats.FruitServings.Stats),
            ...(data.LastMonth.QuestionnaireStats.WholeGrainServings.Stats),
            ...(data.LastMonth.QuestionnaireStats.SeafoodServings.Stats),
            ...(data.LastMonth.QuestionnaireStats.SugaryDrinksServings.Stats),
        ];
        location = await this.createNutritionServingsBarChartForMonth(servingsStats, 'Nutrition_Servings_LastMonth');
        locations.push({
            key : 'Nutrition_Servings_LastMonth',
            location
        });
        location = await this.createNutritionServingsBarChartForWeek(servingsStats, 'Nutrition_Servings_LastWeek');
        locations.push({
            key : 'Nutrition_Servings_LastWeek',
            location
        });

        return locations;
    };

    private createPhysicalActivityCharts = async (data) => {
        var locations = [];

        let location = await this.createExerciseCalorieBarChartForMonth(data.LastMonth.CalorieStats, 'Exercise_CaloriesBurned_LastMonth');
        locations.push({
            key : 'Exercise_CaloriesBurned_LastMonth',
            location
        });

        location = await this.createExerciseQuestionBarChartForMonth(data.LastMonth.QuestionnaireStats.Stats, 'Exercise_Questionnaire_LastMonth');
        locations.push({
            key : 'Exercise_Questionnaire_LastMonth',
            location
        });

        location = await this.createExerciseQuestionsDonutChart(data.LastMonth.QuestionnaireStats.Stats, 'Exercise_Questionnaire_Overall_LastMonth');
        locations.push({
            key : 'Exercise_Questionnaire_Overall_LastMonth',
            location
        });

        return locations;
    };

    private createBodyWeightCharts = async (data) => {
        var locations = [];
        const location = await this.createBodyWeightLineChart(data.LastMonth, 'BodyWeight_Last6Months');
        locations.push({
            key : 'BodyWeight_Last6Months',
            location
        });
        return locations;
    };

    private createLabRecordsCharts = async (data) => {
        var locations = [];
        // const location = await this.createBloodPressure_MultiLineChart(data.LastMonth, 'BloodPressure_LastMonth');
        // locations.push({
        //     key : 'SleepHours_LastMonth',
        //     location
        // });
        return locations;
    };

    private createSleepTrendCharts = async (data) => {
        var locations = [];
        const location = await this.createSleepTrendBarChart(data.LastMonth, 'SleepHours_LastMonth');
        locations.push({
            key : 'SleepHours_LastMonth',
            location
        });
        return locations;
    };

    private createMedicationTrendCharts = async (data) => {
        var locations = [];
        let location = await this.createMedicationBarChartForMonth(data.LastMonth.Daily, 'MedicationsHistory_LastMonth');
        locations.push({
            key : 'MedicationsHistory_LastMonth',
            location
        });
        location = await this.createMedicationConsumptionDonutChart(data.LastMonth.Daily, 'MedicationsOverall_LastMonth');
        locations.push({
            key : 'MedicationsOverall_LastMonth',
            location
        });
        return locations;
    };

    private async createNutritionCalorieLineChart(stats: any, filename: string) {
        const lastMonthCalorieStats = stats.map(c => {
            return {
                x : new Date(c.DayStr),
                y : c.Calories
            };
        });
        const options: LineChartOptions = DefaultChartOptions.lineChart();
        options.Width = 550;
        options.Height = 275;
        options.XAxisTimeScaled = true;
        options.YLabel = 'Calories';
        return await ChartGenerator.createLineChart(lastMonthCalorieStats, options, filename);
    }

    private async createNutritionCalorieBarChart(stats: any, filename: string) {
        const calorieStats = stats.map(c => {
            return {
                x : `"${TimeHelper.getWeekDay(new Date(c.DayStr), true)}"`,
                y : c.Calories
            };
        });
        const options: BarChartOptions = {
            Width  : 550,
            Height : 275,
            YLabel : 'Calories',
            Color  : ChartColors.GreenLight
        };

        return await ChartGenerator.createBarChart(calorieStats, options, filename);
    }

    private async createNutritionQueryBarChartForWeek(stats: any, filename: string) {
        const temp = stats.map(c => {
            return {
                x : `"${TimeHelper.getWeekDay(new Date(c.DayStr), true)}"`,
                y : c.Response,
                z : c.Type,
            };
        });
        const options: MultiBarChartOptions = {
            Width           : 550,
            Height          : 275,
            YLabel          : 'User Response',
            CategoriesCount : 3,
            Categories      : [ "Healthy", "Protein", "Low Salt" ],
            Colors          : [ ChartColors.Green, ChartColors.Blue, ChartColors.GrayMedium ],
            FontSize        : '14px',
        };

        return await ChartGenerator.createGroupBarChart(temp, options, filename);
    }

    private async createNutritionQueryBarChartForMonth(stats: any, filename: string) {
        const temp = stats.map(c => {
            return {
                x : `"${TimeHelper.getDayOfMonthFromISODateStr(c.DayStr)}"`,
                y : c.Response,
                z : c.Type,
            };
        });
        const options: MultiBarChartOptions = {
            Width           : 550,
            Height          : 275,
            YLabel          : 'User Response',
            CategoriesCount : 3,
            Categories      : [ "Healthy", "Protein", "Low Salt" ],
            Colors          : [ ChartColors.Green, ChartColors.Blue, ChartColors.GrayMedium ],
            FontSize        : '9px',
        };
        return await ChartGenerator.createStackedBarChart(temp, options, filename);
    }

    private async createNutritionServingsBarChartForWeek(stats: any, filename: string) {
        const temp = stats.map(c => {
            return {
                x : `"${TimeHelper.getWeekDay(new Date(c.DayStr), true)}"`,
                y : c.Servings,
                z : c.Type,
            };
        });
        const options: MultiBarChartOptions = {
            Width           : 550,
            Height          : 275,
            YLabel          : 'Servings',
            CategoriesCount : 5,
            Categories      : [ "Veggies", "Fruits", "Grains", "Seafood", "Sugar" ],
            Colors          : [
                ChartColors.Green,
                ChartColors.Orange,
                ChartColors.BrownLight,
                ChartColors.Blue,
                ChartColors.Red
            ],
            FontSize : '14px',
        };
        return await ChartGenerator.createGroupBarChart(temp, options, filename);
    }

    private async createNutritionServingsBarChartForMonth(stats: any, filename: string) {
        const temp = stats.map(c => {
            return {
                x : `"${TimeHelper.getDayOfMonthFromISODateStr(c.DayStr)}"`,
                y : c.Servings,
                z : c.Type
            };
        });
        const options: MultiBarChartOptions = {
            Width           : 550,
            Height          : 275,
            YLabel          : 'Servings',
            CategoriesCount : 5,
            Categories      : [ "Veggies", "Fruits", "Grains", "Seafood", "Sugar" ],
            Colors          : [
                ChartColors.Green,
                ChartColors.Orange,
                ChartColors.BrownLight,
                ChartColors.Blue,
                ChartColors.Red
            ],
            FontSize : '9px',
        };
        return await ChartGenerator.createStackedBarChart(temp, options, filename);
    }

    private async createExerciseCalorieBarChartForMonth(stats: any, filename: string) {
        const calorieStats = stats.map(c => {
            return {
                x : `"${TimeHelper.getDayOfMonthFromISODateStr(c.DayStr)}"`,
                y : c.Calories
            };
        });
        const options: BarChartOptions = {
            Width  : 550,
            Height : 275,
            YLabel : 'Calories Burned',
            Color  : ChartColors.OrangeYellow
        };
        return await ChartGenerator.createBarChart(calorieStats, options, filename);
    }

    private async createExerciseQuestionBarChartForMonth(stats: any, filename: string) {
        const calorieStats = stats.map(c => {
            return {
                x : `"${TimeHelper.getDayOfMonthFromISODateStr(c.DayStr)}"`,
                y : c.Response
            };
        });
        const options: BarChartOptions = {
            Width  : 550,
            Height : 275,
            YLabel : 'User Response',
            Color  : ChartColors.GreenLight
        };

        return await ChartGenerator.createBarChart(calorieStats, options, filename);
    }

    private async createExerciseQuestionsDonutChart(stats: any, filename: string) {
        const yesCount = stats.filter(c => c.Response === 1).length;
        const noCount = stats.filter(c => c.Response === 0).length;

        const options: PieChartOptions = {
            Width  : 550,
            Height : 275,
            Colors : [
                ChartColors.Green,
                ChartColors.Orange,
                ChartColors.Blue,
            ],
        };

        const data = [
            {
                name  : "Yes",
                value : yesCount,
            },
            {
                name  : "No",
                value : noCount,
            }
        ];

        return await ChartGenerator.createDonutChart(data, options, filename);
    }

    private async createMedicationConsumptionDonutChart(stats: any, filename: string) {

        const missedCount = stats.reduce((acc, x) => acc + x.MissedCount, 0);
        const takenCount = stats.reduce((acc, x) => acc + x.TakenCount, 0);
        const total = stats.length;
        const unmarked = total - (missedCount + takenCount);

        const options: PieChartOptions = {
            Width  : 550,
            Height : 275,
            Colors : [
                ChartColors.Green,
                ChartColors.Orange,
                ChartColors.Blue,
            ],
        };

        const data = [
            {
                name  : "Taken",
                value : missedCount,
            },
            {
                name  : "Missed",
                value : takenCount,
            },
            {
                name  : "Unmarked",
                value : unmarked,
            }
        ];

        return await ChartGenerator.createDonutChart(data, options, filename);
    }

    private async createMedicationBarChartForMonth(stats: any, filename: string) {
        const temp = [];
        stats.forEach(x => {
            temp.push({
                x : `"${TimeHelper.getDayOfMonthFromISODateStr(x.DayStr)}"`,
                y : x.MissedCount,
                z : 'Missed',
            });
            temp.push({
                x : `"${TimeHelper.getDayOfMonthFromISODateStr(x.DayStr)}"`,
                y : x.TakenCount,
                z : 'Taken',
            });
        });

        const options: MultiBarChartOptions = {
            Width           : 550,
            Height          : 275,
            YLabel          : 'Medication History',
            CategoriesCount : 2,
            Categories      : [ "Missed", "Taken" ],
            Colors          : [ ChartColors.Orange, ChartColors.GreenLight ],
            FontSize        : '9px',
        };
        return await ChartGenerator.createStackedBarChart(temp, options, filename);
    }

    private async createSleepTrendBarChart(stats: any, filename: string) {
        const sleepStats = stats.map(c => {
            return {
                x : `"${TimeHelper.getDayOfMonthFromISODateStr(c.RecordDate.toISOString().split('T')[0])}"`,
                y : c.SleepDuration
            };
        });
        const options: BarChartOptions = {
            Width  : 550,
            Height : 275,
            YLabel : 'Sleep in Hours',
            Color  : ChartColors.GrayDarker
        };

        return await ChartGenerator.createBarChart(sleepStats, options, filename);
    }

    private async createBodyWeightLineChart(stats: any, filename: string) {
        const temp = stats.map(c => {
            return {
                x : c.CreatedAt,
                y : c.BodyWeight
            };
        });
        const options: LineChartOptions = DefaultChartOptions.lineChart();
        options.Width = 550;
        options.Height = 275;
        options.XAxisTimeScaled = true;
        options.YLabel = 'Body weight';

        return await ChartGenerator.createLineChart(temp, options, filename);
    }

    //#endregion

}
