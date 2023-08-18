import express from 'express';
import { NoticeActionDomainModel } from '../../../domain.types/general/notice.action/notice.action.domain.model';
import { NoticeDomainModel } from '../../../domain.types/general/notice/notice.domain.model';
import { NoticeSearchFilters } from '../../../domain.types/general/notice/notice.search.types';
import { BaseValidator, Where } from '../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class NoticeValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): NoticeDomainModel => {

        const NoticeModel: NoticeDomainModel = {
            Title       : request.body.Title,
            Description : request.body.Description,
            Link        : request.body.Link,
            PostDate    : request.body.PostDate ?? new Date(),
            DaysActive  : request.body.DaysActive ?? null,
            IsActive    : request.body.IsActive,
            Tags        : request.body.Tags ?? [],
            ImageUrl    : request.body.ImageUrl,
            Action      : request.body.Action,
        };

        return NoticeModel;
    };

    create = async (request: express.Request): Promise<NoticeDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    takeAction = async(request: express.Request): Promise<NoticeActionDomainModel> => {
        await this.validateCreateActionBody(request);
        return this.getActionDomainModel(request);
    };

    search = async (request: express.Request): Promise<NoticeSearchFilters> => {

        await this.validateString(request, 'title', Where.Query, false, false);
        await this.validateString(request, 'description', Where.Query, false, false);
        await this.validateString(request, 'link', Where.Query, false, false);
        await this.validateDate(request, 'postDate', Where.Query, false, false);
        await this.validateDate(request, 'endDate', Where.Query, false, false);
        await this.validateDecimal(request, 'daysActive', Where.Query, false, false);
        await this.validateBoolean(request, 'isActive', Where.Query, false, false);
        await this.validateString(request, 'tags', Where.Query, false, false);
        await this.validateString(request, 'imageUrl', Where.Query, false, false);
        await this.validateString(request, 'action', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);
    };

    update = async (request: express.Request): Promise<NoticeDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    private  async validateCreateBody(request) {

        await this.validateString(request, 'Title', Where.Body, true, false);
        await this.validateString(request, 'Description', Where.Body, false, true);
        await this.validateString(request, 'Link', Where.Body, false, true);
        await this.validateDate(request, 'PostDate', Where.Body, false, true);
        await this.validateDecimal(request, 'DaysActive', Where.Body, false, true);
        await this.validateBoolean(request, 'IsActive', Where.Body, false, true);
        await this.validateArray(request, 'Tags', Where.Body, false, true);
        await this.validateString(request, 'ImageUrl', Where.Body, false, true);
        await this.validateString(request, 'Action', Where.Body, false, true);

        this.validateRequest(request);
    }

    private  async validateCreateActionBody(request) {

        await this.validateUuid(request, 'NoticeId', Where.Body, true, false);
        await this.validateString(request, 'Action', Where.Body, false, true);
        await this.validateArray(request, 'Contents', Where.Body, false, true);
        this.validateRequest(request);
    }

    getActionDomainModel = (request: express.Request): NoticeActionDomainModel => {

        const NoticeActionModel: NoticeActionDomainModel = {

            NoticeId : request.body.NoticeId,
            Action   : request.body.Action,
            Contents : request.body.Contents,
        };
        return NoticeActionModel;
    };

    private  async validateUpdateBody(request) {

        await this.validateString(request, 'Title', Where.Body, false, false);
        await this.validateString(request, 'Description', Where.Body, false, true);
        await this.validateString(request, 'Link', Where.Body, false, true);
        await this.validateDate(request, 'PostDate', Where.Body, false, true);
        await this.validateDecimal(request, 'DaysActive', Where.Body, false, true);
        await this.validateBoolean(request, 'IsActive', Where.Body, false, true);
        await this.validateArray(request, 'Tags', Where.Body, false, true);
        await this.validateString(request, 'ImageUrl', Where.Body, false, true);
        await this.validateUuid(request, 'Action', Where.Body, false, true);

        this.validateRequest(request);
    }

    private getFilter(request): NoticeSearchFilters {

        var filters: NoticeSearchFilters = {
            Title       : request.query.title ?? null,
            Description : request.query.description ?? null,
            Link        : request.query.link ?? null,
            PostDate    : request.query.postDate ?? null,
            EndDate     : request.query.endDate ?? null,
            DaysActive  : request.query.daysActive ?? null,
            IsActive    : request.query.isActive ?? null,
            Tags        : request.query.tags ?? null,
            ImageUrl    : request.query.imageUrl ?? null,
            Action      : request.query.action ?? null,
        };

        return this.updateBaseSearchFilters(request, filters);
    }

}
