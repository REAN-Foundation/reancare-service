import { Helper } from "../../../../common/helper";
import { TimeHelper } from "../../../../common/time.helper";
import { ChartGenerator } from "../../../../modules/charts/chart.generator";
import { LineChartOptions, DefaultChartOptions, BarChartOptions, ChartColors, MultiBarChartOptions, PieChartOptions, LinearProgressChartOptions, MultiLineChartOptions, CircledNumberChartOptions, CircularProgressChartOptions } from "../../../../modules/charts/chart.options";

//////////////////////////////////////////////////////////////////////////////////

const RECTANGULAR_CHART_WIDTH = 600;
const RECTANGULAR_CHART_HEIGHT = 250;
const SQUARE_CHART_WIDTH = 400;
const SQUARE_CHART_HEIGHT = 400;

//////////////////////////////////////////////////////////////////////////////////

export default class ReportImageGenerator {

    //#region Chart image generation

        public generateChartImages = async (
            reportModel: any): Promise<any> => {

            const chartImagePaths = [];

            let imageLocations = await this.createNutritionCharts(reportModel.Stats.Nutrition);
            chartImagePaths.push(...imageLocations);
            imageLocations = await this.createPhysicalActivityCharts(reportModel.Stats.PhysicalActivity);
            chartImagePaths.push(...imageLocations);
            imageLocations = await this.createBiometricsCharts(reportModel.Stats.Biometrics);
            chartImagePaths.push(...imageLocations);
            imageLocations = await this.createSleepTrendCharts(reportModel.Stats.Sleep);
            chartImagePaths.push(...imageLocations);
            imageLocations = await this.createMedicationTrendCharts(reportModel.Stats.Medication);
            chartImagePaths.push(...imageLocations);
            imageLocations = await this.createDailyAssessentCharts(reportModel.Stats.DailyAssessent);
            chartImagePaths.push(...imageLocations);
            imageLocations = await this.createUserTaskCharts(reportModel.Stats.UserEngagement);
            chartImagePaths.push(...imageLocations);
            imageLocations = await this.createCareplanCharts(reportModel.Stats.Careplan);
            chartImagePaths.push(...imageLocations);

            return chartImagePaths;
        };

        // Nutrition
        // PhysicalActivity
        // BodyWeight
        // LabRecords
        // Sleep
        // Medication
        // DailyAssessent
        // UserEngagement
        // Careplan

        private createDailyAssessentCharts = async (data) => {
            var locations = [];

            let location = await this.createFeelings_DonutChart(data.Last6Months, 'DailyAssessments_Feelings_Last6Months');
            locations.push({
                key : 'DailyAssessments_Feelings_Last6Months',
                location
            });
            location = await this.createMoods_DonutChart(data.Last6Months, 'DailyAssessments_Moods_Last6Months');
            locations.push({
                key : 'DailyAssessments_Moods_Last6Months',
                location
            });
            location = await this.createEnergyLevels_BubbleChart(data.Last6Months, 'DailyAssessments_EnergyLevels_Last6Months');
            locations.push({
                key : 'DailyAssessments_EnergyLevels_Last6Months',
                location
            });

            return locations;
        };

        private createUserTaskCharts = async (data) => {
            var locations = [];

            let location = await this.createUserTasks_StackedBarChart(data.LastMonth.TaskStats, 'UserTasks_LastMonth');
            locations.push({
                key : 'UserTasks_LastMonth',
                location
            });
            location = await this.createUserEngagement_DonutChart(data.Last6Months, 'UserEngagement_Last6Months');
            locations.push({
                key : 'UserEngagement_Last6Months',
                location
            });
            location = await this.createUserEngagement_CircularProgress(data.Last6Months, 'UserEngagementRatio_Last6Months');
            locations.push({
                key : 'UserEngagementRatio_Last6Months',
                location
            });
            return locations;
        }

