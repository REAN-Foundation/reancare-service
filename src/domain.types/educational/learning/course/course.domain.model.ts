import { uuid } from "../../../miscellaneous/system.types";

export interface CourseDomainModel {
    id?              : uuid;
    LearningPathIds? : string[];
    Name?            : string;
    Description?     : string;
    ImageUrl?        : string;
    DurationInDays?  : number;
}
