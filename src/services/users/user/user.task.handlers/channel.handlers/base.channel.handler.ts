import { Logger } from "../../../../../common/logger";
import { IUserTaskChannelHandler } from "../../../../../database/repository.interfaces/users/user/task.task/user.task.channel.handler.interface";
import { ProcessedTaskDto, UserTaskMessageDto } from "../../../../../domain.types/users/user.task/user.task.dto";
import { IPersonRepo } from "../../../../../database/repository.interfaces/person/person.repo.interface";
import { IUserRepo } from "../../../../../database/repository.interfaces/users/user/user.repo.interface";
import { Injector } from "../../../../../startup/injector";

///////////////////////////////////////////////////////////////////////////////

/**
 * Base class for channel handlers to reduce code duplication
 * Provides common functionality for user/person lookups
 */

export abstract class BaseChannelHandler implements IUserTaskChannelHandler {

    protected _personRepo: IPersonRepo = Injector.Container.resolve('IPersonRepo');
    protected _userRepo: IUserRepo = Injector.Container.resolve('IUserRepo');

    protected async getUserPerson(userId: string) {
        try {
            const user = await this._userRepo.getById(userId);
            if (!user) {
                Logger.instance().log(`User not found: ${userId}`);
                return null;
            }

            const person = await this._personRepo.getById(user.PersonId);
            if (!person) {
                Logger.instance().log(`Person not found for user: ${userId}`);
                return null;
            }

            return person;
        } catch (error) {
            Logger.instance().log(`Error getting user person: ${error}`);
            return null;
        }
    };

    protected async getUserPhoneNumber(userId: string): Promise<string | null> {
        const person = await this.getUserPerson(userId);
        return person?.Phone ?? null;
    };

    protected async getUserReferenceId(userId: string): Promise<string | null> {
        const person = await this.getUserPerson(userId);
        return person?.UniqueReferenceId ?? null;
    };

    abstract sendMessage(userTask: UserTaskMessageDto, processedTask: ProcessedTaskDto): Promise<boolean>;

}