        private createCareplanCharts = async (data) => {
            var locations = [];

            const location = await this.createCareplan_LinearProgressChart(data.CurrentProgress * 100, 'Careplan_Progress');
            locations.push({
                key : 'Careplan_Progress',
                location
            });

            return locations;
        }

        private createNutritionCharts = async (data) => {
            var locations = [];

            //Calories
            let location = await this.createNutritionCalorie_LineChart(data.LastMonth.CalorieStats, 'Nutrition_CaloriesConsumed_LastMonth');
            locations.push({
                key : 'Nutrition_CaloriesConsumed_LastMonth',
                location
            });
            location = await this.createNutritionCalorie_BarChart(data.LastMonth.CalorieStats, 'Nutrition_CaloriesConsumed_LastWeek');
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
            location = await this.createNutritionQueryForWeek_BarChart(qstats, 'Nutrition_QuestionnaireResponses_LastWeek');
            locations.push({
                key : 'Nutrition_QuestionnaireResponses_LastWeek',
                location
            });
            location = await this.createNutritionQueryForMonth_StackedBarChart(qstats, 'Nutrition_QuestionnaireResponses_LastMonth');
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
            location = await this.createNutritionServingsForMonth_BarChart(servingsStats, 'Nutrition_Servings_LastMonth');
            locations.push({
                key : 'Nutrition_Servings_LastMonth',
                location
            });
            location = await this.createNutritionServingsForWeek_BarChart(servingsStats, 'Nutrition_Servings_LastWeek');
            locations.push({
                key : 'Nutrition_Servings_LastWeek',
                location
            });

            return locations;
        };

        private createPhysicalActivityCharts = async (data) => {
            var locations = [];

            let location = await this.createExerciseCalorieForMonth_BarChart(data.LastMonth.CalorieStats, 'Exercise_CaloriesBurned_LastMonth');
            locations.push({
                key : 'Exercise_CaloriesBurned_LastMonth',
                location
            });

            location = await this.createExerciseQuestionForMonth_BarChart(data.LastMonth.QuestionnaireStats.Stats, 'Exercise_Questionnaire_LastMonth');
            locations.push({
                key : 'Exercise_Questionnaire_LastMonth',
                location
            });

            location = await this.createExerciseQuestions_DonutChart(data.LastMonth.QuestionnaireStats.Stats, 'Exercise_Questionnaire_Overall_LastMonth');
            locations.push({
                key : 'Exercise_Questionnaire_Overall_LastMonth',
                location
            });

            return locations;
        };

        private createBodyWeightCharts = async (data) => {
            var locations = [];
            const location = await this.createBodyWeight_LineChart(data, 'BodyWeight_Last6Months');
            locations.push({
                key : 'BodyWeight_Last6Months',
                location
            });
            return locations;
        };

        private createBiometricsCharts = async (data) => {
            var locations = [];

            const bodyWeightLocations = await this.createBodyWeightCharts(data.Last6Months.BodyWeight.History);
            locations.push(...bodyWeightLocations);
            const bloddPressureLocations = await this.createBloodPressureCharts(data.Last6Months.BloodPressure.History);
            locations.push(...bloddPressureLocations);
            const bloodGlucoseLocations = await this.createBloodGlucoseCharts(data.Last6Months.BloodGlucose.History);
            locations.push(...bloodGlucoseLocations);
            const cholesterolLocations = await this.createCholesterolCharts(data.Last6Months.Cholesterol);
            locations.push(...cholesterolLocations);

            return locations;
        }

        private createBloodPressureCharts = async (data) => {
            var locations = [];
            const location = await this.createBloodPressure_MultiLineChart(data, 'BloodPressure_Last6Months');
            locations.push({
                key : 'BloodPressure_Last6Months',
                location
            });
            return locations;
        };

