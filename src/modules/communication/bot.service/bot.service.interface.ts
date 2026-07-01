import { BotRequestDomainModel } from "../../../domain.types/miscellaneous/bot.request.types";

export interface IBotService {
   
    sendWhatsappMessage(model: BotRequestDomainModel): Promise<void>;

    sendTelegramMessage(model: BotRequestDomainModel): Promise<void>;
    
}
