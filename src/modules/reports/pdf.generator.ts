
import fs from 'fs';
import path from 'path';
// import { Logger } from '../../common/logger';
// import { ApiError } from '../../common/api.error';
// import { Helper } from '../../common/helper';
import { TimeHelper } from '../../common/time.helper';
import pdfkit from 'pdfkit';
import { ConfigurationManager } from "../../config/configuration.manager";
import { DateStringFormat } from '../../domain.types/miscellaneous/time.types';

///////////////////////////////////////////////////////////////////////////////////////

export class PDFGenerator {

    static getAbsoluteFilePath = async (filePrefix) => {
        var uploadFolder = ConfigurationManager.UploadTemporaryFolder();
        var dateFolder = TimeHelper.getDateString(new Date(), DateStringFormat.YYYY_MM_DD);
        var fileFolder = path.join(uploadFolder, dateFolder);
        if (!fs.existsSync(fileFolder)) {
            await fs.promises.mkdir(fileFolder, { recursive: true });
        }
        const timestamp = TimeHelper.timestamp(new Date());
        var filename = filePrefix + timestamp + '.pdf';
        var absFilepath = path.join(fileFolder, filename);
        return { absFilepath, filename };
    };

    static createDocument = (title, author, writeStream) => {

        const document = new pdfkit({
            size : 'A4',
            info : {
                Title  : title,
                Author : author,
            },
            margins : {
                top    : 0,
                bottom : 0,
                left   : 0,
                right  : 50
            }
        });
        document.pipe(writeStream);
        return document;
    };

    static addNewPage = (document) => {

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

    static addOrderPageNumber = (document, pageNumber, totalPages, color = '#222222') => {

        var pageNumberStr = 'Page: ' + pageNumber.toString() + ' of ' + totalPages.toString();

        document
            .fontSize(8)
            .fillColor(color)
            .text(pageNumberStr, 0, 780, { align: "right" });

    };

    static savePDFLocally = async (writeStream, absFilepath: string): Promise<string> => {

        return new Promise((resolve, reject) => {

            writeStream
                .on('finish', () => {
                    return resolve(absFilepath);
                })
                .on('error', (error) => {
                    return reject(error);
                });
        });
    };

    static addHeader = (document, model, y: number, headerImagePath) => {

        var imageFile = path.join(process.cwd(), headerImagePath);

        document
            .image(imageFile, 0, 0, { width: 595 })
            .fillColor("#ffffff")
            .font('Helvetica')
            .fontSize(16)
            .text(model.DoctorName, 100, y, { align: 'right' });

        document
            .fontSize(7);

        y = y + 20;
        if (model.Specialization != null){
            document
                .font('Helvetica')
                .text(model.Specialization, 100, y, { align: "right" });
        }

        document
            .fontSize(9);

        y = y + 12;
        if (model.DoctorPhonenumber != null){
            document
                .font('Helvetica-Bold')
                .text(model.DoctorPhonenumber, 100, y, { align: "right" });
        }

        document.moveDown();

        return y;
    };

    static addOrderFooter = (document, model, y, logoImagePath) => {

        //var imageFile = path.join(process.cwd(), "./assets/images/REANCare_Footer.png");
        var imageFile = path.join(process.cwd(), logoImagePath);

        document
            .image(imageFile, 0, 800, { width: 595 });

        document
            .fontSize(8)
            .fillColor('#ffffff');
        if (model.ClinicName != null){
            document
                .text(model.ClinicName, 100, 810, { align: "right" });
        }

        document.fontSize(7);
        if (model.ClinicAddress != null){
            document
                .text(model.ClinicAddress, 100, 822, { align: "right" });
        }

        return y;
    };

    static drawLine = (document, fromX, fromY, toX, toY) => {
        document
            .strokeColor("#aaaaaa")
            .lineWidth(1)
            .moveTo(fromX, fromY)
            .lineTo(toX, toY)
            .stroke();
    };

    static addOrderMetadata = (y, document, model) => {

        y = y + 35;

        document
            .fillColor('#444444')
            .fontSize(10)
            .text('Date: ' + model.OrderDate, 200, y, { align: "right" })
            .moveDown();

        var imageFile = path.join(process.cwd(), "./assets/images/Prescription_symbol.png");
        document
            .image(imageFile, 50, y, { width: 25, height: 25, align: 'left' });

        y = y + 10;

        document
            .fillColor('#444444')
            .fontSize(16)
            .font('Helvetica-Bold')
            .text(model.DocumentTitle, 0, y, { align: "center" })
            .moveDown();

        y = y + 30;

        //DrawLine(document, y);
        document
            .roundedRect(50, y, 500, 60, 1)
            .lineWidth(0.1)
            .fillOpacity(0.8)
            //.fillAndStroke("#EBE0FF", "#6541A5");
            .fill("#EBE0FF");

        y = y + 10;

        document
            .fillOpacity(1.0)
            .lineWidth(1)
            .fill("#444444");

        document
            .fillColor("#444444")
            .font('Helvetica')
            .fontSize(10);

        document
            .font('Helvetica-Bold')
            .text('Patient', 75, y, { align: "left" })
            .font('Helvetica')
            .text(model.PatientName, 175, y, { align: "left" })
            .moveDown();

        y = y + 15;
        document
            .font('Helvetica-Bold')
            .text('Patient ID', 75, y, { align: "left" })
            .font('Helvetica')
            .text(model.PatientDisplayId, 175, y, { align: "left" })
            .moveDown();

        y = y + 15;
        document
            .font('Helvetica-Bold')
            .text('Prescription ID', 75, y, { align: "left" })
            .font('Helvetica')
            .text(model.OrderDisplayId, 175, y, { align: "left" })
            .moveDown();

        return y;
    };

}
