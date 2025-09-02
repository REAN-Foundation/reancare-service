import express from 'express';
import { TenantSearchFilters } from '../../../domain.types/tenant/tenant.search.types';
import { TenantDomainModel, TenantSchemaDomainModel, TenantSecretDomainModel } from '../../../domain.types/tenant/tenant.domain.model';
import { BaseValidator, Where } from '../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class TenantValidator extends BaseValidator {

    constructor() {
        super();
    }

    createOrUpdate = async (request: express.Request, update = false): Promise<TenantDomainModel> => {

        const nameRequired = update ? false : true;
        await this.validateString(request, 'Name', Where.Body, nameRequired, false);
        await this.validateString(request, 'Description', Where.Body, false, true);
        await this.validateString(request, 'Code', Where.Body, false, true);
        await this.validateString(request, 'Phone', Where.Body, false, false);
        await this.validateString(request, 'Email', Where.Body, false, false);
        await this.validateString(request, 'UserName', Where.Body, false, false);
        await this.validateString(request, 'Password', Where.Body, false, false);

        this.validateRequest(request);

        const body = request.body;

        const model: TenantDomainModel = {
            Name        : body.Name ?? null,
            Description : body.Description ?? null,
            Code        : body.Code ?? null,
            Phone       : body.Phone ?? null,
            Email       : body.Email ?? null,
            UserName    : body.UserName ?? null,
            Password    : body.Password ?? null,
        };
        if (update) {
            model.id = await this.getParamUuid(request, 'id');
        }
        return model;
    };

    createBotSchema = async (request: express.Request): Promise<TenantSchemaDomainModel> => {
        await this.validateString(request, 'SchemaName', Where.Body, true, false, false, 1);
        await this.validateString(request, 'Environment', Where.Body, true, false, false, 1);

        this.validateRequest(request);
        const body = request.body;

        const model: TenantSchemaDomainModel = {
            SchemaName  : body.SchemaName,
            Environment : body.Environment,
        };
        return model;
    };

    createBotSecret = async (request: express.Request): Promise<TenantSecretDomainModel> => {
        await this.validateString(request, 'SecretName', Where.Body, true, false);
        await this.validateString(request, 'Environment', Where.Body, true, false);
        await this.validateString(request, 'TelegramBotToken', Where.Body, true, true);
        await this.validateString(request, 'TelegramMediaPathUrl', Where.Body, true, true);
        await this.validateString(request, 'WebhookTelegramClientUrlToken', Where.Body, true, true);
        await this.validateString(request, 'WebhookWhatsappClientHeaderToken', Where.Body, true, true);
        await this.validateString(request, 'WebhookWhatsappClientUrlToken', Where.Body, true, true);
        await this.validateString(request, 'SlackTokenFeedback', Where.Body, true, true);
        await this.validateString(request, 'WebhookClickupClientUrlToken', Where.Body, true, true);
        await this.validateString(request, 'WebhookMockChannelClientUrlToken', Where.Body, true, true);
        await this.validateString(request, 'DbPassword', Where.Body, true, true);
        await this.validateString(request, 'DbUserName', Where.Body, true, true);
        await this.validateString(request, 'DbHost', Where.Body, true, true);
        await this.validateString(request, 'ClickupAuthentication', Where.Body, true, true);
        await this.validateString(request, 'ReancareApiKey', Where.Body, true, true);
        await this.validateString(request, 'NlpService', Where.Body, true, true);
        await this.validateString(request, 'CustomMlModelUrl', Where.Body, true, true);
        // await this.validateObject(request, 'SecretValue', Where.Body, true, false);

        this.validateRequest(request);
        const body = request.body;

        const model: TenantSecretDomainModel = {
            SecretName  : body.SecretName,
            Environment : body.Environment,
            SecretValue : {
                TelegramBotToken                 : body.TelegramBotToken ?? null,
                TelegramMediaPathUrl             : body.TelegramMediaPathUrl ?? null,
                WebhookTelegramClientUrlToken    : body.WebhookTelegramClientUrlToken ?? null,
                WebhookWhatsappClientHeaderToken : body.WebhookWhatsappClientHeaderToken ?? null,
                WebhookWhatsappClientUrlToken    : body.WebhookWhatsappClientUrlToken ?? null,
                SlackTokenFeedback               : body.SlackTokenFeedback ?? null,
                WebhookClickupClientUrlToken     : body.WebhookClickupClientUrlToken ?? null,
                WebhookMockChannelClientUrlToken : body.WebhookMockChannelClientUrlToken ?? null,
                DbPassword                       : body.DbPassword ?? null,
                DbUserName                       : body.DbUserName ?? null,
                DbHost                           : body.DbHost ?? null,
                ClickupAuthentication            : body.ClickupAuthentication ?? null,
                ReancareApiKey                   : body.ReancareApiKey ?? null,
                NlpService                       : body.NlpService ?? null,
                CustomMlModelUrl                 : body.CustomMlModelUrl ?? null
            }
        };
        return model;
    };

    search = async (request: express.Request): Promise<TenantSearchFilters> => {

        await this.validateString(request, 'name', Where.Query, false, false);
        await this.validateString(request, 'code', Where.Query, false, false);
        await this.validateString(request, 'phone', Where.Query, false, false);
        await this.validateString(request, 'email', Where.Query, false, false);
        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        const filters: TenantSearchFilters = {
            Name  : request.query.name as string ?? null,
            Code  : request.query.code as string  ?? null,
            Phone : request.query.phone as string  ?? null,
            Email : request.query.email as string  ?? null,
        };
        return this.updateBaseSearchFilters(request, filters);
    };

}
