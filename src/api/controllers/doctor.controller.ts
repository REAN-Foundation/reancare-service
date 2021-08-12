import express from 'express';

import { DoctorService } from '../../services/doctor.service';
import { UserService } from '../../services/user.service';
import { PersonService } from '../../services/person.service';
import { Helper } from '../../common/helper';
import { ResponseHandler } from '../../common/response.handler';
import { Loader } from '../../startup/loader';
import { Authorizer } from '../../auth/authorizer';
import { DoctorValidator } from '../validators/doctor.validator';
import { DoctorDetailsDto, DoctorDomainModel } from '../../data/domain.types/doctor.domain.types';

import { Roles } from '../../data/domain.types/role.domain.types';
import { UserDomainModel } from '../../data/domain.types/user.domain.types';
import { ApiError } from '../../common/api.error';
import { AddressDomainModel } from '../../data/domain.types/address.domain.types';
import { AddressValidator } from '../validators/address.validator';
import { AddressService } from '../../services/address.service';
import { RoleService } from '../../services/role.service';
import { PersonDomainModel } from '../../data/domain.types/person.domain.types';

///////////////////////////////////////////////////////////////////////////////////////

export class DoctorController {

    //#region member variables and constructors

    _service: DoctorService = null;

    _userService: UserService = null;

    _personService: PersonService = null;

    _addressService: AddressService = null;

    _roleService: RoleService = null;

    _authorizer: Authorizer = null;

    constructor() {
        this._service = Loader.container.resolve(DoctorService);
        this._userService = Loader.container.resolve(UserService);
        this._personService = Loader.container.resolve(PersonService);
        this._roleService = Loader.container.resolve(RoleService);
        this._authorizer = Loader.authorizer;
    }

    //#endregion

    //#region Action methods

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Doctor.Create';

            const doctorDomainModel = await DoctorValidator.create(request);

            //Throw an error if doctor with same name and phone number exists
            const doctorExists = await this._service.doctorExists(doctorDomainModel);
            if (doctorExists) {
                throw new ApiError(400, 'Cannot create doctor! Doctor with same phone number exists.');
            }

            const userName = await this._userService.generateUserName(
                doctorDomainModel.User.Person.FirstName,
                doctorDomainModel.User.Person.LastName
            );

            const displayId = await this._userService.generateUserDisplayId(
                Roles.Doctor,
                doctorDomainModel.User.Person.Phone
            );

            const displayName = Helper.constructPersonDisplayName(
                doctorDomainModel.User.Person.Prefix,
                doctorDomainModel.User.Person.FirstName,
                doctorDomainModel.User.Person.LastName
            );

            doctorDomainModel.User.Person.DisplayName = displayName;
            doctorDomainModel.User.UserName = userName;
            doctorDomainModel.DisplayId = displayId;

            const userDomainModel = doctorDomainModel.User;
            const personDomainModel = userDomainModel.Person;

            //Create a person first

            let person = await this._personService.getPersonWithPhone(doctorDomainModel.User.Person.Phone);
            if (person == null) {
                person = await this._personService.create(personDomainModel);
                if (person == null) {
                    throw new ApiError(400, 'Cannot create person!');
                }
            }

            const role = await this._roleService.getByName(Roles.Doctor);
            doctorDomainModel.PersonId = person.id;
            userDomainModel.Person.id = person.id;
            userDomainModel.RoleId = role.id;

            const user = await this._userService.create(userDomainModel);
            if (user == null) {
                throw new ApiError(400, 'Cannot create user!');
            }
            doctorDomainModel.UserId = user.id;

            //KK: Note - Please add user to appointment service here...

            doctorDomainModel.DisplayId = displayId;
            const doctor = await this._service.create(doctorDomainModel);
            if (user == null) {
                throw new ApiError(400, 'Cannot create doctor!');
            }

            await this.createAddress(request, doctor);

