import express from 'express';
import { query, body, oneOf, validationResult, param } from 'express-validator';

import { PatientService } from '../services/patient.service';
import { Helper } from '../common/helper';
import { ResponseHandler } from '../common/response.handler';
import { Loader } from '../startup/loader';
import { Authorizer } from '../auth/authorizer';
import { PatientInputValidator } from './input.validators/patient.input.validator';
import { PatientDomainModel } from '../data/domain.types/patient.domain.types';
import { UserService } from '../services/user.service';
import { Roles } from '../data/domain.types/role.domain.types';
import { PatientMapper } from '../data/database/sequelize/mappers/patient.mapper';
import { UserDomainModel } from '../data/domain.types/user.domain.types';
import { ApiError } from '../common/api.error';

///////////////////////////////////////////////////////////////////////////////////////

export class PatientController {

    //#region member variables and constructors

    _service: PatientService = null;
    _userService: UserService = null;
    _authorizer: Authorizer = null;

    constructor() {
        this._service = Loader.container.resolve(PatientService);
        this._userService = Loader.container.resolve(UserService);
        this._authorizer = Loader.authorizer;
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response) => {
        try {
            request.context = 'Patient.Create';
            if (!this._authorizer.authorize(request, response)) {
                return false;
            }

            var patientDomainModel: PatientDomainModel = await PatientInputValidator.create(request, response);

            //Throw an error if patient with same name and phone number exists
            var existingPatientCountSharingPhone = await this._service.checkforDuplicatePatients(patientDomainModel);

            var userName = await this._userService.generateUserName(patientDomainModel.FirstName, patientDomainModel.LastName);
            var displayId = await this._userService.generateUserDisplayId(Roles.Patient, patientDomainModel.Phone, existingPatientCountSharingPhone);
            var displayName = Helper.constructUserDisplayName(patientDomainModel.Prefix, patientDomainModel.FirstName, patientDomainModel.LastName);
            var userDomainModel: UserDomainModel = PatientMapper.toUserDomainModel(patientDomainModel);
            userDomainModel.DisplayName = displayName;
            userDomainModel.UserName =  userName;

            var user = await this._userService.createUser(userDomainModel);
            if(user == null) {
                throw new ApiError(400, 'Cannot create user!');
            }
            patientDomainModel.UserId = user.id;

            //KK: Note - Please add user to appointment service here...
            // var appointmentCustomerModel = PatientMapper.ToAppointmentCustomerDomainModel(userDomainModel);
            // var customer = await this._appointmentService.createCustomer(appointmentCustomerModel);

            var patient = await this._service.create(patientDomainModel);
            if(user == null) {
                throw new ApiError(400, 'Cannot create patient!');
            }
            ResponseHandler.success(request, response, 'Patient created successfully!', 201, {Patient: patient});
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getByUserId = async (request: express.Request, response: express.Response) => {
        try {
            request.context = 'Patient.GetByUserId';
            if (!this._authorizer.authorize(request, response)) {
                return false;
            }
            var id: string = await PatientInputValidator.getByUserId(request, response);
            const patient = await this._service.getByUserId(id);
            if (patient == null) {
                ResponseHandler.failure(request, response, 'Patient not found.', 404);
                return;
            }
            ResponseHandler.success(request, response, 'Patient retrieved successfully!', 200, {
                Patient: patient,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response) => {
        try {
            request.context = 'Patient.Search';
            if (!this._authorizer.authorize(request, response)) {
                return false;
            }
            var filters = await PatientInputValidator.search(request, response);

            var extractFull: boolean =
                request.query.fullDetails != 'undefined' && typeof request.query.fullDetails == 'boolean'
                    ? request.query.fullDetails
                    : false;

            const users = await this._service.search(filters, extractFull);
            if (users != null) {
                var count = users.length;
                var message =
                    count == 0 ? 'No records found!' : `Total ${count} user records retrieved successfully!`;
                ResponseHandler.success(request, response, message, 200, {
                    users: users,
                });
                return;
            }
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };
    
    updateByUserId = async (request: express.Request, response: express.Response) => {
        try {
            request.context = 'Patient.UpdateByUserId';
            if (!this._authorizer.authorize(request, response)) {
                return false;
            }
            var patientDomainModel = await PatientInputValidator.updateByUserId(request, response);

            //This throws an error if the duplicate patient being added
            await this._service.checkforDuplicatePatients(patientDomainModel);

            var userDomainModel: UserDomainModel = PatientMapper.toUserDomainModel(patientDomainModel);
            var updatedUser = await this._userService.update(patientDomainModel.UserId, userDomainModel);
            if(!updatedUser) {
                throw new ApiError(400, 'Unable to update user!');
            }
            const updatedPatient = await this._service.updateByUserId(patientDomainModel.UserId, patientDomainModel);
            if (updatedPatient == null) {
                throw new ApiError(400, 'Unable to update patient record!');
            }
            ResponseHandler.success(request, response, 'Patient recors updated successfully!', 200, {
                Patient: updatedPatient,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion
};
