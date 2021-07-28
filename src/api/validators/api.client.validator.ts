import express from 'express';
import { query, body, oneOf, validationResult, param } from 'express-validator';
import { Helper } from '../../common/helper';
import { ApiClientDomainModel, ApiClientVerificationDomainModel } from '../../data/domain.types/api.client.domain.types';

///////////////////////////////////////////////////////////////////////////////////////

export class ApiClientValidator {
    static getDomainModel = async (body: any): Promise<ApiClientDomainModel> => {

        var clientModel: ApiClientDomainModel = null;
        var obj = Helper.checkObj(body);
        if (obj == null) {
            return null;
        }

        clientModel = {
            ClientName: body.ClientName ?? null,
            ClientCode: null,
            ApiKey: null,
            Phone: body.Phone ?? null,
            Email: body.Email ?? null,
            Password: body.Password ?? null,
            ValidFrom: body.ValidFrom ?? null,
            ValidTill: body.ValidTill ?? null,
        };
        return clientModel;
    };

    static create = async (
        request: express.Request,
        response: express.Response
    ): Promise<ApiClientDomainModel> => {

        await body('ClientName').exists().trim().escape().isLength({ min: 3 }).run(request);
        await body('Phone').exists().trim().escape().isLength({ min: 10 }).run(request);
        await body('Email').exists().trim().escape().isEmail().isLength({ min: 3 }).run(request);
        await body('Password').exists().trim().escape().isLength({ min: 6 }).run(request);
        await body('ValidFrom').optional().trim().escape().isDate().run(request);
        await body('ValidTill').optional().trim().escape().isDate().run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
        return ApiClientValidator.getDomainModel(request.body);
    };

    static getOrRenewApiKey = async (
        request: express.Request,
        response: express.Response
    ): Promise<ApiClientVerificationDomainModel> => {

        var authHeader = request.headers['authorization'].toString();
        var tokens = authHeader.split(' ');
        if(tokens.length < 2) {
            throw new Error("Invalid authorization header.");
        }
        if(tokens[0].toLowerCase() !== 'basic'){
            throw new Error('Invalid auth header formatting. Should be basic authorization.');
        }
        var load = Helper.decodeFromBase64(tokens[1]);
        tokens = load.split(':');
        if(tokens.length < 2) {
            throw new Error("Basic auth formatting error.");
        }
        var clientCode = tokens[0].trim();
        var password = tokens[1].trim();

        await body('ValidFrom').optional().trim().escape().isDate().run(request);
        await body('ValidTill').optional().trim().escape().isDate().run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
        return ApiClientValidator.getVerificationDomainModel(request.body, clientCode, password);
    };

    static getVerificationDomainModel = async (body: any, clientCode: string, password: string): Promise<ApiClientVerificationDomainModel> => {
        var model: ApiClientVerificationDomainModel = null;
        var obj = Helper.checkObj(body);
        if (obj == null) {
            return null;
        }
        model = {
            ClientCode: clientCode,
            Password: password,
            ValidFrom: body.ValidFrom ?? null,
            ValidTill: body.ValidTill ?? null,
        };
        return model;
    };

    static getById = async (request: express.Request, response: express.Response): Promise<string> => {
        await param('id').trim().escape().isUUID().run(request);
        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
        return request.params.id;
    };

    static update = async (
        request: express.Request,
        response: express.Response
    ): Promise<ApiClientDomainModel> => {

        await body('ClientName').exists().isLength({ min: 1 }).trim().escape().run(request);
        await body('Phone').exists().trim().escape().isLength({ min: 10 }).run(request);
        await body('Email').exists().trim().escape().isEmail().isLength({ min: 3 }).run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
        return ApiClientValidator.getDomainModel(request.body);
    };
}
