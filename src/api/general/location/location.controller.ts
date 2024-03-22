import express from 'express';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { RoleService } from '../../../services/role/role.service';
import { LocationValidator } from './location.validator';
import { Injector } from '../../../startup/injector';
import { LocationService } from '../../../services/general/location.service';
import { Logger } from '../../../common/logger';
import { PatientService } from '../../../services/users/patient/patient.service';
import { UserService } from '../../../services/users/user/user.service';

///////////////////////////////////////////////////////////////////////////////////////

export class LocationController {

    //#region member variables and constructors

    _service: LocationService = Injector.Container.resolve(LocationService);

    _roleService: RoleService = Injector.Container.resolve(RoleService);

    _patientService: PatientService = Injector.Container.resolve(PatientService);

    _userService: UserService = Injector.Container.resolve(UserService);

    _validator = new LocationValidator();

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const domainModel = await this._validator.create(request);
            const locationDetails = {
                PatientUserId   : request.body.PatientUserId,
                City            : request.body.City,
                CurrentTimezone : request.body.CurrentTimezone,
                IsActive        : true
            };

            var existingRecord = await this._service.getExistingRecord(locationDetails);

            if (existingRecord == null) {
                // set all existing record as inactive                
                await this._service.invalidateExistingRecords(request.body.PatientUserId);
                var location = await this._service.create(domainModel);
            } else {
                Logger.instance().log(`Location details for user already exist:: ${JSON.stringify(existingRecord)}`);
            }

            // check users current timezone and update if needed
            const patient = await this._patientService.getByUserId(request.body.PatientUserId);

            if (patient.User.CurrentTimeZone !== request.body.CurrentTimezone) {
                patient.User.CurrentTimeZone = request.body.CurrentTimezone;
                const updatedDetails = await this._userService.update(request.body.PatientUserId, { CurrentTimeZone : patient.User.CurrentTimeZone });
                Logger.instance().log(`Updated timezone in user table :: ${JSON.stringify(updatedDetails.CurrentTimeZone)}`);
            }

            ResponseHandler.success(request, response, 'Location record created successfully!', 201, {
                Location : location,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
