import express from 'express';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/response.handler';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { HealthProfileDomainModel } from '../../../domain.types/patient/health.profile/health.profile.domain.model';
import { HealthProfileDto } from '../../../domain.types/patient/health.profile/health.profile.dto';
import { HealthProfileService } from '../../../services/patient/health.profile.service';
import { Loader } from '../../../startup/loader';
import { HealthProfileValidator } from '../../validators/patient/health.profile.validator';
import { BaseController } from '../base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class HealthProfileController extends BaseController{

    //#region member variables and constructors

    _service: HealthProfileService = null;

    _validator: HealthProfileValidator = new HealthProfileValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(HealthProfileService);
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

            ResponseHandler.success(request, response, 'Patient health profile record updated successfully!', 200, {
                HealthProfile : updated,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
