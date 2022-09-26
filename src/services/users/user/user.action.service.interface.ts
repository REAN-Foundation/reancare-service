import { uuid } from "../../../domain.types/miscellaneous/system.types";

export interface IUserActionService {

    getAction(actionId: uuid): Promise<any>;

    startAction(actionId: uuid): Promise<boolean>;

    completeAction(actionId: uuid, completionTime?: Date, success?: boolean, actionDetails?: any): Promise<boolean>;

    cancelAction(actionId: uuid, cancellationTime?: Date, cancellationReason?: string): Promise<boolean>;

    updateAction(actionId: uuid, updates: any): Promise<any>;

}