            ResponseHandler.success(request, response, 'Doctor created successfully!', 201, {
                Doctor : doctor,
            });
            
        } catch (error) {

            //KK: Todo: Add rollback in case of mid-way exception
            ResponseHandler.handleError(request, response, error);
        }
    };

    getByUserId = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Doctor.GetByUserId';
            request.resourceOwnerUserId = Helper.getResourceOwner(request);
            await this._authorizer.authorize(request, response);

            const userId: string = await DoctorValidator.getByUserId(request);

            const existingUser = await this._userService.getById(userId);
            if (existingUser == null) {
                throw new ApiError(404, 'User not found.');
            }

            const doctor = await this._service.getByUserId(userId);
            if (doctor == null) {
                throw new ApiError(404, 'Doctor not found.');
            }

            ResponseHandler.success(request, response, 'Doctor retrieved successfully!', 200, {
                Doctor : doctor,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Doctor.Search';
            await this._authorizer.authorize(request, response);

            const filters = await DoctorValidator.search(request);

            // const extractFull: boolean =
            //     request.query.fullDetails !== 'undefined' && typeof request.query.fullDetails === 'boolean'
            //         ? request.query.fullDetails
            //         : false;

            const searchResults = await this._service.search(filters);
            const count = searchResults.Items.length;
            const message =
                count === 0 ? 'No records found!' : `Total ${count} doctor records retrieved successfully!`;
                
            ResponseHandler.success(request, response, message, 200, {
                Doctors : searchResults,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    updateByUserId = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Doctor.UpdateByUserId';
            await this._authorizer.authorize(request, response);

            const doctorDomainModel = await DoctorValidator.updateByUserId(request);

            const userId: string = await DoctorValidator.getByUserId(request);
            const existingUser = await this._userService.getById(userId);
            if (existingUser == null) {
                throw new ApiError(404, 'User not found.');
            }

            const userDomainModel: UserDomainModel = doctorDomainModel.User;
            const updatedUser = await this._userService.update(doctorDomainModel.UserId, userDomainModel);
            if (!updatedUser) {
                throw new ApiError(400, 'Unable to update user!');
            }
            const personDomainModel: PersonDomainModel = doctorDomainModel.User.Person;
            personDomainModel.id = updatedUser.Person.id;
            const updatedPerson = await this._personService.update(personDomainModel.id, personDomainModel);
            if (!updatedPerson) {
                throw new ApiError(400, 'Unable to update person!');
            }
            const updatedDoctor = await this._service.updateByUserId(
                doctorDomainModel.UserId,
                doctorDomainModel
            );
            if (updatedDoctor == null) {
                throw new ApiError(400, 'Unable to update doctor record!');
            }

            await this.createOrUpdateAddress(request, doctorDomainModel);

            ResponseHandler.success(request, response, 'Doctor records updated successfully!', 200, {
                Doctor : updatedDoctor,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'Doctor.DeleteByUserId';
            await this._authorizer.authorize(request, response);

            const userId: string = await DoctorValidator.delete(request);
            const existingUser = await this._userService.getById(userId);
            if (existingUser == null) {
                throw new ApiError(404, 'User not found.');
            }

            const deleted = await this._personService.delete(userId);
            if (!deleted) {
                throw new ApiError(400, 'User cannot be deleted.');
            }

            ResponseHandler.success(request, response, 'Doctor records deleted successfully!', 200, {
                Deleted : true,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#endregion

    //#region Private methods

    private async createOrUpdateAddress(request, doctorDomainModel: DoctorDomainModel): Promise<void> {

        let addressDomainModel: AddressDomainModel = null;
        const addressBody = request.body.Address ?? null;

        if (addressBody != null) {
            addressDomainModel = await AddressValidator.getDomainModel(addressBody);

            //get existing address to update
            const existingAddresses = await this._addressService.getByPersonId(doctorDomainModel.PersonId);
            if (existingAddresses.length < 1) {
                addressDomainModel.PersonId = doctorDomainModel.PersonId;
                const address = await this._addressService.create(addressDomainModel);
                if (address == null) {
                    throw new ApiError(400, 'Cannot create address!');
                }
            } else if (existingAddresses.length === 1) {
                const updatedAddress = await this._addressService.update(
                    existingAddresses[0].id,
                    addressDomainModel
                );
                if (updatedAddress == null) {
                    throw new ApiError(400, 'Unable to update address record!');
                }
            }
        }
    }

    private async createAddress(request, doctor: DoctorDetailsDto): Promise<void> {
        
        let addressDomainModel: AddressDomainModel = null;
        const addressBody = request.body.Address ?? null;
        if (addressBody != null) {
            addressDomainModel = await AddressValidator.getDomainModel(addressBody);
            addressDomainModel.PersonId = doctor.User.id;
            const address = await this._addressService.create(addressDomainModel);
            if (address == null) {
                throw new ApiError(400, 'Cannot create address!');
            }
        }
    }

    //#endregion

}
