import KnowledgeNuggetModel from '../../models/educational/knowledge.nugget.model';
import { KnowledgeNuggetDto } from '../../../../../domain.types/educational/knowledge.nugget/knowledge.nugget.dto';

///////////////////////////////////////////////////////////////////////////////////

export class KnowledgeNuggetMapper {

    static toDto = (
        knowledgeNugget: KnowledgeNuggetModel): KnowledgeNuggetDto => {
        if (knowledgeNugget == null) {
            return null;
        }

        var tags = [];
        if (knowledgeNugget.Tags !== null && knowledgeNugget.Tags.length > 1) {
            tags = JSON.parse(knowledgeNugget.Tags);
        }

        const dto: KnowledgeNuggetDto = {
            id                  : knowledgeNugget.id,
            TopicName           : knowledgeNugget.TopicName,
            BriefInformation    : knowledgeNugget.BriefInformation,
            DetailedInformation : knowledgeNugget.DetailedInformation,
            AdditionalResources : knowledgeNugget.AdditionalResources,
            Tags                : tags,
        };
        return dto;
    }

}
