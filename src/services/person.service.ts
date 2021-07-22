import { IPersonRepo } from '../data/repository.interfaces/person.repo.interface';
import { IPersonRoleRepo } from '../data/repository.interfaces/person.role.repo.interface';
import { IRoleRepo } from '../data/repository.interfaces/role.repo.interface';
import { PersonDomainModel, PersonDetailsDto, PersonDto, PersonSearchFilters } from '../data/domain.types/person.domain.types';
import { injectable, inject } from 'tsyringe';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class PersonService {
    
    constructor(
        @inject('IPersonRepo') private _personRepo: IPersonRepo,
        @inject('IPersonRoleRepo') private _personRoleRepo: IPersonRoleRepo,
        @inject('IRoleRepo') private _roleRepo: IRoleRepo
    ) {}

    create = async (personDomainModel: PersonDomainModel) => {

        var person = await this._personRepo.create(personDomainModel);
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
        filters: PersonSearchFilters,
        full: boolean = false
    ): Promise<PersonDetailsDto[] | PersonDto[]> => {
        if (full) {
            return await this._personRepo.searchFull(filters);
        } else {
            return await this._personRepo.search(filters);
        }
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
