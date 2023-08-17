export interface KnowledgeNuggetDto {
    id?                   : string;
    TopicName?            : string;
    BriefInformation?     : string;
    DetailedInformation?  : string;
    AdditionalResources?  : string[];
    Tags?                 : string[];
    CreatedAt?            : Date;
}
