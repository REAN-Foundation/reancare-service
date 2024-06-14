import { ApiError } from '../../common/api.error';
import { Helper } from '../../common/helper';
import { Roles } from '../../domain.types/role/role.types';
import { HealthProfileService } from '../../services/users/patient/health.profile.service';
import { PatientService } from '../../services/users/patient/patient.service';
import { AddressService } from '../../services/general/address.service';
import { PersonService } from '../../services/person/person.service';
import { RoleService } from '../../services/role/role.service';
import { UserService } from '../../services/users/user/user.service';
import { TenantService } from '../../services/tenant/tenant.service';
import { Injector } from '../../startup/injector';
import { PatientDomainModel } from '../../domain.types/users/patient/patient/patient.domain.model';
import { PatientDetailsDto } from '../../domain.types/users/patient/patient/patient.dto';
import { UserDetailsDto } from '../../domain.types/users/user/user.dto';
import { PersonDetailsDto } from '../../domain.types/person/person.dto';
import { RoleDto } from '../../domain.types/role/role.dto';
import { AddressDomainModel } from '../../domain.types/general/address/address.domain.model';
import { AddressDto } from '../../domain.types/general/address/address.dto';
import { OtpGenerationModel, UserDomainModel } from '../../domain.types/users/user/user.domain.model';
import { TenantDto } from '../../domain.types/tenant/tenant.dto';
import { DoctorDomainModel } from '../../domain.types/users/doctor/doctor.domain.model';
import { DoctorDetailsDto } from '../../domain.types/users/doctor/doctor.dto';
import { DoctorService } from '../../services/users/doctor/doctor.service';

///////////////////////////////////////////////////////////////////////////////////////

export class UserHelper {

    _personService: PersonService = null;

    _addressService: AddressService = null;

    _userService: UserService = null;

    _roleService: RoleService = null;

    _patientService: PatientService = null;

    _doctorService: DoctorService = null;

    _patientHealthProfileService: HealthProfileService = null;

    _tenantService: TenantService = null;

    constructor() {
        this._userService = Injector.Container.resolve(UserService);
        this._roleService = Injector.Container.resolve(RoleService);
        this._personService = Injector.Container.resolve(PersonService);
        this._addressService = Injector.Container.resolve(AddressService);
        this._patientService = Injector.Container.resolve(PatientService);
        this._patientHealthProfileService = Injector.Container.resolve(HealthProfileService);
        this._tenantService = Injector.Container.resolve(TenantService);
        this._doctorService = Injector.Container.resolve(DoctorService);
    }

