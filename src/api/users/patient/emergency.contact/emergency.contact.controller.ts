import express from 'express';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/handlers/response.handler';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { AddressDomainModel } from '../../../../domain.types/general/address/address.domain.model';
import { EmergencyContactRoleList } from '../../../../domain.types/users/patient/emergency.contact/emergency.contact.types';
import { PersonDomainModel } from '../../../../domain.types/person/person.domain.model';
import { AddressService } from '../../../../services/general/address.service';
import { OrganizationService } from '../../../../services/general/organization.service';
import { EmergencyContactService } from '../../../../services/users/patient/emergency.contact.service';
import { PersonService } from '../../../../services/person/person.service';
import { RoleService } from '../../../../services/role/role.service';
import { UserService } from '../../../../services/users/user/user.service';
import { Injector } from '../../../../startup/injector';
import { EmergencyContactValidator } from './emergency.contact.validator';
import { HospitalService } from '../../../../services/hospitals/hospital.service';
import { HealthSystemService } from '../../../../services/hospitals/health.system.service';
import { EHRPatientService } from '../../../../modules/ehr.analytics/ehr.services/ehr.patient.service';
import { PatientBaseController } from '../patient.base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class EmergencyContactController extends PatientBaseController {

    //#region member variables and constructors

    _validator: EmergencyContactValidator = new EmergencyContactValidator();

    _service: EmergencyContactService = Injector.Container.resolve(EmergencyContactService);

    _roleService: RoleService = Injector.Container.resolve(RoleService);

    _orgService: OrganizationService = Injector.Container.resolve(OrganizationService);

    _personService: PersonService = Injector.Container.resolve(PersonService);

    _userService: UserService = Injector.Container.resolve(UserService);

    _addressService: AddressService = Injector.Container.resolve(AddressService);

    _healthSystemService = Injector.Container.resolve(HealthSystemService);

    _hospitalService = Injector.Container.resolve(HospitalService);

    _ehrPatientService = Injector.Container.resolve(EHRPatientService);

    //#endregion

    //#region Action methods

    getContactRoles = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            ResponseHandler.success(request, response, 'Medication time schedules retrieved successfully!', 200, {
                EmergencyContactRoles : EmergencyContactRoleList,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const model = await this._validator.create(request);
            await this.authorizeOne(request, model.PatientUserId);

            const existingContactRoles = await this._service.getContactsCountWithRole(
                model.PatientUserId, model.ContactRelation);

            if (existingContactRoles === 2) {
                const msg = `Number of emergency contacts with role -${model.ContactRelation} cannot be more than 2.`;
                throw new ApiError(409, msg);
            }

            if (model.PatientUserId != null) {
                const user = await this._userService.getById(model.PatientUserId);
                if (user == null) {
                    throw new ApiError(404, `User with an id ${model.PatientUserId} cannot be found.`);
                }
            }

            if (model.ContactPersonId != null) {
                const person = await this._personService.getById(model.ContactPersonId);
                if (person == null) {
                    throw new ApiError(404, `Person with an id ${model.ContactPersonId} cannot be found.`);
                }
                var alreadyExists = await this._service.checkIfContactPersonExists(
                    model.PatientUserId,
                    model.ContactPersonId);
                if (alreadyExists) {
                    throw new ApiError(409 , 'The contact person already exists in the contact list of the patient!');
                }
            } else if (model.ContactPerson != null) {

                var personDomainModel: PersonDomainModel = {
                    Prefix    : model.ContactPerson.Prefix ?? null,
                    FirstName : model.ContactPerson.FirstName ?? null,
                    LastName  : model.ContactPerson.LastName ?? null,
                    Phone     : model.ContactPerson.Phone,
                    Email     : model.ContactPerson.Email ?? null
                };

                const existingPerson = await this._personService.getPersonWithPhone(model.ContactPerson.Phone);
                if (existingPerson !== null) {

                    model.ContactPersonId = existingPerson.id;

                    const alreadyExists = await this._service.checkIfContactPersonExists(
                        model.PatientUserId,
                        model.ContactPersonId);
                    if (alreadyExists) {
                        throw new ApiError(409 , 'The contact person already exists in the contact list of the patient!');
                    }
                }
                else {
                    const person = await this._personService.create(personDomainModel);
                    model.ContactPersonId = person.id;
                }

            } else {
                throw new ApiError(400, "Emergency contact details are incomplete.");
            }

            if (model.AddressId != null) {
                const address = await this._addressService.getById(model.AddressId);
                if (address == null) {
                    throw new ApiError(404, `Address with an id ${model.AddressId} cannot be found.`);
                }
            } else if (model.Address != null) {

                var addressDomainModel: AddressDomainModel = {
                    Type        : "Official",
                    AddressLine : model.Address.AddressLine,
                    City        : model.Address.City ?? null,
                    Country     : model.Address.Country ?? null,
                    PostalCode  : model.Address.PostalCode ?? null
                };
                const address = await this._addressService.create(addressDomainModel);
                model.AddressId = address.id;
            }

            if (model.OrganizationId != null) {
                const organization = await this._orgService.getById(model.OrganizationId);
                if (organization == null) {
                    throw new ApiError(404, `Organization with an id ${model.OrganizationId} cannot be found.`);
                }
            }

            const patientEmergencyContact = await this._service.create(model);
            if (patientEmergencyContact == null) {
                throw new ApiError(400, 'Cannot create patientEmergencyContact!');
            }

            await this._ehrPatientService.addEHRRecordEmergencyContactForAppNames(patientEmergencyContact);

            ResponseHandler.success(request, response, 'Emergency contact created successfully!', 201, {
                EmergencyContact : patientEmergencyContact,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: uuid = await this._validator.getParamUuid(request, 'id');

            const record = await this._service.getById(id);
            if (record == null) {
                throw new ApiError(404, 'Emergency contact not found.');
            }
            await this.authorizeOne(request, record.PatientUserId);
            ResponseHandler.success(request, response, 'Emergency contact retrieved successfully!', 200, {
                EmergencyContact : record,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            let filters = await this._validator.search(request);
            filters = await this.authorizeSearch(request, filters);
            const searchResults = await this._service.search(filters);

            const count = searchResults.Items.length;
            const message =
                count === 0
                    ? 'No records found!'
                    : `Total ${count} patientEmergencyContact records retrieved successfully!`;

            ResponseHandler.success(request, response, message, 200, { EmergencyContacts: searchResults });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const model = await this._validator.update(request);
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const record = await this._service.getById(id);
            if (record == null) {
                throw new ApiError(404, 'Emergency contact not found.');
            }
            await this.authorizeOne(request, record.PatientUserId);
            const updated = await this._service.update(model.id, model);
            if (updated == null) {
                throw new ApiError(400, 'Unable to update patientEmergencyContact record!');
            }

            ResponseHandler.success(request, response, 'Emergency contact record updated successfully!', 200, {
                EmergencyContact : updated,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const record = await this._service.getById(id);
            if (record == null) {
                throw new ApiError(404, 'Emergency contact not found.');
            }
            await this.authorizeOne(request, record.PatientUserId);
            const deleted = await this._service.delete(id);
            if (!deleted) {
                throw new ApiError(400, 'Emergency contact cannot be deleted.');
            }
            ResponseHandler.success(request, response, 'Emergency contact record deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getHealthSystems = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const healthSystems = await this._healthSystemService.getHealthSystemsWithTags(request.query.planName as string);
            if (healthSystems.length === 0) {
                throw new ApiError(400, 'Cannot fetch health systems!');
            }

            ResponseHandler.success(request, response, 'Fetched health systems successfully!', 201, {
                HealthSystems : healthSystems,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getHealthSystemHospitals = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            const healthSystemId : uuid = request.params.healthSystemId;
            const healthSystemHospitals = await this._hospitalService.getHospitalsForHealthSystem(healthSystemId);
            if (healthSystemHospitals.length === 0) {
                throw new ApiError(400, 'Cannot fetch hospitals associated with health system!');
            }

            ResponseHandler.success(request, response, 'Fetched hospitals associated with health system!', 201, {
                HealthSystemHospitals : healthSystemHospitals,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

}
