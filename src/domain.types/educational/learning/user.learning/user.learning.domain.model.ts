import { ProgressStatus, uuid } from "../../../miscellaneous/system.types";

export interface UserLearningDomainModel {
    id?             : uuid;
    UserId?         : uuid;
    LearningPathId? : uuid;
    CourseId?       : uuid;
    ModuleId?       : uuid;
    ContentId?      : uuid;
    CreatedDate?    : Date;
    UpdateDate?     : Date;
    ProgressStatus? : ProgressStatus;
    PercentageCompletion?: number;
}

