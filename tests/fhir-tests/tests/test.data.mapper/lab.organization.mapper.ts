import path from 'path';
import { Helper } from "../../../../common/helper";
import { AddressDomainModel } from "../../../../domain.types/general/address/address.domain.model";
import { OrganizationDomainModel } from "../../../../domain.types/general/organization/organization.domain.model";

///////////////////////////////////////////////////////////////////////////////////

export class LabOrganizationMapper {

    public static convertJsonObjectToDomainModel = () => {

        const cwd = process.cwd();
        const jsonPath = path.join(cwd,'src/modules/ehr/tests/test.data/','lab.organization.model.json');
        var LabOrganizationObj = Helper.jsonToObj(jsonPath);

        var address: AddressDomainModel = {
            Type        : LabOrganizationObj.Address.Type != null ? LabOrganizationObj.Address.Type.toLowerCase() : 'official',
            AddressLine : LabOrganizationObj.Address.AddressLine ?? '',
            City        : LabOrganizationObj.Address.City ?? '',
            District    : LabOrganizationObj.Address.District ?? '',
            State       : LabOrganizationObj.Address.State ?? '',
            Country     : LabOrganizationObj.Address.Country ?? '',
            PostalCode  : LabOrganizationObj.Address.PostalCode ?? ''
        };

        var model: OrganizationDomainModel = {
            Name         : LabOrganizationObj.Name,
            ContactEmail : LabOrganizationObj.ContactEmail,
            ContactPhone : LabOrganizationObj.ContactPhone,
            Address      : address,
            Type         : ''
        };

        return model;
    };

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
