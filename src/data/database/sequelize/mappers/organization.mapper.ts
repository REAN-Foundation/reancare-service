import Organization from '../models/organization.model';
import { OrganizationDto } from "../../../domain.types/organization.domain.types";
import { UserRepo } from "../repositories/user.repo";
import { OrganizationRepo } from "../repositories/organization.repo";
import { AddressRepo } from "../repositories/address.repo";

///////////////////////////////////////////////////////////////////////////////////

export class OrganizationMapper {

    static toDto = async (organization: Organization): Promise<OrganizationDto> => {
        if (organization == null){
            return null;
        }
        const userRepo = new UserRepo();
        const contactUser = await userRepo.getById(organization.ContactUserId);

        const organizationRepo = new OrganizationRepo();
        const parentOrganization = await organizationRepo.getById(organization.ParentOrganizationId);

        const addressRepo = new AddressRepo();
        const address = await addressRepo.getById(organization.AddressId);

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
            Address                          : address,
            ImageResourceId                  : organization.ImageResourceId,
            IsHealthFacility                 : organization.IsHealthFacility,
            NationalHealthFacilityRegistryId : organization.NationalHealthFacilityRegistryId,
        };
        return dto;
    }

}

