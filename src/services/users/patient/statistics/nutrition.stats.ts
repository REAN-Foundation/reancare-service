import { Helper } from "../../../../common/helper";
import { TimeHelper } from "../../../../common/time.helper";
import { ChartGenerator } from "../../../../modules/charts/chart.generator";
import { LineChartOptions, BarChartOptions, ChartColors, MultiBarChartOptions } from "../../../../modules/charts/chart.options";
import { DefaultChartOptions } from "../../../../modules/charts/default.chart.options";
import {
    addRectangularChartImage,
    chartExists,
    RECTANGULAR_CHART_HEIGHT,
    RECTANGULAR_CHART_WIDTH } from "./report.helper";
import { addSectionTitle, addNoDataDisplay, addLegend } from "./stat.report.commons";

//////////////////////////////////////////////////////////////////////////////////

export const addNutritionQuestionnaire = (document, model, y) => {

    const titleColor = '#505050';
    let chartImage = 'Nutrition_CaloriesConsumed_LastMonth';
    let detailedTitle = 'Calorie Consumption for Last Month';
    let sectionTitle = 'Food and Nutrition - Calories';
    let icon = Helper.getIconsPath('nutrition.png');

    // y = addSectionTitle(document, y, sectionTitle, icon);
    // if (!chartExists(model, chartImage)) {
    //     y = addNoDataDisplay(document, y);
    // } else {
    //     y = y + 25;
    //     y = addRectangularChartImage(document, model, chartImage, y, detailedTitle, titleColor);
    //     y = y + 27;
    // }

    sectionTitle = 'Food and Nutrition - Questionnaire';
    icon = Helper.getIconsPath('questionnaire.png');
    y = addSectionTitle(document, y, sectionTitle, icon);
    chartImage = 'Nutrition_QuestionnaireResponses_LastMonth';
    detailedTitle = 'Nutrition Questionnaire Response';

    if (!chartExists(model, chartImage)) {
        y = addNoDataDisplay(document, y);
    } else {
        y = y + 25;
        y = addRectangularChartImage(document, model, chartImage, y, detailedTitle, titleColor);
        y = y + 20;
        const colors = getNutritionQuestionCategoryColors();
        const legend = colors.map(x => {
            return {
                Key   : x.Key + ': ' + x.Question,
                Color : x.Color,
            };
        });
        y = addLegend(document, y, legend, 125, 11, 50, 10, 15);
    }

    return y;
};

export const addNutritionServingsStats = (document, model, y) => {

    const chartImage = 'Nutrition_Servings_LastMonth';
    const detailedTitle = 'Servings History for Last Month';
    const titleColor = '#505050';
    const sectionTitle = 'Food and Nutrition - Servings';

    const icon = Helper.getIconsPath('food-servings.png');
    y = addSectionTitle(document, y, sectionTitle, icon);

    if (!chartExists(model, chartImage)) {
        y = addNoDataDisplay(document, y);
    } else {
        y = y + 25;
        y = addRectangularChartImage(document, model, chartImage, y, detailedTitle, titleColor);
        y = y + 27;
        const colors = getNutritionServingsCategoryColors();
        const legend = colors.map(x => {
            return {
                Key   : x.Key + ': ' + x.Question,
                Color : x.Color,
            };
        });
        y = addLegend(document, y, legend, 122, 11, 35, 10, 15);
    }
    return y;
};

export const createNutritionCharts = async (data) => {
    var locations = [];

    //Calories
    let location = await createNutritionCalorie_LineChart(data.LastMonth.CalorieStats, 'Nutrition_CaloriesConsumed_LastMonth');
    locations.push({
        key : 'Nutrition_CaloriesConsumed_LastMonth',
        location
    });
    location = await createNutritionCalorie_BarChart(data.LastMonth.CalorieStats, 'Nutrition_CaloriesConsumed_LastWeek');
    locations.push({
        key : 'Nutrition_CaloriesConsumed_LastWeek',
        location
    });

    if (data.LastMonth.QuestionnaireStats) {

        //Questionnaire

        const qstats = [
            ...(data.LastMonth.QuestionnaireStats.HealthyFoodChoices.Stats),
            ...(data.LastMonth.QuestionnaireStats.HealthyProteinConsumptions.Stats),
            ...(data.LastMonth.QuestionnaireStats.LowSaltFoods.Stats),
        ];
        location = await createNutritionQueryForWeek_BarChart(qstats, 'Nutrition_QuestionnaireResponses_LastWeek');
        locations.push({
            key : 'Nutrition_QuestionnaireResponses_LastWeek',
            location
        });
        location = await createNutritionQueryForMonth_StackedBarChart(qstats, 'Nutrition_QuestionnaireResponses_LastMonth');
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
        location = await createNutritionServingsForMonth_BarChart(servingsStats, 'Nutrition_Servings_LastMonth');
        locations.push({
            key : 'Nutrition_Servings_LastMonth',
            location
        });
        location = await createNutritionServingsForWeek_BarChart(servingsStats, 'Nutrition_Servings_LastWeek');
        locations.push({
            key : 'Nutrition_Servings_LastWeek',
            location
        });
    }

    return locations;
};

const createNutritionCalorie_LineChart = async (stats: any, filename: string) => {
    if (stats.length === 0) {
        return null;
    }
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
};

const createNutritionCalorie_BarChart = async (stats: any, filename: string) => {
    if (stats.length === 0) {
        return null;
    }
    const calorieStats = stats.map(c => {
        return {
            x : `"${TimeHelper.getWeekday(new Date(c.DayStr), true)}"`,
            y : c.Calories
        };
    });
    const options: BarChartOptions = DefaultChartOptions.barChart();
    options.Width  = RECTANGULAR_CHART_WIDTH;
    options.Height = RECTANGULAR_CHART_HEIGHT;
    options.YLabel = 'Calories';
    options.Color  = ChartColors.MediumSeaGreen;

    return await ChartGenerator.createBarChart(calorieStats, options, filename);
};

