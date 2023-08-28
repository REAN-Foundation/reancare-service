// import { PharmacistDomainModel } from "../domain.types/pharmacist.domain.types";

import path from "path";
import { Helper } from "../../../../common/helper";
import { AddressDomainModel } from "../../../../domain.types/general/address/address.domain.model";
import { OrganizationDomainModel } from "../../../../domain.types/general/organization/organization.domain.model";

///////////////////////////////////////////////////////////////////////////////////

export class PharmacyOrganizationMapper {

    public static convertJsonObjectToDomainModel = () => {

        const cwd = process.cwd();
        const jsonPath = path.join(cwd, 'src/modules/ehr/tests/test.data/', 'pharmacy.organization.domain.model.json');
        var PharmacyObj = Helper.jsonToObj(jsonPath);

        var address: AddressDomainModel = {
            Type        : PharmacyObj.Address.Type != null ? PharmacyObj.Address.Type.toLowerCase() : 'official',
            AddressLine : PharmacyObj.Address.AddressLine ?? '',
            City        : PharmacyObj.Address.City ?? '',
            District    : PharmacyObj.Address.District ?? '',
            State       : PharmacyObj.Address.State ?? '',
            Country     : PharmacyObj.Address.Country ?? '',
            PostalCode  : PharmacyObj.Address.PostalCode ?? ''
        };

        var model: OrganizationDomainModel = {

            Name         : PharmacyObj.Name,
            Type         : PharmacyObj.Type,
            ContactPhone : PharmacyObj.ContactPhone,
            ContactEmail : PharmacyObj.ContactEmail,
            Address      : address
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
