import express from 'express';
import { ApiError } from '../../../../common/api.error';
import { ResponseHandler } from '../../../../common/response.handler';
import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { AddressDomainModel } from '../../../../domain.types/general/address/address.domain.model';
import { EmergencyContactRoleList, EmergencyContactRoles } from '../../../../domain.types/users/patient/emergency.contact/emergency.contact.types';
import { PersonDomainModel } from '../../../../domain.types/person/person.domain.model';
import { AddressService } from '../../../../services/general/address.service';
import { OrganizationService } from '../../../../services/general/organization.service';
import { EmergencyContactService } from '../../../../services/users/patient/emergency.contact.service';
import { PersonService } from '../../../../services/person/person.service';
import { RoleService } from '../../../../services/role/role.service';
import { UserService } from '../../../../services/users/user/user.service';
import { Loader } from '../../../../startup/loader';
import { EmergencyContactValidator } from './emergency.contact.validator';
import { BaseController } from '../../../base.controller';
import { EHRAnalyticsHandler } from '../../../../modules/ehr.analytics/ehr.analytics.handler';
import { HospitalService } from '../../../../services/hospitals/hospital.service';
import { HealthSystemService } from '../../../../services/hospitals/health.system.service';
import { Logger } from '../../../../common/logger';

///////////////////////////////////////////////////////////////////////////////////////

export class EmergencyContactController extends BaseController {

    //#region member variables and constructors

    _service: EmergencyContactService = null;

    _roleService: RoleService = null;

    _validator: EmergencyContactValidator = new EmergencyContactValidator();

    _orgService: OrganizationService = null;

    _personService: PersonService = null;

    _userService: UserService = null;

    _addressService: AddressService = null;

    _healthSystemService: HealthSystemService = null;

    _hospitalService: HospitalService = null;

    _ehrAnalyticsHandler: EHRAnalyticsHandler = new EHRAnalyticsHandler();

    constructor() {
        super();
        this._service = Loader.container.resolve(EmergencyContactService);
        this._roleService = Loader.container.resolve(RoleService);
        this._personService = Loader.container.resolve(PersonService);
        this._orgService = Loader.container.resolve(OrganizationService);
        this._userService = Loader.container.resolve(UserService);
        this._addressService = Loader.container.resolve(AddressService);
        this._healthSystemService = Loader.container.resolve(HealthSystemService);
        this._hospitalService = Loader.container.resolve(HospitalService);
        this._authorizer = Loader.authorizer;
    }

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
            await this.setContext('Emergency.Contact.Create', request, response);

            const domainModel = await this._validator.create(request);

            const existingContactRoles = await this._service.getContactsCountWithRole(
                domainModel.PatientUserId, domainModel.ContactRelation);

            if (existingContactRoles === 2) {
                const msg = `Number of emergency contacts with role -${domainModel.ContactRelation} cannot be more than 2.`;
                throw new ApiError(409, msg);
            }

            if (domainModel.PatientUserId != null) {
                const user = await this._userService.getById(domainModel.PatientUserId);
                if (user == null) {
                    throw new ApiError(404, `User with an id ${domainModel.PatientUserId} cannot be found.`);
                }
            }

            if (domainModel.ContactPersonId != null) {
                const person = await this._personService.getById(domainModel.ContactPersonId);
                if (person == null) {
                    throw new ApiError(404, `Person with an id ${domainModel.ContactPersonId} cannot be found.`);
                }
                var alreadyExists = await this._service.checkIfContactPersonExists(
                    domainModel.PatientUserId,
                    domainModel.ContactPersonId);
                if (alreadyExists) {
                    throw new ApiError(409 , 'The contact person already exists in the contact list of the patient!');
                }
            } else if (domainModel.ContactPerson != null) {

                var personDomainModel: PersonDomainModel = {
                    Prefix    : domainModel.ContactPerson.Prefix ?? null,
                    FirstName : domainModel.ContactPerson.FirstName ?? null,
                    LastName  : domainModel.ContactPerson.LastName ?? null,
                    Phone     : domainModel.ContactPerson.Phone,
                    Email     : domainModel.ContactPerson.Email ?? null
                };

                var existingPerson = await this._personService.getPersonWithPhone(domainModel.ContactPerson.Phone);
                if (existingPerson !== null) {

                    domainModel.ContactPersonId = existingPerson.id;

                    var alreadyExists = await this._service.checkIfContactPersonExists(
                        domainModel.PatientUserId,
                        domainModel.ContactPersonId);
                    if (alreadyExists) {
                        throw new ApiError(409 , 'The contact person already exists in the contact list of the patient!');
                    }
                }
                else {
                    const person = await this._personService.create(personDomainModel);
                    domainModel.ContactPersonId = person.id;
                }

            } else {
                throw new ApiError(400, "Emergency contact details are incomplete.");
            }

