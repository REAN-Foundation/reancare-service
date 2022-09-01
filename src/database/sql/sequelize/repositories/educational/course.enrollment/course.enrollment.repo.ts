
import { ProgressStatus } from '../../../../../../domain.types/miscellaneous/system.types';
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
                CourseId             : createModel.CourseId,
                UserId               : createModel.UserId ,
                EnrollmentDate       : createModel.EnrollmentDate,
                ProgressStatus       : createModel.ProgressStatus,
                PercentageCompletion : createModel.PercentageCompletion,
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
                CourseId             : createModel.CourseId,
                UserId               : createModel.UserId ,
                ParentNodeId         : createModel.ParentNodeId,
                CourseEnrollmentId   : createModel.CourseEnrollmentId,
                ModuleId             : createModel.ModuleId,
                StartDate            : createModel.StartDate,
                EndDate              : createModel.EndDate,
                ProgressStatus       : createModel.ProgressStatus,
                PercentageCompletion : createModel.PercentageCompletion,
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
            courseContent.ProgressStatus = ProgressStatus.Completed;
            return await CourseEnrollmentMapper.toContentDto(courseContent);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getCourseProgress = async (enrollmentId: string):Promise< UserCourseEnrollmentDto> => {
        try {
            var courseEnrollment = await  UserCourseEnrollment.findByPk(enrollmentId);
            return await this.getUpdatedCourse(enrollmentId, courseEnrollment);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getModuleProgress = async (courseModuleId: string):Promise<UserCourseModuleDto> => {
        try {
            var courseModule = await UserCourseModule.findByPk(courseModuleId);
            return await this.getUpdatedModule(courseModuleId, courseModule);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getContentProgress = async (courseContentId: string): Promise<UserCourseContentDto> => {
        try {
            const courseContent = await UserCourseContent.findByPk(courseContentId);
            courseContent.ProgressStatus = ProgressStatus.Completed;
            return await CourseEnrollmentMapper.toContentDto(courseContent);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    private async getUpdatedModule(courseModuleId: string, courseModule: UserCourseModule) {
        var percentageCompletion = await this.getModulePercentageCompletion(courseModuleId);
        courseModule.ProgressStatus =
            percentageCompletion < 100.0 ? ProgressStatus.InProgress : ProgressStatus.Completed;
        await courseModule.save();
        return await CourseEnrollmentMapper.toModuleDto(courseModule, percentageCompletion);
    }

    private async getUpdatedCourse(enrollmentId: string, courseEnrollment: UserCourseEnrollment) {
        var percentageCompletion = await this.getCoursePercentageCompletion(enrollmentId);
        courseEnrollment.ProgressStatus =
            percentageCompletion < 100.0 ? ProgressStatus.InProgress : ProgressStatus.Completed;
        await courseEnrollment.save();
        return await CourseEnrollmentMapper.toDto(courseEnrollment, percentageCompletion);
    }

    private  async getModulePercentageCompletion(courseModuleId: string )
    {
        const totalContentCount = await UserCourseContent.count( {
            where : {
                CourseModuleId : courseModuleId
            }
        });

        const noOfContentCompleted = await UserCourseContent.count( {
            where : {
                CourseModuleId : courseModuleId,
                ProgressStatus : ProgressStatus.Completed,
            }
        });
        let percentageCompletion = 0;
        percentageCompletion  = (noOfContentCompleted / totalContentCount ) * 100 ;

        return percentageCompletion ;
    }
    
    private  async getCoursePercentageCompletion(enrollmentId: string)
    {
        const totalModuleCount = await UserCourseModule.count( {
            where : {
                courseId : enrollmentId
            }
        });
        const noOfModuleCompleted  = await UserCourseModule.count( {
            where : {
                enrollmentId   : enrollmentId,
                ProgressStatus : ProgressStatus.Completed,
            }
        });
        let percentageCompletion = 0;
        percentageCompletion  = (noOfModuleCompleted / totalModuleCount ) * 100 ;

        return percentageCompletion ;
    }

}
