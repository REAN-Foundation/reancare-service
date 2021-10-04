import { Utils } from 'sequelize';
import { ApiError } from '../../../../../common/api.error';
import { Logger } from '../../../../../common/logger';
import { KnowledgeNuggetDomainModel } from "../../../../../domain.types/educational/knowledge.nugget/knowledge.nugget.domain.model";
import { KnowledgeNuggetDto } from "../../../../../domain.types/educational/knowledge.nugget/knowledge.nugget.dto";
import { KnowledgeNuggetSearchFilters, KnowledgeNuggetSearchResults } from "../../../../../domain.types/educational/knowledge.nugget/knowledge.nugget.search.types";
import { IKnowledgeNuggetRepo } from '../../../../repository.interfaces/educational/knowledge.nugget.repo.interface';
import { KnowledgeNuggetMapper } from '../../mappers/educational/knowledge.nugget.mapper';
import KnowledgeNugget from '../../models/educational/knowledge.nugget.model';

///////////////////////////////////////////////////////////////////////

export class KnowledgeNuggetRepo implements IKnowledgeNuggetRepo {

    totalCount = async (): Promise<number> => {
        try {
            return await KnowledgeNugget.count();
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getRandom = async(): Promise<KnowledgeNuggetDto> => {

        //NOTE: The following literal is for MySQL, for PostGreSQL, please use `var literal = 'random()';`
        var literal = new Utils.Literal('rand()');

        const topic = await KnowledgeNugget.findOne(
            {
                order      : literal,
                limit      : 1,
                attributes : [
                    "id",
                    "TopicName",
                    "BriefInformation"
                ]
            });
        return KnowledgeNuggetMapper.toDto(topic);
    }

    create = async (model: KnowledgeNuggetDomainModel):
    Promise<KnowledgeNuggetDto> => {

        var tags = model.Tags && model.Tags.length > 0 ?
            JSON.stringify(model.Tags) : '[]';

        var additionalResources = model.AdditionalResources && model.AdditionalResources.length > 0 ?
            JSON.stringify(model.AdditionalResources) : '[]';

        try {
            const entity = {
                TopicName           : model.TopicName,
                BriefInformation    : model.BriefInformation,
                DetailedInformation : model.DetailedInformation,
                AdditionalResources : additionalResources,
                Tags                : tags
            };

            const knowledgeNugget = await KnowledgeNugget.create(entity);
            return KnowledgeNuggetMapper.toDto(knowledgeNugget);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<KnowledgeNuggetDto> => {
        try {
            const knowledgeNugget = await KnowledgeNugget.findByPk(id);
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

            const foundResults = await KnowledgeNugget.findAndCountAll(search);

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
            const knowledgeNugget = await KnowledgeNugget.findByPk(id);

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
                
                var additionalResources = knowledgeNuggetDomainModel.AdditionalResources.length > 0 ?
                    JSON.stringify(knowledgeNuggetDomainModel.AdditionalResources) : '[]';

                knowledgeNugget.AdditionalResources = additionalResources;
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

            const result = await KnowledgeNugget.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
