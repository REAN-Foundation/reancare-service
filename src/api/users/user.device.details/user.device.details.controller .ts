import express from 'express';
import { PersonService } from '../../../services/person/person.service';
import { Authorizer } from '../../../auth/authorizer';
import { ApiError } from '../../../common/api.error';
import { ResponseHandler } from '../../../common/response.handler';
import { UserDeviceDetailsService } from '../../../services/users/user/user.device.details.service';
import { Loader } from '../../../startup/loader';
import { UserDeviceDetailsValidator } from './user.device.details.validator';
import { PatientService } from '../../../services/users/patient/patient.service';
import { FirebaseNotificationService } from '../../../modules/communication/notification.service/providers/firebase.notification.service';
import { Logger } from '../../../common/logger';

///////////////////////////////////////////////////////////////////////////////////////

export class UserDeviceDetailsController {

    //#region member variables and constructors

    _service: UserDeviceDetailsService = null;

    _authorizer: Authorizer = null;

    _personService: PersonService = null;

    _patientService: PatientService = null;

    _firebaseNotificationService: FirebaseNotificationService = null;

    constructor() {
        this._service = Loader.container.resolve(UserDeviceDetailsService);
        this._authorizer = Loader.authorizer;
        this._personService = Loader.container.resolve(PersonService);
        this._patientService = Loader.container.resolve(PatientService);
        this._firebaseNotificationService = Loader.container.resolve(FirebaseNotificationService);
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'UserDeviceDetails.Create';

            this.addUserDeviceDetails(request);

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
            request.context = 'UserDeviceDetails.GetById';

            await this._authorizer.authorize(request, response);

            const id: string = await UserDeviceDetailsValidator.getById(request);

            const UserDeviceDetails = await this._service.getById(id);
            if (UserDeviceDetails == null) {
                throw new ApiError(404, ' User device details record not found.');
            }

            ResponseHandler.success(request, response, 'User device details record retrieved successfully!', 200, {
                UserDeviceDetails : UserDeviceDetails,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getByUserId = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'UserDeviceDetails.GetByUserId';

            await this._authorizer.authorize(request, response);

            const id: string = await UserDeviceDetailsValidator.getById(request);

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
            request.context = 'UserDeviceDetails.Search';
            await this._authorizer.authorize(request, response);

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
            request.context = 'UserDeviceDetails.Update';

            await this._authorizer.authorize(request, response);

            const domainModel = await UserDeviceDetailsValidator.update(request);

            const id: string = await UserDeviceDetailsValidator.getById(request);
            const existingRecord = await this._service.getById(id);
            if (existingRecord == null) {
                throw new ApiError(404, 'User device details record not found.');
            }

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
            request.context = 'UserDeviceDetails.Delete';
            await this._authorizer.authorize(request, response);

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
            request.context = 'UserDeviceDetails.SendTestNotification';
            await this._authorizer.authorize(request, response);

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

            const message = await this._firebaseNotificationService.formatNotificationMessage(details.Type, details.Title, details.Body, details.Url);

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

        Logger.instance().log(JSON.stringify(userDeviceDetails));

    };

    //#endregion

}
