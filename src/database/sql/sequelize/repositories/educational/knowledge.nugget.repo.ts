import { ApiError } from '../../../../../common/api.error';
import { Logger } from '../../../../../common/logger';
import { KnowledgeNuggetDomainModel } from "../../../../../domain.types/educational/knowledge.nugget/knowledge.nugget.domain.model";
import { KnowledgeNuggetDto } from "../../../../../domain.types/educational/knowledge.nugget/knowledge.nugget.dto";
import { KnowledgeNuggetSearchFilters, KnowledgeNuggetSearchResults } from "../../../../../domain.types/educational/knowledge.nugget/knowledge.nugget.search.types";
import { IKnowledgeNuggetRepo } from '../../../../repository.interfaces/educational/knowledge.nugget.repo.interface';
import { KnowledgeNuggetMapper } from '../../mappers/educational/knowledge.nugget.mapper';
import KnowledgeNuggetModel from '../../models/educational/knowledge.nugget.model';

///////////////////////////////////////////////////////////////////////

export class KnowledgeNuggetRepo implements IKnowledgeNuggetRepo {

    create = async (knowledgeNuggetDomainModel: KnowledgeNuggetDomainModel):
    Promise<KnowledgeNuggetDto> => {

        var tags = knowledgeNuggetDomainModel.Tags && knowledgeNuggetDomainModel.Tags.length > 0 ?
            JSON.stringify(knowledgeNuggetDomainModel.Tags) : '[]';

        try {
            const entity = {
                TopicName           : knowledgeNuggetDomainModel.TopicName,
                BriefInformation    : knowledgeNuggetDomainModel.BriefInformation,
                DetailedInformation : knowledgeNuggetDomainModel.DetailedInformation,
                AdditionalResources : knowledgeNuggetDomainModel.AdditionalResources,
                Tags                : tags
            };

            const knowledgeNugget = await KnowledgeNuggetModel.create(entity);
            const dto = await KnowledgeNuggetMapper.toDto(knowledgeNugget);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<KnowledgeNuggetDto> => {
        try {
            const knowledgeNugget = await KnowledgeNuggetModel.findByPk(id);
            const dto = await KnowledgeNuggetMapper.toDto(knowledgeNugget);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: KnowledgeNuggetSearchFilters): Promise<KnowledgeNuggetSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.TopicName != null) {
                search.where['TopicName'] = filters.TopicName;
            }
            if (filters.Tag !== null) {
                search.where['Tag'] = filters.Tag;
            }

            let orderByColum = 'CreatedAt';
            if (filters.OrderBy) {
                orderByColum = filters.OrderBy;
            }
            let order = 'ASC';
            if (filters.Order === 'descending') {
                order = 'DESC';
            }
            search['order'] = [[orderByColum, order]];

            let limit = 25;
            if (filters.ItemsPerPage) {
                limit = filters.ItemsPerPage;
            }
            let offset = 0;
            let pageIndex = 0;
            if (filters.PageIndex) {
                pageIndex = filters.PageIndex < 0 ? 0 : filters.PageIndex;
                offset = pageIndex * limit;
            }
            search['limit'] = limit;
            search['offset'] = offset;

            const foundResults = await KnowledgeNuggetModel.findAndCountAll(search);

            const dtos: KnowledgeNuggetDto[] = [];
            for (const knowledgeNugget of foundResults.rows) {
                const dto = await KnowledgeNuggetMapper.toDto(knowledgeNugget);
                dtos.push(dto);
            }

            const searchResults: KnowledgeNuggetSearchResults = {
                TotalCount     : foundResults.count,
                RetrievedCount : dtos.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColum,
                Items          : dtos,
            };

            return searchResults;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    update = async (id: string, knowledgeNuggetDomainModel: KnowledgeNuggetDomainModel):
    Promise<KnowledgeNuggetDto> => {
        try {
            const knowledgeNugget = await KnowledgeNuggetModel.findByPk(id);

            if (knowledgeNuggetDomainModel.TopicName != null) {
                knowledgeNugget.TopicName = knowledgeNuggetDomainModel.TopicName;
            }
            if (knowledgeNuggetDomainModel.BriefInformation != null) {
                knowledgeNugget.BriefInformation = knowledgeNuggetDomainModel.BriefInformation;
            }
            if (knowledgeNuggetDomainModel.DetailedInformation != null) {
                knowledgeNugget.DetailedInformation = knowledgeNuggetDomainModel.DetailedInformation;
            }
            if (knowledgeNuggetDomainModel.AdditionalResources != null) {
                knowledgeNugget.AdditionalResources = knowledgeNuggetDomainModel.AdditionalResources;
            }
            if (knowledgeNuggetDomainModel.Tags != null && knowledgeNuggetDomainModel.Tags.length > 0) {

                var tags = knowledgeNuggetDomainModel.Tags.length > 0 ?
                    JSON.stringify(knowledgeNuggetDomainModel.Tags) : '[]';

                knowledgeNugget.Tags = tags;
            }
    
            await knowledgeNugget.save();

            const dto = await KnowledgeNuggetMapper.toDto(knowledgeNugget);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            Logger.instance().log(id);

            const result = await KnowledgeNuggetModel.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
