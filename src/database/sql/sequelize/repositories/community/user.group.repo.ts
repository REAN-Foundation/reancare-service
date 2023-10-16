import { uuid } from '../../../../../domain.types/miscellaneous/system.types';
import User from '../../models/users/user/user.model';
import Person from '../../models/person/person.model';
import UserGroup from '../../models/community/user.groups/user.group.model';
import UserGroupMember from '../../models/community/user.groups/user.group.member.model';
import { IUserGroupRepo } from '../../../../repository.interfaces/community/user.group.repo.interface';
import {
    UserGroupCreateDomainModel,
    UserGroupSearchResults,
    UserGroupUpdateDomainModel,
    UserGroupDto,
} from '../../../../../domain.types/community/user.groups/user.group.domain.model';
import { UserGroupMapper } from '../../mappers/community/user.group.mapper';
import { Op } from 'sequelize';

///////////////////////////////////////////////////////////////////////////////////////

export class UserGroupRepo implements IUserGroupRepo {

    public create = async (model: UserGroupCreateDomainModel): Promise<UserGroupDto> => {
        try {
            const entity = {
                Name        : model.Name,
                Description : model.Description,
                ImageUrl    : model.ImageUrl,
                OwnerId     : model.OwnerUserId,
            };
            const group = await UserGroup.create(entity);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const groupMember = await UserGroupMember.create({
                UserId  : model.OwnerUserId,
                GroupId : group.id,
                IsAdmin : true,
            });
            const members = await UserGroupMember.findAll({
                where : {
                    GroupId : group.id,
                },
                include : [
                    {
                        model   : User,
                        as      : 'User',
                        include : [
                            {
                                model : Person,
                                as    : 'Person',
                            }
                        ]
                    }
                ]
            });
            const dto = await UserGroupMapper.toDto(group, members);
            return dto;
        } catch (error) {
            throw new Error(`Failed to create user group: ${error.message}`);
        }
    };

    public search = async (filters: any): Promise<UserGroupSearchResults> => {
        try {
            const search = { where: {} };
            if (filters.Name != null) {
                search.where['Name'] = { [Op.like]: '%' + filters.Name + '%' };
            }
            if (filters.UserId != null) {
                search.where['UserId'] = filters.UserId;
            }

            let orderByColum = 'CreatedAt';
            if (filters.OrderBy) {
                orderByColum = filters.OrderBy;
            }
            let order = 'ASC';
            if (filters.Order === 'descending') {
                order = 'DESC';
            }
            search['order'] = [[orderByColum, order]];

            let limit = 25;
            if (filters.ItemsPerPage) {
                limit = filters.ItemsPerPage;
            }
            let offset = 0;
            let pageIndex = 0;
            if (filters.PageIndex) {
                pageIndex = filters.PageIndex < 0 ? 0 : filters.PageIndex;
                offset = pageIndex * limit;
            }
            search['limit'] = limit;
            search['offset'] = offset;

            const foundResults = await UserGroup.findAndCountAll(search);
            const dtos = foundResults.rows.map((group) => UserGroupMapper.toDto(group, null));
            const searchResults: UserGroupSearchResults = {
                TotalCount     : foundResults.count,
                RetrievedCount : dtos.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColum,
                Items          : dtos,
            };
            return searchResults;
        } catch (error) {
            throw new Error(`Failed to retrieve user groups: ${error.message}`);
        }
    };

    public getById = async (id: uuid): Promise<UserGroupDto> => {
        try {
            const group = await UserGroup.findByPk(id);
            if (group == null) {
                return null;
            }
            const members = await UserGroupMember.findAll({
                where : {
                    GroupId : group.id,
                },
                include : [
                    {
                        model   : User,
                        as      : 'User',
                        include : [
                            {
                                model : Person,
                                as    : 'Person',
                            }
                        ]
                    }
                ]
            });
            const dto = await UserGroupMapper.toDto(group, members);
            return dto;
        } catch (error) {
            throw new Error(`Failed to retrieve user group by Id: ${error.message}`);
        }
    };

    public update = async (id: uuid, model: UserGroupUpdateDomainModel): Promise<UserGroupDto> => {
        try {
            const group = await UserGroup.findByPk(id);
            if (group == null) {
                return null;
            }
            const entity = {
                Name        : model.Name ?? group.Name,
                Description : model.Description ?? group.Description,
                ImageUrl    : model.ImageUrl ?? group.ImageUrl,
            };
            await group.update(entity);
            const dto = await UserGroupMapper.toDto(group, null);
            return dto;
        } catch (error) {
            throw new Error(`Failed to update user group: ${error.message}`);
        }
    };

    public delete = async (id: uuid): Promise<boolean> => {
        try {
            const group = await UserGroup.findByPk(id);
            if (group == null) {
                return false;
            }
            const result = await UserGroup.destroy( {
                where : {
                    id : group.id,
                }
            });
            return result === 1;
        } catch (error) {
            throw new Error(`Failed to delete user group: ${error.message}`);
        }
    };

