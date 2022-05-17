import express from 'express';
import { Helper } from '../../common/helper';
import { ApiClientDomainModel, ApiClientVerificationDomainModel } from '../../domain.types/api.client/api.client.domain.model';
import { BaseValidator, Where } from './base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class ApiClientValidator extends BaseValidator{

    constructor() {
        super();
    }

    getDomainModel = async (request: express.Request): Promise<ApiClientDomainModel> => {

        //let clientModel: ApiClientDomainModel = null;
        
        const clientModel: ApiClientDomainModel = {
        //clientModel = {
            ClientName   : request.body.ClientName ?? null,
            ClientCode   : request.body.ClientCode ?? null,
            IsPrivileged : request.body.IsPrivileged ?? false,
            ApiKey       : request.body.ApiKey ?? null,
            Phone        : request.body.Phone ?? null,
            Email        : request.body.Email ?? null,
            Password     : request.body.Password ?? null,
            ValidFrom    : request.body.ValidFrom ?? null,
            ValidTill    : request.body.ValidTill ?? null,
        };
        return clientModel;
    };

    create = async (request: express.Request): Promise<ApiClientDomainModel> => {

        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    private async validateCreateBody(request) {

        await this.validateString(request, 'ClientName', Where.Body, true, false);
        await this.validateString(request, 'Phone', Where.Body, true, true);
        await this.validateString(request, 'Email', Where.Body, true, true);
        await this.validateString(request, 'Password', Where.Body, true, true);
        await this.validateDate(request, 'ValidFrom', Where.Body, false, false);
        await this.validateDate(request, 'ValidTill', Where.Body, false, false);

        this.validateRequest(request);
    }

    getOrRenewApiKey = async (request: express.Request): Promise<ApiClientVerificationDomainModel> => {

        const authHeader = request.headers['authorization'].toString();
        let tokens = authHeader.split(' ');
        if (tokens.length < 2) {
            throw new Error("Invalid authorization header.");
        }
        if (tokens[0].toLowerCase() !== 'basic') {
            throw new Error('Invalid auth header formatting. Should be basic authorization.');
        }
        const load = Helper.decodeFromBase64(tokens[1]);
        tokens = load.split(':');
        if (tokens.length < 2) {
            throw new Error("Basic auth formatting error.");
        }
        const clientCode = tokens[0].trim();
        const password = tokens[1].trim();

        await this.validateDate(request, 'ValidFrom', Where.Body, false, false);
        await this.validateDate(request, 'ValidTill', Where.Body, false, false);

        this.validateRequest(request);
        
        return ApiClientValidator.getVerificationDomainModel(request.body, clientCode, password);
    };

    static getVerificationDomainModel = async (body: any, clientCode: string, password: string):
        Promise<ApiClientVerificationDomainModel> => {

        let model: ApiClientVerificationDomainModel = null;
        model = {
            ClientCode : clientCode,
            Password   : password,
            ValidFrom  : body.ValidFrom ?? null,
            ValidTill  : body.ValidTill ?? null,
        };

        return model;
    };

    getById = async (request: express.Request): Promise<string> => {

        await this.validateString(request, 'id', Where.Body, true, false);
        
        this.validateRequest(request);
        
        return request.params.id;
    };

    update = async (request: express.Request): Promise<ApiClientDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        (await domainModel).id = await this.getParamUuid(request, 'id');

        return domainModel;
    };

    private async validateUpdateBody(request) {

        await this.validateString(request, 'ClientName', Where.Body, false, false);
        await this.validateString(request, 'Phone', Where.Body, true, true);
        await this.validateString(request, 'Email', Where.Body, true, true);
        await this.validateString(request, 'PatientUserId', Where.Body, false, false);

        this.validateRequest(request);
    }

}
