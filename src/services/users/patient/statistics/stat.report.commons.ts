import * as path from 'path';
import { PDFGenerator } from "../../../../modules/reports/pdf.generator";

///////////////////////////////////////////////////////////////////////////////////////

export type Alignment = "left" | "right" | "center";

///////////////////////////////////////////////////////////////////////////////////////

export default class StatReportCommons {

    public addBottom(document: any, pageNumber: any, model: any) {
        PDFGenerator.addOrderPageNumber(document, pageNumber, model.TotalPages);
        this.addFooter(document, "https://www.heart.org/", model.FooterImagePath);
    }

    public addTop(document: any, model: any, addToNewPage = true) {
        var y = 17;
        if (addToNewPage) {
            this.addNewPage(document);
        }
        y = this.addHeader(document, model.ReportTitle, y, model.HeaderImagePath);
        y = this.addReportDate(y, document, model);
        return y;
    }

    public addReportDate(y: number, document: PDFKit.PDFDocument, model: any) {
        y = y + 45;
        document
            .fillColor('#444444')
            .fontSize(10)
            .text('Date: ' + model.ReportDateStr, 200, y, { align: "right" })
            .moveDown();
        return y;
    }

    public  addNewPage = (document) => {
        document.addPage({
            size    : 'A4',
            margins : {
                top    : 0,
                bottom : 0,
                left   : 0,
                right  : 50
            }
        });
    };

    public addHeader = (document: PDFKit.PDFDocument, title: string, y: number, headerImagePath: string) => {

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

    public addSectionTitle = (document: PDFKit.PDFDocument, y: number, pageTitle: string): number => {
        y = y + 20;

        //DrawLine(document, y);
        document
            .roundedRect(50, y, 500, 55, 1)
            .lineWidth(0.1)
            .fillOpacity(0.8)
            .fill("#e8ecef");

        y = y + 22;

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
            .text(pageTitle, 35, y, { align: "center" })
            .moveDown();

        y = y + 23;

        return y;
    }

    public addFooter = (document, text, logoImagePath) => {

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

    public addText = (
        document, text: string, textX: number, textY: number,
        fontSize: number, color: string, alignment: Alignment) => {
        document
            .fontSize(fontSize)
            .fillColor(color)
            .text(text, textX, textY, { align: alignment })
            .moveDown();
    }

    public addLabeledText = (
        document, label: string, text: string,
        labelX: number, labelY: number,
        textX: number, textY: number,
        fontSize: number, color: string, alignment: Alignment) => {
        document
            .font('Helvetica-Bold')
            .fontSize(fontSize)
            .text(label, labelX, labelY, { align: alignment })
            .fillColor(color)
            .font('Helvetica-Bold')
            .text(text, textX, textY, { align: "left" })
            .moveDown();
    }

}
