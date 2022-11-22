
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
import { BarChartOptions, ChartColors, defaultLineChartOptions, GroupBarChartOptions, LineChartOptions } from "../../../modules/charts/chart.options";

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
        @inject('IAssessmentRepo') private _assessmentRepo: IAssessmentRepo,

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
    }

    public getPatientStats = async (patientUserId: uuid) => {

        //Nutrition
        const nutritionLastWeek = await this._foodConsumptionRepo.getNutritionStatsForLastWeek(patientUserId);
        const nutritionLastMonth = await this._foodConsumptionRepo.getNutritionStatsForLastMonth(patientUserId);
        const nutrition = {
            LastWeek  : nutritionLastWeek,
            LastMonth : nutritionLastMonth,
        };

        //Physical activity
        const exerciseLastWeek = await this._physicalActivityRepo.getPhysicalActivityStatsForLastWeek(patientUserId);
        const exerciseLastMonth = await this._physicalActivityRepo.getPhysicalActivityStatsForLastMonth(patientUserId);
        const physicalActivityTrends = {
            LastWeek  : exerciseLastWeek,
            LastMonth : exerciseLastMonth,
        };

        //Body weight
        const bodyWeightLast3Months = await this._bodyWeightRepo.getBodyWeightStatsForLast3Months(patientUserId);
        const bodyWeightLast6Months = await this._bodyWeightRepo.getBodyWeightStatsForLast6Months(patientUserId);
        const bodyWeightTrends = {
            LastWeek  : bodyWeightLast3Months,
            LastMonth : bodyWeightLast6Months,
        };

        //Lab values
        const labRecordsLastMonth = await this._labRecordsRepo.getLabRecordsForLastMonth(patientUserId);
        const labRecordsLast3Months = await this._labRecordsRepo.getLabRecordsForLast3Months(patientUserId);
        const labRecordsLast6Months = await this._labRecordsRepo.getLabRecordsForLast6Months(patientUserId);
        const labRecords = {
            LastMonth   : labRecordsLastMonth,
            Last3Months : labRecordsLast3Months,
            Last6Months : labRecordsLast6Months,
        };

        //Sleep trend
        const SleepTrendLastWeek = await this._sleepRepo.getSleepStatsForLastWeek(patientUserId);
        const SleepTrendLastMonth = await this._sleepRepo.getSleepStatsForLastMonth(patientUserId);
        const sleepTrend = {
            LastWeek  : SleepTrendLastWeek,
            LastMonth : SleepTrendLastMonth,
        };

        //Medication trends
        const medsLastWeek = await this._medicationConsumptionRepo.getMedicationStats(patientUserId, 7);
        const medsLastMonth = await this._medicationConsumptionRepo.getMedicationStats(patientUserId, 30);
        const medicationTrend = {
            LastWeek  : medsLastWeek,
            LastMonth : medsLastMonth,
        };

        const stats = {
            Nutrition        : nutrition,
            PhysicalActivity : physicalActivityTrends,
            BodyWeight       : bodyWeightTrends,
            LabRecords       : labRecords,
            SleepTrend       : sleepTrend,
            MedicationTrend  : medicationTrend
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
            Name          : patientName,
            PatientUserId : patient.User.id,
            DisplayId     : patient.DisplayId,
            Age           : patientAge,
            ReportDate    : date,
            ReportDateStr : reportDateStr,
            Stats         : stats
        };
    };

    //#endregion

    //#region Privates

    private generateReportPDF = async (reportModel: any) => {
        const chartImagePaths = await this.generateChartImages(reportModel);
        return await this.exportReportToPDF(reportModel, chartImagePaths);
    };

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
        let location = await this.createCalorieLineChart(data.LastMonth.CalorieStats, 'caloriesForMonthlocation');
        locations.push({
            NutritionCaloriesForLastMonth : location
        });
        location = await this.createCalorieBarChart(data.LastWeek.CalorieStats, 'caloriesForWeeklocation');
        locations.push({
            NutritionCaloriesForLastWeek : location
        });

        //Questionnaire
        let qstats = [
            ...(data.LastWeek.QuestionnaireStats.HealthyFoodChoices.Stats),
            ...(data.LastWeek.QuestionnaireStats.HealthyProteinConsumptions.Stats),
            ...(data.LastWeek.QuestionnaireStats.LowSaltFoods.Stats),
        ];
        location = await this.createNutritionQueryBarChartForWeek(qstats, 'nutriQueryForWeeklocation');
        locations.push({
            NutritionQueryForLastWeek : location
        });
        qstats = [
            ...(data.LastMonth.QuestionnaireStats.HealthyFoodChoices.Stats),
            ...(data.LastMonth.QuestionnaireStats.HealthyProteinConsumptions.Stats),
            ...(data.LastMonth.QuestionnaireStats.LowSaltFoods.Stats),
        ];
        location = await this.createNutritionQueryBarChartForMonth(qstats, 'nutriQueryForMonthlocation');
        locations.push({
            NutritionQueryForLastMonth : location
        });

        //Servings
        let servingsStats = [
            ...(data.LastMonth.QuestionnaireStats.VegetableServings.Stats),
            ...(data.LastMonth.QuestionnaireStats.FruitServings.Stats),
            ...(data.LastMonth.QuestionnaireStats.WholeGrainServings.Stats),
            ...(data.LastMonth.QuestionnaireStats.SeafoodServings.Stats),
            ...(data.LastMonth.QuestionnaireStats.SugaryDrinksServings.Stats),
        ];
        location = await this.createNutritionServingsBarChartForMonth(servingsStats, 'nutriServingsForMonthlocation');
        locations.push({
            NutritionServingsForLastMonth : location
        });
        servingsStats = [
            ...(data.LastWeek.QuestionnaireStats.VegetableServings.Stats),
            ...(data.LastWeek.QuestionnaireStats.FruitServings.Stats),
            ...(data.LastWeek.QuestionnaireStats.WholeGrainServings.Stats),
            ...(data.LastWeek.QuestionnaireStats.SeafoodServings.Stats),
            ...(data.LastWeek.QuestionnaireStats.SugaryDrinksServings.Stats),
        ];
        location = await this.createNutritionServingsBarChartForWeek(servingsStats, 'nutriServingsForWeeklocation');
        locations.push({
            NutritionServingsForLastWeek : location
        });
        return locations;
    };

    private createPhysicalActivityCharts = async (data) => {
        var locations = [];
        return locations;
    };

    private createBodyWeightCharts = async (data) => {
        var locations = [];
        return locations;
    };

    private createLabRecordsCharts = async (data) => {
        var locations = [];
        return locations;
    };

    private createSleepTrendCharts = async (data) => {
        var locations = [];
        return locations;
    };

    private createMedicationTrendCharts = async (data) => {
        var locations = [];
        return locations;
    };

    private exportReportToPDF = async (reportModel: any, absoluteChartImagePath: any) => {
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
            y = this.addHeader(document, reportTitle, y, ahaHeaderImagePath);
            y = this.addReportMetadata(document, reportModel, y);
            y = this.addChartImage(document, absoluteChartImagePath, y);
            y = this.addScoreDetails(document, reportModel, y);
            PDFGenerator.addOrderPageNumber(document, 1, 1);
            this.addOrderFooter(document, "https://www.heart.org/", ahaFooterImagePath);
            document.end();
            const localFilePath = await PDFGenerator.savePDFLocally(writeStream, absFilepath);
            return { filename, localFilePath };
        }
        catch (error) {
            throw new Error(`Unable to generate assessment report! ${error.message}`);
        }
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

    private addScoreDetails = (document: PDFKit.PDFDocument, model: any, y: number): number => {

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

    private addReportMetadata = (document: PDFKit.PDFDocument, model: any, y: number): number => {

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

    private addOrderFooter = (document, text, logoImagePath) => {

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

    private async createCalorieLineChart(stats: any, filename: string) {
        const lastMonthCalorieStats = stats.map(c => {
            return {
                x : new Date(c.DateStr),
                y : c.Calories
            };
        });
        const options: LineChartOptions = defaultLineChartOptions();
        options.Width = 550;
        options.Height = 275;
        options.XAxisTimeScaled = true;
        options.YLabel = 'Calories';

        return await ChartGenerator.createLineChart(lastMonthCalorieStats, options, filename);
    }

    private async createCalorieBarChart(stats: any, filename: string) {
        const calorieStats = stats.map(c => {
            return {
                x : `"${TimeHelper.getWeekDay(new Date(c.DateStr), true)}"`,
                y : c.Calories
            };
        });
        const options: BarChartOptions = defaultLineChartOptions();
        options.Width = 550;
        options.Height = 275;
        options.YLabel = 'Calories';

        return await ChartGenerator.createBarChart(calorieStats, options, filename);
    }

    private async createNutritionQueryBarChartForWeek(stats: any, filename: string) {
        const temp = stats.map(c => {
            return {
                x : `"${TimeHelper.getWeekDay(new Date(c.DateStr), true)}"`,
                y : c.Response,
                z : c.Type,
            };
        });
        const options: GroupBarChartOptions = defaultLineChartOptions();
        options.Width = 550;
        options.Height = 275;
        options.YLabel = 'User Response';
        options.CategoriesCount = 3;
        options.Categories = [ "Healthy", "Protein", "Low Salt" ];
        options.Colors = [ ChartColors.Green, ChartColors.Blue, ChartColors.GrayMedium ];

        return await ChartGenerator.createGroupBarChart(temp, options, filename);
    }

    private async createNutritionQueryBarChartForMonth(stats: any, filename: string) {
        const temp = stats.map(c => {
            return {
                x : `"${TimeHelper.getDayOfMonthFromISODateStr(c.DateStr)}"`,
                y : c.Response,
                z : c.Type,
            };
        });
        const options: GroupBarChartOptions = defaultLineChartOptions();
        options.Width = 550;
        options.Height = 275;
        options.YLabel = 'User Response';
        options.CategoriesCount = 3;
        options.Categories = [ "Healthy", "Protein", "Low Salt" ];
        options.Colors = [ ChartColors.Green, ChartColors.Blue, ChartColors.GrayMedium ];

        return await ChartGenerator.createGroupBarChart(temp, options, filename);
    }

    private async createNutritionServingsBarChartForWeek(stats: any, filename: string) {
        const temp = stats.map(c => {
            return {
                x : `"${TimeHelper.getWeekDay(new Date(c.DateStr), true)}"`,
                y : c.Servings,
                z : c.Type,
            };
        });
        const options: GroupBarChartOptions = defaultLineChartOptions();
        options.Width = 550;
        options.Height = 275;
        options.YLabel = 'Servings';
        options.CategoriesCount = 5;
        options.Categories = [ "Veggies", "Fruits", "Grains", "Seafood", "Sugar" ];
        options.Colors = [
            ChartColors.Green,
            ChartColors.Orange,
            ChartColors.BrownLight,
            ChartColors.Blue,
            ChartColors.Red
        ];

        return await ChartGenerator.createGroupBarChart(temp, options, filename);
    }

    private async createNutritionServingsBarChartForMonth(stats: any, filename: string) {
        const temp = stats.map(c => {
            return {
                x : `"${TimeHelper.getDayOfMonthFromISODateStr(c.DateStr)}"`,
                y : c.Servings,
                z : c.Type
            };
        });
        const options: GroupBarChartOptions = defaultLineChartOptions();
        options.Width = 550;
        options.Height = 275;
        options.YLabel = 'Servings';
        options.CategoriesCount = 5;
        options.Categories = [ "Veggies", "Fruits", "Grains", "Seafood", "Sugar" ];
        options.Colors = [
            ChartColors.Green,
            ChartColors.OrangeLight,
            ChartColors.BrownLight,
            ChartColors.Blue,
            ChartColors.Red
        ];

        return await ChartGenerator.createGroupBarChart(temp, options, filename);
    }

    //#endregion

}
