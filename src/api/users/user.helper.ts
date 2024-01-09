import { ApiError } from '../../common/api.error';
import { Helper } from '../../common/helper';
import { Roles } from '../../domain.types/role/role.types';
import { HealthProfileService } from '../../services/users/patient/health.profile.service';
import { PatientService } from '../../services/users/patient/patient.service';
import { AddressService } from '../../services/general/address.service';
import { PersonService } from '../../services/person/person.service';
import { RoleService } from '../../services/role/role.service';
import { UserService } from '../../services/users/user/user.service';
import { Loader } from '../../startup/loader';
import { PatientDomainModel } from '../../domain.types/users/patient/patient/patient.domain.model';
import { PatientDetailsDto } from '../../domain.types/users/patient/patient/patient.dto';
import { UserDetailsDto } from '../../domain.types/users/user/user.dto';
import { PersonDetailsDto } from '../../domain.types/person/person.dto';
import { RoleDto } from '../../domain.types/role/role.dto';
import { AddressDomainModel } from '../../domain.types/general/address/address.domain.model';
import { AddressDto } from '../../domain.types/general/address/address.dto';
import { UserDomainModel } from '../../domain.types/users/user/user.domain.model';

///////////////////////////////////////////////////////////////////////////////////////

export class UserHelper {

    _personService: PersonService = null;

    _addressService: AddressService = null;

    _userService: UserService = null;

    _roleService: RoleService = null;

    _patientService: PatientService = null;

    _patientHealthProfileService: HealthProfileService = null;

    constructor() {
        this._userService = Loader.container.resolve(UserService);
        this._roleService = Loader.container.resolve(RoleService);
        this._personService = Loader.container.resolve(PersonService);
        this._addressService = Loader.container.resolve(AddressService);
        this._patientService = Loader.container.resolve(PatientService);
        this._patientHealthProfileService = Loader.container.resolve(HealthProfileService);
    }

    createPatient = async(createModel: PatientDomainModel): Promise<[PatientDetailsDto, boolean]> => {

        var person: PersonDetailsDto = null;
        var user: UserDetailsDto = null;
        var patient: PatientDetailsDto = null;

        const role: RoleDto = await this._roleService.getByName(Roles.Patient);
        if (role == null) {
            throw new ApiError(404, 'Role- ' + Roles.Patient + ' does not exist!');
        }

        person = await this._patientService.checkforExistingPersonWithRole(createModel, role.id);

        //NOTE: Currently we are not allowing multiple patients to share same phone number,
        // but in future, we will be. For example, family members sharing the same phone number.

        if (person) {
            //Person with a patient role exists
            patient = await this._patientService.getByPersonId(person.id);
            if (patient != null) {
                return [ patient, false ];
            }
            //Person exists but patient does not exist, check if the user exists or not!
            user = await this._userService.getByPhoneAndRole(createModel.User.Person.Phone, role.id);
            if (!user) {
                //User with patient role does not exist for this person, create one
                user = await this.createUser(person, createModel, role.id);
                createModel.User.id = user.id;
                createModel.UserId = user.id;
            }
        }
        else {
            person = await this._personService.create(createModel.User.Person);
            if (person == null) {
                throw new ApiError(400, 'Cannot create person!');
            }
            user = await this.createUser(person, createModel, role.id);
            createModel.User.id = user.id;
            createModel.UserId = user.id;
        }
        patient = await this.createPatientWithHealthProfile(createModel, user, person, role.id);
        if (!patient) {
            throw new ApiError(500, `An error has occurred while creating patient!`);
        }

        const address = await this.addAddress(createModel, person);
        patient.User.Person.Addresses = [address];

        return [ patient, true ];
    };

    private createPatientWithHealthProfile = async (
        createModel: PatientDomainModel,
        user: UserDetailsDto,
        person: PersonDetailsDto,
        roleId: number) => {

        var patient = await this._patientService.create(createModel);
        if (patient == null) {
            throw new ApiError(400, 'Cannot create patient!');
        }

        let healthProfile = await this._patientHealthProfileService.createDefault(user.id);
        patient.HealthProfile = healthProfile;

        if (person.Phone !== null) {
            var otpDetails = {
                Phone   : person.Phone,
                Email   : null,
                UserId  : null,
                Purpose : 'Login',
                RoleId  : roleId
            };
            await this._userService.generateOtp(otpDetails);
        }
        healthProfile = await this._patientHealthProfileService.updateByPatientUserId(patient.UserId,
            createModel.HealthProfile);
        patient.HealthProfile = healthProfile;
        return patient;
    };

    private async addAddress(createModel: PatientDomainModel, person: PersonDetailsDto)
        : Promise<AddressDto> {
        if (createModel.Address) {
            const addressModel: AddressDomainModel = {
                AddressLine : createModel.Address.AddressLine ?? '',
                Type        : createModel.Address.Type ?? 'Home',
                City        : createModel.Address.City ?? '',
                PostalCode  : createModel.Address.PostalCode ?? null,
                Country     : createModel.Address.Country ?? '',
                Location    : createModel.Address.Location ?? '',
                State       : createModel.Address.State ?? ''
            };
            const address = await this._addressService.create(addressModel);
            await this._personService.addAddress(person.id, address.id);
            return address;
        }
        return null;
    }

    private async createUser(
        person: PersonDetailsDto,
        createModel: PatientDomainModel,
        roleId: number) {

        createModel.User.Person.id = person.id;
        createModel.PersonId = person.id;
        createModel.User.RoleId = roleId;
        createModel = await this.updateUserDomainModel(createModel);

        const userModel = createModel.User;
        const isTestUser = await this.isTestUser(userModel);
        userModel.IsTestUser = isTestUser;

        var user = await this._userService.create(createModel.User);
        if (!user) {
            throw new ApiError(500, 'Error creating missing user definition!');
        }
        return user;
    }

    public async isTestUser(userModel: UserDomainModel) {
        var phone = userModel.Person.Phone;
        const tokens = userModel.Person.Phone ? userModel.Person.Phone.split('-') : [];
        if (tokens.length === 1) {
            phone = tokens[0];
        }
        else if (tokens.length === 2) {
            phone = tokens[1];
        }
        const isTestUser = await this._userService.isInternalTestUser(phone);
        return isTestUser;
    }

    private async updateUserDomainModel(createModel: PatientDomainModel): Promise<PatientDomainModel> {

        let userName = createModel.User.UserName;
        if (!createModel.User.UserName) {
            userName = await this._userService.generateUserName(
                createModel.User.Person.FirstName,
                createModel.User.Person.LastName
            );
        }

        const displayId = await this._userService.generateUserDisplayId(
            Roles.Patient,
            createModel.User.Person.Phone,
            0 //For now, just allow only one patient with same phone number
        );

        const displayName = Helper.constructPersonDisplayName(
            createModel.User.Person.Prefix,
            createModel.User.Person.FirstName,
            createModel.User.Person.LastName
        );

        createModel.User.Person.DisplayName = displayName;
        createModel.User.UserName = userName;
        createModel.DisplayId = displayId;

        return createModel;
    }

}
