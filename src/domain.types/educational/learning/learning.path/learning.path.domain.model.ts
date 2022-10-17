import { uuid } from "../../../miscellaneous/system.types";

export interface LearningPathDomainModel {
    id?                 : uuid,
    Name?               : string;
    Description?        : string;
    ImageUrl?           : string;
    DurationInDays?     : number;
    StartDate?          : Date;
    EndDate?            : Date;
    PreferenceWeight?   : number;
    Enabled?            : boolean;
}
