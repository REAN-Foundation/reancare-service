import { injectable } from "tsyringe";
import { IChannelMetadataFormatter } from "../../../../../../database/repository.interfaces/users/user/task.task/channel.metadata.formatter.interface";
import { ChannelMetadata } from "../../../../../../domain.types/webhook/whatsapp.meta.types";

///////////////////////////////////////////////////////////////////////////////

@injectable()
export class DefaultMetadataFormatter implements IChannelMetadataFormatter {

    formatMetadata(
        channelMetadata: ChannelMetadata,
        channelConfig: any,
    ): any {
        const baseMetadata = {
            Type             : channelMetadata.Type,
            TemplateName     : channelMetadata.TemplateName,
            TemplateLanguage : channelMetadata.TemplateLanguage
        };

        return {
            ...baseMetadata,
            ChannelConfig : channelConfig
        };
    }
    
}
