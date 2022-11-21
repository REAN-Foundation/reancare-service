import path from "path";
import fs from "fs";
import { BarChartOptions, LineChartOptions } from "./chart.options";
import { htmlTextToPNG } from '../../common/html.renderer';
import { Helper } from "../../common/helper";

/////////////////////////////////////////////////////////////////////////////////

export class ChartGenerator {

    static createLineChart = async (data: any[], options: LineChartOptions, filename: string): Promise<string|undefined> => {
        const cwd = process.cwd();
        const templatePath = path.join(cwd,'assets/charts/html.templates/','simple.line.chart.html');
        var template = fs.readFileSync(templatePath, "utf8");
        const tokens = template.split('// customization');
        const pre = tokens[0];
        const post = tokens[2];
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
        dataStr += `\tconst xFrom           = ${options.XFrom ?? 'null' };\n`;
        dataStr += `\tconst xTo             = ${options.XTo ?? 'null' };\n`;
        dataStr += `\tconst yFrom           = ${options.YFrom ?? 'null' };\n`;
        dataStr += `\tconst yTo             = ${options.YTo ?? 'null' };\n`;
        dataStr += `\tconst xAxisTimeScaled = ${options.XAxisTimeScaled ? 'true' : 'false'};\n`;
        dataStr += `\tconst yLabel          = "${options.YLabel}"\n`;
        dataStr += `\tconst fontSize        = "${options.FontSize ??  `14px` }";\n`;
        dataStr += `\tconst axisStrokeWidth = ${options.AxisStrokeWidth ?? `3.5` };\n`;
        dataStr += `\tconst axisColor       = "${options.AxisColor ?? `#2E4053` }";\n`;

        const html = pre + dataStr + post;

        Helper.writeTextToFile(html, `${filename}.html`);

        return await htmlTextToPNG(html, 550, 350, `${filename}.png`);
    };

    static createBarChart = async (data: any[], options: BarChartOptions, filename: string): Promise<string|undefined> => {
        const cwd = process.cwd();
        const templatePath = path.join(cwd,'assets/charts/html.templates/','simple.bar.chart.html');
        var template = fs.readFileSync(templatePath, "utf8");
        const tokens = template.split('// customization');
        const pre = tokens[0];
        const post = tokens[2];

        let dataStr = `\n\tconst data = [\n`;
        for (var d of data) {
            const str = `\t\t{ x: ${d.x?.toString()}, y: ${d.y?.toString()} },\n`;
            dataStr += str;
        }

        dataStr += `\t];\n\n`;

        dataStr += `\tconst width           = ${options.Width};\n`;
        dataStr += `\tconst height          = ${options.Height};\n`;
        dataStr += `\tconst yLabel          = "${options.YLabel}"\n`;
        dataStr += `\tconst fontSize        = "${options.FontSize ??  `11px` }";\n`;

        const html = pre + dataStr + post;

        Helper.writeTextToFile(html, `${filename}.html`);

        return await htmlTextToPNG(html, 350, 225, `${filename}.png`);
    };

    static createGroupBarChart = async (data: any[], options: BarChartOptions, filename: string)
        : Promise<string|undefined> => {
        const cwd = process.cwd();
        const templatePath = path.join(cwd,'assets/charts/html.templates/','simple.bar.chart.html');
        var template = fs.readFileSync(templatePath, "utf8");
        const tokens = template.split('// customization');
        const pre = tokens[0];
        const post = tokens[2];

        let dataStr = `\n\tconst data = [\n`;
        for (var d of data) {
            const str = `\t\t{ x: ${d.x?.toString()}, y: ${d.y?.toString()} },\n`;
            dataStr += str;
        }

        dataStr += `\t];\n\n`;

        dataStr += `\tconst width           = ${options.Width};\n`;
        dataStr += `\tconst height          = ${options.Height};\n`;
        dataStr += `\tconst yLabel          = "${options.YLabel}"\n`;
        dataStr += `\tconst fontSize        = "${options.FontSize ??  `11px` }";\n`;

        const html = pre + dataStr + post;

        Helper.writeTextToFile(html, `${filename}.html`);

        return await htmlTextToPNG(html, 350, 225, `${filename}.png`);
    };

}
