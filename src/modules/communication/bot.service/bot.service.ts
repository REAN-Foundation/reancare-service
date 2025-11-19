import { injectable } from "tsyringe";
import { Logger } from "../../../common/logger";
import { BotRequestDomainModel } from "../../../domain.types/miscellaneous/bot,request.types";
import axios from "axios";
import { IBotService } from "./bot.service.interface";

@injectable()
export class BotService implements IBotService {

   sendWhatsappMessage = async (model: BotRequestDomainModel): Promise<void> => {
       return await this.sendMessage(model);
   };

    sendTelegramMessage = async (model: BotRequestDomainModel): Promise<void> => {
        return await this.sendMessage(model);
    };

    private async sendMessage(model: BotRequestDomainModel): Promise<void> {
        try {
            Logger.instance().log(`Sending message to bot: ${JSON.stringify(model)}`);
            const headers = {
                'Content-Type'    : 'application/json',
                Accept            : '*/*',
                'Cache-Control'   : 'no-cache',
                'Accept-Encoding' : 'gzip, deflate, br',
                Connection        : 'keep-alive',
            };

            var url = process.env.REANBOT_BACKEND_BASE_URL + '/' + model.ClientName + '/' + model.Channel + '/' + process.env.REANBOT_WEBHOOK_CLIENT_URL_TOKEN + '/send';
            Logger.instance().log(`URL: ${url}`);
            var body = {
                type         : model.Type,
                message      : model.Message,
                userId       : model.PhoneNumber,
                agentName    : model.AgentName,
                provider     : model.Provider,
                templateName : model.TemplateName,
                payload      : model.Payload ?? {}
            };
            var response = await axios.post(url, body, { headers });
            if (response.status === 201 || response.status === 200) {
                Logger.instance().log(`Successfully sent message to bot! ${body?.userId}`);
            } else {
                Logger.instance().error('Unable to send message to bot!', response.status, response.data);
            }
        } catch (error) {
            Logger.instance().log(`Error sending message to bot: ${error}`);
        }
    }

}
