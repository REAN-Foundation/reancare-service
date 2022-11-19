import path from "path";
import fs from "fs";
import { LineChartOptions } from "./chart.options";
import { htmlTextToPNG } from '../../common/html.renderer';

/////////////////////////////////////////////////////////////////////////////////

export class ChartGenerator {

    createLineChart = async (data: any[], options: LineChartOptions): Promise<string> => {
        const cwd = process.cwd();
        const templatePath = path.join(cwd,'assets/charts/html.templates/','simple.line.chart.html');
        var template = fs.readFileSync(templatePath, "utf8");
        const tokens = template.split('// customization');
        const pre = tokens[0];
        const post = tokens[2];
        let dataStr = `\nconst data = [\n`;
        if (options.XAxisTimeScaled) {
            for (var d of data) {
                const str = `{ x: new Date("${d.x?.toISOString()}"), y: ${d.y?.toString()} },\n`;
                dataStr += str;
            }
        }
        else {
            for (var d of data) {
                const str = `{ x: ${d.x?.toString()}, y: ${d.y?.toString()} },\n`;
                dataStr += str;
            }
        }
        dataStr += `];`;

        dataStr += `const width           = 650;\n`;
        dataStr += `const height          = 400;\n`;
        dataStr += `const xFrom           = null;\n`;
        dataStr += `const xTo             = new Date("2007-06-09T00:00:00.000Z");\n`;
        dataStr += `const yFrom           = 70;\n`;
        dataStr += `const yTo             = null;\n`;
        dataStr += `const xAxisTimeScaled = true;\n`;
        dataStr += `const yLabel          = 'Day Close $'\n`;
        dataStr += `const fontSize        = "14px";\n`;
        dataStr += `const axisStrokeWidth = 3.5;\n`;
        dataStr += `const axisColor       = "#2E4053";\n`;

        const html = pre + dataStr + post;

        const imageLocation = await htmlTextToPNG(html, 550, 350);
        return imageLocation;
    };

}
