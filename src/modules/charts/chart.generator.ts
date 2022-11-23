import path from "path";
import fs from "fs";
import { BarChartOptions, MultiBarChartOptions, LineChartOptions, PieChartOptions, ChartOptions, CalendarChartOptions, MultiLineChartOptions } from "./chart.options";
import { htmlTextToPNG } from '../../common/html.renderer';
import { Helper } from "../../common/helper";

/////////////////////////////////////////////////////////////////////////////////

export class ChartGenerator {

    static createLineChart = async (
        data: any[], options: LineChartOptions, filename: string): Promise<string|undefined> => {
        const templHtml = 'simple.line.chart.html';
        const { pre, post } = ChartGenerator.extractPrePostTextBlocks(templHtml);
        const dataStr = ChartGenerator.createSimpleLineChartTextBlock(data, options);
        return await ChartGenerator.generateChartImage(pre, dataStr, post, filename, options);
    };

    static createMultiLineChart = async (
        data: any[], options: MultiLineChartOptions, filename: string): Promise<string|undefined> => {
        const templHtml = 'multi.line.chart.html';
        const { pre, post } = ChartGenerator.extractPrePostTextBlocks(templHtml);
        const dataStr = ChartGenerator.createMultiLineChartTextBlock(data, options);
        return await ChartGenerator.generateChartImage(pre, dataStr, post, filename, options);
    };

    static createBarChart = async (
        data: any[], options: BarChartOptions, filename: string): Promise<string|undefined> => {
        const templHtml = 'simple.bar.chart.html';
        const { pre, post } = ChartGenerator.extractPrePostTextBlocks(templHtml);
        const dataStr = ChartGenerator.createSimpleBarChartTextBlock(data, options);
        return await ChartGenerator.generateChartImage(pre, dataStr, post, filename, options);
    };

    static createGroupBarChart = async (data: any[], options: MultiBarChartOptions, filename: string)
        : Promise<string|undefined> => {
        const templHtml = 'group.bar.chart.html';
        return await ChartGenerator.multiBarChart(templHtml, data, options, filename);
    };

    static createStackedBarChart = async (data: any[], options: MultiBarChartOptions, filename: string)
    : Promise<string|undefined> => {
        const templHtml = 'stacked.bar.chart.html';
        return await ChartGenerator.multiBarChart(templHtml, data, options, filename);
    };

    static createDonutChart = async (data: any[], options: MultiBarChartOptions, filename: string)
    : Promise<string|undefined> => {
        const templHtml = 'simple.donut.chart.html';
        const { pre, post } = ChartGenerator.extractPrePostTextBlocks(templHtml);
        const dataStr = ChartGenerator.createSimpleDonutChartTextBlock(data, options);
        return await ChartGenerator.generateChartImage(pre, dataStr, post, filename, options);
    };

    static createPieChart = async (data: any[], options: MultiBarChartOptions, filename: string)
    : Promise<string|undefined> => {
        const templHtml = 'simple.pie.chart.html';
        const { pre, post } = ChartGenerator.extractPrePostTextBlocks(templHtml);
        const dataStr = ChartGenerator.createSimpleDonutChartTextBlock(data, options);
        return await ChartGenerator.generateChartImage(pre, dataStr, post, filename, options);
    };

    static createBubbleChart = async (
        data: any[], options: ChartOptions, filename: string): Promise<string|undefined> => {
        const templHtml = 'bubble.chart.html';
        const { pre, post } = ChartGenerator.extractPrePostTextBlocks(templHtml);
        const dataStr = ChartGenerator.createBubbleChartTextBlock(data, options);
        return await ChartGenerator.generateChartImage(pre, dataStr, post, filename, options);
    };

    static createCalendarChart = async (
        data: any[], options: ChartOptions, filename: string): Promise<string|undefined> => {
        const templHtml = 'calendar.chart.html';
        const { pre, post } = ChartGenerator.extractPrePostTextBlocks(templHtml);
        const dataStr = ChartGenerator.createCalendarChartTextBlock(data, options);
        return await ChartGenerator.generateChartImage(pre, dataStr, post, filename, options);
    };

