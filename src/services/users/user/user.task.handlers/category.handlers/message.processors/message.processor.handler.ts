import { injectable } from "tsyringe";
import { NotificationChannel } from "../../../../../../domain.types/general/notification/notification.types";
import { IChannelMessageProcessor } from "../../../../../../database/repository.interfaces/users/user/task.task/channel.message.processor.interface";
import { WhatsAppMessageProcessor } from "./whatsapp.message.processor";
import { TelegramMessageProcessor } from "./telegram.message.processor";
import { DefaultMessageProcessor } from "./default.message.processor";
import { Injector } from "../../../../../../startup/injector";

///////////////////////////////////////////////////////////////////////////////

@injectable()
export class MessageProcessorFactory {

    private readonly _whatsappProcessor: WhatsAppMessageProcessor;

    private readonly _telegramProcessor: TelegramMessageProcessor;

    private readonly _defaultProcessor: DefaultMessageProcessor;

    constructor() {
        this._whatsappProcessor = Injector.Container.resolve(WhatsAppMessageProcessor);
        this._telegramProcessor = Injector.Container.resolve(TelegramMessageProcessor);
        this._defaultProcessor = Injector.Container.resolve(DefaultMessageProcessor);
    }

    getProcessor(channel: NotificationChannel): IChannelMessageProcessor {
        switch (channel) {
            case NotificationChannel.WhatsApp:
            case NotificationChannel.WhatsappWati:
            case NotificationChannel.WhatsappMeta:
                return this._whatsappProcessor;

            case NotificationChannel.Telegram:
                return this._telegramProcessor;

            default:
                return this._defaultProcessor;
        }
    }

}
