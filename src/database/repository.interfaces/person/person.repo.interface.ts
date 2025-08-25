import { OrganizationDto } from "../../../domain.types/general/organization/organization.types";
import { AddressDto } from "../../../domain.types/general/address/address.dto";
import { PersonDomainModel } from "../../../domain.types/person/person.domain.model";
import { PersonDetailsDto } from "../../../domain.types/person/person.dto";
import { RoleDto } from "../../../domain.types/role/role.dto";
import { PersonSearchFilters, PersonSearchResults } from "../../../domain.types/person/person.search.types";
import { UserDetailsDto } from "../../../domain.types/users/user/user.dto";

///////////////////////////////////////////////////////////////////////////////////////

export interface IPersonRepo {

    create(personDomainModel: PersonDomainModel): Promise<PersonDetailsDto>;

    getById(id: string): Promise<PersonDetailsDto>;

    exists(id: string): Promise<boolean>;

    delete(id: string): Promise<boolean>;

    getPersonRolesByPhone(phone: string): Promise<RoleDto[]>;

    getPersonRolesByEmail(email: string): Promise<RoleDto[]>;

    personExistsWithPhone(phone: string): Promise<boolean>;

    getPersonWithPhone(phone: string): Promise<PersonDetailsDto>;

    getAllPersonsWithPhoneAndRole(phone: string, roleId: number): Promise<PersonDetailsDto[]>;

    personExistsWithEmail(email: string): Promise<boolean>;

    getPersonWithEmail(email: string): Promise<PersonDetailsDto>;

    getPersonWithUniqueReferenceId(uniqueReferenceId: string): Promise<PersonDetailsDto>;

    search(filters: PersonSearchFilters): Promise<PersonSearchResults>;

    // searchFull(filters: any): Promise<PersonDetailsDto[]>;

    update(id: string, personDomainModel: PersonDomainModel): Promise<PersonDetailsDto>;

    getOrganizations(id: string): Promise<OrganizationDto[]>;

    addAddress(id: string, addressId: string): Promise<boolean>;

    removeAddress(id: string, addressId: string): Promise<boolean>;

    getAddresses(id: string): Promise<AddressDto[]>;

    deleteProfileImage(id: string, personDomainModel: PersonDomainModel): Promise<UserDetailsDto>;
}
