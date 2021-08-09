import { PatientDomainModel } from '../../../../data/domain.types/patient.domain.types'
import { UserDomainModel } from '../../../../data/domain.types/user.domain.types'
import { PersonDomainModel } from '../../../../data/domain.types/person.domain.types'
import { AddressDomainModel } from "../../../../data/domain.types/address.domain.types";
import { Helper } from "../../../../common/helper";
import path from 'path';

///////////////////////////////////////////////////////////////////////////////////

export class PatientMapper {

    public static convertJsonObjectToDomainModel = () => {

        const cwd = process.cwd();
        const jsonPath = path.join(cwd, 'src/modules/ehr/tests/test.data/', 'patient.domain.model.json');
        var obj = Helper.jsonToObj(jsonPath);

        var address: AddressDomainModel = {
            Type        : obj.Address.Type != null ? obj.Address.Type.toLowerCase() : 'official',
            AddressLine : obj.Address.AddressLine ?? '',
            City        : obj.Address.City ?? '',
            District    : obj.Address.District ?? '',
            State       : obj.Address.State ?? '',
            Country     : obj.Address.Country ?? '',
            PostalCode  : obj.Address.PostalCode ?? ''
        };

        var person: PersonDomainModel = {
            Prefix     : obj.User.Person.Prefix,
            FirstName  : obj.User.Person.FirstName,
            MiddleName : obj.User.Person.MiddleName,
            LastName   : obj.User.Person.LastName,
            Phone      : obj.User.Person.Phone,
            Email      : obj.User.Person.Email,
            Gender     : obj.User.Person.Gender,
            BirthDate  : obj.User.Person.BirthDate
        };

        var user: UserDomainModel = {
            Person : person
        };

        var model: PatientDomainModel = {
            User    : user,
            Address : address
        }

        return model;
    }

    // static toDetailsDto = async (patient: Patient): Promise<PatientDetailsDto> => {

    //     if(patient == null){
    //         return null;
    //     }

    //     var userRepo = new UserRepo();
    //     const user = await userRepo.getById(patient.UserId);

    //     var addressRepo = new AddressRepo();
    //     const address = await addressRepo.getByUserId(user.id);

    //     var dto: PatientDetailsDto = {
    //         id: patient.id,
    //         UserId: user.id,
    //         DisplayId: patient.DisplayId,
    //         EhrId: patient.EhrId,
    //         UserName: user.UserName,
    //         Prefix: user.Prefix,
    //         FirstName: user.FirstName,
    //         MiddleName: user.MiddleName,
    //         LastName: user.LastName,
    //         DisplayName: user.DisplayName,
    //         Gender: user.Gender,
    //         BirthDate: user.BirthDate,
    //         Age: user.Age,
    //         Phone: user.Phone,
    //         Email: user.Email,
    //         ImageResourceId: user.ImageResourceId,
    //         ActiveSince: user.ActiveSince,
    //         IsActive: user.IsActive,
    //         LastLogin: user.LastLogin,
    //         DefaultTimeZone: user.DefaultTimeZone,
    //         CurrentTimeZone: user.CurrentTimeZone,
    //         Address: address,
    //         MedicalProfile: null, //PatientMedicalProfileDto;
    //         Insurances: [], //PatientInsuranceDto[];
    //         EmergencyContacts: [], // PatientEmergencyContactDto[];
    //     };
    //     return dto;
    // }

    // static toDto = async (patient: Patient): Promise<PatientDto> => {

    //     if(patient == null){
    //         return null;
    //     }

    //     var userRepo = new UserRepo();
    //     const user = await userRepo.getById(patient.UserId);

    //     var dto: PatientDto = {
    //         id: patient.id,
    //         UserId: user.id,
    //         DisplayId: patient.DisplayId,
    //         EhrId: patient.EhrId,
    //         DisplayName: user.DisplayName,
    //         UserName: user.UserName,
    //         Phone: user.Phone,
    //         Email: user.Email,
    //         Gender: user.Gender,
    //         BirthDate: user.BirthDate,
    //         Age: user.Age,
    //     };
    //     return dto;
    // }

}
