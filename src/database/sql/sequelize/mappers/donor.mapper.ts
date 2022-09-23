import Donor from '../models/donor.model';
import { DonorDetailsDto, DonorDto } from '../../../../domain.types/donor/donor.dto';

///////////////////////////////////////////////////////////////////////////////////

export class DonorMapper {

    static toDetailsDto = async (donor: Donor): Promise<DonorDetailsDto> => {

        if (donor == null){
            return null;
        }

        var medIssues = [];
        if (donor.MedIssues !== null && donor.MedIssues.length > 2) {
            medIssues = JSON.parse(donor.MedIssues);
        }
        
        const dto: DonorDetailsDto = {
            id                : donor.id,
            UserId            : donor.UserId,
            User              : null,
            DisplayId         : donor.DisplayId,
            EhrId             : donor.EhrId,
            BloodGroup        : donor.BloodGroup,
            IsAvailable       : donor.IsAvailable,
            MedIssues         : medIssues,
            HasDonatedEarlier : donor.HasDonatedEarlier,
            Address           : []
        };
        return dto;
    };

    static toDto = async (donor: Donor): Promise<DonorDto> => {

        if (donor == null){
            return null;
        }

        var medIssues = [];
        if (donor.MedIssues !== null && donor.MedIssues.length > 1) {
            medIssues = JSON.parse(donor.MedIssues);
        }

        const dto: DonorDto = {
            id          : donor.id,
            UserId      : donor.UserId,
            DisplayId   : donor.DisplayId,
            EhrId       : donor.EhrId,
            BloodGroup  : donor.BloodGroup,
            MedIssues   : medIssues,
            DisplayName : null,
            UserName    : null,
            Phone       : null,
            Email       : null,
            Gender      : null,
            BirthDate   : null,
            Age         : null,
        };
        return dto;
    };

}
