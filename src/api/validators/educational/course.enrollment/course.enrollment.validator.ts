import express from 'express';
import { UserCourseContentDomainModel, UserCourseEnrollmentDomainModel, UserCourseModuleDomainModel } from '../../../../domain.types/educational/course.enrollment/course.enrollment.domain.model';
import { BaseValidator, Where } from '../../base.validator';
 
///////////////////////////////////////////////////////////////////////////////////////
 
export class CourseEnrollmentValidator extends BaseValidator {

    constructor() {
        super();
    }

    getDomainModel = (request: express.Request): UserCourseEnrollmentDomainModel => {
 
        const UserCourseEnrollmentModel: UserCourseEnrollmentDomainModel = {
            CourseId       : request.body.CourseId,
            UserId         : request.body.UserId,
            EnrollmentDate : request.body.EnrollmentDate,
            ProgressStatus : request.body.ProgressStatus,
        };
 
        return UserCourseEnrollmentModel;
    };

    getModuleDomainModel = (request: express.Request): UserCourseModuleDomainModel => {
 
        const UserCourseModuleModel: UserCourseModuleDomainModel = {
            CourseId           : request.body.CourseId,
            UserId             : request.body.UserId,
            CourseEnrollmentId : request.body.CourseEnrollmentId,
            ModuleId           : request.body.ModuleId ,
            StartDate          : request.body.StartDate,
            EndDate            : request.body.EndDate ,
            ProgressStatus     : request.body.ProgressStatus,
        };
 
        return UserCourseModuleModel;
    };
 
    getContentDomainModel = (request: express.Request): UserCourseContentDomainModel => {
 
        const UserCourseContentModel: UserCourseContentDomainModel = {
            CourseId           : request.body.CourseId,
            UserId             : request.body.UserId,
            CourseEnrollmentId : request.body.CourseEnrollmentId,
            ModuleId           : request.body.ModuleId,
            ContentId          : request.body.ContentId,
            CourseModuleId     : request.body.CourseModuleId,
            ProgressStatus     : request.body.ProgressStatus,
        };
 
        return UserCourseContentModel;
    };

    enroll = async (request: express.Request): Promise<UserCourseEnrollmentDomainModel> => {
        await this.validateCreateBody(request);
        return this.getDomainModel(request);
    };

    startCourseModule = async (request: express.Request): Promise<UserCourseModuleDomainModel> => {
        await this.validateStartModuleBody(request);
        return this.getModuleDomainModel(request);
    };

    startCourseContent = async (request: express.Request): Promise<UserCourseContentDomainModel> => {
        await this.validateStartContentBody(request);
        return this.getContentDomainModel(request);
    };

    private  async validateCreateBody(request) {

        await this.validateUuid(request, 'CourseId', Where.Body, false, true);
        await this.validateUuid(request, 'UserId', Where.Body, true, false);
        await this.validateDate(request, 'EnrollmentDate', Where.Body, false, true);
        
        this.validateRequest(request);
    }

    private  async validateStartModuleBody(request) {

        await this.validateUuid(request, 'CourseId', Where.Body, false, true);
        await this.validateUuid(request, 'UserId', Where.Body, true, false);
        await this.validateUuid(request, 'ParentNodeId', Where.Body, false, true);
        await this.validateUuid(request, 'CourseEnrollmentId', Where.Body, true, false);
        await this.validateUuid(request, 'ModuleId', Where.Body, true, false);
        await this.validateDate(request, 'StartDate', Where.Body, false, true);
        await this.validateDate(request, 'EndDate', Where.Body, false, true);
        
        this.validateRequest(request);
    }

    private  async validateStartContentBody(request) {

        await this.validateUuid(request, 'CourseId', Where.Body, false, true);
        await this.validateUuid(request, 'UserId', Where.Body, true, false);
        await this.validateUuid(request, 'CourseEnrollmentId', Where.Body, true, false);
        await this.validateUuid(request, 'ModuleId', Where.Body, true, false);
        await this.validateUuid(request, 'ContentId ', Where.Body, true, false);
        await this.validateUuid(request, 'CourseModuleId ', Where.Body, true, false);
        
        this.validateRequest(request);
    }
 
}
