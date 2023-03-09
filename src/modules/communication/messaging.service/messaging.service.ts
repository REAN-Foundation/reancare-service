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

    sendWhatsappWithReanBot = async (toPhone: string, message: any, provider:string,
        type:string, PlanCode:string, buttonIds = null): Promise<boolean> => {

        const reanBotBaseUrl = process.env.REANBOT_BACKEND_BASE_URL;
        const urlToken = process.env.REANBOT_WEBHOOK_CLIENT_URL_TOKEN;
        let templateName = null;

        const countryCode = toPhone.split("-")[0];
        const num = toPhone.split("-")[1];
        const code =  countryCode.substring(1);
        toPhone = code.concat(num);
        message = JSON.parse(message);
        if (message.Variables) {
            templateName = type;
            type = "template";
            buttonIds = message.ButtonIds ? message.ButtonIds : null;
            message = JSON.stringify(message);

        }
        const client = provider === "REAN_BW" ? "BLOOD_WARRIORS" : "MATERNAL_BOT";
        const headers = {
            'authentication' : process.env.REANBOT_WEBHOOK_CLIENT_HEADER_TOKEN,
        };
        const options = {
            headers : headers
        };
        
        const url = `${reanBotBaseUrl}${client}/whatsappMeta/${urlToken}/send`;
        Logger.instance().log(`URL: ${url}`);
        Logger.instance().log(`Phone: ${toPhone}`);
        const obj = {
            userId       : toPhone,
            agentName    : "ReanCare",
            provider     : provider,
            type         : type,
            templateName : templateName,
            message      : message,
            payload      : buttonIds
        };
        
        const resp1 = await needle('post', url, obj, options);
        if (resp1.statusCode !== 200) {
            Logger.instance().log(`Failed to send message to phone number: ${toPhone}`);
            return false;
        }
        return true;
    };
    
}
