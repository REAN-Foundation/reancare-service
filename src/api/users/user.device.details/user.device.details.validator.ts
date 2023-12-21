import express from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { ResponseHandler } from '../../../common/response.handler';
import { Helper } from '../../../common/helper';
import { UserDeviceDetailsDomainModel } from '../../../domain.types/users/user.device.details/user.device.domain.model';
import { UserDeviceDetailsSearchFilters } from '../../../domain.types/users/user.device.details/user.device.search.types';

///////////////////////////////////////////////////////////////////////////////////////

export class UserDeviceDetailsValidator {

    static getDomainModel = (request: express.Request): UserDeviceDetailsDomainModel => {

        const UserDeviceDetailsModel: UserDeviceDetailsDomainModel = {
            Token       : request.body.Token,
            UserId      : request.body.UserId,
            DeviceName  : request.body.DeviceName,
            OSType      : request.body.OSType,
            OSVersion   : request.body.OSVersion,
            AppName     : request.body.AppName,
            AppVersion  : request.body.AppVersion,
            ChangeCount : request.body.ChangeCount,
        };

        return UserDeviceDetailsModel;
    };

    static create = async (request: express.Request): Promise<UserDeviceDetailsDomainModel> => {
        await UserDeviceDetailsValidator.validateBody(request);
        return UserDeviceDetailsValidator.getDomainModel(request);
    };

    static getById = async (request: express.Request): Promise<string> => {
        return await UserDeviceDetailsValidator.getParamId(request);
    };

    static delete = async (request: express.Request): Promise<string> => {
        return await UserDeviceDetailsValidator.getParamId(request);
    };

    static search = async (request: express.Request): Promise<UserDeviceDetailsSearchFilters> => {

        await query('userId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await query('token').optional()
            .trim()
            .escape()
            .run(request);

        await query('deviceName').optional()
            .trim()
            .escape()
            .run(request);

        await query('oSType').optional()
            .trim()
            .escape()
            .run(request);

        await query('oSVersion').optional()
            .trim()
            .escape()
            .run(request);

        await query('appName').optional()
            .trim()
            .escape()
            .run(request);

        await query('appVersion').optional()
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

        await query('pageIndex').optional()
            .trim()
            .escape()
            .isInt()
            .run(request);

        await query('itemsPerPage').optional()
            .trim()
            .escape()
            .isInt()
            .run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }

        return UserDeviceDetailsValidator.getFilter(request);
    };

    static update = async (request: express.Request): Promise<UserDeviceDetailsDomainModel> => {

        const id = await UserDeviceDetailsValidator.getParamId(request);
        await UserDeviceDetailsValidator.validateBody(request);

        const domainModel = UserDeviceDetailsValidator.getDomainModel(request);
        domainModel.id = id;

        return domainModel;
    };

    private static async validateBody(request) {

        await body('UserId').optional()
            .trim()
            .escape()
            .isUUID()
            .run(request);

        await body('Token').optional()
            .trim()
            .escape()
            .run(request);

        await body('DeviceName').optional()
            .trim()
            .escape()
            .run(request);

        await body('OSType').optional()
            .trim()
            .escape()
            .run(request);

        await body('OSVersion').optional()
            .trim()
            .escape()
            .run(request);

        await body('AppName').optional()
            .trim()
            .escape()
            .run(request);

        await body('AppVersion').optional()
            .trim()
            .escape()
            .run(request);

        await body('ChangeCount').optional()
            .isInt()
            .escape()
            .run(request);

        const result = validationResult(request);
        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
    }

    private static getFilter(request): UserDeviceDetailsSearchFilters {
        const pageIndex = request.query.PageIndex !== 'undefined' ? parseInt(request.query.PageIndex as string, 10) : 0;

        const itemsPerPage =
            request.query.ItemsPerPage !== 'undefined' ? parseInt(request.query.ItemsPerPage as string, 10) : 25;

        const filters: UserDeviceDetailsSearchFilters = {
            UserId       : request.query.userId ?? null,
            Token        : request.query.token ?? null,
            DeviceName   : request.query.deviceName ?? null,
            OSType       : request.query.oSType ?? null,
            OSVersion    : request.query.oSVersion ?? null,
            AppName      : request.query.appName ?? null,
            AppVersion   : request.query.appVersion ?? null,
            OrderBy      : request.query.orderBy ?? 'CreatedAt',
            Order        : request.query.order ?? 'descending',
            PageIndex    : pageIndex,
            ItemsPerPage : itemsPerPage,
        };
        return filters;
    }

    private static async getParamId(request) {

        await param('id').trim()
            .escape()
            .isUUID()
            .run(request);

        const result = validationResult(request);

        if (!result.isEmpty()) {
            Helper.handleValidationError(result);
        }
        return request.params.id;
    }

    static sendTestNotification = async (request: express.Request, response: express.Response): Promise<any> => {
        try {
            await body('Phone').exists()
                .trim()
                .escape()
                .run(request);

            await body('Type').exists()
                .trim()
                .escape()
                .run(request);

            await body('Title').exists()
                .run(request);

            await body('Body').exists()
                .run(request);

            await body('Url').optional()
                .run(request);

            const result = validationResult(request);
            if (!result.isEmpty()) {
                Helper.handleValidationError(result);
            }

            var details = {
                Phone : request.body.Phone,
                Type  : request.body.Type,
                Title : request.body.Title,
                Body  : request.body.Body,
                Url   : request.body.Url ?? null
            };
            return details;

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

}
