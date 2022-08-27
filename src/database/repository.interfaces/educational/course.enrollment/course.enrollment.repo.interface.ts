import { UserCourseContentDomainModel, UserCourseEnrollmentDomainModel, UserCourseModuleDomainModel } from "../../../../domain.types/educational/course.enrollment/course.enrollment.domain.model";
import { UserCourseContentDto, UserCourseEnrollmentDto, UserCourseModuleDto } from "../../../../domain.types/educational/course.enrollment/course.enrollment.dto";

export interface ICourseEnrollmentRepo {

    enroll(userCourseEnrollmentDomainModel: UserCourseEnrollmentDomainModel): Promise<UserCourseEnrollmentDto>;

    startCourseModule (userCourseModuleDomainModel: UserCourseModuleDomainModel): Promise<UserCourseModuleDto>;

    startCourseContent (userCourseContentDomainModel: UserCourseContentDomainModel): Promise<UserCourseContentDto>;
    
    getCourseProgress(enrollmentId: string): Promise<UserCourseEnrollmentDto>;

    getModuleProgress(courseModuleId: string): Promise<UserCourseModuleDto>;

    getContentProgress(courseContentId: string): Promise<UserCourseContentDto>;
   
}
