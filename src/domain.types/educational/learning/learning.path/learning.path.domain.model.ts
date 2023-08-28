import { uuid } from "../../../miscellaneous/system.types";
import { CourseDomainModel } from "../course/course.domain.model";

export interface LearningPathDomainModel {
    id?                 : uuid,
    CourseIds?          : uuid[];
    Course?             : CourseDomainModel;
    Name?               : string;
    Description?        : string;
    ImageUrl?           : string;
    DurationInDays?     : number;
    StartDate?          : Date;
    EndDate?            : Date;
    PreferenceWeight?   : number;
    Enabled?            : boolean;
}
