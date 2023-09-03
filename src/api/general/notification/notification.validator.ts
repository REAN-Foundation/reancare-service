import express from 'express';
import { BaseValidator, Where } from '../../base.validator';
import { NotificationDomainModel } from '../../../domain.types/general/notification/notification.domain.model';
import { NotificationSearchFilters } from '../../../domain.types/general/notification/notification.search.types';

///////////////////////////////////////////////////////////////////////////////////////

export class NotificationValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): NotificationDomainModel => {

        const notificationModel: NotificationDomainModel = {
            UserId         : request.body.UserId,
            BroadcastToAll : request.body.BroadcastToAll ?? false,
            Title          : request.body.Title,
            Body           : request.body.Body,
            Payload        : request.body.Payload,
            SentOn         : request.body.SentOn ?? new Date(),
            ReadOn         : request.body.ReadOn,
            ImageUrl       : request.body.ImageUrl,
            Type           : request.body.Type,
        };

        return notificationModel;
    };

    create = async (request: express.Request): Promise<NotificationDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (request: express.Request): Promise<NotificationSearchFilters> => {

        await this.validateString(request, 'userId', Where.Query, false, false);
        await this.validateString(request, 'title', Where.Query, false, false);
        await this.validateDate(request, 'SentOn', Where.Query, false, false);
        await this.validateDate(request, 'readOn', Where.Query, false, false);
        await this.validateString(request, 'Type', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);
    };

    update = async (request: express.Request): Promise<NotificationDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    markAsRead = async (request: express.Request): Promise<NotificationDomainModel> => {

        await this.validateMarkAsReadBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    private  async validateCreateBody(request) {

        await this.validateUuid(request, 'UserId', Where.Body, false, false);
        await this.validateBoolean(request, 'BroadcastToAll', Where.Body, false, true);
        await this.validateString(request, 'Title', Where.Body, true, false);
        await this.validateString(request, 'Body', Where.Body, false, true);
        await this.validateString(request, 'Payload', Where.Body, false, true);
        await this.validateDate(request, 'SentOn', Where.Body, false, true);
        await this.validateDate(request, 'ReadOn', Where.Body, false, true);
        await this.validateString(request, 'ImageUrl', Where.Body, false, true);
        await this.validateString(request, 'Type', Where.Body, false, true);

        this.validateRequest(request);
    }

    private  async validateUpdateBody(request) {

        await this.validateBoolean(request, 'BroadcastToAll', Where.Body, false, true);
        await this.validateString(request, 'Title', Where.Body, false, false);
        await this.validateString(request, 'Body', Where.Body, false, true);
        await this.validateString(request, 'Payload', Where.Body, false, true);
        await this.validateDate(request, 'SentOn', Where.Body, false, true);
        await this.validateDate(request, 'ReadOn', Where.Body, false, true);
        await this.validateString(request, 'ImageUrl', Where.Body, false, true);
        await this.validateUuid(request, 'Type', Where.Body, false, true);

        this.validateRequest(request);
    }

    private  async validateMarkAsReadBody(request) {

        await this.validateDate(request, 'ReadOn', Where.Body, false, false);
        this.validateRequest(request);
    }

    private getFilter(request): NotificationSearchFilters {

        var filters: NotificationSearchFilters = {
            UserId : request.query.userId ?? null,
            Title  : request.query.title ?? null,
            SentOn : request.query.SentOn ?? null,
            ReadOn : request.query.ReadOn ?? null,
            Type   : request.query.Type ?? null,
        };

        return this.updateBaseSearchFilters(request, filters);
    }

}
