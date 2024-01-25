import express from 'express';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { StatisticsService } from '../../../services/statistics/statistics.service';
import { StatistcsValidator } from './statistics.validator';
import { ApiError } from '../../../common/api.error';
import { Injector } from '../../../startup/injector';

///////////////////////////////////////////////////////////////////////////////////////

export class StatisticsController {

    //#region member variables and constructors
    _service: StatisticsService = Injector.Container.resolve(StatisticsService);

    _validator = new StatistcsValidator();

    //#endregion

    //#region Action methods

    getUsersCount = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const filters = await this._validator.searchFilter(request);
            const usersCountStats  = await this._service.getUsersCount(filters);
            const message = 'Users count stats retrieved successfully!';
            ResponseHandler.success(request, response,message, 200, {
                UsersCountStats : usersCountStats  });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getUsersStats = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const filters = await this._validator.searchFilter(request);
            const usersStats = await this._service.getUsersStats(filters);
            const message = 'Users stats retrieved successfully!';
            ResponseHandler.success(request, response,message, 200, {
                UsersStats : usersStats });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getUsersByRole = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const filters = await this._validator.searchFilter(request);
            const roleDistribution = await this._service.getUsersByRole(filters);
            const message = 'Role wise distribution retrieved successfully!';
            ResponseHandler.success(request, response,message, 200, {
                RoleDistribution : roleDistribution });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getUsersByGender = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const filters = await this._validator.searchFilter(request);
            const genderWiseUsers = await this._service.getUsersByGender(filters);
            const message = 'Gender wise users retrieved successfully!';
            ResponseHandler.success(request, response,message, 200, {
                GenderWiseUsers : genderWiseUsers });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getUsersByAge = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const filters = await this._validator.searchFilterForAge(request);
            const ageWiseUsers = await this._service.getUsersByAge(filters);
            const message = 'Age wise users retrieved successfully!';
            ResponseHandler.success(request, response,message, 200, {
                AgeWiseUsers : ageWiseUsers });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getUsersByMaritalStatus = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const filters = await this._validator.searchFilter(request);
            const maritalStatusWiseUsers = await this._service.getUsersByMaritalStatus(filters);
            const message = 'Marital status wise users retrieved successfully!';
            ResponseHandler.success(request, response,message, 200, {
                MaritalStatusWiseUsers : maritalStatusWiseUsers });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getUsersByDeviceDetail = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const filters = await this._validator.searchFilter(request);
            const deviceDetailWiseUsers = await this._service.getUsersByDeviceDetail(filters);
            const message = 'Device detail wise users retrieved successfully!';
            ResponseHandler.success(request, response,message, 200, {
                DeviceDetailWiseUsers : deviceDetailWiseUsers });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getUsersByEnrollment = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const filters = await this._validator.searchFilter(request);
            const enrollmentUsers = await this._service.getUsersByEnrollment(filters);
            const message = 'Enrollment users retrieved successfully!';
            ResponseHandler.success(request, response,message, 200, {
                EnrollmentUsers : enrollmentUsers });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    updateAppDownloadCount = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const model = await this._validator.updateAppDownloads(request);
            const appDownload = await this._service.updateAppDownloadCount(model);
            if (appDownload == null) {
                throw new ApiError(400, 'Could not add a app downloads!');
            }

            ResponseHandler.success(request, response, 'App downloads added successfully!', 201, {
                AppDownload : appDownload,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getAppDownlodCount = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const appDownload = await this._service.getAppDownlodCount();
            if (appDownload == null) {
                throw new ApiError(404, 'App Download  not found.');
            }

            ResponseHandler.success(request, response, 'App Download retrieved successfully!', 200, {
                AppDownload : appDownload,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getUsersByCountry = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const filters = await this._validator.searchFilter(request);
            const countryWiseUsers = await this._service.getUsersByCountry(filters);
            const message = 'Country wise users retrieved successfully!';
            ResponseHandler.success(request, response,message, 200, {
                CountryWiseUsers : countryWiseUsers });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getUsersByMajorAilment = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const filters = await this._validator.searchFilter(request);
            const majorAilmentDistribution = await this._service.getUsersByMajorAilment(filters);
            const message = 'Major ailment distribution wise users retrieved successfully!';
            ResponseHandler.success(request, response,message, 200, {
                MajorAilmentDistribution : majorAilmentDistribution });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getUsersByObesity = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const filters = await this._validator.searchFilter(request);
            const obesityDistribution = await this._service.getUsersByObesity(filters);
            const message = 'Obesity distribution wise users retrieved successfully!';
            ResponseHandler.success(request, response,message, 200, {
                ObesityDistribution : obesityDistribution });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getUsersByAddiction = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const filters = await this._validator.searchFilter(request);
            const addictionDistribution  = await this._service.getUsersByAddiction(filters);
            const message = 'Addiction distribution of users retrieved successfully!';
            ResponseHandler.success(request, response,message, 200, {
                AddictionDistribution : addictionDistribution  });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getUsersByHealthPillar = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const filters = await this._validator.searchFilter(request);
            const healthPillarDistribution  = await this._service.getUsersByHealthPillar(filters);
            const message = 'Health pillar distribution of users retrieved successfully!';
            ResponseHandler.success(request, response,message, 200, {
                HealthPillarDistribution : healthPillarDistribution  });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getUsersByBiometrics = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const filters = await this._validator.searchFilter(request);
            const biometrics = await this._service.getUsersByBiometrics(filters);
            const message = 'Biometrics distribution retrieved successfully!';
            ResponseHandler.success(request, response,message, 200, {
                Biometrics : biometrics });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getAllYears = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const allYears = await this._service.getAllYears();
            const message = 'Years retrieved successfully!';
            ResponseHandler.success(request, response,message, 200, {
                Years : allYears });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

}

