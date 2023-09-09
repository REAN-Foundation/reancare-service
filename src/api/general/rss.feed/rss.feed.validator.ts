import express from 'express';
import { BaseValidator, Where } from '../../base.validator';
import { RssfeedDomainModel, RssfeedItemDomainModel } from '../../../domain.types/general/rss.feed/rss.feed.domain.model';
import { RssfeedSearchFilters } from '../../../domain.types/general/rss.feed/rssfeed.search.types';

///////////////////////////////////////////////////////////////////////////////////////

export class RssfeedValidator extends BaseValidator {

    constructor() {
        super();
    }

    private  async validateCreateBody(request) {

        await this.validateString(request, 'Title', Where.Body, true, false);
        await this.validateString(request, 'Description', Where.Body, false, true);
        await this.validateString(request, 'Link', Where.Body, false, true);
        await this.validateString(request, 'Language', Where.Body, false, true);
        await this.validateString(request, 'Copyright', Where.Body, false, true);
        await this.validateString(request, 'Favicon', Where.Body, false, true);
        await this.validateString(request, 'Category', Where.Body, false, true);
        await this.validateString(request, 'Image', Where.Body, false, true);
        await this.validateArray(request, 'Tags', Where.Body, false, true);
        await this.validateString(request, 'ProviderName', Where.Body, false, true);
        await this.validateString(request, 'ProviderEmail', Where.Body, false, true);
        await this.validateString(request, 'ProviderLink', Where.Body, false, true);

        this.validateRequest(request);
    }

    getDomainModel = (request: express.Request): RssfeedDomainModel => {

        const model: RssfeedDomainModel = {
            id            : request.body.id ?? null,
            Title         : request.body.Title,
            Description   : request.body.Description,
            Link          : request.body.Link,
            Language      : request.body.Language,
            Copyright     : request.body.Copyright,
            Favicon       : request.body.Favicon,
            Image         : request.body.Image,
            Category      : request.body.Category,
            Tags          : request.body.Tags,
            ProviderName  : request.body.ProviderName,
            ProviderEmail : request.body.ProviderEmail,
            ProviderLink  : request.body.ProviderLink,
        };

        return model;
    };

    create = async (request: express.Request): Promise<RssfeedDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    private  async validateUpdateBody(request) {

        await this.validateString(request, 'Title', Where.Body, false, false);
        await this.validateString(request, 'Description', Where.Body, false, true);
        await this.validateString(request, 'Link', Where.Body, false, true);
        await this.validateString(request, 'Language', Where.Body, false, true);
        await this.validateString(request, 'Copyright', Where.Body, false, true);
        await this.validateString(request, 'Favicon', Where.Body, false, true);
        await this.validateString(request, 'Category', Where.Body, false, true);
        await this.validateString(request, 'Image', Where.Body, false, true);
        await this.validateArray(request, 'Tags', Where.Body, false, true);
        await this.validateString(request, 'ProviderName', Where.Body, false, true);
        await this.validateString(request, 'ProviderEmail', Where.Body, false, true);
        await this.validateString(request, 'ProviderLink', Where.Body, false, true);

        this.validateRequest(request);
    }

    update = async (request: express.Request): Promise<RssfeedDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');
        return domainModel;
    };

    search = async (request: express.Request): Promise<RssfeedSearchFilters> => {

        await this.validateString(request, 'title', Where.Query, false, false);
        await this.validateString(request, 'category', Where.Query, false, false);
        await this.validateDate(request, 'tags', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);
    };

    private getFilter(request): RssfeedSearchFilters {

        var filters: RssfeedSearchFilters = {
            Title    : request.query.title ?? null,
            Category : request.query.category ?? null,
            Tags     : request.query.tags ?? null,
        };

        return this.updateBaseSearchFilters(request, filters);
    }

    public updateFeedItem = async (request: express.Request): Promise<RssfeedItemDomainModel> => {

        await this.validateUuid(request, 'FeedId', Where.Body, false, false);
        await this.validateString(request, 'Title', Where.Body, false, false);
        await this.validateString(request, 'Description', Where.Body, false, true);
        await this.validateString(request, 'Link', Where.Body, false, true);
        await this.validateString(request, 'Content', Where.Body, true, false);
        await this.validateString(request, 'Image', Where.Body, false, true);
        await this.validateArray(request, 'Tags', Where.Body, false, true);
        await this.validateString(request, 'AuthorName', Where.Body, false, true);
        await this.validateString(request, 'AuthorEmail', Where.Body, false, true);
        await this.validateString(request, 'AuthorLink', Where.Body, false, true);
        await this.validateString(request, 'PublishingDate', Where.Body, false, true);

        await this.validateUuid(request, 'PublishingDate', Where.Param, true, false);

        this.validateRequest(request);

        const model: RssfeedItemDomainModel = {
            id             : request.params.itemId,
            FeedId         : request.body.FeedId,
            Title          : request.body.Title,
            Description    : request.body.Description,
            Link           : request.body.Link,
            Content        : request.body.Content,
            Image          : request.body.Image,
            Tags           : request.body.Tags,
            AuthorName     : request.body.AuthorName,
            AuthorEmail    : request.body.AuthorEmail,
            AuthorLink     : request.body.AuthorLink,
            PublishingDate : request.body.PublishingDate ?? new Date(),
        };

        return model;
    };

    addFeedItem = async (request: express.Request): Promise<RssfeedItemDomainModel> => {

        await this.validateUuid(request, 'FeedId', Where.Body, true, false);
        await this.validateString(request, 'Title', Where.Body, true, false);
        await this.validateString(request, 'Description', Where.Body, false, true);
        await this.validateString(request, 'Link', Where.Body, true, false);
        await this.validateString(request, 'Content', Where.Body, true, false);
        await this.validateString(request, 'Image', Where.Body, false, true);
        await this.validateArray(request, 'Tags', Where.Body, false, true);
        await this.validateString(request, 'AuthorName', Where.Body, false, true);
        await this.validateString(request, 'AuthorEmail', Where.Body, false, true);
        await this.validateString(request, 'AuthorLink', Where.Body, false, true);
        await this.validateString(request, 'PublishingDate', Where.Body, false, true);

        this.validateRequest(request);

        const model: RssfeedItemDomainModel = {
            FeedId         : request.body.FeedId,
            Title          : request.body.Title,
            Description    : request.body.Description,
            Link           : request.body.Link,
            Content        : request.body.Content,
            Image          : request.body.Image,
            Tags           : request.body.Tags,
            AuthorName     : request.body.AuthorName,
            AuthorEmail    : request.body.AuthorEmail,
            AuthorLink     : request.body.AuthorLink,
            PublishingDate : request.body.PublishingDate ?? new Date(),
        };

        return model;
    };

}
