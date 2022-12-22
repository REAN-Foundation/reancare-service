import Doctor from '../../models/users/doctor.model';
import { DoctorDetailsDto, DoctorDto } from '../../../../../domain.types/users/doctor/doctor.dto';

///////////////////////////////////////////////////////////////////////////////////

export class DoctorMapper {

    static toDetailsDto = async (doctor: Doctor): Promise<DoctorDetailsDto> => {

        if (doctor == null){
            return null;
        }

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
            UserId                 : doctor.UserId,
            User                   : null,
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
            Addresses              : [],
            Organizations          : []
        };
        return dto;
    };

    static toDto = async (doctor: Doctor): Promise<DoctorDto> => {

        if (doctor == null){
            return null;
        }

        const dto: DoctorDto = {
            id                   : doctor.id,
            UserId               : doctor.UserId,
            DisplayId            : doctor.DisplayId,
            EhrId                : doctor.EhrId,
            DisplayName          : null,
            UserName             : null,
            NationalDigiDoctorId : doctor.NationalDigiDoctorId,
            Phone                : null,
            Email                : null,
            Gender               : null,
            BirthDate            : null,
            Age                  : null,
        };
        return dto;
    };

}
