import express from 'express';
import { UserDeviceDetailsDomainModel } from '../../../domain.types/user/user.device.details/user.device.domain.model';
import { UserDeviceDetailsSearchFilters } from '../../../domain.types/user/user.device.details/user.device.search.types';
import { BaseValidator, Where } from '../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class UserDeviceDetailsValidator extends BaseValidator{

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): UserDeviceDetailsDomainModel => {

        const UserDeviceDetailsModel: UserDeviceDetailsDomainModel = {
            Token      : request.body.Token,
            UserId     : request.body.UserId,
            DeviceName : request.body.DeviceName,
            OSType     : request.body.OSType,
            OSVersion  : request.body.OSVersion,
            AppName    : request.body.AppName,
            AppVersion : request.body.AppVersion,

        };

        return UserDeviceDetailsModel;
    };

    create = async (request: express.Request): Promise<UserDeviceDetailsDomainModel> => {

        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    getById = async (request: express.Request): Promise<string> => {
        return await this.getParamId(request);
    };

    delete = async (request: express.Request): Promise<string> => {
        return await this.getParamId(request);
    };

    search = async (request: express.Request): Promise<UserDeviceDetailsSearchFilters> => {

        await this.validateUuid(request, 'userId', Where.Query, false, false);
        await this.validateString(request, 'deviceName', Where.Query, false, false);
        await this.validateString(request, 'oSType', Where.Query, false, false);
        await this.validateString(request, 'oSVersion', Where.Query, false, false);
        await this.validateString(request, 'appName', Where.Query, false, false);
        await this.validateString(request, 'appVersion', Where.Query, false, false);
        await this.validateString(request, 'orderBy', Where.Query, false, false);
        await this.validateString(request, 'order', Where.Query, false, false);
        await this.validateInt(request, 'pageIndex', Where.Query, false, false);
        await this.validateInt(request, 'itemsPerPage', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);
        
        this.validateRequest(request);

        return this.getFilter(request);
    };

    update = async (request: express.Request): Promise<UserDeviceDetailsDomainModel> => {

        const id = await this.getParamId(request);
        await this.validateUpdateBody(request);

        const domainModel = this.getDomainModel(request);
        domainModel.id = id;

        return domainModel;
    };

    private async validateUpdateBody(request) {

        await this.validateUuid(request, 'UserId', Where.Body, false, false);
        await this.validateString(request, 'Token', Where.Body, false, false);
        await this.validateString(request, 'DeviceName', Where.Body, false, false);
        await this.validateString(request, 'OSType', Where.Body, false, false);
        await this.validateString(request, 'OSVersion', Where.Body, false, false);
        await this.validateString(request, 'AppName', Where.Body, false, false);
        await this.validateString(request, 'AppVersion', Where.Body, false, false);
        
        this.validateRequest(request);
    }

    private async validateCreateBody(request) {

        await this.validateUuid(request, 'UserId', Where.Body, false, false);
        await this.validateString(request, 'Token', Where.Body, false, false);
        await this.validateString(request, 'DeviceName', Where.Body, false, false);
        await this.validateString(request, 'OSType', Where.Body, false, false);
        await this.validateString(request, 'OSVersion', Where.Body, false, false);
        await this.validateString(request, 'AppName', Where.Body, false, false);
        await this.validateString(request, 'AppVersion', Where.Body, false, false);
        
        this.validateRequest(request);
    }

    private getFilter(request): UserDeviceDetailsSearchFilters {
        const pageIndex = request.query.PageIndex !== 'undefined' ? parseInt(request.query.PageIndex as string, 10) : 0;

        const itemsPerPage =
            request.query.ItemsPerPage !== 'undefined' ? parseInt(request.query.ItemsPerPage as string, 10) : 25;

        const filters: UserDeviceDetailsSearchFilters = {
            UserId       : request.query.userId ?? null,
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

    getParamId = async(request) => {

        await this.validateUuid(request, 'id', Where.Param, true, false);
        
        this.validateRequest(request);
        return request.params.id;
    }

}