const createNutritionQueryForWeek_BarChart = async (stats: any, filename: string) => {
    if (stats.length === 0) {
        return null;
    }
    const temp = stats.map(c => {
        return {
            x : `"${TimeHelper.getWeekday(new Date(c.DayStr), true)}"`,
            y : c.Response,
            z : c.Type,
        };
    });
    const categoryColors = getNutritionQuestionCategoryColors();
    const categories = categoryColors.map(x => x.Key);
    const colors = categoryColors.map(x => x.Color);

    const options: MultiBarChartOptions =  DefaultChartOptions.multiBarChart();
    options.Width           = RECTANGULAR_CHART_WIDTH;
    options.Height          = RECTANGULAR_CHART_HEIGHT;
    options.YLabel          = 'User Response';
    options.CategoriesCount = categories.length;
    options.Categories      = categories;
    options.Colors          = colors;
    options.FontSize        = '14px';
    options.ShowYAxis       = false;

    return await ChartGenerator.createGroupBarChart(temp, options, filename);
};

const createNutritionQueryForMonth_StackedBarChart = async (stats: any, filename: string) => {
    if (stats.length === 0) {
        return null;
    }
    const temp = stats.map(c => {
        return {
            x : new Date (c.DayStr),
            y : c.Response,
            z : c.Type,
        };
    });
    const categoryColors = getNutritionQuestionCategoryColors();
    const categories = categoryColors.map(x => x.Key);
    const colors = categoryColors.map(x => x.Color);

    const options: MultiBarChartOptions =  DefaultChartOptions.multiBarChart();
    options.Width           = RECTANGULAR_CHART_WIDTH;
    options.Height          = RECTANGULAR_CHART_HEIGHT;
    options.YLabel          = 'User Response';
    options.CategoriesCount = categories.length;
    options.Categories      = categories;
    options.Colors          = colors;
    options.FontSize        = '12px';
    options.ShowYAxis       = false;
    options.XAxisTimeScaled = true;


    return await ChartGenerator.createStackedBarChart(temp, options, filename);
};

const createNutritionServingsForWeek_BarChart = async (stats: any, filename: string) => {
    if (stats.length === 0) {
        return null;
    }
    const temp = stats.map(c => {
        return {
            x : `"${TimeHelper.getWeekday(new Date(c.DayStr), true)}"`,
            y : c.Servings,
            z : c.Type,
        };
    });
    const categoryColors = getNutritionServingsCategoryColors();
    const categories = categoryColors.map(x => x.Key);
    const colors = categoryColors.map(x => x.Color);
    const options: MultiBarChartOptions =  DefaultChartOptions.multiBarChart();
    options.Width           = RECTANGULAR_CHART_WIDTH;
    options.Height          = RECTANGULAR_CHART_HEIGHT;
    options.YLabel          = 'Servings';
    options.CategoriesCount = categories.length;
    options.Categories      = categories;
    options.Colors          = colors;
    options.FontSize        = '14px';

    return await ChartGenerator.createGroupBarChart(temp, options, filename);
};

const createNutritionServingsForMonth_BarChart = async (stats: any, filename: string) => {
    if (stats.length === 0) {
        return null;
    }
    const temp = stats.map(c => {
        return {
            x : new Date (c.DayStr),
            y : c.Servings,
            z : c.Type
        };
    });
    const categoryColors = getNutritionServingsCategoryColors();
    const categories = categoryColors.map(x => x.Key);
    const colors = categoryColors.map(x => x.Color);
    const options: MultiBarChartOptions =  DefaultChartOptions.multiBarChart();
    options.Width           = RECTANGULAR_CHART_WIDTH;
    options.Height          = RECTANGULAR_CHART_HEIGHT;
    options.YLabel          = 'Servings/day';
    options.CategoriesCount = categories.length;
    options.Categories      = categories;
    options.Colors          = colors;
    options.FontSize        = '12px';
    options.XAxisTimeScaled = true;


    return await ChartGenerator.createStackedBarChart(temp, options, filename);
};

export const getNutritionQuestionCategoryColors = () => {
    const items = [
        {
            Key      : 'Healthy',
            Color    : ChartColors.MediumSeaGreen,
            Question : 'Were most of your food choices healthy today?',
        },
        {
            Key      : 'Protein',
            Color    : ChartColors.DodgerBlue,
            Question : 'Did you select healthy sources of protein today?',
        },
        {
            Key      : 'Low Salt',
            Color    : ChartColors.OrangeRed,
            Question : 'Did you choose or prepare foods with little or no salt today?',
        },
    ];
    return items;
};

const getNutritionServingsCategoryColors = () => {
    const items = [
        {
            Key      : 'Veggies',
            Color    : ChartColors.MediumSeaGreen,
            Question : 'How many servings of vegetables did you eat today?',
        },
        {
            Key      : 'Fruits',
            Color    : ChartColors.Orchid,
            Question : 'How many servings of fruit did you eat today',
        },
        {
            Key      : 'Grains',
            Color    : ChartColors.Tan,
            Question : 'How many servings of whole grains did you eat today?',
        },
        {
            Key      : 'Seafood',
            Color    : ChartColors.DodgerBlue,
            Question : 'How many servings of fish or shellfish/seafood did you eat today?',
        },
        {
            Key      : 'Sugar',
            Color    : ChartColors.OrangeRed,
            Question : 'How many servings of sugary drinks did you drink today?',
        },
    ];
    return items;
};
