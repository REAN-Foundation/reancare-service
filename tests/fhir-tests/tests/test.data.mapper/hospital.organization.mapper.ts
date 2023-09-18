import path from 'path';
import { OrganizationDomainModel } from '../../../../domain.types/general/organization/organization.domain.model';
import { Helper } from "../../../../common/helper";

///////////////////////////////////////////////////////////////////////////////////

export class HospitalOrganizationMapper {

    public static convertJsonObjectToDomainModel = () => {
        const cwd = process.cwd();
        const jsonPath = path.join(cwd,'src/modules/ehr/tests/test.data/','hospital.organization.domain.model.json');
        var hospitalObj = Helper.jsonToObj(jsonPath);

        var model: OrganizationDomainModel = {
            Type                 : hospitalObj.Type,
            Name                 : hospitalObj.Name,
            ContactPhone         : hospitalObj.ContactPhone,
            ContactEmail         : hospitalObj.ContactEmail,
            AddressIds           : hospitalObj.AddressIds,
            IsHealthFacility     : hospitalObj.IsHealthFacility,
            OperationalSince     : hospitalObj.OperationalSince,
            ParentOrganizationId : hospitalObj.ParentOrganizationId,
            About                : hospitalObj.About
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
