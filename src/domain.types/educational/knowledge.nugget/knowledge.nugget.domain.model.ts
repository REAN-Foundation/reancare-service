import { uuid } from '../../../domain.types/miscellaneous/system.types';
export interface KnowledgeNuggetDomainModel {
    id?: uuid;
    TopicName?: string;
    BriefInformation?: string;
    DetailedInformation?: string;
    PostDate?: Date;
    AdditionalResources?: string[];
    Tags?: string[];
}
