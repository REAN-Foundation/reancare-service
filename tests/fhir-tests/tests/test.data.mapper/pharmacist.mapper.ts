
import { Helper } from "../../../../common/helper";
import { AddressDomainModel } from "../../../../domain.types/general/address/address.domain.model";
import { PharmacistDomainModel } from "../../../../domain.types/users/pharmacist/pharmacist.domain.types";
import path from 'path';

///////////////////////////////////////////////////////////////////////////////////

export class PharmacistMapper {

    public static convertJsonObjectToDomainModel = () => {

        const cwd = process.cwd();
        const jsonPath = path.join(cwd, 'src/modules/ehr/tests/test.data/', 'pharmacist.domain.model.json');
        var PharmacistObj = Helper.jsonToObj(jsonPath);

        var address: AddressDomainModel = {
            Type        : PharmacistObj.Address.Type != null ? PharmacistObj.Address.Type.toLowerCase() : 'official',
            AddressLine : PharmacistObj.Address.AddressLine ?? '',
            City        : PharmacistObj.Address.City ?? '',
            District    : PharmacistObj.Address.District ?? '',
            State       : PharmacistObj.Address.State ?? '',
            Country     : PharmacistObj.Address.Country ?? '',
            PostalCode  : PharmacistObj.Address.PostalCode ?? ''
        };

        var model: PharmacistDomainModel = {
            FirstName  : PharmacistObj.FirstName,
            MiddleName : PharmacistObj.MiddleName,
            LastName   : PharmacistObj.LastName,
            Phone      : PharmacistObj.Phone,
            Email      : PharmacistObj.Email,
            Gender     : PharmacistObj.Gender,
            BirthDate  : PharmacistObj.BirthDate,
            Address    : address
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
