import { IEmailService } from "../email.service.interface";
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import nodemailer from 'nodemailer';
import { EmailDetails } from "../email.details";
import { Logger } from "../../../../common/logger";

////////////////////////////////////////////////////////////////////

export class SMTPEmailService implements IEmailService {

    _emailFrom = process.env.EMAIL_FROM;

    _transporter: any = null;

    _options: SMTPTransport.Options = {
        host   : process.env.SMTP_HOST,
        port   : parseInt(process.env.SMTP_PORT),
        secure : false,
        auth   : {
            user : process.env.SMTP_USER,
            pass : process.env.SMTP_PASSWORD,
        },
        tls : {
            // do not fail on invalid certs
            rejectUnauthorized : false,
        },
    };

    constructor() {
        this._transporter = nodemailer.createTransport(this._options);
    }

    sendEmail = async (emailDetails: EmailDetails, textBody: boolean): Promise<boolean> => {
        try {
            const mailOptions = {
                from    : this._emailFrom,
                to      : emailDetails.EmailTo,
                subject : emailDetails.Subject,
                //ses     : { Tags: [] },
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
