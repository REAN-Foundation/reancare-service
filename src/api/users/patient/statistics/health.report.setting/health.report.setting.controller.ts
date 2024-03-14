import express from 'express';
import { HealthReportSettingService } from '../../../../../services/users/patient/health.report.setting.service';
import { HealthReportSettingValidator } from './health.report.setting.validatpr';
import { ResponseHandler } from '../../../../../common/handlers/response.handler';
import { ApiError } from '../../../../../common/api.error';
import { uuid } from 'aws-sdk/clients/customerprofiles';
import { Injector } from '../../../../../startup/injector';

///////////////////////////////////////////////////////////////////////////////////////

export class HealthReportSettingController {

    //#region member variables and constructors

    _service: HealthReportSettingService = Injector.Container.resolve(HealthReportSettingService);

    _validator: HealthReportSettingValidator = new HealthReportSettingValidator();

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const createModel = await this._validator.create(request);
            const reportSetting = await this._service.create(createModel);

            if (reportSetting == null) {
                throw new ApiError(400, 'Cannot create health report setting!');
            }
            ResponseHandler.success(request, response, 'Health report setting created successfully!', 201, {
                Setting : reportSetting,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };
    
    getByUserId = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const userId: uuid = await this._validator.getParamUuid(request, 'patientUserId');
            const existingSettings = await this._service.getByUserId(userId);
            if (existingSettings == null) {
                throw new ApiError(404, 'Patient health report settings not found.');
            }

            ResponseHandler.success(request, response, 'Patient health report settings retrieved successfully!', 200, {
                Settings : existingSettings,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    updateByUserId = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const userId: uuid = await this._validator.getParamUuid(request, 'patientUserId');

            const existingSettings = await this._service.getByUserId(userId);
            if (existingSettings == null) {
                throw new ApiError(404, 'Patient health report settings not found.');
            }

            const updateModel = await this._validator.update(request);
            updateModel.PatientUserId = userId;

            const updatedReportSetting = await this._service.updateByUserId(
                userId,
                updateModel
            );
            if (updatedReportSetting == null) {
                throw new ApiError(400, 'Unable to update patient health report settings!');
            }

            ResponseHandler.success(request, response, 'Patient health report settings updated successfully!', 200, {
                Settings : updatedReportSetting,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

}
