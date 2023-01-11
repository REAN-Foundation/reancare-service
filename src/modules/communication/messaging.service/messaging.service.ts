import { inject, injectable } from "tsyringe";
import { IMessagingService } from "./messaging.service.interface";
import needle = require('needle');
import { Logger } from "../../../common/logger";

////////////////////////////////////////////////////////////////////////

@injectable()
export class MessagingService {

    constructor(@inject('IMessagingService') private _service: IMessagingService) {}

    init = (): boolean => {
        return this._service.init();
    };

    sendSMS = async (toPhone: string, message: string): Promise<boolean> => {
        return await this._service.sendSMS(toPhone, message);
    };

    sendWhatsappMessage = async (toPhone: string, message: string): Promise<boolean> => {
        return await this._service.sendWhatsappMessage(toPhone, message);
    };

    sendWhatsappWithReanBot = async (toPhone: string, message: string, provider:string,
        Type:string, PlanCode:string): Promise<boolean> => {

        const reanBotBaseUrl = process.env.REANBOT_BACKEND_BASE_URL;
        const urlToken = process.env.REANBOT_WEBHOOK_CLIENT_URL_TOKEN;

        if (provider === "REAN_BW") {
            const countryCode = toPhone.split("-")[0];
            const num = toPhone.split("-")[1];
            const code =  countryCode.substring(1);
            toPhone = code.concat(num);
        }
        let payload = null;
        if (Type === 'interactive-buttons' && PlanCode === 'Patient-Reminders') {
            payload = ["Yes", "Raise_Request_Yes", "No", "Raise_Request_No"];
        } else if (Type === 'interactive-buttons' && PlanCode === 'Donor-Reminders') {
            payload = ["Yes", "Generate_Certificate", "No", "Notify_Volunteer"];
        } else if (Type === 'interactive-buttons' && PlanCode === 'Volunteer-Reminders') {
            payload = ["Send a Reminder", "Donation_Request_Yes", "Send to OneTimeDonor", "Send_OneTimeDonor"];
        }
        const client = provider === "REAN_BW" ? "BLOOD_WARRIORS" : "MATERNAL_BOT";
        const channel = provider === "REAN_BW" ? "whatsappMeta" : "telegram";
        
        const headers = {
            'authentication' : process.env.REANBOT_WEBHOOK_CLIENT_HEADER_TOKEN,
        };
        const options = {
            headers : headers
        };
        
        const url = `${reanBotBaseUrl}${client}/${channel}/${urlToken}/send`;
        Logger.instance().log(`URL: ${url}`);
        Logger.instance().log(`Phone: ${toPhone}`);
        const obj = {
            userId    : toPhone,
            agentName : "ReanCare",
            type      : Type,
            message   : message,
            payload   : payload
        };
        
        const resp1 = await needle('post', url, obj, options);
        if (resp1.statusCode !== 200) {
            Logger.instance().log(`Failed to send message to phone number: ${toPhone}`);
            return false;
        }
        return true;
    };
    
}
