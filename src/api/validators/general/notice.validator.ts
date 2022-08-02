import express from 'express';
import { NoticeDomainModel } from '../../../domain.types/general/notice.domain.model';
import { NoticeSearchFilters } from '../../../domain.types/general/notice.search.types';
import { BaseValidator, Where } from '../base.validator';
 
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
            PostDate    : request.body.PostDate,
            DaysActive  : request.body.DaysActive,
            IsActive    : request.body.IsActive,
            Tags        : request.body.Tags,
            ImageUrl    : request.body.ImageUrl,
            Action      : request.body.Action,
        };
 
        return NoticeModel;
    };
 
    create = async (request: express.Request): Promise<NoticeDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (request: express.Request): Promise<NoticeSearchFilters> => {
 
        await this.validateUuid(request, 'patientUserId', Where.Query, false, false);
        await this.validateDecimal(request, 'minTotalCholesterol', Where.Query, false, false);
        await this.validateDecimal(request, 'maxTotalCholesterol', Where.Query, false, false);
        await this.validateDecimal(request, 'minRatio', Where.Query, false, false);
        await this.validateDecimal(request, 'maxRatio', Where.Query, false, false);
        await this.validateDecimal(request, 'minHDL', Where.Query, false, false);
        await this.validateDecimal(request, 'maxHDL', Where.Query, false, false);
        await this.validateDecimal(request, 'minLDL', Where.Query, false, false);
        await this.validateDecimal(request, 'maxLDL', Where.Query, false, false);
        await this.validateDecimal(request, 'minA1CLevel', Where.Query, false, false);
        await this.validateDecimal(request, 'maxA1CLevel', Where.Query, false, false);
        await this.validateDate(request, 'createdDateFrom', Where.Query, false, false);
        await this.validateDate(request, 'createdDateTo', Where.Query, false, false);
        await this.validateUuid(request, 'recordedByUserId', Where.Query, false, false);

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
        await this.validateString(request, 'Tags', Where.Body, false, true);
        await this.validateString(request, 'ImageUrl', Where.Body, false, true);
        await this.validateString(request, 'Action', Where.Body, false, true);

        this.validateRequest(request);
    }
    
    private  async validateUpdateBody(request) {

        await this.validateString(request, 'Title', Where.Body, false, false);
        await this.validateString(request, 'Description', Where.Body, false, false);
        await this.validateString(request, 'Link', Where.Body, false, false);
        await this.validateDate(request, 'PostDate', Where.Body, false, false);
        await this.validateDecimal(request, 'DaysActive', Where.Body, false, false);
        await this.validateBoolean(request, 'IsActive', Where.Body, false, false);
        await this.validateString(request, 'Tags', Where.Body, false, false);
        await this.validateDate(request, 'ImageUrl', Where.Body, false, false);
        await this.validateUuid(request, 'Action', Where.Body, false, false);

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
