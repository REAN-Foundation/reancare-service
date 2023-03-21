import { Logger } from '../../../../../common/logger';
import { ApiError } from '../../../../../common/api.error';
import { WebhookRawDataDomainModel } from '../../../../../domain.types/webhook/rawdata/webhook.rawdata.domain.model';
import { WebhookRawDataDto } from '../../../../../domain.types/webhook/rawdata/webhook.rawdata.dto';
import WebhookRawData from '../../models/webhook/webhook.rawdata.model';
import { IWebhookRawDataRepo } from '../../../../../database/repository.interfaces/webhook/webhook.rawdata.repo.interface';

///////////////////////////////////////////////////////////////////////

export class WebhookRawDataRepo implements IWebhookRawDataRepo {

    create = async (webhookRawDataDomainModel: WebhookRawDataDomainModel): Promise<WebhookRawDataDto> => {
        try {
            const entity = {
                Provider : webhookRawDataDomainModel.Provider,
                Type     : webhookRawDataDomainModel.Type,
                RawData  : webhookRawDataDomainModel.RawData
            };
            const rawData = await WebhookRawData.create(entity);
            //const dto = RoleMapper.toDto(role);
            return rawData;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
