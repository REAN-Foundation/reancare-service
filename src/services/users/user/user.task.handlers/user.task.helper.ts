import { Logger } from "../../../../common/logger";
import { IPersonRepo } from "../../../../database/repository.interfaces/person/person.repo.interface";
import { IUserRepo } from "../../../../database/repository.interfaces/users/user/user.repo.interface";
import { Injector } from "../../../../startup/injector";

///////////////////////////////////////////////////////////////////////////////

export class UserTaskHelper {

    private static readonly _personRepo: IPersonRepo = Injector.Container.resolve('IPersonRepo');

    private static readonly _userRepo: IUserRepo = Injector.Container.resolve('IUserRepo');

    public static async getUserTelegramChatId(userId: string): Promise<string> {
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

    public static async getUserPhoneNumber(userId: string): Promise<string> {
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

}
