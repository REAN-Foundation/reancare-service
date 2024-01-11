import express from 'express';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { HealthProfileDomainModel } from '../../../../domain.types/users/patient/health.profile/health.profile.domain.model';
import { HealthProfileDto } from '../../../../domain.types/users/patient/health.profile/health.profile.dto';
import { HealthProfileService } from '../../../../services/users/patient/health.profile.service';
import { HealthProfileValidator } from './health.profile.validator';
import { BaseController } from '../../../base.controller';
import { PatientService } from '../../../../services/users/patient/patient.service';
import { UserDeviceDetailsService } from '../../../../services/users/user/user.device.details.service';
import { Injector } from '../../../../startup/injector';
import { EHRPatientService } from '../../../../modules/ehr.analytics/ehr.services/ehr.patient.service';

///////////////////////////////////////////////////////////////////////////////////////

export class HealthProfileController extends BaseController {

    //#region member variables and constructors

    _service: HealthProfileService = null;

    _patientService: PatientService = null;

    _userDeviceDetailsService: UserDeviceDetailsService = null;

    _validator: HealthProfileValidator = new HealthProfileValidator();

    _ehrPatientService: EHRPatientService = Injector.Container.resolve(EHRPatientService);

    constructor() {
        super();
        this._service = Injector.Container.resolve(HealthProfileService);
        this._patientService = Injector.Container.resolve(PatientService);
        this._userDeviceDetailsService = Injector.Container.resolve(UserDeviceDetailsService);
    }

    //#endregion

    //#region Action methods

    getByPatientUserId = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('HealthProfile.GetByPatientUserId', request, response);

            const patientUserId: uuid = await this._validator.getParamUuid(request, 'patientUserId');

            const healthProfile : HealthProfileDto = await this._service.getByPatientUserId(patientUserId);
            if (healthProfile == null) {
                throw new ApiError(404, 'Patient health profile not found.');
            }

            ResponseHandler.success(request, response, 'Patient health profile retrieved successfully!', 200, {
                HealthProfile : healthProfile,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    updateByPatientUserId = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('HealthProfile.UpdateByPatientUserId', request, response);

            const patientUserId: uuid = await this._validator.getParamUuid(request, 'patientUserId');
            const domainModel: HealthProfileDomainModel = await this._validator.update(request);

            const existingHealthProfile = await this._service.getByPatientUserId(patientUserId);
            if (existingHealthProfile == null) {
                throw new ApiError(404, 'Patient health profile not found.');
            }

            const updated = await this._service.updateByPatientUserId(patientUserId, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update Patient health profile record!');
            }

            await this._ehrPatientService.addEHRRecordHealthProfileForAppNames(updated);

            ResponseHandler.success(request, response, 'Patient health profile record updated successfully!', 200, {
                HealthProfile : updated,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
