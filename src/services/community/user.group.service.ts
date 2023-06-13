import { inject, injectable } from "tsyringe";
import { IUserGroupRepo } from "../../database/repository.interfaces/community/user.group.repo.interface";
import {
    UserGroupCreateDomainModel,
    UserGroupUpdateDomainModel,
    UserGroupSearchFilters,
    UserGroupDto,
    UserGroupSearchResults
} from '../../domain.types/community/user.groups/user.group.domain.model';
import { uuid } from "../../domain.types/miscellaneous/system.types";
import { Logger } from "../../common/logger";
import axios from 'axios';
import { IUserRepo } from "../../database/repository.interfaces/users/user/user.repo.interface";
import { ConfigurationManager } from "../../config/configuration.manager";

////////////////////////////////////////////////////////////////////////////////////////////////////////

const headers = {
    'Content-Type'    : 'application/x-www-form-urlencoded',
    Accept            : '*/*',
    'Cache-Control'   : 'no-cache',
    'Accept-Encoding' : 'gzip, deflate, br',
    Connection        : 'keep-alive',
    'x-api-key'       : process.env.AWARDS_SERVICE_API_KEY,
};

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class UserGroupService {

    constructor(
            @inject('IUserGroupRepo') private _userGroupRepo: IUserGroupRepo,
            @inject('IUserRepo') private _userRepo: IUserRepo,
    ) {}

    create = async (model: UserGroupCreateDomainModel): Promise<UserGroupDto> => {
        var userGroup = await this._userGroupRepo.create(model);
        var participantGroup = await this.createAwardsParticipantGroup(userGroup);
        if (!participantGroup) {
            Logger.instance().log('Unable to create participant group for awards! Rolling back...');
            await this.delete(userGroup.id);
            return null;
        }
        userGroup.AwardsParticipantGroup = participantGroup;
        return userGroup;
    };

    search = async (filters: UserGroupSearchFilters): Promise<UserGroupSearchResults> => {
        return await this._userGroupRepo.search(filters);
    };

    getById = async (id: string): Promise<UserGroupDto> => {
        var userGroup = await this._userGroupRepo.getById(id);
        if (userGroup) {
            var participantGroup = await this.getAwardsParticipantGroup(userGroup.id);
            if (!participantGroup) {
                Logger.instance().log('Unable to retrieve participant group for awards!');
            }
            else {
                userGroup.AwardsParticipantGroup = participantGroup;
            }
        }
        return userGroup;
    };

    update = async (id: string, updates: UserGroupUpdateDomainModel): Promise<UserGroupDto> => {
        var updatedUserGroup = await this._userGroupRepo.update(id, updates);
        if (updatedUserGroup) {
            var participantGroup = await this.updateAwardsParticipantGroup(updatedUserGroup);
            if (!participantGroup) {
                Logger.instance().log('Unable to update participant group for awards!');
            }
            else {
                updatedUserGroup.AwardsParticipantGroup = participantGroup;
            }
        }
        return updatedUserGroup;
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._userGroupRepo.delete(id);
    };

    addUserToGroup = async (groupId: string, userId: string): Promise<boolean> => {
        const added = await this._userGroupRepo.addUserToGroup(groupId, userId);
        if (added) {
            const addedAsParticipant = await this.addUserToAwardsParticipantGroup(groupId, userId);
            if (!addedAsParticipant) {
                Logger.instance().log('Unable to add user to participant group for awards!');
            }
        }
        return added;
    };

    removeUserFromGroup = async (groupId: string, userId: string): Promise<boolean> => {
        const removed = await this._userGroupRepo.removeUserFromGroup(groupId, userId);
        if (removed) {
            const removedAsParticipant = await this.removeUserFromAwardsParticipantGroup(groupId, userId);
            if (!removedAsParticipant) {
                Logger.instance().log('Unable to remove user from participant group for awards!');
            }
        }
        return removed;
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

    setGroupActivityTypes = async (groupId: string, activityTypes: string[]): Promise<boolean> => {
        return await this.setAwardsGroupActivityTypes(groupId, activityTypes);
    };

    getGroupActivityTypes = async (groupId: string): Promise<string[]> => {
        return await this.getAwardsGroupActivityTypes(groupId);
    };

    //#region Private Methods

    createAwardsParticipantGroup = async (model: UserGroupDto): Promise<any> => {
        var participantGroup = null;
        try {
            const clientId = await this.getClientId();
            var url = process.env.AWARDS_SERVICE_BASE_URL + '/api/v1/participant-groups';
            var body = {
                ClientId    : clientId,
                Name        : model.Name,
                ReferenceId : model.id,
                Description : model.Description,
                ImageUrl    : model.ImageUrl,
            };
            var response = await axios.post(url, body, { headers });
            if (response.status === 201) {
                Logger.instance().log('Successfully triggered award event!');
                participantGroup = response.data.Data;
            } else {
                Logger.instance().error('Unable to trigger award event!', response.status, response.data);
            }
        }
        catch (error) {
            Logger.instance().log(`${error.message}`);
        }
        return participantGroup;
    };

    updateAwardsParticipantGroup = async (userGroup: UserGroupDto): Promise<any> => {
        var participantGroup = null;
        try {
            const group = await this.getAwardsParticipantGroup(userGroup.id);

            var url = process.env.AWARDS_SERVICE_BASE_URL + '/api/v1/participant-groups/' + group.id;
            var body = {
                Name        : userGroup.Name,
                Description : userGroup.Description,
                ImageUrl    : userGroup.ImageUrl,
            };
            var response = await axios.put(url, body, { headers });
            if (response.status === 200) {
                Logger.instance().log('Successfully triggered award event!');
                var participantGroup = response.data.Data;
            } else {
                Logger.instance().error('Unable to trigger award event!', response.status, response.data);
            }
        }
        catch (error) {
            Logger.instance().log(`${error.message}`);
        }
        return participantGroup;
    };

    getClientId = async (): Promise<any> => {
        var clientId = null;
        try {
            var url = process.env.AWARDS_SERVICE_BASE_URL + '/api/v1/clients';
            var response = await axios.get(url, { headers });
            if (response.status === 200) {
                Logger.instance().log('Successfully retrieved client info!');
                Logger.instance().log(JSON.stringify(response.data.Data));
                const client = response.data.Data;
                if (client != null) {
                    clientId = client.id;
                }
            } else {
                Logger.instance().error('Unable to retrieve client info!', response.status, response.data);
            }
        }
        catch (error) {
            Logger.instance().log(`${error.message}`);
        }
        return clientId;
    };

    getAwardsParticipantGroup = async (userGroupId: string): Promise<any> => {
        try {
            //userGroupId is participant-group's referenceId for the awards service
            var url = process.env.AWARDS_SERVICE_BASE_URL + '/api/v1/participant-groups/by-reference-id/' + userGroupId;
            var response = await axios.get(url, { headers });
            if (response.status === 200) {
                Logger.instance().log('Successfully retrieved participant groups!');
                const participantGroup = response.data.Data;
                if (participantGroup != null) {
                    return participantGroup;
                }
            } else {
                Logger.instance().error('Unable to retrieve participant groups!', response.status, response.data);
            }
        }
        catch (error) {
            Logger.instance().log(`${error.message}`);
        }
        return null;
    };

    getOrCreateParticipant = async (userId: uuid): Promise<any> => {
        try {
            var url = process.env.AWARDS_SERVICE_BASE_URL + '/api/v1/participants/by-reference-id/' + userId;
            var response = await axios.get(url, { headers });
            if (response.status === 200) {
                Logger.instance().log('Successfully retrieved participant!');
                const participant = response.data.Data;
                if (participant != null) {
                    return participant;
                }
            } else {
                const user = await this._userRepo.getById(userId);
                const clientId = await this.getClientId();
                const fileResourceId = user.Person.ImageResourceId;
                var profileImageUrl: string | null | undefined = null;
                if (fileResourceId) {
                    profileImageUrl = ConfigurationManager.BaseUrl() + '/api/v1/file-resources/' + fileResourceId + '/download';
                }
                url = process.env.AWARDS_SERVICE_BASE_URL + '/api/v1/participants';
                var body = {
                    clientId        : clientId,
                    ReferenceId     : userId,
                    Prefix          : user.Person.Prefix,
                    FirstName       : user.Person.FirstName,
                    LastName        : user.Person.LastName,
                    Email           : user.Person.Email,
                    Phone           : user.Person.Phone,
                    Gender          : user.Person.Gender,
                    BirthDate       : user.Person.BirthDate,
                    ProfileImageUrl : profileImageUrl,
                    OnboardingDate  : Date.now(),
                };
                response = await axios.post(url, body, { headers });
                if (response.status === 201) {
                    Logger.instance().log('Successfully created participant!');
                    const participant = response.data.Data;
                    if (participant != null) {
                        return participant;
                    }
                }
                else {
                    Logger.instance().error('Unable to create participant!', response.status, response.data);
                }
            }
            return null;
        }
        catch (error) {
            Logger.instance().log(`${error.message}`);
        }
        return null;
    };

    addUserToAwardsParticipantGroup = async (groupId: uuid, userId: uuid): Promise<boolean> => {
        var added = false;
        try {
            const participant = await this.getOrCreateParticipant(userId);
            if (!participant) {
                Logger.instance().log('Unable to create participant for awards!');
                return false;
            }
            var url = process.env.AWARDS_SERVICE_BASE_URL + '/api/v1/participant-groups/' + groupId + '/participants/' + participant.id;
            var response = await axios.post(url, {}, { headers });
            if (response.status === 200) {
                Logger.instance().log('Successfully added user to participant group!');
                added = true;
            } else {
                Logger.instance().error('Unable to add user to participant group!', response.status, response.data);
            }
        }
        catch (error) {
            Logger.instance().log(`${error.message}`);
        }
        return added;
    };

    removeUserFromAwardsParticipantGroup = async (groupId: uuid, userId: uuid): Promise<boolean> => {
        var removed = false;
        try {
            const participant = await this.getOrCreateParticipant(userId);
            if (!participant) {
                Logger.instance().log('Unable to create participant for awards!');
                return false;
            }
            var url = process.env.AWARDS_SERVICE_BASE_URL + '/api/v1/participant-groups/' + groupId + '/participants/' + participant.id;
            var response = await axios.delete(url, { headers });
            if (response.status === 200) {
                Logger.instance().log('Successfully removed user from participant group!');
                removed = true;
            } else {
                Logger.instance().error('Unable to remove user from participant group!', response.status, response.data);
            }
        }
        catch (error) {
            Logger.instance().log(`${error.message}`);
        }
        return removed;
    };

    setAwardsGroupActivityTypes = async (userGroupId: uuid, activityTypes: string[]): Promise<boolean> => {
        var updated = false;
        try {
            var participantGroup = await this.getAwardsParticipantGroup(userGroupId);
            var url = process.env.AWARDS_SERVICE_BASE_URL + '/api/v1/participant-groups/' + participantGroup.id + '/activity-types';
            var body = {
                ActivityTypes : activityTypes,
            };
            var response = await axios.post(url, body, { headers });
            if (response.status === 200) {
                Logger.instance().log('Successfully set group activity types!');
                updated = true;
            } else {
                Logger.instance().error('Unable to set group activity types!', response.status, response.data);
            }
        }
        catch (error) {
            Logger.instance().log(`${error.message}`);
        }
        return updated;
    };

    getAwardsGroupActivityTypes = async (userGroupId: uuid): Promise<string[]> => {
        var activityTypes: string[] = [];
        try {
            var participantGroup = await this.getAwardsParticipantGroup(userGroupId);
            var url = process.env.AWARDS_SERVICE_BASE_URL + '/api/v1/participant-groups/' + participantGroup.id + '/activity-types';
            var response = await axios.get(url, { headers });
            if (response.status === 200) {
                Logger.instance().log('Successfully retrieved group activity types!');
                activityTypes = response.data.Data;
            } else {
                Logger.instance().error('Unable to retrieve group activity types!', response.status, response.data);
            }
        }
        catch (error) {
            Logger.instance().log(`${error.message}`);
        }
        return activityTypes;
    };

    //#endregion

}
