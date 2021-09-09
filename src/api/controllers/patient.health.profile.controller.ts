import express from 'express';

import { Helper } from '../../common/helper';
import { ResponseHandler } from '../../common/response.handler';
import { Loader } from '../../startup/loader';
import { Authorizer } from '../../auth/authorizer';
import { PatientService } from '../../services/patient.service';

import { ApiError } from '../../common/api.error';
import { PatientHealthProfileValidator } from '../validators/patient.health.profile.validator';
import { PatientHealthProfileService } from '../../services/patient.health.profile.service';
import { PatientHealthProfileDomainModel } from '../../domain.types/patient.health.profile/patient.health.profile.domain.model';
import { PatientHealthProfileDto } from '../../domain.types/patient.health.profile/patient.health.profile.dto';

///////////////////////////////////////////////////////////////////////////////////////

export class PatientHealthProfileController {

    //#region member variables and constructors

    _service: PatientHealthProfileService = null;

    _patientService: PatientService = null;

    _authorizer: Authorizer = null;

    constructor() {
        this._service = Loader.container.resolve(PatientHealthProfileService);
        this._authorizer = Loader.authorizer;
    }

    //#endregion

    //#region Action methods

    getByPatientUserId = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            request.context = 'HealthProfile.GetByPatientUserId';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const patientUserId: string = await PatientHealthProfileValidator.validatePatientUserId(request);

            const healthProfile : PatientHealthProfileDto = await this._service.getByPatientUserId(patientUserId);
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
            request.context = 'HealthProfile.UpdateByPatientUserId';
            await this._authorizer.authorize(request, response);

            const domainModel: PatientHealthProfileDomainModel = await PatientHealthProfileValidator.update(request);

            const patientUserId : string = await PatientHealthProfileValidator.validatePatientUserId(request);

            const existingHealthProfile = await this._service.getByPatientUserId(patientUserId);
            if (existingHealthProfile == null) {
                throw new ApiError(404, 'Patient health profile not found.');
            }

            const updated = await this._service.updateByPatientUserId(domainModel.id, domainModel);
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
