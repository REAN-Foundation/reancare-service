import { AddressDto } from "../address/address.dto";
import { UserDto } from "../../users/user/user.dto";

export interface OrganizationDto {
    id: string;
    Type: string;
    Name: string;
    ContactUserId?: string;
    ContactUser?: UserDto;
    ContactPhone?: string;
    ContactEmail?: string;
    ParentOrganizationId?: string;
    ParentOrganization?: OrganizationDto;
    About?: string;
    OperationalSince?: Date;
    Addresses?: AddressDto[];
    ImageResourceId?: string;
    IsHealthFacility?: boolean;
    NationalHealthFacilityRegistryId?: string;
}
