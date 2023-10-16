import { EmailDetails } from "./email.details";

export interface IEmailService {
    sendEmail(emailDetails: EmailDetails, textBody: boolean): Promise<boolean>;
}
