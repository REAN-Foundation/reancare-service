
import { inject, injectable } from "tsyringe";
import { IMedicationConsumptionRepo } from "../../../../database/repository.interfaces/clinical/medication/medication.consumption.repo.interface";
import { IMedicationRepo } from "../../../../database/repository.interfaces/clinical/medication/medication.repo.interface";
import { IFoodConsumptionRepo } from "../../../../database/repository.interfaces/wellness/nutrition/food.consumption.repo.interface";
import { IPhysicalActivityRepo } from "../../../../database/repository.interfaces/wellness/exercise/physical.activity.repo.interface";
import { IBodyWeightRepo } from "../../../../database/repository.interfaces/clinical/biometrics/body.weight.repo.interface";
import { ILabRecordRepo } from "../../../../database/repository.interfaces/clinical/lab.record/lab.record.interface";
import { uuid } from "../../../../domain.types/miscellaneous/system.types";
import { Loader } from "../../../../startup/loader";
import { LabRecordRepo } from "../../../../database/sql/sequelize/repositories/clinical/lab.record/lab.record.repo";
import { BodyWeightRepo } from "../../../../database/sql/sequelize/repositories/clinical/biometrics/body.weight.repo";
import { MedicationConsumptionRepo } from "../../../../database/sql/sequelize/repositories/clinical/medication/medication.consumption.repo";
import { MedicationRepo } from "../../../../database/sql/sequelize/repositories/clinical/medication/medication.repo";
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
import { BloodGlucoseRepo } from "../../../../database/sql/sequelize/repositories/clinical/biometrics/blood.glucose.repo";
import { BloodPressureRepo } from "../../../../database/sql/sequelize/repositories/clinical/biometrics/blood.pressure.repo";
import { DailyAssessmentRepo } from "../../../../database/sql/sequelize/repositories/clinical/daily.assessment/daily.assessment.repo";
import { UserTaskRepo } from "../../../../database/sql/sequelize/repositories/users/user/user.task.repo";
import { IUserTaskRepo } from "../../../../database/repository.interfaces/users/user/user.task.repo.interface";
import { CareplanRepo } from "../../../../database/sql/sequelize/repositories/clinical/careplan/careplan.repo";
import { ICareplanRepo } from "../../../../database/repository.interfaces/clinical/careplan.repo.interface";
import { BodyHeightRepo } from "../../../../database/sql/sequelize/repositories/clinical/biometrics/body.height.repo";
import { IBodyHeightRepo } from "../../../../database/repository.interfaces/clinical/biometrics/body.height.repo.interface";
import { addBottom, addTop } from "./stat.report.commons";
import { Logger } from "../../../../common/logger";
import { addBloodGlucoseStats, addBloodPressureStats, addBodyWeightStats, addLipidStats, createBiometricsCharts } from "./biometrics.stats";
import { createCalorieBalanceChart } from "./calorie.balance.stats";
import { createCareplanCharts } from "./careplan.stats";
import { addDailyAssessmentsStats, createDailyAssessentCharts } from "./daily.assessments.stats";
import { addExerciseStats, createPhysicalActivityCharts } from "./exercise.stats";
import { addCurrentMedications, addMedicationStats, createMedicationTrendCharts } from "./medication.stats";
import { addNutritionQuestionnaire, addNutritionServingsStats, createNutritionCharts } from "./nutrition.stats";
import { addSleepStats, createSleepTrendCharts } from "./sleep.stats";
import { addUserTasksStats, createUserTaskCharts } from "./user.tasks.stats";
import { addHealthJourney, addReportMetadata, addReportSummary } from "./main.page";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class StatisticsService {

    constructor(
        @inject('IFoodConsumptionRepo') private _foodConsumptionRepo: IFoodConsumptionRepo,
        @inject('IMedicationConsumptionRepo') private _medicationConsumptionRepo: IMedicationConsumptionRepo,
        @inject('IMedicationRepo') private _medicationRepo: IMedicationRepo,
        @inject('IPhysicalActivityRepo') private _physicalActivityRepo: IPhysicalActivityRepo,
        @inject('IBodyWeightRepo') private _bodyWeightRepo: IBodyWeightRepo,
        @inject('IBodyHeightRepo') private _bodyHeightRepo: IBodyHeightRepo,
        @inject('ILabRecordRepo') private _labRecordsRepo: ILabRecordRepo,
        @inject('ISleepRepo') private _sleepRepo: ISleepRepo,
        @inject('IBloodPressureRepo') private _bloodPressureRepo: IBloodPressureRepo,
        @inject('IBloodGlucoseRepo') private _bloodGlucoseRepo: IBloodGlucoseRepo,
        @inject('IDailyAssessmentRepo') private _dailyAssessmentRepo: IDailyAssessmentRepo,
        @inject('IUserTaskRepo') private _userTaskRepo: IUserTaskRepo,
        @inject('ICareplanRepo') private _careplanRepo: ICareplanRepo,
    ) {
        this._foodConsumptionRepo = Loader.container.resolve(FoodConsumptionRepo);
        this._medicationConsumptionRepo = Loader.container.resolve(MedicationConsumptionRepo);
        this._medicationRepo = Loader.container.resolve(MedicationRepo);
        this._physicalActivityRepo = Loader.container.resolve(PhysicalActivityRepo);
        this._bodyWeightRepo = Loader.container.resolve(BodyWeightRepo);
        this._bodyHeightRepo = Loader.container.resolve(BodyHeightRepo);
        this._labRecordsRepo = Loader.container.resolve(LabRecordRepo);
        this._sleepRepo = Loader.container.resolve(SleepRepo);
        this._bloodPressureRepo = Loader.container.resolve(BloodPressureRepo);
        this._bloodGlucoseRepo = Loader.container.resolve(BloodGlucoseRepo);
        this._dailyAssessmentRepo = Loader.container.resolve(DailyAssessmentRepo);
        this._userTaskRepo = Loader.container.resolve(UserTaskRepo);
        this._careplanRepo = Loader.container.resolve(CareplanRepo);
    }

    //#region Publics

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

        const race = patient.HealthProfile.Race ? patient.HealthProfile.Race : 'Unspecified';
        const ethnicity = patient.HealthProfile.Ethnicity ? patient.HealthProfile.Ethnicity : 'Unspecified';
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
            CurrentBodyWeight : stats.WeightStr,
            CurrentHeight     : stats.HeightStr,
            BodyMassIndex     : stats.BodyMassIndex,
            Race              : race,
            Ethnicity         : ethnicity,
            Tobacco           : tobacco,
            MariatalStatus    : patient.HealthProfile.MaritalStatus ?? 'Unspecified',
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
        const currentBodyWeight = await this._bodyWeightRepo.getRecent(patientUserId);
        const sum = bodyWeightStats.reduce((acc, x) => acc + x.BodyWeight, 0);
        const averageBodyWeight = bodyWeightStats.length === 0 ? null : sum / bodyWeightStats.length;

        let currentHeight = null;
        let heightUnits = 'cm';
        const weightUnits = 'Kg';
        const currentWeight = currentBodyWeight ? currentBodyWeight.BodyWeight : null;
        const heightDto = await this._bodyHeightRepo.getRecent(patientUserId);
        if (heightDto) {
            currentHeight = heightDto.BodyHeight;
            heightUnits = heightDto.Unit;
        }
        const { bmi, weightStr, heightStr } =
            Helper.calculateBMI(currentHeight, heightUnits, currentWeight, weightUnits);

        const bloodPressureStats = await this._bloodPressureRepo.getStats(patientUserId, 6);
        const currentBloodPressure = await this._bloodPressureRepo.getRecent(patientUserId);

        const bloodGlucoseStats = await this._bloodGlucoseRepo.getStats(patientUserId, 6);
        const currentBloodGlucose = await this._bloodGlucoseRepo.getRecent(patientUserId);

        const cholesterolStats = await this._labRecordsRepo.getStats(patientUserId, 6);

        const biometrics = {
            Last6Months : {
                BloodPressure : {
                    History                       : bloodPressureStats,
                    CurrentBloodPressureDiastolic : currentBloodPressure ? currentBloodPressure.Diastolic : null,
                    CurrentBloodPressureSystolic  : currentBloodPressure ? currentBloodPressure.Systolic : null,
                    LastMeasuredDate              : currentBloodPressure ? currentBloodPressure.RecordDate : null,
                },
                BodyWeight : {
                    History           : bodyWeightStats,
                    AverageBodyWeight : averageBodyWeight,
                    CurrentBodyWeight : currentBodyWeight ? currentBodyWeight.BodyWeight : null,
                    LastMeasuredDate  : currentBodyWeight ? currentBodyWeight.RecordDate : null,
                },
                BloodGlucose : {
                    History             : bloodGlucoseStats,
                    CurrentBloodGlucose : currentBloodGlucose ? currentBloodGlucose.BloodGlucose : null,
                    LastMeasuredDate    : currentBloodGlucose ? currentBloodGlucose.RecordDate : null,
                },
                Cholesterol : cholesterolStats,
            }
        };

        //Daily assessments
        const dailyAssessments = await this._dailyAssessmentRepo.getStats(patientUserId, 6);
        const dailyAssessmentTrend = {
            Last6Months : dailyAssessments
        };

        //Sleep trend
        const sleepStats = await this._sleepRepo.getStats(patientUserId, 1);
        const sumSleepHours = sleepStats.reduce((acc, x) => acc + x.SleepDuration, 0);
        const averageSleepHours = sleepStats.length === 0 ? null : sumSleepHours / sleepStats.length;
        const averageSleepHoursStr = averageSleepHours ? averageSleepHours.toFixed(1) : null;
        const sleepTrend = {
            LastMonth           : sleepStats,
            AverageForLastMonth : averageSleepHoursStr,
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

        let careplanStats = {
            Enrollment      : null,
            CurrentProgress : null,
        };
        const activeEnrollments = await this._careplanRepo.getPatientEnrollments(patientUserId, true);
        const careplanEnrollment = activeEnrollments.length > 0 ? activeEnrollments[0] : null;
        if (careplanEnrollment != null) {
            const start = careplanEnrollment.StartAt;
            const end = careplanEnrollment.EndAt;
            const current = new Date();
            let totalDays = TimeHelper.dayDiff(start, end);
            if (totalDays === 0) {
                totalDays = 1;
            }
            const covered = TimeHelper.dayDiff(start, current);
            const percentageCompletion = covered / totalDays;
            careplanStats = {
                Enrollment      : careplanEnrollment,
                CurrentProgress : percentageCompletion,
            };
        }

        const stats = {
            WeightStr        : weightStr,
            HeightStr        : heightStr,
            BodyMassIndex    : bmi,
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

            let pageNumber = 1;
            reportModel.TotalPages = 9;
            pageNumber = this.addMainPage(document, reportModel, pageNumber);
            pageNumber = this.addBiometricsPageA(document, reportModel, pageNumber);
            pageNumber = this.addBiometricsPageB(document, reportModel, pageNumber);
            pageNumber = this.addBiometricsPageC(document, reportModel, pageNumber);
            pageNumber = this.addMedicationPage(document, reportModel, pageNumber);
            pageNumber = this.addExercisePage(document, reportModel, pageNumber);
            pageNumber = this.addNutritionPageA(document, reportModel, pageNumber);
            // pageNumber = this.addNutritionPageB(document, reportModel, pageNumber);
            //pageNumber = this.addSleepPage(document, reportModel, pageNumber);
            pageNumber = this.addUserEngagementPage(document, reportModel, pageNumber);
            this.addDailyAssessmentPage(document, reportModel, pageNumber);

            document.end();

            const localFilePath = await PDFGenerator.savePDFLocally(writeStream, absFilepath);
            return { filename, localFilePath };
        }
        catch (error) {
            throw new Error(`Unable to generate assessment report! ${error.message}`);
        }
    };

    public generateChartImages = async (
        reportModel: any): Promise<any> => {

        const chartImagePaths = [];

        let imageLocations = await createNutritionCharts(reportModel.Stats.Nutrition);
        chartImagePaths.push(...imageLocations);
        imageLocations = await createPhysicalActivityCharts(reportModel.Stats.PhysicalActivity);
        chartImagePaths.push(...imageLocations);
        imageLocations = await createBiometricsCharts(reportModel.Stats.Biometrics);
        chartImagePaths.push(...imageLocations);
        imageLocations = await createSleepTrendCharts(reportModel.Stats.Sleep);
        chartImagePaths.push(...imageLocations);
        imageLocations = await createMedicationTrendCharts(reportModel.Stats.Medication);
        chartImagePaths.push(...imageLocations);
        imageLocations = await createDailyAssessentCharts(reportModel.Stats.DailyAssessent);
        chartImagePaths.push(...imageLocations);
        imageLocations = await createUserTaskCharts(reportModel.Stats.UserEngagement);
        chartImagePaths.push(...imageLocations);
        imageLocations = await createCareplanCharts(reportModel.Stats.Careplan);
        chartImagePaths.push(...imageLocations);
        imageLocations = await createCalorieBalanceChart(reportModel);
        chartImagePaths.push(...imageLocations);

        return chartImagePaths;
    };

    //#endregion

    //#region Pages

    private addMainPage = (document, model, pageNumber) => {
        var y = addTop(document, model, false);
        y = addReportMetadata(document, model, y);
        y = addReportSummary(document, model, y);
        addHealthJourney(document, model, y);
        addBottom(document, pageNumber, model);
        pageNumber += 1;
        return pageNumber;
    };

    private addBiometricsPageA = (document, model, pageNumber) => {
        var y = addTop(document, model);
        y = addBodyWeightStats(model, document, y);
        y = y + 15;
        addBloodGlucoseStats(model, document, y);
        addBottom(document, pageNumber, model);
        pageNumber += 1;
        return pageNumber;
    };

    private addBiometricsPageB = (document, model, pageNumber) => {
        var y = addTop(document, model);
        y = addBloodPressureStats(model, document, y);
        y = y + 15;
        addSleepStats(model, document, y);
        addBottom(document, pageNumber, model);
        pageNumber += 1;
        return pageNumber;
    };

    private addBiometricsPageC = (document, model, pageNumber) => {
        var y = addTop(document, model);
        addLipidStats(model, document, y);
        addBottom(document, pageNumber, model);
        pageNumber += 1;
        return pageNumber;
    };

    private addMedicationPage = (document, model, pageNumber) => {
        var y = addTop(document, model);
        y = addMedicationStats(document, model, y);
        const currentMedications = model.Stats.Medication.CurrentMedications;
        addCurrentMedications(document, currentMedications, y);
        addBottom(document, pageNumber, model);
        pageNumber += 1;
        return pageNumber;
    };

    private addNutritionPageA = (document, model, pageNumber) => {
        var y = addTop(document, model);
        y = addNutritionQuestionnaire(document, model, y);
        addNutritionServingsStats(document, model, y);
        addBottom(document, pageNumber, model);
        pageNumber += 1;
        return pageNumber;
    };

    // private addNutritionPageB = (document, model, pageNumber) => {
    //     var y = addTop(document, model);
    //     y = addNutritionServingsStats(document, model, y);
    //     y = addCalorieBalanceStats(document, model, y);
    //     addBottom(document, pageNumber, model);
    //     pageNumber += 1;
    //     return pageNumber;
    // };

    // private addSleepPage = (document, model, pageNumber) => {
    //     var y = addTop(document, model);
    //     y = addSleepStats(document, model, y);
    //     addBottom(document, pageNumber, model);
    //     pageNumber += 1;
    //     return pageNumber;
    // };

    private addExercisePage = (document, model, pageNumber) => {
        var y = addTop(document, model);
        addExerciseStats(document, model, y);
        addBottom(document, pageNumber, model);
        pageNumber += 1;
        return pageNumber;
    };

    private addUserEngagementPage = (document, model, pageNumber) => {
        var y = addTop(document, model);
        addUserTasksStats(document, model, y);
        addBottom(document, pageNumber, model);
        pageNumber += 1;
        return pageNumber;
    };

    private addDailyAssessmentPage = (document, model, pageNumber) => {
        var y = addTop(document, model);
        addDailyAssessmentsStats(document, model, y);
        addBottom(document, pageNumber, model);
        pageNumber += 1;
        return pageNumber;
    };

    //#endregion

}
