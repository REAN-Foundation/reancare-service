// import { PharmacistDomainModel } from "../domain.types/pharmacist.domain.types";
import path from 'path';
import { Helper } from "../../../../common/helper";
import { OrganizationDomainModel } from '../../../../domain.types/general/organization/organization.domain.model';

///////////////////////////////////////////////////////////////////////////////////

export class ClinicOrganizationMapper {

    public static convertJsonObjectToDomainModel = () => {
        const cwd = process.cwd();
        const jsonPath = path.join(cwd,'src/modules/ehr/tests/test.data/','clinic.organization.domain.model.json');
        var ClinicOrganizationObj = Helper.jsonToObj(jsonPath);

        var model: OrganizationDomainModel = {

            Type                 : ClinicOrganizationObj.Type,
            Name                 : ClinicOrganizationObj.Name,
            ContactPhone         : ClinicOrganizationObj.ContactPhone,
            ContactEmail         : ClinicOrganizationObj.ContactEmail,
            AddressIds           : ClinicOrganizationObj.AddressIds,
            IsHealthFacility     : ClinicOrganizationObj.IsHealthFacility,
            OperationalSince     : ClinicOrganizationObj.OperationalSince,
            ParentOrganizationId : ClinicOrganizationObj.ParentOrganizationId,
            About                : ClinicOrganizationObj.About
        };

        return model;
    };

    // static toDetailsDto = async (pharmacist: pharmacist): Promise<pharmacistDetailsDto> => {

    //     if(pharmacist == null){
    //         return null;
    //     }

    //     var userRepo = new UserRepo();
    //     const user = await userRepo.getById(pharmacist.UserId);

    //     var addressRepo = new AddressRepo();
    //     const address = await addressRepo.getByUserId(user.id);

    //     var dto: PharmacistDetailsDto = {
    //         id: Pharmacist.id,
    //         UserId: user.id,
    //         DisplayId: Pharmacist.DisplayId,
    //         EhrId: Pharmacist.EhrId,
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
    //         MedicalProfile: null, //PharmacistMedicalProfileDto;
    //         Insurances: [], //PharmacistInsuranceDto[];
    //         EmergencyContacts: [], // PharmacistEmergencyContactDto[];
    //     };
    //     return dto;
    // }

    // static toDto = async (Pharmacist: Pharmacist): Promise<PharmacistDto> => {

    //     if(Pharmacist == null){
    //         return null;
    //     }

    //     var userRepo = new UserRepo();
    //     const user = await userRepo.getById(Pharmacist.UserId);

    //     var dto: PharmacistDto = {
    //         id: Pharmacist.id,
    //         UserId: user.id,
    //         DisplayId: Pharmacist.DisplayId,
    //         EhrId: Pharmacist.EhrId,
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
