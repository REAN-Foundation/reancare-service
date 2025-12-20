import { inject, injectable } from "tsyringe";
import { Logger } from "../../../../common/logger";
import { IPersonRepo } from "../../../../database/repository.interfaces/person/person.repo.interface";
import { IUserRepo } from "../../../../database/repository.interfaces/users/user/user.repo.interface";
import { IUserDeviceDetailsRepo } from "../../../../database/repository.interfaces/users/user/user.device.details.repo.interface ";

///////////////////////////////////////////////////////////////////////////////

@injectable()
export class UserTaskHelper {

    constructor(
        @inject('IUserRepo') private _userRepo: IUserRepo,
        @inject('IPersonRepo') private _personRepo: IPersonRepo,
        @inject('IUserDeviceDetailsRepo') private _userDeviceDetailsRepo: IUserDeviceDetailsRepo,
    ) {}

    public async getUserTelegramChatId(userId: string): Promise<string> {
        try {
            const user = await this._userRepo.getById(userId);
            if (!user) {
                return null;
            }
            const person = await this._personRepo.getById(user.PersonId);
            return person?.UniqueReferenceId ?? null;
        } catch (error) {
            Logger.instance().log(`Error getting user unique referance id: ${error}`);
            return null;
        }
    }

    public async getUserPhoneNumber(userId: string): Promise<string> {
        try {
            const user = await this._userRepo.getById(userId);
            if (!user) {
                return null;
            }
            const person = await this._personRepo.getById(user.PersonId);
            return person?.Phone ?? null;
        } catch (error) {
            Logger.instance().log(`Error getting user phone number: ${error}`);
            return null;
        }
    }

    public async getUserEmail(userId: string): Promise<string | null> {
        try {
            const user = await this._userRepo.getById(userId);
            if (!user) {
                return null;
            }
            const person = await this._personRepo.getById(user.PersonId);
            return person?.Email ?? null;
        } catch (error) {
            Logger.instance().log(`Error getting user email: ${error}`);
            return null;
        }
    }

    public async getUserDeviceTokens(userId: string): Promise<string[]> {
        try {
            const devices = await this._userDeviceDetailsRepo.getByUserId(userId);
            if (!devices || devices.length === 0) {
                return [];
            }
            return devices
                .filter(device => device.Token && device.IsNotificationEnabled)
                .map(device => device.Token);
        } catch (error) {
            Logger.instance().log(`Error getting user device tokens: ${error}`);
            return [];
        }
    }

}
