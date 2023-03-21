import { WebhookRawDataDomainModel } from "../../../domain.types/webhook/rawdata/webhook.rawdata.domain.model";
import { WebhookRawDataDto } from "../../../domain.types/webhook/rawdata/webhook.rawdata.dto";

export interface IWebhookRawDataRepo {

    create(entity: WebhookRawDataDomainModel): Promise<WebhookRawDataDto>;
    
}
