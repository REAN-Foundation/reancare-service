import { ChartGenerator } from "../../../../modules/charts/chart.generator";
import { ChartColors, LinearProgressChartOptions } from "../../../../modules/charts/chart.options";
import { DefaultChartOptions } from "../../../../modules/charts/default.chart.options";

//////////////////////////////////////////////////////////////////////////////////

export const createCareplanCharts = async (data) => {
    var locations = [];
    if (data.Enrollment == null) {
        return locations;
    }
    const location = await createCareplan_LinearProgressChart((data.CurrentProgress ? data.CurrentProgress : 0) * 100, 'Careplan_Progress');
    locations.push({
        key : 'Careplan_Progress',
        location
    });

    return locations;
};

const createCareplan_LinearProgressChart = async (stats: any, filename:string) => {
    const options: LinearProgressChartOptions = DefaultChartOptions.linearProgress();
    options.Width = 650;
    options.Height = 40;
    options.GradientColor1 = ChartColors.MediumSeaGreen;
    options.GradientColor2 = ChartColors.DodgerBlue;
    options.PathColor = ChartColors.GrayDarker;
    options.TextColor = ChartColors.WhiteSmoke;
    return await ChartGenerator.createLinearProgressChart(stats, options, filename);
};
