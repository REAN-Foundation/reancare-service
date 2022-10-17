import express from 'express';
import { BaseValidator, Where } from '../../../base.validator';
import { ThirdpartyApiCredentialsDomainModel } from '../../../../domain.types/thirdparty/thirdparty.api.credentials';

///////////////////////////////////////////////////////////////////////////////////////

export class FormsValidator extends BaseValidator {

    constructor() {
        super();
    }

    connect = async (request: express.Request): Promise<ThirdpartyApiCredentialsDomainModel> => {

        await this.validateString(request, 'providerCode', Where.Param, true, false);
        await this.validateString(request, 'BaseUrl', Where.Body, false, false);
        await this.validateString(request, 'SecondaryUrl', Where.Body, false, false);
        await this.validateString(request, 'Token', Where.Body, false, false, false, 3);
        await this.validateDateString(request, 'ValidTill', Where.Body, false, false);

        this.validateRequest(request);

        const connectionModel: ThirdpartyApiCredentialsDomainModel = {
            Provider     : request.params.providerCode,
            BaseUrl      : request.body.BaseUrl ?? null,
            SecondaryUrl : request.body.SecondaryUrl ?? null,
            Token        : request.body.Token ?? null,
            ValidTill    : request.body.ValidTill ?? null
        };

        return connectionModel;
    };

}
