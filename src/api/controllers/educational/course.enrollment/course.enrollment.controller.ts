import express from 'express';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { CourseEnrollmentService } from '../../../../services/educational/course.enrollment/course.enrollment.service';
import { Loader } from '../../../../startup/loader';
import { CourseEnrollmentValidator } from '../../../validators/educational/course.enrollment/course.enrollment.validator';
import { BaseController } from '../../base.controller';
import { CourseModuleService } from '../../../../services/educational/course.module/course.module.service';

///////////////////////////////////////////////////////////////////////////////////////

export class CourseEnrollmentController extends BaseController {

    //#region member variables and constructors

    _service: CourseEnrollmentService = null;

    _courseModuleService: CourseModuleService = null;

    _validator: CourseEnrollmentValidator = new CourseEnrollmentValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(CourseEnrollmentService);
        this._courseModuleService = Loader.container.resolve(CourseModuleService);
    }

    //#endregion

    //#region Action methods

    enroll = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            
            await this.setContext('CourseEnrollment.Enroll', request, response);

            const model = await this._validator.enroll(request);
            const courseEnrollment = await this._service.enroll(model);
            if (courseEnrollment == null) {
                throw new ApiError(400, 'Can not enrolled course enrollment!');
            }

            ResponseHandler.success(request, response, 'Course enrollment enrolled successfully!', 201, {
                CourseEnrollment : courseEnrollment,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    startCourseModule = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            
            await this.setContext('CourseEnrollment.StartCourseModule', request, response);

            const model = await this._validator.startCourseModule(request);

            const courseModule = await this._service.startCourseModule(model);
            if (courseModule == null) {
                throw new ApiError(400, 'Can not start course module!');
            }

            ResponseHandler.success(request, response, 'Start course module successfully!', 201, {
                courseModule : courseModule,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    startCourseContent = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            
            await this.setContext('CourseEnrollment.StartCourseContent', request, response);

            const model = await this._validator.startCourseContent(request);
            const courseContent = await this._service.startCourseContent(model);
            if (courseContent == null) {
                throw new ApiError(400, 'Can not start course content!');
            }

            ResponseHandler.success(request, response, 'Start course content successfully!', 201, {
                courseContent : courseContent,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getCourseProgress = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('CourseEnrollment.GetCourseProgress', request, response);

            const enrollmentId: uuid = await this._validator.getParamUuid(request, 'enrollmentId');
            const courseEnrollment = await this._service.getCourseProgress(enrollmentId);
            if (courseEnrollment == null) {
                throw new ApiError(404, 'Course progress not found.');
            }

            ResponseHandler.success(request, response, 'Course progress retrieved successfully!', 200, {
                CourseEnrollment : courseEnrollment,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getModuleProgress = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('CourseEnrollment.GetModuleProgress', request, response);

            const moduleId: uuid = await this._validator.getParamUuid(request, 'moduleId',);
            const courseModule = await this._service.getModuleProgress(moduleId);
            if (courseModule == null) {
                throw new ApiError(404, 'Course module progress not found.');
            }

            ResponseHandler.success(request, response, 'Course module progress retrieved successfully!', 200, {
                CourseModule : courseModule,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getContentProgress = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('CourseEnrollment.GetContentProgress', request, response);

            const contentId: uuid = await this._validator.getParamUuid(request, 'contentId');
            const courseContent = await this._service.getContentProgress(contentId);
            if (courseContent == null) {
                throw new ApiError(404, 'Course content progress not found.');
            }

            ResponseHandler.success(request, response, 'Course content progress retrieved successfully!', 200, {
                CourseContent : courseContent,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getUserEnrollments = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('CourseEnrollment.GetUserEnrollments', request, response);

            const userId: uuid = await this._validator.getParamUuid(request, 'userId');
            const userEnrollments = await this._service.getUserEnrollments(userId);
            if (userEnrollments == null) {
                throw new ApiError(404, 'User enrollments not found.');
            }

            ResponseHandler.success(request, response, 'User enrollments retrieved successfully!', 200, {
                UserEnrollments : userEnrollments,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
