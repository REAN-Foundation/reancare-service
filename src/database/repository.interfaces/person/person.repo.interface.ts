import { AddressDto } from "../../../domain.types/general/address/address.dto";
import { OrganizationDto } from "../../../domain.types/general/organization/organization.dto";
import { PersonDomainModel } from "../../../domain.types/person/person.domain.model";
import { PersonDetailsDto, PersonDto } from "../../../domain.types/person/person.dto";

export interface IPersonRepo {

    create(personDomainModel: PersonDomainModel): Promise<PersonDetailsDto>;

    getById(id: string): Promise<PersonDetailsDto>;

    exists(id: string): Promise<boolean>;

    delete(id: string): Promise<boolean>;

    personExistsWithPhone(phone: string): Promise<boolean>;

    getPersonWithPhone(phone: string): Promise<PersonDetailsDto>;

    getAllPersonsWithPhoneAndRole(phone: string, roleId: number): Promise<PersonDetailsDto[]>;

    personExistsWithEmail(email: string): Promise<boolean>;

    getPersonWithEmail(email: string): Promise<PersonDetailsDto>;

    search(filters: any): Promise<PersonDto[]>;

    // searchFull(filters: any): Promise<PersonDetailsDto[]>;

    update(id: string, personDomainModel: PersonDomainModel): Promise<PersonDetailsDto>;

    getOrganizations(id: string): Promise<OrganizationDto[]>;

    addAddress(id: string, addressId: string): Promise<boolean>;

    removeAddress(id: string, addressId: string): Promise<boolean>;

    getAddresses(id: string): Promise<AddressDto[]>;
}
