import { ChannelMetadata } from "../../../../../domain.types/webhook/whatsapp.meta.types";
import { NotificationChannel } from "../../../../../domain.types/general/notification/notification.types";

///////////////////////////////////////////////////////////////////////////////

export interface IChannelMetadataFormatter {

    formatMetadata(
        channelMetadata: ChannelMetadata,
        channelConfig: any,
        channel: NotificationChannel
    ): any;
}
