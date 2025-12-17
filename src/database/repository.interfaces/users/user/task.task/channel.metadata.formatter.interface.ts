import { ChannelMetadata } from "../../../../../domain.types/webhook/channel.metadata.types";
import { NotificationChannel } from "../../../../../domain.types/general/notification/notification.types";

///////////////////////////////////////////////////////////////////////////////

export interface IChannelMetadataFormatter {

    formatMetadata(
        channelMetadata: ChannelMetadata,
        channelConfig: any,
        channel: NotificationChannel
    ): any;
}
