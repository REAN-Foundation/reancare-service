// import { Op } from 'sequelize';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import {  UserCourseContentDomainModel, UserCourseEnrollmentDomainModel, UserCourseModuleDomainModel } from "../../../../../../domain.types/educational/course.enrollment/course.enrollment.domain.model";
import {  UserCourseContentDto, UserCourseEnrollmentDto, UserCourseModuleDto } from "../../../../../../domain.types/educational/course.enrollment/course.enrollment.dto";
import { ICourseEnrollmentRepo } from '../../../../../repository.interfaces/educational/course.enrollment/course.enrollment.repo.interface';
import { CourseEnrollmentMapper } from '../../../mappers/educational/course.enrollment/course.enrollment.mapper';
import UserCourseContent from '../../../models/educational/user.course.content/user.course.content.model';
import UserCourseEnrollment from '../../../models/educational/user.course.enrollment/user.course.enrollment.model';
import UserCourseModule from '../../../models/educational/user.course.module/user.course.module.model';

///////////////////////////////////////////////////////////////////////

export class CourseEnrollmentRepo implements ICourseEnrollmentRepo {

    enroll = async (createModel: UserCourseEnrollmentDomainModel):
    Promise<UserCourseEnrollmentDto> => {
        try {
            const entity = {
                CourseId       : createModel.CourseId,
                UserId         : createModel.UserId ,
                EnrollmentDate : createModel.EnrollmentDate,
                ProgressStatus : createModel.ProgressStatus,
            };

            const courseEnrollment = await UserCourseEnrollment.create(entity);
            return await CourseEnrollmentMapper.toDto(courseEnrollment);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    startCourseModule = async (createModel: UserCourseModuleDomainModel):
    Promise<UserCourseModuleDto> => {
        try {
            const entity = {
                CourseId           : createModel.CourseId,
                UserId             : createModel.UserId ,
                ParentNodeId       : createModel.ParentNodeId,
                CourseEnrollmentId : createModel.CourseEnrollmentId,
                ModuleId           : createModel.ModuleId,
                StartDate          : createModel.StartDate,
                EndDate            : createModel.EndDate,
                ProgressStatus     : createModel.ProgressStatus,
            };

            const courseModule = await UserCourseModule.create(entity);
            return await CourseEnrollmentMapper.toModuleDto(courseModule);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    startCourseContent = async (createModel: UserCourseContentDomainModel):
    Promise<UserCourseContentDto> => {
        try {
            const entity = {
                CourseId           : createModel.CourseId,
                UserId             : createModel.UserId ,
                CourseEnrollmentId : createModel.CourseEnrollmentId,
                CourseModuleId     : createModel.CourseModuleId,
                ModuleId           : createModel.ModuleId,
                ContentId          : createModel.ContentId   ,
                ProgressStatus     : createModel.ProgressStatus,
            };

            const courseContent = await UserCourseContent.create(entity);
            return await CourseEnrollmentMapper.toContentDto(courseContent);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getCourseProgress = async (enrollmentId: string): Promise<UserCourseEnrollmentDto> => {
        try {
            const courseEnrollment = await UserCourseEnrollment.findByPk(enrollmentId);
            return await CourseEnrollmentMapper.toDto(courseEnrollment);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getModuleProgress = async (courseModuleId: string): Promise<UserCourseModuleDto> => {
        try {
            const courseModule = await UserCourseModule.findByPk(courseModuleId);
            return await CourseEnrollmentMapper.toModuleDto(courseModule);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getContentProgress = async (courseContentId: string): Promise<UserCourseContentDto> => {
        try {
            const courseContent = await UserCourseContent.findByPk(courseContentId);
            return await CourseEnrollmentMapper.toContentDto(courseContent);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
