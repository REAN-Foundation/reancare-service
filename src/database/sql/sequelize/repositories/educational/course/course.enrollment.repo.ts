
import { ProgressStatus } from '../../../../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import {  UserCourseContentDomainModel, UserCourseEnrollmentDomainModel, UserCourseModuleDomainModel } from "../../../../../../domain.types/educational/course/course.enrollment/course.enrollment.domain.model";
import {  UserCourseContentDto, UserCourseEnrollmentDto, UserCourseModuleDto } from "../../../../../../domain.types/educational/course/course.enrollment/course.enrollment.dto";
import { ICourseEnrollmentRepo } from '../../../../../repository.interfaces/educational/course/course.enrollment.repo.interface';
import { CourseEnrollmentMapper } from '../../../mappers/educational/course/course.enrollment.mapper';
import UserCourseContent from '../../../models/educational/course/user.course.content.model';
import UserCourseEnrollment from '../../../models/educational/course/user.courses.model';
import UserCourseModule from '../../../models/educational/course/user.course.modules.model';
import CourseContent from '../../../models/educational/course/course.content.model';

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
            courseModule.ProgressStatus = ProgressStatus.Pending;
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
                CourseId             : createModel.CourseId,
                UserId               : createModel.UserId ,
                CourseEnrollmentId   : createModel.CourseEnrollmentId,
                CourseModuleId       : createModel.CourseModuleId,
                ModuleId             : createModel.ModuleId,
                ContentId            : createModel.ContentId   ,
                ProgressStatus       : createModel.ProgressStatus,
                PercentageCompletion : createModel.PercentageCompletion,
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

    getModuleProgress = async (moduleId: string):Promise<UserCourseModuleDto> => {
        try {
            var courseModule = await UserCourseModule.findOne({ where: { ModuleId: moduleId } });
            return await this.getUpdatedModule(moduleId, courseModule);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getContentProgress = async (contentId: string): Promise<UserCourseContentDto> => {
        try {
            const courseContent = await UserCourseContent.findOne({ where: { ContentId: contentId } });
            return await this.getUpdatedContent(contentId, courseContent);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    private async getUpdatedContent(contentId: string, courseContent: UserCourseContent) {
        var percentageCompletion = await this.getContentPercentageCompletion(contentId);
        courseContent.ProgressStatus =
            percentageCompletion < 100.0 ? ProgressStatus.InProgress : ProgressStatus.Completed;
        await courseContent.save();
        return await CourseEnrollmentMapper.toContentDto(courseContent, percentageCompletion);
    }

    private async getUpdatedModule(moduleId: string, courseModule: UserCourseModule) {

        var percentageCompletion = await this.getModulePercentageCompletion(moduleId);
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

    private  async getContentPercentageCompletion( contentId:string)
    {
        const noOfContentCompleted = await UserCourseContent.count( {
            where : {
                ContentId      : contentId,
                ProgressStatus : ProgressStatus.Completed,
            }
        });
        let percentageCompletion = 0;
        percentageCompletion  = (noOfContentCompleted) * 100 ;
        return percentageCompletion ;
    }

    private  async getModulePercentageCompletion( moduleId:string)
    {
        const totalContentCount = await CourseContent.count( {
            where : {
                ModuleId : moduleId
            }
        });
        const noOfContentCompleted = await UserCourseContent.count( {
            where : {
                ModuleId       : moduleId,
                ProgressStatus : ProgressStatus.Completed,
            }
        });
        let percentageCompletion = 0;
        percentageCompletion  = (noOfContentCompleted / totalContentCount ) * 100 ;
        return percentageCompletion ;
    }

    private  async getCoursePercentageCompletion(courseEnrollmentId: string)
    {
        const totalModuleCount = await UserCourseModule.count( {
            where : {
                CourseEnrollmentId : courseEnrollmentId
            }
        });
        const noOfModuleCompleted  = await UserCourseModule.count( {
            where : {
                CourseEnrollmentId : courseEnrollmentId,
                ProgressStatus     : ProgressStatus.Completed,
            }
        });
        let percentageCompletion = 0;
        percentageCompletion  = (noOfModuleCompleted / totalModuleCount ) * 100 ;
        return percentageCompletion ;
    }

}
