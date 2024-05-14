import express from 'express';
import { BaseValidator, Where } from '../../base.validator';
import {
    NotificationCreateModel,
    NotificationUpdateModel,
    NotificationSearchFilters,
    NotificationTarget,
    NotificationType,
    NotificationChannel
} from '../../../domain.types/general/notification/notification.types';

///////////////////////////////////////////////////////////////////////////////////////

export class NotificationValidator extends BaseValidator {

    constructor() {
        super();
    }

    getCreateModel = (request: express.Request): NotificationCreateModel => {

        const notificationModel: NotificationCreateModel = {
            TenantId        : request.body.TenantId ?? null,
            Target          : request.body.Target as NotificationTarget ?? NotificationTarget.User,
            Type            : request.body.Type as NotificationType ?? NotificationType.Info,
            Channel         : request.body.Channel as NotificationChannel ?? NotificationChannel.MobilePush,
            Title           : request.body.Title,
            Body            : request.body.Body,
            ImageUrl        : request.body.ImageUrl ?? null,
            Payload         : request.body.Payload ?? null,
            SentOn          : request.body.SendOn ?? null,
            CreatedByUserId : request.body.CreatedByUserId ?? null
        };

        return notificationModel;
    };

    getUpdateModel = (request: express.Request): NotificationUpdateModel => {
            
        const notificationModel: NotificationUpdateModel = {
            TenantId : request.body.TenantId ?? null,
            Target   : request.body.Target as NotificationTarget ?? null,
            Type     : request.body.Type as NotificationType ?? null,
            Title    : request.body.Title ?? null,
            Body     : request.body.Body ?? null,
            Payload  : request.body.Payload ?? null,
            ImageUrl : request.body.ImageUrl ?? null,
            SentOn   : request.body.SentOn ?? null,
        };

        return notificationModel;
    };

    private  async validateCreateBody(request) {

        await this.validateUuid(request, 'TenantId', Where.Body, false, false);
        await this.validateString(request, 'Target', Where.Body, false, true);
        await this.validateString(request, 'Type', Where.Body, false, true);
        await this.validateString(request, 'Channel', Where.Body, false, true);
        await this.validateString(request, 'Title', Where.Body, true, false);
        await this.validateString(request, 'Body', Where.Body, true, true);
        await this.validateString(request, 'ImageUrl', Where.Body, true, true);
        await this.validateString(request, 'Payload', Where.Body, false, true);
        await this.validateDate(request, 'SentOn', Where.Body, false, true);
        await this.validateUuid(request, 'CreatedByUserId', Where.Body, false, true);

        this.validateRequest(request);
    }

    create = async (request: express.Request): Promise<NotificationCreateModel> => {
        await this.validateCreateBody(request);
        return this.getCreateModel(request);
    };

    search = async (request: express.Request): Promise<NotificationSearchFilters> => {
        await this.validateString(request, 'tenantId', Where.Query, false, false);
        await this.validateString(request, 'title', Where.Query, false, false);
        await this.validateDate(request, 'SentOn', Where.Query, false, false);
        await this.validateString(request, 'target', Where.Query, false, false);
        await this.validateString(request, 'Type', Where.Query, false, false);
        await this.validateBaseSearchFilters(request);
        this.validateRequest(request);
        return this.getFilter(request);
    };

    update = async (request: express.Request): Promise<NotificationUpdateModel> => {
        await this.validateUpdateBody(request);
        const domainModel = this.getUpdateModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    private  async validateUpdateBody(request) {
        await this.validateBoolean(request, 'TenantId', Where.Body, false, true);
        await this.validateString(request, 'Title', Where.Body, false, false);
        await this.validateString(request, 'Body', Where.Body, false, true);
        await this.validateString(request, 'Payload', Where.Body, false, true);
        await this.validateDate(request, 'SentOn', Where.Body, false, true);
        await this.validateString(request, 'ImageUrl', Where.Body, false, true);
        await this.validateUuid(request, 'Type', Where.Body, false, true);
        this.validateRequest(request);
    }

    private getFilter(request): NotificationSearchFilters {
        var filters: NotificationSearchFilters = {
            TenantId   : request.query.tenantId ?? null,
            Title      : request.query.title ?? null,
            Target     : request.query.target as NotificationTarget ?? null,
            Type       : request.query.type as NotificationType ?? null,
            Channel    : request.query.channel as NotificationChannel ?? null,
            SentOnFrom : request.query.sentOnFrom ?? null,
            SentOnTo   : request.query.sentOnTo
            // UserId : request.query.tenantId ?? null,
            // Title  : request.query.title ?? null,
            // SentOn : request.query.sentOn ?? null,
            // ReadOn : request.query.target ?? null,
            // Type   : request.query.type ?? null,
        };
        return this.updateBaseSearchFilters(request, filters);
    }

}
