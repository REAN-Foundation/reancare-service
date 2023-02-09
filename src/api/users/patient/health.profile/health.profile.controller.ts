import express from 'express';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { HealthProfileDomainModel } from '../../../../domain.types/users/patient/health.profile/health.profile.domain.model';
import { HealthProfileDto } from '../../../../domain.types/users/patient/health.profile/health.profile.dto';
import { HealthProfileService } from '../../../../services/users/patient/health.profile.service';
import { Loader } from '../../../../startup/loader';
import { HealthProfileValidator } from './health.profile.validator';
import { BaseController } from '../../../base.controller';
import { EHRAnalyticsHandler } from '../../../../custom/ehr.analytics/ehr.analytics.handler';

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

            this.addEHRRecord(patientUserId, domainModel);

            ResponseHandler.success(request, response, 'Patient health profile record updated successfully!', 200, {
                HealthProfile : updated,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

    //#region Privates

    private addEHRRecord = (patientUserId: uuid, model: HealthProfileDomainModel) => {
        if (model.Race) {
            EHRAnalyticsHandler.addOrUpdatePatient(patientUserId, {
                Race : model.Race
            });
        }
        if (model.Ethnicity) {
            EHRAnalyticsHandler.addOrUpdatePatient(patientUserId, {
                Ethnicity : model.Ethnicity
            });
        }
        if (model.MajorAilment) {
            EHRAnalyticsHandler.addOrUpdatePatient(patientUserId, {
                MajorAilment : model.MajorAilment
            });
        }
        if (model.BloodGroup) {
            EHRAnalyticsHandler.addOrUpdatePatient(patientUserId, {
                BloodGroup : model.BloodGroup
            });
        }
        if (model.IsDiabetic) {
            EHRAnalyticsHandler.addOrUpdatePatient(patientUserId, {
                IsDiabetic : model.IsDiabetic
            });
        }
        if (model.IsSmoker) {
            EHRAnalyticsHandler.addOrUpdatePatient(patientUserId, {
                IsSmoker : model.IsSmoker
            });
        }
        if (model.Nationality) {
            EHRAnalyticsHandler.addOrUpdatePatient(patientUserId, {
                Nationality : model.Nationality
            });
        }
        if (model.HasHeartAilment) {
            EHRAnalyticsHandler.addOrUpdatePatient(patientUserId, {
                HasHeartAilment : model.HasHeartAilment
            });
        }
        if (model.IsDiabetic) {
            EHRAnalyticsHandler.addOrUpdatePatient(patientUserId, {
                IsDiabetic : model.IsDiabetic
            });
        }
        if (model.MaritalStatus) {
            EHRAnalyticsHandler.addOrUpdatePatient(patientUserId, {
                MaritalStatus : model.MaritalStatus
            });
        }
        if (model.MaritalStatus) {
            EHRAnalyticsHandler.addOrUpdatePatient(patientUserId, {
                MaritalStatus : model.MaritalStatus
            });
        }
        if (model.MaritalStatus) {
            EHRAnalyticsHandler.addOrUpdatePatient(patientUserId, {
                MaritalStatus : model.MaritalStatus
            });
        }
    };

    //#endregion

}
