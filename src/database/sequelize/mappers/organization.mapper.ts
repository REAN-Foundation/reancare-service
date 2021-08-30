import Organization from '../models/organization.model';
import { OrganizationDto } from '../../../domain.types/organization/organization.dto';

///////////////////////////////////////////////////////////////////////////////////

export class OrganizationMapper {

    static toDto = async (
        organization: Organization,
        parentOrganization = null
    ): Promise<OrganizationDto> => {
        
        if (organization == null) {
            return null;
        }

        const dto: OrganizationDto = {
            id                               : organization.id,
            Type                             : organization.Type,
            Name                             : organization.Name,
            ContactUserId                    : organization.ContactUserId,
            ContactUser                      : null,
            ContactPhone                     : organization.ContactPhone,
            ContactEmail                     : organization.ContactEmail,
            ParentOrganizationId             : organization.ParentOrganizationId,
            ParentOrganization               : parentOrganization,
            About                            : organization.About,
            OperationalSince                 : organization.OperationalSince,
            Addresses                        : [],
            ImageResourceId                  : organization.ImageResourceId,
            IsHealthFacility                 : organization.IsHealthFacility,
            NationalHealthFacilityRegistryId : organization.NationalHealthFacilityRegistryId,
        };

        return dto;
    };
    
}
