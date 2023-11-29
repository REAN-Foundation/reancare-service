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
import { EHRAnalyticsHandler } from '../../../../modules/ehr.analytics/ehr.analytics.handler';
import { PatientService } from '../../../../services/users/patient/patient.service';
import { Logger } from '../../../../common/logger';
import { UserDeviceDetailsService } from '../../../../services/users/user/user.device.details.service';

///////////////////////////////////////////////////////////////////////////////////////

export class HealthProfileController extends BaseController{

    //#region member variables and constructors

    _service: HealthProfileService = null;

    _patientService: PatientService = null;

    _userDeviceDetailsService: UserDeviceDetailsService = null;

    _validator: HealthProfileValidator = new HealthProfileValidator();

    _ehrAnalyticsHandler: EHRAnalyticsHandler = new EHRAnalyticsHandler();

    constructor() {
        super();
        this._service = Loader.container.resolve(HealthProfileService);
        this._patientService = Loader.container.resolve(PatientService);
        this._userDeviceDetailsService = Loader.container.resolve(UserDeviceDetailsService);
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

            // get user details to add records in ehr database
            var eligibleAppNames = await this._ehrAnalyticsHandler.getEligibleAppNames(patientUserId);
            if (eligibleAppNames.length > 0) {
                for (var appName of eligibleAppNames) { 
                    this.addEHRRecord(patientUserId, updated, appName);
                }
            } else {
                Logger.instance().log(`Skip adding details to EHR database as device is not eligible:${patientUserId}`);
            }

            ResponseHandler.success(request, response, 'Patient health profile record updated successfully!', 200, {
                HealthProfile : updated,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

    //#region Privates

    private addEHRRecord = (patientUserId: uuid, model: HealthProfileDto, appName?: string) => {
        var details = {};
        if (model.Race) {
            details['Race'] = model.Race;
        }
        if (model.Ethnicity) {
            details['Ethnicity'] = model.Ethnicity;  
        }
        if (model.MajorAilment) {
            details['MajorAilment'] = model.MajorAilment;
        }
        if (model.BloodGroup) {
            details['BloodGroup'] = model.BloodGroup;
        }
        if (model.IsDiabetic != null) {
            details['IsDiabetic'] = model.IsDiabetic;
        }
        if (model.IsSmoker != null) {
            details['IsSmoker'] = model.IsSmoker;
        }
        if (model.Nationality) {
            details['Nationality'] = model.Nationality;
        }
        if (model.HasHeartAilment != null) {
            details['HasHeartAilment'] = model.HasHeartAilment;
        }
        if (model.HasHighBloodPressure != null) {
            details['HasHighBloodPressure'] = model.HasHighBloodPressure;
        }
        if (model.HasHighCholesterol != null) {
            details['HasHighCholesterol'] = model.HasHighCholesterol;
        }
        if (model.Occupation) {
            details['Occupation'] = model.Occupation;
        }
        if (model.OtherConditions) {
            details['OtherConditions'] = model.OtherConditions;
        }
        if (model.IsDiabetic != null) {
            details['IsDiabetic'] = model.IsDiabetic;
        }
        if (model.MaritalStatus) {
            details['MaritalStatus'] = model.MaritalStatus;
        }
        if (model.CreatedAt) {
            details['RecordDate'] = new Date(model.CreatedAt);
        }


        EHRAnalyticsHandler.addOrUpdatePatient(patientUserId, details, appName);

    
    };

    //#endregion

}
