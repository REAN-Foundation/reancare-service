import {
    UserGroupCreateDomainModel,
    UserGroupUpdateDomainModel,
    UserGroupSearchFilters,
    UserGroupDto,
    UserGroupSearchResults
} from '../../../domain.types/community/user.groups/user.group.domain.model';
import { uuid } from "../../../domain.types/miscellaneous/system.types";

////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface IUserGroupRepo {

    create(model: UserGroupCreateDomainModel): Promise<UserGroupDto>;

    search(filters: UserGroupSearchFilters): Promise<UserGroupSearchResults>;

    getById(id: uuid): Promise<UserGroupDto>;

    update(id: uuid, updates: UserGroupUpdateDomainModel): Promise<UserGroupDto>;

    delete(id: uuid): Promise<boolean>;

    addUserToGroup(groupId: uuid, userId: uuid): Promise<boolean>;

    removeUserFromGroup(groupId: uuid, userId: uuid): Promise<boolean>;

    getGroupUsers(groupId: uuid): Promise<any[]>;

    makeUserAdmin(groupId: uuid, userId: uuid): Promise<boolean>;

    removeUserAdmin(groupId: uuid, userId: uuid): Promise<boolean>;

    getGroupAdmins(groupId: uuid): Promise<any[]>;

}
