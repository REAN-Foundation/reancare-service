import { injectable } from "tsyringe";
import { Logger } from "../../../../../common/logger";
import { ApiError } from "../../../../../common/api.error";
import { ChannelMetadata } from "../../../../../domain.types/webhook/channel.metadata.types";
import { NotificationChannel } from "../../../../../domain.types/general/notification/notification.types";

///////////////////////////////////////////////////////////////////////////////

@injectable()
export class MetadataHandler {

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
        channelConfig: any
    ): any {
        return {
            Type          : channelMetadata.Type,
            ChannelConfig : channelConfig
        };
    }

}
