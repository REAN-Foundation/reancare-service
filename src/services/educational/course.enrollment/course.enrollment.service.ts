import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { inject, injectable } from "tsyringe";
import { ICourseEnrollmentRepo } from "../../../database/repository.interfaces/educational/course.enrollment/course.enrollment.repo.interface";
import {  UserCourseContentDomainModel, UserCourseEnrollmentDomainModel, UserCourseModuleDomainModel } from '../../../domain.types/educational/course.enrollment/course.enrollment.domain.model';
import { UserCourseContentDto, UserCourseEnrollmentDto, UserCourseModuleDto } from '../../../domain.types/educational/course.enrollment/course.enrollment.dto';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class CourseEnrollmentService {

    constructor(
        @inject('ICourseEnrollmentRepo') private _courseEnrollmentRepo: ICourseEnrollmentRepo,
    ) {}

    enroll = async (userCourseEnrollmentDomainModel: UserCourseEnrollmentDomainModel):
    Promise<UserCourseEnrollmentDto> =>
    {
        return await this._courseEnrollmentRepo.enroll(userCourseEnrollmentDomainModel);
    };

    startCourseModule = async (userCourseModuleDomainModel: UserCourseModuleDomainModel):
    Promise<UserCourseModuleDto> =>
    {
        return await this._courseEnrollmentRepo.startCourseModule(userCourseModuleDomainModel);
    };

    startCourseContent = async (userCourseContentDomainModel: UserCourseContentDomainModel):
    Promise<UserCourseModuleDto> =>
    {
        return await this._courseEnrollmentRepo.startCourseContent(userCourseContentDomainModel);
    };

    getCourseProgress = async (enrollmentId: uuid): Promise<UserCourseEnrollmentDto> => {
        return await this._courseEnrollmentRepo.getCourseProgress(enrollmentId);
    };

    getModuleProgress = async (moduleId: uuid): Promise<UserCourseModuleDto> => {
        return await this._courseEnrollmentRepo.getModuleProgress(moduleId );
    };

    getContentProgress = async (contentId: uuid): Promise<UserCourseContentDto> => {
        return await this._courseEnrollmentRepo.getContentProgress(contentId);
    };

    getUserEnrollments = async (userId: uuid): Promise<any[]> => {
        return await this._courseEnrollmentRepo.getUserEnrollments(userId);
    };

}
