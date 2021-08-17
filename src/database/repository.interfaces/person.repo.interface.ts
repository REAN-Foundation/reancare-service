import { PersonDetailsDto, PersonDomainModel, PersonDto } from '../../domain.types/person.domain.types';

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

}
