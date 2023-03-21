import { inject, injectable } from "tsyringe";
import { IWebhookRawDataRepo } from "../../database/repository.interfaces/webhook/webhook.rawdata.repo.interface";
import { WebhookRawDataDomainModel } from "../../domain.types/webhook/rawdata/webhook.rawdata.domain.model";

@injectable()


export class WebhookRawDataService {

    constructor(
        @inject('IWebhookRawDataRepo') private _webhookRawDataRepo: IWebhookRawDataRepo
    ) {}

    create = async (webhookRawDataDomainModel: WebhookRawDataDomainModel) => {
        return await this._webhookRawDataRepo.create(webhookRawDataDomainModel);
    };

}
