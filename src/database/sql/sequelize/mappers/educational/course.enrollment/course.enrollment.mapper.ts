
import { ProgressStatus } from '../../../../../../domain.types/miscellaneous/system.types';
import { UserCourseContentDto, UserCourseEnrollmentDto, UserCourseModuleDto } from '../../../../../../domain.types/educational/course.enrollment/course.enrollment.dto';
import UserCourseEnrollmentModel from '../../../models/educational/user.course.enrollment/user.course.enrollment.model';
import UserCourseModuleModel from '../../../models/educational/user.course.module/user.course.module.model';
import UserCourseContentModel from '../../../models/educational/user.course.content/user.course.content.model';

///////////////////////////////////////////////////////////////////////////////////

export class CourseEnrollmentMapper {

    static toDto = (
        courseEnrollment: UserCourseEnrollmentModel, percentageCompletion = 0): UserCourseEnrollmentDto => {
        if (courseEnrollment == null) {
            return null;
        }
        const dto: UserCourseEnrollmentDto = {
            id                   : courseEnrollment.id,
            CourseId             : courseEnrollment.CourseId,
            UserId               : courseEnrollment.UserId ,
            EnrollmentDate       : courseEnrollment.EnrollmentDate,
            ProgressStatus       : courseEnrollment.ProgressStatus as ProgressStatus,
            PercentageCompletion : percentageCompletion,

        };
        return dto;
    };

    static toModuleDto = (
        courseModule: UserCourseModuleModel, percentageCompletion = 0): UserCourseModuleDto => {
        if (courseModule == null) {
            return null;
        }
        const dto: UserCourseModuleDto = {
            id                   : courseModule.id,
            CourseId             : courseModule.CourseId,
            UserId               : courseModule.UserId ,
            ParentNodeId         : courseModule.ParentNodeId ,
            CourseEnrollmentId   : courseModule.CourseEnrollmentId,
            ModuleId             : courseModule.ModuleId ,
            StartDate            : courseModule.StartDate ,
            EndDate              : courseModule.EndDate ,
            ProgressStatus       : courseModule.ProgressStatus as ProgressStatus,
            PercentageCompletion : percentageCompletion,
        };
        return dto;
    };

    static toContentDto = (
        courseContent: UserCourseContentModel, percentageCompletion = 0): UserCourseContentDto => {
        if (courseContent == null) {
            return null;
        }
        const dto: UserCourseContentDto = {
            id                   : courseContent.id,
            CourseId             : courseContent.CourseId,
            UserId               : courseContent.UserId ,
            CourseEnrollmentId   : courseContent.CourseEnrollmentId,
            ModuleId             : courseContent.ModuleId ,
            CourseModuleId       : courseContent.CourseModuleId  ,
            ContentId            : courseContent.ContentId  ,
            ProgressStatus       : courseContent.ProgressStatus as ProgressStatus,
            PercentageCompletion : percentageCompletion,
        };
        return dto;
    };

}
