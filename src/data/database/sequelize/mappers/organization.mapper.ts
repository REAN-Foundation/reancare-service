import Organization from '../models/organization.model';
import { OrganizationDto } from "../../../domain.types/organization.domain.types";
import { UserRepo } from "../repositories/user.repo";
import { OrganizationRepo } from "../repositories/organization.repo";
import { AddressRepo } from "../repositories/address.repo";
import { AddressDto } from 'src/data/domain.types/address.domain.types';
import { AddressMapper } from './address.mapper';

///////////////////////////////////////////////////////////////////////////////////

export class OrganizationMapper {

    static toDto = async (organization: Organization): Promise<OrganizationDto> => {

        if (organization == null){
            return null;
        }
        
        var contactUser = null;
        if (organization.ContactUserId != null) {
            const userRepo = new UserRepo();
            contactUser = await userRepo.getById(organization.ContactUserId);
        }

        const organizationRepo = new OrganizationRepo();
        const parentOrganization = await organizationRepo.getById(organization.ParentOrganizationId);

        var addresses: AddressDto[] = [];
        if (organization.Addresses.length > 0) {
            for await (var address of organization.Addresses) {
                var temp = AddressMapper.toDto(address);
                addresses.push(temp);
            }

            // const addressRepo = new AddressRepo();
            // const address = await addressRepo.getById(organization.AddressId);
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
    }

}