        private createBloodGlucoseCharts = async (data) => {
            var locations = [];
            const location = await this.createBloodGlucose_LineChart(data, 'BloodGlucose_Last6Months');
            locations.push({
                key : 'BloodGlucose_Last6Months',
                location
            });
            return locations;
        };

        private createCholesterolCharts = async (data) => {
            var locations = [];
            const location = await this.createCholesterolCharts_MultiLineChart(data, 'Cholesterol_Last6Months');
            locations.push({
                key : 'Cholesterol_Last6Months',
                location
            });
            return locations;
        };

        private createSleepTrendCharts = async (data) => {
            var locations = [];
            const location = await this.createSleepTrend_BarChart(data.LastMonth, 'SleepHours_LastMonth');
            locations.push({
                key : 'SleepHours_LastMonth',
                location
            });
            return locations;
        };

        private createMedicationTrendCharts = async (data) => {
            var locations = [];
            let location = await this.createMedication_BarChart(data.LastMonth.Daily, 'MedicationsHistory_LastMonth');
            locations.push({
                key : 'MedicationsHistory_LastMonth',
                location
            });
            location = await this.createMedicationConsumption_DonutChart(data.LastMonth.Daily, 'MedicationsOverall_LastMonth');
            locations.push({
                key : 'MedicationsOverall_LastMonth',
                location
            });
            return locations;
        };

        private async createNutritionCalorie_LineChart(stats: any, filename: string) {
            const lastMonthCalorieStats = stats.map(c => {
                return {
                    x : new Date(c.DayStr),
                    y : c.Calories
                };
            });
            const options: LineChartOptions = DefaultChartOptions.lineChart();
            options.Width  = RECTANGULAR_CHART_WIDTH;
            options.Height = RECTANGULAR_CHART_HEIGHT;
            options.XAxisTimeScaled = true;
            options.YLabel = 'Calories';
            return await ChartGenerator.createLineChart(lastMonthCalorieStats, options, filename);
        }

        private async createCareplan_LinearProgressChart(stats: any, filename:string) {
            const options: LinearProgressChartOptions = DefaultChartOptions.linearProgress();
            options.Width = 650;
            options.Height = 40;
            options.GradientColor1 = ChartColors.MediumSeaGreen;
            options.GradientColor2 = ChartColors.DodgerBlue;
            options.PathColor = ChartColors.GrayDarker;
            options.TextColor = ChartColors.WhiteSmoke;
            return await ChartGenerator.createLinearProgressChart(stats, options, filename);
        }

        private async createNutritionCalorie_BarChart(stats: any, filename: string) {
            const calorieStats = stats.map(c => {
                return {
                    x : `"${TimeHelper.getWeekDay(new Date(c.DayStr), true)}"`,
                    y : c.Calories
                };
            });
            const options: BarChartOptions = {
                Width  : RECTANGULAR_CHART_WIDTH,
                Height : RECTANGULAR_CHART_HEIGHT,
                YLabel : 'Calories',
                Color  : ChartColors.GreenLight
            };

            return await ChartGenerator.createBarChart(calorieStats, options, filename);
        }

        private async createNutritionQueryForWeek_BarChart(stats: any, filename: string) {
            const temp = stats.map(c => {
                return {
                    x : `"${TimeHelper.getWeekDay(new Date(c.DayStr), true)}"`,
                    y : c.Response,
                    z : c.Type,
                };
            });
            const options: MultiBarChartOptions = {
                Width           : RECTANGULAR_CHART_WIDTH,
                Height          : RECTANGULAR_CHART_HEIGHT,
                YLabel          : 'User Response',
                CategoriesCount : 3,
                Categories      : [ "Healthy", "Protein", "Low Salt" ],
                Colors          : [ ChartColors.Green, ChartColors.Blue, ChartColors.GrayMedium ],
                FontSize        : '14px',
            };

            return await ChartGenerator.createGroupBarChart(temp, options, filename);
        }

