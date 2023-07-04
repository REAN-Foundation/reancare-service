import { KnowledgeNuggetDto } from '../../../../../domain.types/educational/knowledge.nugget/knowledge.nugget.dto';
import KnowledgeNugget from '../../models/educational/knowledge.nugget.model';

///////////////////////////////////////////////////////////////////////////////////

export class KnowledgeNuggetMapper {

    static toDto = (
        knowledgeNugget: KnowledgeNugget): KnowledgeNuggetDto => {
            
        if (knowledgeNugget == null) {
            return null;
        }

        var tags = [];
        if (knowledgeNugget.Tags !== null && knowledgeNugget.Tags !== undefined) {
            tags = JSON.parse(knowledgeNugget.Tags);
        }

        var additionalResources = [];
        if (knowledgeNugget.AdditionalResources !== null && knowledgeNugget.AdditionalResources !== undefined) {
            additionalResources = JSON.parse(knowledgeNugget.AdditionalResources);
        }

        const dto: KnowledgeNuggetDto = {
            id                  : knowledgeNugget.id,
            TopicName           : knowledgeNugget.TopicName,
            BriefInformation    : knowledgeNugget.BriefInformation,
            DetailedInformation : knowledgeNugget.DetailedInformation,
            AdditionalResources : additionalResources,
            Tags                : tags,
            CreatedAt           : knowledgeNugget.CreatedAt,
        };
        return dto;
    };

}
