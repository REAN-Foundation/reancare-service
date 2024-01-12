import { inject, injectable } from "tsyringe";
import { IPersonRoleRepo } from "../../database/repository.interfaces/person/person.role.repo.interface";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class PersonRoleService {

    constructor(
        @inject('IPersonRoleRepo') private _personRoleRepo: IPersonRoleRepo,
    ) {}

    getPersonRoles = async (personId: string): Promise<any> => {
        return await this._personRoleRepo.getPersonRoles(personId);
    };

    addPersonRole = async (personId: string, roleId: number): Promise<any> => {
        return await this._personRoleRepo.addPersonRole(personId, roleId);
    };

    removePersonRole = async (personId: string): Promise<boolean> => {
        return await this._personRoleRepo.removePersonRole(personId);
    };

    getPersonCountByRoles = async (): Promise<any> => {
        return await this._personRoleRepo.getPersonCountByRoles();
    };

}