    //#region Common Privates

    private static generateChartImage = async (
        pre: string, dataStr: string, post: string, filename: string, options: BarChartOptions) => {
        const html = pre + dataStr + post;
        Helper.writeTextToFile(html, `${filename}.html`);
        return await htmlTextToPNG(html, options.Width, options.Height, `${filename}.png`);
    }

    private static extractPrePostTextBlocks(templHtml: string) {
        const cwd = process.cwd();
        const templatePath = path.join(cwd, 'assets/charts/html.templates/', templHtml);
        var template = fs.readFileSync(templatePath, "utf8");
        const tokens = template.split('// customization');
        const pre = tokens[0];
        const post = tokens[2];
        return { pre, post };
    }

    //#endregion

    //#region Chart specific privates

    private static createSimpleLineChartTextBlock(data: any[], options: LineChartOptions) {
        let dataStr = `\n\tconst data = [\n`;
        if (options.XAxisTimeScaled) {
            for (var d of data) {
                const str = `\t\t{ x: new Date("${d.x?.toISOString()}"), y: ${d.y?.toString()} },\n`;
                dataStr += str;
            }
        }
        else {
            for (var d of data) {
                const str = `\t\t{ x: ${d.x?.toString()}, y: ${d.y?.toString()} },\n`;
                dataStr += str;
            }
        }
        dataStr += `\t];\n\n`;

        dataStr += `\tconst width           = ${options.Width};\n`;
        dataStr += `\tconst height          = ${options.Height};\n`;
        dataStr += `\tconst color           = "${options.Color}"\n`;
        dataStr += `\tconst xFrom           = ${options.XFrom ?? 'null'};\n`;
        dataStr += `\tconst xTo             = ${options.XTo ?? 'null'};\n`;
        dataStr += `\tconst yFrom           = ${options.YFrom ?? 'null'};\n`;
        dataStr += `\tconst yTo             = ${options.YTo ?? 'null'};\n`;
        dataStr += `\tconst xAxisTimeScaled = ${options.XAxisTimeScaled ? 'true' : 'false'};\n`;
        dataStr += `\tconst yLabel          = "${options.YLabel}"\n`;
        dataStr += `\tconst fontSize        = "${options.FontSize ?? `14px`}";\n`;
        dataStr += `\tconst axisStrokeWidth = ${options.AxisStrokeWidth ?? `2.0`};\n`;
        dataStr += `\tconst axisColor       = "${options.AxisColor ?? `#2E4053`}";\n`;
        return dataStr;
    }

    private static createMultiLineChartTextBlock(data: any[], options: MultiLineChartOptions) {
        let dataStr = `\n\tconst data = [\n`;
        if (options.XAxisTimeScaled) {
            for (var d of data) {
                const str = `\t\t{ x: new Date("${d.x?.toISOString()}"), y: ${d.y?.toString()} },\n`;
                dataStr += str;
            }
        }
        else {
            for (var d of data) {
                const str = `\t\t{ x: ${d.x?.toString()}, y: ${d.y?.toString()} },\n`;
                dataStr += str;
            }
        }
        dataStr += `\t];\n\n`;

        dataStr += `\tconst width           = ${options.Width};\n`;
        dataStr += `\tconst height          = ${options.Height};\n`;
        dataStr += `\tconst fontSize        = "${options.FontSize ?? `12px`}";\n`;
        dataStr += `\tconst categories      = ${JSON.stringify(options.Categories)}\n`;
        dataStr += `\tconst colors          = ${JSON.stringify(options.Colors)}\n`;
        return dataStr;
    }

