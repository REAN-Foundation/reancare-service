import { OrganizationDto } from '../../../../../domain.types/general/organization/organization.types';
import Organization from '../../models/general/organization/organization.model';

///////////////////////////////////////////////////////////////////////////////////

export class OrganizationMapper {

    static toDto = (
        organization: Organization,
        parentOrganization = null
    ): OrganizationDto => {

        if (organization == null) {
            return null;
        }

        const dto: OrganizationDto = {
            id                               : organization.id,
            Type                             : organization.Type,
            Name                             : organization.Name,
            ContactUserId                    : organization.ContactUserId,
            TenantId                         : organization.TenantId,
            ContactUser                      : null,
            ContactPhone                     : organization.ContactPhone,
            ContactEmail                     : organization.ContactEmail,
            ParentOrganizationId             : organization.ParentOrganizationId,
            About                            : organization.About,
            OperationalSince                 : organization.OperationalSince,
            AddressIds                       : [],
            ImageResourceId                  : organization.ImageResourceId,
            IsHealthFacility                 : organization.IsHealthFacility,
            NationalHealthFacilityRegistryId : organization.NationalHealthFacilityRegistryId,
        };

        return dto;
    };

}
