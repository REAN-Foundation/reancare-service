import express from 'express';
import { CareplanService } from '../../../services/clinical/careplan.service';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { CareplanValidator } from './careplan.validator';
import { UserService } from '../../../services/users/user/user.service';
import { TimeHelper } from '../../../common/time.helper';
import { DurationType } from '../../../domain.types/miscellaneous/time.types';
import { Logger } from '../../../common/logger';
import { CommunityNetworkService } from '../../../modules/community.bw/community.network.service';
import { Injector } from '../../../startup/injector';
import { BaseController } from '../../../api/base.controller';
import { EnrollmentDomainModel } from '../../../domain.types/clinical/careplan/enrollment/enrollment.domain.model';

///////////////////////////////////////////////////////////////////////////////////////

export class CareplanController extends BaseController {

    //#region member variables and constructors
    _service: CareplanService = Injector.Container.resolve(CareplanService);

    _communityNetworkService: CommunityNetworkService = Injector.Container.resolve(CommunityNetworkService);

    _userService: UserService = Injector.Container.resolve(UserService);

    _validator: CareplanValidator = new CareplanValidator();

    //#endregion

    //#region Action methods

    getAvailableCareplans = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.authorizeOne(request, null, null);
            var plans = this._service.getAvailableCarePlans(request.query.provider as string);

            ResponseHandler.success(request, response, 'Available careplans retrieved successfully!', 200, {
                AvailablePlans : plans,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    enroll = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const model = await this._validator.enroll(request);
            await this.authorizeOne(request, model.PatientUserId);
            var startDate = new Date(model.StartDateStr);

            Logger.instance().log(`Start Date: ${JSON.stringify(startDate)}`);

            var endDate: Date = null;
            if (model.PlanCode === 'Cholesterol' || model.PlanCode === 'Stroke') {
                if (model.EndDateStr) {
                    endDate = new Date(model.EndDateStr);
                    endDate = TimeHelper.addDuration(endDate, 1, DurationType.Day);
                }
                else {
                    endDate = TimeHelper.addDuration(startDate, 91, DurationType.Day);
                }
            } else {
                if (model.EndDateStr) {
                    endDate = new Date(model.EndDateStr);
                    endDate = TimeHelper.addDuration(endDate, 1, DurationType.Day);
                }
                else {
                    endDate = TimeHelper.addDuration(startDate, 84, DurationType.Day);
                }

            }

            Logger.instance().log(`End Date: ${JSON.stringify(endDate)}`);

            model.StartDate = startDate;
            model.EndDate = endDate;

            let enrollment = null;
            if (model.Provider === 'REAN_BW') {
                enrollment = await this._communityNetworkService.enroll(model);
            } else {
                enrollment = await this._service.enroll(model);
            }
            if (enrollment == null) {
                throw new ApiError(400, 'Cannot enroll patient to careplan!');
            }

            ResponseHandler.success(request, response, 'Patient enrollment done successfully!', 201, {
                Enrollment : enrollment,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getPatientEligibility = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const patientUserId = request.params.patientUserId;
            const provider = request.params.provider;
            const careplanCode = request.params.careplanCode;

            const user = await this._userService.getById(patientUserId);
            await this.authorizeOne(request, user.id, user.TenantId);
            const eligibility = await this._service.getPatientEligibility(user, provider, careplanCode);
            ResponseHandler.success(request, response, 'Patient eligibility for careplan retrieved successfully!', 200, {
                Eligibility : eligibility,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getPatientEnrollments = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const patientUserId = request.params.patientUserId;
            await this.authorizeOne(request, patientUserId);
            var isActive = request.query.isActive === 'true' ? true : false;
            const enrollments = await this._service.getPatientEnrollments(patientUserId, isActive);
            ResponseHandler.success(request, response, 'Patient enrollments retrieved successfully!', 200, {
                PatientEnrollments : enrollments,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    fetchTasks = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const careplanId = request.params.id;
            const enrollment = await this._service.getEnrollment(careplanId);
            await this.authorizeOne(request, enrollment.PatientUserId);

            const fetched = await this._service.fetchTasks(careplanId);
            if (!fetched) {
                ResponseHandler.failure(request, response, 'Problem encountered fetching careplan tasks!', 500);
                return;
            }
            ResponseHandler.success(request, response, 'Careplan tasks fetched successfully!', 200, {
                Fetched : fetched,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getWeeklyStatus = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const careplanId = request.params.id; // careplan id
            const enrollment = await this._service.getEnrollment(careplanId);
            if (!enrollment) {
                throw new ApiError(404, 'Careplan enrollment not found!');
            }
            await this.authorizeOne(request, enrollment.PatientUserId);
            var careplanStatus = await this._service.getWeeklyStatus(careplanId);
            ResponseHandler.success(request, response, 'Careplan weekly status fetched successfully!', 200, {
                CareplanStatus : careplanStatus
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    updateRisk = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const model: EnrollmentDomainModel = await this._validator.updateRisk(request);
            // For time being, ...
            // const patientUserId = await this.authorizePerson(model);
            // await this.authorizeOne(request, patientUserId);
            var riskDetails = await this._service.updateRisk(model);
            ResponseHandler.success(request, response, 'Patient risk and complications updated successfully!', 200, {
                RiskDetails : riskDetails
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getPatientActiveEnrollments = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const patientUserId = request.params.patientUserId;
            await this.authorizeOne(request, patientUserId);
            const enrollments = await this._service.getPatientActiveEnrollments(patientUserId);
            ResponseHandler.success(request, response, 'Patient active enrollments retrieved successfully!', 200, {
                PatientEnrollments : enrollments,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    stop = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this._validator.stop(request);
            const careplanEnrollmentId = request.params.id;
            const enrollment = await this._service.getEnrollment(careplanEnrollmentId);
            if (enrollment == null) {
                throw new ApiError(404, 'Care plan enrollment does not exist.');
            }
            await this.authorizeOne(request, enrollment.PatientUserId);
            var updatedEnrollment = await this._service.stop(enrollment);
            ResponseHandler.success(request, response, "Patient's current care plan has been successfully stopped!", 200, {
                Enrollment : updatedEnrollment
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
