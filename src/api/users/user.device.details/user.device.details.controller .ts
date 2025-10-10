import express from 'express';
import { PersonService } from '../../../services/person/person.service';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { UserDeviceDetailsService } from '../../../services/users/user/user.device.details.service';
import { UserDeviceDetailsValidator } from './user.device.details.validator';
import { PatientService } from '../../../services/users/patient/patient.service';
import { FirebaseNotificationService } from '../../../modules/communication/notification.service/providers/firebase.notification.service';
import { Logger } from '../../../common/logger';
import { Injector } from '../../../startup/injector';
import { PatientAppNameCache } from '../../../modules/ehr.analytics/patient.appname.cache';
import { BaseUserController } from '../base.user.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class UserDeviceDetailsController extends BaseUserController {

    //#region member variables and constructors

    _service = Injector.Container.resolve(UserDeviceDetailsService);

    _personService = Injector.Container.resolve(PersonService);

    _patientService = Injector.Container.resolve(PatientService);

    _firebaseNotificationService = Injector.Container.resolve(FirebaseNotificationService);

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.addUserDeviceDetails(request);

            // TODO - whole of this bussiness logic should get executed in queue.
            ResponseHandler.success(request, response, 'User device details record created successfully!', 201, {
                UserDeviceDetails : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: string = await UserDeviceDetailsValidator.getById(request);
            const record = await this._service.getById(id);
            if (record == null) {
                throw new ApiError(404, ' User device details record not found.');
            }
            await this.authorizeOne(request, record.UserId);

            ResponseHandler.success(request, response, 'User device details record retrieved successfully!', 200, {
                UserDeviceDetails : record,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getByUserId = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: string = await UserDeviceDetailsValidator.getById(request);
            const userId = request.params.userId;
            await this.authorizeOne(request, userId);
            const UserDeviceDetails = await this._service.getByUserId(id);
            if (UserDeviceDetails == null) {
                throw new ApiError(404, 'User device details record not found.');
            }

            ResponseHandler.success(request, response, 'User device details record retrieved successfully!', 200, {
                UserDeviceDetails : UserDeviceDetails,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const filters = await UserDeviceDetailsValidator.search(request);

            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;

            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} user device details records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, {
                UserDeviceDetailsRecords : searchResults
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const domainModel = await UserDeviceDetailsValidator.update(request);

            const id: string = await UserDeviceDetailsValidator.getById(request);
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'User device details record not found.');
            }
            await this.authorizeOne(request, existingRecord.UserId);
            const updated = await this._service.update(domainModel.id, domainModel);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update user device details record!');
            }

            ResponseHandler.success(request, response, 'User device details record updated successfully!', 200, {
                UserDeviceDetails : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: string = await UserDeviceDetailsValidator.getById(request);
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'User device details record not found.');
            }

            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'User device details record cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'User device details record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    sendTestNotification = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            var details = await UserDeviceDetailsValidator.sendTestNotification(request, response);

            // get person by phone number
            const personDetails = await this._personService.getPersonWithPhone(details.Phone);

            // get patient by person id
            const patientDetails = await this._patientService.getByPersonId(personDetails.id);

            // get device tokens for user id
            const UserDeviceDetails = await this._service.getByUserId(patientDetails.UserId);
            if (UserDeviceDetails.length === 0) {
                throw new ApiError(404, ' User device details record not found.');
            }

            const deviceTokens = [];
            UserDeviceDetails.forEach((device) => {
                deviceTokens.push(device.Token);
            });

            const message = await this._firebaseNotificationService.formatNotificationMessage(
                details.Type, details.Title, details.Body, details.Url);

            // call notification service to send multiple devices
            await this._firebaseNotificationService.sendNotificationToMultipleDevice(deviceTokens, message);

            ResponseHandler.success(request, response, 'Notification sent to device successfully!', 201, {
                Title       : details.Title,
                Type        : details.Type,
                Body        : details.Body,
                DeviceCount : deviceTokens.length,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    sendNotificationWithTopic = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            var details = await UserDeviceDetailsValidator.sendNotificationWithTopic(request, response);

            const message = await this._firebaseNotificationService.formatNotificationMessage(
                details.Type, details.Title, details.Body, details.Url, details.Topic);

            // call notification service to send to topic
            await this._firebaseNotificationService.sendMessageToTopic(details.Topic, message);

            ResponseHandler.success(request, response, 'Notification with topic sent successfully!', 201, {
                Topic : details.Topic,
                Title : details.Title,
                Type  : details.Type,
                Body  : details.Body,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    private addUserDeviceDetails = async (request): Promise<any> => {

        const userDeviceDetailsDomainModel = await UserDeviceDetailsValidator.create(request);

        const deviceDetails = {
            Token   : request.body.Token,
            UserId  : request.body.UserId,
            AppName : request.body.AppName
        };

        var existingRecord = await this._service.getExistingRecord(deviceDetails);
        var userDeviceDetails = null;
        if (existingRecord !== null) {
            existingRecord.ChangeCount = existingRecord.ChangeCount + 1;
            userDeviceDetailsDomainModel.ChangeCount = existingRecord.ChangeCount;
            userDeviceDetails = await this._service.update(existingRecord.id, userDeviceDetailsDomainModel);
        } else {
            userDeviceDetails = await this._service.create(userDeviceDetailsDomainModel);
        }

        var existingAppNames = await PatientAppNameCache.get(request.body.UserId);
        if (existingAppNames.indexOf(request.body.AppName) === -1) {
            existingAppNames.push(request.body.AppName);
            PatientAppNameCache.add(request.body.UserId, existingAppNames);
        }

        Logger.instance().log(JSON.stringify(userDeviceDetails));

    };

    //#endregion

}
