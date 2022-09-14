import { ProgressStatus, uuid } from "../../miscellaneous/system.types";

export interface UserCourseEnrollmentDto {
    id?             : uuid;
    CourseId?       : uuid;
    UserId?         : uuid;
    EnrollmentDate? : Date;
    ProgressStatus? : ProgressStatus;
    PercentageCompletion?: number;
}

export interface UserCourseModuleDto {
    id?                 : uuid;
    CourseId?           : uuid;
    UserId?             : uuid;
    ParentNodeId?       : uuid;
    CourseEnrollmentId? : uuid;
    ModuleId?           : uuid;
    StartDate?          : Date;
    EndDate?            : Date;
    ProgressStatus?     : ProgressStatus;
    PercentageCompletion?: number;
}

export interface UserCourseContentDto {
    id?                 : uuid;
    CourseId?           : uuid;
    UserId?             : uuid;
    CourseEnrollmentId? : uuid;
    ModuleId?           : uuid;
    ContentId?          :uuid;
    CourseModuleId?     : uuid;
    ProgressStatus?     : ProgressStatus;
    PercentageCompletion?: number;
}
