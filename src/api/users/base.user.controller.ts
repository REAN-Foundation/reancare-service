import { Authorizer } from '../../auth/authorizer';
import { ApiError } from '../../common/api.error';
import { Logger } from '../../common/logger';
import { AddressDomainModel } from '../../domain.types/general/address/address.domain.model';
import { AddressService } from '../../services/general/address.service';
import { PersonService } from '../../services/person/person.service';
import { RoleService } from '../../services/role/role.service';
import { UserService } from '../../services/users/user/user.service';
import { Loader } from '../../startup/loader';
import { AddressValidator } from '../general/address/address.validator';
import { BaseController } from '../base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class BaseUserController extends BaseController {

    _personService: PersonService = null;

    _addressService: AddressService = null;

    _userService: UserService = null;

    _roleService: RoleService = null;

    _authorizer: Authorizer = null;

    constructor() {
        super();
        this._userService = Loader.container.resolve(UserService);
        this._roleService = Loader.container.resolve(RoleService);
        this._personService = Loader.container.resolve(PersonService);
        this._addressService = Loader.container.resolve(AddressService);
        this._authorizer = Loader.authorizer;
    }

    async createOrUpdateDefaultAddress(request, personId: string): Promise<void> {

        let addressDomainModel: AddressDomainModel = null;
        const addressBody = request.body.Address ?? null;

        var addressValidator = new AddressValidator();

        if (addressBody != null) {
            addressDomainModel = await addressValidator.getUpdateDomainModel(addressBody);

            //get existing address to update
            const existingAddresses = await this._personService.getAddresses(personId);
            if (existingAddresses.length < 1) {
                await this.createAddress(addressDomainModel, personId);
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

    async addAddress(request, personId: string): Promise<void> {
        const addressBody = request.body.Address ?? null;
        if (addressBody != null) {
            var addressValidator = new AddressValidator();
            const addressDomainModel: AddressDomainModel = await addressValidator.getCreateDomainModel(addressBody);
            await this.createAddress(addressDomainModel, personId);
        }
    }

    private async createAddress(addressDomainModel: AddressDomainModel, personId: string) {
        const address = await this._addressService.create(addressDomainModel);
        if (address == null) {
            throw new ApiError(400, 'Cannot create address!');
        }
        var success = await this._personService.addAddress(personId, address.id);
        if (success) {
            Logger.instance().log(`Address with id ${address.id} added successfully to person ${personId}`);
        }
    }

}

//#region Private methods

// private async createAddresses(
//    domainModel: PatientDomainModel, patient: PatientDetailsDto): Promise<AddressDto[]> {
//     const personId = patient.User.Person.id;
//     var addresses: AddressDto[] = [];
//     if (domainModel.Addresses != null && domainModel.Addresses.length > 0) {
//         for await (var a of domainModel.Addresses) {
//             var addressDomainModel: AddressDomainModel = {
//                 Type        : 'Personal',
//                 AddressLine : a.AddressLine,
//                 City        : a.City ?? null,
//                 State       : a.State ?? null,
//                 Country     : a.Country,
//                 PostalCode  : a.PostalCode ?? null
//             };
//             addressDomainModel.PersonId = personId;
//             const address = await this._addressService.create(addressDomainModel);
//             if (address == null) {
//                 throw new ApiError(400, 'Cannot create address!');
//             }
//             addresses.push(address);
//         }
//     }
//     else if (domainModel.AddressIds != null && domainModel.AddressIds.length > 0) {
//         const existingAddresses = await this._personService.getAddresses(personId);
//         addresses.push(...existingAddresses);
//         for await (var addressId of domainModel.AddressIds) {
//             var addressDto = await this._addressService.getById(addressId);
//             if (addressDto === null) {
//                 Logger.instance().log(`Address with Id ${addressId} is not found.`);
//             }
//             await this._personService.addAddress(personId, addressDto.id);
//             addresses.push(addressDto);
//         }
//     }
//     return addresses;
// }

// private createDefaultHealthProfileModel = (patientUserId : string): HealthProfileDomainModel => {
//     const model: HealthProfileDomainModel = {
//         PatientUserId      : patientUserId,
//         BloodGroup         : null,
//         MajorAilment       : null,
//         OtherConditions    : null,
//         IsDiabetic         : false,
//         HasHeartAilment    : false,
//         MaritalStatus      : 'Unknown',
//         Ethnicity          : null,
//         Nationality        : null,
//         Occupation         : null,
//         SedentaryLifestyle : false,
//         IsSmoker           : false,
//         SmokingSeverity    : Severity.Low,
//         SmokingSince       : null,
//         IsDrinker          : false,
//         DrinkingSeverity   : Severity.Low,
//         DrinkingSince      : null,
//         SubstanceAbuse     : false,
//         ProcedureHistory   : null,
//         ObstetricHistory   : null,
//         OtherInformation   : null,
//     };

//     return model;
// }

//#endregion