        private async createNutritionQueryForMonth_StackedBarChart(stats: any, filename: string) {
            const temp = stats.map(c => {
                return {
                    x : `"${TimeHelper.getDayOfMonthFromISODateStr(c.DayStr)}"`,
                    y : c.Response,
                    z : c.Type,
                };
            });
            const options: MultiBarChartOptions = {
                Width           : RECTANGULAR_CHART_WIDTH,
                Height          : RECTANGULAR_CHART_HEIGHT,
                YLabel          : 'User Response',
                CategoriesCount : 3,
                Categories      : [ "Healthy", "Protein", "Low Salt" ],
                Colors          : [ ChartColors.MediumSeaGreen, ChartColors.DodgerBlue, ChartColors.Charcoal ],
                FontSize        : '9px',
            };
            return await ChartGenerator.createStackedBarChart(temp, options, filename);
        }

        private async createNutritionServingsForWeek_BarChart(stats: any, filename: string) {
            const temp = stats.map(c => {
                return {
                    x : `"${TimeHelper.getWeekDay(new Date(c.DayStr), true)}"`,
                    y : c.Servings,
                    z : c.Type,
                };
            });
            const options: MultiBarChartOptions = {
                Width           : RECTANGULAR_CHART_WIDTH,
                Height          : RECTANGULAR_CHART_HEIGHT,
                YLabel          : 'Servings',
                CategoriesCount : 5,
                Categories      : [ "Veggies", "Fruits", "Grains", "Seafood", "Sugar" ],
                Colors          : [
                    ChartColors.MediumSeaGreen,
                    ChartColors.Gold,
                    ChartColors.Tan,
                    ChartColors.DodgerBlue,
                    ChartColors.Tomato
                ],
                FontSize : '14px',
            };
            return await ChartGenerator.createGroupBarChart(temp, options, filename);
        }

        private async createNutritionServingsForMonth_BarChart(stats: any, filename: string) {
            const temp = stats.map(c => {
                return {
                    x : `"${TimeHelper.getDayOfMonthFromISODateStr(c.DayStr)}"`,
                    y : c.Servings,
                    z : c.Type
                };
            });
            const options: MultiBarChartOptions = {
                Width           : RECTANGULAR_CHART_WIDTH,
                Height          : RECTANGULAR_CHART_HEIGHT,
                YLabel          : 'Servings',
                CategoriesCount : 5,
                Categories      : [ "Veggies", "Fruits", "Grains", "Seafood", "Sugar" ],
                Colors          : [
                    ChartColors.MediumSeaGreen,
                    ChartColors.Gold,
                    ChartColors.Tan,
                    ChartColors.DodgerBlue,
                    ChartColors.Tomato
                ],
                FontSize : '9px',
            };
            return await ChartGenerator.createStackedBarChart(temp, options, filename);
        }

        private async createExerciseCalorieForMonth_BarChart(stats: any, filename: string) {
            const calorieStats = stats.map(c => {
                return {
                    x : `"${TimeHelper.getDayOfMonthFromISODateStr(c.DayStr)}"`,
                    y : c.Calories
                };
            });
            const options: BarChartOptions = {
                Width  : RECTANGULAR_CHART_WIDTH,
                Height : RECTANGULAR_CHART_HEIGHT,
                YLabel : 'Calories Burned',
                Color  : ChartColors.OrangeRed
            };
            return await ChartGenerator.createBarChart(calorieStats, options, filename);
        }

        private async createExerciseQuestionForMonth_BarChart(stats: any, filename: string) {
            const calorieStats = stats.map(c => {
                return {
                    x : `"${TimeHelper.getDayOfMonthFromISODateStr(c.DayStr)}"`,
                    y : c.Response
                };
            });
            const options: BarChartOptions = {
                Width  : RECTANGULAR_CHART_WIDTH,
                Height : RECTANGULAR_CHART_HEIGHT,
                YLabel : 'User Response',
                Color  : ChartColors.SpringGreen
            };

            return await ChartGenerator.createBarChart(calorieStats, options, filename);
        }

