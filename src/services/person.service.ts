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

    //#region Publics

    create = async (personDomainModel: PersonDomainModel): Promise<PersonDetailsDto> => {

        var dto = await this._personRepo.create(personDomainModel);
        dto = await this.updateDetailsDto(dto);
        return dto;
    };

    public getById = async (id: string): Promise<PersonDetailsDto> => {
        var dto = await this._personRepo.getById(id);
        dto = await this.updateDetailsDto(dto);
        return dto;
    };

    public exists = async (id: string): Promise<boolean> => {
        return await this._personRepo.exists(id);
    };

    public search = async (
        filters: PersonSearchFilters
    ): Promise<PersonDetailsDto[] | PersonDto[]> => {
        var items = [];
        var dtos = await this._personRepo.search(filters);
        for await (var dto of dtos) {
            dto = await this.updateDto(dto);
            items.push(dto);
        }
        dtos = items;
        return dtos;
    };

    public update = async (id: string, personDomainModel: PersonDomainModel): Promise<PersonDetailsDto> => {
        var dto = await this._personRepo.update(id, personDomainModel);
        dto = await this.updateDetailsDto(dto);
        return dto;
    };

    public delete = async (id: string): Promise<boolean> => {
        return await this._personRepo.delete(id);
    };

    getPersonWithPhone = async (phone: string): Promise<PersonDetailsDto> => {
        var dto = await this._personRepo.getPersonWithPhone(phone);
        dto = await this.updateDetailsDto(dto);
        return dto;
    };

    //#endregion

    //#region Privates

    private updateDetailsDto = async (dto: PersonDetailsDto): Promise<PersonDetailsDto> => {
        if (dto == null) {
            return null;
        }
        const personRoles = await this._personRoleRepo.getPersonRoles(dto.id);
        dto.Roles = personRoles;
        return dto;
    };

    private updateDto = async (dto: PersonDto): Promise<PersonDto> => {
        return dto;
    };

    //#endregion

}
