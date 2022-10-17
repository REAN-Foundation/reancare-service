import { uuid } from "../../../miscellaneous/system.types";

export interface LearningPathDto {
    id?                 : uuid,
    Name?               : string;
    Description?        : string;
    ImageUrl?           : string;
    DurationInDays?     : number;
    Courses?            : any[];
    PreferenceWeight?   : number;
    Enabled?            : boolean;
}
