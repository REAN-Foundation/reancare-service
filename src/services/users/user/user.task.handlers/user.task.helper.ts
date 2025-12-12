import { inject, injectable } from "tsyringe";
import { Logger } from "../../../../common/logger";
import { IPersonRepo } from "../../../../database/repository.interfaces/person/person.repo.interface";
import { IUserRepo } from "../../../../database/repository.interfaces/users/user/user.repo.interface";

///////////////////////////////////////////////////////////////////////////////

@injectable()
export class UserTaskHelper {

    constructor(
        @inject('IUserRepo') private _userRepo: IUserRepo,
        @inject('IPersonRepo') private _personRepo: IPersonRepo,
    
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

}