    private static createSimpleBarChartTextBlock(data: any[], options: BarChartOptions) {
        let dataStr = `\n\tconst data = [\n`;
        for (var d of data) {
            const str = `\t\t{ x: ${d.x?.toString()}, y: ${d.y?.toString()} },\n`;
            dataStr += str;
        }
        dataStr += `\t];\n\n`;
        dataStr += `\tconst width           = ${options.Width};\n`;
        dataStr += `\tconst height          = ${options.Height};\n`;
        dataStr += `\tconst color           = "${options.Color}"\n`;
        dataStr += `\tconst yLabel          = "${options.YLabel}"\n`;
        dataStr += `\tconst fontSize        = "${options.FontSize ?? `11px`}";\n`;
        return dataStr;
    }

    private static createMultiBarChartTextBlock(data: any[], options: MultiBarChartOptions) {
        let dataStr = `\n\tconst data = [\n`;
        for (var d of data) {
            const str = `\t\t{ x: ${d.x?.toString()}, y: ${d.y?.toString()}, z: "${d.z?.toString()}" },\n`;
            dataStr += str;
        }
        dataStr += `\t];\n\n`;
        dataStr += `\tconst width           = ${options.Width};\n`;
        dataStr += `\tconst height          = ${options.Height};\n`;
        dataStr += `\tconst yLabel          = "${options.YLabel}"\n`;
        dataStr += `\tconst categoriesCount = ${options.CategoriesCount}\n`;
        dataStr += `\tconst categories      = ${JSON.stringify(options.Categories)}\n`;
        dataStr += `\tconst colors          = ${JSON.stringify(options.Colors)}\n`;
        dataStr += `\tconst fontSize        = "${options.FontSize ?? `11px`}";\n`;
        return dataStr;
    }

    private static multiBarChart = async (
        templHtml: string, data: any[], options: MultiBarChartOptions, filename: string) => {
        const { pre, post } = ChartGenerator.extractPrePostTextBlocks(templHtml);
        const dataStr = ChartGenerator.createMultiBarChartTextBlock(data, options);
        return await ChartGenerator.generateChartImage(pre, dataStr, post, filename, options);
    };

    private static createSimpleDonutChartTextBlock(data: any[], options: PieChartOptions) {
        let dataStr = `\n\tconst data = [\n`;
        for (var d of data) {
            const str = `\t\t{ name: "${d.name?.toString()}", value: ${d.value?.toString()} },\n`;
            dataStr += str;
        }
        dataStr += `\t];\n\n`;
        dataStr += `\tconst width           = ${options.Width};\n`;
        dataStr += `\tconst height          = ${options.Height};\n`;
        dataStr += `\tconst colors          = ${JSON.stringify(options.Colors)}\n`;
        dataStr += `\tconst fontSize        = "${options.FontSize ?? `11px`}";\n`;
        return dataStr;
    }

    private static createBubbleChartTextBlock(data: any[], options: ChartOptions) {
        let dataStr = `\n\tconst data = [\n`;
        for (var d of data) {
            const str = `\t\t{ name: "${d.x?.toString()}", value: ${d.y?.toString()} },\n`;
            dataStr += str;
        }
        dataStr += `\t];\n\n`;
        dataStr += `\tconst width           = ${options.Width};\n`;
        dataStr += `\tconst height          = ${options.Height};\n`;
        dataStr += `\tconst fontSize        = "${options.FontSize ?? `11px`}";\n`;
        return dataStr;
    }

    private static createCalendarChartTextBlock(data: any[], options: CalendarChartOptions) {
        let dataStr = `\n\tconst data = [\n`;
        for (var d of data) {
            const str = `\t\t{ date: new Date("${d.x?.toISOString().split('T')[0]}"), value: ${d.y?.toString()} },\n`;
            dataStr += str;
        }
        dataStr += `\t];\n\n`;
        dataStr += `\tconst width           = ${options.Width};\n`;
        dataStr += `\tconst height          = ${options.Height};\n`;
        dataStr += `\tconst colors          = ${JSON.stringify(options.Colors)}\n`;
        dataStr += `\tconst fontSize        = "${options.FontSize ?? `11px`}";\n`;
        return dataStr;
    }

    //#endregion

}
