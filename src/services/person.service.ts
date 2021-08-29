import { IPersonRepo } from '../database/repository.interfaces/person.repo.interface';
import { IPersonRoleRepo } from '../database/repository.interfaces/person.role.repo.interface';
import { IRoleRepo } from '../database/repository.interfaces/role.repo.interface';
import { injectable, inject } from 'tsyringe';
import { PersonDomainModel } from '../domain.types/person/person.domain.model';
import { PersonDetailsDto, PersonDto } from '../domain.types/person/person.dto';
import { PersonSearchFilters } from '../domain.types/person/patient.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class PersonService {
    
    constructor(
        @inject('IPersonRepo') private _personRepo: IPersonRepo,
        @inject('IPersonRoleRepo') private _personRoleRepo: IPersonRoleRepo,
        @inject('IRoleRepo') private _roleRepo: IRoleRepo
    ) {}

    create = async (personDomainModel: PersonDomainModel): Promise<PersonDetailsDto> => {

        const person = await this._personRepo.create(personDomainModel);
        if (person == null) {
            return null;
        }
        return person;
    };

    public getById = async (id: string): Promise<PersonDetailsDto> => {
        return await this._personRepo.getById(id);
    };

    public exists = async (id: string): Promise<boolean> => {
        return await this._personRepo.exists(id);
    };

    public search = async (
        filters: PersonSearchFilters
    ): Promise<PersonDetailsDto[] | PersonDto[]> => {
        return await this._personRepo.search(filters);
    };

    public update = async (id: string, personDomainModel: PersonDomainModel): Promise<PersonDetailsDto> => {
        return await this._personRepo.update(id, personDomainModel);
    };

    public delete = async (id: string): Promise<boolean> => {
        return await this._personRepo.delete(id);
    };

    getPersonWithPhone = async (phone: string): Promise<PersonDetailsDto> => {
        return await this._personRepo.getPersonWithPhone(phone);
    };

}
