
import { inject, injectable } from "tsyringe";
import { IMedicationConsumptionRepo } from "../../../../database/repository.interfaces/clinical/medication/medication.consumption.repo.interface";
import { IMedicationRepo } from "../../../../database/repository.interfaces/clinical/medication/medication.repo.interface";
import { IPersonRepo } from "../../../../database/repository.interfaces/person/person.repo.interface";
import { IPatientRepo } from "../../../../database/repository.interfaces/users/patient/patient.repo.interface";
import { IUserRepo } from "../../../../database/repository.interfaces/users/user/user.repo.interface";
import { IFoodConsumptionRepo } from "../../../../database/repository.interfaces/wellness/nutrition/food.consumption.repo.interface";
import { IDocumentRepo } from "../../../../database/repository.interfaces/users/patient/document.repo.interface";
import { IPhysicalActivityRepo } from "../../../../database/repository.interfaces/wellness/exercise/physical.activity.repo.interface";
import { IBodyWeightRepo } from "../../../../database/repository.interfaces/clinical/biometrics/body.weight.repo.interface";
import { ILabRecordRepo } from "../../../../database/repository.interfaces/clinical/lab.record/lab.record.interface";
import { IAssessmentRepo } from "../../../../database/repository.interfaces/clinical/assessment/assessment.repo.interface";
import { uuid } from "../../../../domain.types/miscellaneous/system.types";
import { DocumentRepo } from "../../../../database/sql/sequelize/repositories/users/patient/document.repo";
import { Loader } from "../../../../startup/loader";
import { LabRecordRepo } from "../../../../database/sql/sequelize/repositories/clinical/lab.record/lab.record.repo";
import { AssessmentRepo } from "../../../../database/sql/sequelize/repositories/clinical/assessment/assessment.repo";
import { BodyWeightRepo } from "../../../../database/sql/sequelize/repositories/clinical/biometrics/body.weight.repo";
import { MedicationConsumptionRepo } from "../../../../database/sql/sequelize/repositories/clinical/medication/medication.consumption.repo";
import { MedicationRepo } from "../../../../database/sql/sequelize/repositories/clinical/medication/medication.repo";
import { PersonRepo } from "../../../../database/sql/sequelize/repositories/person/person.repo";
import { PatientRepo } from "../../../../database/sql/sequelize/repositories/users/patient/patient.repo";
import { UserRepo } from "../../../../database/sql/sequelize/repositories/users/user/user.repo";
import { PhysicalActivityRepo } from "../../../../database/sql/sequelize/repositories/wellness/exercise/physical.activity.repo";
import { FoodConsumptionRepo } from "../../../../database/sql/sequelize/repositories/wellness/nutrition/food.consumption.repo";
import { ISleepRepo } from "../../../../database/repository.interfaces/wellness/daily.records/sleep.repo.interface";
import { SleepRepo } from "../../../../database/sql/sequelize/repositories/wellness/daily.records/sleep.repo";
import { PatientDetailsDto } from "../../../../domain.types/users/patient/patient/patient.dto";
import { Helper } from "../../../../common/helper";
import { TimeHelper } from "../../../../common/time.helper";
import { PDFGenerator } from "../../../../modules/reports/pdf.generator";
import * as fs from 'fs';
import { IBloodPressureRepo } from "../../../../database/repository.interfaces/clinical/biometrics/blood.pressure.repo.interface";
import { IBloodGlucoseRepo } from "../../../../database/repository.interfaces/clinical/biometrics/blood.glucose.repo.interface";
import { IDailyAssessmentRepo } from "../../../../database/repository.interfaces/clinical/daily.assessment/daily.assessment.repo.interface";
import { ISymptomRepo } from "../../../../database/repository.interfaces/clinical/symptom/symptom.repo.interface";
import { IHowDoYouFeelRepo } from "../../../../database/repository.interfaces/clinical/symptom/how.do.you.feel.repo.interface";
import { BloodGlucoseRepo } from "../../../../database/sql/sequelize/repositories/clinical/biometrics/blood.glucose.repo";
import { BloodPressureRepo } from "../../../../database/sql/sequelize/repositories/clinical/biometrics/blood.pressure.repo";
import { DailyAssessmentRepo } from "../../../../database/sql/sequelize/repositories/clinical/daily.assessment/daily.assessment.repo";
import { HowDoYouFeelRepo } from "../../../../database/sql/sequelize/repositories/clinical/symptom/how.do.you.feel.repo";
import { SymptomRepo } from "../../../../database/sql/sequelize/repositories/clinical/symptom/symptom.repo";
import { UserTaskRepo } from "../../../../database/sql/sequelize/repositories/users/user/user.task.repo";
import { IUserTaskRepo } from "../../../../database/repository.interfaces/users/user/user.task.repo.interface";
import { CareplanRepo } from "../../../../database/sql/sequelize/repositories/clinical/careplan/careplan.repo";
import { ICareplanRepo } from "../../../../database/repository.interfaces/clinical/careplan.repo.interface";
import ReportImageGenerator from "./report.image.generator";
import StatReportCommons from "./stat.report.commons";
import { Logger } from "../../../../common/logger";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class StatisticsService {

    _imageGenerator = new ReportImageGenerator();

    _commons = new StatReportCommons();

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

    public getReportModel = (
        patient: PatientDetailsDto,
        stats: any) => {

        Logger.instance().log(JSON.stringify(patient, null, 2));

        const timezone = patient.User?.DefaultTimeZone ?? '+05:30';
        const date = new Date();
        const patientName = patient.User.Person.DisplayName;
        const patientAge = Helper.getAgeFromBirthDate(patient.User.Person.BirthDate);
        const assessmentDate = TimeHelper.getDateWithTimezone(date.toISOString(), timezone);
        const reportDateStr = assessmentDate.toLocaleDateString();

        const race = patient.HealthProfile.Race && patient.HealthProfile.Race?.length > 0
            ? patient.HealthProfile.Race : 'Unspecified';
        const ethnicity = patient.HealthProfile.Ethnicity && patient.HealthProfile.Ethnicity?.length > 0
            ? patient.HealthProfile.Ethnicity : 'Unspecified';
        const tobacco = patient.HealthProfile.TobaccoQuestionAns === true ? 'Yes' : 'No';

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
            Race              : race,
            Ethnicity         : ethnicity,
            Tobacco           : tobacco,
            MariatalStatus    : patient.User.Person.MaritalStatus ?? 'Unspecified',
            Stats             : stats
        };
    };

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

        //Body weight, Lab values
        const bodyWeightStats = await this._bodyWeightRepo.getStats(patientUserId, 6);
        const cholesterolStats = await this._labRecordsRepo.getStats(patientUserId, 6);
        const bloodPressureStats = await this._bloodPressureRepo.getStats(patientUserId, 6);
        const bloodGlucoseStats = await this._bloodGlucoseRepo.getStats(patientUserId, 6);
        const biometrics = {
            Last6Months : {
                BloodPressure : bloodPressureStats,
                BloodGlucose  : bloodGlucoseStats,
                Cholesterol   : cholesterolStats,
                BodyWeight    : bodyWeightStats,
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
        const userTasksForLastMonth = await this._userTaskRepo.getStats(patientUserId, 1);
        const userEngagementForLast6Months = await this._userTaskRepo.getUserEngagementStats(patientUserId, 6);
        const userTasksTrend = {
            LastMonth   : userTasksForLastMonth,
            Last6Months : userEngagementForLast6Months,
        };

        //Health journey / Careplan stats
        const activeEnrollments = await this._careplanRepo.getPatientEnrollments(patientUserId, true);
        const careplanEnrollment = activeEnrollments.length > 0 ? activeEnrollments[0] : null;
        const start = careplanEnrollment.StartAt;
        const end = careplanEnrollment.EndAt;
        const current = new Date();
        let totalDays = TimeHelper.dayDiff(start, end);
        if (totalDays === 0) {
            totalDays = 1;
        }
        const covered = TimeHelper.dayDiff(start, current);
        const percentageCompletion = covered / totalDays;

        const careplanStats = {
            Enrollment      : careplanEnrollment,
            CurrentProgress : percentageCompletion,
        };

        const stats = {
            Nutrition        : nutrition,
            PhysicalActivity : physicalActivityTrend,
            Biometrics       : biometrics,
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

    //#endregion

    //#region Report

    private generateReportPDF = async (reportModel: any) => {
        const chartImagePaths = await this._imageGenerator.generateChartImages(reportModel);
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
        var y = this._commons.addTop(document, model, false);
        y = this.addReportMetadata(document, model, y);
        y = this.addReportSummary(document, model, y);
        y = this.addHealthJourney(document, model, y);
        this._commons.addBottom(document, pageNumber, model);
    };

    private addBiometricsPage = (document, model, pageNumber) => {
        var y = this._commons.addTop(document, model);
        y = this._commons.addSectionTitle(document, y, 'Biometrics and Vitals');
        this.addBiometricStats(document, model, y);
        this._commons.addBottom(document, pageNumber, model);
    };

    private addMedicationPage = (document, model, pageNumber) => {
        var y = this._commons.addTop(document, model);
        y = this._commons.addSectionTitle(document, y, 'Medication History');
        this.addMedicationStats(document, model, y);
        this._commons.addBottom(document, pageNumber, model);
    };

    private addNutritionPage = (document, model, pageNumber) => {
        var y = this._commons.addTop(document, model);
        y = this._commons.addSectionTitle(document, y, 'Food and Nutrition');
        this.addNutritionStats(document, model, y);
        this._commons.addBottom(document, pageNumber, model);
    };

    private addExercisePage = (document, model, pageNumber) => {
        var y = this._commons.addTop(document, model);
        y = this._commons.addSectionTitle(document, y, 'Exercise and Physical Activity');
        this.addExerciseStats(document, model, y);
        this._commons.addBottom(document, pageNumber, model);
    };

    private addSleepPage = (document, model, pageNumber) => {
        var y = this._commons.addTop(document, model);
        y = this._commons.addSectionTitle(document, y, 'Sleep Hours History');
        this.addSleepStats(document, model, y);
        this._commons.addBottom(document, pageNumber, model);
    };

    private addPatientEngagementPage = (document, model, pageNumber) => {
        var y = this._commons.addTop(document, model);
        y = this._commons.addSectionTitle(document, y, 'Summary');
        this.addSummaryStats(document, model, y);
        this._commons.addBottom(document, pageNumber, model);
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
        this._commons.addText(document, 'Body Weight Trend Over 6 Months', 80, y, 14, '#505050', 'center');

        return y;
    };

    private addMedicationStats = (document, model, y) => {
        y = y + 45;

        var c = model.ChartImagePaths.find(x => x.key === 'MedicationsHistory_LastMonth');
        document.image(c.location, 125, y, { width: 350, align: 'center' });
        document.fontSize(7);
        document.moveDown();
        y = y + 190;
        this._commons.addText(document, 'Medication History', 75, y, 14, '#505050', 'center');

        y = y + 80;
        c = model.ChartImagePaths.find(x => x.key === 'MedicationsOverall_LastMonth');
        document.image(c.location, 125, y, { width: 350, align: 'center' });
        document.fontSize(7);
        document.moveDown();
        y = y + 190;
        this._commons.addText(document, 'Medication Adherence', 75, y, 14, '#505050', 'center');

        return y;
    };

    private addNutritionStats = (document, model, y) => {
        y = y + 27;

        var c = model.ChartImagePaths.find(x => x.key === 'Nutrition_CaloriesConsumed_LastMonth');
        document.image(c.location, 120, y, { width: 350, align: 'center' });
        document.fontSize(7);
        document.moveDown();
        y = y + 180;
        this._commons.addText(document, 'Calorie Consumption', 100, y, 13, '#505050', 'center');

        y = y + 20;
        c = model.ChartImagePaths.find(x => x.key === 'Nutrition_QuestionnaireResponses_LastMonth');
        document.image(c.location, 125, y, { width: 350, align: 'center' });
        document.fontSize(7);
        document.moveDown();
        y = y + 180;
        this._commons.addText(document, 'Nutrition Questionnaire Response', 100, y, 13, '#505050', 'center');

        y = y + 20;

        c = model.ChartImagePaths.find(x => x.key === 'Nutrition_Servings_LastMonth');
        document.image(c.location, 125, y, { width: 350, align: 'center' });
        document.fontSize(7);
        document.moveDown();
        y = y + 180;
        this._commons.addText(document, 'Servings History', 100, y, 13, '#505050', 'center');

        return y;
    };

    private addExerciseStats = (document, model, y) => {
        y = y + 30;

        var c = model.ChartImagePaths.find(x => x.key === 'Exercise_CaloriesBurned_LastMonth');
        document.image(c.location, 125, y, { width: 350, align: 'center' });
        document.fontSize(7);
        document.moveDown();
        y = y + 180;
        this._commons.addText(document, 'Calories Burned', 70, y, 14, '#505050', 'center');

        y = y + 20;
        c = model.ChartImagePaths.find(x => x.key === 'Exercise_Questionnaire_LastMonth');
        document.image(c.location, 125, y, { width: 350, align: 'center' });
        document.fontSize(7);
        document.moveDown();
        y = y + 180;
        this._commons.addText(document, 'Physical Activity Questionnaire', 70, y, 14, '#505050', 'center');

        y = y + 20;
        c = model.ChartImagePaths.find(x => x.key === 'Exercise_Questionnaire_Overall_LastMonth');
        document.image(c.location, 125, y, { width: 350, align: 'center' });
        document.fontSize(7);
        document.moveDown();
        y = y + 180;
        this._commons.addText(document, 'Daily Movements', 70, y, 14, '#505050', 'center');

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
        this._commons.addText(document, 'Sleep in Hours', 90, y, 14, '#505050', 'center');

        return y;
    };

    private addSummaryStats = (document, model, y) => {
        y = y + 30;

        var c = model.ChartImagePaths.find(x => x.key === 'Nutrition_Servings_LastWeek');
        document.image(c.location, 125, y, { width: 350, align: 'center' });
        document.fontSize(7);
        document.moveDown();
        y = y + 180;
        this._commons.addText(document, 'Servings for Last Week', 80, y, 14, '#505050', 'center');

        y = y + 20;
        c = model.ChartImagePaths.find(x => x.key === 'Nutrition_CaloriesConsumed_LastWeek');
        document.image(c.location, 125, y, { width: 350, align: 'center' });
        document.fontSize(7);
        document.moveDown();
        y = y + 180;
        this._commons.addText(document, 'Calories Consumed Last Week', 100, y, 14, '#505050', 'center');

        y = y + 20;
        c = model.ChartImagePaths.find(x => x.key === 'Nutrition_QuestionnaireResponses_LastWeek');
        document.image(c.location, 125, y, { width: 350, align: 'center' });
        document.fontSize(7);
        document.moveDown();
        y = y + 180;
        this._commons.addText(document, 'Nutrition Responses Last Week', 100, y, 14, '#505050', 'center');

        return y;
    };

    //#endregion

    //#region Commons

    public addReportMetadata = (document: PDFKit.PDFDocument, model: any, y: number): number => {

        y = y + 20;

        document
            .image(model.ProfileImagePath, 50, y, { width: 64 });

        //DrawLine(document, y);
        document
            .roundedRect(135, y, 400, 65, 1)
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
            .text('Patient', 190, y, { align: "left" })
            .font('Helvetica')
            .text(model.Name, 290, y, { align: "left" })
            .moveDown();

        y = y + 23;

        document
            .font('Helvetica-Bold')
            .text('Patient ID', 190, y, { align: "left" })
            .font('Helvetica')
            .text(model.DisplayId, 290, y, { align: "left" })
            .moveDown();

        return y;
    };

    private addReportSummary = (document: PDFKit.PDFDocument, model: any, y: number): number => {

        y = y + 70;

        const labelX = 135;
        const valueX = 325;
        const rowYOffset = 23;

        document
            .fontSize(11)
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
            .text('Race', labelX, y, { align: "left" })
            .font('Helvetica')
            .text(model.Race, valueX, y, { align: "left" })
            .moveDown();
        y = y + rowYOffset;

        document
            .font('Helvetica-Bold')
            .text('Ethnicity', labelX, y, { align: "left" })
            .font('Helvetica')
            .text(model.Ethnicity, valueX, y, { align: "left" })
            .moveDown();
        y = y + rowYOffset;

        document
            .font('Helvetica-Bold')
            .text('Mariatal Status', labelX, y, { align: "left" })
            .font('Helvetica')
            .text(model.MariatalStatus, valueX, y, { align: "left" })
            .moveDown();
        y = y + rowYOffset;

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

        document
            .font('Helvetica-Bold')
            .text('Tobacco', labelX, y, { align: "left" })
            .font('Helvetica')
            .text(model.Tobacco, valueX, y, { align: "left" })
            .moveDown();
        y = y + rowYOffset;

        return y;
    };

    private addHealthJourney = (document: PDFKit.PDFDocument, model: any, y: number): number => {

        const journey = model.Stats.Careplan.Enrollment;
        if (journey  == null) {
            return y;
        }
        const planName = journey.PlanName;
        const enrollmentId = journey.EnrollmentId.toString();
        const startDate = journey.StartAt?.toLocaleDateString();
        const endDate = journey.EndAt?.toLocaleDateString();

        y = this._commons.addSectionTitle(document, y, 'Health Journey');

        const labelX = 135;
        const valueX = 325;
        const rowYOffset = 23;

        y = y + 30;

        document
            .fontSize(11)
            .fillColor("#444444");

        document
            .font('Helvetica-Bold')
            .text('Plan Name', labelX, y, { align: "left" })
            .font('Helvetica')
            .text(planName, valueX, y, { align: "left" })
            .moveDown();
        y = y + rowYOffset;

        document
            .font('Helvetica-Bold')
            .text('Enrollment Id', labelX, y, { align: "left" })
            .font('Helvetica')
            .text(enrollmentId, valueX, y, { align: "left" })
            .moveDown();
        y = y + rowYOffset;

        document
            .font('Helvetica-Bold')
            .text('Start Date', labelX, y, { align: "left" })
            .font('Helvetica')
            .text(startDate, valueX, y, { align: "left" })
            .moveDown();
        y = y + rowYOffset;

        document
            .font('Helvetica-Bold')
            .text('End Date', labelX, y, { align: "left" })
            .font('Helvetica')
            .text(endDate, valueX, y, { align: "left" })
            .moveDown();

        y = y + 35;

        var c = model.ChartImagePaths.find(x => x.key === 'Careplan_Progress');
        document.image(c.location, 115, y, { width: 375, align: 'center' });
        document.fontSize(7);
        document.moveDown();
        y = y + 32;
        this._commons.addText(document, 'Health Journey Progress', 75, y, 9, '#505050', 'center');
        return y;
    };

    //#endregion

}
