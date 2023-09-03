import express from 'express';
import { KnowledgeNuggetDomainModel } from '../../../domain.types/educational/knowledge.nugget/knowledge.nugget.domain.model';
import { KnowledgeNuggetSearchFilters } from '../../../domain.types/educational/knowledge.nugget/knowledge.nugget.search.types';
import { BaseValidator, Where } from '../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////

export class KnowledgeNuggetValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): KnowledgeNuggetDomainModel => {

        const KnowledgeNuggetModel: KnowledgeNuggetDomainModel = {
            TopicName           : request.body.TopicName ?? null,
            BriefInformation    : request.body.BriefInformation ?? null,
            DetailedInformation : request.body.DetailedInformation ?? null,
            AdditionalResources : request.body.AdditionalResources ?? [],
            Tags                : request.body.Tags ?? [],
        };

        return KnowledgeNuggetModel;
    };

    create = async (request: express.Request): Promise<KnowledgeNuggetDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    search = async (request: express.Request): Promise<KnowledgeNuggetSearchFilters> => {

        await this.validateString(request, 'topicName', Where.Query, false, false);
        await this.validateString(request, 'tags', Where.Query, false, false);

        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);
    };

    update = async (request: express.Request): Promise<KnowledgeNuggetDomainModel> => {

        await this.validateUpdateBody(request);
        const domainModel = this.getDomainModel(request);
        domainModel.id = await this.getParamUuid(request, 'id');

        return domainModel;
    };

    private async validateCreateBody(request) {

        await this.validateString(request, 'TopicName', Where.Body, false, true);
        await this.validateString(request, 'BriefInformation', Where.Body, false, true);
        await this.validateString(request, 'DetailedInformation', Where.Body, false, true);
        await this.validateArray(request, 'AdditionalResources', Where.Body, false, true);
        await this.validateArray(request, 'Tags', Where.Body, false, true);

        this.validateRequest(request);
    }

    private async validateUpdateBody(request) {

        await this.validateString(request, 'TopicName', Where.Body, false, true);
        await this.validateString(request, 'BriefInformation', Where.Body, false, true);
        await this.validateString(request, 'DetailedInformation', Where.Body, false, true);
        await this.validateArray(request, 'AdditionalResources', Where.Body, false, true);
        await this.validateArray(request, 'Tags', Where.Body, false, true);

        this.validateRequest(request);
    }

    private getFilter(request): KnowledgeNuggetSearchFilters {

        var filters: KnowledgeNuggetSearchFilters = {
            TopicName : request.query.topicName ?? null,
            Tags      : request.query.tags ?? null,

        };
        return this.updateBaseSearchFilters(request, filters);
    }

}
