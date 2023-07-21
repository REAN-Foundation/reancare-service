import { IEmailService } from "../email.service.interface";
import { EmailDetails } from "../email.details";
import nodemailer from 'nodemailer/lib/nodemailer';
import { Logger } from "../../../../common/logger";
import * as aws from "@aws-sdk/client-ses";

////////////////////////////////////////////////////////////////////

export class AwsSESEmailService implements IEmailService {

    _emailFrom = process.env.EMAIL_FROM;

    _transporter: any = null;

    _ses = new aws.SES({
        apiVersion  : '2010-12-01',
        region      : process.env.AWS_REGION,
        credentials : {
            accessKeyId     : process.env.STORAGE_BUCKET_ACCESS_KEY_ID,
            secretAccessKey : process.env.STORAGE_BUCKET_ACCESS_KEY_SECRET
        },
    });

    constructor() {
        this._transporter = nodemailer.createTransport({
            SES : { ses: this._ses, aws },
        });
    }

    sendEmail = async (emailDetails: EmailDetails, textBody: boolean): Promise<boolean> => {
        try {
            const mailOptions = {
                from    : this._emailFrom,
                to      : emailDetails.EmailTo,
                subject : emailDetails.Subject,
                ses     : { Tags: [] },
            };
            if (textBody) {
                mailOptions['text'] = emailDetails.Body;
            }
            else {
                mailOptions['html'] = emailDetails.Body;
            }
            const info = await this._transporter.sendMail(mailOptions);
            Logger.instance().log('Email sent: ' + info.messageId);
            return info.messageId ?? false;
        }
        catch (error) {
            Logger.instance().log('Error occurred while sending email: ' + error.message);
            throw new Error('Error occurred while sending email: ' + error.message);
        }
    };

}