    createPatient = async(createModel: PatientDomainModel): Promise<[PatientDetailsDto, boolean]> => {

        var person: PersonDetailsDto = null;
        var user: UserDetailsDto = null;
        var patient: PatientDetailsDto = null;

        const patientRole: RoleDto = await this._roleService.getByName(Roles.Patient);
        if (patientRole == null) {
            throw new ApiError(404, 'Role- ' + Roles.Patient + ' does not exist!');
        }

        if (createModel.User.Person.Phone != null && createModel.User.Person.Phone.length > 0) {
            person = await this._patientService.checkforExistingPersonWithRole(createModel, patientRole.id);
        }

        //Check if the user exists with the same username
        //We are allowing some patient's coming from the bot to be created without phone number or email
        if (person == null && createModel.User.UserName != null) {
            user = await this._userService.getByUserName(createModel.User.UserName);
            if (user != null) {
                person = user.Person;
                if (user.Role.id === patientRole.id) {
                    const existingPatient = await this._patientService.getByUserId(user.id);
                    const healthProfile = await this._patientHealthProfileService.getByPatientUserId(user.id);
                    existingPatient.HealthProfile = healthProfile;
                    return [ existingPatient, false ];
                }
            }
        }

        //NOTE: Currently we are not allowing multiple patients to share same phone number,
        // but in future, we will be. For example, family members sharing the same phone number.

        if (person) {
            //Person with a patient role exists
            patient = await this._patientService.getByPersonId(person.id);
            if (patient != null) {
                return [ patient, false ];
            }
            //Person exists but patient does not exist, check if the user exists or not!
            if (!user) {
                user = await this._userService.getByPhoneAndRole(createModel.User.Person.Phone, patientRole.id);
                if (!user) {
                    //User with patient role does not exist for this person, create one
                    user = await this.createUser(person, createModel, patientRole.id);
                    createModel.User.id = user.id;
                    createModel.UserId = user.id;
                }
            }
        }
        else {
            person = await this._personService.create(createModel.User.Person);
            if (person == null) {
                throw new ApiError(400, 'Cannot create person!');
            }
            user = await this.createUser(person, createModel, patientRole.id);
            createModel.User.id = user.id;
            createModel.UserId = user.id;
        }

        if (user != null) {
            const existingPatient = await this._patientService.getByUserId(user.id);
            if (existingPatient != null) {
                const healthProfile = await this._patientHealthProfileService.getByPatientUserId(user.id);
                existingPatient.HealthProfile = healthProfile;
                return [ existingPatient, false ];
            }
        }

        patient = await this.createPatientWithHealthProfile(createModel, user, person, patientRole.id);
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

        if (person.Phone !== null && person.Phone.length > 0) {
            var otpDetails: OtpGenerationModel = {
                Phone   : person.Phone,
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

    public async createUser(
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
        let tenant: TenantDto = null;
        if (userModel.TenantId === null) {
            const tenantCode = userModel.TenantCode ?? 'default';
            tenant = await this._tenantService.getTenantWithCode(tenantCode);
        }
        else {
            tenant = await this._tenantService.getById(userModel.TenantId);
        }
        if (tenant == null) {
            throw new ApiError(404, 'Tenant not found!');
        }
        userModel.TenantId = tenant.id;

        var user = await this._userService.create(userModel);
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

    createDoctor = async(createModel: DoctorDomainModel): Promise<[DoctorDetailsDto, boolean]> => {

        var person: PersonDetailsDto = null;
        var user: UserDetailsDto = null;
        var doctor: DoctorDetailsDto = null;

        const doctorRole: RoleDto = await this._roleService.getByName(Roles.Doctor);
        if (doctorRole == null) {
            throw new ApiError(404, 'Role- ' + Roles.Doctor + ' does not exist!');
        }

        if (createModel.User.Person.Phone != null && createModel.User.Person.Phone.length > 0) {
            person = await this._doctorService.checkforExistingPersonWithRole(createModel, doctorRole.id);
        }

        //Check if the user exists with the same username
        //We are allowing some patient's coming from the bot to be created without phone number or email
        if (person == null && createModel.User.UserName != null) {
            user = await this._userService.getByUserName(createModel.User.UserName);
            if (user != null) {
                person = user.Person;
                if (user.Role.id === doctorRole.id) {
                    const existingDoctor = await this._doctorService.getByUserId(user.id);
                    return [ existingDoctor, false ];
                }
            }
        }

        if (person) {
            //Person with a doctor role exists
            doctor = await this._doctorService.getByPersonId(person.id);
            if (doctor != null) {
                return [ doctor, false ];
            }
            //Person exists but doctor does not exist, check if the user exists or not!
            if (!user) {
                user = await this._userService.getByPhoneAndRole(createModel.User.Person.Phone, doctorRole.id);
                if (!user) {
                    //User with doctor role does not exist for this person, create one
                    user = await this.createUser(person, createModel, doctorRole.id);
                    createModel.User.id = user.id;
                    createModel.UserId = user.id;
                }
            }
        }
        else {
            person = await this._personService.create(createModel.User.Person);
            if (person == null) {
                throw new ApiError(400, 'Cannot create person!');
            }
            user = await this.createUser(person, createModel, doctorRole.id);
            createModel.User.id = user.id;
            createModel.UserId = user.id;
        }

        if (user != null) {
            const existingDoctor = await this._doctorService.getByUserId(user.id);
            if (existingDoctor != null) {
                return [ existingDoctor, false ];
            }
        }
        createModel.User.Person.id = person.id;
        createModel.PersonId = person.id;
        var doctor = await this._doctorService.create(createModel);
        if (doctor == null) {
            throw new ApiError(400, 'Cannot create doctor!');
        }

        const address = await this.addAddress(createModel, person);
        doctor.User.Person.Addresses = [address];

        return [ doctor, true ];
    };

}
