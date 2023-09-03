import path from "path";
import fs from "fs";
import { IEmailService } from "./email.service.interface";
import { SMTPEmailService } from "./providers/smtp.email.service";
import { EmailDetails } from "./email.details";

export class EmailService {

    private _emailService: IEmailService;

    constructor() {
        this._emailService = new SMTPEmailService(); //Hardcoded for now
    }

    sendEmail = async (emailDetails: EmailDetails, textBody: boolean): Promise<boolean> => {
        return await this._emailService.sendEmail(emailDetails, textBody);
    };

    getTemplate = async (templateName: string): Promise<string> => {
        const cwd = process.cwd();
        const filePath = path.join(cwd, 'assets/email.templates/', templateName);
        if (!fs.existsSync(filePath)) {
            throw new Error(`Template ${templateName} does not exist`);
        }
        const body = fs.readFileSync(filePath, 'utf8');
        return body;
    };

}
