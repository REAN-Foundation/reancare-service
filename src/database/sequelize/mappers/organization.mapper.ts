import Organization from '../models/organization.model';
import { OrganizationDto } from "../../../domain.types/organization.domain.types";
import { UserRepo } from "../repositories/user.repo";
import { OrganizationRepo } from "../repositories/organization.repo";
import { AddressRepo } from "../repositories/address.repo";
import { AddressDto } from '../../../domain.types/address.domain.types';

///////////////////////////////////////////////////////////////////////////////////

export class OrganizationMapper {

    static toDto = async (
        organization: Organization,
        parentOrganization = null,
        addAddresses = true
    ): Promise<OrganizationDto> => {
        
        if (organization == null) {
            return null;
        }

        var contactUser = null;
        if (organization.ContactUserId != null) {
            const userRepo = new UserRepo();
            contactUser = await userRepo.getById(organization.ContactUserId);
        }

        var parentOrganization = null;
        if (organization.ParentOrganizationId !== null && addParent) {
            const organizationRepo = new OrganizationRepo();
            parentOrganization = await organizationRepo.getById(organization.ParentOrganizationId);
        }

        var addresses: AddressDto[] = [];
        if (addAddresses) {
            const addressRepo = new AddressRepo();
            addresses = await addressRepo.getByOrganizationId(organization.id);
        }

        const dto: OrganizationDto = {
            id                               : organization.id,
            Type                             : organization.Type,
            Name                             : organization.Name,
            ContactUser                      : contactUser,
            ContactPhone                     : organization.ContactPhone,
            ContactEmail                     : organization.ContactEmail,
            ParentOrganization               : parentOrganization,
            About                            : organization.About,
            OperationalSince                 : organization.OperationalSince,
            Addresses                        : addresses,
            ImageResourceId                  : organization.ImageResourceId,
            IsHealthFacility                 : organization.IsHealthFacility,
            NationalHealthFacilityRegistryId : organization.NationalHealthFacilityRegistryId,
        };

        return dto;
    };
    
}

