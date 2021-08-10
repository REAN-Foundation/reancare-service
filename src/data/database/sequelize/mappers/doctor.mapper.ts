import { UserRepo } from "../repositories/user.repo";
import Doctor from '../models/doctor.model';
import { DoctorDetailsDto, DoctorDto } from "../../../domain.types/doctor.domain.types";
import { AddressRepo } from "../repositories/address.repo";

///////////////////////////////////////////////////////////////////////////////////

export class DoctorMapper {

    static toDetailsDto = async (doctor: Doctor): Promise<DoctorDetailsDto> => {

        if (doctor == null){
            return null;
        }

        const userRepo = new UserRepo();
        const user = await userRepo.getById(doctor.UserId);

        const addressRepo = new AddressRepo();
        const addresses = await addressRepo.getByPersonId(user.Person.id);

        const dto: DoctorDetailsDto = {
            id                : doctor.id,
            User              : user,
            DisplayId         : doctor.DisplayId,
            EhrId             : doctor.EhrId,
            Addresses         : addresses,
            MedicalProfile    : null, //DoctorMedicalProfileDto;
            Insurances        : [], //DoctorInsuranceDto[];
            EmergencyContacts : [], // DoctorEmergencyContactDto[];
        };
        return dto;
    }

    static toDto = async (doctor: Doctor): Promise<DoctorDto> => {

        if (doctor == null){
            return null;
        }

        const userRepo = new UserRepo();
        const user = await userRepo.getById(doctor.UserId);

        const dto: DoctorDto = {
            id          : doctor.id,
            UserId      : user.id,
            DisplayId   : doctor.DisplayId,
            EhrId       : doctor.EhrId,
            DisplayName : user.Person.DisplayName,
            UserName    : user.UserName,
            Phone       : user.Person.Phone,
            Email       : user.Person.Email,
            Gender      : user.Person.Gender,
            BirthDate   : user.Person.BirthDate,
            Age         : user.Person.Age,
        };
        return dto;
    }

}
