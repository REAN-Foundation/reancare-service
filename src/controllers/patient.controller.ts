import express from 'express';

import { PatientService } from '../services/patient.service';
import { UserService } from '../services/user.service';
import { PersonService } from '../services/person.service';
import { Helper } from '../common/helper';
import { ResponseHandler } from '../common/response.handler';
import { Loader } from '../startup/loader';
import { Authorizer } from '../auth/authorizer';
import { PatientInputValidator } from './input.validators/patient.input.validator';
import { PatientDetailsDto, PatientDomainModel } from '../data/domain.types/patient.domain.types';

import { Roles } from '../data/domain.types/role.domain.types';
import { PatientMapper } from '../data/database/sequelize/mappers/patient.mapper';
import { UserDomainModel } from '../data/domain.types/user.domain.types';
import { ApiError } from '../common/api.error';
import { AddressDomainModel } from '../data/domain.types/address.domain.types';
import { AddressInputValidator } from './input.validators/address.input.validator';
import { AddressService } from '../services/address.service';

///////////////////////////////////////////////////////////////////////////////////////

export class PatientController {

    //#region member variables and constructors

    _service: PatientService = null;
    _userService: UserService = null;
    _personService: PersonService = null;
    _addressService: AddressService = null;
    _authorizer: Authorizer = null;

    constructor() {
        this._service = Loader.container.resolve(PatientService);
        this._userService = Loader.container.resolve(UserService);
        this._personService = Loader.container.resolve(PersonService);
        this._authorizer = Loader.authorizer;
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response) => {
        try {
            request.context = 'Patient.Create';

            var patientDomainModel = await PatientInputValidator.create(request, response);

            //Throw an error if patient with same name and phone number exists
            var existingPatientCountSharingPhone = await this._service.checkforDuplicatePatients(patientDomainModel);

            var userName = await this._userService.generateUserName(
                patientDomainModel.User.Person.FirstName, 
                patientDomainModel.User.Person.LastName);

            var displayId = await this._userService.generateUserDisplayId(
                Roles.Patient, 
                patientDomainModel.User.Person.Phone, 
                existingPatientCountSharingPhone);

            var displayName = Helper.constructPersonDisplayName(
                patientDomainModel.User.Person.Prefix, 
                patientDomainModel.User.Person.FirstName, 
                patientDomainModel.User.Person.LastName);

            patientDomainModel.User.Person.DisplayName = displayName;
            patientDomainModel.User.UserName = userName;
            patientDomainModel.DisplayId = displayId;

            var userDomainModel = patientDomainModel.User;
            var personDomainModel = userDomainModel.Person;

            //Create a person first

            var person = await this._personService.create(personDomainModel);
            if(person == null) {
                throw new ApiError(400, 'Cannot create person!');
            }
            patientDomainModel.PersonId = person.id;

            var user = await this._userService.create(userDomainModel);
            if(user == null) {
                throw new ApiError(400, 'Cannot create user!');
            }
            patientDomainModel.UserId = user.id;

            //KK: Note - Please add user to appointment service here...
            // var appointmentCustomerModel = PatientMapper.ToAppointmentCustomerDomainModel(userDomainModel);
            // var customer = await this._appointmentService.createCustomer(appointmentCustomerModel);

            patientDomainModel.DisplayId = displayId;
            var patient = await this._service.create(patientDomainModel);
            if(user == null) {
                throw new ApiError(400, 'Cannot create patient!');
            }

            await this.createAddress(request, patient);

            ResponseHandler.success(request, response, 'Patient created successfully!', 201, {Patient: patient});

        } catch (error) {
            //KK: Todo: Add rollback in case of mid-way exception
            ResponseHandler.handleError(request, response, error);
        }
    };

    getByUserId = async (request: express.Request, response: express.Response) => {
        try {
            request.context = 'Patient.GetByUserId';
            this._authorizer.authorize(request, response);

            var userId: string = await PatientInputValidator.getByUserId(request, response);

            const existingUser = await this._userService.getById(userId);
            if(existingUser == null){
                throw new ApiError(404, 'User not found.');
            }

            const patient = await this._service.getByUserId(userId);
            if (patient == null) {
                throw new ApiError(404, 'Patient not found.');
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
            this._authorizer.authorize(request, response);

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

            var userId: string = await PatientInputValidator.getByUserId(request, response);
            const existingUser = await this._userService.getById(userId);
            if(existingUser == null){
                throw new ApiError(404, 'User not found.');
            }

            //This throws an error if the duplicate patient being added
            await this._service.checkforDuplicatePatients(patientDomainModel);

            var userDomainModel: UserDomainModel = patientDomainModel.User;
            var updatedUser = await this._userService.update(patientDomainModel.UserId, userDomainModel);
            if(!updatedUser) {
                throw new ApiError(400, 'Unable to update user!');
            }
            const updatedPatient = await this._service.updateByUserId(patientDomainModel.UserId, patientDomainModel);
            if (updatedPatient == null) {
                throw new ApiError(400, 'Unable to update patient record!');
            }

            await this.createOrUpdateAddress(request, patientDomainModel);

            ResponseHandler.success(request, response, 'Patient records updated successfully!', 200, {
                Patient: updatedPatient,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response) => {
        try {
            request.context = 'Patient.DeleteByUserId';
            if (!this._authorizer.authorize(request, response)) {
                return false;
            }

            var userId: string = await PatientInputValidator.delete(request, response);
            const existingUser = await this._userService.getById(userId);
            if(existingUser == null){
                throw new ApiError(404, 'User not found.');
            }

            const deleted = await this._personService.delete(userId);
            if(!deleted) {
                throw new ApiError(400, 'User cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Patient records deleted successfully!', 200, {
                Deleted: true,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    }

    private async createOrUpdateAddress(request, patientDomainModel: PatientDomainModel) {

        var addressDomainModel: AddressDomainModel = null;
        var addressBody = request.body.Address ?? null;

        if (addressBody != null) {
            addressDomainModel = await AddressInputValidator.getDomainModel(addressBody);
            //get existing address to update
            var existingAddress = await this._addressService.getByUserId(patientDomainModel.UserId);
            if (existingAddress == null) {
                addressDomainModel.UserId = patientDomainModel.UserId;
                var address = await this._addressService.create(addressDomainModel);
                if (address == null) {
                    throw new ApiError(400, 'Cannot create address!');
                }
            }
            else {
                const updatedAddress = await this._addressService.update(
                    existingAddress.id,
                    addressDomainModel
                );
                if (updatedAddress == null) {
                    throw new ApiError(400, 'Unable to update address record!');
                }
            }
        }
    }

    private async createAddress(request, patient: PatientDetailsDto) {
        var addressDomainModel: AddressDomainModel = null;
        var addressBody = request.body.Address ?? null;
        if (addressBody != null) {
            addressDomainModel = await AddressInputValidator.getDomainModel(addressBody);
            addressDomainModel.UserId = patient.User.id;
            var address = await this._addressService.create(addressDomainModel);
            if (address == null) {
                throw new ApiError(400, 'Cannot create address!');
            }
        }
    }

    //#endregion
};
