
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
import { BodyHeightRepo } from "../../../../database/sql/sequelize/repositories/clinical/biometrics/body.height.repo";
import { IBodyHeightRepo } from "../../../../database/repository.interfaces/clinical/biometrics/body.height.repo.interface";

import ReportImageGenerator from "./report.image.generator";
import StatReportCommons from "./stat.report.commons";
import { Logger } from "../../../../common/logger";
import { ChartColors } from "../../../../modules/charts/chart.options";

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
        @inject('IBodyHeightRepo') private _bodyHeightRepo: IBodyHeightRepo,
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
        this._bodyHeightRepo = Loader.container.resolve(BodyHeightRepo);
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
            CurrentBodyWeight : stats.WeightStr,
            CurrentHeight     : stats.HeightStr,
            BodyMassIndex     : stats.BodyMassIndex,
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
        const currentBodyWeight = await this._bodyWeightRepo.getRecent(patientUserId);
        const sum = bodyWeightStats.reduce((acc, x) => acc + x.BodyWeight, 0);
        const averageBodyWeight = bodyWeightStats.length === 0 ? null : sum / bodyWeightStats.length;

        let currentHeight = null;
        let heightUnits = 'cm';
        const weightUnits = 'Kg';
        const heightDto = await this._bodyHeightRepo.getRecent(patientUserId);
        if (heightDto) {
            currentHeight = heightDto.BodyHeight;
            heightUnits = heightDto.Unit;
        }
        const { bmi, weightStr, heightStr } =
            Helper.calculateBMI(currentHeight, heightUnits, currentBodyWeight.BodyWeight, weightUnits);

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
        const sleepTrend = {
            LastMonth           : sleepStats,
            AverageForLastMonth : averageSleepHours.toFixed(1),
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

            let pageNumber = 1;
            reportModel.TotalPages = 9;
            pageNumber = this.addMainPage(document, reportModel, pageNumber);
            pageNumber = this.addBiometricsPageA(document, reportModel, pageNumber);
            pageNumber = this.addBiometricsPageB(document, reportModel, pageNumber);
            pageNumber = this.addMedicationPage(document, reportModel, pageNumber);
            pageNumber = this.addNutritionPageA(document, reportModel, pageNumber);
            pageNumber = this.addNutritionPageB(document, reportModel, pageNumber);
            pageNumber = this.addExercisePage(document, reportModel, pageNumber);
            pageNumber = this.addUserEngagementPage(document, reportModel, pageNumber);
            pageNumber = this.addDailyAssessmentPage(document, reportModel, pageNumber);

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
        pageNumber += 1;
        return pageNumber;
    };

    private addBiometricsPageA = (document, model, pageNumber) => {
        var y = this._commons.addTop(document, model);
        y = this.addBodyWeightStats(model, document, y);
        y = y + 15;
        y = this.addBloodGlucoseStats(model, document, y);
        this._commons.addBottom(document, pageNumber, model);
        pageNumber += 1;
        return pageNumber;
    };

    private addBiometricsPageB = (document, model, pageNumber) => {
        var y = this._commons.addTop(document, model);
        y = this.addBloodPressureStats(model, document, y);
        y = y + 15;
        y = this.addCholesterolStats(model, document, y);
        this._commons.addBottom(document, pageNumber, model);
        pageNumber += 1;
        return pageNumber;
    };

    private addMedicationPage = (document, model, pageNumber) => {
        var y = this._commons.addTop(document, model);
        y = this.addMedicationStats(document, model, y);
        const currentMedications = model.Stats.Medication.CurrentMedications;
        y = this.addCurrentMedications(document, currentMedications, y);
        this._commons.addBottom(document, pageNumber, model);
        pageNumber += 1;
        return pageNumber;
    };

    private addNutritionPageA = (document, model, pageNumber) => {
        var y = this._commons.addTop(document, model);
        y = this.addNutritionCalorieStats(document, model, y);
        this._commons.addBottom(document, pageNumber, model);
        pageNumber += 1;
        return pageNumber;
    };

    private addNutritionPageB = (document, model, pageNumber) => {
        var y = this._commons.addTop(document, model);
        y = this.addNutritionServingsStats(document, model, y);
        y = this.addSleepStats(document, model, y);
        this._commons.addBottom(document, pageNumber, model);
        pageNumber += 1;
        return pageNumber;
    };

    private addExercisePage = (document, model, pageNumber) => {
        var y = this._commons.addTop(document, model);
        this.addExerciseStats(document, model, y);
        this._commons.addBottom(document, pageNumber, model);
        pageNumber += 1;
        return pageNumber;
    };

    private addUserEngagementPage = (document, model, pageNumber) => {
        var y = this._commons.addTop(document, model);
        y = this.addUserTasksStats(document, model, y);
        this._commons.addBottom(document, pageNumber, model);
        pageNumber += 1;
        return pageNumber;
    };

    private addDailyAssessmentPage = (document, model, pageNumber) => {
        var y = this._commons.addTop(document, model);
        y = this.addDailyAssessmentsStats(document, model, y);
        this._commons.addBottom(document, pageNumber, model);
        pageNumber += 1;
        return pageNumber;
    };

    private addMedicationStats = (document, model, y) => {

        let chartImage = 'MedicationsHistory_LastMonth';
        const detailedTitle = 'Medication History for Last Month';
        const titleColor = '#505050';
        const sectionTitle = 'Medication History';
        const icon = Helper.getIconsPath('medications.png');

        y = this._commons.addSectionTitle(document, y, sectionTitle, icon);

        y = y + 25;
        y = this.addRectangularChartImage(document, model, chartImage, y, detailedTitle, titleColor);
        y = y + 20;

        y = y + 7;
        const legend = this._imageGenerator.getMedicationStatusCategoryColors();
        chartImage = 'MedicationsOverall_LastMonth';
        const title = 'Medication Adherence for Last Month';
        y = this.addSquareChartImageWithLegend(document, model, chartImage, y, title, titleColor, legend);

        return y;
    };

    private addCurrentMedications(document, medications, y) {
        const icon = Helper.getIconsPath('current-medications.png');
        y = this._commons.addSectionTitle(document, y, "Current Medications", icon);

        if (medications.length === 0) {
            y = y + 55;
            y = this._commons.addNoDataDisplay(document, y, "Data not available!");
            y = y + 100;
            return y;
        }

        const tableTop = y + 21;
        const ITEM_HEIGHT = 26;
        let medicationsCount = medications.length;

        if (medicationsCount > 5) {
            medicationsCount = 5;
        }

        for (let i = 0; i < medicationsCount; i++) {

            const medication = medications[i];
            const position = tableTop + (i * ITEM_HEIGHT);
            y = position;

            const schedule = medication.TimeSchedules ? medication.TimeSchedules.join(', ') : '';

            this.generateMedicationTableRow(
                document,
                position,
                (i + 1).toString(),
                medication.DrugName,
                medication.Dose.toString(),
                medication.DosageUnit,
                medication.Frequency,
                medication.FrequencyUnit,
                schedule,
                medication.Route,
                medication.Duration.toString(),
                medication.DurationUnit
            );
        }

        y = y + ITEM_HEIGHT + 10;
        return y;
    }

    private addNutritionCalorieStats = (document, model, y) => {

        let chartImage = 'Nutrition_CaloriesConsumed_LastMonth';
        let detailedTitle = 'Calorie Consumption for Last Month';
        const titleColor = '#505050';
        const sectionTitle = 'Food and Nutrition - Calories';
        let icon = Helper.getIconsPath('nutrition.png');

        y = this._commons.addSectionTitle(document, y, sectionTitle, icon);

        y = y + 25;
        y = this.addRectangularChartImage(document, model, chartImage, y, detailedTitle, titleColor);
        y = y + 27;

        icon = Helper.getIconsPath('questionnaire.png');
        y = this._commons.addSectionTitle(document, y, 'Food and Nutrition - Questionnaire', icon);

        chartImage = 'Nutrition_QuestionnaireResponses_LastMonth';
        detailedTitle = 'Nutrition Questionnaire Response';
        y = y + 25;
        y = this.addRectangularChartImage(document, model, chartImage, y, detailedTitle, titleColor);
        y = y + 20;

        const colors = this._imageGenerator.getNutritionQuestionCategoryColors();
        const legend = colors.map(x => {
            return {
                Key   : x.Key + ': ' + x.Question,
                Color : x.Color,
            };
        });

        y = this._commons.addLegend(document, y, legend, 125, 11, 50, 10, 15);

        return y;
    };

    private addNutritionServingsStats = (document, model, y) => {

        const chartImage = 'Nutrition_Servings_LastMonth';
        const detailedTitle = 'Servings History for Last Month';
        const titleColor = '#505050';
        const sectionTitle = 'Food and Nutrition - Servings';

        const icon = Helper.getIconsPath('food-servings.png');
        y = this._commons.addSectionTitle(document, y, sectionTitle, icon);

        y = y + 25;
        y = this.addRectangularChartImage(document, model, chartImage, y, detailedTitle, titleColor);
        y = y + 27;

        const colors = this._imageGenerator.getNutritionServingsCategoryColors();
        const legend = colors.map(x => {
            return {
                Key   : x.Key + ': ' + x.Question,
                Color : x.Color,
            };
        });
        y = this._commons.addLegend(document, y, legend, 122, 11, 35, 10, 15);

        return y;
    };

    private addExerciseStats = (document, model, y) => {

        let chartImage = 'Exercise_CaloriesBurned_LastMonth';
        let detailedTitle = 'Calories Burned for Last Month';
        const titleColor = '#505050';
        const sectionTitle = 'Exercise and Physical Activity';
        const icon = Helper.getIconsPath('exercise.png');

        y = this._commons.addSectionTitle(document, y, sectionTitle, icon);

        y = y + 25;
        y = this.addRectangularChartImage(document, model, chartImage, y, detailedTitle, titleColor);
        y = y + 23;

        chartImage = 'Exercise_Questionnaire_LastMonth';
        detailedTitle = 'Daily Movements Questionnaire for Last Month';
        y = y + 23;
        y = this.addRectangularChartImage(document, model, chartImage, y, detailedTitle, titleColor);
        y = y + 32;
        chartImage = 'Exercise_Questionnaire_Overall_LastMonth';
        y = this.addSquareChartImage(document, model, chartImage, y, 'Daily Movements', titleColor, 165, 225);

        return y;
    };

    private addUserTasksStats = (document, model, y) => {

        let chartImage = 'UserTasks_LastMonth';
        let detailedTitle = 'User Tasks Status for Last Month';
        const titleColor = '#505050';
        let sectionTitle = 'User Tasks Status History';
        let icon = Helper.getIconsPath('user-tasks.png');

        y = this._commons.addSectionTitle(document, y, sectionTitle, icon);

        y = y + 25;
        y = this.addRectangularChartImage(document, model, chartImage, y, detailedTitle, titleColor);
        y = y + 23;

        sectionTitle = 'User Engagement';
        icon = Helper.getIconsPath('user-activity.png');
        y = this._commons.addSectionTitle(document, y, sectionTitle, icon);

        chartImage = 'UserEngagementRatio_Last6Months';
        detailedTitle = 'User Engagement Ratio for Last 6 Months';
        y = y + 23;
        y = this.addSquareChartImage(document, model, chartImage, y, detailedTitle, titleColor, 165, 225);
        y = y + 23;

        let value = model.Stats.UserEngagement.Last6Months.Finished.toFixed();
        y = this.addLabeledText(document, 'Completed Tasks', value, y);

        value = model.Stats.UserEngagement.Last6Months.Unfinished.toFixed();
        y = this.addLabeledText(document, 'Unfinished Tasks', value, y);

        return y;
    };

    private addDailyAssessmentsStats = (document, model, y) => {

        let chartImage = 'DailyAssessments_Feelings_Last6Months';
        const titleColor = '#505050';
        const sectionTitle = 'Daily Assessments';
        const icon = Helper.getIconsPath('feelings.png');

        y = this._commons.addSectionTitle(document, y, sectionTitle, icon);

        // legendY = 50,
        // imageWidth = 160,
        // startX = 125

        y = y + 25;
        let legend = this._imageGenerator.getFeelingsColors();
        chartImage = 'DailyAssessments_Feelings_Last6Months';
        let title = 'Feelings Over Last 6 Months';
        y = this.addSquareChartImageWithLegend(document, model, chartImage, y, title, titleColor, legend, 40, 140);

        y = y + 7;
        legend = this._imageGenerator.getMoodsColors();
        chartImage = 'DailyAssessments_Moods_Last6Months';
        title = 'Moods Over Last 6 Months';
        y = this.addSquareChartImageWithLegend(document, model, chartImage, y, title, titleColor, legend, 20, 135);

        y = y + 7;
        chartImage = 'DailyAssessments_EnergyLevels_Last6Months';
        title = 'Energy Levels Over Last 6 Months';
        y = this.addSquareChartImage(document, model, chartImage, y, title, titleColor, 165, 225);

        return y;
    };

    private addSleepStats = (document, model, y) => {

        const chartImage = 'SleepHours_LastMonth';
        const detailedTitle = 'Sleep in Hours for Last Month';
        const titleColor = '#505050';
        const sectionTitle = 'Sleep History';
        const icon = Helper.getIconsPath('sleep.png');

        y = this._commons.addSectionTitle(document, y, sectionTitle, icon);

        y = y + 25;
        y = this.addRectangularChartImage(document, model, chartImage, y, detailedTitle, titleColor);
        y = y + 23;

        const value = model.Stats.Sleep.AverageForLastMonth?.toString();
        y = this.addLabeledText(document, 'Average Sleep (Hours)', value, y);

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
            .text('Tobacco', labelX, y, { align: "left" })
            .font('Helvetica')
            .text(model.Tobacco, valueX, y, { align: "left" })
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

        if (model.BodyMassIndex) {
            document
                .font('Helvetica-Bold')
                .text('Body Mass Index (BMI)', labelX, y, { align: "left" })
                .font('Helvetica')
                .text(model.BodyMassIndex.toFixed(), valueX, y, { align: "left" })
                .moveDown();
            y = y + rowYOffset;
        }

        y = this.drawBMIScale(document, y, model.BodyMassIndex);

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
        const icon = Helper.getIconsPath('health-journey.png');
        y = this._commons.addSectionTitle(document, y, 'Health Journey', icon);

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

    private drawBMIScale(document: PDFKit.PDFDocument, y: number, bmi: number) {
        const startX = 325;
        const imageWidth = 210;
        let bmiImage = null;
        if (bmi < 18.5) {
            bmiImage = Helper.getIconsPath('bmi_legend_underweight.png');
        } else if (bmi >= 18.5 && bmi <= 24.9) {
            bmiImage = Helper.getIconsPath('bmi_legend_normal.png');
        } else if (bmi >= 24.9 && bmi <= 29.9) {
            bmiImage = Helper.getIconsPath('bmi_legend_overweight.png');
        } else if (bmi >= 29.9 && bmi <= 34.9) {
            bmiImage = Helper.getIconsPath('bmi_legend_obese.png');
        } else if (bmi > 34.9) {
            bmiImage = Helper.getIconsPath('bmi_legend_extremely_obese.png');
        }
        if (bmiImage) {
            document.image(bmiImage, startX, y, { width: imageWidth });
            y = y + 17;
        }
        return y;
    }

    private addBodyWeightStats(model: any, document: PDFKit.PDFDocument, y: any) {

        const chartImage = 'BodyWeight_Last6Months';
        const detailedTitle = 'Body Weight (Kg) Trend Over 6 Months';
        const titleColor = '#505050';
        const sectionTitle = 'Body Weight';
        const icon = Helper.getIconsPath('body-weight.png');
        y = this._commons.addSectionTitle(document, y, sectionTitle, icon);

        y = y + 25;
        y = this.addRectangularChartImage(document, model, chartImage, y, detailedTitle, titleColor);
        y = y + 20;

        let value = model.Stats.Biometrics.Last6Months.BodyWeight.AverageBodyWeight.toFixed();
        y = this.addLabeledText(document, 'Average Weight (Kg)', value, y);

        value = model.Stats.Biometrics.Last6Months.BodyWeight.CurrentBodyWeight.toString();
        y = this.addLabeledText(document, 'Current Body Weight (Kg)', value, y);

        value = model.Stats.Biometrics.Last6Months.BodyWeight.LastMeasuredDate.toLocaleDateString();
        y = this.addLabeledText(document, 'Last Measured Date', value, y);

        return y;
    }

    private addBloodPressureStats(model: any, document: PDFKit.PDFDocument, y: any) {

        const chartImage = 'BloodPressure_Last6Months';
        const detailedTitle = 'Blood Pressure Trend Over 6 Months';
        const titleColor = '#505050';
        const sectionTitle = 'Blood Pressure';
        const icon = Helper.getIconsPath('blood-pressure.png');

        y = this._commons.addSectionTitle(document, y, sectionTitle, icon);

        y = y + 25;
        y = this.addRectangularChartImage(document, model, chartImage, y, detailedTitle, titleColor);
        y = y + 20;

        let value = model.Stats.Biometrics.Last6Months.BloodPressure.CurrentBloodPressureDiastolic.toString();
        y = this.addLabeledText(document, 'Recent Diastolic BP (mmHg)', value, y);

        value = model.Stats.Biometrics.Last6Months.BloodPressure.CurrentBloodPressureSystolic.toString();
        y = this.addLabeledText(document, 'Recent Systolic BP (mmHg)', value, y);

        value = model.Stats.Biometrics.Last6Months.BloodPressure.LastMeasuredDate.toLocaleDateString();
        y = this.addLabeledText(document, 'Last Measured Date', value, y);

        return y;
    }

    private addBloodGlucoseStats(model: any, document: PDFKit.PDFDocument, y: any) {

        const chartImage = 'BloodGlucose_Last6Months';
        const detailedTitle = 'Blood Glucose Trend Over 6 Months';
        const titleColor = '#505050';
        const sectionTitle = 'Blood Glucose';
        const icon = Helper.getIconsPath('blood-sugar.png');

        y = this._commons.addSectionTitle(document, y, sectionTitle, icon);

        y = y + 25;
        y = this.addRectangularChartImage(document, model, chartImage, y, detailedTitle, titleColor);
        y = y + 20;

        let value = model.Stats.Biometrics.Last6Months.BloodGlucose.CurrentBloodGlucose?.toString();
        y = this.addLabeledText(document, 'Recent Blood Glucose (mg/dL)', value, y);

        value = model.Stats.Biometrics.Last6Months.BloodGlucose.LastMeasuredDate?.toLocaleDateString();
        y = this.addLabeledText(document, 'Last Measured Date', value, y);

        return y;
    }

    private addCholesterolStats(model: any, document: PDFKit.PDFDocument, y: any) {

        const chartImage = 'Cholesterol_Last6Months';
        const detailedTitle = 'Lipids Trend Over 6 Months';
        const titleColor = '#505050';
        const sectionTitle = 'Lipids';
        const icon = Helper.getIconsPath('blood-lipids.png');

        const lipidColors = this._imageGenerator.getLipidColors();

        y = this._commons.addSectionTitle(document, y, sectionTitle, icon);

        y = y + 25;
        y = this.addRectangularChartImage(document, model, chartImage, y, detailedTitle, titleColor);
        y = y + 20;

        y = this._commons.addLegend(document, y, lipidColors, 200, 11, 65, 6, 10);

        return y;
    }

    private addLabeledText(document: PDFKit.PDFDocument, label: string, value: string, y: any) {

        const labelX = 135;
        const valueX = 325;
        const rowYOffset = 23;

        document
            .fontSize(11)
            .fillColor("#444444");

        y = y + rowYOffset;

        document
            .font('Helvetica-Bold')
            .text(label, labelX, y, { align: "left" })
            .font('Helvetica')
            .text(value, valueX, y, { align: "left" })
            .moveDown();

        return y;
    }

    private addRectangularChartImage(
        document: PDFKit.PDFDocument, model: any,
        chartImage: string, y: any, title: string,
        titleColor: string) {
        const imageWidth = 350;
        const chart = model.ChartImagePaths.find(x => x.key === chartImage);
        document.image(chart.location, 125, y, { width: imageWidth, align: 'center' });
        document.fontSize(7);
        document.moveDown();
        y = y + 160;
        this._commons.addText(document, title, 80, y, 12, titleColor, 'center');
        return y;
    }

    private addSquareChartImage(
        document: PDFKit.PDFDocument, model: any,
        chartImage: string, y: any, title: string,
        titleColor: string,
        imageWidth = 175,
        startX = 75) {
        const chart = model.ChartImagePaths.find(x => x.key === chartImage);
        document.image(chart.location, startX, y, { width: imageWidth, align: 'center' });
        document.fontSize(7);
        document.moveDown();
        y = y + 190;
        this._commons.addText(document, title, 80, y, 12, titleColor, 'center');
        return y;
    }

    private addSquareChartImageWithLegend(
        document: PDFKit.PDFDocument, model: any,
        chartImage: string, y: any, title: string,
        titleColor: string,
        legendItems,
        legendY = 50,
        imageWidth = 160,
        startX = 125) {

        const chart = model.ChartImagePaths.find(x => x.key === chartImage);
        document.image(chart.location, startX, y, { width: imageWidth, align: 'center' });
        document.fontSize(7);
        document.moveDown();

        const yFrozen = y;
        y = yFrozen + imageWidth;
        this._commons.addText(document, title, 80, y, 12, titleColor, 'center');

        y = yFrozen + legendY;
        const legendStartX = startX + 200;
        y = this._commons.addLegend(document, y, legendItems, legendStartX, 11, 60, 8, 5);
        y = yFrozen + imageWidth + 20; //Image height
        return y;
    }

    private generateMedicationTableRow(
        document: PDFKit.PDFDocument,
        y,
        index,
        drug,
        dose,
        dosageUnit,
        frequency,
        frequencyUnit,
        timeSchedule,
        route,
        duration,
        durationUnit,
    ) {
        var schedule = (frequency ? frequency + ' ' : '') + frequencyUnit + ' - ' + timeSchedule;
        const d = schedule + ', ' + route + ' | ' + duration + ' ' + durationUnit;
        const medication = drug + ', ' + d;
        document
            .fontSize(11)
            .font('Helvetica')
            .text(index, 50, y)
            .text(medication, 75, y, { align: "left" })
            .text(dose + ' ' + dosageUnit, 330, y, { align: "right" })
            .moveDown();
    }

    //#endregion

}