        private async createExerciseQuestions_DonutChart(stats: any, filename: string) {
            const yesCount = stats.filter(c => c.Response === 1).length;
            const noCount = stats.filter(c => c.Response === 0).length;

            const options: PieChartOptions = {
                Width  : SQUARE_CHART_WIDTH,
                Height : SQUARE_CHART_HEIGHT,
                Colors : [
                    ChartColors.MediumSeaGreen,
                    ChartColors.Coral,
                    ChartColors.DodgerBlue,
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

        private async createMedicationConsumption_DonutChart(stats: any, filename: string) {

            const missedCount = stats.reduce((acc, x) => acc + x.MissedCount, 0);
            const takenCount = stats.reduce((acc, x) => acc + x.TakenCount, 0);
            const total = stats.length;
            const unmarked = total - (missedCount + takenCount);

            const options: PieChartOptions = {
                Width  : SQUARE_CHART_WIDTH,
                Height : SQUARE_CHART_HEIGHT,
                Colors : [
                    ChartColors.MediumSeaGreen,
                    ChartColors.Coral,
                    ChartColors.DodgerBlue,
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

        private async createMedication_BarChart(stats: any, filename: string) {
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
                Width           : RECTANGULAR_CHART_WIDTH,
                Height          : RECTANGULAR_CHART_HEIGHT,
                YLabel          : 'Medication History',
                CategoriesCount : 2,
                Categories      : [ "Missed", "Taken" ],
                Colors          : [ ChartColors.Orange, ChartColors.GreenLight ],
                FontSize        : '9px',
            };
            return await ChartGenerator.createStackedBarChart(temp, options, filename);
        }

        private async createSleepTrend_BarChart(stats: any, filename: string) {
            const sleepStats = stats.map(c => {
                return {
                    x : `"${TimeHelper.getDayOfMonthFromISODateStr(c.DayStr)}"`,
                    y : c.SleepDuration
                };
            });
            const options: BarChartOptions = {
                Width  : RECTANGULAR_CHART_WIDTH,
                Height : RECTANGULAR_CHART_HEIGHT,
                YLabel : 'Sleep in Hours',
                Color  : ChartColors.GrayDarker
            };

            return await ChartGenerator.createBarChart(sleepStats, options, filename);
        }

        private async createBodyWeight_LineChart(stats: any, filename: string) {
            const temp = stats.map(c => {
                return {
                    x : new Date(c.DayStr),
                    y : c.BodyWeight
                };
            });
            const options: LineChartOptions = DefaultChartOptions.lineChart();
            options.Width = RECTANGULAR_CHART_WIDTH;
            options.Height = RECTANGULAR_CHART_HEIGHT;
            options.XAxisTimeScaled = true;
            options.YLabel = 'Body weight';

            return await ChartGenerator.createLineChart(temp, options, filename);
        }

        private async createBloodGlucose_LineChart(stats: any, filename: string) {
            const temp = stats.map(c => {
                return {
                    x : new Date(c.DayStr),
                    y : c.BloodGlucose
                };
            });
            const options: LineChartOptions = DefaultChartOptions.lineChart();
            options.Width = RECTANGULAR_CHART_WIDTH;
            options.Height = RECTANGULAR_CHART_HEIGHT;
            options.Color = ChartColors.BlueViolet;
            options.XAxisTimeScaled = true;
            options.YLabel = 'Blood Glucose';

            return await ChartGenerator.createLineChart(temp, options, filename);
        }

        private async createBloodPressure_MultiLineChart(stats: any, filename: string) {

            const temp = [];
            for (var c of stats) {
                temp.push({
                    x : new Date(c.DayStr),
                    y : c.Diastolic,
                    z : 'Diastolic'
                });
                temp.push({
                    x : new Date(c.DayStr),
                    y : c.Systolic,
                    z : 'Systolic'
                });
            }
            const options: MultiLineChartOptions = DefaultChartOptions.multiLineChart();
            options.Width = RECTANGULAR_CHART_WIDTH;
            options.Height = RECTANGULAR_CHART_HEIGHT;
            options.XAxisTimeScaled = true;
            options.Categories = ['Diastolic', 'Systolic'];
            options.YLabel = 'mmHg';

            return await ChartGenerator.createMultiLineChart(temp, options, filename);
        }

        private async createCholesterolCharts_MultiLineChart(stats: any, filename: string) {

            const getRecords = (c) => {
                return {
                    x : new Date(c.DayStr),
                    y : c.PrimaryValue,
                    z : c.DisplayName,
                };
            };

            const temp = [];

            let records = stats.TotalCholesterol.map(getRecords);
            temp.push(...records);
            records = stats.HDL.map(getRecords);
            temp.push(...records);
            records = stats.LDL.map(getRecords);
            temp.push(...records);
            records = stats.TriglycerideLevel.map(getRecords);
            temp.push(...records);
            records = stats.A1CLevel.map(getRecords);
            temp.push(...records);

            const options: MultiLineChartOptions = DefaultChartOptions.multiLineChart();
            options.Width = RECTANGULAR_CHART_WIDTH;
            options.Height = RECTANGULAR_CHART_HEIGHT;
            options.XAxisTimeScaled = true;
            options.YLabel = '';
            options.StrokeWidth = 1.5;
            options.Colors = [
                ChartColors.Coral,
                ChartColors.Green,
                ChartColors.Fuchsia,
                ChartColors.LightSlateGray,
                ChartColors.DodgerBlue
            ];
            options.Categories = ['Total Cholesterol', 'HDL', 'LDL', 'Triglyceride Level', 'A1C Level'];

            return await ChartGenerator.createMultiLineChart(temp, options, filename);
        }

        private async createFeelings_DonutChart(stats: any, filename: string) {
            const feelings_ = stats.map(x => x.Feeling);
            const tempFeelings = this.findKeyCounts(feelings_);
            const feelings = Helper.sortObjectKeysAlphabetically(tempFeelings);
            const options: PieChartOptions = {
                Width  : SQUARE_CHART_WIDTH,
                Height : SQUARE_CHART_HEIGHT,
                Colors : [
                    ChartColors.MediumSeaGreen,
                    ChartColors.DodgerBlue,
                    ChartColors.Charcoal,
                    ChartColors.Coral,
                ],
            };
            const data = this.constructDonutChartData(feelings);
            return await ChartGenerator.createDonutChart(data, options, filename);
        }

        private async createMoods_DonutChart(stats: any, filename: string) {
            const moods_ = stats.map(x => x.Mood);
            const tempMoods = this.findKeyCounts(moods_);
            const moods = Helper.sortObjectKeysAlphabetically(tempMoods);
            const options: PieChartOptions = {
                Width  : SQUARE_CHART_WIDTH,
                Height : SQUARE_CHART_HEIGHT,
                Colors : [
                    ChartColors.Tomato,
                    ChartColors.Crimson,
                    ChartColors.DodgerBlue,
                    ChartColors.LightSlateGray,
                    ChartColors.MediumSeaGreen,
                    ChartColors.Gold,
                    ChartColors.LightGray,
                    ChartColors.DarkSlateBlue,
                    ChartColors.Cyan,
                    ChartColors.OrangeRed,
                    ChartColors.Turquoise,
                ],
            };
            const data = this.constructDonutChartData(moods);
            return await ChartGenerator.createDonutChart(data, options, filename);
        }

        private async createEnergyLevels_BubbleChart(stats: any, filename: string) {

            const energyLevels_ = stats.map(x => x.EnergyLevels);
            const e_ = [];
            for (var x of energyLevels_) {
                e_.push(...x);
            }
            const tempEnergyLevels = this.findKeyCounts(e_);
            const energyLevels = Helper.sortObjectKeysAlphabetically(tempEnergyLevels);
            const options: PieChartOptions = {
                Width  : SQUARE_CHART_WIDTH,
                Height : SQUARE_CHART_HEIGHT,
                Colors : [
                    ChartColors.OrangeRed,
                    ChartColors.Magenta,
                    ChartColors.DodgerBlue,
                    ChartColors.DarkCyan,
                    ChartColors.SlateGray,
                    ChartColors.BlueViolet,
                    ChartColors.Bisque,
                    ChartColors.Lime,
                ],
            };
            const data = this.constructDonutChartData(energyLevels);
            return await ChartGenerator.createBubbleChart(data, options, filename);
        }

        private async createUserEngagement_DonutChart(stats: any, filename: string) {
            const options: PieChartOptions = {
                Width  : SQUARE_CHART_WIDTH,
                Height : SQUARE_CHART_HEIGHT,
                Colors : [
                    ChartColors.Green,
                    ChartColors.Orange,
                ],
            };
            const data = [
                {
                    name  : "Finished",
                    value : stats.Finished,
                },
                {
                    name  : "Unfinished",
                    value : stats.Unfinished,
                }
            ];
            return await ChartGenerator.createDonutChart(data, options, filename);
        }

        private async createUserEngagement_CircularProgress(stats: any, filename: string) {

            let total = stats.Finished + stats.Unfinished;
            if (total === 0) {
                total = 1;
            }
            const percentage = (stats.Finished / total) * 100;

            const options: CircularProgressChartOptions = DefaultChartOptions.circularProgress();
            options.Width  = SQUARE_CHART_WIDTH;
            options.Height = SQUARE_CHART_HEIGHT;
            options.GradientColor1 = ChartColors.Lime;
            options.GradientColor2 = ChartColors.DodgerBlue;
            options.PathColor      = '#404F70';

            return await ChartGenerator.createCircularProgressChart(percentage, options, filename);
        }

        private async createUserTasks_StackedBarChart(stats: any, filename: string) {
            const temp = [];
            for (var c of stats) {
                temp.push({
                    x : `"${TimeHelper.getDayOfMonthFromISODateStr(c.DayStr)}"`,
                    y : c.Finished,
                    z : 'Finished'
                });
                temp.push({
                    x : `"${TimeHelper.getDayOfMonthFromISODateStr(c.DayStr)}"`,
                    y : c.Unfinished,
                    z : 'Unfinished'
                });
            }
            const options: MultiBarChartOptions = {
                Width           : RECTANGULAR_CHART_WIDTH,
                Height          : RECTANGULAR_CHART_HEIGHT,
                YLabel          : 'User Response',
                CategoriesCount : 2,
                Categories      : [ "Finished", "Unfinished"],
                Colors          : [ ChartColors.Green, ChartColors.OrangeRed ],
                FontSize        : '9px',
            };
            return await ChartGenerator.createStackedBarChart(temp, options, filename);
        }

        private constructDonutChartData(x_) {
            const data = [];
            const keys = Object.keys(x_);
            for (var key of keys) {
                data.push({
                    name  : key,
                    value : x_[key]
                });
            }
            return data;
        }

        private findKeyCounts(x_) {
            const counts = {};
            for (const element of x_) {
                if (counts[element]) {
                    counts[element] += 1;
                } else {
                    counts[element] = 1;
                }
            }
            return counts;
        }

}

// feelings = ["Better", "Same", "Worse", "Unspecified"]
// moods = ["Happy", "Lonely", "Angry", "Stressed", "Anxious",
//  "Fearful", "Sad", "Hopeful", "Calm", "Status Quo", "Unspecified"]
// energy_levels = ["Get off the bed", "Climb stairs", "Exercise",
//  "Walk", "Stand", "Eat", "Get through the day without a nap", "Unspecified"]
