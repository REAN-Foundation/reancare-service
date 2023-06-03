import { inject, injectable } from "tsyringe";
import { IUserGroupRepo } from "../../database/repository.interfaces/community/user.group.repo.interface";
import {
    UserGroupCreateDomainModel,
    UserGroupUpdateDomainModel,
    UserGroupSearchFilters,
    UserGroupDto,
    UserGroupSearchResults
} from '../../domain.types/community/user.groups/user.group.domain.model';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class UserGroupService {
    
    constructor(
            @inject('IUserGroupRepo') private _userGroupRepo: IUserGroupRepo,
    ) {}
    
    create = async (model: UserGroupCreateDomainModel): Promise<UserGroupDto> => {
        return await this._userGroupRepo.create(model);
    };

    search = async (filters: UserGroupSearchFilters): Promise<UserGroupSearchResults> => {
        return await this._userGroupRepo.search(filters);
    };

    getById = async (id: string): Promise<UserGroupDto> => {
        return await this._userGroupRepo.getById(id);
    };

    update = async (id: string, updates: UserGroupUpdateDomainModel): Promise<UserGroupDto> => {
        return await this._userGroupRepo.update(id, updates);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._userGroupRepo.delete(id);
    };

    addUserToGroup = async (groupId: string, userId: string): Promise<boolean> => {
        return await this._userGroupRepo.addUserToGroup(groupId, userId);
    };

    removeUserFromGroup = async (groupId: string, userId: string): Promise<boolean> => {
        return await this._userGroupRepo.removeUserFromGroup(groupId, userId);
    };

    getGroupUsers = async (groupId: string): Promise<UserGroupDto[]> => {
        return await this._userGroupRepo.getGroupUsers(groupId);
    };

    makeUserAdmin = async (groupId: string, userId: string): Promise<boolean> => {
        return await this._userGroupRepo.makeUserAdmin(groupId, userId);
    };

    removeUserAdmin = async (groupId: string, userId: string): Promise<boolean> => {
        return await this._userGroupRepo.removeUserAdmin(groupId, userId);
    };

    getGroupAdmins = async (groupId: string): Promise<UserGroupDto[]> => {
        return await this._userGroupRepo.getGroupAdmins(groupId);
    };
    
}
    
