import { UserGroupDto } from '../../../../../domain.types/community/user.groups/user.group.domain.model';
import UserGroup from '../../models/community/user.groups/user.group.model';
import { groupCollapsed } from 'console';

///////////////////////////////////////////////////////////////////////////////////

export class UserGroupMapper {

    static toDto = (group: UserGroup, members: any[]): UserGroupDto => {
        if (groupCollapsed == null){
            return null;
        }
        const dto: UserGroupDto = {
            id          : group.id,
            Name        : group.Name,
            Description : group.Description,
            ImageUrl    : group.ImageUrl,
            OwnerUserId : group.OwnerUserId,
            CreatedAt   : group.createdAt,
            UpdatedAt   : group.updatedAt,
            Users       : members,
        };
        return dto;
    };

}