    public addUserToGroup = async (groupId: uuid, userId: uuid): Promise<boolean> => {
        try {
            const group = await UserGroup.findByPk(groupId);
            if (group == null) {
                throw new Error('Group not found');
            }
            const user = await User.findByPk(userId);
            if (user == null) {
                throw new Error('User not found');
            }
            const exists = await UserGroupMember.findOne({
                where : {
                    UserId  : userId,
                    GroupId : group.id,
                }
            });
            if (exists != null) {
                throw new Error('User already exists in group');
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const groupMember = await UserGroupMember.create({
                UserId  : userId,
                GroupId : group.id,
                IsAdmin : false,
            });
            return true;
        } catch (error) {
            throw new Error(`Failed to add user to group: ${error.message}`);
        }
    };

    public removeUserFromGroup = async (groupId: uuid, userId: uuid): Promise<boolean> => {
        try {
            const group = await UserGroup.findByPk(groupId);
            if (group == null) {
                throw new Error('Group not found');
            }
            const members = await UserGroupMember.findAll({
                where : {
                    UserId  : userId,
                    GroupId : group.id,
                }
            });
            if (members.length === 0) {
                throw new Error('User not found in group');
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const result = await UserGroupMember.destroy({
                where : {
                    UserId  : userId,
                    GroupId : group.id,
                }
            });
            return true;
        }
        catch (error) {
            throw new Error(`Failed to remove user from group: ${error.message}`);
        }
    };

    public getGroupUsers = async (groupId: uuid): Promise<any[]> => {
        try {
            const group = await UserGroup.findByPk(groupId);
            if (group == null) {
                throw new Error('Group not found');
            }
            const members = await UserGroupMember.findAll({
                where : {
                    GroupId : group.id,
                },
                include : [
                    {
                        model   : User,
                        as      : 'User',
                        include : [
                            {
                                model : Person,
                                as    : 'Person',
                            }
                        ]
                    }
                ]
            });

            const dtos = members.map((member) => {
                return {
                    UserId  : member.UserId,
                    GroupId : member.GroupId,
                    IsAdmin : member.IsAdmin,
                    User    : {
                        id       : member.User.id,
                        UserName : member.User.UserName,
                        Person   : {
                            id                : member.User.Person.id,
                            FirstName         : member.User.Person.FirstName,
                            LastName          : member.User.Person.LastName,
                            Phone             : member.User.Person.Phone,
                            Email             : member.User.Person.Email,
                            ProfilePictureUrl : member.User.Person.ImageResourceId,
                        }
                    },
                    CreatedAt : member.createdAt,
                    UpdatedAt : member.updatedAt,
                };
            });
            return dtos;
        } catch (error) {
            throw new Error(`Failed to get group users: ${error.message}`);
        }
    };

    public makeUserAdmin = async (groupId: uuid, userId: uuid): Promise<boolean> => {
        try {
            const group = await UserGroup.findByPk(groupId);
            if (group == null) {
                throw new Error('Group not found');
            }
            const members = await UserGroupMember.findAll({
                where : {
                    UserId  : userId,
                    GroupId : group.id,
                }
            });
            if (members.length === 0) {
                throw new Error('User not found in group');
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const result = await UserGroupMember.update({
                IsAdmin : true,
            }, {
                where : {
                    UserId  : userId,
                    GroupId : group.id,
                }
            });
            return true;
        } catch (error) {
            throw new Error(`Failed to make user admin: ${error.message}`);
        }
    };

    public removeUserAdmin = async (groupId: uuid, userId: uuid): Promise<boolean> => {
        try {
            const group = await UserGroup.findByPk(groupId);
            if (group == null) {
                throw new Error('Group not found');
            }
            const members = await UserGroupMember.findAll({
                where : {
                    UserId  : userId,
                    GroupId : group.id,
                }
            });
            if (members.length === 0) {
                throw new Error('User not found in group');
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const result = await UserGroupMember.update({
                IsAdmin : false,
            }, {
                where : {
                    UserId  : userId,
                    GroupId : group.id,
                }
            });
            return true;
        } catch (error) {
            throw new Error(`Failed to remove user admin: ${error.message}`);
        }
    };

    public getGroupAdmins = async (groupId: uuid): Promise<any[]> => {
        try {
            const group = await UserGroup.findByPk(groupId);
            if (group == null) {
                throw new Error('Group not found');
            }
            const members = await UserGroupMember.findAll({
                where : {
                    GroupId : group.id,
                    IsAdmin : true,
                },
                include : [
                    {
                        model   : User,
                        as      : 'User',
                        include : [
                            {
                                model : Person,
                                as    : 'Person',
                            }
                        ]
                    }
                ]
            });

            const dtos = members.map((member) => {
                return {
                    UserId  : member.UserId,
                    GroupId : member.GroupId,
                    IsAdmin : member.IsAdmin,
                    User    : {
                        id       : member.User.id,
                        UserName : member.User.UserName,
                        Person   : {
                            id                : member.User.Person.id,
                            FirstName         : member.User.Person.FirstName,
                            LastName          : member.User.Person.LastName,
                            Phone             : member.User.Person.Phone,
                            Email             : member.User.Person.Email,
                            ProfilePictureUrl : member.User.Person.ImageResourceId,
                        }
                    },
                    CreatedAt : member.createdAt,
                    UpdatedAt : member.updatedAt,
                };
            });
            return dtos;
        } catch (error) {
            throw new Error(`Failed to get group admins: ${error.message}`);
        }
    };

}
