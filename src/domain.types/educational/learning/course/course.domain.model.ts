import { uuid } from "../../../miscellaneous/system.types";

export interface CourseDomainModel {
    id?              : uuid;
    LearningPathIds? : uuid[];
    Name?            : string;
    Description?     : string;
    ImageUrl?        : string;
    DurationInDays?  : number;
}
