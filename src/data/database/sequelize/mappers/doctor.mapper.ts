import { UserRepo } from "../repositories/user.repo";
import Doctor from '../models/doctor.model';
import { DoctorDetailsDto, DoctorDto } from "../../../domain.types/doctor.domain.types";
import { AddressRepo } from "../repositories/address.repo";
import { OrganizationRepo } from "../repositories/organization.repo";

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

        const organizationRepo = new OrganizationRepo();
        const organizations = await organizationRepo.getByPersonId(user.Person.id);

        var specialities = [];
        if (doctor.Specialities !== null && doctor.Specialities.length > 2) {
            specialities = JSON.parse(doctor.Specialities);
        }

        var professionalHighlights = [];
        if (doctor.ProfessionalHighlights != null && doctor.ProfessionalHighlights.length > 2) {
            professionalHighlights = JSON.parse(doctor.ProfessionalHighlights);
        }
        
        const dto: DoctorDetailsDto = {
            id                     : doctor.id,
            User                   : user,
            DisplayId              : doctor.DisplayId,
            EhrId                  : doctor.EhrId,
            NationalDigiDoctorId   : doctor.NationalDigiDoctorId,
            About                  : doctor.About,
            Locality               : doctor.Locality,
            Qualifications         : doctor.Qualifications,
            PractisingSince        : doctor.PractisingSince,
            Specialities           : specialities,
            ProfessionalHighlights : professionalHighlights,
            ConsultationFee        : doctor.ConsultationFee,
            Addresses              : addresses,
            Organizations          : organizations
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
            id                   : doctor.id,
            UserId               : user.id,
            DisplayId            : doctor.DisplayId,
            EhrId                : doctor.EhrId,
            DisplayName          : user.Person.DisplayName,
            UserName             : user.UserName,
            NationalDigiDoctorId : doctor.NationalDigiDoctorId,
            Phone                : user.Person.Phone,
            Email                : user.Person.Email,
            Gender               : user.Person.Gender,
            BirthDate            : user.Person.BirthDate,
            Age                  : user.Person.Age,
        };
        return dto;
    }

}
