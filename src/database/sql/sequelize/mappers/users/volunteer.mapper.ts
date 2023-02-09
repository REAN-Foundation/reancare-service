import { VolunteerDto, VolunteerDetailsDto } from "../../../../../domain.types/users/Volunteer/volunteer.dto";
import Volunteer from "../../models/users/volunteer.model";

///////////////////////////////////////////////////////////////////////////////////

export class VolunteerMapper {

    static toDetailsDto = async (volunteer: Volunteer): Promise<VolunteerDetailsDto> => {

        if (volunteer == null){
            return null;
        }

        var medIssues = [];
        if (volunteer.MedIssues !== null && volunteer.MedIssues.length > 2) {
            medIssues = JSON.parse(volunteer.MedIssues);
        }

        const dto: VolunteerDetailsDto = {
            id                   : volunteer.id,
            UserId               : volunteer.UserId,
            User                 : null,
            DisplayId            : volunteer.DisplayId,
            EhrId                : volunteer.EhrId,
            BloodGroup           : volunteer.BloodGroup,
            LastDonationDate     : volunteer.LastDonationDate,
            SelectedBridgeId     : volunteer.SelectedBridgeId,
            SelectedBloodGroup   : volunteer.SelectedBloodGroup,
            SelectedPhoneNumber  : volunteer.SelectedPhoneNumber,
            LastDonationRecordId : volunteer.LastDonationRecordId,
            IsAvailable          : volunteer.IsAvailable,
            MedIssues            : medIssues,
            Address              : []
        };
        return dto;
    };

    static toDto = async (volunteer: Volunteer): Promise<VolunteerDto> => {

        if (volunteer == null){
            return null;
        }

        var medIssues = [];
        if (volunteer.MedIssues !== null && volunteer.MedIssues.length > 1) {
            medIssues = JSON.parse(volunteer.MedIssues);
        }

        const dto: VolunteerDto = {
            id                   : volunteer.id,
            UserId               : volunteer.UserId,
            DisplayId            : volunteer.DisplayId,
            EhrId                : volunteer.EhrId,
            BloodGroup           : volunteer.BloodGroup,
            LastDonationDate     : volunteer.LastDonationDate,
            SelectedBridgeId     : volunteer.SelectedBridgeId,
            SelectedBloodGroup   : volunteer.SelectedBloodGroup,
            SelectedPhoneNumber  : volunteer.SelectedPhoneNumber,
            LastDonationRecordId : volunteer.LastDonationRecordId,
            MedIssues            : medIssues,
            DisplayName          : null,
            UserName             : null,
            Phone                : null,
            Email                : null,
            Gender               : null,
            BirthDate            : null,
            Age                  : null,
        };
        return dto;
    };

}
