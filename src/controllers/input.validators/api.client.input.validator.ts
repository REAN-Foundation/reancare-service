import express from 'express';
import { query, body, oneOf, validationResult, param } from 'express-validator';
import { Helper } from '../../common/helper';
import { ApiClientDomainModel, ApiClientVerificationDomainModel } from '../../data/domain.types/api.client.domain.types';

///////////////////////////////////////////////////////////////////////////////////////

export class ApiClientInputValidator {
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
        };
        return clientModel;
    };

    static create = async (
        request: express.Request,
        response: express.Response
    ): Promise<ApiClientDomainModel> => {

        await body('ClientName').exists().isLength({ min: 1 }).trim().escape().run(request);
        await body('Phone').exists().trim().escape().isLength({ min: 10 }).run(request);
        await body('Email').exists().trim().escape().isEmail().isLength({ min: 5 }).run(request);
        await body('Password').exists().trim().escape().isLength({ min: 8 }).run(request);
        await body('ValidFrom').optional().trim().escape().isDate().run(request);
        await body('ValidTill').optional().trim().escape().isDate().run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
        return ApiClientInputValidator.getDomainModel(request);
    };

    static getOrRenewApiKey = async (
        request: express.Request,
        response: express.Response
    ): Promise<ApiClientVerificationDomainModel> => {

        await body('ClientCode').exists().trim().isLength({ min: 8, max: 8 }).escape().run(request);
        await body('Password').exists().trim().escape().run(request);
        await body('ValidFrom').optional().trim().escape().isDate().run(request);
        await body('ValidTill').optional().trim().escape().isDate().run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
        return ApiClientInputValidator.getVerificationDomainModel(request);
    };

    static getVerificationDomainModel = async (body: any): Promise<ApiClientVerificationDomainModel> => {
        var model: ApiClientVerificationDomainModel = null;
        var obj = Helper.checkObj(body);
        if (obj == null) {
            return null;
        }
        model = {
            ClientCode: body.ClientCode,
            Password: body.Password,
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
        await body('Email').exists().trim().escape().isEmail().isLength({ min: 5 }).run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
        return ApiClientInputValidator.getDomainModel(request.body);
    };
}
