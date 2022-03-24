import { ApiError } from '../../common/api.error';
import { Helper } from '../../common/helper';
import { Roles } from '../../domain.types/role/role.types';
import { HealthProfileService } from '../../services/patient/health.profile.service';
import { PatientService } from '../../services/patient/patient.service';
import { AddressService } from '../../services/address.service';
import { PersonService } from '../../services/person.service';
import { RoleService } from '../../services/role.service';
import { UserService } from '../../services/user/user.service';
import { Loader } from '../../startup/loader';
import { PatientDomainModel } from '../../domain.types/patient/patient/patient.domain.model';
import { PatientDetailsDto } from '../../domain.types/patient/patient/patient.dto';

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

    createPatient = async(createModel: PatientDomainModel): Promise<PatientDetailsDto> => {

        //Throw an error if patient with same name and phone number exists
        const existingPatientCountSharingPhone = await this._patientService.checkforDuplicatePatients(
            createModel
        );
        
        //NOTE: Currently we are not allowing multiple patients to share same phone number,
        // but in future, we will be. For example, family members sharing the same phone number.
        // But for now, throw the error!
        
        if (existingPatientCountSharingPhone > 0) {
            const msg = `Patient already exists with this phone number. Please verify with OTP to gain access to the patient account.`;
            throw new ApiError(409, msg);
        }
                    
        const userName = await this._userService.generateUserName(
            createModel.User.Person.FirstName,
            createModel.User.Person.LastName
        );
        
        const displayId = await this._userService.generateUserDisplayId(
            Roles.Patient,
            createModel.User.Person.Phone,
            existingPatientCountSharingPhone
        );
        
        const displayName = Helper.constructPersonDisplayName(
            createModel.User.Person.Prefix,
            createModel.User.Person.FirstName,
            createModel.User.Person.LastName
        );
        
        createModel.User.Person.DisplayName = displayName;
        createModel.User.UserName = userName;
        createModel.DisplayId = displayId;
        
        const userDomainModel = createModel.User;
        const personDomainModel = userDomainModel.Person;
        
        //Create a person first
        
        let person = await this._personService.getPersonWithPhone(createModel.User.Person.Phone);
        if (person == null) {
            person = await this._personService.create(personDomainModel);
            if (person == null) {
                throw new ApiError(400, 'Cannot create person!');
            }
        }
        
        const role = await this._roleService.getByName(Roles.Patient);
        createModel.PersonId = person.id;
        userDomainModel.Person.id = person.id;
        userDomainModel.RoleId = role.id;
        
        const user = await this._userService.create(userDomainModel);
        if (user == null) {
            throw new ApiError(400, 'Cannot create user!');
        }
        createModel.UserId = user.id;
        
        //KK: Note - Please add user to appointment service here...
        // var appointmentCustomerModel = PatientMapper.ToAppointmentCustomerDomainModel(userDomainModel);
        // var customer = await this._appointmentService.createCustomer(appointmentCustomerModel);
        
        createModel.DisplayId = displayId;
        const patient = await this._patientService.create(createModel);
        if (patient == null) {
            throw new ApiError(400, 'Cannot create patient!');
        }
        
        const healthProfile = await this._patientHealthProfileService.createDefault(user.id);
        patient.HealthProfile = healthProfile;
        
        if (person.Phone !== null) {
            var otpDetails = {
                Phone   : person.Phone,
                Email   : null,
                UserId  : null,
                Purpose : 'Login',
                RoleId  : role.id
            };
            await this._userService.generateOtp(otpDetails);
        }
        
        return patient;
    }

}
