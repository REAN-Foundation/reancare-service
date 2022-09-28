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

    sendWhatsappWithReanBot = async (toPhone: string, message: string): Promise<boolean> => {

        const reanBotBaseUrl = process.env.REANBOT_BACKEND_BASE_URL;
        const urlToken = process.env.REANBOT_WEBHOOK_CLIENT_URL_TOKEN;

        const countryCode = toPhone.split("-")[0];
        const num = toPhone.split("-")[1];
        const code =  countryCode.substring(1);
        const headers = {
            'authentication' : process.env.REANBOT_WEBHOOK_CLIENT_HEADER_TOKEN,
        };
        const options = {
            headers : headers
        };
        
        const url = `${reanBotBaseUrl}MATERNAL_BOT/whatsappMeta/${urlToken}/send`;
        Logger.instance().log(`: ${url}`);
        const obj = {
            userId    : code.concat(num),
            agentName : "ReanCare",
            type      : "text",
            message   : message
        };
        
        const resp1 = await needle('post', url, obj, options);
        if (resp1.statusCode !== 200) {
            throw new Error(`Failed to send message to phone number: ${toPhone}`);
        }
        return true;
    };
    
}
