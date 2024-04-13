import express from 'express';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/handlers/response.handler';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { HealthProfileDomainModel } from '../../../../domain.types/users/patient/health.profile/health.profile.domain.model';
import { HealthProfileDto } from '../../../../domain.types/users/patient/health.profile/health.profile.dto';
import { HealthProfileService } from '../../../../services/users/patient/health.profile.service';
import { Injector } from '../../../../startup/injector';
import { HealthProfileValidator } from './health.profile.validator';
import { PatientService } from '../../../../services/users/patient/patient.service';
import { UserDeviceDetailsService } from '../../../../services/users/user/user.device.details.service';
import { EHRPatientService } from '../../../../modules/ehr.analytics/ehr.services/ehr.patient.service';
import { PatientBaseController } from '../patient.base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class HealthProfileController extends PatientBaseController {

    //#region member variables and constructors

    _service: HealthProfileService = Injector.Container.resolve(HealthProfileService);

    _patientService: PatientService = Injector.Container.resolve(PatientService);

    _userDeviceDetailsService: UserDeviceDetailsService = Injector.Container.resolve(UserDeviceDetailsService);

    _validator: HealthProfileValidator = new HealthProfileValidator();

    _ehrPatientService: EHRPatientService = Injector.Container.resolve(EHRPatientService);

    //#endregion

    //#region Action methods

    getByPatientUserId = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const patientUserId: uuid = await this._validator.getParamUuid(request, 'patientUserId');
            await this.authorizeOne(request, patientUserId);
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

            const patientUserId: uuid = await this._validator.getParamUuid(request, 'patientUserId');
            await this.authorizeOne(request, patientUserId);
            const model: HealthProfileDomainModel = await this._validator.update(request);

            const record = await this._service.getByPatientUserId(patientUserId);
            if (record == null) {
                throw new ApiError(404, 'Patient health profile not found.');
            }

            const updated = await this._service.updateByPatientUserId(patientUserId, model);
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
