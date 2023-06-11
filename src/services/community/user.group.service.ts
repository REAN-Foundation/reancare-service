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
    ) {}

    create = async (model: UserGroupCreateDomainModel): Promise<UserGroupDto> => {
        var userGroup = await this._userGroupRepo.create(model);
        var participantGroup = await this.createParticipantGroupForAwards(userGroup);
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

    //#region Private Methods

    createParticipantGroupForAwards = async (model: UserGroupDto): Promise<any> => {
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

    //#endregion

}
