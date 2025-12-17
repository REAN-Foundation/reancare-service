import { injectable } from "tsyringe";
import { Logger } from "../../../../../../common/logger";
import { ApiError } from "../../../../../../common/api.error";
import { ChannelMetadata } from "../../../../../../domain.types/webhook/channel.metadata.types";
import { NotificationChannel } from "../../../../../../domain.types/general/notification/notification.types";
import { IChannelMetadataFormatter } from "../../../../../../database/repository.interfaces/users/user/task.task/channel.metadata.formatter.interface";
import { WhatsAppMetadataFormatter } from "./whatsapp.metadata.formatter";
import { TelegramMetadataFormatter } from "./telegram.metadata.formatter";
import { DefaultMetadataFormatter } from "./default.metadata.formatter";
import { Injector } from "../../../../../../startup/injector";

///////////////////////////////////////////////////////////////////////////////

@injectable()
export class MetadataHandler {

    private readonly _whatsappFormatter: WhatsAppMetadataFormatter;

    private readonly _telegramFormatter: TelegramMetadataFormatter;

    private readonly _defaultFormatter: DefaultMetadataFormatter;

    constructor() {
        this._whatsappFormatter = Injector.Container.resolve(WhatsAppMetadataFormatter);
        this._telegramFormatter = Injector.Container.resolve(TelegramMetadataFormatter);
        this._defaultFormatter = Injector.Container.resolve(DefaultMetadataFormatter);
    }

    private getFormatter(channel: NotificationChannel): IChannelMetadataFormatter {
        switch (channel) {
            case NotificationChannel.WhatsApp:
            case NotificationChannel.WhatsappWati:
            case NotificationChannel.WhatsappMeta:
                return this._whatsappFormatter;

            case NotificationChannel.Telegram:
                return this._telegramFormatter;

            default:
                return this._defaultFormatter;
        }
    }

    parseChannelMetadata(metadataString: string): ChannelMetadata | null {
        try {
            if (!metadataString) {
                return null;
            }
            const metadata = JSON.parse(metadataString) as ChannelMetadata;
            return metadata;
        } catch (error) {
            Logger.instance().log(`Error parsing channel metadata: ${JSON.stringify(error.message, null, 2)}`);
            return null;
        }
    }

    hasChannelConfiguration(channels: ChannelMetadata['Channels'], channel: NotificationChannel): boolean {
        if (!channels) {
            return false;
        }
        return channels[channel] !== undefined;
    }

    getChannelConfiguration(channelMetadata: ChannelMetadata, channel: NotificationChannel): any {
        return channelMetadata.Channels?.[channel] || null;
    }

    validateChannelMetadata(channelMetadata: ChannelMetadata): boolean {
        if (!channelMetadata || !channelMetadata.Type) {
            Logger.instance().log(`Channel metadata is not valid: ${JSON.stringify(channelMetadata)}`);
            throw new ApiError(400, 'Channel metadata is not valid. Type is required.');
        }
        return true;
    }

    buildChannelFormMetadata(
        channelMetadata: ChannelMetadata,
        channelConfig: any,
        channel: NotificationChannel
    ): any {
        const formatter = this.getFormatter(channel);
        return formatter.formatMetadata(channelMetadata, channelConfig, channel);
    }

}
