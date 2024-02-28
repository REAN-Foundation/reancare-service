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

    sendTelegramMessage = async (telegramChatId: string, message: string, clientName: string,
        buttonsIds): Promise<boolean> => {
        await this.sendMessage(clientName, "telegram", telegramChatId, "inline_keyboard", null, message, buttonsIds);
        return true;
    };

    sendWhatsappWithReanBot = async (toPhone: string, message: any, provider:string,
        type:string, PlanCode:string, payload = null): Promise<boolean> => {

        let templateName = null;
        const channel = "whatsappMeta";

        toPhone = toPhone.replace(/\D/g, '');
        message = JSON.parse(message);
        if (message.Variables) {
            templateName = type;
            type = "template";

        }
        message = JSON.stringify(message);
        await this.sendMessage(provider, channel, toPhone, type, templateName, message, payload);

        return true;
    };

    private async sendMessage (provider, channel, toPhone, type, templateName, message, payload) {
        const reanBotBaseUrl = process.env.REANBOT_BACKEND_BASE_URL;
        const urlToken = process.env.REANBOT_WEBHOOK_CLIENT_URL_TOKEN;
        const client = await this.getClientByProvider(provider);
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
            userId       : toPhone,
            agentName    : "Reancare",
            provider     : provider,
            type         : type,
            templateName : templateName,
            message      : message,
            payload      : payload
        };
        Logger.instance().log(`Body of request: ${JSON.stringify(obj)}`);
        const resp1 = await needle('post', url, obj, options);
        if (resp1.statusCode !== 200) {
            Logger.instance().log(`Failed to send message to phone number: ${toPhone}`);
            return false;
        }
    }

    private getClientByProvider (provider) {
        const clientName = {
            "REAN_BW"        : "BLOOD_WARRIORS",
            "REAN"           : "MATERNAL_BOT",
            "KENYA_MATERNAL" : "KENYA_MATERNAL",
            "REAN_BOT"       : "REAN_BOT",
            "GMU"            : "GMU",
        };
        return clientName[provider] ?? provider;
    }
    
}
