import { injectable } from "tsyringe";
import { IChannelMetadataFormatter } from "../../../../../../database/repository.interfaces/users/user/task.task/channel.metadata.formatter.interface";
import { ChannelMetadata } from "../../../../../../domain.types/webhook/channel.metadata.types";

///////////////////////////////////////////////////////////////////////////////

@injectable()
export class DefaultMetadataFormatter implements IChannelMetadataFormatter {

    formatMetadata(
        channelMetadata: ChannelMetadata,
        channelConfig: any,
    ): any {
        return {
            Type          : channelMetadata.Type,
            ChannelConfig : channelConfig
        };
    }
    
}