            if (domainModel.AddressId != null) {
                const address = await this._addressService.getById(domainModel.AddressId);
                if (address == null) {
                    throw new ApiError(404, `Address with an id ${domainModel.AddressId} cannot be found.`);
                }
            } else if (domainModel.Address != null) {

                var addressDomainModel: AddressDomainModel = {
                    Type        : "Official",
                    AddressLine : domainModel.Address.AddressLine,
                    City        : domainModel.Address.City ?? null,
                    Country     : domainModel.Address.Country ?? null,
                    PostalCode  : domainModel.Address.PostalCode ?? null
                };
                const address = await this._addressService.create(addressDomainModel);
                domainModel.AddressId = address.id;
            }

            if (domainModel.OrganizationId != null) {
                const organization = await this._orgService.getById(domainModel.OrganizationId);
                if (organization == null) {
                    throw new ApiError(404, `Organization with an id ${domainModel.OrganizationId} cannot be found.`);
                }
            }

            const patientEmergencyContact = await this._service.create(domainModel);
            if (patientEmergencyContact == null) {
                throw new ApiError(400, 'Cannot create patientEmergencyContact!');
            }

            var eligibleAppNames = await this._ehrAnalyticsHandler.getEligibleAppNames(domainModel.PatientUserId);
            if (eligibleAppNames.length > 0) {
                for await (var appName of eligibleAppNames) {
                    if (domainModel.ContactRelation === EmergencyContactRoles.Doctor) {
                        await EHRAnalyticsHandler.addOrUpdatePatient(
                            domainModel.PatientUserId,
                            {
                                DoctorPersonId_1 : patientEmergencyContact.ContactPersonId
                            }, appName
                        );
                    }
                }
            } else {
                Logger.instance().log(`Skip adding details to EHR database as device is not eligible:${domainModel.PatientUserId}`);
            }

            ResponseHandler.success(request, response, 'Emergency contact created successfully!', 201, {
                EmergencyContact : patientEmergencyContact,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Emergency.Contact.GetById';

            await this._authorizer.authorize(request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');

            const patientEmergencyContact = await this._service.getById(id);
            if (patientEmergencyContact == null) {
                throw new ApiError(404, 'Emergency contact not found.');
            }

            ResponseHandler.success(request, response, 'Emergency contact retrieved successfully!', 200, {
                EmergencyContact : patientEmergencyContact,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.setContext('Emergency.Contact.Search', request, response);

            const filters = await this._validator.search(request);

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
            await this.setContext('Emergency.Contact.Update', request, response);

            const domainModel = await this._validator.update(request);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingEmergencyContact = await this._service.getById(id);
            if (existingEmergencyContact == null) {
                throw new ApiError(404, 'Emergency contact not found.');
            }

            const updated = await this._service.update(domainModel.id, domainModel);
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

            await this.setContext('Emergency.Contact.Delete', request, response);

            const id: uuid = await this._validator.getParamUuid(request, 'id');
            const existingEmergencyContact = await this._service.getById(id);
            if (existingEmergencyContact == null) {
                throw new ApiError(404, 'Emergency contact not found.');
            }

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
            await this.setContext('Emergency.Contact.GetHealthSystems', request, response);

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
            await this.setContext('Emergency.Contact.GetHealthSystemHospitals', request, response);

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
