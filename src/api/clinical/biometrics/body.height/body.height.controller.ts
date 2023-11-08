import express from 'express';
import { EHRAnalyticsHandler } from '../../../../modules/ehr.analytics/ehr.analytics.handler';
import { EHRRecordTypes } from '../../../../modules/ehr.analytics/ehr.record.types';
import { BodyHeightDomainModel } from '../../../../domain.types/clinical/biometrics/body.height/body.height.domain.model';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { Authorizer } from '../../../../auth/authorizer';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { BodyHeightService } from '../../../../services/clinical/biometrics/body.height.service';
import { Loader } from '../../../../startup/loader';
import { BodyHeightValidator } from './body.height.validator';
import { PatientService } from '../../../../services/users/patient/patient.service';
import { Logger } from '../../../../common/logger';
import { UserDeviceDetailsService } from '../../../../services/users/user/user.device.details.service';

///////////////////////////////////////////////////////////////////////////////////////

export class BodyHeightController {

    //#region member variables and constructors

    _service: BodyHeightService = null;

    _patientService: PatientService = null;

    _userDeviceDetailsService: UserDeviceDetailsService = null;

    _authorizer: Authorizer = null;

    constructor() {
        this._service = Loader.container.resolve(BodyHeightService);
        this._authorizer = Loader.authorizer;
        this._patientService = Loader.container.resolve(PatientService);
        this._userDeviceDetailsService = Loader.container.resolve(UserDeviceDetailsService);

    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = "Biometrics.BodyHeight.Create";
            await this._authorizer.authorize(request, response);

            const model = await BodyHeightValidator.create(request);

            const bodyHeight = await this._service.create(model);
            if (bodyHeight == null) {
                throw new ApiError(400, 'Cannot create record for height!');
            }

            const userDetails = await this._patientService.getByUserId(bodyHeight.PatientUserId);
            if (userDetails.User.IsTestUser == false) {
                var userDevices = await this._userDeviceDetailsService.getByUserId(bodyHeight.PatientUserId);
                if (userDevices.length > 0) {
                    userDevices.forEach(userDevice => {
                        if (this.eligibleToAddInEhrRecords(userDevice.AppName)) {
                            this.addEHRRecord(model.PatientUserId, bodyHeight.id, model, userDevice.AppName);
                        } else {
                            Logger.instance().log(`Skip adding details to EHR database as device is not eligible:${bodyHeight.PatientUserId}`);
                        }
                    });
                }
            }

            ResponseHandler.success(request, response, 'Height record created successfully!', 201, {
                BodyHeight : bodyHeight
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = "Biometrics.BodyHeight.GetById";

            await this._authorizer.authorize(request, response);

            const id: string = await BodyHeightValidator.getById(request);

            const bodyHeight = await this._service.getById(id);
            if (bodyHeight == null) {
                throw new ApiError(404, 'Height record not found.');
            }

            ResponseHandler.success(request, response, 'Height record retrieved successfully!', 200, {
                BodyHeight : bodyHeight
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = "Biometrics.BodyHeight.Search";
            await this._authorizer.authorize(request, response);

            const filters = await BodyHeightValidator.search(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} height records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                BodyHeightRecords : searchResults
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = "Biometrics.BodyHeight.Update";
            await this._authorizer.authorize(request, response);

            const model = await BodyHeightValidator.update(request);

            const id: string = await BodyHeightValidator.getById(request);
            const existing = await this._service.getById(id);
            if (existing == null) {
                throw new ApiError(404, 'Height record not found.');
            }

            const updated = await this._service.update(model.id, model);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update height record!');
            }
            const userDetails = await this._patientService.getByUserId(updated.PatientUserId);
            if (userDetails.User.IsTestUser == false) {
                var userDevices = await this._userDeviceDetailsService.getByUserId(model.PatientUserId);
                if (userDevices.length > 0) {
                    userDevices.forEach(userDevice => {
                        if (this.eligibleToAddInEhrRecords(userDevice.AppName)) {
                            this.addEHRRecord(model.PatientUserId, model.id, model);
                        } else {
                            Logger.instance().log(`Skip adding details to EHR database as device is not eligible:${model.PatientUserId}`);
                        }
                    });
                }
            }
            ResponseHandler.success(request, response, 'Height record updated successfully!', 200, {
                BodyHeight : updated
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = "Biometrics.BodyHeight.Delete";
            await this._authorizer.authorize(request, response);

            const id: string = await BodyHeightValidator.getById(request);
            const existing = await this._service.getById(id);
            if (existing == null) {
                throw new ApiError(404, 'Height record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Height record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Height record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

    //#region Privates

    private addEHRRecord = (patientUserId: uuid, recordId: uuid, model: BodyHeightDomainModel, appName?: string) => {
        if (model.BodyHeight) {
            EHRAnalyticsHandler.addFloatRecord(
                patientUserId, recordId, EHRRecordTypes.BodyHeight, model.BodyHeight, model.Unit, null, null, appName);

            //Also add it to the static record
            EHRAnalyticsHandler.addOrUpdatePatient(patientUserId, {
                BodyHeight : model.BodyHeight
            }, appName);
        }
    };

    private eligibleToAddInEhrRecords = (userAppRegistrations) => {

        const eligibleToAddInEhrRecords =
        userAppRegistrations.indexOf('Heart &amp; Stroke Helper™') >= 0 ||
        userAppRegistrations.indexOf('REAN HealthGuru') >= 0 ||
        userAppRegistrations.indexOf('HF Helper') >= 0;

        return eligibleToAddInEhrRecords;
    };

    //#endregion

}
