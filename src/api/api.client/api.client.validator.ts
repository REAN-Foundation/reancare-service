import express from 'express';
import { body, validationResult, param, query } from 'express-validator';
import { ApiClientSearchFilters } from '../../domain.types/api.client/api.client.search.types';
import { Helper } from '../../common/helper';
import { ApiClientDomainModel, ApiClientVerificationDomainModel } from '../../domain.types/api.client/api.client.domain.model';

///////////////////////////////////////////////////////////////////////////////////////

export class ApiClientValidator {

    static getDomainModel = async (body: any): Promise<ApiClientDomainModel> => {

        let clientModel: ApiClientDomainModel = null;

        clientModel = {
            ClientName   : body.ClientName ?? null,
            ClientCode   : null,
            IsPrivileged : body.IsPrivileged ?? false,
            ApiKey       : null,
            Phone        : body.Phone ?? null,
            Email        : body.Email ?? null,
            Password     : body.Password ?? null,
            ValidFrom    : body.ValidFrom ?? null,
            ValidTill    : body.ValidTill ?? null,
        };
        return clientModel;
    };

    static create = async (
        request: express.Request
    ): Promise<ApiClientDomainModel> => {

        await body('ClientName').exists()
            .trim()
            .escape()
            .isLength({ min: 3 })
            .run(request);
        await body('Phone').exists()
            .trim()
            .escape()
            .isLength({ min: 10 })
            .run(request);
        await body('Email').exists()
            .trim()
            .escape()
            .isEmail()
            .isLength({ min: 3 })
            .run(request);
        await body('Password').exists()
            .trim()
            .escape()
            .isLength({ min: 6 })
            .run(request);
        await body('ValidFrom').optional()
            .trim()
            .escape()
            .isDate()
            .run(request);
        await body('ValidTill').optional()
            .trim()
            .escape()
            .isDate()
            .run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
        return ApiClientValidator.getDomainModel(request.body);
    };

    static search = async (
        request: express.Request
    ): Promise<ApiClientSearchFilters> => {

        await query('clientName').optional()
            .trim()
            .escape()
            .run(request);

        await query('clientCode').optional()
            .trim()
            .escape()
            .run(request);

        await query('phone').optional()
            .trim()
            .escape()
            .run(request);

        await query('email').optional()
            .trim()
            .escape()
            .run(request);

        await query('validFrom')
            .optional()
            .isDate()
            .trim()
            .escape()
            .run(request);

        await query('validTill')
            .optional()
            .isDate()
            .trim()
            .escape()
            .run(request);

        await query('orderBy').optional()
            .trim()
            .escape()
            .run(request);

        await query('order').optional()
            .trim()
            .escape()
            .run(request);

        await query('pageIndex')
            .optional()
            .isInt()
            .trim()
            .escape()
            .run(request);

        await query('itemsPerPage')
            .optional()
            .isInt()
            .trim()
            .escape()
            .run(request);

        await query('fullDetails').optional()
            .isBoolean()
            .run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }

        return ApiClientValidator.getFilter(request);
    };

    static getOrRenewApiKey = async (
        request: express.Request
    ): Promise<ApiClientVerificationDomainModel> => {

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

        await body('ValidFrom').optional()
            .trim()
            .escape()
            .isDate()
            .run(request);
        await body('ValidTill').optional()
            .trim()
            .escape()
            .isDate()
            .run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
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

    static getById = async (request: express.Request): Promise<string> => {

        await param('id').trim()
            .escape()
            .isUUID()
            .run(request);

        const result = validationResult(request);

        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }

        return request.params.id;
    };

    static update = async (
        request: express.Request
    ): Promise<ApiClientDomainModel> => {

        await body('ClientName').optional()
            .isLength({ min: 1 })
            .trim()
            .escape()
            .run(request);
        await body('Phone').optional()
            .trim()
            .escape()
            .isLength({ min: 10 })
            .run(request);
        await body('Password').optional()
            .trim()
            .escape()
            .isLength({ min: 6 })
            .run(request);
        await body('Email').optional()
            .trim()
            .escape()
            .isEmail()
            .isLength({ min: 3 })
            .run(request);
        await body('Password').optional()
            .trim()
            .escape()
            .isLength({ min: 6 })
            .run(request);
        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
        return ApiClientValidator.getDomainModel(request.body);
    };

    private static getFilter(request): ApiClientSearchFilters {

        const pageIndex =
            request.query.pageIndex !== 'undefined'
                ? parseInt(request.query.pageIndex as string, 10)
                : 0;

        const itemsPerPage =
            request.query.itemsPerPage !== 'undefined'
                ? parseInt(request.query.itemsPerPage as string, 10)
                : 25;

        const filters: ApiClientSearchFilters = {
            ClientName   : request.query.clientName ?? null,
            ClientCode   : request.query.clientCode ?? null,
            Phone        : request.query.phone ?? null,
            Email        : request.query.email ?? null,
            ValidFrom    : request.query.validFrom ?? null,
            ValidTill    : request.query.validTill ?? null,
            OrderBy      : request.query.orderBy ?? 'CreatedAt',
            Order        : request.query.order ?? 'descending',
            PageIndex    : pageIndex,
            ItemsPerPage : itemsPerPage,
        };

        return filters;
    }

}
